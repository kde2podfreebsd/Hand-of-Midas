from fastapi import APIRouter, Depends, Query
from backend.api.service.portfolio_service import PortfolioService

router = APIRouter(tags=["portfolio"])

@router.get("/portfolio")
async def get_transactions(user_id: str = Query()):
    portfolio_service = PortfolioService()
    return portfolio_service.get_user_portfolio(user_id=user_id)