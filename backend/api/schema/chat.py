from pydantic import BaseModel
from typing import List
from datetime import datetime

class Message(BaseModel):
    role: str
    content: str
    timestamp: datetime

class ChatEntry(BaseModel):
    user_id: str
    messages: List[Message]

class PaginatedChatHistoryResponse(BaseModel):
    entries: List[ChatEntry]
    page: int

class SendMessageRequest(BaseModel):
    message: str

class SendMessageResponse(BaseModel):
    user_id: str
    message: str
    response: str
    timestamp: datetime