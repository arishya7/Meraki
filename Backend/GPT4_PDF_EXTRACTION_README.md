# GPT-4 PDF Extraction Implementation

This document describes the GPT-4 integration for intelligent PDF parsing and flight information extraction.

## Overview

The system now uses **GPT-4** (specifically GPT-4o) to extract structured flight and passenger information from PDF booking documents. This provides:

- ✅ Accurate extraction of flight details (origin, destination, dates)
- ✅ Passenger information (names, count, estimated ages)
- ✅ Booking references and flight numbers
- ✅ Support for both text-based PDFs
- ✅ Intelligent data validation and formatting

## Architecture

### Components

1. **GPT4Service** (`services/gpt4_service.py`)
   - Handles communication with OpenAI API
   - Uses GPT-4o model for cost-effective, accurate extraction
   - Implements structured JSON output format

2. **PdfParserService** (`services/pdf_parser_service.py`)
   - Integrates GPT4Service
   - Provides `extract_flight_data_from_pdf_base64()` method
   - Handles PDF decoding and text extraction

3. **User Router** (`routers/user.py`)
   - Updated PDF upload endpoint to use GPT-4 extraction
   - Validates and processes extracted data
   - Constructs `ScootUserData` objects with complete information

## Setup Instructions

### 1. Install Dependencies

```bash
cd Backend
pip install -r requirements.txt
```

This will install the `openai` package along with other dependencies.

### 2. Get OpenAI API Key

1. Visit [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Create a new API key (or use an existing one)
3. Copy the API key

### 3. Configure Environment Variable

Create a `.env` file in the `Backend` directory:

```bash
# Backend/.env
OPENAI_API_KEY=sk-your-actual-api-key-here
```

Or export it in your shell:

```bash
export OPENAI_API_KEY='sk-your-actual-api-key-here'
```

### 4. Test the Implementation

Run the test script to verify everything is working:

```bash
cd Backend
python test_gpt4_pdf.py
```

Expected output:
```
✅ Successfully extracted flight information:
  Origin: Singapore (SIN)
  Destination: Tokyo (NRT)
  Departure Date: 2025-01-15
  ...
✅ Test PASSED - GPT-4 extraction is working!
```

## Usage

### Frontend Integration

The frontend already supports PDF upload via the `BookingConfirmationCard` component. When a user uploads a PDF:

1. Frontend encodes PDF to base64
2. Sends to `/user/input_data` endpoint with `input_type: "pdf_upload"`
3. Backend uses GPT-4 to extract structured data
4. Returns `ScootUserData` object with:
   - Origin and destination
   - Departure and return dates
   - Number of travelers
   - Passenger names and ages
   - Trip type and flexibility options

### API Endpoint

```typescript
POST /user/input_data
Content-Type: application/json

{
  "input_type": "pdf_upload",
  "pdf_base64": "JVBERi0xLjQK..." // Base64 encoded PDF
}
```

**Response:**
```json
{
  "user_id": "user_pdf_1234",
  "nric": "",
  "origin": "Singapore",
  "destination": "Tokyo",
  "departure_date": "2025-01-15",
  "return_date": "2025-01-25",
  "num_travelers": 3,
  "ages": [35, 33, 10],
  "trip_type": "round_trip",
  "flexi_flight": true,
  "claims_history": []
}
```

## Data Extraction Details

### What Gets Extracted

The GPT-4 service extracts the following information:

| Field | Description | Example |
|-------|-------------|---------|
| `origin` | Departure city/airport | "Singapore (SIN)" |
| `destination` | Arrival city/airport | "Tokyo (NRT)" |
| `departure_date` | Departure date (YYYY-MM-DD) | "2025-01-15" |
| `return_date` | Return date or null | "2025-01-25" |
| `num_travelers` | Number of passengers | 3 |
| `passenger_names` | List of passenger names | ["John Doe", "Jane Doe"] |
| `passenger_ages` | List of ages (estimated if needed) | [35, 33, 10] |
| `trip_type` | "one_way" or "round_trip" | "round_trip" |
| `flexi_flight` | Whether flexible ticket | true |
| `booking_reference` | PNR or booking ref | "ABC123XYZ" |
| `flight_numbers` | List of flight numbers | ["SQ123", "SQ456"] |

### Age Estimation

If passenger ages are not explicitly stated in the PDF, GPT-4 estimates reasonable ages based on:
- Titles (Mr/Mrs = 30-40, Master/Miss = 10-15)
- Context clues in the document
- Default fallback of 30 for adults

## Cost Considerations

### Pricing

GPT-4o pricing (as of January 2025):
- **Input**: $2.50 per 1M tokens
- **Output**: $10.00 per 1M tokens

### Typical Usage

For a standard 2-page flight booking PDF:
- Input tokens: ~1,500-2,000 tokens
- Output tokens: ~300-500 tokens
- **Cost per PDF**: ~$0.008 - $0.012 (less than 2 cents)

### Optimization

The implementation is already optimized:
- Low temperature (0.1) for consistency
- JSON mode for structured output
- Efficient prompting to minimize token usage

## Error Handling

The system includes comprehensive error handling:

1. **Missing API Key**: Clear error message with setup instructions
2. **PDF Parsing Errors**: Falls back gracefully with error details
3. **GPT-4 API Errors**: Logged with full traceback for debugging
4. **Invalid Dates**: Automatically adjusted to future dates
5. **Missing Data**: Sensible defaults applied

## Monitoring and Debugging

### Logging

The system logs detailed information:

```python
print(f"[GPT4Service] Successfully extracted flight info: {result}")
print(f"[UserRouter] Extracted flight data from PDF using GPT-4: {flight_data}")
```

### Debug Mode

To see full API responses, add debugging to `gpt4_service.py`:

```python
print(f"[GPT4Service] Raw GPT-4 response: {response.choices[0].message.content}")
```

## Future Enhancements

Potential improvements:

1. **OCR Support**: Use GPT-4 Vision for scanned PDFs
   - Convert PDF pages to images
   - Send to GPT-4 Vision API for OCR

2. **Multi-language Support**: Extract from PDFs in various languages

3. **Batch Processing**: Process multiple PDFs efficiently

4. **Caching**: Cache results for identical PDFs

5. **Validation**: Add more sophisticated data validation

## Troubleshooting

### Common Issues

**Issue**: "OPENAI_API_KEY not found in environment variables"
```bash
# Solution: Set the environment variable
export OPENAI_API_KEY='your-key-here'
```

**Issue**: "Failed to extract flight information from PDF"
```bash
# Check if:
1. PDF contains readable text (not just images)
2. PDF is a valid flight booking document
3. API key is valid and has credits
```

**Issue**: OpenAI API rate limits
```bash
# Solution: Implement rate limiting or upgrade API plan
# See: https://platform.openai.com/docs/guides/rate-limits
```

## Testing

### Unit Tests

Run the provided test script:
```bash
python Backend/test_gpt4_pdf.py
```

### Integration Testing

Test the full flow:
1. Start the backend server
2. Upload a test PDF through the frontend
3. Verify the extracted data is displayed correctly

## Support

For issues or questions:
1. Check the logs in terminal where backend is running
2. Verify OpenAI API key is valid and has credits
3. Test with the provided test script first

## References

- [OpenAI API Documentation](https://platform.openai.com/docs)
- [GPT-4 Guide](https://platform.openai.com/docs/guides/gpt)
- [JSON Mode](https://platform.openai.com/docs/guides/text-generation/json-mode)
