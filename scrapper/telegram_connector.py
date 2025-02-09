from telethon import TelegramClient, events
import os
from datetime import datetime
from typing import List, Callable
from database.mongodb_connector import MongoDBConnector
import pytz
from dotenv import load_dotenv
from logger.logger import setup_logger

logger = setup_logger(__name__)

load_dotenv()


class UserAgentCore:
    app = None
    monitored_channels = None
    message_handler = None

    def __init__(self, session_name: str, api_id: int, api_hash: str):
        self.session_name = session_name
        self.sessions_dirPath = f'{os.path.abspath(os.path.dirname(__file__))}/sessions'
        self.monitored_channels = set()
        self.message_handler = None
        self.db_uri = f"mongodb://{os.getenv('MONGO_INITDB_ROOT_USERNAME')}:{os.getenv('MONGO_INITDB_ROOT_PASSWORD')}@localhost:27017/"
        self.db_name = "news"
        self.connector = MongoDBConnector(self.db_uri, self.db_name)

        if not os.path.exists(self.sessions_dirPath):
            os.makedirs(self.sessions_dirPath)
            logger.info(f"Created sessions directory: {self.sessions_dirPath}")

        self.app = TelegramClient(
            f"{self.sessions_dirPath}/{session_name}",
            api_id=api_id,
            api_hash=api_hash
        )
        logger.info(f"TelegramClient initialized for session: {session_name}")

    async def create_session(self):
        async with self.app as app:
            await app.send_message("me", f"init session {self.session_name}")
            logger.info(f"Session created and message sent: {self.session_name}")

    async def get_channel_history(self, channel_username: str, end_date: datetime):
        await self.connector.connect()
        collection_status = await self.connector.create_post_collection()
        logger.info(collection_status)

        posts_data = []

        if end_date.tzinfo is None:
            logger.error("end_date must have timezone information!")
            return posts_data

        async with self.app as app:
            try:
                chat = await app.get_input_entity(channel_username)
                channel = await app.get_entity(channel_username)
                channel_data = {
                    "id": channel.id,
                    "title": channel.title,
                    "username": channel_username
                }
                logger.info(f"Fetching history for channel: {channel_username}")

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

                    posts_data.append(post_data)
                    logger.debug(f"Fetched message: {post_data}")

                    await self.connector.insert_post(post_data)

                    if message.date < end_date:
                        logger.info("Reached the specified end date.")
                        break

                await self.connector.close()
                logger.info(f"Fetched {len(posts_data)} messages from {channel_username}")

            except Exception as e:
                logger.error(f"Error getting channel history: {e}")

        return posts_data

    async def add_channels_to_monitor(self, channels: List[str]):
        async with self.app as app:
            for channel in channels:
                try:
                    entity = await app.get_entity(channel)
                    self.monitored_channels.add(entity.id)
                    logger.info(f"Added channel {channel} to monitoring list")
                except Exception as e:
                    logger.error(f"Error adding channel {channel}: {e}")

    async def start_monitoring(self, callback: Callable):
        @self.app.on(events.NewMessage(chats=self.monitored_channels))
        async def handler(event):
            await self.connector.connect()
            collection_status = await self.connector.create_post_collection()
            logger.info(collection_status)
            message = event.message
            channel = await message.get_chat()

            message_data = {
                "channel": {
                    "id": channel.id,
                    "title": channel.title,
                    "username": channel.username
                },
                "message_id": message.id,
                "date": message.date,
                "text": message.text,
                "views": message.views,
            }
            await self.connector.insert_post(message_data)
            logger.info(f"New message inserted: {message_data}")
            await callback(message_data)

        logger.info("Starting message monitoring...")
        await self.app.start()
        await self.app.run_until_disconnected()

    async def stop_monitoring(self):
        await self.app.disconnect()
        logger.info("Monitoring stopped")

    async def close(self):
        await self.app.disconnect()
        logger.info("Connection closed.")


if __name__ == "__main__":
    channels_to_monitor = [
        "@suicommunity_news",
        "@markettwits",
        "@ftsec",
        "@navi_protocol",
        "@suilendprotocolcommunity",
        "@BluefinAnnouncements",
        "scallop_io"
    ]


    async def main():
        core = UserAgentCore("test_session", os.getenv('APP_ID'), os.getenv('API_HASH'))

        for channel in channels_to_monitor:
            await core.get_channel_history(channel_username=channel, end_date=datetime(2024, 12, 1, tzinfo=pytz.UTC))

        async def message_callback(message_data):
            logger.info(f"New message in {message_data}:")
            logger.info(message_data['text'])

        await core.add_channels_to_monitor(channels=channels_to_monitor)

        await core.start_monitoring(message_callback)


    import asyncio

    asyncio.run(main())