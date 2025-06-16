from pathlib import Path
import os, shutil, re, time, json
from typing import Optional, List
from enum import Enum

from dotenv import load_dotenv
from rapidfuzz import fuzz

from pydantic import BaseModel, Field, ValidationError
from langchain.chat_models         import ChatOpenAI
from langchain.embeddings          import OpenAIEmbeddings
from langchain.text_splitter       import CharacterTextSplitter
from langchain.schema              import Document, BaseRetriever
from langchain_community.vectorstores import Chroma
from langchain.retrievers          import BM25Retriever, EnsembleRetriever
from langchain.memory              import ConversationBufferMemory
from langchain.agents              import Tool, AgentType, initialize_agent
from langchain.prompts             import PromptTemplate
from langchain.chains              import LLMChain
from langchain.output_parsers      import PydanticOutputParser, EnumOutputParser
from langchain_core.exceptions     import OutputParserException

import chromadb
from chromadb.config import Settings

splitter   = CharacterTextSplitter(separator="\n", chunk_size=800, chunk_overlap=150)
chunks     = splitter.split_documents(documents)
embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
vectorstore = Chroma.from_documents(
    chunks,
    embedding         = embeddings,
    collection_name   = "asic_store",
    persist_directory = persist_dir,
    client_settings   = Settings(anonymized_telemetry=False),
)

bm25 = BM25Retriever.from_documents(documents, k=3)

class FuzzyRetriever(BaseRetriever):
    model_config = {"extra": "allow"}
    _docs: List[Document] = bm25.docs
    _k:   int             = 3

    def _get_relevant_documents(self, query, **_):
        ranked = sorted(
            self._docs,
            key=lambda d: fuzz.partial_ratio(query.lower(), d.page_content.lower()),
            reverse=True,
        )
        return ranked[: self._k]

    async def _aget_relevant_documents(self, query, **_):
        return self._get_relevant_documents(query)

hybrid_retriever = EnsembleRetriever(
    retrievers=[
        vectorstore.as_retriever(search_kwargs={"k": 8}),
        bm25,
        FuzzyRetriever(),
    ],
    weights=[0.5, 0.35, 0.15],
)

class DuneMCP:
    def __init__(self):
        self.dune_dashboards = {
            "Uniswap V3 - Impermanent loss": {
                "iframe": [
                    '<iframe src="https://dune.com/embeds/364806/2419815"/>',
                    '<iframe src="https://dune.com/embeds/364806/704181"/>'
                ],
                "api_id": 364806,
            },
            "Uniswap v3 - Trading Volume Per Fee Tier": {
                "iframe": [
                    '<iframe src="https://dune.com/embeds/343242/653974"/>'
                ],
                "api_id": 343242,
            },
            "Uniswap V3 - pools | New Liquidity Pools Created by fee": {
                "iframe": [
                    '<iframe src="https://dune.com/embeds/340977/649408"/>'
                ],
                "api_id": 340977,
            },
            "Uniswap Crosschain metrics": {
                "iframe": [
                    '<iframe src="https://dune.com/embeds/2627659/4362133"/>'
                ],
                "api_id": 2627659,
            },
            "USD volume on Uniswap | Amount in cash": {
                "iframe": [
                    '<iframe src="https://dune.com/embeds/1292101/2214192"/>'
                ],
                "api_id": 1292101,
            },
            "USD volume on Uniswap | Percent USD data": {
                "iframe": [
                    '<iframe src="https://dune.com/embeds/1292101/2214199"/>'
                ],
                "api_id": 1292101,
            },
            "Uniswap traders": {
                "iframe": [
                    '<iframe src="https://dune.com/embeds/1292101/4362120"/>'
                ],
                "api_id": 1292101,
            },
            "Uniswap Users": {
                "iframe": [
                    '<iframe src="https://dune.com/embeds/192300/601838"/>'
                ],
                "api_id": 192300,
            },
            "Uniswap Volume by pools versions": {
                "iframe": [
                    '<iframe src="https://dune.com/embeds/148110/292148"/>'
                ],
                "api_id": 148110,
            },
            "Uniswap Fee Across Chains": {
                "iframe": [
                    '<iframe src="https://dune.com/embeds/3901953/6558487"/>'
                ],
                "api_id": 3901953,
            },
            "Uniswap Fee Distribution Across Chains": {
                "iframe": [
                    '<iframe src="https://dune.com/embeds/3901953/6560917"/>'
                ],
                "api_id": 3901953,
            },
            "Uniswap-Total number of pool": {
                "iframe": [
                    '<iframe src="https://dune.com/embeds/1620013/2685452"/>'
                ],
                "api_id": 1620013,
            },
            "Daily Ethereum Network Participant Ratios": {
                "iframe": [
                    '<iframe src="https://dune.com/embeds/41840/82493"/>'
                ],
                "api_id": 41840,
            },
            "Sending vs Receiving UsersDaily Ethereum Network Participant Ratios": {
                "iframe": [
                    '<iframe src="https://dune.com/embeds/41840/82415"/>'
                ],
                "api_id": 41840,
            },
            "ETH Staked": {
                "iframe": [
                    '<iframe src="https://dune.com/embeds/1933035/3188467"/>'
                ],
                "api_id": 1933035,
            },
            "ETH Validators": {
                "iframe": [
                    '<iframe src="https://dune.com/embeds/1933036/3188470"/>'
                ],
                "api_id": 1933036,
            },
            "Percentage of Staked ETH": {
                "iframe": [
                    '<iframe src="https://dune.com/embeds/1933048/3188490"/>'
                ],
                "api_id": 1933048,
            },
            "ETH | Net Flow(Excl.Rewards) - Since Shanghai": {
                "iframe": [
                    '<iframe src="https://dune.com/embeds/2394493/3928287"/>'
                ],
                "api_id": 2394493,
            },
            "ETH Stakers": {
                "iframe": [
                    '<iframe src="https://dune.com/embeds/3383110/5677040"/>',
                    '<iframe src="https://dune.com/embeds/2394100/3928083"/>'
                ],
                "api_id": 3383110,
            },
            "Ethereum Staking Flows in ETH": {
                "iframe": [
                    '<iframe src="https://dune.com/embeds/2371805/3888782"/>'
                ],
                "api_id": 2371805,
            },
            "ETH Staked by Entity": {
                "iframe": [
                    '<iframe src="https://dune.com/embeds/1937676/3202670"/>'
                ],
                "api_id": 1937676,
            },
            "ETH Staked by Category": {
                "iframe": [
                    '<iframe src="https://dune.com/embeds/1941407/3202667"/>'
                ],
                "api_id": 1941407,
            },
            "ETH Deposited Monthly, by Entity": {
                "iframe": [
                    '<iframe src="https://dune.com/embeds/1946487/3210952"/>'
                ],
                "api_id": 1946487,
            },
            "ETH Full Withdrawals Weekly, by Entity": {
                "iframe": [
                    '<iframe src="https://dune.com/embeds/2394053/3927448"/>'
                ],
                "api_id": 2394053,
            },
        }

    def get_dashboard_keys(self):
        return list(self.dune_dashboards.keys())
