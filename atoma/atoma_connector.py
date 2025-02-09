import httpx
from typing import List, Dict, Any
from dotenv import load_dotenv
import os

load_dotenv()


class AtomaAPIClient:
    def __init__(self):
        self.token = os.getenv("ATOMA_TOKEN")
        self.base_url = "https://api.atoma.network/v1"
        self.client = httpx.AsyncClient(timeout=httpx.Timeout(300))

    async def create_chat_completion(
        self,
        model: str,
        messages: List[Dict[str, str]]
    ) -> Dict[str, Any]:
        url = f"{self.base_url}/chat/completions"
        headers = {
            "Authorization": f"Bearer {self.token}",
            "Content-Type": "application/json",
        }
        data = {
            "model": model,
            "messages": messages
        }

        response = await self.client.post(url, headers=headers, json=data)
        response.raise_for_status()
        return response.json()

    async def close(self):
        await self.client.aclose()
