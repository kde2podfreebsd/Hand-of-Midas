from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
import asyncio
from scrapper.summarizing import NewsAnalyzer
from datetime import datetime


class NewsScheduler:

    def __init__(self):
        self.scheduler = AsyncIOScheduler(job_defaults={'max_instances': 1})
        self.analyzer = NewsAnalyzer()

    async def initialize_summaries(self):
        await self.analyzer.connect_to_db()
        intervals = ["hour", "hours_3", "hours_6", "hours_12"]
        collection = self.analyzer.db["news_summary"]
        for interval in intervals:
            query = {"interval": interval}
            existing_summary = await collection.find_one(query)
            if not existing_summary:
                empty_summary = {
                    "interval": interval,
                    "summary": {},
                    "created_at": datetime.utcnow()
                }
                await collection.insert_one(empty_summary)
                print(f"Initialized summary document for interval: {interval}")

    async def run_analysis(self, interval: str):
        await self.analyzer.connect_to_db()
        print(f"Running analysis for interval: {interval}")
        await self.analyzer.analyze_interval(interval)

    async def run(self):
        await self.initialize_summaries()

        self.scheduler.add_job(self.run_analysis, CronTrigger(minute="0"), args=["hour"])
        self.scheduler.add_job(self.run_analysis, CronTrigger(hour="*/3", minute="0"), args=["hours_3"])
        self.scheduler.add_job(self.run_analysis, CronTrigger(hour="*/6", minute="0"), args=["hours_6"])
        self.scheduler.start()
        print("Scheduler started.")

        while True:
            await asyncio.sleep(1)


async def main():
    scheduler = NewsScheduler()
    await scheduler.initialize_summaries()
    intervals = ["hour", "hours_3", "hours_6"]
    for interval in intervals:
        await scheduler.run_analysis(interval)
    await scheduler.run()


if __name__ == "__main__":
    asyncio.run(main())
