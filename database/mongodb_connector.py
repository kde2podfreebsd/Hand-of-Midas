from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.errors import OperationFailure
from logger.logger import setup_logger
from datetime import datetime


class MongoDBConnector:
    def __init__(self, uri, db_name):
        self.db_uri = uri
        self.db_name = db_name
        self.client = None
        self.db = None
        self.logger = setup_logger(__name__)

    async def connect(self):
        try:
            self.client = AsyncIOMotorClient(self.db_uri, serverSelectionTimeoutMS=30000)
            self.db = self.client[self.db_name]
            await self.check_connection()
            self.logger.info(f"Connected to database: {self.db_name}")
        except ConnectionError as e:
            self.logger.error(f"Connection error: {e}")
            raise ConnectionError(f"Connection error: {e}")
        except OperationFailure as e:
            self.logger.error(f"Operation failed: {e}")
            raise OperationFailure(f"Operation failed: {e}")

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

    async def get_db(self):
        if not self.client:
            self.logger.error("No connection established")
            raise Exception("No connection established")
        return self.db

    async def check_connection(self):
        try:
            await self.db.command("ping")
            self.logger.info("Connection to database is active.")
        except Exception as e:
            self.logger.error(f"Connection check failed: {e}")
            raise Exception(f"Connection check failed: {e}")

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

    async def read_documents(self, collection_name, query={}, limit=10):
        try:
            collection = self.db[collection_name]
            cursor = collection.find(query).limit(limit)
            documents = await cursor.to_list(length=limit)
            self.logger.info(f"Read {len(documents)} documents from collection '{collection_name}'")
            return documents
        except Exception as e:
            self.logger.error(f"Failed to read documents from collection '{collection_name}': {e}")
            raise Exception(f"Failed to read documents: {e}")

    async def get_summary_by_interval(self, interval: str) -> str:
        try:
            await self.connect()

            if self.db is None:
                raise Exception("Database connection is not established")

            collection = self.db["news_summary"]
            query = {"interval": interval}
            document = await collection.find_one(query)
            if document is None:
                return f"Сводка для интервала {interval} не найдена"

            summary = document.get("summary")
            if summary is None:
                return "Сводка не содержит данных"

            return summary
        except Exception as e:
            self.logger.error(f"Failed to fetch summary for interval {interval}: {e}")
            raise Exception(f"Failed to fetch summary: {e}")

    async def insert_summary(self, summary_data: dict, interval: str):
        try:
            await self.connect()

            collection = self.db["news_summary"]
            query = {"interval": interval}
            existing_summary = await collection.find_one(query)
            if existing_summary:
                await collection.update_one(
                    query,
                    {
                        "$set": {
                            "summary": summary_data,
                            "updated_at": datetime.utcnow()
                        }
                    }
                )
                self.logger.info(f"Updated summary for interval: {interval}")
            else:
                summary_data["interval"] = interval
                summary_data["created_at"] = datetime.utcnow()
                await collection.insert_one(summary_data)
                self.logger.info(f"Inserted new summary for interval: {interval}")
        except Exception as e:
            self.logger.error(f"Failed to insert/update summary: {e}")
            raise Exception(f"Failed to insert/update summary: {e}")

    async def get_hour_summary(self) -> str:
        await self.connect()
        collection = self.db["news_summary"]
        existing_post = await collection.find_one({
            "interval": "hour",
        })
        if existing_post:
            return existing_post["summary"]

    async def get_hours_3_summary(self) -> str:
        await self.connect()

        return await self.get_summary_by_interval("hours_3")

    async def get_hours_6_summary(self) -> str:
        await self.connect()

        return await self.get_summary_by_interval("hours_6")

    async def get_hours_12_summary(self) -> str:
        await self.connect()

        return await self.get_summary_by_interval("hours_12")

    async def close(self):
        if self.client:
            self.client.close()
            self.logger.info("Database connection closed.")


if __name__ == "__main__":
    import asyncio


    async def test():
        connector = MongoDBConnector(uri="mongodb://root:rootpassword@mongodb:27017/", db_name="news")
        await connector.connect()
        # result = await connector.create_post_collection()
        # print(f"Create collection result: {result}")
        documents = await connector.read_documents("telegram_posts")
        print(f"Documents: {documents}")
        await connector.close()


    asyncio.run(test())