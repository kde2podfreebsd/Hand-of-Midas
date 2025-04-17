from backend.llm.llm_agents.chat_llm import ChatGPTChatService
from backend.database.mongodb.chat_history import ChatHistoryConnector

class ChatService:
    def __init__(self, mongodb_uri: str, db_name: str):
        self.mongodb_uri = mongodb_uri
        self.db_name = db_name
        self.chatgpt_service = ChatGPTChatService()

    async def send_message(self, user_id: str, message: str) -> str:
        await self.chatgpt_service.setup_history_connector(self.mongodb_uri, self.db_name)
        response_text = await self.chatgpt_service.send_message(user_id, message)
        await self.chatgpt_service.close_history_connector()
        return response_text

    async def get_history(self, user_id: str, page: int) -> list:
        connector = ChatHistoryConnector(self.mongodb_uri, self.db_name)
        await connector.connect()
        history = await connector.get_paginated_history(user_id=user_id, page=page)
        await connector.close()
        return history
