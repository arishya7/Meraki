from .layer_extractions.general_conditions import extract_general_conditions
from .layer_extractions.benefits import extract_benefits
from .layer_extractions.benefit_conditions import extract_benefit_conditions
from .layer_extractions.operational_details import extract_operational_details
from .policy_parser import extract_text_from_pdf
from .taxonomy_normalizer import normalize_to_taxonomy, save_policy_data

def process_policy(pdf_path: str, product_name: str):
    text = extract_text_from_pdf(pdf_path)
    general = extract_general_conditions(text)
    benefits = extract_benefits(text)
    benefit_cond = extract_benefit_conditions(text)
    ops = extract_operational_details(text)

    structured = {
        "product_name": product_name,
        "layers": {
            "layer_1_general_conditions": general,
            "layer_2_benefits": benefits,
            "layer_3_benefit_conditions": benefit_cond,
            "layer_4_operational": ops
        }
    }

    normalized = normalize_to_taxonomy(structured, product_name)
    save_policy_data(normalized)
    return normalized
