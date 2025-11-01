from fastapi import FastAPI
from .routers import chatbot, quote, payment, claims

app = FastAPI(title="Insurance API")

app.include_router(chatbot.router, prefix="/chat")
app.include_router(quote.router, prefix="/quote")
app.include_router(payment.router, prefix="/payment")
app.include_router(claims.router, prefix="/claims")

@app.get("/")
def root():
    return {"message": "Backend running successfully!"}
