if __name__ == "__main__":
    import asyncio
    from telethon_connector import UserAgentCore
    from dotenv import load_dotenv
    import os
    from datetime import datetime
    import uvloop
    import pytz

    load_dotenv()

    api_id = int(os.getenv("APP_ID"))
    api_hash = os.getenv("API_HASH")
    session_name = os.getenv("SESSION_NAME")

    async def main():
        x = UserAgentCore(session_name, api_id, api_hash)
        await x.create_session()
        await x.get_channel_history("banksta", datetime(2024, 11, 1, tzinfo=pytz.utc))
        await x.close()

    uvloop.install()
    asyncio.run(main())
