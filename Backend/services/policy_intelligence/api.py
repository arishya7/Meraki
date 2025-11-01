"""FastAPI endpoints for policy intelligence service."""
from fastapi import APIRouter, HTTPException
from typing import Dict, Any, Optional
from pathlib import Path
import json

from .llm_extractor import PolicyExtractor
from .taxonomy_normalizer import normalize_to_taxonomy

router = APIRouter()
extractor = PolicyExtractor()

# Load processed policies cache
PROCESSED_DIR = Path(__file__).parent / "processed_policies"
POLICY_CACHE: Dict[str, Any] = {}

def load_policy_cache():
    """Load all processed policies into memory cache."""
    if not PROCESSED_DIR.exists():
        return
    
    for file in PROCESSED_DIR.glob("*_processed.json"):
        if file.name != "processing_summary.json":
            with open(file, 'r', encoding='utf-8') as f:
                POLICY_CACHE[file.stem.replace("_processed", "")] = json.load(f)

@router.post("/extract_policy")
async def extract_policy(policy_text: str, product_name: str) -> Dict[str, Any]:
    """
    Extract structured information from policy text.
    
    Args:
        policy_text: Raw policy document text
        product_name: Name of the insurance product
    
    Returns:
        Dict containing extracted, enriched, and normalized policy information
    """
    try:
        # Extract structured info using LLM
        extracted = extractor.extract_policy_info(policy_text)
        
        # Get enriched analysis
        enriched = extractor.enrich_extracted_info(extracted)
        
        # Prepare for normalization
        structured = {
            "product_name": product_name,
            "layers": {
                "layer_1_general_conditions": extracted["general_conditions"],
                "layer_2_benefits": extracted["benefits"],
                "layer_3_benefit_conditions": extracted["benefit_conditions"],
                "layer_4_operational": extracted["operational_details"]
            }
        }
        
        # Normalize to taxonomy
        normalized = normalize_to_taxonomy(structured, product_name)
        
        return {
            "product_name": product_name,
            "extracted": extracted,
            "enriched_analysis": enriched, # Renamed to enriched_analysis
            "normalized": normalized
        }
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error processing policy: {str(e)}"
        )

@router.get("/compare_policies")
async def compare_policies(
    product_names: list[str],
    aspects: Optional[list[str]] = None
) -> Dict[str, Any]:
    """
    Compare multiple insurance policies.
    
    Args:
        product_names: List of product names to compare
        aspects: Optional list of specific aspects to compare (e.g., ["medical_coverage", "trip_cancellation"])
    
    Returns:
        Comparison analysis of the specified products and aspects
    """
    try:
        # Ensure policies are loaded
        if not POLICY_CACHE:
            load_policy_cache()
        
        # Validate products exist
        for product in product_names:
            if product not in POLICY_CACHE:
                raise HTTPException(
                    status_code=404,
                    detail=f"Policy not found: {product}"
                )
        
        # Get policies to compare
        policies = {
            name: POLICY_CACHE[name] 
            for name in product_names
        }
        
        # Extract comparison points
        comparison = {
            "benefits": {},
            "conditions": {},
            "summary": {}
        }
        
        # Compare benefits
        for product_name, policy in policies.items():
            benefits = policy["extracted"]["benefits"]
            if aspects:
                benefits = {k: v for k, v in benefits.items() if k in aspects}
            comparison["benefits"][product_name] = benefits
        
        # Compare conditions
        for product_name, policy in policies.items():
            conditions = policy["extracted"]["general_conditions"]
            comparison["conditions"][product_name] = conditions
        
        # Add summary from enriched analysis
        for product_name, policy in policies.items():
            comparison["summary"][product_name] = {
                "type": policy["enriched"]["policy_type"],
                "strengths": policy["enriched"]["coverage_analysis"]["strengths"],
                "limitations": policy["enriched"]["coverage_analysis"]["limitations"]
            }
        
        return comparison
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error comparing policies: {str(e)}"
        )

@router.get("/query_policy")
async def query_policy(
    product_name: str,
    query: str
) -> Dict[str, Any]:
    """
    Query specific information about a policy using natural language.
    
    Args:
        product_name: Name of the insurance product
        query: Natural language query about the policy
    
    Returns:
        Relevant information from the policy matching the query
    """
    try:
        # Ensure policies are loaded
        if not POLICY_CACHE:
            load_policy_cache()
        
        # Validate product exists
        if product_name not in POLICY_CACHE:
            raise HTTPException(
                status_code=404,
                detail=f"Policy not found: {product_name}"
            )
        
        policy = POLICY_CACHE[product_name]
        
        # Use LLM to analyze query and extract relevant info
        system_prompt = (
            "You are an insurance policy expert. "
            "Answer the user's question using ONLY the information provided in the policy data. "
            "If the information is not available in the policy data, say so clearly."
        )
        
        user_prompt = f"Policy data:\n{json.dumps(policy['extracted'], indent=2)}\n\nQuestion: {query}"
        
        response = extractor.client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.1,
            max_tokens=500
        )
        
        return {
            "product_name": product_name,
            "query": query,
            "answer": response.choices[0].message.content,
            "source": "policy_data"
        }
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error querying policy: {str(e)}"
        )