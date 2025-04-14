from pydantic import BaseModel
from typing import List

class ChatMessageResponse(BaseModel):
    user_id: str
    message: str
    date: str
    is_user: bool

class PaginatedChatHistoryResponse(BaseModel):
    history: List[ChatMessageResponse]
    page: int
