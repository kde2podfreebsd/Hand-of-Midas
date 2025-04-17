from backend.database.mongodb.connector import BaseMongoDBConnector
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

    async def is_exist(self, channel, message_id):
        collection = self.db["telegram_posts"]
        existing_post = await collection.find_one({
            "channel.id": channel,
            "message_id": message_id
        })
        if existing_post:
            self.logger.info(
                f"Post already exists: channel_id={channel}, message_id={message_id}")
            return True
        else:
            return False

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
                return existing_post["_id"]

            result = await collection.insert_one(post_data)
            self.logger.info(f"Inserted post with ID: {result.inserted_id}")
            return result.inserted_id
        except Exception as e:
            self.logger.error(f"Failed to insert post: {e}")
            raise Exception(f"Failed to insert post: {e}")

    async def get_unique_tags(self):
        try:
            collection = self.db["telegram_posts"]
            pipeline = [
                {"$match": {"tags": {"$exists": True, "$ne": None}}},
                {"$unwind": "$tags"},
                {"$group": {"_id": None, "unique_tags": {"$addToSet": "$tags"}}}
            ]
            result = await collection.aggregate(pipeline).to_list(length=1)
            if result:
                return result[0]["unique_tags"]
            return []
        except Exception as e:
            self.logger.error(f"Failed to get unique tags: {e}")
            raise Exception(f"Failed to get unique tags: {e}")

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
                    "link": f"https://t.me/{doc['channel']['username'].lstrip('@')}/{doc['message_id']}",
                    "tags": doc.get("tags", [])
                })

            return formatted_posts
        except Exception as e:
            self.logger.error(f"Failed to get paginated posts: {e}")
            raise Exception(f"Failed to get paginated posts: {e}")

    async def get_posts_by_tags(self, tags_list: list, page: int = 1, page_size: int = 20):
        try:
            collection = self.db["telegram_posts"]
            skip = (page - 1) * page_size

            query = {"tags": {"$in": tags_list}}

            cursor = collection.find(query).sort("date", -1).skip(skip).limit(page_size)
            documents = await cursor.to_list(length=page_size)

            formatted_posts = []
            for doc in documents:
                formatted_posts.append({
                    "text": doc.get("text", ""),
                    "date": doc["date"].astimezone(pytz.UTC).strftime("%Y-%m-%d %H:%M:%S UTC"),
                    "source": doc["channel"]["title"],
                    "views": doc.get("views", 0),
                    "link": f"https://t.me/{doc['channel']['username'].lstrip('@')}/{doc['message_id']}",
                    "tags": doc.get("tags", []),
                })

            return formatted_posts
        except Exception as e:
            self.logger.error(f"Failed to get posts by tags: {e}")
            raise Exception(f"Failed to get posts by tags: {e}")



if __name__ == "__main__":
    import asyncio
    async def test():
        connector = TelegramPostConnector(uri="mongodb://root:rootpassword@localhost:27017/", db_name="news")
        await connector.connect()
        print(await connector.get_unique_tags())
        # result = await connector.get_paginated_posts(page_size=20, page=1)
        # print(f"Create collection result: {result}")
        await connector.close()
    asyncio.run(test())
