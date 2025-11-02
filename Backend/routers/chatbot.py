import os
from fastapi import APIRouter, HTTPException
from typing import List
from groq import Groq
from pydantic import BaseModel

from Backend.schemas import ChatbotResponse, Recommendation, ScootUserData
from Backend.services.plan_recommender import PlanRecommender

router = APIRouter()
recommender = PlanRecommender()

# Initialize Groq client
groq_client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

async def _generate_conversational_summary(recommendation: Recommendation) -> str:
    """
    Generates a conversational and concise summary of a recommendation using an LLM.
    """
    # Add claims context to the prompt if available
    claims_context = ""
    if "Relevant to your past claim" in ''.join(recommendation.pros):
        claims_context = "\nConsidering the user's past claims, highlight how this plan addresses those specific needs or provides relevant coverage, making it a good fit for someone with similar past experiences."

    prompt = f"""As a helpful insurance agent, summarize the following insurance plan in a clear, concise, and conversational manner for a Scoot app user. Highlight the key benefits (pros) and any notable limitations (cons). Include citations where provided.{claims_context}

Plan Name: {recommendation.plan_name}
Description: {recommendation.description}
Pros: {'; '.join(recommendation.pros)}
Cons: {'; '.join(recommendation.cons)}
Citations: {'; '.join(recommendation.citations)}

Provide a summary that is easy to read and understand, as if you are speaking directly to the user.
"""
    try:
        chat_completion = groq_client.chat.completions.create(
            messages=[
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
            model="llama-3.1-8b-instant", # Using a fast model for summarization
            temperature=0.7,
            max_tokens=300,
        )
        return chat_completion.choices[0].message.content
    except Exception as e:
        print(f"[LLM Summary Error] Failed to generate summary: {e}")
        return f"**{recommendation.plan_name}**\nDescription: {recommendation.description}\nPros: {'; '.join(recommendation.pros)}\nCons: {'; '.join(recommendation.cons)}\nCitations: {'; '.join(recommendation.citations)}"

class QuestionRequest(BaseModel):
    question: str
    context: str | None = None  # Optional context about user's trip/insurance

@router.get("/ping")
def ping():
	return {"service": "chatbot", "status": "ok"}

@router.post("/ask")
async def ask_question(request: QuestionRequest):
    """
    Endpoint for general insurance-related Q&A using LLM.
    Acts as a helpful insurance specialist assistant.
    """
    try:
        system_prompt = """You are Haven, a friendly and knowledgeable travel insurance specialist assistant for MSIG.
Your role is to help users understand travel insurance, answer their questions about coverage, policies, and travel safety.

Guidelines:
1. Be conversational, warm, and helpful
2. Provide accurate, clear information about travel insurance
3. If asked about specific policy details you don't have, acknowledge that and suggest contacting MSIG directly
4. Keep responses concise but informative (2-4 sentences typically)
5. Use simple language, avoid jargon
6. If the question is not about insurance or travel, politely redirect to insurance-related topics
7. Never make up policy details or coverage amounts
8. Focus on educating users about insurance benefits and helping them make informed decisions"""

        user_prompt = request.question
        if request.context:
            user_prompt = f"Context: {request.context}\n\nUser question: {request.question}"

        chat_completion = groq_client.chat.completions.create(
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            model="llama-3.3-70b-versatile",  # Using best quality model for Q&A
            temperature=0.7,
            max_tokens=500,
        )

        answer = chat_completion.choices[0].message.content
        return {"answer": answer, "success": True}

    except Exception as e:
        print(f"[Q&A Error] Failed to generate answer: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to process question: {str(e)}")

@router.post("/recommend_plans", response_model=ChatbotResponse)
async def recommend_plans(user_data: ScootUserData):
    """
    Endpoint to get insurance plan recommendations based on user trip details.
    """
    print(f"[Chatbot Router] Received request for recommendations for user: {user_data.user_id}")
    try:
        recommendations = await recommender.get_recommended_plans(user_data)

        if not recommendations:
            # Return a user-friendly message when no insurance plans are found
            no_plans_message = (
                "I'm sorry, but I couldn't find any insurance plans available for your travel details at the moment.\n\n"
                "**Development Environment Limitation:**\n"
                "The Ancileo API development environment currently has limited product availability. "
                "This is a known limitation of the hackathon dev API and not an issue with your travel details.\n\n"
                "**In a production environment**, you would see insurance plans for your trip. "
                "The API is working correctly, but the dev server doesn't have products configured for all destination/date combinations.\n\n"
                "**For demonstration purposes**, you can:\n"
                "• Contact the hackathon organizers if you need specific test data\n"
                "• Check the API documentation for confirmed working examples\n"
                "• Continue testing other features of the application\n\n"
                "We apologize for this limitation in the development environment!"
            )
            return ChatbotResponse(message=no_plans_message, recommendations=[])

        response_message = "Hello there! Based on your Scoot trip details, here are the top insurance plans I recommend:\n\n"

        for i, rec in enumerate(recommendations):
            summary = await _generate_conversational_summary(rec)
            response_message += f"## Plan {i+1}:\n{summary}\n\n"

        return ChatbotResponse(message=response_message, recommendations=recommendations)

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except HTTPException:
        # Re-raise HTTP exceptions as-is
        raise
    except Exception as e:
        print(f"[Chatbot Router] Unexpected error in recommend_plans: {e}")
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")
