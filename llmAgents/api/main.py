from fastapi import FastAPI
from llmAgents.api.router import (
    post_router,
    chat_router,
    investment_router,
    pools_router
)

app = FastAPI()

app.include_router(post_router.router)
app.include_router(chat_router.router)
app.include_router(investment_router.router)
app.include_router(pools_router.router)