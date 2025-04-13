import httpx

def filter_top_pools_bluefin(pools_data):
    filtered_pools = []
    for pool in pools_data:
        if "day" in pool and "apr" in pool["day"]:
            apr_total = float(pool["day"]["apr"]["total"])
            symbol = pool.get("symbol", "Unknown")
            token_a = pool["tokenA"]["info"].get("symbol", "Unknown")
            token_b = pool["tokenB"]["info"].get("symbol", "Unknown")
            address = pool.get("address", "Unknown")

            filtered_pools.append({
                "address": address,
                "tokenA": token_a,
                "tokenB": token_b,
                "pool_name": symbol,
                "apr": apr_total
            })

    top_pools = sorted(filtered_pools, key=lambda x: x["apr"], reverse=True)[:25]
    print("FILTER POOLS: ", top_pools)
    return top_pools

async def get_bluefin_pools_apr():
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"https://swap.api.sui-prod.bluefin.io/api/v1/pools/info",
            headers={"accept": "application/json"},
        )
        print("GET BLUEFIN POOLS APR:", response.json())
        response.raise_for_status()
        return response.json()
