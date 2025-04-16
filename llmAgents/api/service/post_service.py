from llmAgents.database.mongodb.telegram_posts import TelegramPostConnector
from llmAgents.llm.llm_service.summary_llm import ChatGPTSummaryNewsService


class PostService:
    def __init__(self, connector: TelegramPostConnector):
        self.connector = connector
        self.llm = ChatGPTSummaryNewsService()

    async def get_paginated_posts(self, page: int):
        await self.connector.connect()
        posts = await self.connector.get_paginated_posts(page=page)
        await self.connector.close()
        return posts

    async def get_paginated_posts_by_tags(self, page: int, tags: list):
        await self.connector.connect()
        posts = await self.connector.get_posts_by_tags(page=page, tags_list=tags)
        await self.connector.close()
        return posts

    async def get_unique_tags(self):
        await self.connector.connect()
        tags = await self.connector.get_unique_tags()
        await self.connector.close()
        return tags

    async def get_news_summary_by_tags(self, tags: list) -> str:
        await self.connector.connect()
        posts_text = ''
        page = 1

        try:
            while True:
                posts = await self.connector.get_posts_by_tags(tags_list=tags, page=page)
                print("POSTS!!!!:"+str(posts))
                if not posts:
                    break
                for post in posts:
                    text = post.get("text", "").strip()
                    if text:
                        posts_text += text + "\n\n"
                page += 1

            print(posts_text)

            if posts_text == '':
                return False

            summary = await self.llm.generate_news_summary(news_text=posts_text)
            return summary

        except Exception as e:
            raise Exception(f"Failed to generate news summary: {e}")
        finally:
            await self.connector.close()

