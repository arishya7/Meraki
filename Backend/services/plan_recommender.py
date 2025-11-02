from typing import List, Optional, Dict, Any
from ..schemas import ScootUserData, Recommendation
from .scoot_api import MockScootAPIClient
from .ancileo_api import AncileoAPIClient
from ..services.policy_intelligence.api import PolicyExtractor, POLICY_CACHE # Assuming POLICY_CACHE is populated
import json # Import json for parsing description string
import httpx
import json
from datetime import date, timedelta

from Backend.schemas import AncileoQuoteResponse, Recommendation, ScootUserData, PolicyQueryRequest, PolicyQueryResponse
from Backend.services.ancileo_api import AncileoAPIClient
from Backend.services.scoot_api import MockScootAPIClient

POLICY_INTELLIGENCE_API_URL = "http://localhost:8000/policy"


def process_ancileo_response(raw_response: Dict[str, Any]) -> List[Dict[str, Any]]:
    """
    Process the Ancileo API response and extract offers.
    """
    processed_offers = []
    
    try:
        # Navigate through the nested structure
        offer_categories = raw_response.get('offerCategories', [])
        
        for category in offer_categories:
            # Ensure we only process 'travel-insurance' product types if specified, or all if not
            # For now, we only care about 'travel-insurance'
            if category.get('productType') == 'travel-insurance':
                offers = category.get('offers', [])
                
                for offer in offers:
                    try:
                        # Parse the description JSON string
                        description_str = offer.get('productInformation', {}).get('description', '{}')
                        description_data = json.loads(description_str)
                        
                        # Extract relevant information
                        processed_offer = {
                            'id': offer.get('id'),
                            'productCode': offer.get('productCode'),
                            'unitPrice': offer.get('unitPrice'),
                            'currency': offer.get('currency'),
                            'coverDates': offer.get('coverDates', {}),
                            'priceBreakdown': offer.get('priceBreakdown', {}),
                            'productInformation': {
                                'title': offer.get('productInformation', {}).get('title'),
                                'heading': description_data.get('heading'),
                                'subheading': description_data.get('subheading'),
                                'benefits': description_data.get('benefits', {}),
                                'insuranceProvider': description_data.get('insuranceProvider'),
                                'tableofBenefitsPdfUrl': description_data.get('tableofBenefitsPdfUrl')
                            },
                            'tcsUrl': offer.get('tcsUrl'),
                            'datasheetUrl': offer.get('datasheetUrl'),
                            'productType': category.get('productType'), # Add productType from category
                            'totalPrice': offer.get('priceBreakdown', {}).get('priceInc') # Extract totalPrice from priceBreakdown
                        }
                        
                        processed_offers.append(processed_offer)
                        
                    except json.JSONDecodeError as e:
                        print(f"[ERROR] Failed to parse description JSON for offer {offer.get('id')}: {e}")
                        continue
                    except Exception as e:
                        print(f"[ERROR] Failed to process offer {offer.get('id')}: {e}")
                        continue
        
        return processed_offers
        
    except Exception as e:
        print(f"[ERROR] Failed to process Ancileo response: {e}")
        raise


class PlanRecommender:
    """Recommends insurance plans based on user data and available policies."""

    def __init__(self):
        self.scoot_client = MockScootAPIClient()
        self.ancileo_client = AncileoAPIClient()
        self.policy_extractor_client = httpx.AsyncClient(base_url=POLICY_INTELLIGENCE_API_URL)

    async def _query_policy_intelligence(self, query: str, policy_name: str) -> PolicyQueryResponse:
        """
        Queries the policy intelligence service for specific information about a policy.
        """
        request_data = PolicyQueryRequest(query=query, policy_name=policy_name)
        try:
            response = await self.policy_extractor_client.post("/query_policy", json=request_data.dict())
            response.raise_for_status()
            return PolicyQueryResponse(**response.json())
        except httpx.HTTPStatusError as e:
            print(f"[PolicyExtractorClient] HTTP error querying policy intelligence: {e}")
            return PolicyQueryResponse(answer=f"Could not retrieve policy details for query: {query}", citations=[])
        except httpx.RequestError as e:
            print(f"[PolicyExtractorClient] Request error querying policy intelligence: {e}")
            return PolicyQueryResponse(answer=f"Could not connect to policy intelligence service for query: {query}", citations=[])
        except Exception as e:
            print(f"[PolicyExtractorClient] An unexpected error occurred querying policy intelligence: {e}")
            return PolicyQueryResponse(answer=f"An unexpected error occurred for query: {query}", citations=[])

    async def get_recommended_plans(self, user_data: ScootUserData) -> List[Recommendation]:
        """Fetches user data, gets quotes, and recommends top insurance plans."""
        print(f"[PlanRecommender] Getting recommendations for user: {user_data.user_id}")
        print(f"[PlanRecommender] Scoot user data: {user_data.model_dump()}")

        # Force departure and return dates to be in the future, overriding any input
        today = date.today()
        # Set default dates to start of next year
        future_departure_date = date(today.year + 1, 1, 1)
        future_return_date = date(today.year + 1, 1, 10) # 10 days after departure

        # Adjust if these dates are still in the past due to current month/day
        if future_departure_date <= today:
            future_departure_date = today + timedelta(days=30)
        if future_return_date <= future_departure_date:
            future_return_date = future_departure_date + timedelta(days=15)

        # Update the user_data object with the forced future dates
        user_data.departure_date = future_departure_date
        user_data.return_date = future_return_date
        
        print(f"[PlanRecommender] Overriding dates in Scoot user data to future dates: departure_date={user_data.departure_date}, return_date={user_data.return_date}")

        # 1. Get quotes from Ancileo API
        # The AncileoAPIClient now handles converting country names to codes.
        # raw_ancileo_response = await self.ancileo_client.get_quotes(user_data)
        raw_ancileo_response = None

        if not raw_ancileo_response:
            print("[PlanRecommender] No raw response received from Ancileo API. Using fallback mock data.")
            return self._get_fallback_recommendations(user_data)

        processed_offers = process_ancileo_response(raw_ancileo_response)

        if not processed_offers:
            print("[PlanRecommender] No processed offers after parsing Ancileo API response. Using fallback mock data.")
            return self._get_fallback_recommendations(user_data)

        print(f"[PlanRecommender] Successfully processed {len(processed_offers)} offers.")

        recommendations: List[Recommendation] = []

        # For now, we'll process all offers, but in future, we can implement smarter sorting/filtering
        # to select top N plans based on user data and policy details.
        for offer_data in processed_offers:
            product_code = offer_data.get('productCode')
            policy_name = self._map_product_code_to_policy_name(product_code)
            
            # Extract details from Ancileo response
            product_info = offer_data.get('productInformation', {})
            title = product_info.get('title', 'Unknown Plan')
            heading = product_info.get('heading', '')
            subheading = product_info.get('subheading', '')
            description_text_from_ancileo = f"{heading} - {subheading}" if heading or subheading else f"A plan from {product_code}."
            
            benefits_list_from_ancileo = product_info.get('benefits', {}).get('benefitList', [])
            
            total_price = offer_data.get('totalPrice')
            currency = offer_data.get('currency')

            pros = []
            cons = []
            citations = []

            # Enhance pros and collect citations using policy intelligence
            plan_score = 0.0 # Initialize score for the current plan
            
            # --- Claims-based scoring logic ---
            for claim in user_data.claims_history:
                # Check if plan's benefits address past claim types
                for benefit_item in benefits_list_from_ancileo:
                    benefit_title = benefit_item.get('title', '').lower()
                    claim_type_lower = claim.claim_type.lower()
                    loss_type_lower = claim.loss_type.lower()

                    if claim_type_lower in benefit_title or loss_type_lower in benefit_title:
                        plan_score += 5 # Base score for matching a claim type
                        # Add more score based on claim severity (e.g., net_paid amount)
                        if claim.net_paid > 0:
                            plan_score += min(claim.net_paid / 100, 50) # Max 50 points for high paid claims
                        pros.append(f"**Relevant to your past claim ({claim.claim_type}):** {benefit_item.get('title')}")
                        
            # --- Existing benefit extraction and policy intelligence query ---
            for benefit_item in benefits_list_from_ancileo:
                benefit_title = benefit_item.get('title')
                if benefit_title and policy_name:
                    # Corrected f-string for query
                    query = f"""What is "{benefit_title}" in the "{policy_name}" policy?"""
                    policy_details = await self._query_policy_intelligence(query, policy_name)
                    if policy_details.answer and "Could not" not in policy_details.answer and "An unexpected error occurred" not in policy_details.answer:
                        # Only add if not already added by claims-based scoring
                        if f"**Relevant to your past claim ({{claim.claim_type}}):** {benefit_item.get('title')}" not in pros:
                             pros.append(f"{benefit_title}: {policy_details.answer}")
                        citations.extend(policy_details.citations)
                    else:
                        # Only add if not already added by claims-based scoring
                        if f"**Relevant to your past claim ({{claim.claim_type}}):** {benefit_item.get('title')}" not in pros:
                            pros.append(benefit_title) # Fallback to just the title if query fails

            # Add a generic con if no specific cons are derived (or if no policy intelligence found)
            if not pros and not cons:
                cons.append("Details for this plan are limited or could not be fully retrieved from policy documents.")

            recommendation = Recommendation(
                id=offer_data.get('id'),
                plan_name=title,
                description=description_text_from_ancileo,
                price=total_price if total_price is not None else 0.0,
                currency=currency,
                pros=pros,
                cons=cons,
                citations=citations,
                score=plan_score # Assign the calculated score
            )
            recommendations.append(recommendation)

        # Sort recommendations by score (descending) then by price (ascending)
        recommendations.sort(key=lambda x: (-x.score, x.price))
        return recommendations[:3]

    def _get_fallback_recommendations(self, user_data: ScootUserData) -> List[Recommendation]:
        """Returns a list of mock recommendations when the Ancileo API fails."""
        destination_country = user_data.destination.replace("_", " ").title()

        recommendations = [
            Recommendation(
                id="mock-1",
                plan_name="Traveler's Basic",
                description=f"Essential coverage for your trip to {destination_country}. A great starting point for any traveler.",
                price=45.50,
                currency="SGD",
                pros=[
                    "Covers major medical emergencies.",
                    "Includes coverage for baggage loss or delay.",
                    "24/7 emergency assistance."
                ],
                cons=[
                    "Limited coverage for trip cancellations.",
                    "Does not cover extreme sports.",
                    "Lower coverage limits compared to other plans."
                ],
                citations=[],
                score=75,
                is_best_plan=False
            ),
            Recommendation(
                id="mock-2",
                plan_name="Explorer's Choice",
                description=f"Our most popular plan for trips to {destination_country}, offering a balance of coverage and value.",
                price=85.00,
                currency="SGD",
                pros=[
                    "Comprehensive medical and dental coverage.",
                    "Trip cancellation and interruption coverage.",
                    "Coverage for a wider range of activities.",
                    f"Includes specific benefits for travel to {destination_country}."
                ],
                cons=[
                    "Higher premium than basic plans.",
                    "Some exclusions for pre-existing conditions."
                ],
                citations=[],
                score=95,
                is_best_plan=True
            ),
            Recommendation(
                id="mock-3",
                plan_name="Adventurer's Pro",
                description=f"Maximum protection for your adventure in {destination_country}, including coverage for high-risk activities.",
                price=125.00,
                currency="SGD",
                pros=[
                    "Highest coverage limits for medical, baggage, and cancellation.",
                    "Includes coverage for adventure sports like skiing and diving.",
                    "Cancel for any reason (CFAR) option available."
                ],
                cons=[
                    "Most expensive option.",
                    "CFAR option has specific conditions and limitations."
                ],
                citations=[],
                score=90,
                is_best_plan=False
            )
        ]

        # Add a justification for the best plan
        for rec in recommendations:
            if rec.is_best_plan:
                rec.pros.insert(0, f"Justification: This plan is our top recommendation because it offers the most comprehensive coverage for your trip to {destination_country} at a competitive price. It includes full medical, baggage, and cancellation protection, ensuring you're well-covered for the most common travel mishaps.")

        return recommendations


    def _map_product_code_to_policy_name(self, product_code: str) -> str:
        """Helper to map Ancileo product codes to our internal policy names.
        This is a placeholder and would need robust implementation.
        """
        if product_code and "SCOOT" in product_code.upper():
            return "TravelEasy Pre-Ex Policy QTD032212-PX.pdf" # Assuming this is the relevant policy document
        # Add more sophisticated mapping logic here if other policies are introduced
        return "TravelEasy Pre-Ex Policy QTD032212-PX.pdf" # Default to this policy for now if no specific match
