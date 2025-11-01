#!/usr/bin/env python3
"""
Simple test script to verify GPT-4 PDF extraction is working.
This tests the GPT-4 service with sample flight booking text.
"""

import asyncio
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from Backend.services.gpt4_service import GPT4Service

async def test_gpt4_extraction():
    """Test GPT-4 extraction with sample flight booking text."""

    # Sample flight booking text (simulating PDF content)
    sample_text = """
    FLIGHT ITINERARY - BOOKING CONFIRMATION

    Booking Reference: ABC123XYZ

    Passenger Details:
    1. Mr. John Doe (Adult)
    2. Mrs. Jane Doe (Adult)
    3. Master Tommy Doe (Child)

    Flight Details:

    Outbound Flight:
    Flight: SQ123
    From: Singapore (SIN) - Changi Airport
    To: Tokyo (NRT) - Narita International Airport
    Date: 15 January 2025
    Departure Time: 09:00 AM

    Return Flight:
    Flight: SQ456
    From: Tokyo (NRT) - Narita International Airport
    To: Singapore (SIN) - Changi Airport
    Date: 25 January 2025
    Departure Time: 18:00 PM

    Trip Type: Round Trip
    Flexible Ticket: Yes

    Total Passengers: 3
    """

    print("=" * 60)
    print("Testing GPT-4 Flight Information Extraction")
    print("=" * 60)
    print("\nSample booking text:")
    print(sample_text)
    print("\n" + "=" * 60)
    print("Extracting flight information...")
    print("=" * 60 + "\n")

    # Check if API key is set
    if not os.getenv("OPENAI_API_KEY"):
        print("❌ ERROR: OPENAI_API_KEY environment variable is not set!")
        print("\nPlease set your OpenAI API key:")
        print("  export OPENAI_API_KEY='your-api-key-here'")
        print("\nGet your API key from: https://platform.openai.com/api-keys")
        return False

    try:
        gpt4_service = GPT4Service()
        result = await gpt4_service.extract_flight_info_from_text(sample_text)

        if result:
            print("✅ Successfully extracted flight information:\n")
            print(f"  Origin: {result.get('origin')}")
            print(f"  Destination: {result.get('destination')}")
            print(f"  Departure Date: {result.get('departure_date')}")
            print(f"  Return Date: {result.get('return_date')}")
            print(f"  Number of Travelers: {result.get('num_travelers')}")
            print(f"  Passenger Names: {result.get('passenger_names')}")
            print(f"  Passenger Ages: {result.get('passenger_ages')}")
            print(f"  Trip Type: {result.get('trip_type')}")
            print(f"  Flexi Flight: {result.get('flexi_flight')}")
            print(f"  Booking Reference: {result.get('booking_reference')}")
            print(f"  Flight Numbers: {result.get('flight_numbers')}")
            print("\n" + "=" * 60)
            print("✅ Test PASSED - GPT-4 extraction is working!")
            print("=" * 60)
            return True
        else:
            print("❌ Test FAILED - No data extracted")
            return False

    except Exception as e:
        print(f"❌ Test FAILED with error: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    print("\n🚀 Starting GPT-4 PDF Extraction Test\n")
    success = asyncio.run(test_gpt4_extraction())
    print("\n")
    sys.exit(0 if success else 1)
