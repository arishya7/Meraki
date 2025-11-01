"""Test full policy extraction pipeline with a sample text."""
from pathlib import Path
from layer_extractions.general_conditions import extract_general_conditions
from layer_extractions.benefits import extract_benefits
from layer_extractions.benefit_conditions import extract_benefit_conditions
from layer_extractions.operational_details import extract_operational_details
from taxonomy_normalizer import normalize_to_taxonomy
from policy_parser import parse_policy_sections
import json

def test_policy_extraction():
    """Test the complete policy extraction and normalization pipeline using sample text."""
    
    # Step 1: Sample policy text (medical coverage section)
    text = """
    MEDICAL EXPENSES
    We will reimburse the Insured Person up to $50,000 for the necessary medical, surgical and hospital charges incurred as a result of the Insured Person sustaining Injury or Illness during the Journey. All treatment including specialist treatment must be prescribed or referred by a Doctor in order for expenses to be reimbursed under this Policy.
    
    TRAVEL CANCELLATION
    We will reimburse the Insured Person up to $2,000 for the unused and non-refundable portion of travel costs paid in advance in the event of unavoidable cancellation of the planned Journey due to any specified cause.
    
    BAGGAGE COVERAGE
    We will pay the Insured Person up to $1,500 for loss of or damage to the Insured Person's baggage and personal effects during the Journey.
    
    ELIGIBILITY
    This policy is available to travelers aged 18-65 years old. Trip must commence from Singapore.
    All travelers must be in good health and not traveling against medical advice.
    
    GENERAL EXCLUSIONS
    Pre-existing medical conditions are not covered unless specifically declared and accepted by Us.
    
    CLAIM PROCEDURES
    All claims must be filed within 30 days of the incident, with a $100 deductible applying to each claim.
    Payment will be made via PayNow.
    """
    print("\nStep 1: Using sample policy text...")
    print(f"Sample text length: {len(text)} characters")
    
    # Step 2: Parse sections using updated parser
    print("\nStep 2: Parsing policy sections...")
    parsed = parse_policy_sections(text)
    print("\nParsed sections:")
    print(json.dumps(parsed, indent=2))
    
    # Step 3: Extract structured data by layer using parsed sections
    print("\nStep 3: Extracting structured data...")
    
    # Convert parsed sections into layer format
    general = extract_general_conditions(text)
    general.update({
        "eligibility": parsed["conditions"].get("eligibility", ""),
        "exclusions": parsed["conditions"].get("exclusions", "")
    })
    
    benefits = extract_benefits(text)
    benefits.update({
        section: info["text"]
        for section, info in parsed["benefits"].items()
    })
    
    benefit_cond = extract_benefit_conditions(text)
    
    ops = extract_operational_details(text)
    ops.update({
        "claims": parsed["operational"].get("claims", "")
    })
    
    # Show what we found in each layer
    print("\nGeneral conditions found:")
    print(json.dumps(general, indent=2))
    print("\nBenefits found:")
    print(json.dumps(benefits, indent=2))
    print("\nBenefit conditions found:")
    print(json.dumps(benefit_cond, indent=2))
    print("\nOperational details found:")
    print(json.dumps(ops, indent=2))
    
    # Step 3: Structure for normalization
    structured = {
        "product_name": "Scootsurance",
        "layers": {
            "layer_1_general_conditions": general,
            "layer_2_benefits": benefits,
            "layer_3_benefit_conditions": benefit_cond,
            "layer_4_operational": ops
        }
    }
    
    # Step 4: Normalize to taxonomy
    print("\nStep 4: Normalizing to taxonomy...")
    normalized = normalize_to_taxonomy(structured, "Scootsurance")
    
    # Show example of normalized benefits/conditions
    print("\nExample normalized entries:")
    found = 0
    for layer_name, layer in normalized['layers'].items():
        if isinstance(layer, list):
            for entry in layer:
                if ('products' in entry and 
                    'Scootsurance' in entry['products'] and
                    entry['products']['Scootsurance'].get('condition_exist')):
                    found += 1
                    print(f"\nIn {layer_name}:")
                    print(json.dumps(entry, indent=2))
                    if found >= 3:  # show first 3 matches
                        break

if __name__ == '__main__':
    test_policy_extraction()