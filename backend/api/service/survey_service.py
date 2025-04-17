from backend.database.mongodb.survey import InvestmentSurveyConnector
from backend.llm.llm_agents.survey_llm import ChatGPTSurveyService
from backend.api.schema.investment_survey import *
from typing import List

class SurveyService:
    def __init__(self, mongodb_uri: str, db_name: str):
        self.mongodb_uri = mongodb_uri
        self.db_name = db_name
        self.chatgpt_service = ChatGPTSurveyService()

    async def get_survey_questions(self) -> List[InvestmentQuestion]:
        questions = [
            InvestmentQuestion(
                question_id="1",
                question_text="Какую сумму вы планируете инвестировать в криптовалютные активы?",
                options=["Диапазон от 1000 до 5000 USD", "5% от капитала", "Конкретная сумма"]
            ),
            InvestmentQuestion(
                question_id="2",
                question_text="Какой временной горизонт вы планируете для своих инвестиций?",
                options=["До 1 года", "1-5 лет", "Более 5 лет"]
            ),
            InvestmentQuestion(
                question_id="3",
                question_text="Какую долю своего капитала вы готовы инвестировать в высокорисковые активы?",
                options=["0-10%", "10-30%", "30% и более"]
            ),
            InvestmentQuestion(
                question_id="4",
                question_text="Как часто вы планируете мониторить свои инвестиции и производить ребалансировку портфеля?",
                options=["Ежедневно", "Еженедельно", "Ежемесячно", "Квартально"]
            ),
            InvestmentQuestion(
                question_id="5",
                question_text="Какую роль играют эмоции в ваших инвестиционных решениях?",
                options=["Значительную", "Незначительную", "Не играют роли"]
            ),
        ]
        return questions

    async def submit_survey_answers(self, survey_response: InvestmentSurveyResponse) -> InvestmentSurveyResponse:
        connector = InvestmentSurveyConnector(self.mongodb_uri, self.db_name)
        await connector.connect()
        existing_answers = await connector.get_answers(survey_response.user_id)
        if existing_answers:
            survey_response.answers = [
                answer if answer else existing_answers.answers[idx]
                for idx, answer in enumerate(survey_response.answers)
            ]
        await connector.save_answers(survey_response)

        questions = await self.get_survey_questions()
        questions_and_answers = [(q.question_text, a) for q, a in zip(questions, survey_response.answers)]
        summary = await self.chatgpt_service.generate_summary(questions_and_answers)
        survey_response.summary = summary
        await connector.update_summary(survey_response.user_id, summary)
        await connector.close()
        return survey_response

    async def get_survey_answers(self, user_id: str) -> InvestmentSurveyResponse:
        connector = InvestmentSurveyConnector(self.mongodb_uri, self.db_name)
        await connector.connect()
        answers = await connector.get_answers(user_id)
        await connector.close()
        return answers