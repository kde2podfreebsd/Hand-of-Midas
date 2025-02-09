from fastapi import APIRouter, Query, HTTPException
from datetime import timedelta
from database.mongodb_connector import MongoDBConnector

router = APIRouter()

PERIOD_MAPPING = {
    "hour": timedelta(hours=1),
    "hours_3": timedelta(hours=3),
    "hours_6": timedelta(hours=6),
    "hours_12": timedelta(hours=12),
}


@router.get("/summary", summary="Сводка новостей за период")
async def get_news_summary(
        period: str = Query(..., description="Период сводки (hour, hours_3, hours_6, hours_12)")
):
    if period not in PERIOD_MAPPING:
        raise HTTPException(status_code=400, detail="Неверный формат периода")

    db_connector = MongoDBConnector(uri="mongodb://root:rootpassword@localhost:27017/", db_name="news")
    await db_connector.connect()
    try:
        if period == 'hour':
            summary = await db_connector.get_hour_summary()
        elif period == "hours_3":
            summary = await db_connector.get_hours_3_summary()
        elif period == "hours_6":
            summary = await db_connector.get_hours_6_summary()
        elif period == "hours_12":
            summary = await db_connector.get_hours_12_summary()
        else:
            summary = "Summary cant be reached"
        return {
            "response": summary
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка при получении сводки: {str(e)}")
    finally:
        await db_connector.close()