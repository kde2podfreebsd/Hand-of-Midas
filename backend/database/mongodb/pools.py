from backend.database.mongodb.connector import BaseMongoDBConnector
import pymongo


class PoolsConnector(BaseMongoDBConnector):
    async def connect(self):
        await super().connect()

    async def create_collection(self):
        await self.connect()
        collections = await self.db.list_collection_names()
        if "pools" in collections:
            self.logger.info("Collection 'pools' already exists.")
        else:
            await self.db.create_collection("pools")
            self.logger.info("Collection 'pools' created.")

    async def insert_or_update_pool(self, pool_data: dict, source: str):
        await self.connect()
        collection = self.db["pools"]

        pool_data["source"] = source

        existing_pool = await collection.find_one({"Pool Name": pool_data["Pool Name"], "source": source})

        if existing_pool:
            update_result = await collection.update_one(
                {"Pool Name": pool_data["Pool Name"], "source": source},
                {"$set": pool_data}
            )
            self.logger.info(
                f"Updated pool: {pool_data['Pool Name']}, matched {update_result.matched_count} document(s)")
        else:
            result = await collection.insert_one(pool_data)
            self.logger.info(f"Inserted new pool: {pool_data['Pool Name']} with id: {result.inserted_id}")
            return result.inserted_id

    async def get_pools(self, source: str = "*"):
        await self.connect()
        collection = self.db["pools"]

        query = {"source": source} if source != "*" else {}
        cursor = collection.find(query).sort("pool_name", pymongo.ASCENDING)

        pools = await cursor.to_list(length=100)
        formatted_pools = []
        for pool in pools:
            formatted_pool = {
                "Pool Name": pool["Pool Name"],
                "Protocol": pool["Protocol"],
                "Fee": pool["Fee"],
                "TVL": pool["TVL"],
                "APR": pool["APR"],
                "1D vol": pool["1D vol"],
                "30D vol": pool["30D vol"],
                "1D vol/TVL": pool["1D vol/TVL"]
            }
            formatted_pools.append(formatted_pool)

        return formatted_pools

if __name__ == "__main__":
    async def main():
        x = PoolsConnector(uri="mongodb://root:rootpassword@localhost:27017/", db_name="pools_data")
        print(await x.get_pools(source="*"))

    import asyncio
    asyncio.run(main())

