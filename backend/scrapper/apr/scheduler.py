import asyncio
from backend.database.mongodb.pools import PoolsConnector
from backend.scrapper.apr.uniswap_v2 import UniswapPoolsParser
from backend.scrapper.apr.bluefin_pools_apr import BlueFin_Pools_APR_parser

async def main():
    pc = PoolsConnector(uri="mongodb://root:rootpassword@localhost:27017/", db_name="pools_data")
    await pc.create_collection()
    while True:
        print("run >>")
        up = UniswapPoolsParser()
        await up.parse_pools()
        await up.close_parser()
        bf = BlueFin_Pools_APR_parser()
        await bf.save_bluefin_pools()
        print("wait next run >>")
        await asyncio.sleep(300)

if __name__ == "__main__":
    asyncio.run(main())