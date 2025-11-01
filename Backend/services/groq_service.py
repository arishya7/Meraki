import os
from typing import Optional, Dict, Any
from groq import AsyncGroq
import json

class GroqService:
    """Service to interact with Groq API for intelligent data extraction and processing."""

    def __init__(self):
        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            print("[GroqService] WARNING: GROQ_API_KEY not found in environment variables")
        self.client = AsyncGroq(api_key=api_key)
        # Using Llama 3.3 70B - best quality model for structured data extraction
        self.model = "llama-3.3-70b-versatile"

    async def extract_flight_info_from_text(self, pdf_text: str) -> Optional[Dict[str, Any]]:
        """
        Extract structured flight information from PDF text using Groq.

        Args:
            pdf_text: Raw text extracted from the PDF

        Returns:
            Dictionary containing structured flight information:
            {
                "origin": str,
                "destination": str,
                "departure_date": str (YYYY-MM-DD),
                "return_date": str (YYYY-MM-DD) or None,
                "num_travelers": int,
                "passenger_names": list[str],
                "passenger_ages": list[int] (estimated if not available),
                "trip_type": str ("one_way" or "round_trip"),
                "flexi_flight": bool,
                "booking_reference": str or None,
                "flight_numbers": list[str]
            }
        """
        try:
            system_prompt = """You are an expert at extracting flight and passenger information from travel documents, booking confirmations, and itineraries.
Your task is to carefully analyze the provided text and extract structured data, returning it in JSON format.

CRITICAL RULES:
1. **Be thorough**: Look for information anywhere in the document, including headers, footers, and tables
2. **Date formats**: Convert all dates to YYYY-MM-DD format (e.g., "15 Dec 2025" → "2025-12-15", "12/15/2025" → "2025-12-15")
3. **Passenger counting**: Count ALL passengers accurately, including infants and children
4. **Age estimation**: If ages aren't explicit, estimate: Mr/Mrs/Ms = 35, Master/Miss = 12, Infant = 1
5. **Location extraction**: Extract airport codes (e.g., SIN, BKK) when available; otherwise use city names (e.g., Singapore, Bangkok)
6. **Trip type detection**: Set "round_trip" if return/inbound flight exists, otherwise "one_way"
7. **Flexi flight**: Set true if terms like "flexi", "flexible", "changeable", or "refundable" appear
8. **Booking reference**: Look for PNR, booking reference, confirmation code, or reservation number
9. **Flight numbers**: Extract all flight numbers (e.g., TR123, SQ456)
10. **Handle variations**: Be flexible with document formats - some PDFs may have poor formatting, scattered information, or tables

FALLBACK STRATEGY:
- If you can't find specific information, use reasonable defaults:
  - num_travelers: Count passenger names or default to 1
  - passenger_ages: Estimate based on available context
  - booking_reference: null if not found
  - flexi_flight: false if not mentioned

Return ONLY valid JSON with no additional text or explanation."""

            user_prompt = f"""Extract flight and passenger information from this booking document:

{pdf_text}

Return the information in this exact JSON structure:
{{
    "origin": "airport code or city",
    "destination": "airport code or city",
    "departure_date": "YYYY-MM-DD",
    "return_date": "YYYY-MM-DD or null",
    "num_travelers": number,
    "passenger_names": ["name1", "name2"],
    "passenger_ages": [age1, age2],
    "trip_type": "one_way or round_trip",
    "flexi_flight": true or false,
    "booking_reference": "reference or null",
    "flight_numbers": ["FL123", "FL456"]
}}"""

            response = await self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=0.1,  # Low temperature for consistent extraction
                response_format={"type": "json_object"}
            )

            result_text = response.choices[0].message.content
            result = json.loads(result_text)

            print(f"[GroqService] Successfully extracted flight info: {result}")
            return result

        except json.JSONDecodeError as e:
            print(f"[GroqService] JSON decode error: {e}")
            try:
                print(f"[GroqService] Response was: {result_text}")
            except:
                print(f"[GroqService] Could not print response text")
            return None
        except Exception as e:
            print(f"[GroqService] Error extracting flight info with Groq: {e}")
            print(f"[GroqService] Error type: {type(e).__name__}")
            import traceback
            traceback.print_exc()
            return None

    async def extract_flight_info_from_pdf_bytes(self, pdf_bytes: bytes) -> Optional[Dict[str, Any]]:
        """
        Extract structured flight information directly from PDF bytes using Groq.

        Args:
            pdf_bytes: Raw PDF file bytes

        Returns:
            Dictionary containing structured flight information (same as extract_flight_info_from_text)
        """
        try:
            # Extract text from PDF using PyMuPDF
            import fitz
            document = fitz.open(stream=pdf_bytes, filetype="pdf")

            full_text = []
            for page_num in range(document.page_count):
                page = document.load_page(page_num)
                full_text.append(page.get_text())

            document.close()
            pdf_text = "\n".join(full_text)

            # Use the text extraction method
            return await self.extract_flight_info_from_text(pdf_text)

        except Exception as e:
            print(f"[GroqService] Error processing PDF bytes: {e}")
            import traceback
            traceback.print_exc()
            return None
