"""
Smart Selector: Weighted Scoring + Anti-Repetition Engine

Selects the best concept for a stock based on:
1. Relevance scoring (trigger match)
2. Repetition penalty (last 5 blocked, category dampened)
"""

from typing import Optional
from concept_library import (
    ALL_CONCEPTS, StockContext, Category, Concept,
    evaluate_all_concepts, get_concept_by_id
)


def apply_rotation_penalties(
    scores: dict[str, int],
    user_history: list[str]
) -> dict[str, int]:
    """
    Apply anti-repetition penalties:
    - Last 5 concepts: Score = 0 (Hard Block)
    - Same category as last: Score * 0.6 (Soft Dampen)
    """
    if not user_history:
        return scores
    
    last_5 = user_history[-5:] if len(user_history) >= 5 else user_history
    last_concept_id = user_history[-1] if user_history else None
    last_category = None
    
    if last_concept_id:
        last_concept = get_concept_by_id(last_concept_id)
        if last_concept:
            last_category = last_concept.category
    
    penalized_scores = {}
    
    for concept_id, score in scores.items():
        # HARD BLOCK: Seen in last 5
        if concept_id in last_5:
            penalized_scores[concept_id] = 0
            continue
        
        # SOFT DAMPEN: Same category as last
        concept = get_concept_by_id(concept_id)
        if concept and last_category and concept.category == last_category:
            penalized_scores[concept_id] = int(score * 0.6)
        else:
            penalized_scores[concept_id] = score
    
    return penalized_scores


def select_best_concept(
    context: StockContext,
    user_history: list[str] = None
) -> tuple[Concept, dict]:
    """
    Select the best concept for given stock context.
    
    Args:
        context: Stock data and market context
        user_history: List of recently viewed concept IDs
    
    Returns:
        Tuple of (selected Concept, metadata dict)
    """
    user_history = user_history or []
    
    # Step 1: Score all concepts
    raw_scores = evaluate_all_concepts(context)
    
    # Step 2: Apply rotation penalties
    final_scores = apply_rotation_penalties(raw_scores, user_history)
    
    # Step 3: Select highest scoring
    if not final_scores or max(final_scores.values()) == 0:
        # Fallback: all concepts blocked, use default
        best_id = "MM10"  # Stock Ownership Basics
    else:
        best_id = max(final_scores, key=final_scores.get)
    
    concept = get_concept_by_id(best_id)
    
    metadata = {
        "raw_score": raw_scores.get(best_id, 0),
        "final_score": final_scores.get(best_id, 0),
        "history_length": len(user_history),
        "category": concept.category.value if concept else None
    }
    
    return concept, metadata


def get_category_distribution(user_history: list[str]) -> dict[str, int]:
    """
    Get count of concepts per category in user history.
    Useful for debugging rotation.
    """
    distribution = {cat.value: 0 for cat in Category}
    for concept_id in user_history:
        concept = get_concept_by_id(concept_id)
        if concept:
            distribution[concept.category.value] += 1
    return distribution


def generate_lesson_prompt(concept: Concept, context: StockContext) -> str:
    """
    Generate LLM prompt for lesson content.
    """
    return f"""Explain "{concept.name}" to a smart adult who has NEVER invested before.

STYLE RULES:
- NO RHETORICAL QUESTIONS: Never end with "Ask yourself..." or "Are you looking for...?".
- NO DIRECT ADVICE: Do not say "You should consider..." or "This helps you...".
- OBJECTIVE AUTHORITY: State the value proposition as a fact.
    Bad: "This helps you avoid losing money."
    Good: "Investors use this metric to identify downside risk."
- NO BEGINNER TALK: Do not reference "beginners" or "starting out." Treat the reader like an intelligent peer.

Context: The user is looking at {context.name} ({context.symbol}), which is {"up" if context.change_percent >= 0 else "down"} {abs(context.change_percent):.1f}% today.

CRITICAL STRUCTURE:
1. Define the concept simply using everyday words.
2. Conclude with the Strategic Implication. Explain why Institutional Investors care about this data point. Be definitive.
3. Use {context.name} as a real-world example to make it click.

BANNED WORDS:
- Financial jargon: "large-cap", "small-cap", "dividend", "yield", "P/E ratio", "volatility", "portfolio", "bullish", "bearish"
- Childish words: "cool", "stuff", "super", "awesome"

Reference explanation (rephrase, don't copy):
{concept.beginner_explanation}

Rules:
- Limit your response to 150 words. Be concise.
- Maximum 3-4 sentences.
- Professional but simple.
- No intro like "Here's an explanation" - just start.
"""
