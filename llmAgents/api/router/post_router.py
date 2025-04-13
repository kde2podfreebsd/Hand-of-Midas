from fastapi import APIRouter, Depends, Query
from llmAgents.api.schema.post import PaginatedPostsResponse, PostResponse
from llmAgents.api.service.post_service import PostService
from llmAgents.database.mongodb.telegramPosts import TelegramPostConnector

router = APIRouter(tags=["News"])


def get_post_service() -> PostService:
    connector = TelegramPostConnector(
        uri="mongodb://root:rootpassword@localhost:27017/",
        db_name="news"
    )
    return PostService(connector)


@router.get("/news", response_model=PaginatedPostsResponse)
async def get_news(page: int = Query(1, ge=1), service: PostService = Depends(get_post_service)):
    posts = await service.get_paginated_posts(page=page)
    return PaginatedPostsResponse(posts=posts, page=page)
