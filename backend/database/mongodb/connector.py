from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.errors import OperationFailure
from backend.logger import setup_logger
from backend.database.mongodb.base import AbstractMongoDBConnector

class BaseMongoDBConnector(AbstractMongoDBConnector):
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

    async def close(self):
        if self.client:
            self.client.close()
            self.logger.info("Database connection closed.")

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