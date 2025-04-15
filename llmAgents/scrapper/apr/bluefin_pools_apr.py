import httpx
import asyncio
from llmAgents.database.mongodb.pools import PoolsConnector

class BlueFin_Pools_APR_parser():
    def __init__(self):
        self.pools_connector = PoolsConnector(uri="mongodb://root:rootpassword@localhost:27017/", db_name="pools_data")

    async def get_bluefin_pools_apr(self):
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"https://swap.api.sui-prod.bluefin.io/api/v1/pools/info",
                headers={"accept": "application/json"},
            )
            response.raise_for_status()
            return response.json()

    async def format_bluefin_pool_data(self, bluefin_pools):
        formatted_pools = []
        for pool in bluefin_pools:
            formatted_pool = {
                "Pool Name": pool["symbol"],
                "Protocol": "Bluefin",
                "Fee": pool["feeRate"],
                "TVL": pool["tvl"],
                "APR": pool["month"]["apr"]["total"],
                "1D vol": pool["day"]["volume"],
                "30D vol": pool["month"]["volume"],
                "1D vol/TVL": pool["day"]["volumeQuoteQty"],
            }

            if "Pool Name" in formatted_pool:
                formatted_pools.append(formatted_pool)
            else:
                print(f"Warning: pool data missing 'Pool Name'. Skipping pool {pool}")

        return formatted_pools

    async def save_bluefin_pools(self):
        await self.pools_connector.create_collection()
        pools_data = await self.get_bluefin_pools_apr()
        formatted_pools = await self.format_bluefin_pool_data(pools_data)

        for pool_data in formatted_pools:
            await self.pools_connector.insert_or_update_pool(pool_data, source="bluefin")

