from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

from .config import settings
from .rag import RagPipeline

app = FastAPI(title=settings.PROJECT_NAME)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatMessage(BaseModel):
    role: str # 'user' or 'assistant'
    content: str

class ChatRequest(BaseModel):
    message: str = Field(..., description="Query message for the climate chatbot")
    session_id: Optional[str] = Field(None, description="Conversation session identification uuid")
    history: Optional[List[ChatMessage]] = Field(default=[], description="Previous chat conversation history")

@app.get("/health")
def health():
    return {"status": "healthy", "service": "chatbot-service"}

@app.post("/chat")
def post_chat_query(req: ChatRequest):
    """
    Submits user prompt to the LangChain RAG pipeline for climate policy recommendations.
    """
    if not req.message.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Chat query cannot be empty"
        )
        
    try:
        # Convert Pydantic history object list to simple dicts
        history_list = [{"role": h.role, "content": h.content} for h in req.history]
        
        response_data = RagPipeline.generate_response(
            query=req.message,
            history=history_list
        )
        
        return {
            "success": True,
            "session_id": req.session_id or "default-session",
            "data": response_data
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"RAG processing failed: {str(e)}"
        )
