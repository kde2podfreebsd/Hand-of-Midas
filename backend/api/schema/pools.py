from pydantic import BaseModel

class PoolResponse(BaseModel):
    pool_name: str
    protocol: str
    fee: str
    tvl: str
    apr: str
    vol_1d: str
    vol_30d: str
    vol_tvl_ratio: str