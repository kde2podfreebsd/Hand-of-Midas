from llmAgents.database.mongodb.connector import BaseMongoDBConnector
from llmAgents.api.schema.investment_survey import *

class InvestmentSurveyConnector(BaseMongoDBConnector):
    async def create_collection(self):
        collections = await self.db.list_collection_names()
        if "investment_survey" in collections:
            self.logger.info("Collection 'investment_survey' already exists.")
        else:
            await self.db.create_collection("investment_survey")
            self.logger.info("Collection 'investment_survey' created.")

    async def save_answers(self, survey_response: InvestmentSurveyResponse):
        await self.create_collection()
        collection = self.db["investment_survey"]
        result = await collection.update_one(
            {"user_id": survey_response.user_id},
            {"$set": {"answers": survey_response.answers, "summary": survey_response.summary}},
            upsert=True
        )
        self.logger.info(f"Saved/Updated survey answers for user_id: {survey_response.user_id}")
        return result

    async def get_answers(self, user_id: str) -> InvestmentSurveyResponse:
        await self.create_collection()
        collection = self.db["investment_survey"]
        survey_data = await collection.find_one({"user_id": user_id})
        if survey_data:
            return InvestmentSurveyResponse(user_id=survey_data['user_id'], answers=survey_data['answers'], summary=survey_data.get('summary', ''))
        return InvestmentSurveyResponse(user_id=user_id, answers=[])

    async def update_summary(self, user_id: str, summary: str):
        await self.create_collection()
        collection = self.db["investment_survey"]
        await collection.update_one({"user_id": user_id}, {"$set": {"summary": summary}})
        self.logger.info(f"Updated summary for user_id: {user_id}")