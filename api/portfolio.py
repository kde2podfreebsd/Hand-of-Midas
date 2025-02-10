from fastapi import APIRouter, Query
import json
from atoma.atoma_connector import AtomaAPIClient
import re
from onchain.sui.bluefin.apr_pools import *
from onchain.sui.transactions import *

router = APIRouter()

def remove_think_tags(analysis: str) -> str:
    pattern = r"<think>.*?</think>"
    cleaned_analysis = re.sub(pattern, "", analysis, flags=re.DOTALL)
    return cleaned_analysis.strip()


def generate_prompt(portfolio, bluefin_pools_apr) -> str:
    top_bluefin_pools = filter_top_pools_bluefin(bluefin_pools_apr)

    prompt = (
        "Отвечай на русском языке. Проанализируй это портфолио криптоактивов: "
        f"{portfolio}. Самое главное в анализе:\n"
        "1) Диверсификация криптовалюты в портфеле по активам и расположению (лучше, когда есть несколько кошельков и бирж, только биржи - риск).\n"
        "2) Включи метрики и советы по оптимизации портфеля, учитывая сумму по стейблкоинам.\n"
        "3) Если есть стейблкоины, то укажи, что на них можно получать доход, сообщив, что сейчас на децентрализованных платформах доходность составляет 15-30% годовых. Рассчитай, сколько можно заработать дополнительно в стейблкоинах при доходности 20% годовых - за год и в день с учетом активов пользователя в стейблкоинах.\n"
        "4) Для фундаментальных активов есть стейкинг с минимальным риском (пиши об этом только в том случае, если активы есть в портфеле):\n"
        "Используй следующие данные о пулах:\n"
        f"- Для SUI: Bluefin pools APR (топ-25): {json.dumps(top_bluefin_pools)}\n"
        "На основе этих данных предложи минимум 7 подробных советов по оптимизации портфеля и использованию пулов Bluefin.\n"
        "Обязательно выделяй bluefin пулы с хорошими apr подходящие юзеру - тк для них есть методы у нашего смарт контракта"
        "Говори только о криптовалюте, финансах и FinKeeper. Если пользователь задает другой вопрос не по теме, вежливо ему ответь, что мы общаемся только о FinKeeper и криптовалютах.\n"
        "Ты — аналитик криптовалютных портфелей FinKeeper, в меру остроумный. Тебе нужно проанализировать портфель пользователя, используя эмодзи для живости текста, заголовки сообщений выделяй КАПСОМ. Включи полезные метрики и советы для оптимизации портфеля. Оцени уровень диверсификации и выяви возможные риски.\n"
        "Ответ очищай от лишних сиволов, кавычек и скобок, побольше смайликов!"
    )
    return prompt


@router.post("/analyze", summary="Анализ портфеля криптоактивов")
async def analyze_portfolio(
    wallet_id: str = Query(..., description="ID пользователя")
):
    bluefin_pools_apr = await get_bluefin_pools_apr()
    portfolio = await get_sui_user_portfolio(wallet=wallet_id)
    prompt = generate_prompt(portfolio, bluefin_pools_apr)

    atoma_client = AtomaAPIClient()
    response_data = await atoma_client.create_chat_completion(
        model="deepseek-ai/DeepSeek-R1",
        messages=[{"role": "user", "content": prompt}],
    )
    await atoma_client.close()

    analysis = response_data["choices"][0]["message"]["content"]

    return {
        "response": remove_think_tags(analysis)
    }