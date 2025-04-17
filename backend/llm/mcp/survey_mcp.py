from backend.database.mongodb.survey import InvestmentSurveyConnector
from backend.llm.llm_agents.summary_llm import ChatGPTSummaryNewsService

class SurveyMCP:
    def __init__(self):
        self.connector = InvestmentSurveyConnector(
            uri="mongodb://root:rootpassword@localhost:27017/",
            db_name="chat_db"
        )

    async def get_survey(self, user_id):
        await self.connector.connect()
        answers = await self.connector.get_answers(user_id)
        await self.connector.close()
        return answers.summary