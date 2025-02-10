import httpx

async def get_sui_user_portfolio(wallet: str):
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"http://85.193.82.109:8080/api/balance?id={wallet}",
            headers={"accept": "application/json"},
        )
        response.raise_for_status()
        return response.json()