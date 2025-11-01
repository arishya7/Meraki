from fastapi import FastAPI
from dotenv import load_dotenv # Import load_dotenv

# Load environment variables from .env file at the project root
load_dotenv()

from .routers import chatbot, quote, payment, claims, user, flights
from .services.policy_intelligence import api as policy_api
from .services.claims_db_client import ClaimsDBClient # Import ClaimsDBClient

app = FastAPI(title="Insurance API")

app.include_router(chatbot.router, prefix="/chat")
app.include_router(user.router, prefix="/user")
app.include_router(flights.router, prefix="/flights")
app.include_router(quote.router, prefix="/quote")
app.include_router(payment.router, prefix="/payment")
app.include_router(claims.router, prefix="/claims")
app.include_router(policy_api.router, prefix="/policy")

# Initialize ClaimsDBClient
claims_db_client = ClaimsDBClient()

@app.get("/")
def root():
    return {"message": "Backend running successfully!"}

@app.on_event("startup")
async def startup_event():
    print("Initializing policy cache...")
    policy_api.load_policy_cache()
    
    print("Connecting to claims database...")
    await claims_db_client.connect()

    # Print all registered routes for debugging
    print("\n--- Registered FastAPI Routes ---")
    for route in app.routes:
        print(f"Path: {route.path}, Methods: {route.methods}")
    print("-------------------------------\n")

@app.on_event("shutdown")
async def shutdown_event():
    print("Disconnecting from claims database...")
    await claims_db_client.disconnect()
