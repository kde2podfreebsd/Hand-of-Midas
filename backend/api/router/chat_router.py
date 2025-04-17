from fastapi import APIRouter, Depends, Query
from backend.api.schema.chat import SendMessageRequest, SendMessageResponse, PaginatedChatHistoryResponse
from backend.api.service.chat_service import ChatService
from datetime import datetime

router = APIRouter(tags=["Chat"])

def get_chat_service() -> ChatService:
    mongodb_uri = "mongodb://root:rootpassword@localhost:27017/"
    db_name = "chat_db"
    return ChatService(mongodb_uri, db_name)


@router.post("/chat/send_message", response_model=SendMessageResponse)
async def send_message_endpoint(
    request: SendMessageRequest,
    user_id: str = Query(..., description="User ID passed as query parameter"),
    service: ChatService = Depends(get_chat_service)
):
    response_text = await service.send_message(user_id, request.message)
    return SendMessageResponse(
        user_id=user_id,
        message=request.message,
        response=response_text,
        timestamp=datetime.utcnow()
    )

@router.get("/chat/history", response_model=PaginatedChatHistoryResponse)
async def get_history_endpoint(
    user_id: str,
    page: int = Query(1, ge=1),
    service: ChatService = Depends(get_chat_service)
):
    history = await service.get_history(user_id, page)
    return PaginatedChatHistoryResponse(entries=history, page=page)