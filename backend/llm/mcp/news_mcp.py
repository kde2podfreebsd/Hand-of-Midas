from backend.database.mongodb.telegram_posts import TelegramPostConnector
from backend.llm.llm_agents.summary_llm import ChatGPTSummaryNewsService

class NewsMCP:
    def __init__(self):
        self.connector = TelegramPostConnector(
            uri="mongodb://root:rootpassword@localhost:27017/",
            db_name="news"
        )
        self.summary_llm = ChatGPTSummaryNewsService()

    async def get_tags(self):
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
                if not posts:
                    break
                for post in posts:
                    text = post.get("text", "").strip()
                    if text:
                        posts_text += text + "\n\n"
                page += 1

            if posts_text == '':
                return False

            print("\n\n!!!!POSTS TEXT:", posts_text)
            summary = await self.summary_llm.generate_news_summary(news_text=posts_text)
            return summary

        except Exception as e:
            raise Exception(f"Failed to generate news summary: {e}")
        finally:
            await self.connector.close()