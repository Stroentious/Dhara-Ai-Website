from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session
from slowapi import Limiter
from slowapi.util import get_remote_address

from app import models, schemas
from app.database import get_db
from app.auth import get_current_active_user
from app.pipelines.ai_context_pipeline import AIContextPipeline

router = APIRouter(prefix="/chat", tags=["chat"])
limiter = Limiter(key_func=get_remote_address)

@router.post("", response_model=schemas.ChatResponse)
@limiter.limit("20/minute")
async def chat(
    request: Request,
    chat_request: schemas.ChatRequest,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_active_user)
):
    """
    DHARA AI Conversational Advisor:
    Leverages AIContextPipeline for intent recognition, multi-modal context aggregation
    (soil, weather, crop, fertilizer, market prices), prompt injection defense, and grounded LLM output.
    """
    response_text = await AIContextPipeline.process_chat_query(
        db=db,
        user_id=current_user.id,
        raw_message=chat_request.message,
        field_id=chat_request.field_id
    )
    return schemas.ChatResponse(reply=response_text)
