import json
import logging
import time
from typing import Optional, Any
import redis

logger = logging.getLogger(__name__)

class RedisCacheManager:
    """
    Production Redis client wrapper handling data caching, service rate-limiting,
    and temporary session storage.
    """
    def __init__(self, host: str = "localhost", port: int = 6379, db: int = 0, password: Optional[str] = None):
        try:
            self.client = redis.Redis(
                host=host,
                port=port,
                db=db,
                password=password,
                decode_responses=True,
                socket_timeout=5.0
            )
            # Ping connection to fail-fast if offline
            self.client.ping()
            self.active = True
        except Exception as e:
            logger.warning(f"Failed to connect to Redis at {host}:{port}. Falling back to in-memory emulated cache. Reason: {e}")
            self.client = None
            self.active = False
            # Simple in-memory fallback dict for development stability
            self._local_cache = {}

    def get(self, key: str) -> Optional[Any]:
        if self.active and self.client:
            try:
                val = self.client.get(key)
                return json.loads(val) if val else None
            except Exception as e:
                logger.error(f"Redis get error: {e}")
                return None
        return self._local_cache.get(key)

    def set(self, key: str, value: Any, expire_seconds: int = 3600) -> bool:
        if self.active and self.client:
            try:
                serialized = json.dumps(value)
                return self.client.set(key, serialized, ex=expire_seconds)
            except Exception as e:
                logger.error(f"Redis set error: {e}")
                return False
        self._local_cache[key] = value
        return True

    def delete(self, key: str) -> bool:
        if self.active and self.client:
            try:
                return bool(self.client.delete(key))
            except Exception as e:
                logger.error(f"Redis delete error: {e}")
                return False
        if key in self._local_cache:
            del self._local_cache[key]
            return True
        return False

    def is_rate_limited(self, ip_address: str, limit: int = 60, window_seconds: int = 60) -> bool:
        """
        Implements a sliding window rate limiter to throttle API abuse.
        """
        key = f"rate_limit:{ip_address}"
        current_time = time.time()
        
        if self.active and self.client:
            try:
                # Use Redis transaction pipeline to ensure atomicity
                pipe = self.client.pipeline()
                # Remove timestamps older than the window
                pipe.zremrangebyscore(key, 0, current_time - window_seconds)
                # Count total requests remaining in window
                pipe.zcard(key)
                # Add current request timestamp
                pipe.zadd(key, {str(current_time): current_time})
                # Set key TTL to match window expiration
                pipe.expire(key, window_seconds)
                
                _, request_count, _, _ = pipe.execute()
                return request_count > limit
            except Exception as e:
                logger.error(f"Redis rate limiter error: {e}")
                return False
        
        # Local mock fallback
        if key not in self._local_cache:
            self._local_cache[key] = []
        
        # Filter local timestamps
        timestamps = [t for t in self._local_cache[key] if t > current_time - window_seconds]
        timestamps.append(current_time)
        self._local_cache[key] = timestamps
        return len(timestamps) > limit

# Singleton instance for global backend use
redis_cache = RedisCacheManager()
