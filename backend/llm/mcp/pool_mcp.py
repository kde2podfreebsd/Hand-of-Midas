from backend.database.mongodb.pools import PoolsConnector
from backend.llm.llm_agents.summary_llm import ChatGPTSummaryNewsService

class PoolMCP:
    def __init__(self):
        self.connector = PoolsConnector(
            uri="mongodb://root:rootpassword@localhost:27017/",
            db_name="pools_data"
        )

    async def get_pools(self):
        await self.connector.connect()
        pools = await self.connector.get_pools(source="uniswap")
        await self.connector.close()
        return pools