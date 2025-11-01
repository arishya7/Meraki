from typing import List, Dict, Any
from fastapi import APIRouter, HTTPException
from Backend.schemas import ScootUserData, ClaimData, UserProfileResponse
from Backend.services.scoot_api import MockScootAPIClient, SCOOT_COUNTRY_CODE_TO_NAME_MAP

router = APIRouter()
mock_scoot_api_client = MockScootAPIClient()

@router.get("/profile/{nric}", response_model=UserProfileResponse)
async def get_user_profile(nric: str):
    """
    Retrieve a simplified user profile, including a summary of their claims.
    """
    print(f"[UserRouter] Fetching user profile for NRIC: {nric}")
    try:
        user_data: ScootUserData = mock_scoot_api_client.get_user_data(user_id="mock_user_id", nric=nric)
        
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
