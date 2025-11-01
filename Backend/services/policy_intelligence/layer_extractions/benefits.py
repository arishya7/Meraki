import re

def extract_benefits(text):
    return {
        "medical_expenses": re.findall(r"medical\s+expenses.*?\$?([\d,]+)", text, re.I),
        "trip_cancellation": re.findall(r"trip\s+cancellation.*?\$?([\d,]+)", text, re.I),
        "baggage_loss": re.findall(r"(?:baggage|luggage).*?\$?([\d,]+)", text, re.I)
    }
