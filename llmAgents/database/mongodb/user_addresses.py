from llmAgents.database.mongodb.connector import BaseMongoDBConnector

class UserAddressConnector(BaseMongoDBConnector):
    async def add_address(self, user_id: str, address: str, blockchain: str):
        try:
            if self.db is None:
                await self.connect()
                if self.db is None:
                    raise Exception("Database connection is not established")

            collection = self.db["user_addresses"]
            update_field = f"addresses.{blockchain}"
            result = await collection.update_one(
                {"user_id": user_id},
                {"$addToSet": {update_field: address}},
                upsert=True
            )
            if result.modified_count > 0 or result.upserted_id:
                self.logger.info(f"Address {address} added for user {user_id} on {blockchain}.")
                return "Address added successfully."
            return "No changes made."
        except Exception as e:
            self.logger.error(f"Failed to add address: {e}")
            raise Exception(f"Failed to add address: {e}")

    async def get_user_by_address(self, address: str):
        try:
            if self.db is None:
                await self.connect()
                if self.db is None:
                    raise Exception("Database connection is not established")

            collection = self.db["user_addresses"]
            user_data = await collection.find_one({
                "$or": [
                    {"addresses.ETH": {"$in": [address]}},
                    {"addresses.SUI": {"$in": [address]}}
                ]
            })

            if user_data:
                return user_data["user_id"]
            return None
        except Exception as e:
            self.logger.error(f"Failed to find user by address: {e}")
            raise Exception(f"Failed to find user by address: {e}")


    async def get_addresses(self, user_id: str):
        try:
            if self.db is None:
                await self.connect()
                if self.db is None:
                    raise Exception("Database connection is not established")

            collection = self.db["user_addresses"]
            user_data = await collection.find_one({"user_id": user_id})

            if user_data and user_data.get("addresses"):
                addresses = {}
                for blockchain, blockchain_addresses in user_data["addresses"].items():
                    addresses[blockchain] = blockchain_addresses
                return addresses

            return {}
        except Exception as e:
            self.logger.error(f"Failed to get addresses: {e}")
            raise Exception(f"Failed to get addresses: {e}")


if __name__ == "__main__":
    import asyncio
    async def main():
        x = UserAddressConnector(uri="mongodb://root:rootpassword@localhost:27017/", db_name="users")
        print(await x.get_user_by_address(address="0xe69f81b825d7dc31ee9becef4dbeab5cf30e3abb"))
    asyncio.run(main())