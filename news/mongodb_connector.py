from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.errors import OperationFailure

class MongoDBConnector:
    def __init__(self, uri, db_name):
        self.db_uri = uri
        self.db_name = db_name
        self.client = None
        self.db = None

    async def connect(self):
        try:
            self.client = AsyncIOMotorClient(self.db_uri)
            self.db = self.client[self.db_name]
            print(f"connected to {self.db_name}")
        except ConnectionError as e:
            raise (f"Connection error: {e}")
        except OperationFailure as e:
            raise(f"Operation failed: {e}")

    async def create_post_collection(self):
        collections = await self.db.list_collection_names()
        if "telegram_posts" in collections:
            return "Collection already exists."
        else:
            await self.db.create_collection("telegram_posts")
            return "Collection created."

    async def truncate_post_collection(self):
        await self.db["telegram_posts"].drop()
        return "Collection dropped."

    async def get_db(self):
        if not self.client:
            raise Exception("No connection established")
        return self.db

    async def check_connection(self):
        try:
            db = self.db
            await db.command("ping")
        except Exception as e:
            raise(e)

    async def insert_post(self, post_data):
        collection = self.db["telegram_posts"]
        await collection.insert_one(post_data)

    async def close(self):
        if self.client:
            self.client.close()