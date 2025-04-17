from backend.api.router import (
    post_router,
    chat_router,
    survey_router,
    pools_router,
    user_address_router,
    transactions_route,
    portfolio_route
)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

def create_app() -> FastAPI:
    app = FastAPI(
        title="DeFI Wizzard",
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

    app.include_router(post_router.router)
    app.include_router(chat_router.router)
    app.include_router(survey_router.router)
    app.include_router(pools_router.router)
    app.include_router(user_address_router.router)
    app.include_router(transactions_route.router)
    app.include_router(portfolio_route.router)

    return app

app = create_app()

if __name__ == "__main__":
    uvicorn.run("api.main:app", host="0.0.0.0", port=8000, reload=True)