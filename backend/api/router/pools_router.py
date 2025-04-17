from fastapi import APIRouter, Query, Depends
from backend.api.service.pools_service import PoolsService
from typing import List
from backend.api.schema.pools import PoolResponse

router = APIRouter(tags=["Pools"])

def get_pools_service() -> PoolsService:
    mongodb_uri = "mongodb://root:rootpassword@localhost:27017/"
    db_name = "pools_data"
    return PoolsService(mongodb_uri, db_name)

@router.get("/pools", response_model=List[PoolResponse])
async def get_pools_endpoint(
    source: str = Query("*", description="Source of the pools, can be *, uniswap, bluefin"),
    service: PoolsService = Depends(get_pools_service)
):
    pools = await service.get_pools(source)
    return pools