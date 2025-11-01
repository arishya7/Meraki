import re

def extract_benefit_conditions(text):
    return {
        "waiting_period": re.findall(r"waiting\s+period\s*:?(\d+)", text),
        "requires_doctor": bool(re.search(r"doctor’s\s+certificate", text, re.I)),
        "exclusions": re.findall(r"not\s+covered\s+if\s+(.*?)\.", text)
    }
