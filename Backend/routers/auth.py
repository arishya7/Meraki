from typing import Optional, Dict, Any
from fastapi import APIRouter, HTTPException, Depends, Header
from pydantic import BaseModel, EmailStr
from Backend.schemas import UserProfileResponse
from Backend.services.scoot_api import MockScootAPIClient, SCOOT_COUNTRY_CODE_TO_NAME_MAP
import secrets
import hashlib
from datetime import datetime

router = APIRouter()

# In-memory user store (in production, use a proper database)
# Structure: {email: {id, name, email, password_hash, nric, allows_tracking, created_at}}
_users_db: Dict[str, Dict[str, Any]] = {}
# Token store: {token: user_id}
_token_store: Dict[str, str] = {}

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

# Initialize with mock users
for user_data in _initial_users:
    password_hash = hashlib.sha256(user_data["password"].encode()).hexdigest()
    user_id = f"user_{user_data['nric']}"
    _users_db[user_data["email"]] = {
        "id": user_id,
        "name": user_data["name"],
        "email": user_data["email"],
        "password_hash": password_hash,
        "nric": user_data["nric"],
        "allows_tracking": user_data["allows_tracking"],
        "created_at": datetime.now().isoformat()
    }

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
    user = _users_db.get(request.email)
    
    if not user:
        return AuthResponse(
            success=False,
            message="Invalid email or password"
        )
    
    password_hash = _hash_password(request.password)
    if user["password_hash"] != password_hash:
        return AuthResponse(
            success=False,
            message="Invalid email or password"
        )
    
    # Generate token
    token = _generate_token()
    _token_store[token] = user["id"]
    
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
    if request.email in _users_db:
        return AuthResponse(
            success=False,
            message="Email already registered"
        )
    
    # Check if NRIC already exists
    existing_user = next((u for u in _users_db.values() if u["nric"] == request.nric), None)
    if existing_user:
        return AuthResponse(
            success=False,
            message="NRIC already registered"
        )
    
    user_id = f"user_{request.nric}"
    password_hash = _hash_password(request.password)
    
    # Create new user (default: tracking not allowed, user can enable later)
    new_user = {
        "id": user_id,
        "name": request.name,
        "email": request.email,
        "password_hash": password_hash,
        "nric": request.nric,
        "allows_tracking": False,  # Default to false, user must opt-in
        "created_at": datetime.now().isoformat()
    }
    
    _users_db[request.email] = new_user
    
    # Generate token
    token = _generate_token()
    _token_store[token] = user_id
    
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

@router.post("/singpass", response_model=AuthResponse)
async def singpass_login():
    """Singpass OAuth login endpoint (mock implementation)"""
    # In a real implementation, this would handle Singpass OAuth flow
    # For now, we'll simulate by creating/finding a user based on Singpass data
    
    # Mock: Use first existing user as Singpass user
    if not _users_db:
        return AuthResponse(
            success=False,
            message="No users available for Singpass login"
        )
    
    # Get first user as mock Singpass user
    user = next(iter(_users_db.values()))
    
    # Generate token
    token = _generate_token()
    _token_store[token] = user["id"]
    
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

def get_current_user_id(authorization: Optional[str] = Header(None)) -> str:
    """Extract user ID from authorization token"""
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization header missing")
    
    token = authorization.replace("Bearer ", "").strip()
    user_id = _token_store.get(token)
    
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    return user_id

@router.get("/tracking-status/{user_id}")
async def get_tracking_status(user_id: str):
    """Get user's tracking permission status"""
    user = next((u for u in _users_db.values() if u["id"] == user_id), None)
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {"allows_tracking": user["allows_tracking"]}

@router.get("/recent-activity/{user_id}")
async def get_recent_activity(user_id: str):
    """Get user's recent activity message (if tracking is enabled)"""
    user = next((u for u in _users_db.values() if u["id"] == user_id), None)
    
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
    user = next((u for u in _users_db.values() if u["id"] == user_id), None)
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return {
        "id": user["id"],
        "name": user["name"],
        "email": user["email"],
        "nric": user["nric"],
        "allows_tracking": user["allows_tracking"]
    }
