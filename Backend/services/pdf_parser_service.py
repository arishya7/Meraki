import base64
import fitz # PyMuPDF
from typing import Optional, Dict, Any
from .groq_service import GroqService

class PdfParserService:
    """Service to parse PDF files and extract relevant information using Groq AI."""

    def __init__(self):
        self.groq_service = GroqService()

    async def extract_text_from_pdf_base64(self, pdf_base64_content: str) -> Optional[str]:
        """
        Decodes a Base64 PDF string and extracts all text from it.
        Returns the extracted text as a single string, or None if an error occurs.
        """
        try:
            # Decode the Base64 string to bytes
            pdf_bytes = base64.b64decode(pdf_base64_content)

            # Open the PDF document from bytes
            document = fitz.open(stream=pdf_bytes, filetype="pdf")

            full_text = []
            for page_num in range(document.page_count):
                page = document.load_page(page_num)
                full_text.append(page.get_text())

            document.close()
            return "\n".join(full_text)

        except Exception as e:
            print(f"[PdfParserService] Error extracting text from PDF: {e}")
            return None

    async def extract_flight_data_from_pdf_base64(self, pdf_base64_content: str) -> Optional[Dict[str, Any]]:
        """
        Decodes a Base64 PDF string and extracts structured flight information using Groq AI.
        Returns a dictionary with flight and passenger information, or None if an error occurs.
        """
        try:
            # Decode the Base64 string to bytes
            pdf_bytes = base64.b64decode(pdf_base64_content)

            # Use Groq to extract structured information
            flight_data = await self.groq_service.extract_flight_info_from_pdf_bytes(pdf_bytes)

            return flight_data

        except Exception as e:
            print(f"[PdfParserService] Error extracting flight data from PDF: {e}")
            import traceback
            traceback.print_exc()
            return None
