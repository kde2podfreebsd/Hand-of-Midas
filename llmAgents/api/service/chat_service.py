from llmAgents.database.mongodb.chat_history import ChatHistoryConnector
from llmAgents.llm.agent import ChatLLMAgent
from typing import List

class ChatService:
    def __init__(self, connector: ChatHistoryConnector):
        self.connector = connector
        self.llm_agent = ChatLLMAgent()

    async def send_message(self, user_id: str, message: str):
        # Сохранение сообщения в базе данных
        response = await self.connector.insert_message(user_id, message, is_user=True)
        # Генерация ответа от LLM
        llm_response = await self.llm_agent.get_response(message)
        response = await self.connector.insert_message(user_id, llm_response, is_user=False)
        return response

    async def get_chat_history(self, user_id: str, page: int):
        return await self.connector.get_paginated_history(user_id, page)

    async def edit_message(self, user_id: str, message_id: str, new_message: str):
        await self.connector.edit_message(user_id, message_id, new_message)
        # Прерывание текущего запроса LLM, если редактируется активное сообщение
        await self.llm_agent.stop_current_request()
        return {"message": "Message edited successfully"}

    async def delete_message(self, user_id: str, message_id: str):
        await self.connector.delete_message(user_id, message_id)
        # Удаление всех последующих сообщений
        await self.connector.delete_subsequent_messages(user_id, message_id)
        return {"message": "Message deleted successfully"}
