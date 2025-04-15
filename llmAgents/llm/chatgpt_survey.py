from llmAgents.llm.chatgpt_service import ChatGPTService as BaseChatGPTService

class ChatGPTSurveyService(BaseChatGPTService):
    async def generate_summary(self, questions_and_answers: list) -> str:
        prompt = "Ваши ответы на инвестиционные вопросы:\n"
        for idx, (question, answer) in enumerate(questions_and_answers):
            prompt += f"Вопрос {idx + 1}: {question}\nОтвет: {answer}\n"
        prompt += "\nПожалуйста, предоставьте общее саммари для инвестора."

        summary = await self.send_message("survey-summary", prompt)
        return summary