from pydantic import BaseModel, Field
from datetime import date
from typing import List, Optional, Dict, Any, Literal

class ClaimData(BaseModel):
    claim_number: str
    product_category: str
    product_name: str
    claim_status: str
    accident_date: date
    report_date: date
    closed_date: Optional[date] = None
    destination: str
    claim_type: str
    cause_of_loss: str
    loss_type: str
    gross_incurred: float
    gross_paid: float
    gross_reserve: float
    net_incurred: float
    net_paid: float
    net_reserve: float

class ScootUserData(BaseModel):
    user_id: str
    nric: str = Field(..., description="NRIC of the user for claims linkage")
    origin: str
    destination: str
    departure_date: date
    return_date: date
    num_travelers: int
    ages: List[int]
    trip_type: str
    flexi_flight: bool
    claims_history: Optional[List[ClaimData]] = []

class Recommendation(BaseModel):
    id: str
    plan_name: str
    description: str
    price: float
    currency: str
    pros: List[str]
    cons: List[str]
    citations: List[str]
    score: float = 0.0 # Added score field

class ChatbotResponse(BaseModel):
    message: str
    recommendations: List[Recommendation]

class PolicyQueryRequest(BaseModel):
    query: str
    policy_name: str

class PolicyQueryResponse(BaseModel):
    answer: str
    citations: List[str]

class UserProfileResponse(BaseModel):
    user_id: str
    nric: str
    name: str
    destination_country: str
    claims_summary: List[Dict[str, Any]]


class FlightDetailsUpdate(BaseModel):
    nric: str
    origin: Optional[str] = None
    destination: Optional[str] = None
    departure_date: Optional[date] = None
    return_date: Optional[date] = None
    num_travelers: Optional[int] = None
    ages: Optional[List[int]] = None
    trip_type: Optional[str] = None
    flexi_flight: Optional[bool] = None

# New schemas for user input flexibility
class ManualInputDetails(BaseModel):
    origin: str
    destination: str
    departure_date: date
    return_date: date
    num_travelers: int = 1
    ages: List[int] = Field(default_factory=lambda: [30]) # Default to one adult
    trip_type: str = "round_trip" # "round_trip" or "one_way"
    flexi_flight: bool = False

class UserDataInputRequest(BaseModel):
    input_type: Literal["nric", "pdf_upload", "manual_entry"]
    nric_value: Optional[str] = None
    pdf_base64: Optional[str] = None # Base64 encoded PDF content
    manual_details: Optional[ManualInputDetails] = None


# Ancileo API Schemas

class AncileoQuoteContext(BaseModel):
    tripType: str
    departureDate: date
    returnDate: Optional[date] = None # Optional for single trip
    departureCountry: str
    arrivalCountry: str
    adultsCount: int
    childrenCount: int

class AncileoQuoteRequest(BaseModel):
    market: str
    languageCode: str
    channel: str
    deviceType: str
    context: AncileoQuoteContext


class AncileoOfferCategory(BaseModel):
    productType: str  # ← productType belongs here
    offers: List[Dict[str, Any]] # Offers will be raw dictionaries for now


class AncileoQuoteResponse(BaseModel):
    id: str
    languageCode: Optional[str] = None
    offerCategories: List[AncileoOfferCategory]


class FlightSummaryResponse(BaseModel):
    nric: str
    origin: str
    destination: str
    departure_date: date
    return_date: Optional[date]
    num_travelers: int
    trip_type: str
    flexi_flight: bool
