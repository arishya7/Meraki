from fastapi import APIRouter, HTTPException, Body
from typing import List, Optional, Dict, Any
from datetime import date
from Backend.schemas import ScootUserData, FlightDetailsUpdate, FlightSummaryResponse
from Backend.services.scoot_api import MockScootAPIClient, SCOOT_COUNTRY_CODE_TO_NAME_MAP

router = APIRouter()
mock_scoot_api_client = MockScootAPIClient()

# In-memory store for mock flight details
# In a real application, this would be a database
_mock_flight_details_store: Dict[str, ScootUserData] = {}

@router.get("/summary/{nric}", response_model=FlightSummaryResponse)
async def get_flight_summary(nric: str):
    """
    Retrieves a summary of flight details for a given NRIC.
    If details are in store, uses those. Otherwise, fetches from MockScootAPIClient.
    """
    print(f"[FlightsRouter] Fetching flight summary for NRIC: {nric}")
    user_data: Optional[ScootUserData] = _mock_flight_details_store.get(nric)

    if not user_data:
        try:
            user_data = await mock_scoot_api_client.get_user_data(user_id=f"user_{nric}", nric=nric)
            print(f"[FlightsRouter] Retrieved initial flight data from MockScootAPIClient for NRIC: {nric}")
        except Exception as e:
            print(f"[FlightsRouter] Error fetching initial flight data for NRIC {nric}: {e}")
            raise HTTPException(status_code=500, detail="Failed to retrieve initial flight details")

    if not user_data:
        raise HTTPException(status_code=404, detail="Flight details not found for this NRIC")

    # Convert country codes to names for the response
    origin_name = SCOOT_COUNTRY_CODE_TO_NAME_MAP.get(user_data.origin, user_data.origin)
    destination_name = SCOOT_COUNTRY_CODE_TO_NAME_MAP.get(user_data.destination, user_data.destination)

    response_data = FlightSummaryResponse(
        nric=user_data.nric,
        origin=origin_name,
        destination=destination_name,
        departure_date=user_data.departure_date,
        return_date=user_data.return_date,
        num_travelers=user_data.num_travelers,
        trip_type=user_data.trip_type,
        flexi_flight=user_data.flexi_flight
    )
    print(f"[FlightsRouter] Successfully retrieved flight summary for NRIC {nric}")
    return response_data


@router.post("/update")
async def update_flight_details(update_data: FlightDetailsUpdate):
    """
    Allows partial updates to flight details for a given NRIC.
    """
    print(f"[FlightsRouter] Attempting to update flight details for NRIC: {update_data.nric}")
    existing_data: Optional[ScootUserData] = _mock_flight_details_store.get(update_data.nric)

    if not existing_data:
        # If no existing data in store, fetch from mock client first
        try:
            existing_data = await mock_scoot_api_client.get_user_data(user_id=f"user_{update_data.nric}", nric=update_data.nric)
        except Exception as e:
            print(f"[FlightsRouter] Error fetching existing flight data for NRIC {update_data.nric}: {e}")
            raise HTTPException(status_code=500, detail="Failed to retrieve existing flight details for update")
        
        if not existing_data:
            raise HTTPException(status_code=404, detail="Flight details not found for this NRIC to update")

    # Apply updates from FlightDetailsUpdate (which allows partial updates)
    updated_fields = update_data.dict(exclude_unset=True)
    
    for field, value in updated_fields.items():
        if field == "destination":
            # Convert destination name back to code if needed for internal storage, or ensure it's a valid code
            # For now, assuming the API expects country codes internally but returns names
            # This might need a reverse map (name to code) if `update_data.destination` is a name.
            # For simplicity, if input is a name, we'll try to find its code or keep as is if it's already a code.
            # A robust solution would involve a `country_name_to_code_map`.
            if value and value not in SCOOT_COUNTRY_CODE_TO_NAME_MAP:
                # Attempt to find the code if a name was provided, otherwise assume it's already a code
                # This is a simplified approach, a reverse map would be more robust.
                found_code = next((code for code, name in SCOOT_COUNTRY_CODE_TO_NAME_MAP.items() if name == value), value)
                setattr(existing_data, field, found_code)
            else:
                setattr(existing_data, field, value)
        else:
            setattr(existing_data, field, value)

    _mock_flight_details_store[update_data.nric] = existing_data
    print(f"[FlightsRouter] Successfully updated flight details for NRIC {update_data.nric}")
    return {"message": "Flight details updated successfully!"}
