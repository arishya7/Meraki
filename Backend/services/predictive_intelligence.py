"""
Predictive Intelligence Service for Personalized Travel Tips

This service analyzes a user's past claims history and upcoming travel destination
to provide personalized, caring advice and recommendations.
"""

from typing import List, Dict, Any, Optional
from Backend.schemas import ClaimData, ScootUserData
from datetime import datetime
import random


class PredictiveIntelligenceService:
    """
    Provides personalized travel insights based on past claims and destination.
    """

    # Health advisories by destination (simplified - in production, fetch from real APIs)
    HEALTH_ADVISORIES = {
        "JP": ["influenza outbreak", "respiratory infections common in winter"],
        "TH": ["dengue fever risk", "food poisoning from street food"],
        "VN": ["dengue fever risk", "traveler's diarrhea common"],
        "MY": ["dengue fever risk", "air pollution in major cities"],
        "ID": ["dengue fever risk", "volcano activity warnings"],
        "IN": ["food and waterborne diseases", "air quality concerns"],
        "AU": ["strong UV radiation", "marine stingers in summer"],
        "KR": ["air pollution", "respiratory issues in winter"],
        "CN": ["air quality issues", "food safety concerns"],
        "FR": ["pickpocketing common", "strikes and protests"],
        "IT": ["pickpocketing common", "heat waves in summer"],
        "ES": ["heat waves", "pickpocketing in tourist areas"],
        "GB": ["unpredictable weather", "cold and flu season"],
        "DE": ["cold weather", "respiratory infections"],
    }

    # Claim type to health risk mapping
    CLAIM_TO_RISK_MAPPING = {
        "medical": {
            "keywords": ["flu", "fever", "dengue", "food poisoning", "diarrhea", "infection", "illness"],
            "tip_templates": [
                "Remember how tough it was dealing with {cause} in {destination}? {health_advisory} Please pack extra medication and stay hydrated!",
                "I noticed you had a medical claim for {cause} before. Since you're heading to {new_destination}, {health_advisory} Take care of yourself! 💙",
                "Your past {cause} experience taught us both something! {health_advisory} Maybe pack some preventive medicine this time? 😊"
            ]
        },
        "accident": {
            "keywords": ["injury", "fall", "accident", "fracture", "sprain"],
            "tip_templates": [
                "I see you had an accident before involving {cause}. Please be extra careful during activities in {new_destination}! Consider travel insurance with comprehensive accident coverage.",
                "Since you had that {cause} incident, I'd recommend being cautious with adventure activities. Stay safe! 🛡️"
            ]
        },
        "baggage": {
            "keywords": ["lost", "delayed", "stolen", "damage"],
            "tip_templates": [
                "Remember when your baggage was {cause}? For this trip to {new_destination}, consider using AirTags or similar trackers. Also, pack essentials in your carry-on!",
                "I know losing luggage is stressful! This time, maybe keep a change of clothes and medications in your carry-on? Just a friendly reminder! 🧳"
            ]
        },
        "trip_cancellation": {
            "keywords": ["cancel", "postpone", "delay"],
            "tip_templates": [
                "I noticed you had to cancel a trip before. Make sure you have flexible booking options for {new_destination} and comprehensive trip cancellation coverage!",
                "Given your past experience with trip cancellation, I'd recommend booking refundable tickets when possible. Better safe than sorry! ✈️"
            ]
        }
    }

    def __init__(self):
        pass

    def generate_personalized_tips(
        self,
        user_data: ScootUserData,
        include_emoji: bool = True
    ) -> List[Dict[str, Any]]:
        """
        Generate personalized travel tips based on past claims and destination.

        Args:
            user_data: User's travel and claims data
            include_emoji: Whether to include emojis in tips

        Returns:
            List of tip dictionaries with 'message', 'type', and 'priority'
        """
        tips = []

        if not user_data.claims_history:
            # No claims history - provide general destination tips
            tips.extend(self._generate_general_destination_tips(user_data))
        else:
            # Analyze claims and generate personalized tips
            tips.extend(self._analyze_claims_and_generate_tips(user_data))

        # Sort by priority (higher first)
        tips.sort(key=lambda x: x['priority'], reverse=True)

        return tips

    def _analyze_claims_and_generate_tips(self, user_data: ScootUserData) -> List[Dict[str, Any]]:
        """Analyze past claims and generate relevant tips."""
        tips = []
        destination_code = user_data.destination
        destination_advisories = self.HEALTH_ADVISORIES.get(destination_code, [])

        for claim in user_data.claims_history:
            claim_type_lower = claim.claim_type.lower()
            cause_lower = claim.cause_of_loss.lower()

            # Determine claim category
            category = self._categorize_claim(claim_type_lower, cause_lower)

            if category and category in self.CLAIM_TO_RISK_MAPPING:
                mapping = self.CLAIM_TO_RISK_MAPPING[category]

                # Check if claim cause matches any keywords
                relevant_keywords = [kw for kw in mapping['keywords'] if kw in cause_lower]

                if relevant_keywords or category == "medical":
                    # Generate personalized tip
                    template = random.choice(mapping['tip_templates'])

                    # Find relevant health advisory
                    advisory_text = self._find_relevant_advisory(
                        category,
                        cause_lower,
                        destination_advisories
                    )

                    # Format the tip message
                    message = template.format(
                        cause=cause_lower,
                        destination=self._get_destination_name(claim.destination),
                        new_destination=self._get_destination_name(destination_code),
                        health_advisory=advisory_text
                    )

                    # Calculate priority based on claim severity
                    priority = self._calculate_priority(claim, category)

                    tips.append({
                        "message": message,
                        "type": category,
                        "priority": priority,
                        "related_claim": claim.claim_number
                    })

        # Add general destination-specific tips if applicable
        if destination_advisories and len(tips) < 2:
            tips.extend(self._generate_health_advisory_tips(user_data, destination_advisories))

        return tips

    def _categorize_claim(self, claim_type: str, cause: str) -> Optional[str]:
        """Categorize a claim into one of the predefined categories."""
        if any(kw in claim_type or kw in cause for kw in ["medical", "illness", "injury", "emergency"]):
            return "medical"
        elif any(kw in claim_type or kw in cause for kw in ["accident", "fall", "injury"]):
            return "accident"
        elif any(kw in claim_type or kw in cause for kw in ["baggage", "luggage", "lost", "stolen", "delayed"]):
            return "baggage"
        elif any(kw in claim_type or kw in cause for kw in ["cancel", "postpone", "delay", "interruption"]):
            return "trip_cancellation"
        return None

    def _find_relevant_advisory(
        self,
        category: str,
        cause: str,
        advisories: List[str]
    ) -> str:
        """Find relevant health advisory based on claim history."""
        if not advisories:
            return "there are some travel health considerations."

        # Match advisory to claim cause
        for advisory in advisories:
            if category == "medical":
                # Check for related health issues
                if any(kw in cause for kw in ["flu", "fever", "respiratory"]) and "influenza" in advisory:
                    return f"there's currently {advisory}"
                elif any(kw in cause for kw in ["dengue", "mosquito"]) and "dengue" in advisory:
                    return f"there's {advisory} in the area"
                elif any(kw in cause for kw in ["food", "stomach", "diarrhea"]) and "food" in advisory:
                    return f"{advisory} is common there"

        # Default advisory
        return f"please note: {advisories[0]}"

    def _calculate_priority(self, claim: ClaimData, category: str) -> int:
        """Calculate tip priority based on claim severity and recency."""
        priority = 50  # Base priority

        # Higher priority for higher claim amounts
        if claim.net_paid > 1000:
            priority += 30
        elif claim.net_paid > 500:
            priority += 20
        elif claim.net_paid > 100:
            priority += 10

        # Higher priority for medical claims
        if category == "medical":
            priority += 20

        # Higher priority for recent claims
        try:
            days_since_claim = (datetime.now().date() - claim.accident_date).days
            if days_since_claim < 180:  # Within 6 months
                priority += 25
            elif days_since_claim < 365:  # Within 1 year
                priority += 15
        except:
            pass

        return priority

    def _generate_health_advisory_tips(
        self,
        user_data: ScootUserData,
        advisories: List[str]
    ) -> List[Dict[str, Any]]:
        """Generate tips based on destination health advisories."""
        tips = []
        destination_name = self._get_destination_name(user_data.destination)

        for advisory in advisories[:2]:  # Limit to top 2 advisories
            message = f"Just a heads up! {advisory.capitalize()} in {destination_name}. Stay safe and prepared! 🌍"
            tips.append({
                "message": message,
                "type": "health_advisory",
                "priority": 40,
                "related_claim": None
            })

        return tips

    def _generate_general_destination_tips(self, user_data: ScootUserData) -> List[Dict[str, Any]]:
        """Generate general tips for users without claims history."""
        tips = []
        destination_code = user_data.destination
        destination_name = self._get_destination_name(destination_code)
        advisories = self.HEALTH_ADVISORIES.get(destination_code, [])

        if advisories:
            message = f"Exciting trip to {destination_name}! Please be aware: {advisories[0]}. Have a wonderful journey! ✨"
            tips.append({
                "message": message,
                "type": "general_advisory",
                "priority": 30,
                "related_claim": None
            })
        else:
            message = f"Have an amazing trip to {destination_name}! Remember to stay hydrated and keep your belongings secure. 🧳✈️"
            tips.append({
                "message": message,
                "type": "general_tip",
                "priority": 20,
                "related_claim": None
            })

        return tips

    def _get_destination_name(self, code: str) -> str:
        """Convert country code to readable name."""
        from Backend.services.scoot_api import SCOOT_COUNTRY_CODE_TO_NAME_MAP
        return SCOOT_COUNTRY_CODE_TO_NAME_MAP.get(code, code)


# Singleton instance
predictive_intelligence_service = PredictiveIntelligenceService()
