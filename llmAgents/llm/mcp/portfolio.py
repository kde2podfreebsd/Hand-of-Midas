import httpx
from typing import List
import os
import json

class PortfolioMCP:

    def __init__(self):
        pass

    def get_portfolio(self, addresses: List[str]):
        portfolio = ''
        #for blockchain in addresses:
            #for address in blockchain:
                #portfolio += httpx.get(url=f"/analytics/{blockchain.lower()}/balance?id={address}")

        #return portfolio
        basedir = f'{os.path.abspath(os.path.dirname(__file__))}'
        with open(f'{basedir}/../../api/service/mocks/mock_portfolio.json') as f:
            tx_data = json.load(f)

        return tx_data

p = PortfolioMCP()
print(p.get_portfolio(addresses={'eth': [], 'sui': []}))
