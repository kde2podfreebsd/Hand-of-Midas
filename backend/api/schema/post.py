from pydantic import BaseModel
from typing import List


class PostResponse(BaseModel):
    text: str
    date: str
    source: str
    views: int
    link: str
    tags: List[str]


class PaginatedPostsResponse(BaseModel):
    posts: List[PostResponse]
    page: int

class NewsTags(BaseModel):
    tags: List[str]

class SummaryResponse(BaseModel):
    summary: str
