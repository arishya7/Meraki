import os
import httpx
from datetime import date
from typing import Dict, Any, Optional, List
# from pydantic import BaseModel # BaseModel no longer needed directly here

from ..schemas import ScootUserData, AncileoQuoteRequest, AncileoQuoteContext, AncileoQuoteResponse # AncileoOffer, AncileoOfferCategory, PriceBreakdown, ProductInformation removed
from Backend.services.scoot_api import SCOOT_COUNTRY_CODE_TO_NAME_MAP # Import the country code to name map

# CombinedOfferData removed as raw response will be returned

class AncileoAPIClient:
    """Client for interacting with the Ancileo Travel Insurance API.
    Requires ANCILEO_API_KEY environment variable to be set.
    """
    BASE_URL = "https://dev.api.ancileo.com/v1/travel/front"

    def __init__(self):
        self.api_key = os.getenv("ANCILEO_API_KEY")
        if not self.api_key:
            raise ValueError("ANCILEO_API_KEY environment variable not set.")
        self.api_key = self.api_key.strip() # Ensure no leading/trailing whitespace
        self.client = httpx.AsyncClient()

        # Create a reverse map for country names to codes for Ancileo API
        self.country_name_to_code_map = {name: code for code, name in SCOOT_COUNTRY_CODE_TO_NAME_MAP.items()}

    async def get_quotes(self, user_data: ScootUserData) -> Optional[Dict[str, Any]]: # Changed return type
        """Retrieves insurance quotes from the Ancileo API based on user data."""
        endpoint = f"{self.BASE_URL}/pricing"

        # Convert origin and destination from names back to ISO codes for Ancileo API
        departure_country_code = self.country_name_to_code_map.get(user_data.origin, user_data.origin)
        arrival_country_code = self.country_name_to_code_map.get(user_data.destination, user_data.destination)

        # Log the conversion for debugging
        print(f"[AncileoAPIClient] Converting origin '{user_data.origin}' to code '{departure_country_code}'")
        print(f"[AncileoAPIClient] Converting destination '{user_data.destination}' to code '{arrival_country_code}'")

        context = AncileoQuoteContext(
            tripType="RT" if user_data.trip_type == "round_trip" else "ST",
            departureDate=user_data.departure_date,
            returnDate=user_data.return_date if user_data.trip_type == "round_trip" else None,
            departureCountry=departure_country_code, # Use converted code
            arrivalCountry=arrival_country_code, # Use converted code
            adultsCount=len([age for age in user_data.ages if age >= 18]),
            childrenCount=len([age for age in user_data.ages if age < 18])
        )

        request_data = AncileoQuoteRequest(
            market="SG", # Assuming Singapore market for now
            languageCode="en",
            channel="white-label",
            deviceType="DESKTOP",
            context=context
        )

        headers = {
            "Content-Type": "application/json",
            "x-api-key": self.api_key
        }

        print(f"[AncileoAPIClient] Requesting quotes from {endpoint}")
        print(f"[AncileoAPIClient] Request data: {request_data.json()}")

        try:
            response = await self.client.post(endpoint, headers=headers, content=request_data.json())
            response.raise_for_status() # Raise an exception for HTTP errors (4xx or 5xx)
            response_data = response.json()
            print(f"[AncileoAPIClient] Raw response (Success): {response_data}")
            
            return response_data # Return raw response

        except httpx.HTTPStatusError as e:
            status_code = e.response.status_code
            response_text = e.response.text
            print(f"[AncileoAPIClient] HTTPStatusError: Status Code: {status_code}, Response: {response_text}")
            if status_code == 404:
                print("[AncileoAPIClient] Received 404 from Ancileo API. This might indicate an invalid endpoint or no matching quotes.")
            return None
        except httpx.RequestError as e:
            print(f"[AncileoAPIClient] RequestError: {e}")
            return None
        except Exception as e:
            print(f"[AncileoAPIClient] An unexpected error occurred: {e}")
            return None
