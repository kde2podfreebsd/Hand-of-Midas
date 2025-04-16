import os
import json

class TransactionsService:
    def __init__(self):
        pass

    def get_user_transactions(self, user_id):
        basedir = f'{os.path.abspath(os.path.dirname(__file__))}'
        with open(f'{basedir}/mock_tx.json') as f:
            tx_data = json.load(f)

        return tx_data


