import base64
import fitz # PyMuPDF
from typing import Optional

class PdfParserService:
    """Service to parse PDF files and extract relevant information."""

    def __init__(self):
        pass

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
