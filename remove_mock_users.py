
import asyncio
from Backend.services.claims_db_client import ClaimsDBClient

async def remove_mock_users():
    """
    Removes mock users from the database.
    """
    db_client = ClaimsDBClient()
    await db_client.connect()

    mock_nrics = ["S8234567D", "S9123456H", "S8567891C", "S7654321E"]

    for nric in mock_nrics:
        try:
            async with db_client.db.execute("DELETE FROM users WHERE nric = ?", (nric,)):
                await db_client.db.commit()
            print(f"Removed user with NRIC: {nric}")
        except Exception as e:
            print(f"Error removing user with NRIC {nric}: {e}")

    await db_client.disconnect()

if __name__ == "__main__":
    asyncio.run(remove_mock_users())
