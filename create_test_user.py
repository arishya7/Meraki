import asyncio
from Backend.services.user_db import create_user

async def main():
    user_id = "user_S1234567Z"
    name = "Test User"
    email = "testuser@example.com"
    password_hash = "e3afed0047b08059d0fada10f400c1e5"  # hash for 'password'
    nric = "S1234567Z"
    allows_tracking = True
    user = await create_user(user_id, name, email, password_hash, nric, allows_tracking)
    print(user)

asyncio.run(main())
