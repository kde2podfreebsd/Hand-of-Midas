from llmAgents.database.mongodb.telegram_posts import TelegramPostConnector


class PostService:
    def __init__(self, connector: TelegramPostConnector):
        self.connector = connector

    async def get_paginated_posts(self, page: int):
        await self.connector.connect()
        posts = await self.connector.get_paginated_posts(page=page)
        await self.connector.close()
        return posts
