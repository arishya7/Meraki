"""Quick test script for taxonomy normalization."""
import json
from taxonomy_normalizer import canonicalize_extracted, normalize_to_taxonomy

def test_normalization():
    # Sample input mimicking what our extractors would produce
    test_input = {
        'layers': {
            'layer_2_benefits': {
                'medical_expenses': ['Hospital coverage up to $50,000'],
                'trip_cancellation': ['Cancel for any reason up to $2,000'],
                'baggage_loss': ['Lost baggage compensation $1,500']
            },
            'layer_1_general_conditions': {
                'age_eligibility': ['18-65 years'],
                'trip_start_singapore': True,
                'pre_existing_exclusion': True
            }
        }
    }

    # Step 1: Test canonicalization
    print('Step 1: Canonicalize extracted data')
    canonical = canonicalize_extracted(test_input)
    print(json.dumps(canonical, indent=2))

    # Step 2: Test full normalization
    print('\nStep 2: Normalize to taxonomy structure')
    normalized = normalize_to_taxonomy(test_input, 'Product A')

    # Show some interesting parts of the output
    print('\nExample benefits/conditions with data:')
    found = 0
    for layer_name, layer in normalized['layers'].items():
        if isinstance(layer, list):
            for entry in layer:
                if 'products' in entry and 'Product A' in entry['products']:
                    prod_data = entry['products']['Product A']
                    if prod_data.get('condition_exist'):
                        found += 1
                        print(f'\nIn {layer_name}:')
                        print(json.dumps(entry, indent=2))
                        if found >= 3:  # show first 3 matches
                            break

if __name__ == '__main__':
    test_normalization()