import re

def extract_general_conditions(text):
    return {
        "age_eligibility": re.findall(r"(\d{1,2})[-–](\d{1,2})\s*years", text),
        "trip_start_singapore": bool(re.search(r"trip\s+must\s+commence\s+from\s+singapore", text, re.I)),
        "pre_existing_exclusion": bool(re.search(r"pre-existing\s+condition", text, re.I))
    }
