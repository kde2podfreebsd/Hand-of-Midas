import pandas as pd
from pybit.unified_trading import HTTP
import time
from dotenv import load_dotenv
import os


load_dotenv()
client = HTTP(
    testnet=False,
    api_key=os.getenv("BYBIT_API_KEY"),
    api_secret=os.getenv("BYBIT_API_SECRET"),
)


def get_kline_data(symbol: str, interval: str, start_timestamp: int, end_timestamp: int, filename: str,
                   limit: int = 200):

    all_data = []
    current_timestamp = start_timestamp

    while current_timestamp < end_timestamp:
        response = client.get_kline(
            category="linear",
            symbol=symbol,
            interval=interval,
            start=current_timestamp,
            end=end_timestamp,
            limit=limit
        )

        kline_data = response['result']

        if not kline_data:
            break

        all_data.extend(kline_data)
        current_timestamp = int(kline_data['list'][0][0]) + 1
        time.sleep(0.2)

    if not all_data:
        return

    df = pd.DataFrame(all_data)

    df['start_time'] = pd.to_datetime(df['start_time'], unit='ms')
    df['end_time'] = pd.to_datetime(df['end_time'], unit='ms')

symbol = "BTCUSDT"
interval = "60"
start_date = "2024-10-01"
end_date = "2024-11-01"

start_timestamp = int(time.mktime(time.strptime(start_date, "%Y-%m-%d")) * 1000)
end_timestamp = int(time.mktime(time.strptime(end_date, "%Y-%m-%d")) * 1000)

filename = "historical_data_btcusdt.csv"
get_kline_data(symbol, interval, start_timestamp, end_timestamp, filename)

