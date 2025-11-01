"""LLM-based policy document extraction using Groq API."""
from typing import Dict, Any, List
import os
import json
import time
from groq import Groq

class PolicyExtractor:
    def __init__(self):
        """Initialize Groq client with API key."""
        self.client = Groq(api_key=os.getenv("GROQ_API_KEY"))
        
    def _call_llm_with_retry(self, messages: List[Dict[str, str]], max_retries: int = 3) -> str:
        """Call LLM API with retry logic."""
        for attempt in range(max_retries):
            try:
                response = self.client.chat.completions.create(
                    model="llama-3.1-8b-instant",
                    messages=messages,
                    temperature=0.1,
                    max_tokens=4000
                )
                return response.choices[0].message.content
            except Exception as e:
                if attempt < max_retries - 1:
                    print(f"Error on attempt {attempt + 1}: {e}. Retrying...")
                    time.sleep(2 ** attempt)  # Exponential backoff
                    continue
                raise
        
    def extract_policy_info(self, text: str) -> Dict[str, Any]:
        """Extract structured policy information using Groq's LLM.
        
        Args:
            text (str): Raw policy document text
            
        Returns:
            Dict containing extracted policy information structured by layers:
            - general_conditions
            - benefits 
            - benefit_conditions
            - operational_details
        """
        # Split text into manageable chunks and extract from each
        chunk_size = 8000
        text_chunks = [text[i:i+chunk_size] for i in range(0, len(text), chunk_size)]
        
        all_extractions = []
        
        # System prompt to structure the extraction
        system_prompt = (
            'You are an expert insurance policy analyzer. Format all output as valid JSON with the exact structure below.\n\n'
            'Required output format:\n'
            '{"general_conditions":{'
            '"age_limits":{"min":0,"max":0},'
            '"trip_origin":"location",'
            '"pre_existing_conditions":{"allowed":false,"conditions":"text"},'
            '"eligibility_criteria":["criterion1"]},'
            '"benefits":{'
            '"medical_expenses":{"amount":0,"currency":"SGD","description":"text"},'
            '"travel_cancellation":{"amount":0,"currency":"SGD","description":"text"},'
            '"baggage_loss":{"amount":0,"currency":"SGD","description":"text"}},'
            '"benefit_conditions":{'
            '"medical_expenses":{"requirements":[],"exclusions":[]},'
            '"travel_cancellation":{"requirements":[],"exclusions":[]},'
            '"baggage_loss":{"requirements":[],"exclusions":[]}},'
            '"operational_details":{'
            '"claim_deadline":"text",'
            '"payment_method":"text",'
            '"deductible":0}}'
        )

        # Process each chunk
        for chunk in text_chunks:
            user_prompt = (
                f"Extract key policy information following the exact output format. "
                f"Fill in actual values from this text. Use numbers for amounts, "
                f"true/false for booleans:\n\n{chunk}"
            )
            
            try:
                response = self._call_llm_with_retry([
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ])
                extracted_chunk = json.loads(response)
                all_extractions.append(extracted_chunk)
            except json.JSONDecodeError as e:
                print(f"Failed to parse chunk response: {e}")
                continue
            except Exception as e:
                print(f"Error processing chunk: {e}")
                continue
                
        # Return empty response if no valid extractions
        if not all_extractions:
            return {
                "general_conditions": {},
                "benefits": {},
                "benefit_conditions": {},
                "operational_details": {},
                "error": "Failed to extract any valid information"
            }

        # Merge all chunk extractions
        merged_info = {
            "general_conditions": {},
            "benefits": {},
            "benefit_conditions": {},
            "operational_details": {}
        }

        # Take most detailed info from each section
        for extraction in all_extractions:
            # Merge general conditions
            if "general_conditions" in extraction:
                for key, value in extraction["general_conditions"].items():
                    if isinstance(value, list): # If it's a list, extend it
                        existing_list = merged_info["general_conditions"].get(key, [])
                        merged_info["general_conditions"][key] = list(set(existing_list + value))
                    elif value: # If it's a scalar and not empty, update it
                        merged_info["general_conditions"][key] = value

            # Merge benefits
            if "benefits" in extraction:
                for benefit, details in extraction["benefits"].items():
                    if benefit not in merged_info["benefits"]:
                        merged_info["benefits"][benefit] = details
                    else:
                        # Take higher amount if conflicting
                        def get_safe_amount(d): # Helper to safely get amount
                            amount = d.get("amount", 0)
                            return amount if isinstance(amount, (int, float)) else 0

                        if get_safe_amount(details) > get_safe_amount(merged_info["benefits"][benefit]):
                            merged_info["benefits"][benefit] = details

            # Merge benefit conditions
            if "benefit_conditions" in extraction:
                for benefit, conditions in extraction["benefit_conditions"].items():
                    if benefit not in merged_info["benefit_conditions"]:
                        merged_info["benefit_conditions"][benefit] = conditions
                    else:
                        # Combine requirements and exclusions
                        merged_info["benefit_conditions"][benefit]["requirements"] = list(set(
                            merged_info["benefit_conditions"][benefit].get("requirements", []) +
                            conditions.get("requirements", [])
                        ))
                        merged_info["benefit_conditions"][benefit]["exclusions"] = list(set(
                            merged_info["benefit_conditions"][benefit].get("exclusions", []) +
                            conditions.get("exclusions", [])
                        ))

            # Merge operational details
            if "operational_details" in extraction:
                for key, value in extraction["operational_details"].items():
                    if isinstance(value, list): # If it's a list, extend it
                        existing_list = merged_info["operational_details"].get(key, [])
                        merged_info["operational_details"][key] = list(set(existing_list + value))
                    elif value: # If it's a scalar and not empty, update it
                        merged_info["operational_details"][key] = value
        
        return merged_info
    def enrich_extracted_info(self, extracted_info: Dict[str, Any]) -> Dict[str, Any]:
        """Enrich the extracted information with additional analysis."""
        # Prepare a summary of the extracted info for the LLM
        summary = json.dumps(extracted_info, indent=2)
        
        system_prompt = (
            'You are an expert insurance analyst. Format all output as valid JSON with the exact structure below.\n\n'
            'Required output format:\n'
            '{\n'
            '  "policy_type": {\n'
            '    "category": "Travel Insurance",\n'
            '    "target_segment": "Leisure Travelers",\n'
            '    "coverage_level": "standard"\n'
            '  },\n'
            '  "coverage_analysis": {\n'
            '    "strengths": [\n'
            '      "High medical coverage",\n'
            '      "Comprehensive trip cancellation"\n'
            '    ],\n'
            '    "limitations": [\n'
            '      "Age restrictions",\n'
            '      "Pre-existing conditions excluded"\n'
            '    ],\n'
            '    "unique_features": [\n'
            '      "PayNow payment method"\n'
            '    ]\n'
            '  },\n'
            '  "benefit_patterns": {\n'
            '    "common_limits": [\n'
            '      {\n'
            '        "type": "medical_coverage",\n'
            '        "amount": 50000\n'
            '      }\n'
            '    ],\n'
            '    "standard_conditions": [\n'
            '      "doctor referral required",\n'
            '      "30 day claim window"\n'
            '    ],\n'
            '    "typical_exclusions": [\n'
            '      "pre-existing conditions",\n'
            '      "non-medical travel"\n'
            '    ]\n'
            '  }\n'
            '}'
        )

        user_prompt = f"Analyze this extracted policy information and provide enriched insights:\n\n{summary}"

        response = self._call_llm_with_retry([
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ])

        try:
            enriched_info = json.loads(response)
            return enriched_info # Return enriched_info directly
        except json.JSONDecodeError:
            print(f"Failed to parse enriched response: {response}")
            return {
                "error": "Failed to generate enriched analysis",
                "raw_response": response
            }