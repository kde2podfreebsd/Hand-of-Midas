from fastapi import APIRouter, Depends, Query
from llmAgents.api.service.transactions_service import TransactionsService

router = APIRouter(tags=["transactions"])

@router.get("/transactions")
async def get_transactions(user_id: str = Query()):
    tx_service = TransactionsService()
    return tx_service.get_user_transactions(user_id=user_id)