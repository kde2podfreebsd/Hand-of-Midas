import json
import aiosqlite
from typing import List, Dict
from logger.logger import setup_logger

class ClientDatabase:
    def __init__(self):
        self.db_path = "temp.db"
        self.logger = setup_logger("ClientDatabase", "client_database.log")

    @staticmethod
    async def get_db():
        db = await aiosqlite.connect("temp.db")
        try:
            yield db
        finally:
            await db.close()

    async def initialize_tables(self):
        try:
            async with aiosqlite.connect(self.db_path) as db:
                await db.execute("""
                    CREATE TABLE IF NOT EXISTS clients (
                        wallet TEXT PRIMARY KEY,
                        seed_phrase TEXT NOT NULL,
                        context TEXT DEFAULT '{}'
                    );
                """)
                await db.execute("""
                    CREATE TABLE IF NOT EXISTS survey_answers (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        user_id TEXT NOT NULL,
                        question_id INTEGER NOT NULL,
                        answer TEXT NOT NULL
                    );
                """)
                await db.commit()
                self.logger.info("Таблицы успешно инициализированы.")
        except Exception as e:
            self.logger.error(f"Ошибка при инициализации таблиц: {e}")

    async def create_client(self, wallet: str, seed_phrase: str):
        try:
            async with aiosqlite.connect(self.db_path) as db:
                cursor = await db.execute("SELECT 1 FROM clients WHERE wallet = ?;", (wallet,))
                exists = await cursor.fetchone()

                if exists:
                    self.logger.info(f"Клиент {wallet} уже существует в базе данных.")
                    return

                await db.execute("""
                    INSERT INTO clients (wallet, seed_phrase, context)
                    VALUES (?, ?, ?);
                """, (wallet, seed_phrase, json.dumps({})))
                await db.commit()
                self.logger.info(f"Клиент {wallet} успешно создан.")
        except Exception as e:
            self.logger.error(f"Ошибка при создании клиента {wallet}: {e}")

    async def get_all_clients(self) -> List[Dict]:
        try:
            async with aiosqlite.connect(self.db_path) as db:
                cursor = await db.execute("SELECT * FROM clients;")
                rows = await cursor.fetchall()
                clients = [
                    {"wallet": row[0], "seed_phrase": row[1], "context": json.loads(row[2])}
                    for row in rows
                ]
                self.logger.info("Успешно получены все клиенты.")
                return clients
        except Exception as e:
            self.logger.error(f"Ошибка при получении всех клиентов: {e}")
            return []

    async def add_message_to_context(self, wallet: str, message: Dict):
        try:
            async with aiosqlite.connect(self.db_path) as db:
                cursor = await db.execute("SELECT context FROM clients WHERE wallet = ?;", (wallet,))
                row = await cursor.fetchone()
                if row:
                    context = json.loads(row[0])
                    context.update(message)
                    await db.execute("UPDATE clients SET context = ? WHERE wallet = ?;", (json.dumps(context), wallet))
                    await db.commit()
                    self.logger.info(f"Сообщение добавлено в контекст для клиента {wallet}.")
                else:
                    self.logger.warning(f"Клиент {wallet} не найден.")
        except Exception as e:
            self.logger.error(f"Ошибка при добавлении сообщения в контекст для клиента {wallet}: {e}")

    async def clear_context_for_user(self, wallet: str):
        try:
            async with aiosqlite.connect(self.db_path) as db:
                await db.execute("UPDATE clients SET context = ? WHERE wallet = ?;", (json.dumps({}), wallet))
                await db.commit()
                self.logger.info(f"Контекст для клиента {wallet} успешно очищен.")
        except Exception as e:
            self.logger.error(f"Ошибка при очистке контекста для клиента {wallet}: {e}")

    async def save_answer(self, user_id: str, question_id: int, answer: str):
        try:
            async with aiosqlite.connect(self.db_path) as db:
                await db.execute("""
                    INSERT INTO survey_answers (user_id, question_id, answer)
                    VALUES (?, ?, ?);
                """, (user_id, question_id, answer))
                await db.commit()
                self.logger.info(f"Ответ пользователя {user_id} на вопрос {question_id} сохранен.")
        except Exception as e:
            self.logger.error(f"Ошибка при сохранении ответа пользователя {user_id}: {e}")

    async def get_user_answers(self, user_id: str) -> Dict[int, str]:
        try:
            async with aiosqlite.connect(self.db_path) as db:
                cursor = await db.execute("SELECT question_id, answer FROM survey_answers WHERE user_id = ?;", (user_id,))
                rows = await cursor.fetchall()
                answers = {row[0]: row[1] for row in rows}
                self.logger.info(f"Ответы пользователя {user_id} успешно получены.")
                return answers
        except Exception as e:
            self.logger.error(f"Ошибка при получении ответов пользователя {user_id}: {e}")
            return {}