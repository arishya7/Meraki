import re

def extract_operational_details(text):
    return {
        "deductible": re.findall(r"deductible.*?\$?([\d,]+)", text, re.I),
        "claim_time_limit_days": re.findall(r"within\s+(\d+)\s+days\s+of\s+(?:incident|return)", text, re.I),
        "payment_method": "PayNow" if "PayNow" in text else "Manual"
    }
