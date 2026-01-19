"""
Simple JSON-based cache for LLM responses.
Stores cached content with TTL (time-to-live).
"""
import os
import json
import time
from pathlib import Path
from typing import Optional, Any

# Cache file path
CACHE_DIR = Path(__file__).parent / "cache"
CACHE_FILE = CACHE_DIR / "llm_cache.json"

# TTL values in seconds
TTL_BREAKDOWN = int(os.getenv("CACHE_TTL_BREAKDOWN", 86400))  # 24 hours
TTL_CONCEPT = int(os.getenv("CACHE_TTL_CONCEPT", 21600))      # 6 hours
TTL_QUIZ = int(os.getenv("CACHE_TTL_QUIZ", 604800))           # 7 days


def _ensure_cache_dir():
    """Create cache directory if it doesn't exist."""
    CACHE_DIR.mkdir(parents=True, exist_ok=True)
    if not CACHE_FILE.exists():
        CACHE_FILE.write_text("{}")


def _load_cache() -> dict:
    """Load cache from file."""
    _ensure_cache_dir()
    try:
        return json.loads(CACHE_FILE.read_text())
    except (json.JSONDecodeError, FileNotFoundError):
        return {}


def _save_cache(cache: dict):
    """Save cache to file."""
    _ensure_cache_dir()
    CACHE_FILE.write_text(json.dumps(cache, indent=2))


def get_cached(key: str) -> Optional[Any]:
    """
    Get cached value if it exists and hasn't expired.
    
    Args:
        key: Cache key (e.g., "breakdown:MSFT")
        
    Returns:
        Cached value or None if not found/expired
    """
    cache = _load_cache()
    entry = cache.get(key)
    
    if not entry:
        return None
    
    # Check if expired
    if time.time() > entry.get("expires_at", 0):
        # Expired, remove from cache
        del cache[key]
        _save_cache(cache)
        return None
    
    return entry.get("value")


def set_cached(key: str, value: Any, ttl: int):
    """
    Store value in cache with TTL.
    
    Args:
        key: Cache key
        value: Value to store
        ttl: Time-to-live in seconds
    """
    cache = _load_cache()
    cache[key] = {
        "value": value,
        "expires_at": time.time() + ttl,
        "created_at": time.time()
    }
    _save_cache(cache)


def invalidate(key: str):
    """Remove a specific key from cache."""
    cache = _load_cache()
    if key in cache:
        del cache[key]
        _save_cache(cache)


def invalidate_symbol(symbol: str):
    """Remove all cached content for a symbol."""
    cache = _load_cache()
    keys_to_remove = [k for k in cache.keys() if k.endswith(f":{symbol.upper()}")]
    for key in keys_to_remove:
        del cache[key]
    _save_cache(cache)


def clear_all():
    """Clear entire cache."""
    _save_cache({})


def get_stats() -> dict:
    """Get cache statistics."""
    cache = _load_cache()
    now = time.time()
    
    valid = sum(1 for e in cache.values() if e.get("expires_at", 0) > now)
    expired = len(cache) - valid
    
    return {
        "total_entries": len(cache),
        "valid": valid,
        "expired": expired
    }
