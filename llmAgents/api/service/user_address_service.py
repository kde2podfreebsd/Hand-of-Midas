from llmAgents.database.mongodb.user_addresses import UserAddressConnector

class UserAddressService:
    def __init__(self, connector: UserAddressConnector):
        self.connector = connector

    async def add_address(self, user_id: str, address: str, blockchain: str):
        if self.connector.db is None:
            await self.connector.connect()
        return await self.connector.add_address(user_id=user_id, address=address, blockchain=blockchain)

    async def get_user_by_address(self, address: str):
        return await self.connector.get_user_by_address(address=address)

