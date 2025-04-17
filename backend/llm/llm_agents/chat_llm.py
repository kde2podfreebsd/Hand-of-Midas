from backend.llm.llm_agents.base_llm import ChatGPTService as BaseChatGPTService
from backend.llm.mcp.news_mcp import NewsMCP
from backend.llm.mcp.portfolio_mcp import PortfolioMCP
from backend.llm.mcp.survey_mcp import SurveyMCP
from backend.llm.mcp.dune_mcp import DuneMCP
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


    async def functions_description(self):
        functions_description = (
            "Доступные функции: "
            "1) portfolio() - функция для получения баланса активов юзера, подключенных кошельков к приложению. Если запрос юзера связан как-то с функционалом приложения или с информацией о его активах - используй эту функцию что бы узнать актуальные данные о активах юзера в своем анализе"
            "2) pools() - функция, которая вернет список подключенных пулов в систему, с которыми можно взаимодействовать. Обязательно вызывай эту функцию, если речь идет про пулы. Если запрос юзера связан как-то с функционалом приложения или с информацией о пулах - используй эту функцию что бы узнать актуальные данные о пулах в своем анализе"
            "3) survey() - функция, которая для юзера вернет проанализированные ответы на вопросы. Инвест предпочтения пользователя. Если пользователь хочет что-то уточнить как ему лучше поступить - всегда вызывай эту фукнцию что бы узнать его риск профиль, цели по ребалансировки, доходности и диверсификации"
            f"Новостные теги в системе: {await self.news_mcp.get_tags()}. Если будешь использовать функцию news_summary, исходя из запроса юзера - выбирай от 3х до 10 самых актуальных тегов для генерации новостного саммари для дальнейшего анализа"
            "4) news_summary(tags=List[tags]) - сгенерировать саммари по новостному потоку по новостям с релевантными тегами. Если тебе необходимо узнать информацию о инвестицонных предпочтениях клиента - используй эту функцию что бы узнать актуальные ответы и предпочтения юзера в своем анализе"
            "5) onchain(context: str) - получить проанализированные onchain(данные/метрики/показатели: блокчейна/крипторынка/протоколов) данные с dune api. context - из всего запроса выдели, какие onchain метрики будут релевантны для пользовательского запроса и составь промпт с контекстом (касающегося onchain данных) для LLM для дальнейшего анализа. Всегда вызывай эту функцию что бы получить ончейн анализ по метрикам блокчейна и разных протоколов. "
            f"Вот какие данные и дашборды доступны: {json.dumps(self.dune_mcp.get_dashboard_keys())}"
            f"Список onchain метрик: {self.dune_mcp.get_dashboard_keys()}"

        )
        return functions_description

    async def send_message(self, user_id: str, message: str) -> str:
        try:
            client = openai.OpenAI(
                api_key=self.openai_api_key
            )
            print("1!!!!!!!!!!!!!!")
            system_message = (
                "Ты de-fi финансовый ассистент. "
                "Твоя задача - помочь пользователю, используя доступные функции. Ты должен определить, какие функции нужно вызвать для получения нужных данных. "
                "Каждый запрос к функциям должен быть выполнен поочередно, используя ответы предыдущих шагов, если это необходимо. "
                'Ответь в формате: [{"function": "имя_функции", "parameters": {"параметр1": "значение1", "параметр2": "значение2"}}]'
                'Ответ строго в json! Если для анализа нужно вызвать более 1 функции, передавай их в массив в той последовательности, в которой необходимо из выполнить и получить от них данные'
                "Если функции выполнять не нужно, то верни: []"
                f"{await self.functions_description()} "
            )
            print("2!!!!!!!!!!!!!!")
            print(system_message)
            response = client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": system_message},
                    {"role": "user", "content": message}
                ]
            )
            print("3!!!!!!!!!!!!!!")
            assistant_reply = response.choices[0].message.content.strip()

            print("4!!!!!!!!!!!!!!")
            print(assistant_reply)
            try:
                response_data = json.loads(assistant_reply)
            except json.JSONDecodeError as e:
                raise Exception(f"Failed to parse OpenAI API response: {e}")

            print("5!!!!!!!!!!!!!!")

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
                    print("-"*40)

                    if func_name == "portfolio":
                        portfolio = json.dumps(self.portfolio_mcp.get_portfolio())
                        text_to_analyze = text_to_analyze + "Портфолио юзера: " + portfolio

                    if func_name == "pools":
                        text_to_analyze = text_to_analyze + "Список пулов: " + json.dumps({
                            "result": [
                                {"pool_name": "Ethereum-USD", "apr": 12.5, "tvl": 5000000},
                                {"pool_name": "Bitcoin-ETH", "apr": 15.2, "tvl": 3000000}
                        ]})

                    if func_name == "survey":
                        survey_summary = await self.survey_mcp.get_survey(user_id=user_id)
                        text_to_analyze = text_to_analyze + "Анкета и инвест предпочтения юзера: " + survey_summary

                    if func_name == "news_summary":
                        tags = params.get('tags')
                        print("TAGS PARAMS: ", tags)
                        summary = await self.news_mcp.get_news_summary_by_tags(tags=tags)
                        text_to_analyze = text_to_analyze + "Новостная сводка: " + summary

                    if func_name == "onchain":
                        try:
                            context = params.get("context")
                        except Exception:
                            par = json.loads(params)
                            context = par.get("context")

                        summary = await self.dune_llm.send_message(context=context)
                        text_to_analyze = text_to_analyze + "Onchain Summary: (ОЧЕНЬ ВАЖНО! При финальном анализе сохрани структуру ончейн анализа и обязательно отобрази все теги iframe, которые были указаны в Onchain Summary): " + summary


                print("\nTEXT TO ANALYZE: ", text_to_analyze)
                response = client.chat.completions.create(
                    model=self.model,
                    messages=[
                        {"role": "system", "content": "Проанализируй изначальный запрос юзера и дополнительные данные для анализа."
                        "Дай форматированный ответ Markdown, с таблицами (в html) где это необходимо (допустим для пулов) и с объяснением и обоснованием своего решения."
                        "Обязательно перенеси часть с ончейн анализом (если он есть) и ОБЗЯТАЛЬНО отобрази все теги iframe, которые были переданные в тексте для финального анализа (если эти теги есть)."
                        "Их нельзя пропускать!"
                         },
                        {"role": "user", "content": text_to_analyze}
                    ]
                )
                print("\nRESPONSE: ", response)

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