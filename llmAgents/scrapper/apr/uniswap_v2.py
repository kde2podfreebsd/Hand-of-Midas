import asyncio
import time
import logging
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service as ChromeService
from webdriver_manager.chrome import ChromeDriverManager
from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait
from logging.handlers import RotatingFileHandler
import os

from llmAgents.database.mongodb.pools import PoolsConnector

basedir = os.path.dirname(os.path.abspath(__file__))

logger = logging.getLogger('uniswap_parser')
logger.setLevel(logging.INFO)
handler = RotatingFileHandler(f"{basedir}/uniswap_parser.log", maxBytes=500 * 1024 * 1024, backupCount=5, encoding='utf-8')
formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
handler.setFormatter(formatter)
logger.addHandler(handler)


class UniswapPoolsParser:
    def __init__(self) -> None:
        self.__op = webdriver.ChromeOptions()
        self.__op.add_argument("--headless")
        self.__op.add_argument("excludeSwitches")
        self.__op.add_argument("useAutomationExtension")
        self.__op.add_argument("enable-automation")
        self.__op.add_argument(
            "user-agent=Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.125 Safari/537.36")
        self.driver = webdriver.Chrome(service=ChromeService(ChromeDriverManager().install()), options=self.__op)
        self.wait = WebDriverWait(self.driver, 20)
        self.BASE_URL = 'https://app.uniswap.org/explore/pools/v2'

        self.pools_connector = PoolsConnector(uri="mongodb://root:rootpassword@localhost:27017/", db_name="pools_data")

    async def close_parser(self) -> None:
        try:
            self.driver.quit()
        except Exception as e:
            logger.error(f"> Error closing driver: {e}")

    async def parse_pools(self):
        try:
            self.driver.get(url=self.BASE_URL)
            time.sleep(5)
            for _ in range(3):
                self.driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
                time.sleep(1)

            pools = WebDriverWait(self.driver, 10).until(
                lambda driver: driver.find_elements(by=By.XPATH,
                                                    value='//a[contains(@class, "sc-feUZmu") and contains(@class, "jHyqLr")]')
            )

            pools_data = {}
            for pool in pools:
                pool_text = pool.text.strip().split('\n')

                if len(pool_text) < 8:
                    continue

                pool_name = pool_text[1].strip()
                protocol = pool_text[2].strip()
                fee = pool_text[3].strip()
                tvl = pool_text[4].strip()
                apr = pool_text[5].strip()
                one_day_vol = pool_text[6].strip()
                thirty_day_vol = pool_text[7].strip()
                one_day_vol_tvl = pool_text[8].strip() if len(pool_text) > 8 else "<0.01"

                pools_data[pool_name] = {
                    "Pool Name": pool_name,
                    "Protocol": protocol,
                    "Fee": fee,
                    "TVL": tvl,
                    "APR": apr,
                    "1D vol": one_day_vol,
                    "30D vol": thirty_day_vol,
                    "1D vol/TVL": one_day_vol_tvl
                }
            print(pools_data.items())
            for pool_name, data in pools_data.items():
                await self.pools_connector.insert_or_update_pool(data, source="uniswap")

        except Exception as e:
            logger.error(f"> Error loading page: {e}")
            return

