"""
Lesson Trigger Engine (Python Backend)

Deterministic logic for selecting lesson topics based on stock data.
The Python logic chooses the topic FIRST, then generates a prompt for the LLM.
"""

from dataclasses import dataclass
from typing import Optional, Callable

@dataclass
class StockData:
    symbol: str
    name: str
    price: float
    change_percent: float
    pe_ratio: Optional[float] = None
    market_cap: float = 0
    beta: Optional[float] = None
    dividend_yield: Optional[float] = None
    week_52_high: Optional[float] = None
    week_52_low: Optional[float] = None


@dataclass
class LessonTrigger:
    id: str
    topic: str
    condition: Callable[[StockData], bool]
    priority: int


LESSON_TRIGGERS = [
    LessonTrigger(
        id='volatility_crash',
        topic='Volatility and Market Corrections',
        condition=lambda s: s.change_percent <= -5,
        priority=1
    ),
    LessonTrigger(
        id='volatility_spike',
        topic='Volatility and Momentum',
        condition=lambda s: s.change_percent >= 5,
        priority=2
    ),
    LessonTrigger(
        id='high_pe_growth',
        topic='High P/E Ratios and Growth Expectations',
        condition=lambda s: s.pe_ratio is not None and s.pe_ratio > 90,
        priority=3
    ),
    # REVISED: Mega-Cap Stability only applies if stock is NOT moving much
    LessonTrigger(
        id='mega_cap_stability',
        topic='Mega-Cap Stability',
        condition=lambda s: s.market_cap > 1_000_000_000_000 and abs(s.change_percent) < 1.5,
        priority=4
    ),
    LessonTrigger(
        id='dividend_income',
        topic='Dividend Investing and Passive Income',
        condition=lambda s: s.dividend_yield is not None and s.dividend_yield > 0.02,
        priority=5
    ),
    LessonTrigger(
        id='high_beta_risk',
        topic='Beta and Market Sensitivity',
        condition=lambda s: s.beta is not None and s.beta > 1.5,
        priority=6
    ),
    # If it's a Mega Cap but moving a bit (1.5% - 5%), talk about Market Influence instead of Stability
    LessonTrigger(
        id='market_mover',
        topic='How Big Companies Move Markets',
        condition=lambda s: s.market_cap > 1_000_000_000_000,
        priority=7
    ),
    LessonTrigger(
        id='near_52_week_high',
        topic='All-Time Highs and Momentum',
        condition=lambda s: s.week_52_high is not None and s.price >= s.week_52_high * 0.95,
        priority=8
    ),
    LessonTrigger(
        id='near_52_week_low',
        topic='Buying the Dip vs Catching a Falling Knife',
        condition=lambda s: s.week_52_low is not None and s.price <= s.week_52_low * 1.1,
        priority=9
    ),
    LessonTrigger(
        id='default_ownership',
        topic='Understanding Stock Ownership',
        condition=lambda s: True,
        priority=100
    )
]


def get_lesson_topic(stock: StockData, recently_viewed: list = None) -> str:
    """
    Get the most relevant lesson topic, skipping recently viewed ones.
    Falls back to highest priority if all are on cooldown.
    """
    sorted_triggers = sorted(LESSON_TRIGGERS, key=lambda t: t.priority)
    recently_viewed = recently_viewed or []
    
    # First pass: find matching trigger not on cooldown
    for trigger in sorted_triggers:
        if trigger.condition(stock):
            if trigger.id not in recently_viewed:
                return trigger.topic
    
    # Fallback: if all matching triggers are on cooldown, use first match anyway
    for trigger in sorted_triggers:
        if trigger.condition(stock):
            return trigger.topic
    
    return 'Understanding Stock Ownership'


def get_lesson_trigger_id(stock: StockData, recently_viewed: list = None) -> str:
    """
    Get the trigger ID for the selected lesson, respecting cooldown.
    """
    sorted_triggers = sorted(LESSON_TRIGGERS, key=lambda t: t.priority)
    recently_viewed = recently_viewed or []
    
    # First pass: find matching trigger not on cooldown
    for trigger in sorted_triggers:
        if trigger.condition(stock):
            if trigger.id not in recently_viewed:
                return trigger.id
    
    # Fallback: if all matching triggers are on cooldown, use first match anyway
    for trigger in sorted_triggers:
        if trigger.condition(stock):
            return trigger.id
    
    return 'default_ownership'


def generate_llama_prompt(topic: str, stock: StockData) -> str:
    """
    Generates a structured prompt for the LLM.
    Format: Define the concept first, then use the stock as an example.
    """
    return f"""Explain "{topic}" to a smart adult who has NEVER invested before.

Tone: Professional, conversational, and jargon-free. Like explaining to a friend at a coffee shop.

Structure:
1. First sentence: Define the concept using ONLY everyday words.
2. Second sentence: Use {stock.name} as an example.

BANNED WORDS (do not use these):
- Financial jargon: "large-cap", "small-cap", "mid-cap", "dividend", "yield", "P/E ratio", "volatility", "portfolio", "liquidity", "bullish", "bearish", "market cap"
- Childish words: "cool", "stuff", "super", "awesome", "neat"

Instead use:
- "huge company" instead of "large-cap"
- "company pays you money" instead of "dividends"
- "how much the company is worth" instead of "market cap"

Example of good output:
"A mega-cap stock is a company so huge that it's worth hundreds of billions of dollars - like the biggest companies in the world. {stock.name} is one of these giants."

Rules:
- Maximum 2 sentences.
- Professional but simple - like a Bloomberg article for beginners.
- No finance jargon, no childish language.
- Just write the sentences, no intro."""


def prepare_lesson_prompt(stock: StockData, recently_viewed: list = None) -> dict:
    """
    Prepare the lesson prompt, respecting cooldown for recently viewed lessons.
    """
    recently_viewed = recently_viewed or []
    topic = get_lesson_topic(stock, recently_viewed)
    trigger_id = get_lesson_trigger_id(stock, recently_viewed)
    prompt = generate_llama_prompt(topic, stock)
    return {
        'topic': topic,
        'trigger_id': trigger_id,
        'prompt': prompt
    }
