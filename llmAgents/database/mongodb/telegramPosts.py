from llmAgents.database.mongodb.connector import BaseMongoDBConnector
import pytz

class TelegramPostConnector(BaseMongoDBConnector):
    async def create_post_collection(self):
        collections = await self.db.list_collection_names()
        if "telegram_posts" in collections:
            self.logger.info("Collection 'telegram_posts' already exists.")
            return "Collection already exists."
        else:
            await self.db.create_collection("telegram_posts")
            self.logger.info("Collection 'telegram_posts' created.")
            return "Collection created."

    async def truncate_post_collection(self):
        await self.db["telegram_posts"].drop()
        self.logger.info("Collection 'telegram_posts' dropped.")
        return "Collection dropped."

    async def insert_post(self, post_data):
        try:
            collection = self.db["telegram_posts"]
            existing_post = await collection.find_one({
                "channel.id": post_data["channel"]["id"],
                "message_id": post_data["message_id"]
            })
            if existing_post:
                self.logger.info(
                    f"Post already exists: channel_id={post_data['channel']['id']}, message_id={post_data['message_id']}")
                return "Post already exists."
            await collection.insert_one(post_data)
            self.logger.info(f"Inserted post with ID: {post_data.get('_id')}")
            return "Post inserted successfully."
        except Exception as e:
            self.logger.error(f"Failed to insert post: {e}")
            raise Exception(f"Failed to insert post: {e}")

    async def tag_post(self, post_id, tags):
        try:
            collection = self.db["telegram_posts"]
            result = await collection.update_one(
                {"_id": post_id},
                {"$set": {"tags": tags}}
            )
            if result.modified_count == 0:
                self.logger.info(f"No post found or updated with ID: {post_id}")
                return "No post found to tag."
            self.logger.info(f"Tagged post {post_id} with tags: {tags}")
            return "Post tagged successfully."
        except Exception as e:
            self.logger.error(f"Failed to tag post {post_id}: {e}")
            raise Exception(f"Failed to tag post: {e}")

    async def get_paginated_posts(self, page: int = 1, page_size: int = 20):
        try:
            collection = self.db["telegram_posts"]
            skip = (page - 1) * page_size
            cursor = collection.find().sort("date", -1).skip(skip).limit(page_size)
            documents = await cursor.to_list(length=page_size)

            formatted_posts = []
            for doc in documents:
                formatted_posts.append({
                    "text": doc.get("text", ""),
                    "date": doc["date"].astimezone(pytz.UTC).strftime("%Y-%m-%d %H:%M:%S UTC"),
                    "source": doc["channel"]["title"],
                    "views": doc.get("views", 0),
                    "link": f"https://t.me/{doc['channel']['username'].lstrip('@')}/{doc['message_id']}"
                })

            return formatted_posts
        except Exception as e:
            self.logger.error(f"Failed to get paginated posts: {e}")
            raise Exception(f"Failed to get paginated posts: {e}")


if __name__ == "__main__":
    import asyncio
    async def test():
        connector = TelegramPostConnector(uri="mongodb://root:rootpassword@localhost:27017/", db_name="news")
        await connector.connect()
        result = await connector.create_post_collection()
        print(f"Create collection result: {result}")
        await connector.close()
    asyncio.run(test())
