from typing import List, Dict, Any, Optional
from fastapi import APIRouter, HTTPException
from Backend.schemas import ScootUserData, ClaimData, UserProfileResponse, UserDataInputRequest
from Backend.services.scoot_api import MockScootAPIClient, SCOOT_COUNTRY_CODE_TO_NAME_MAP
from Backend.services.pdf_parser_service import PdfParserService # Import PdfParserService
import random
from datetime import date, timedelta # Import timedelta for date calculations

router = APIRouter()
mock_scoot_api_client = MockScootAPIClient()
pdf_parser_service = PdfParserService() # Instantiate PdfParserService

@router.get("/profile/{nric}", response_model=UserProfileResponse)
async def get_user_profile(nric: str):
    """
    Retrieve a simplified user profile, including a summary of their claims.
    """
    print(f"[UserRouter] Fetching user profile for NRIC: {nric}")
    try:
        user_data: ScootUserData = await mock_scoot_api_client.get_user_data(user_id="mock_user_id", nric=nric)
        
        claims_summary = []
        for claim in user_data.claims_history:
            claims_summary.append({
                "claim_number": claim.claim_number,
                "claim_type": claim.claim_type,
                "status": claim.claim_status,
                "net_paid": claim.net_paid
            })

        response_data = UserProfileResponse(
            user_id=user_data.user_id,
            nric=user_data.nric,
            name=user_data.user_id.replace("mock_user_id", "John Doe"), # Mock name
            destination_country=SCOOT_COUNTRY_CODE_TO_NAME_MAP.get(user_data.destination, user_data.destination), # Convert code to name
            claims_summary=claims_summary
        )
        print(f"[UserRouter] Successfully retrieved profile for NRIC {nric}")
        return response_data
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        print(f"[UserRouter] Error fetching user profile for NRIC {nric}: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")


@router.post("/input_data", response_model=ScootUserData)
async def user_input_data(request: UserDataInputRequest) -> ScootUserData:
    """
    Endpoint to receive user data via different input types (NRIC, PDF upload, Manual Entry).
    Returns a ScootUserData object suitable for further processing.
    """
    print(f"[UserRouter] Received user data input request with type: {request.input_type}")
    
    user_data: Optional[ScootUserData] = None
    user_id_prefix = "user_" # Default prefix for generated user_ids

    if request.input_type == "nric":
        if not request.nric_value:
            raise HTTPException(status_code=400, detail="NRIC value is required for 'nric' input type.")
        try:
            # MockScootAPIClient's get_user_data will handle claims fetching and future dates
            user_data = await mock_scoot_api_client.get_user_data(
                user_id=f"{user_id_prefix}{request.nric_value}", 
                nric=request.nric_value
            )
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))
        except Exception as e:
            print(f"[UserRouter] Error fetching user data by NRIC {request.nric_value}: {e}")
            raise HTTPException(status_code=500, detail="Failed to fetch user data for NRIC.")

    elif request.input_type == "manual_entry":
        if not request.manual_details:
            raise HTTPException(status_code=400, detail="Manual details are required for 'manual_entry' input type.")
        
        # Use provided manual details to construct ScootUserData
        # Note: Claims history will be empty unless we add a way to mock/provide it manually
        user_data = ScootUserData(
            user_id=f"{user_id_prefix}manual_{random.randint(1000, 9999)}",
            nric="", # NRIC not available for manual entry unless explicitly provided
            origin=request.manual_details.origin,
            destination=request.manual_details.destination,
            departure_date=request.manual_details.departure_date,
            return_date=request.manual_details.return_date,
            num_travelers=request.manual_details.num_travelers,
            ages=request.manual_details.ages,
            trip_type=request.manual_details.trip_type,
            flexi_flight=request.manual_details.flexi_flight,
            claims_history=[] # For manual entry, claims would need a separate lookup or input
        )
        print(f"[UserRouter] Constructed ScootUserData from manual entry: {user_data.model_dump()}")

    elif request.input_type == "pdf_upload":
        if not request.pdf_base64:
            raise HTTPException(status_code=400, detail="Base64 encoded PDF content is required for 'pdf_upload' input type.")

        # Use Groq AI to extract structured flight data from PDF
        flight_data = await pdf_parser_service.extract_flight_data_from_pdf_base64(request.pdf_base64)

        if not flight_data:
            raise HTTPException(status_code=422, detail="Failed to extract flight information from PDF. Please ensure the PDF contains flight booking details.")

        print(f"[UserRouter] Extracted flight data from PDF using Groq: {flight_data}")

        # Parse dates from the extracted data
        from datetime import datetime
        try:
            departure_date = datetime.strptime(flight_data.get("departure_date"), "%Y-%m-%d").date()
            return_date_str = flight_data.get("return_date")
            return_date = datetime.strptime(return_date_str, "%Y-%m-%d").date() if return_date_str else None
        except (ValueError, TypeError) as e:
            print(f"[UserRouter] Error parsing dates: {e}. Using default future dates.")
            today = date.today()
            departure_date = today + timedelta(days=30)
            return_date = departure_date + timedelta(days=15)

        # Ensure dates are in the future
        today = date.today()
        if departure_date <= today:
            departure_date = today + timedelta(days=30)
        if return_date and return_date <= departure_date:
            return_date = departure_date + timedelta(days=15)

        # Get passenger information
        passenger_names = flight_data.get("passenger_names", [])
        passenger_ages = flight_data.get("passenger_ages", [30])  # Default to age 30 if not provided
        num_travelers = flight_data.get("num_travelers", len(passenger_names))

        # Ensure ages list matches number of travelers
        if len(passenger_ages) < num_travelers:
            passenger_ages.extend([30] * (num_travelers - len(passenger_ages)))
        elif len(passenger_ages) > num_travelers:
            passenger_ages = passenger_ages[:num_travelers]

        user_data = ScootUserData(
            user_id=f"{user_id_prefix}pdf_{random.randint(1000, 9999)}",
            nric="", # NRIC not typically in flight bookings
            origin=flight_data.get("origin", "UNKNOWN"),
            destination=flight_data.get("destination", "UNKNOWN"),
            departure_date=departure_date,
            return_date=return_date,
            num_travelers=num_travelers,
            ages=passenger_ages,
            trip_type=flight_data.get("trip_type", "round_trip"),
            flexi_flight=flight_data.get("flexi_flight", False),
            claims_history=[]
        )
        print(f"[UserRouter] Constructed ScootUserData from Groq extracted flight data:")
        print(f"  - Origin: {user_data.origin}")
        print(f"  - Destination: {user_data.destination}")
        print(f"  - Departure: {user_data.departure_date}")
        print(f"  - Return: {user_data.return_date}")
        print(f"  - Travelers: {user_data.num_travelers}")
        print(f"  - Passenger Names: {passenger_names}")
        print(f"  - Ages: {user_data.ages}")

    else:
        raise HTTPException(status_code=400, detail=f"Invalid input_type: {request.input_type}")

    if not user_data:
        raise HTTPException(status_code=500, detail="Failed to process user input into ScootUserData.")

    return user_data
