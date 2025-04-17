from fastapi import APIRouter, Depends, Query
from backend.api.schema.investment_survey import InvestmentQuestion, InvestmentSurveyResponse
from backend.api.service.survey_service import SurveyService
from typing import List

router = APIRouter(tags=["Investment Survey"])

def get_investment_service() -> SurveyService:
    mongodb_uri = "mongodb://root:rootpassword@localhost:27017/"
    db_name = "chat_db"
    return SurveyService(mongodb_uri, db_name)

@router.get("/survey/questions", response_model=List[str])
async def get_survey_questions(service: SurveyService = Depends(get_investment_service)):
    return [
        "Какую сумму вы планируете инвестировать в криптовалютные активы?",
        "Какой временной горизонт вы планируете для своих инвестиций?",
        "Какую долю своего капитала вы готовы инвестировать в высокорисковые активы?",
        "Как часто вы планируете мониторить свои инвестиции и производить ребалансировку портфеля?",
        "Какую роль играют эмоции в ваших инвестиционных решениях?"
    ]

@router.post("/survey/answers", response_model=InvestmentSurveyResponse)
async def submit_survey_answers(
    user_id: str,
    question_1: str = Query(..., description="Ответ на вопрос 1"),
    question_2: str = Query(..., description="Ответ на вопрос 2"),
    question_3: str = Query(..., description="Ответ на вопрос 3"),
    question_4: str = Query(..., description="Ответ на вопрос 4"),
    question_5: str = Query(..., description="Ответ на вопрос 5"),
    service: SurveyService = Depends(get_investment_service)
):
    answers = [question_1, question_2, question_3, question_4, question_5]
    survey_response = InvestmentSurveyResponse(user_id=user_id, answers=answers)
    return await service.submit_survey_answers(survey_response)

@router.get("/survey/answers", response_model=InvestmentSurveyResponse)
async def get_survey_answers(user_id: str, service: SurveyService = Depends(get_investment_service)):
    return await service.get_survey_answers(user_id)