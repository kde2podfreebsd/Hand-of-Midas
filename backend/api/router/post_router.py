from fastapi import APIRouter, Depends, Query
from backend.api.schema.post import PaginatedPostsResponse, PostResponse, NewsTags, SummaryResponse
from backend.api.service.post_service import PostService
from backend.database.mongodb.telegram_posts import TelegramPostConnector
from typing import List

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

@router.get("/tags", response_model=NewsTags)
async def get_tags(service: PostService = Depends(get_post_service)):
    tags = await service.get_unique_tags()
    return NewsTags(tags=tags)

@router.get("/news_by_tag", response_model=PaginatedPostsResponse)
async def get_news_by_tag(
    page: int = Query(1, ge=1),
    tags: List[str] = Query(default=[]),
    service: PostService = Depends(get_post_service)
):
    posts = await service.get_paginated_posts_by_tags(page=page, tags=tags)
    return PaginatedPostsResponse(posts=posts, page=page)


@router.get("/summary_by_tag", response_model=SummaryResponse)
async def get_summary_by_tag(
        tags: List[str] = Query(default=[]),
        service: PostService = Depends(get_post_service)
):
    summary = await service.get_news_summary_by_tags(tags=tags)
    if summary == False:
        return SummaryResponse(summary="No posts found for the provided tags.")

    return SummaryResponse(summary=summary)