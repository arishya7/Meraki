from datetime import date, timedelta
from typing import List, Dict, Any, Optional
from Backend.schemas import ScootUserData, ClaimData
from Backend.services.claims_db_client import ClaimsDBClient # Import ClaimsDBClient
import pandas as pd
import os
import random # Import the random module

# Static mock user tracking events data based on the provided SQL inserts
# In a real application, this would come from a database or event stream.
_MOCK_USER_TRACKING_EVENTS: List[Dict[str, Any]] = [
    {
        "event_id": "EVT-2024-11-101",
        "user_nric": "S8234567D",
        "event_type": "travel_booking",
        "event_name": "flight_booked",
        "event_properties": {
            "booking_reference": "SQ7XYZ",
            "airline": "Singapore Airlines",
            "flight_numbers": ["SQ634", "SQ637"],
            "origin": "SIN",
            "destination": "NRT",
            "departure_date": "2024-12-25",
            "departure_time": "08:00",
            "return_date": "2025-01-05",
            "return_time": "21:30",
            "passengers": [{"name": "Tan Wei Ming", "seat": "34A"}, {"name": "Tan Mei Ling", "seat": "34B"}],
            "cabin_class": "economy",
            "total_price": 2450.00,
            "currency": "SGD",
            "baggage_allowance": "30kg",
            "booking_status": "confirmed"
        }
    },
    {
        "event_id": "EVT-2024-11-102",
        "user_nric": "S9123456H",
        "event_type": "travel_booking",
        "event_name": "flight_booked",
        "event_properties": {
            "booking_reference": "QR4ABC",
            "airline": "Qatar Airways",
            "flight_numbers": ["QR944", "QR945"],
            "origin": "SIN",
            "destination": "CDG",
            "departure_date": "2025-01-09",
            "departure_time": "23:45",
            "return_date": "2025-01-18",
            "return_time": "18:30",
            "passengers": [{"name": "Siti Nurhaliza Binte Ahmad", "seat": "12A"}],
            "cabin_class": "business",
            "total_price": 8900.00,
            "currency": "SGD",
            "baggage_allowance": "40kg",
            "lounge_access": True,
            "booking_status": "confirmed"
        }
    },
    {
        "event_id": "EVT-2025-01-103",
        "user_nric": "S8567891C",
        "event_type": "travel_booking",
        "event_name": "flight_booked",
        "event_properties": {
            "booking_reference": "EXP789GHI",
            "airline": "United Airlines",
            "flight_numbers": ["UA1"],
            "origin": "SIN",
            "destination": "EWR",
            "departure_date": "2025-01-19",
            "departure_time": "10:25",
            "return_date": "2025-01-26",
            "return_time": "23:59",
            "passengers": [{"name": "Muhammad Hafiz Bin Abdullah", "seat": "45F"}],
            "cabin_class": "economy",
            "total_price": 1850.00,
            "currency": "SGD",
            "baggage_allowance": "23kg",
            "wifi_purchased": True,
            "seat_selection_fee": 45.00,
            "booking_status": "confirmed"
        }
    },
    {
        "event_id": "EVT-2024-11-104",
        "user_nric": "S7654321E",
        "event_type": "travel_booking",
        "event_name": "flight_booked",
        "event_properties": {
            "booking_reference": "5J8MNL",
            "airline": "Cebu Pacific",
            "flight_numbers": ["5J685", "5J686"],
            "origin": "SIN",
            "destination": "MNL",
            "departure_date": "2024-11-15",
            "departure_time": "06:30",
            "return_date": "2024-11-22",
            "return_time": "10:15",
            "passengers": [{"name": "David Tan Wei Jie", "seat": "18C"}],
            "cabin_class": "economy",
            "total_price": 420.00,
            "currency": "SGD",
            "baggage_allowance": "20kg",
            "booking_status": "confirmed"
        }
    }
]

# Helper dictionary to quickly look up event data by NRIC
_MOCK_EVENTS_BY_NRIC: Dict[str, Dict[str, Any]] = {
    event["user_nric"]: event for event in _MOCK_USER_TRACKING_EVENTS
}

# Load valid destination country codes from Excel
SCOOT_DESTINATION_LIST_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "Hackathon_Documentation", "Scoot_SG_destination_list.xlsx"))
try:
    df_destinations = pd.read_excel(SCOOT_DESTINATION_LIST_PATH)
    VALID_SCOOT_COUNTRY_CODES = df_destinations["Country Code"].tolist()
    SCOOT_COUNTRY_CODE_TO_NAME_MAP = df_destinations.set_index("Country Code")["Country"].to_dict()
except FileNotFoundError:
    print(f"[ERROR] Scoot destination list not found at {SCOOT_DESTINATION_LIST_PATH}. Using a fallback list.")
    VALID_SCOOT_COUNTRY_CODES = ["SG", "TH", "JP", "CN", "AU", "US", "FR", "MY", "KR", "TW", "VN", "HK", "ID", "IL", "LA", "MO", "PH", "SA", "ES", "GB", "DE", "IT"]
    SCOOT_COUNTRY_CODE_TO_NAME_MAP = {
        "SG": "Singapore",
        "TH": "Thailand",
        "JP": "Japan",
        "CN": "China",
        "AU": "Australia",
        "US": "United States",
        "FR": "France",
        "MY": "Malaysia",
        "KR": "South Korea",
        "TW": "Taiwan",
        "VN": "Vietnam",
        "HK": "Hong Kong",
        "ID": "Indonesia",
        "IL": "Israel",
        "LA": "Laos",
        "MO": "Macau",
        "PH": "Philippines",
        "SA": "Saudi Arabia",
        "ES": "Spain",
        "GB": "United Kingdom",
        "DE": "Germany",
        "IT": "Italy"
    }
except Exception as e:
    print(f"[ERROR] Failed to load Scoot destination list: {e}. Using a fallback list.")
    VALID_SCOOT_COUNTRY_CODES = ["SG", "TH", "JP", "CN", "AU", "US", "FR", "MY", "KR", "TW", "VN", "HK", "ID", "IL", "LA", "MO", "PH", "SA", "ES", "GB", "DE", "IT"]
    SCOOT_COUNTRY_CODE_TO_NAME_MAP = {
        "SG": "Singapore",
        "TH": "Thailand",
        "JP": "Japan",
        "CN": "China",
        "AU": "Australia",
        "US": "United States",
        "FR": "France",
        "MY": "Malaysia",
        "KR": "South Korea",
        "TW": "Taiwan",
        "VN": "Vietnam",
        "HK": "Hong Kong",
        "ID": "Indonesia",
        "IL": "Israel",
        "LA": "Laos",
        "MO": "Macau",
        "PH": "Philippines",
        "SA": "Saudi Arabia",
        "ES": "Spain",
        "GB": "United Kingdom",
        "DE": "Germany",
        "IT": "Italy"
    }

# Simple mapping for common IATA airport codes to ISO country codes for mock events
AIRPORT_TO_COUNTRY_CODE_MAP = {
    "SIN": "SG", # Singapore Changi
    "NRT": "JP", # Tokyo Narita
    "CDG": "FR", # Paris Charles de Gaulle
    "EWR": "US", # Newark Liberty (New York area)
    "MNL": "PH", # Manila Ninoy Aquino
    "KUL": "MY"  # Kuala Lumpur
}

class MockScootAPIClient:
    claims_db_client: ClaimsDBClient = None # Class variable to hold the client instance
    _all_claims_cache: List[ClaimData] = [] # Cache for all claims

    def __init__(self):
        if MockScootAPIClient.claims_db_client is None:
            MockScootAPIClient.claims_db_client = ClaimsDBClient()
        self.claims_db_client = MockScootAPIClient.claims_db_client

    async def _load_all_claims_cache(self):
        if not MockScootAPIClient._all_claims_cache:
            MockScootAPIClient._all_claims_cache = await self.claims_db_client.get_all_claims()
            print(f"[MockScootAPIClient] Loaded {len(MockScootAPIClient._all_claims_cache)} claims into cache.")

    async def get_user_data(self, 
                      user_id: str,
                      nric: str = "", # NRIC is now mandatory to fetch event data
                      origin: str = "", 
                      destination: str = "", 
                      departure_date: Optional[date] = None, 
                      return_date: Optional[date] = None, 
                      num_travelers: int = 0, 
                      ages: List[int] = [],
                      trip_type: str = "",
                      flexi_flight: bool = False) -> ScootUserData:
        """
        Mocks fetching user data from the Scoot app, now leveraging detailed event data
        and ensuring valid ISO country codes for origin/destination.
        """
        today = date.today()
        default_departure_date = today + timedelta(days=30) # Default to 30 days in future
        default_return_date = today + timedelta(days=45)    # Default to 45 days in future

        if not nric:
            print("[MockScootAPIClient] Error: NRIC not provided to get_user_data.")
            raise ValueError("NRIC must be provided to fetch user data from mock events.")

        event_data = _MOCK_EVENTS_BY_NRIC.get(nric)
        print(f"[MockScootAPIClient] Event data lookup for NRIC {nric}: {event_data is not None}")

        # Load all claims into cache if not already loaded
        await self._load_all_claims_cache()
        all_claims = MockScootAPIClient._all_claims_cache

        # Randomly assign a subset of claims to the user
        claims_history: List[ClaimData] = []
        if all_claims:
            # Assign 0 to 2 random claims to simulate varying claims history
            num_random_claims = random.randint(0, min(len(all_claims), 2)) 
            claims_history = random.sample(all_claims, num_random_claims)
        print(f"[MockScootAPIClient] Randomly assigned {len(claims_history)} claims to NRIC {nric}.")

        if not event_data or event_data["event_name"] != "flight_booked":
            print(f"[MockScootAPIClient] No flight booking event found for NRIC: {nric}. Returning default mock data.")
            # Fallback to a default ScootUserData if no specific event is found
            return ScootUserData(
                user_id=user_id, 
                nric=nric,
                origin="SG", 
                destination=VALID_SCOOT_COUNTRY_CODES[0] if VALID_SCOOT_COUNTRY_CODES else "TH", # Use a valid default
                departure_date=default_departure_date, 
                return_date=default_return_date, 
                num_travelers=1, 
                ages=[30],
                trip_type="round_trip",
                flexi_flight=False,
                claims_history=claims_history # Now uses randomly assigned claims
            )

        properties = event_data["event_properties"]
        print(f"[MockScootAPIClient] Processing event properties for NRIC {nric}: {properties}")

        # Extracting data from event_properties and mapping to ISO country codes
        raw_origin = properties.get("origin", origin) # Use event data, fallback to parameter
        raw_destination = properties.get("destination", destination)

        derived_origin = AIRPORT_TO_COUNTRY_CODE_MAP.get(raw_origin, raw_origin) if raw_origin else "SG"
        if derived_origin not in VALID_SCOOT_COUNTRY_CODES: # Ensure valid origin
            derived_origin = "SG"

        derived_destination = AIRPORT_TO_COUNTRY_CODE_MAP.get(raw_destination, raw_destination) if raw_destination else VALID_SCOOT_COUNTRY_CODES[0]
        if derived_destination not in VALID_SCOOT_COUNTRY_CODES: # Ensure valid destination
            derived_destination = VALID_SCOOT_COUNTRY_CODES[0]

        # Force departure and return dates to be in the future, overriding any input or event data
        # Use current year + 1 to ensure future dates for mock data consistency
        current_year = date.today().year
        dynamic_departure_date = date(current_year + 1, 1, 1) # Start of next year
        dynamic_return_date = date(current_year + 1, 1, 10)  # 10 days later

        # Adjust if these dates are still in the past due to current month/day
        if dynamic_departure_date <= date.today():
            dynamic_departure_date = date.today() + timedelta(days=30)
        if dynamic_return_date <= dynamic_departure_date:
            dynamic_return_date = dynamic_departure_date + timedelta(days=15) # Ensure at least 15 days difference

        derived_departure_date = dynamic_departure_date
        derived_return_date = dynamic_return_date

        derived_num_travelers = len(properties.get("passengers", []))
        derived_ages = [30] * derived_num_travelers # Mock ages for now, as not in event data
        
        derived_trip_type = "round_trip" if properties.get("return_date") else "one_way"
        derived_flexi_flight = properties.get("flexi_flight", False) # Try to get from properties, default to False

        final_user_data = ScootUserData(
            user_id=user_id, 
            nric=nric,
            origin=derived_origin,
            destination=derived_destination,
            departure_date=derived_departure_date,
            return_date=derived_return_date,
            num_travelers=derived_num_travelers,
            ages=derived_ages,
            trip_type=derived_trip_type,
            flexi_flight=derived_flexi_flight,
            claims_history=claims_history # Now uses randomly assigned claims
        )
        print(f"[MockScootAPIClient] Constructed ScootUserData for NRIC {nric}: {final_user_data.model_dump()}")
        return final_user_data
