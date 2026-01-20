"""
Content Retriever: Hybrid Retrieval with Cold Start Logic

- If verified_count == 0: FORCE 100% AI generation
- If verified_count > 0: Use 80% DB / 20% AI split
"""

import random
from typing import Optional
from supabase_client import get_supabase_client


async def count_verified_content(concept_id: str) -> int:
    """Count verified lessons for a concept."""
    try:
        supabase = get_supabase_client()
        if not supabase:
            return 0
        
        result = supabase.table("generated_content").select(
            "id", count="exact"
        ).eq("concept_id", concept_id).eq("verified", True).execute()
        
        return result.count or 0
    except Exception as e:
        print(f"Error counting verified content: {e}")
        return 0


async def fetch_verified_content(concept_id: str, stock_symbol: str = None) -> Optional[dict]:
    """Fetch a random verified lesson for a concept, optionally filtered by stock."""
    try:
        supabase = get_supabase_client()
        if not supabase:
            return None
        
        query = supabase.table("generated_content").select(
            "id, concept_id, stock_symbol, breakdown, lesson, quiz, quality_score"
        ).eq("concept_id", concept_id).eq("verified", True)
        
        # Filter by stock symbol if provided (ensures stock-specific lessons)
        if stock_symbol:
            query = query.eq("stock_symbol", stock_symbol)
        
        result = query.order("quality_score", desc=True).limit(5).execute()
        
        if result.data and len(result.data) > 0:
            # Return random from top 5 by quality
            return random.choice(result.data)
        return None
    except Exception as e:
        print(f"Error fetching verified content: {e}")
        return None


async def save_generated_content(
    concept_id: str,
    stock_symbol: str,
    breakdown: str,
    lesson: str,
    quiz: list
) -> Optional[str]:
    """Save newly generated content to DB for future verification."""
    try:
        supabase = get_supabase_client()
        if not supabase:
            print("DEBUG: Supabase client is None")
            return None
        
        insert_data = {
            "concept_id": concept_id,
            "stock_symbol": stock_symbol,
            "breakdown": breakdown,
            "lesson": lesson,
            "quiz": quiz,
            "quality_score": 0,
            "verified": False
        }
        print(f"DEBUG: Inserting content for concept {concept_id}")
        
        result = supabase.table("generated_content").insert(insert_data).execute()
        
        print(f"DEBUG: Insert result data: {result.data}")
        
        if result.data and len(result.data) > 0:
            content_id = result.data[0].get("id")
            print(f"DEBUG: Saved content with ID: {content_id}")
            return content_id
        
        print("DEBUG: No data in result")
        return None
    except Exception as e:
        print(f"Error saving generated content: {e}")
        import traceback
        traceback.print_exc()
        return None


async def get_content_with_cold_start(
    concept_id: str,
    generate_fresh_fn
) -> tuple[dict, dict]:
    """
    Hybrid retrieval with Cold Start handling.
    
    Args:
        concept_id: The concept to fetch content for
        generate_fresh_fn: Async function to generate fresh content
    
    Returns:
        Tuple of (content_dict, metadata_dict)
    """
    # Check how many verified lessons exist
    verified_count = await count_verified_content(concept_id)
    
    # COLD START: No verified content exists
    if verified_count == 0:
        content = await generate_fresh_fn()
        return content, {
            "source": "ai",
            "cold_start": True,
            "is_ai_generated": True,
            "content_id": None
        }
    
    # HYBRID: Verified content exists
    # 80% chance: Serve from DB
    # 20% chance: Generate fresh (exploration)
    if random.random() < 0.8:
        verified = await fetch_verified_content(concept_id)
        if verified:
            return verified, {
                "source": "db",
                "cold_start": False,
                "is_ai_generated": False,
                "content_id": verified.get("id")
            }
    
    # 20% exploration or DB fetch failed
    content = await generate_fresh_fn()
    return content, {
        "source": "ai",
        "cold_start": False,
        "is_ai_generated": True,
        "content_id": None
    }


async def update_quality_score(content_id: str, increment: int = 1) -> bool:
    """
    Update quality score and auto-verify if threshold reached.
    
    Args:
        content_id: UUID of the content
        increment: Amount to add (positive for upvote, negative for downvote)
    
    Returns:
        True if update succeeded
    """
    try:
        supabase = get_supabase_client()
        if not supabase:
            return False
        
        # Get current score
        result = supabase.table("generated_content").select(
            "quality_score"
        ).eq("id", content_id).single().execute()
        
        if not result.data:
            return False
        
        current_score = result.data.get("quality_score", 0)
        new_score = current_score + increment
        
        # Auto-verify at score >= 5
        verified = new_score >= 5
        
        supabase.table("generated_content").update({
            "quality_score": new_score,
            "verified": verified,
            "updated_at": "now()"
        }).eq("id", content_id).execute()
        
        return True
    except Exception as e:
        print(f"Error updating quality score: {e}")
        return False
