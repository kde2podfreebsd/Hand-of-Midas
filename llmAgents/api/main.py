from fastapi import FastAPI
from llmAgents.api.router import post_router

app = FastAPI()
app.include_router(post_router.router)
