from pydantic import BaseModel
from typing import List


class PostResponse(BaseModel):
    text: str
    date: str
    source: str
    views: int
    link: str


class PaginatedPostsResponse(BaseModel):
    posts: List[PostResponse]
    page: int
