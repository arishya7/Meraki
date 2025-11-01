"""Process all policy documents and normalize them according to taxonomy."""
import os
from pathlib import Path
from typing import Dict, List, Any
import json
from concurrent.futures import ThreadPoolExecutor, as_completed
from tqdm import tqdm

from .llm_extractor import PolicyExtractor
from .taxonomy_normalizer import normalize_to_taxonomy

def load_policy_text(file_path: Path) -> str:
    """Load text from a PDF policy file using PyMuPDF."""
    import fitz  # PyMuPDF
    text = ""
    try:
        with fitz.open(str(file_path)) as doc:
            for page in doc:
                try:
                    text += page.get_text()
                except Exception:
                    # fallback to raw text extraction if html extraction fails
                    text += page.get_text("text")
    except Exception as e:
        raise RuntimeError(f"Failed to extract text from PDF {file_path}: {e}")
    return text

def clean_text(text: str) -> str:
    """Clean extracted PDF text for better LLM processing."""
    import re
    # Remove repeated whitespace and newlines
    text = re.sub(r'\s+', ' ', text)
    # Remove page numbers and headers
    text = re.sub(r'\b\d+\s*of\s*\d+\b', '', text)
    text = re.sub(r'Page \d+', '', text)
    # Remove PDF artifacts
    text = re.sub(r'([A-Z][a-z]+)\s+\1', r'\1', text)  # Repeated words from PDF headers
    return text.strip()

def process_single_policy(file_path: Path, extractor: PolicyExtractor) -> Dict[str, Any]:
    """Process a single policy file through the extraction pipeline."""
    try:
        # Load and clean policy text
        raw_text = load_policy_text(file_path)
        text = clean_text(raw_text)
        
        # Extract structured info using LLM
        extracted = extractor.extract_policy_info(text)
        
        # Get enriched analysis
        enriched = extractor.enrich_extracted_info(extracted)
        
        # Prepare for normalization
        product_name = file_path.stem  # Use filename as product name
        structured = {
            "product_name": product_name,
            "layers": {
                "layer_1_general_conditions": extracted.get("general_conditions", {}),
                "layer_2_benefits": extracted.get("benefits", {}),
                "layer_3_benefit_conditions": extracted.get("benefit_conditions", {}),
                "layer_4_operational": extracted.get("operational_details", {})
            }
        }
        
        # Normalize to taxonomy
        normalized = normalize_to_taxonomy(structured, product_name)
        
        return {
            "product_name": product_name,
            "extracted": extracted,
            "enriched": enriched,
            "normalized": normalized
        }
    
    except Exception as e:
        print(f"Error processing {file_path}: {str(e)}")
        return {
            "product_name": file_path.stem,
            "error": str(e)
        }

def process_all_policies(policy_dir: Path, output_dir: Path, max_workers: int = 4) -> None:
    """
    Process all policy files in the given directory and save results.
    
    Args:
        policy_dir: Directory containing policy files
        output_dir: Directory to save processed results
        max_workers: Maximum number of parallel workers
    """
    # Create output directory
    output_dir.mkdir(parents=True, exist_ok=True)
    
    # Initialize extractor
    extractor = PolicyExtractor()
    
    # Get all PDF policy files
    policy_files = list(policy_dir.glob("*.pdf"))
    if not policy_files:
        print(f"No policy files found in {policy_dir}")
        return
    
    print(f"\nProcessing {len(policy_files)} policy files...")
    results = []
    
    # Process files in parallel
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        # Submit all tasks
        future_to_file = {
            executor.submit(process_single_policy, f, extractor): f 
            for f in policy_files
        }
        
        # Process results as they complete
        for future in tqdm(as_completed(future_to_file), total=len(policy_files)):
            file_path = future_to_file[future]
            try:
                result = future.result()
                results.append(result)
                
                # Save individual result
                result_path = output_dir / f"{file_path.stem}_processed.json"
                with open(result_path, 'w', encoding='utf-8') as f:
                    json.dump(result, f, indent=2)
                
            except Exception as e:
                print(f"\nError processing {file_path}: {str(e)}")
    
    # Save summary
    summary = {
        "total_processed": len(results),
        "successful": len([r for r in results if "error" not in r]),
        "failed": len([r for r in results if "error" in r]),
        "products": [r["product_name"] for r in results if "error" not in r]
    }
    
    with open(output_dir / "processing_summary.json", 'w', encoding='utf-8') as f:
        json.dump(summary, f, indent=2)
    
    print(f"\nProcessing complete! Results saved to {output_dir}")
    print(f"Successfully processed: {summary['successful']}/{summary['total_processed']} policies")

if __name__ == "__main__":
    # Set up paths
    base_dir = Path(__file__).resolve().parent
    policy_dir = base_dir.parent.parent.parent / "Policy_Wordings"
    output_dir = base_dir / "processed_policies"
    
    # Process all policies
    process_all_policies(policy_dir, output_dir)