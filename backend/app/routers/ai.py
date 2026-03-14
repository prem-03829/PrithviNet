import logging
from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import StreamingResponse
from app.schemas.ai import ChatRequest, ChatResponse, HealthResponse
from app.services.ollama_service import OllamaService, MODEL_NAME
from app.services.database import get_supabase

# Configure logging
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/ai", tags=["ai"])

@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest, supabase=Depends(get_supabase)):
    reply = await OllamaService.generate_response(request.message)
    if reply.startswith("Error:"):
        raise HTTPException(status_code=503, detail=reply)
    
    # Log chat to Supabase
    try:
        supabase.table("ai_chat_logs").insert({
            "question": request.message,
            "response": reply,
            # user_id is null for now as routes are unauthenticated
        }).execute()
    except Exception as e:
        logger.warning(f"Failed to log chat to Supabase: {e}")
        
    return ChatResponse(reply=reply)

@router.post("/stream")
async def stream_chat(request: ChatRequest):
    # Streaming logs are complex, usually logged at the end or via callbacks
    # For now, we maintain the existing streaming behavior
    return StreamingResponse(
        OllamaService.stream_response(request.message),
        media_type="text/event-stream"
    )

@router.get("/health", response_model=HealthResponse)
async def health():
    return HealthResponse(status="ok", model=MODEL_NAME)
