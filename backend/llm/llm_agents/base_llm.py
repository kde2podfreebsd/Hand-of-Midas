import openai
from datetime import datetime
from backend.database.mongodb.chat_history import ChatHistoryConnector
from dotenv import load_dotenv
import os
import json

load_dotenv()

class ChatGPTService:

    def __init__(self):
        self.openai_api_key = os.getenv("OPENAI_API_KEY")
        openai.api_key = self.openai_api_key
        self.model = "gpt-4o-mini"
        self.history_connector = None

    async def setup_history_connector(self, uri: str, db_name: str):
        self.history_connector = ChatHistoryConnector(uri, db_name)
        await self.history_connector.connect()

    async def close_history_connector(self):
        if self.history_connector:
            await self.history_connector.close()
            self.history_connector = None

    async def make_request(self, user_id: str, message: str) -> str:
        try:
            client = openai.OpenAI(api_key=self.openai_api_key)

            response = client.chat.completions.create(
                model=self.model,
                messages=[{"role": "user", "content": message}]
            )

            assistant_reply = response.choices[0].message.content.strip()

        except Exception as e:
            raise Exception(f"OpenAI API error: {e}")

        return assistant_reply
