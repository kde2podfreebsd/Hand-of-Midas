from llmAgents.database.mongodb.connector import BaseMongoDBConnector
import pymongo
from datetime import datetime


class ChatHistoryConnector(BaseMongoDBConnector):
    async def create_collection(self):
        collections = await self.db.list_collection_names()
        if "chat_history" in collections:
            self.logger.info("Collection 'chat_history' already exists.")
        else:
            await self.db.create_collection("chat_history")
            self.logger.info("Collection 'chat_history' created.")

    async def insert_chat_entry(self, chat_entry: dict):
        await self.create_collection()
        collection = self.db["chat_history"]
        result = await collection.insert_one(chat_entry)
        self.logger.info(f"Inserted chat entry for user_id: {chat_entry.get('user_id')} with id: {result.inserted_id}")
        return result.inserted_id

    async def get_paginated_history(self, user_id: str, page: int = 1, page_size: int = 20):
        await self.create_collection()
        collection = self.db["chat_history"]
        skip = (page - 1) * page_size
        cursor = collection.find({"user_id": user_id}).sort("messages.timestamp", pymongo.DESCENDING).skip(skip).limit(page_size)
        history_entries = await cursor.to_list(length=page_size)

        for entry in history_entries:
            for message in entry.get("messages", []):
                if isinstance(message.get("timestamp"), str):
                    try:
                        message["timestamp"] = datetime.strptime(message["timestamp"], "%Y-%m-%d %H:%M:%S UTC")
                    except ValueError as e:
                        self.logger.error(f"Error parsing timestamp: {e}")

            entry["messages"] = list(reversed(entry["messages"]))

        return history_entries