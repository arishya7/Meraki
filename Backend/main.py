from fastapi import FastAPI
from .routers import chatbot, quote, payment, claims
from .services.policy_intelligence import api as policy_api

app = FastAPI(title="Insurance API")

app.include_router(chatbot.router, prefix="/chat")
app.include_router(quote.router, prefix="/quote")
app.include_router(payment.router, prefix="/payment")
app.include_router(claims.router, prefix="/claims")
app.include_router(policy_api.router, prefix="/policy")

@app.get("/")
def root():
    return {"message": "Backend running successfully!"}
