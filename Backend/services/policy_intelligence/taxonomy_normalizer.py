# Backend/services/policy_intelligence/taxonomy_normalizer.py
import json
from pathlib import Path
import re
from typing import Dict, Any

TAXONOMY_PATH = Path(__file__).resolve().parent.parent.parent.parent / "Taxonomy" / "Taxonomy_Hackathon.json"
OUTPUT_PATH = Path(__file__).resolve().parent / "policies.json"

def load_taxonomy() -> Dict[str, Any]:
    with open(TAXONOMY_PATH, "r") as f:
        return json.load(f)
CANONICAL_MAPPING = {
    # benefit-level mappings
    "medical_expenses": "overseas_medical_expenses",
    "overseas_medical_expenses": "overseas_medical_expenses",
    "baggage_loss": "loss_damage_personal_belongings",
    "trip_cancellation": "trip_cancellation",
    "winter_sports": "adventurous_activities",
    # general / condition-level mappings
    "age_eligibility": "age_eligibility",
    "trip_start_singapore": "trip_start_singapore",
    "pre_existing_exclusion": "pre_existing_conditions",
    "waiting_period": "waiting_period",
    "requires_doctor": "requires_doctor",
    "exclusions": "exclusions",
    # operational
    "deductible": "deductible",
    "claim_time_limit_days": "claim_time_limit_days",
    "payment_method": "payment_method",
}


def canonicalize_extracted(extracted: Dict[str, Any]) -> Dict[str, Dict[str, Any]]:
    """Convert raw extractor outputs (possibly structured by layers) into a
    canonical dict keyed by taxonomy names with fields `original_text` and
    `max_limit`.

    Handles inputs like the `structured` value produced by process_policy
    (which contains a `layers` dict) or a flat dict produced by single
    extractors.
    """
    flat = {}
    # if input contains layers, flatten them
    if isinstance(extracted, dict) and "layers" in extracted:
        layers = extracted.get("layers", {})
        for layer_vals in layers.values():
            if isinstance(layer_vals, dict):
                for k, v in layer_vals.items():
                    flat[k] = v
            else:
                # some extractors return dicts directly
                continue
    else:
        flat = dict(extracted)

    canonical = {}
    for key, value in flat.items():
        canon = CANONICAL_MAPPING.get(key)
        if not canon:
            # unknown key — skip for now
            continue

        # normalize value into a single text blob
        if isinstance(value, (list, tuple)):
            text = " ; ".join([str(x) for x in value if x is not None])
        elif isinstance(value, bool):
            text = str(value)
        else:
            text = str(value)

        # numeric extraction (first money/number found)
        max_limit = None
        m = re.search(r"\$?(\d{1,3}(?:,\d{3})*(?:\.\d+)?|\d+(?:\.\d+)?)", text)
        if m:
            num_text = m.group(1).replace(",", "")
            try:
                if "." in num_text:
                    max_limit = float(num_text)
                else:
                    max_limit = int(num_text)
            except Exception:
                max_limit = None

        canonical[canon] = {"original_text": text, "max_limit": max_limit}

    return canonical


def normalize_to_taxonomy(extracted: Dict[str, Any], product_name: str) -> Dict[str, Any]:
    taxonomy = load_taxonomy()
    # deep copy to avoid mutating the loaded taxonomy structure
    from copy import deepcopy

    updated = deepcopy(taxonomy)

    canonical = canonicalize_extracted(extracted)

    # iterate all layers and attempt to match by either 'benefit_name' or 'condition'
    layers = updated.get("layers", {})
    for layer_key, entries in layers.items():
        if not isinstance(entries, list):
            continue
        for entry in entries:
            tax_key = None
            if "benefit_name" in entry:
                tax_key = entry.get("benefit_name")
            elif "condition" in entry:
                tax_key = entry.get("condition")
            if not tax_key:
                continue

            if tax_key in canonical:
                # ensure products mapping exists
                products = entry.setdefault("products", {})
                prod_entry = products.setdefault(product_name, {})
                prod_entry.setdefault("parameters", {})

                prod_entry["condition_exist"] = True
                prod_entry["original_text"] = canonical[tax_key].get("original_text")
                max_limit = canonical[tax_key].get("max_limit")
                if max_limit is not None:
                    prod_entry["parameters"]["max_limit"] = max_limit

    return updated

def save_policy_data(data: Dict[str, Any]):
    with open(OUTPUT_PATH, "w") as f:
        json.dump(data, f, indent=2)
