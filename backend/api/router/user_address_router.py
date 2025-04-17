from fastapi import APIRouter, Depends, Query
from backend.api.service.user_address_service import UserAddressService
from backend.api.schema.user_address import UserAddressResponse

router = APIRouter(tags=["User Addresses"])


def get_address_service() -> UserAddressService:
    from backend.database.mongodb.user_addresses import UserAddressConnector
    connector = UserAddressConnector(uri="mongodb://root:rootpassword@localhost:27017/", db_name="users")
    return UserAddressService(connector)


@router.post("/addresses/{user_id}/add", response_model=str)
async def add_address(user_id: str, address: str, blockchain: str, service: UserAddressService = Depends(get_address_service)):
    return await service.add_address(user_id=user_id, address=address, blockchain=blockchain)

@router.get("/address/{address}", response_model=str)
async def get_user_by_address(address: str, service: UserAddressService = Depends(get_address_service)):
    user_id = await service.get_user_by_address(address=address)
    if user_id:
        return user_id
    return "User not found"