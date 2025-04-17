import os
import json

class PortfolioService:
    def __init__(self):
        pass

    def get_user_portfolio(self, user_id):
        basedir = f'{os.path.abspath(os.path.dirname(__file__))}'
        with open(f'{basedir}/mocks/mock_portfolio.json') as f:
            tx_data = json.load(f)

        return tx_data


