import json

import orjson
from redis.asyncio import Redis


class Cache:
    _instance: Redis = None

    @classmethod
    async def get_instance(cls) -> Redis:
        if cls._instance is None:
            cls._instance = await Redis.from_url("redis://localhost")
        return cls._instance

    @classmethod
    async def get(cls, key: str):
        redis = await cls.get_instance()
        value = await redis.get(key)
        if value is not None:
            value = value.decode("utf-8")
        return json.loads(value)

    @classmethod
    async def set(cls, key: str, value):
        redis = await cls.get_instance()
        value = orjson.dumps(value)
        await redis.set(key, value, expire=60 * 60 * 24)
