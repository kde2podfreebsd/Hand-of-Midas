import os
import json
from datetime import datetime

import openai
from backend.llm.llm_agents.base_llm import ChatGPTService as BaseChatGPTService
from backend.llm.mcp.dune_mcp import DuneMCP
from dune_client.client import DuneClient
from dune_client.api.extensions import DuneError

class ChatGPTDuneService(BaseChatGPTService):

    def __init__(self):
        super().__init__()
        self.dune_mcp = DuneMCP()
        self.dune = DuneClient(os.getenv("DUNE_API_KEY"))

    def dune_query(self, dashboard_id: int) -> dict:
        try:
            resp = self.dune.get_latest_result(dashboard_id)
            if hasattr(resp, 'dict'):
                return resp.dict()
            elif hasattr(resp, 'to_dict'):
                return resp.to_dict()
            else:
                data = {}
                if hasattr(resp, 'metadata'):
                    data['metadata'] = resp.metadata
                if hasattr(resp, 'result'):
                    result = resp.result
                    if hasattr(result, 'rows'):
                        data['rows'] = result.rows
                    else:
                        data['result'] = result
                return data
        except DuneError as e:
            print(f"⚠️ DuneError for dashboard {dashboard_id}: {e}")
            return {"metadata": {}, "rows": []}

    async def send_message(self, context: str) -> (str, dict):
        client = openai.OpenAI(api_key=self.openai_api_key)

        all_dashboards = self.dune_mcp.get_dashboard_keys()
        pick_prompt = (
            "Ты — эксперт по DeFi и Dune Analytics.\n"
            "Исходя из контекста запроса, выбери:\n"
            "1) От 7 до 15 релевантных названий дашбордов из этого списка:\n"
            f"{json.dumps(all_dashboards, ensure_ascii=False, indent=2)}\n\n"
            "2) От 2 до 3 API ID тех дашбордов, данные которых нужно запросить.\n\n"
            "Ответь строго JSON с полями:\n"
            "  \"relevant_dashboards\": [\"название1\", ...],\n"
            "  \"to_query_ids\": [123, 456, ...]\n"
        )
        pick_resp = client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": pick_prompt},
                {"role": "user",   "content": context}
            ]
        )
        try:
            parsed = json.loads(pick_resp.choices[0].message.content)
            relevant = parsed.get("relevant_dashboards", [])
            to_query_ids = parsed.get("to_query_ids", [])
        except (json.JSONDecodeError, KeyError):
            relevant = all_dashboards[:5]
            to_query_ids = [
                self.dune_mcp.dune_dashboards[name]["api_id"]
                for name in relevant[:3]
            ]

        id_to_name = {info["api_id"]: name for name, info in self.dune_mcp.dune_dashboards.items()}
        valid_ids = [i for i in to_query_ids if i in id_to_name]
        if not valid_ids:
            valid_ids = [
                self.dune_mcp.dune_dashboards[name]["api_id"]
                for name in relevant[:3] if name in self.dune_mcp.dune_dashboards
            ]

        analyses = []
        iframe_dict = {}
        for dashboard_id in valid_ids:
            name = id_to_name[dashboard_id]
            data = self.dune_query(dashboard_id)
            json_data = json.dumps(data, ensure_ascii=False)
            truncated_data = json_data if len(json_data) <= 1500 else json_data[:1500]

            analysis_prompt = (
                f"Ты — аналитик DeFi. Проанализируй данные для дашборда «{name}» (ID={dashboard_id}):\n"
                f"{truncated_data}\n"
                "Выведи развёрнутое заключение в Markdown."
            )
            analysis_resp = client.chat.completions.create(
                model=self.model,
                messages=[{"role": "system", "content": analysis_prompt}]
            )
            analysis_text = analysis_resp.choices[0].message.content.strip()

            iframe_list = self.dune_mcp.dune_dashboards.get(name, {}).get("iframe", [])
            iframe_dict[name] = iframe_list

            analyses.append({"name": name, "analysis": analysis_text})

        md_parts = [
            f"# Анализ по запросу\n> {context}\n",
            "### Релевантные дашборды:\n" + "\n".join(f"- {n}" for n in relevant) + "\n"
        ]
        for block in analyses:
            md_parts.extend([
                f"## {block['name']}\n",
                block['analysis'] + "\n"
            ])

        report_md = "".join(md_parts)
        return report_md, iframe_dict


if __name__ == "__main__":
    import asyncio

    async def main():
        service = ChatGPTDuneService()
        report, iframes = await service.send_message(
            "Сравнительный анализ монет на Uniswap, включая объем торгов, участников и количество пулов."
        )
        print(report)
        print("Iframes:", json.dumps(iframes, ensure_ascii=False, indent=2))

    asyncio.run(main())