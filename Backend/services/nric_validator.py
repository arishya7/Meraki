import re
from typing import Tuple

def validate_nric(nric: str) -> Tuple[bool, str]:
    """
    Validate Singapore NRIC format.
    Format: S/T followed by 7 digits followed by a letter (A-Z)
    
    Returns:
        Tuple[bool, str]: (is_valid, error_message)
    """
    if not nric:
        return False, "NRIC is required"
    
    # Remove spaces and convert to uppercase
    nric = nric.strip().upper()
    
    # Pattern: S or T, followed by exactly 7 digits, followed by one letter
    pattern = r'^[ST]\d{7}[A-Z]$'
    
    if not re.match(pattern, nric):
        return False, "Invalid NRIC format. Please provide NRIC in the format S1234567D or T1234567A"
    
    return True, ""

