from fastapi import APIRouter, Query, HTTPException, Body
import httpx
from typing import Dict, List, Any
from dotenv import load_dotenv
from atoma.atoma_connector import AtomaAPIClient
import re
from database.sqlite_connector import ClientDatabase

load_dotenv()
router = APIRouter()

def remove_think_tags(analysis: str) -> str:
    pattern = r"<think>.*?</think>"
    cleaned_analysis = re.sub(pattern, "", analysis, flags=re.DOTALL)
    return cleaned_analysis.strip()

def generate_prompt(answers: Dict[int, str]) -> str:
    prompt = """
Ты — эксперт по инвестициям и финансовому планированию. 
Тебе нужно проанализировать ответы пользователя на вопросы анкеты и предоставить подробную оценку его инвестиционного профиля.
Ответы пользователя:
"""
    for qid, answer in answers.items():
        prompt += f"Вопрос {qid}: {answer}\n"
    return prompt

@router.post("/question1", summary="Какую сумму вы планируете инвестировать в криптовалютные активы? Укажите диапазон или конкретную сумму.")
async def answer_question_1(
    wallet_id: str = Query(..., description="Wallet пользователя"),
    answer: str = Body(..., description="Ответ на вопрос 1"),
):
    db_client = ClientDatabase()
    await db_client.save_answer(wallet_id, 1, answer)
    return {"response": "ok", "question_id": 1}

@router.post("/question2", summary="Какой временной горизонт вы планируете для своих инвестиций (до 1 года, 1-5 лет, более 5 лет)?")
async def answer_question_2(
    wallet_id: str = Query(..., description="Wallet пользователя"),
    answer: str = Body(..., description="Ответ на вопрос 2"),
):
    db_client = ClientDatabase()
    await db_client.save_answer(wallet_id, 2, answer)
    return {"response": "ok", "question_id": 2}

@router.post("/question3", summary="Какую долю своего капитала вы готовы инвестировать в высокорисковые активы (например, мемкоины)?")
async def answer_question_3(
    wallet_id: str = Query(..., description="Wallet пользователя"),
    answer: str = Body(..., description="Ответ на вопрос 3"),
):
    db_client = ClientDatabase()
    await db_client.save_answer(wallet_id, 3, answer)
    return {"response": "ok", "question_id": 3}

@router.post("/question4", summary="Как часто вы планируете мониторить свои инвестиции и перебалансировать портфель (ежедневно, еженедельно, ежемесячно)?")
async def answer_question_4(
    wallet_id: str = Query(..., description="Wallet пользователя"),
    answer: str = Body(..., description="Ответ на вопрос 4"),
    
):
    db_client = ClientDatabase()
    await db_client.save_answer(wallet_id, 4, answer)
    return {"response": "ok", "question_id": 4}

@router.post("/question5", summary="Какую роль играют эмоции в ваших инвестиционных решениях (значительную, незначительную, не играют роли)?")
async def answer_question_5(
    wallet_id: str = Query(..., description="Wallet пользователя"),
    answer: str = Body(..., description="Ответ на вопрос 5"),
    
):
    db_client = ClientDatabase()
    await db_client.save_answer(wallet_id, 5, answer)
    return {"response": "ok", "question_id": 5}

def filter_top_pools_bluefin(pools_data: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    filtered_pools = []
    for pool in pools_data:
        if "day" in pool and "apr" in pool["day"]:
            apr_total = float(pool["day"]["apr"]["total"])
            symbol = pool.get("symbol", "Unknown")
            token_a = pool["tokenA"]["info"].get("symbol", "Unknown")
            token_b = pool["tokenB"]["info"].get("symbol", "Unknown")
            address = pool.get("address", "Unknown")
            filtered_pools.append({
                "address": address,
                "tokenA": token_a,
                "tokenB": token_b,
                "pool_name": symbol,
                "apr": apr_total
            })
    top_pools = sorted(filtered_pools, key=lambda x: x["apr"], reverse=True)[:25]
    return top_pools

async def get_bluefin_pools_apr() -> Dict[str, Any]:
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"https://swap.api.sui-prod.bluefin.io/api/v1/pools/info",
            headers={"accept": "application/json"},
        )
        response.raise_for_status()
        return response.json()

@router.post("/analyze", summary="Анализ ответов для определения инвестиционных целей и риск-профиля")
async def analyze_answers(
    user_id: str = Query(..., description="Wallet пользователя"),
):
    db_client = ClientDatabase()
    answers = await db_client.get_user_answers(user_id)
    if not answers or len(answers) < 5:
        raise HTTPException(status_code=400, detail="Не все вопросы были заполнены")

    data = await get_bluefin_pools_apr()
    top_pools = filter_top_pools_bluefin(pools_data=data)

    prompt = f"""
Ты — эксперт по инвестициям и финансовому планированию. Тебе нужно проанализировать ответы пользователя на вопросы анкеты и предоставить подробную оценку его инвестиционного профиля.

При анализе учитывай пулы BlueFin {top_pools}

Вопросы:
1. Какую сумму вы планируете инвестировать в криптовалютные активы? Укажите диапазон или конкретную сумму.
2. Какой временной горизонт вы планируете для своих инвестиций (до 1 года, 1-5 лет, более 5 лет)?
3. Какую долю своего капитала вы готовы инвестировать в высокорисковые активы (например, мемкоины)?
4. Как часто вы планируете мониторить свои инвестиции и перебалансировать портфель (ежедневно, еженедельно, ежемесячно)?
5. Какую роль играют эмоции в ваших инвестиционных решениях (значительную, незначительную, не играют роли)?

Ответы юзера: {answers}

Анализируй ответы пользователя с учетом следующих критериев:
1. **Определение уровня риска**:
   - Высокий риск: Пользователь готов принимать высокие риски ради высокой прибыли.
   - Средний риск: Пользователь предпочитает баланс между рисками и доходностью.
   - Низкий риск: Пользователь стремится минимизировать риски, даже если это снижает потенциальную доходность.
2. **Инвестиционные цели**:
   - Короткосрочные: Пользователь планирует инвестировать на срок до 1 года.
   - Среднесрочные: Пользователь планирует инвестировать на срок от 1 до 5 лет.
   - Долгосрочные: Пользователь планирует инвестировать на срок более 5 лет.
3. **Предпочтения в финансовых инструментах**:
   - Акции: Подходят для пользователей с высоким уровнем риска.
   - Облигации: Подходят для пользователей с низким уровнем риска.
   - Криптовалюты: Подходят для пользователей с высоким уровнем риска.
   - AMM Пулы BlueFin: Подходят для пользователей с средним уровнем риска.
   - Недвижимость: Подходит для долгосрочных инвестиций.

Рекомендации:
- Предложи минимум 7 конкретных шагов, которые пользователь может предпринять для достижения своих инвестиционных целей.
- Учти особенности рынка и текущую экономическую ситуацию.

Формат ответа:
- Начни с заголовка: "ВАШ ИНВЕСТИЦИОННЫЙ ПРОФИЛЬ 📊".
- Используй эмодзи для живости текста.
"""
    atoma_client = AtomaAPIClient()
    response_data = await atoma_client.create_chat_completion(
        model="deepseek-ai/DeepSeek-R1",
        messages=[{"role": "user", "content": prompt}, {"role": "assistant", "content": ""}],
    )
    await atoma_client.close()

    analysis = response_data["choices"][0]["message"]["content"]

    return {
        "response": remove_think_tags(analysis)
    }

@router.on_event("startup")
async def startup_event():
    db_client = ClientDatabase()
    await db_client.initialize_tables()
