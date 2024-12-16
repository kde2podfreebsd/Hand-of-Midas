from telethon import TelegramClient
from mongodb_connector import MongoDBConnector
import os
from datetime import datetime

class UserAgentCore:
    app = None

    def __init__(self, session_name: str, api_id: int, api_hash: str):
        self.session_name = session_name
        self.sessions_dirPath = f'{os.path.abspath(os.path.dirname(__file__))}/sessions'
        self.db_uri = f"mongodb://{os.getenv('MONGO_INITDB_ROOT_USERNAME')}:{os.getenv('MONGO_INITDB_ROOT_PASSWORD')}@localhost:27017/"
        self.db_name = "test_db"
        self.connector = MongoDBConnector(self.db_uri, self.db_name)

        if not os.path.exists(self.sessions_dirPath):
            os.makedirs(self.sessions_dirPath)

        self.app = TelegramClient(f"{self.sessions_dirPath}/{session_name}", api_id=api_id, api_hash=api_hash)


    async def create_session(self):
        async with self.app as app:
            await app.send_message("me", f"init session {self.session_name}")

    async def get_channel_history(self, channel_username: str, end_date: datetime):
        await self.connector.connect()
        collection_status = await self.connector.create_post_collection()
        print(collection_status)
        if end_date.tzinfo is None:
            print("end_date must have timezone information!")
            return
        async with self.app as app:
            chat = await app.get_input_entity(channel_username)
            channel = await app.get_entity(channel_username)
            channel_data = {
                "id": channel.id,
                "title": channel.title
            }
            async for message in app.iter_messages(chat):
                if message.text is None:
                    continue

                post_data = {
                    "channel": channel_data,
                    "message_id": message.id,
                    "date": message.date,
                    "text": message.text,
                    "views": message.views,

                }
                await self.connector.insert_post(post_data)
                if message.date < end_date:
                    print("Reached the specified end date.")
                    return

        await self.connector.close()


    async def close(self):
        await self.app.disconnect()
        print("Connection closed.")

