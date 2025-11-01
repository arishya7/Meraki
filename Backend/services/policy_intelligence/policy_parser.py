# Backend/services/policy_intelligence/policy_parser.py
import re
from typing import Dict, Any


def parse_policy_sections(text: str) -> Dict[str, Any]:
    """
    Detects key benefits, conditions, and operational details from policy text.
    Returns a structured dict for normalization.
    """
    # Define patterns for each section type
    patterns = {
        "benefits": {
            "medical_expenses": {
                "pattern": r"MEDICAL EXPENSES.*?(?=\n\s*[A-Z]{2,}|$)",
                "amount_pattern": r"\$(\d+(?:,\d+)?)",
            },
            "travel_cancellation": {
                "pattern": r"TRAVEL CANCELLATION.*?(?=\n\s*[A-Z]{2,}|$)",
                "amount_pattern": r"\$(\d+(?:,\d+)?)",
            },
            "baggage_coverage": {
                "pattern": r"BAGGAGE COVERAGE.*?(?=\n\s*[A-Z]{2,}|$)",
                "amount_pattern": r"\$(\d+(?:,\d+)?)",
            }
        },
        "conditions": {
            "eligibility": r"ELIGIBILITY.*?(?=\n\s*[A-Z]{2,}|$)",
            "exclusions": r"GENERAL EXCLUSIONS.*?(?=\n\s*[A-Z]{2,}|$)",
        },
        "operational": {
            "claims": r"CLAIM PROCEDURES.*?(?=\n\s*[A-Z]{2,}|$)",
        }
    }

    extracted = {
        "benefits": {},
        "conditions": {},
        "operational": {}
    }

    # Extract benefits with amounts
    for benefit_name, benefit_info in patterns["benefits"].items():
        match = re.search(benefit_info["pattern"], text, re.DOTALL | re.I)
        if match:
            benefit_text = match.group(0)
            amount_match = re.search(benefit_info["amount_pattern"], benefit_text)
            amount = int(amount_match.group(1).replace(",", "")) if amount_match else None
            extracted["benefits"][benefit_name] = {
                "text": benefit_text.strip(),
                "amount": amount
            }

    # Extract conditions and operational details
    for category in ["conditions", "operational"]:
        for section_name, pattern in patterns[category].items():
            match = re.search(pattern, text, re.DOTALL | re.I)
            if match:
                extracted[category][section_name] = match.group(0).strip()

    return extracted
