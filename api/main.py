from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from api import news, portfolio, survey, chat

def create_app() -> FastAPI:
    app = FastAPI(
        title="Finkepeer AI Service",
        description="API для анализа портфеля, анкетирования, новостей и чата с AI-агентом",
        version="1.0.0"
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(chat.router, prefix="/chat", tags=["Chat"])
    app.include_router(news.router, prefix="/news", tags=["News"])
    app.include_router(portfolio.router, prefix="/portfolio", tags=["Portfolio"])
    app.include_router(survey.router, prefix="/survey", tags=["Survey"])
    return app

app = create_app()

if __name__ == "__main__":
    uvicorn.run("api.main:app", host="0.0.0.0", port=8000, reload=True)