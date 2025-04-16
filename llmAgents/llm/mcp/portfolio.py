import httpx
from typing import List

class PortfolioMCP:

    def __init__(self):
        pass

    def get_portfolio(self, addresses: List[str]):
        portfolio = ''
        for blockchain in addresses:
            for address in blockchain:
                portfolio += httpx.get(url=f"/analytics/{blockchain.lower()}/balance?id={address}")

        #return portfolio
        return {
            
        }
