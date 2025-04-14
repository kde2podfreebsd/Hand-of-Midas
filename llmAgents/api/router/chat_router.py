from fastapi import APIRouter, Depends, Query, HTTPException
from typing import List
from llmAgents.api.schema.chat import ChatMessageResponse, PaginatedChatHistoryResponse
from llmAgents.api.service.chat_service import ChatService
from llmAgents.database.mongodb.chat_history import ChatHistoryConnector

router = APIRouter(tags=["Chat"])

def get_chat_service() -> ChatService:
    connector = ChatHistoryConnector(
        uri="mongodb://root:rootpassword@localhost:27017/",
        db_name="chatdb"
    )
    return ChatService(connector)

@router.post("/chat/{user_id}/message", response_model=ChatMessageResponse)
async def send_message(user_id: str, message: str, service: ChatService = Depends(get_chat_service)):
    response = await service.send_message(user_id, message)
    return response

@router.get("/chat/{user_id}/history", response_model=PaginatedChatHistoryResponse)
async def get_chat_history(user_id: str, page: int = Query(1, ge=1), service: ChatService = Depends(get_chat_service)):
    history = await service.get_chat_history(user_id, page)
    return PaginatedChatHistoryResponse(history=history, page=page)

@router.put("/chat/{user_id}/message/{message_id}", response_model=ChatMessageResponse)
async def edit_message(user_id: str, message_id: str, new_message: str, service: ChatService = Depends(get_chat_service)):
    response = await service.edit_message(user_id, message_id, new_message)
    return response

@router.delete("/chat/{user_id}/message/{message_id}", response_model=ChatMessageResponse)
async def delete_message(user_id: str, message_id: str, service: ChatService = Depends(get_chat_service)):
    response = await service.delete_message(user_id, message_id)
    return response
