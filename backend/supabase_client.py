"""
Supabase Client Module

Provides database connectivity for lesson rotation and user tracking.
"""

import os
from typing import Optional, List
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

# Lazy-loaded client
_supabase_client = None


def get_supabase_client():
    """Get or create the Supabase client."""
    global _supabase_client
    
    if _supabase_client is None:
        if not SUPABASE_URL or not SUPABASE_KEY:
            print("Warning: Supabase credentials not configured")
            return None
        
        try:
            from supabase import create_client
            _supabase_client = create_client(SUPABASE_URL, SUPABASE_KEY)
        except ImportError:
            print("Warning: supabase-py not installed. Run: pip install supabase")
            return None
        except Exception as e:
            print(f"Warning: Failed to connect to Supabase: {e}")
            return None
    
    return _supabase_client


def get_recent_lessons(user_id: str, limit: int = 10) -> List[str]:
    """
    Fetch the last N lesson_ids for a user.
    Returns a list of lesson_id strings.
    """
    client = get_supabase_client()
    if not client:
        return []
    
    try:
        response = client.table("user_lesson_views") \
            .select("lesson_id") \
            .eq("user_id", user_id) \
            .order("viewed_at", desc=True) \
            .limit(limit) \
            .execute()
        
        return [row["lesson_id"] for row in response.data]
    except Exception as e:
        print(f"Error fetching recent lessons: {e}")
        return []


def record_lesson_view(user_id: str, lesson_id: str, stock_symbol: str) -> bool:
    """
    Record that a user viewed a specific lesson for a stock.
    Returns True on success, False on failure.
    """
    client = get_supabase_client()
    if not client:
        return False
    
    try:
        client.table("user_lesson_views").insert({
            "user_id": user_id,
            "lesson_id": lesson_id,
            "stock_symbol": stock_symbol
        }).execute()
        return True
    except Exception as e:
        print(f"Error recording lesson view: {e}")
        return False


def get_or_create_anonymous_user_id() -> str:
    """
    Generate a consistent anonymous user ID.
    In production, this would come from auth.
    For now, we use a placeholder UUID for demo purposes.
    """
    # Demo/anonymous user ID
    return "00000000-0000-0000-0000-000000000000"
