import json
import os

import orjson
from redis.asyncio import Redis

from common.di.manager import inject
from utils.env import Environment, environment


class Cache:
    _instance: Redis = None

    @classmethod
    async def get_instance(self) -> Redis:
        if self._instance is None:
            self._instance = await Redis.from_url(environment.redis_url)
        return self._instance

    @classmethod
    async def get(cls, key: str):
        redis = await cls.get_instance()
        value = await redis.get(key)
        if value is None:
            return None

        try:
            value = value.decode("utf-8")  # Giải mã giá trị
            return orjson.loads(value)  # Sử dụng orjson để giải mã JSON
        except (UnicodeDecodeError, orjson.JSONDecodeError) as e:
            # Log lỗi nếu có vấn đề giải mã hoặc JSON không hợp lệ
            print(f"Error decoding or parsing JSON for key {key}: {e}")
            return None

    @classmethod
    async def set(cls, key: str, value):
        redis = await cls.get_instance()
        try:
            serialized_value = orjson.dumps(value)  # Sử dụng orjson để serialize
            await redis.set(key, serialized_value, ex=60*5)  # Lưu vào Redis
        except orjson.JSONEncodeError as e:
            # Log lỗi nếu dữ liệu không thể serialize
            print(f"Error serializing value for key {key}: {e}")
