from abc import ABC, abstractmethod


class AbstractMongoDBConnector(ABC):
    @abstractmethod
    async def connect(self):
        pass

    @abstractmethod
    async def close(self):
        pass

    @abstractmethod
    async def get_db(self):
        pass

    @abstractmethod
    async def check_connection(self):
        pass
