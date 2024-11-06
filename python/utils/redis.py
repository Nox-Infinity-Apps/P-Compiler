import aioredis
from aioredis import Redis


class Cache:
    _instance: Redis = None

    @classmethod
    async def get_instance(cls) -> Redis:
        if cls._instance is None:
            cls._instance = await aioredis.from_url("redis://localhost")
        return cls._instance

    @classmethod
    async def get(cls, key: str):
        redis = await cls.get_instance()
        value = await redis.get(key, encoding="utf-8")
        return value

    @classmethod
    async def set(cls, key: str, value: str):
        redis = await cls.get_instance()
        await redis.set(key, value)
