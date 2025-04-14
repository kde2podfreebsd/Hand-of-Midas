import openai
from llmAgents.logger.logger import setup_logger
from typing import Optional

logger = setup_logger(__name__)

class ChatLLMAgent:
    def __init__(self):
        self.current_request = None
        openai.api_key = 'your-openai-api-key'

    async def get_response(self, message: str) -> str:
        prompt = f"Ты финансовый консультант в области De-Fi. Пожалуйста, ответь на вопрос пользователя: {message}"

        response = openai.Completion.create(
            model="gpt-4-turbo",
            prompt=prompt,
            max_tokens=150
        )
        return response.choices[0].text.strip()

    async def stop_current_request(self):
        if self.current_request:
            logger.info("Stopping current LLM request...")
            self.current_request = None
