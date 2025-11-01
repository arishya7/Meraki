"""Test LLM-based policy extraction with sample data."""
import os
from pathlib import Path
import json
# Update import path for PolicyExtractor as it is no longer in the same directory
from services.policy_intelligence.llm_extractor import PolicyExtractor
# Update import path for normalize_to_taxonomy as it is no longer in the same directory
from services.policy_intelligence.taxonomy_normalizer import normalize_to_taxonomy

def test_llm_extraction():
    """Test complete LLM-based extraction pipeline."""
    
    # Sample policy text
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
    
    print("\nStep 1: Starting LLM-based extraction...")
    extractor = PolicyExtractor()
    
    # Extract policy information using LLM
    print("\nStep 2: Extracting with Groq LLM...")
    extracted = extractor.extract_policy_info(text)
    print("\nBasic extraction results:")
    print(json.dumps(extracted, indent=2))
    
    # Get enriched analysis
    print("\nStep 3: Generating enriched analysis...")
    enriched = extractor.enrich_extracted_info(extracted)
    print("\nEnriched analysis results:")
    print(json.dumps(enriched, indent=2))
    
    # Structure for normalization
    print("\nStep 4: Preparing for taxonomy normalization...")
    structured = {
        "product_name": "Travel Insurance",
        "layers": {
            "layer_1_general_conditions": extracted["general_conditions"],
            "layer_2_benefits": extracted["benefits"],
            "layer_3_benefit_conditions": extracted["benefit_conditions"],
            "layer_4_operational": extracted["operational_details"]
        }
    }
    
    # Normalize to taxonomy
    print("\nStep 5: Normalizing to taxonomy...")
    normalized = normalize_to_taxonomy(structured, "Travel Insurance")
    
    # Show example normalized entries
    print("\nExample normalized entries:")
    found = 0
    for layer_name, layer in normalized['layers'].items():
        if isinstance(layer, list):
            for entry in layer:
                if ('products' in entry and 
                    'Travel Insurance' in entry['products'] and
                    entry['products']['Travel Insurance'].get('condition_exist')):
                    found += 1
                    print(f"\nIn {layer_name}:")
                    print(json.dumps(entry, indent=2))
                    if found >= 3:  # show first 3 matches
                        break

if __name__ == '__main__':
    if not os.getenv("GROQ_API_KEY"):
        print("Error: GROQ_API_KEY environment variable not set")
        exit(1)
    test_llm_extraction()