import os
from dotenv import load_dotenv
from pymongo.errors import OperationFailure
from motor.motor_asyncio import AsyncIOMotorClient
from atoma.atoma_connector import AtomaAPIClient
from datetime import datetime, timedelta
from logger.logger import setup_logger
from typing import List, Dict
import re

load_dotenv()

def clean_llm_response(response: str) -> str:
    pattern = r"<think>.*?</think>"
    cleaned_response = re.sub(pattern, "", response, flags=re.DOTALL)
    return cleaned_response.strip()

def escape_special_characters(text: str) -> str:
    return text.replace("{", "{{").replace("}", "}}")

PROMPT_HOURLY = """
Проанализируйте новости за последний час и создайте структурированную сводку новостей. Включите следующие аспекты:
- main_events: Главные события за последний час (с указанием источников).
- macro_indicators: Изменение ключевых макроэкономических показателей (цена BTC, цена ETH, объем торгов, индекс волатильности и т.д.).
- market_trend: Общая тенденция на рынке (рост/стабильность/падение).
- sentiment_analysis: Тональность новостей (позитивная/нейтральная/негативная).
- forecast: Прогноз на ближайшие несколько часов.
- sui_analysis: Специальный блок анализа новостей, связанных с SUI.
- other_assets: Влияние на другие активы (BTC, ETH, SOL и др.).
Новостной контекст: {context}
Используй смайлики и живой человеческий текст. 
Отвечай только на русском.
"""

PROMPT_MULTI_HOUR = """
Проанализируйте новости за последние {hours} часов и создайте структурированную сводку новостей. Включите следующие аспекты:
- main_events: Главные события за период (с указанием источников).
- macro_indicators: Изменение ключевых макроэкономических показателей (инфляция, процентные ставки ЦБ, индекс доллара США, цена золота и т.д.).
- market_impact: Влияние событий на финансовые рынки в целом.
- sentiment_analysis: Тональность новостей (позитивная/нейтральная/негативная).
- forecast: Прогноз на ближайшие дни.
- sui_analysis: Подробный анализ новостей, связанных с SUI.
- other_assets: Влияние на другие активы (BTC, ETH, SOL и др.).
Новостной контекст: {context}
Используй смайлики и живой человеческий текст. 
Отвечай только на русском.
"""

class NewsAnalyzer:
    def __init__(self):
        self.logger = setup_logger(__name__)
        self.db_uri = f"mongodb://{os.getenv('MONGO_INITDB_ROOT_USERNAME')}:{os.getenv('MONGO_INITDB_ROOT_PASSWORD')}@localhost:27017/"
        self.db_name = "news"
        self.client = None
        self.db = None
        self.atoma_client = AtomaAPIClient()

    async def connect_to_db(self):
        try:
            self.client = AsyncIOMotorClient(self.db_uri)
            self.db = self.client[self.db_name]
            self.logger.info(f"Connected to database: {self.db_name}")
        except ConnectionError as e:
            self.logger.error(f"Connection error: {e}")
            raise ConnectionError(f"Connection error: {e}")
        except OperationFailure as e:
            self.logger.error(f"Operation failed: {e}")
            raise OperationFailure(f"Operation failed: {e}")

    async def fetch_news(self, interval: str) -> List[Dict]:
        intervals = {
            "hour": timedelta(hours=1),
            "hours_3": timedelta(hours=3),
            "hours_6": timedelta(hours=6),
            "hours_12": timedelta(hours=12),
            "day_1": timedelta(days=1),
            "days_3": timedelta(days=3),
            "days_7": timedelta(days=7),
            "days_14": timedelta(days=14),
            "month_1": timedelta(days=30),
        }
        if interval not in intervals:
            self.logger.error(f"Invalid interval: {interval}")
            return []

        collection = self.db["telegram_posts"]
        end_time = datetime.utcnow()
        start_time = end_time - intervals[interval]

        query = {"date": {"$gte": start_time, "$lte": end_time}}
        cursor = collection.find(query).sort("date", -1)
        news = await cursor.to_list(length=None)
        self.logger.info(f"Fetched {len(news)} news items for interval: {interval}")
        return news

    async def batch_news_for_analysis(self, news: List[Dict], max_length: int = 5000) -> List[str]:
        batches = []
        current_batch = ""
        for item in news:
            text = item.get("text", "")
            if len(current_batch) + len(text) + 1 <= max_length:
                current_batch += text + "\n"
            else:
                batches.append(current_batch.strip())
                current_batch = text + "\n"
        if current_batch:
            batches.append(current_batch.strip())
        return batches

    async def analyze_news_with_atoma(self, context: str, prompt_template: str) -> Dict:
        escaped_context = escape_special_characters(context)

        messages = [
            {"role": "system", "content": "You are an AI assistant that helps with news analysis."},
            {"role": "user", "content": prompt_template.format(context=escaped_context)},
        ]
        response_data = await self.atoma_client.create_chat_completion(
            model="deepseek-ai/DeepSeek-R1",
            messages=messages,
        )
        summary = response_data["choices"][0]["message"]["content"]

        cleaned_summary = clean_llm_response(summary)

        self.logger.info(f"Cleaned analysis result: {cleaned_summary}")
        return cleaned_summary

    async def save_summary(self, summary: Dict, interval: str):
        collection = self.db["news_summary"]
        query = {"interval": interval}
        update_data = {
            "$set": {
                "summary": summary,
                "updated_at": datetime.utcnow()
            }
        }
        await collection.update_one(query, update_data, upsert=True)
        self.logger.info(f"Updated/Inserted summary for interval: {interval}")

    async def close(self):
        if self.client:
            self.client.close()
            self.logger.info("Database connection closed.")
        await self.atoma_client.close()

    async def analyze_interval(self, interval: str):
        news = await self.fetch_news(interval)
        if not news:
            self.logger.warning(f"No news found for interval: {interval}")
            return
        batches = await self.batch_news_for_analysis(news)
        summaries = []
        for batch in batches:
            if not batch.strip():
                self.logger.warning("Empty batch detected, skipping analysis.")
                continue
            if interval == "hour":
                summary = await self.analyze_news_with_atoma(batch, PROMPT_HOURLY)
            else:
                hours = interval.split("_")[1]
                summary = await self.analyze_news_with_atoma(batch, PROMPT_MULTI_HOUR.format(hours=hours, context=batch))
            summaries.append(summary)
        if summaries:
            await self.save_summary({"summary": summaries}, interval=interval)

if __name__ == "__main__":
    import asyncio

    async def main():
        analyzer = NewsAnalyzer()
        await analyzer.connect_to_db()
        intervals = ["hour", "hours_3", "hours_6"]
        for interval in intervals:
            await analyzer.analyze_interval(interval)
        await analyzer.close()

    asyncio.run(main())
