from typing import Optional, Dict, Any
from fastapi import APIRouter, HTTPException, Depends, Header
from pydantic import BaseModel, EmailStr
from Backend.schemas import UserProfileResponse
from Backend.services.scoot_api import MockScootAPIClient, SCOOT_COUNTRY_CODE_TO_NAME_MAP
from Backend.services.user_db import (
    init_db, get_user_by_email, get_user_by_nric, get_user_by_id,
    create_user, store_token, get_user_id_from_token
)
from Backend.services.nric_validator import validate_nric
import secrets
import hashlib
from datetime import datetime

router = APIRouter()

# Initialize database on module import
import asyncio
_initialized = False

async def ensure_db_initialized():
    """Ensure database is initialized and migrate existing users if needed"""
    global _initialized
    if not _initialized:
        await init_db()
        await _migrate_initial_users()
        _initialized = True

# Mock user data based on existing mock events
_initial_users = [
    {
        "name": "Tan Wei Ming",
        "email": "tanweiming@example.com",
        "password": "password123",
        "nric": "S8234567D",
        "allows_tracking": True
    },
    {
        "name": "Siti Nurhaliza Binte Ahmad",
        "email": "sitinurhaliza@example.com",
        "password": "password123",
        "nric": "S9123456H",
        "allows_tracking": True
    },
    {
        "name": "Muhammad Hafiz Bin Abdullah",
        "email": "hafiz@example.com",
        "password": "password123",
        "nric": "S8567891C",
        "allows_tracking": False
    },
    {
        "name": "David Tan Wei Jie",
        "email": "davidtan@example.com",
        "password": "password123",
        "nric": "S7654321E",
        "allows_tracking": True
    }
]

async def _migrate_initial_users():
    """Migrate initial mock users to database if they don't exist"""
    for user_data in _initial_users:
        # Check if user already exists
        existing_user = await get_user_by_email(user_data["email"])
        if not existing_user:
            password_hash = hashlib.sha256(user_data["password"].encode()).hexdigest()
            user_id = f"user_{user_data['nric']}"
            try:
                await create_user(
                    user_id=user_id,
                    name=user_data["name"],
                    email=user_data["email"],
                    password_hash=password_hash,
                    nric=user_data["nric"],
                    allows_tracking=user_data["allows_tracking"]
                )
            except Exception as e:
                # User might already exist by NRIC, skip
                print(f"[AuthRouter] Skipping migration of {user_data['email']}: {e}")

def _generate_token() -> str:
    """Generate a secure random token"""
    return secrets.token_urlsafe(32)

def _hash_password(password: str) -> str:
    """Hash a password using SHA256 (in production, use bcrypt)"""
    return hashlib.sha256(password.encode()).hexdigest()

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class SignUpRequest(BaseModel):
    name: str
    email: EmailStr
    password: str
    nric: str

class AuthResponse(BaseModel):
    success: bool
    message: Optional[str] = None
    user: Optional[Dict[str, Any]] = None
    token: Optional[str] = None

@router.post("/login", response_model=AuthResponse)
async def login(request: LoginRequest):
    """User login endpoint"""
    await ensure_db_initialized()
    
    user = await get_user_by_email(request.email)
    
    if not user:
        return AuthResponse(
            success=False,
            message="Account not found. Try Signing up instead."
        )
    
    password_hash = _hash_password(request.password)
    if user["password_hash"] != password_hash:
        return AuthResponse(
            success=False,
            message="Invalid email or password"
        )
    
    # Generate token
    token = _generate_token()
    await store_token(token, user["id"])
    
    return AuthResponse(
        success=True,
        user={
            "id": user["id"],
            "name": user["name"],
            "email": user["email"],
            "nric": user["nric"],
            "allows_tracking": user["allows_tracking"]
        },
        token=token
    )

@router.post("/signup", response_model=AuthResponse)
async def signup(request: SignUpRequest):
    """User sign up endpoint"""
    try:
        await ensure_db_initialized()
        
        # Validate NRIC format
        nric_valid, nric_error = validate_nric(request.nric)
        if not nric_valid:
            return AuthResponse(
                success=False,
                message=nric_error
            )
        
        # Normalize NRIC (uppercase, no spaces)
        normalized_nric = request.nric.strip().upper()
        
        # Check if email already exists
        existing_user = await get_user_by_email(request.email)
        if existing_user:
            return AuthResponse(
                success=False,
                message="Email already registered"
            )
        
        # Check if NRIC already exists
        existing_user = await get_user_by_nric(normalized_nric)
        if existing_user:
            return AuthResponse(
                success=False,
                message="NRIC already registered"
            )
        
        user_id = f"user_{normalized_nric}"
        password_hash = _hash_password(request.password)
        
        # Create new user (default: tracking not allowed, user can enable later)
        try:
            new_user = await create_user(
                user_id=user_id,
                name=request.name,
                email=request.email,
                password_hash=password_hash,
                nric=normalized_nric,
                allows_tracking=False  # Default to false, user must opt-in
            )
        except Exception as e:
            print(f"[AuthRouter] Error creating user: {e}")
            import traceback
            traceback.print_exc()
            return AuthResponse(
                success=False,
                message=f"Failed to create account: {str(e)}"
            )
        
        # Generate token and store it
        token = None
        try:
            token = _generate_token()
            await store_token(token, user_id)
        except Exception as e:
            print(f"[AuthRouter] Warning: Token storage failed (user was created): {e}")
            import traceback
            traceback.print_exc()
            # Continue anyway - user can login to get a token
        
        # Return success response
        return AuthResponse(
            success=True,
            user={
                "id": new_user["id"],
                "name": new_user["name"],
                "email": new_user["email"],
                "nric": new_user["nric"],
                "allows_tracking": new_user["allows_tracking"]
            },
            token=token
        )
    except Exception as e:
        print(f"[AuthRouter] Unexpected error in signup: {e}")
        import traceback
        traceback.print_exc()
        return AuthResponse(
            success=False,
            message=f"An unexpected error occurred: {str(e)}"
        )

@router.post("/singpass", response_model=AuthResponse)
async def singpass_login():
    """Singpass OAuth login endpoint (mock implementation)"""
    await ensure_db_initialized()
    
    # In a real implementation, this would handle Singpass OAuth flow
    # For now, we'll simulate by creating/finding a user based on Singpass data
    
    # Mock: Use first existing user as Singpass user (by email from initial users)
    if _initial_users:
        user = await get_user_by_email(_initial_users[0]["email"])
        if not user:
            return AuthResponse(
                success=False,
                message="No users available for Singpass login"
            )
    else:
        return AuthResponse(
            success=False,
            message="No users available for Singpass login"
        )
    
    # Generate token
    token = _generate_token()
    await store_token(token, user["id"])
    
    return AuthResponse(
        success=True,
        user={
            "id": user["id"],
            "name": user["name"],
            "email": user["email"],
            "nric": user["nric"],
            "allows_tracking": user["allows_tracking"]
        },
        token=token
    )

async def get_current_user_id(authorization: Optional[str] = Header(None)) -> str:
    """Extract user ID from authorization token"""
    await ensure_db_initialized()
    
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization header missing")
    
    token = authorization.replace("Bearer ", "").strip()
    user_id = await get_user_id_from_token(token)
    
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    return user_id

@router.get("/tracking-status/{user_id}")
async def get_tracking_status(user_id: str):
    """Get user's tracking permission status"""
    await ensure_db_initialized()
    
    user = await get_user_by_id(user_id)
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {"allows_tracking": user["allows_tracking"]}

@router.get("/recent-activity/{user_id}")
async def get_recent_activity(user_id: str):
    """Get user's recent activity message (if tracking is enabled)"""
    await ensure_db_initialized()
    
    user = await get_user_by_id(user_id)
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if not user["allows_tracking"]:
        raise HTTPException(status_code=403, detail="Tracking not enabled for this user")
    
    # Get user's name from NRIC
    nric = user["nric"]
    mock_scoot_api_client = MockScootAPIClient()
    
    try:
        # Try to get user data to see if there's recent travel activity
        user_data = await mock_scoot_api_client.get_user_data(user_id=user_id, nric=nric)
        
        # Get full country name from country code
        destination_code = user_data.destination
        destination_name = SCOOT_COUNTRY_CODE_TO_NAME_MAP.get(destination_code, destination_code)
        
        # Generate a proactive positive message based on their travel data
        messages = [
            f"Great news! I noticed you're planning a trip to {destination_name}. Perfect timing to get comprehensive travel insurance coverage!",
            f"Your upcoming adventure to {destination_name} sounds exciting! Let's make sure you're fully protected with travel insurance.",
            f"I see you have a trip coming up to {destination_name}! I'd love to help you find the perfect travel insurance plan for your journey.",
            f"Planning a getaway to {destination_name}? I'm here to ensure nothing ruins your adventure with the right insurance coverage!"
        ]
        
        import random
        message = random.choice(messages)
        
        return {"message": message}
    except Exception as e:
        print(f"[AuthRouter] Error fetching recent activity for user {user_id}: {e}")
        return {"message": "Welcome back! I'm here to help you with your travel insurance needs."}

@router.get("/user-info/{user_id}")
async def get_user_info(user_id: str):
    """Get user information by user ID"""
    await ensure_db_initialized()
    
    user = await get_user_by_id(user_id)
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {
        "id": user["id"],
        "name": user["name"],
        "email": user["email"],
        "nric": user["nric"],
        "allows_tracking": user["allows_tracking"]
    }
