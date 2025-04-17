from backend.llm.llm_agents.base_llm import ChatGPTService as BaseChatGPTService
from backend.llm.mcp.news_mcp import NewsMCP
from backend.llm.mcp.portfolio_mcp import PortfolioMCP
from backend.llm.mcp.survey_mcp import SurveyMCP
from backend.llm.mcp.dune_mcp import DuneMCP
from backend.llm.mcp.pool_mcp import PoolMCP
from backend.llm.llm_agents.onchain_llm import ChatGPTDuneService
import openai
import json
from datetime import datetime

class ChatGPTChatService(BaseChatGPTService):

    def __init__(self):
        super().__init__()
        self.news_mcp = NewsMCP()
        self.portfolio_mcp = PortfolioMCP()
        self.survey_mcp = SurveyMCP()
        self.dune_mcp = DuneMCP()
        self.dune_llm = ChatGPTDuneService()
        self.pool_mcp = PoolMCP()


    async def functions_description(self):
        functions_description = (
            "Доступные функции: "
            "1) balance() - функция для получения баланса активов юзера, подключенных кошельков к приложению."
            " Если запрос юзера связан как-то с функционалом приложения или с информацией о его активах."
            " - используй эту функцию что бы узнать актуальные данные о активах юзера в своем анализе."
            " Ключевые слова: активы, средства, монеты, токены, портфолио - Если видишь эти слова - значит нужно вызывать функцию portfolio()"
            " 2) pools() - функция, которая вернет список подключенных пулов в систему и инофрмацию о них ( TVl, APR, VOL и прочие), с которыми можно взаимодействовать."
            " Обязательно вызывай эту функцию, если речь идет про пулы. Используй эту функцию что бы узнать актуальные данные о пулах в своем анализе"
            " Ключевые слова: пулы, AMM, депозиты, пулы доходности, протокол"
            "3) survey() - Тут будет содержаться инструкция по инвестиционным предложениям и персонализированному инвестиционному анализу для килента на основе его инвестиционных предпочтений. "
            " Список вопросов: [Какую сумму вы планируете инвестировать в криптовалютные активы?, Какой временной горизонт вы планируете для своих инвестиций?, Какую долю своего капитала вы готовы инвестировать в высокорисковые активы?, Как часто вы планируете мониторить свои инвестиции и производить ребалансировку портфеля?, Какую роль играют эмоции в ваших инвестиционных решениях?]"
            " Если для ответа нужно знать риск профиль клиента, его цели по ребалансеровке, целей по доходности и диверсификации вызывай эту функцию что бы узнать точные данные"
            " Ключевые слова: Инвестиционные цели, личные предпочтения, инвест предпочтения, срок инвестирования, цели по диверсификации"
            f" Новостные теги в системе: {await self.news_mcp.get_tags()}."
            "4) news_summary(tags=List[tags]) - сгенерировать саммари по новостному потоку основываясь на новостях с релевантными тегами. Всегда используй если речь идет про новости"
            " Если будешь использовать функцию news_summary, исходя из запроса юзера - выбирай от 5х до 15 самых актуальных тегов основываясь на контексте запроса, для генерации новостного саммари для дальнейшего анализа"
            " Ключевые слова: новости, фундаментальный анализ, новостной анализ, макро события, макро, макроэкономика"
            "5) onchain(context: str) - получить проанализированные onchain(данные/метрики/показатели: блокчейна/крипторынка/протоколов) данные с dune api. "
            " context - из всего запроса выдели, какие onchain метрики будут релевантны для пользовательского запроса и составь промпт с контекстом (касающегося onchain данных) для LLM для дальнейшего анализа. Всегда вызывай эту функцию, когда нужно получить ончейн анализ по метрикам блокчейна."
            " Ключевые слова: Метрики, характеристики, данные, блокчейн, ончейн, onchain"
        )
        return functions_description

    async def send_message(self, user_id: str, message: str) -> str:
        try:
            client = openai.OpenAI(
                api_key=self.openai_api_key
            )
            system_message = (
                "Ты — DeFi финансовый помощник по криптоинвестициям и экономике.\n"
                "Твоя задача — при необходимости вызывать предопределённые функции для получения данных и анализа.\n"
                "Формат ответа строго JSON-массив: [ "
                '{"function": "имя_функции", "parameters": {...}},]'
                "Если вызов функций не требуется — вернуть пустой массив: []\n"
                f"Описание функций: {await self.functions_description()}"
            )

            response = client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": system_message},
                    {"role": "user", "content": message}
                ]
            )
            assistant_reply = response.choices[0].message.content.strip()
            try:
                response_data = json.loads(assistant_reply)
            except json.JSONDecodeError as e:
                raise Exception(f"Failed to parse OpenAI API response: {e}")

            print("ACTIONS: ", response_data)

            if response_data == []:
                response = client.chat.completions.create(
                    model=self.model,
                    messages=[
                        {"role": "system",
                         "content": (
                             "Проанализируй запрос юзера и постарайся ответить на его вопрос. Делай это структурировано. Используй смайлики"
                             "Если запрос юзера не относится к финансам, крипте, de-fi, инвестиционным советам и смежных тем или по функционалу приложения"
                             f"то расскажи ему о функционале приложения. Функционал: {await self.functions_description()}"
                             "Используй смайлики в ответе."
                         )},
                        {"role": "user", "content": message}
                    ]
                )
                assistant_reply = response.choices[0].message.content.strip()
            else:
                text_to_analyze = f"Изначальный запрос юзера: {message}"
                for func in response_data:
                    func_name = func.get('function')
                    params = func.get('parameters')

                    print("FUNC NAME: ", func_name)
                    print("PARAMS: ", params)

                    if func_name == "balance":
                        portfolio = json.dumps(self.portfolio_mcp.get_portfolio())
                        text_to_analyze = text_to_analyze + "\nКрипто-портфолио клиента: " + portfolio

                    if func_name == "pools":

                        pools = await self.pool_mcp.get_pools()

                        try:
                            pools=json.dumps(pools)
                        except Exception:
                            pass

                        text_to_analyze = text_to_analyze + "\nСписок пулов: " + pools

                    if func_name == "survey":
                        survey_summary = await self.survey_mcp.get_survey(user_id=user_id)
                        text_to_analyze = text_to_analyze + "\nИнвестиционные предпочтения и цели клиента: " + survey_summary

                    if func_name == "news_summary":
                        tags = params.get('tags')
                        print("\nTAGS PARAMS: ", tags)
                        summary = await self.news_mcp.get_news_summary_by_tags(tags=tags)
                        text_to_analyze = text_to_analyze + "\nНовостная сводка: " + summary

                    if func_name == "onchain":
                        try:
                            context = params.get("context")
                        except Exception:
                            par = json.loads(params)
                            context = par.get("context")

                        summary, iframes = await self.dune_llm.send_message(context=context)
                        text_to_analyze = text_to_analyze + "ОЧЕНЬ ВАЖНО! Добавь в ответ html теги iframes и исходя из названий пойми куда их логично вставить по тексту. Вставить нужно все iframes.\nОнчейн Аналитика: " + summary


                print("\nTEXT TO ANALYZE: ", text_to_analyze)
                response = client.chat.completions.create(
                    model=self.model,
                    messages=[
                        {"role": "system", "content": "Проанализируй изначальный запрос юзера и дополнительные данные для анализа."
                        " Дай форматированный ответ Markdown, с таблицами (в html) где это необходимо (допустим для пулов) и iframe дашбордами (в html, если они есть - Отображать все которые передают; Если iframe тегов нет, то не упоминай это) с объяснением и обоснованием своего решения."
                        " Если теги iframe есть, то обязательно вплети их в финальный ответ. Если они есть, iframe нельзя пропускать! Если их нет - ничего об этом не пиши"
                         " Используй смайлики"
                         },
                        {"role": "user", "content": text_to_analyze}
                    ]
                )

                assistant_reply = response.choices[0].message.content.strip()

            if self.history_connector:
                chat_entry = {
                    "user_id": user_id,
                    "messages": [
                        {"role": "user", "content": message, "timestamp": datetime.utcnow()},
                        {"role": "assistant", "content": assistant_reply, "timestamp": datetime.utcnow()}
                    ]
                }
                await self.history_connector.insert_chat_entry(chat_entry)

            print("\n\n\n!!!!!!FINALL ANSWER!!!!!!!: ", assistant_reply)
            return assistant_reply

        except Exception as e:
            print(e)