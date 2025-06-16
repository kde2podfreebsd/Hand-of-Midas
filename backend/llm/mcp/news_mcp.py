from backend.database.mongodb.telegram_posts import TelegramPostConnector
from backend.llm.llm_agents.summary_llm import ChatGPTSummaryNewsService
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

class NewsMCP:
    def __init__(self):
        self.connector = TelegramPostConnector(
            uri="mongodb://root:rootpassword@localhost:27017/",
            db_name="news"
        )
        self.summary_llm = ChatGPTSummaryNewsService()

    async def get_tags(self):
        await self.connector.connect()
        tags = await self.connector.get_unique_tags()
        await self.connector.close()
        return tags

    async def get_news_summary_by_tags(self, tags: list) -> str:
        await self.connector.connect()
        posts_text = ''
        page = 1
        try:
            while True:
                posts = await self.connector.get_posts_by_tags(tags_list=tags, page=page)
                if not posts:
                    break
                for post in posts:
                    text = post.get("text", "").strip()
                    if text:
                        posts_text += text + "\n\n"
                page += 1

            if posts_text == '':
                return False

            print("\n\n!!!!POSTS TEXT:", posts_text)
            summary = await self.summary_llm.generate_news_summary(news_text=posts_text)
            return summary

        except Exception as e:
            raise Exception(f"Failed to generate news summary: {e}")
        finally:
            await self.connector.close()
