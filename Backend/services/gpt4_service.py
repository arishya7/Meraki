import os
from typing import Optional, Dict, Any
from openai import AsyncOpenAI
import json

class GPT4Service:
    """Service to interact with GPT-4 for intelligent data extraction and processing."""

    def __init__(self):
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            print("[GPT4Service] WARNING: OPENAI_API_KEY not found in environment variables")
        self.client = AsyncOpenAI(api_key=api_key)
        self.model = "gpt-4o"  # Using GPT-4o which supports vision and is cost-effective

    async def extract_flight_info_from_text(self, pdf_text: str) -> Optional[Dict[str, Any]]:
        """
        Extract structured flight information from PDF text using GPT-4.

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
            system_prompt = """You are an expert at extracting flight and passenger information from travel documents.
Extract structured data from the provided text and return it in JSON format.

Rules:
1. Extract all passenger names and count them accurately
2. If passenger ages are not explicitly stated, estimate reasonable ages based on titles (Mr/Mrs = 30-40, Master/Miss = 10-15)
3. Dates must be in YYYY-MM-DD format
4. Origin and destination should be airport codes if available, otherwise city/country names
5. Determine if it's a one-way or round-trip based on return flight information
6. Extract booking reference/PNR if present
7. Extract all flight numbers
8. If multiple passengers, list all their names
9. If flexi/flexible flight terms are mentioned, set flexi_flight to true

Return ONLY valid JSON, no additional text."""

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

            print(f"[GPT4Service] Successfully extracted flight info: {result}")
            return result

        except json.JSONDecodeError as e:
            print(f"[GPT4Service] JSON decode error: {e}")
            print(f"[GPT4Service] Response was: {result_text}")
            return None
        except Exception as e:
            print(f"[GPT4Service] Error extracting flight info with GPT-4: {e}")
            import traceback
            traceback.print_exc()
            return None

    async def extract_flight_info_from_pdf_bytes(self, pdf_bytes: bytes) -> Optional[Dict[str, Any]]:
        """
        Extract structured flight information directly from PDF bytes using GPT-4 Vision.
        This method can handle scanned PDFs and images within PDFs.

        Note: Currently, we extract text first and then process.
        For true OCR capability on scanned documents, you'd need to convert PDF to images
        and use GPT-4 Vision API.

        Args:
            pdf_bytes: Raw PDF file bytes

        Returns:
            Dictionary containing structured flight information (same as extract_flight_info_from_text)
        """
        try:
            # For now, we'll use PyMuPDF to extract text, then process with GPT-4
            # This works well for text-based PDFs
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
            print(f"[GPT4Service] Error processing PDF bytes: {e}")
            import traceback
            traceback.print_exc()
            return None
