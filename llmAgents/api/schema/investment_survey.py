from pydantic import BaseModel
from typing import List

class InvestmentQuestion(BaseModel):
    question_id: str
    question_text: str
    options: List[str] = []

class InvestmentSurveyResponse(BaseModel):
    user_id: str
    answers: List[str]
    summary: str = ""