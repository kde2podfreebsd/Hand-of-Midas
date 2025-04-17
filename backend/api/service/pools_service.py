from backend.database.mongodb.pools import PoolsConnector
from typing import List
from backend.api.schema.pools import PoolResponse


class PoolsService:
    def __init__(self, mongodb_uri: str, db_name: str):
        self.mongodb_uri = mongodb_uri
        self.db_name = db_name
        self.connector = PoolsConnector(uri=self.mongodb_uri, db_name=self.db_name)

    async def get_pools(self, source: str = "*") -> List[PoolResponse]:
        pools_data = await self.connector.get_pools(source)

        formatted_pools = [
            PoolResponse(
                pool_name=pool["Pool Name"],
                protocol=pool["Protocol"],
                fee=pool["Fee"],
                tvl=pool["TVL"],
                apr=pool["APR"],
                vol_1d=pool["1D vol"],
                vol_30d=pool["30D vol"],
                vol_tvl_ratio=pool["1D vol/TVL"]
            ) for pool in pools_data
        ]
        return formatted_pools