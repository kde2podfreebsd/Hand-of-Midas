from fastapi import FastAPI
from llmAgents.api.router import post_router
from llmAgents.api.router import chat_router

app = FastAPI()
app.include_router(post_router.router)
app.include_router(chat_router.router)