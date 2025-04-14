from llmAgents.database.mongodb.connector import BaseMongoDBConnector
from datetime import datetime

class ChatHistoryConnector(BaseMongoDBConnector):
    def __init__(self, uri, db_name):
        super().__init__(uri, db_name)

    async def connect(self):
        try:
            await super().connect()  # Вызовем connect родительского класса для установки соединения.
            if not self.db:
                raise ValueError("Database connection not established.")
            self.logger.info(f"Connected to database: {self.db_name}")
        except Exception as e:
            self.logger.error(f"Error connecting to the database: {e}")
            raise Exception(f"Error connecting to the database: {e}")

    async def insert_message(self, user_id: str, message: str, is_user: bool):
        await self.connect()  # Ensure the connection is established before performing any operations.
        collection = self.db["chat_history"]
        message_data = {
            "user_id": user_id,
            "message": message,
            "date": datetime.utcnow(),
            "is_user": is_user
        }
        result = await collection.insert_one(message_data)
        return {"user_id": user_id, "message": message, "date": message_data["date"].isoformat(), "is_user": is_user}

    async def get_paginated_history(self, user_id: str, page: int, page_size: int = 20):
        await self.connect()  # Ensure the connection is established before performing any operations.
        collection = self.db["chat_history"]
        skip = (page - 1) * page_size
        cursor = collection.find({"user_id": user_id}).sort("date", -1).skip(skip).limit(page_size)
        documents = await cursor.to_list(length=page_size)

        return [
            {
                "user_id": doc["user_id"],
                "message": doc["message"],
                "date": doc["date"].isoformat(),
                "is_user": doc["is_user"]
            }
            for doc in documents
        ]

    async def edit_message(self, user_id: str, message_id: str, new_message: str):
        collection = self.db["chat_history"]
        result = await collection.update_one(
            {"_id": message_id, "user_id": user_id},
            {"$set": {"message": new_message}}
        )
        return result.modified_count

    async def delete_message(self, user_id: str, message_id: str):
        collection = self.db["chat_history"]
        await collection.delete_one({"_id": message_id, "user_id": user_id})

    async def delete_subsequent_messages(self, user_id: str, message_id: str):
        collection = self.db["chat_history"]
        # Удалить все сообщения, которые идут после удаленного
        await collection.delete_many({"user_id": user_id, "date": {"$gt": message_id}})
