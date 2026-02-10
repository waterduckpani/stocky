"""
Concept Library: 30 Investing Concepts with Trigger Logic

Categories:
- Price Action (PA): Movement-based concepts
- Fundamentals (FU): Value and financial metrics
- Market Mechanics (MM): Broader market dynamics
"""

from dataclasses import dataclass
from typing import Callable, Optional
from enum import Enum


class Category(Enum):
    PRICE_ACTION = "price_action"
    FUNDAMENTALS = "fundamentals"
    MARKET_MECHANICS = "market_mechanics"


@dataclass
class StockContext:
    """All available stock data for trigger evaluation."""
    symbol: str
    name: str
    price: float
    change_percent: float
    volume: int = 0
    avg_volume: int = 0
    market_cap: float = 0
    pe_ratio: Optional[float] = None
    dividend_yield: Optional[float] = None
    dividend_rate: Optional[float] = None
    week_52_high: Optional[float] = None
    week_52_low: Optional[float] = None
    beta: Optional[float] = None
    sector: str = "Unknown"
    # Market context
    vix_level: float = 15.0
    sp500_change: float = 0.0
    # News context
    news_sentiment: str = "neutral"  # positive, negative, neutral
    has_news: bool = False


@dataclass
class Concept:
    """A single investing concept with trigger logic."""
    id: str
    name: str
    category: Category
    trigger: Callable[[StockContext], bool]
    base_score: int  # Score when trigger matches (50-100)
    partial_score: int  # Score when partially relevant (0-30)
    description: str
    beginner_explanation: str


# =============================================================================
# CATEGORY A: PRICE ACTION (10 Concepts)
# =============================================================================

PA_CONCEPTS = [
    Concept(
        id="PA01",
        name="Volatility Spike",
        category=Category.PRICE_ACTION,
        trigger=lambda s: s.change_percent >= 5 or s.change_percent <= -5,
        base_score=90,
        partial_score=20,
        description="Stock moving 5%+ in a single day",
        beginner_explanation="When a stock moves dramatically in one day, it's called volatility. This can happen because of big news, earnings surprises, or market-wide panic."
    ),
    Concept(
        id="PA02",
        name="Market Correction",
        category=Category.PRICE_ACTION,
        trigger=lambda s: s.change_percent <= -5,
        base_score=95,
        partial_score=15,
        description="Significant single-day drop",
        beginner_explanation="A correction happens when stocks drop sharply. It can feel scary, but corrections are normal and often create buying opportunities for patient investors."
    ),
    Concept(
        id="PA03",
        name="Momentum Rally",
        category=Category.PRICE_ACTION,
        trigger=lambda s: s.change_percent >= 3 and s.week_52_high and s.price >= s.week_52_high * 0.9,
        base_score=85,
        partial_score=25,
        description="Strong upward movement near highs",
        beginner_explanation="Momentum means a stock keeps moving in the same direction. When a stock is rising toward its highs, buyers often pile in expecting more gains."
    ),
    Concept(
        id="PA04",
        name="Buying the Dip",
        category=Category.PRICE_ACTION,
        trigger=lambda s: s.week_52_low and s.price <= s.week_52_low * 1.1,
        base_score=80,
        partial_score=20,
        description="Price near 52-week lows",
        beginner_explanation="'Buying the dip' means purchasing a stock after it falls, hoping it recovers. The risk? Sometimes stocks fall for good reasons and keep falling."
    ),
    Concept(
        id="PA05",
        name="All-Time Highs",
        category=Category.PRICE_ACTION,
        trigger=lambda s: s.week_52_high and s.price >= s.week_52_high * 0.95,
        base_score=85,
        partial_score=25,
        description="Trading near record prices",
        beginner_explanation="When a stock hits all-time highs, it means everyone who ever bought it is now profitable. This can attract more buyers or signal it's time to take profits."
    ),
    Concept(
        id="PA06",
        name="Volume Surge",
        category=Category.PRICE_ACTION,
        trigger=lambda s: s.avg_volume > 0 and s.volume >= s.avg_volume * 2,
        base_score=75,
        partial_score=15,
        description="Trading volume 2x+ average",
        beginner_explanation="High volume means lots of shares are changing hands. Big volume often confirms that a price move is 'real' and not just random noise."
    ),
    Concept(
        id="PA07",
        name="Consolidation",
        category=Category.PRICE_ACTION,
        trigger=lambda s: abs(s.change_percent) < 0.5,
        base_score=60,
        partial_score=30,
        description="Minimal price movement",
        beginner_explanation="When a stock barely moves, it's 'consolidating.' This often happens before a bigger move as buyers and sellers reach a temporary balance."
    ),
    Concept(
        id="PA08",
        name="Breakout Pattern",
        category=Category.PRICE_ACTION,
        trigger=lambda s: s.week_52_high and s.price > s.week_52_high and s.change_percent > 2,
        base_score=90,
        partial_score=20,
        description="Breaking above 52-week high",
        beginner_explanation="A breakout happens when a stock pushes past a resistance level. It often signals that buyers are in control and more upside could come."
    ),
    Concept(
        id="PA09",
        name="Gap Up/Down",
        category=Category.PRICE_ACTION,
        trigger=lambda s: abs(s.change_percent) >= 2,
        base_score=70,
        partial_score=20,
        description="Significant opening gap",
        beginner_explanation="A gap happens when a stock opens much higher or lower than it closed. Gaps often occur after overnight news that changes investor sentiment."
    ),
    Concept(
        id="PA10",
        name="Range Bound",
        category=Category.PRICE_ACTION,
        trigger=lambda s: abs(s.change_percent) < 1 and s.week_52_high and s.week_52_low and (s.week_52_high - s.week_52_low) / s.price < 0.2,
        base_score=55,
        partial_score=25,
        description="Trading in tight range",
        beginner_explanation="Some stocks trade in a predictable range, bouncing between support and resistance. Traders try to buy low and sell high within this range."
    ),
]


# =============================================================================
# CATEGORY B: FUNDAMENTALS (10 Concepts)
# =============================================================================

FU_CONCEPTS = [
    Concept(
        id="FU01",
        name="High P/E Growth Stock",
        category=Category.FUNDAMENTALS,
        trigger=lambda s: s.pe_ratio is not None and s.pe_ratio > 50,
        base_score=80,
        partial_score=20,
        description="P/E ratio above 50",
        beginner_explanation="P/E ratio shows how much you pay per dollar of company profit. A high P/E means investors expect big future growth - but it's risky if growth disappoints."
    ),
    Concept(
        id="FU02",
        name="Value Investing",
        category=Category.FUNDAMENTALS,
        trigger=lambda s: s.pe_ratio is not None and s.pe_ratio > 0 and s.pe_ratio < 15,
        base_score=75,
        partial_score=20,
        description="Low P/E value stock",
        beginner_explanation="Value investing means buying stocks that seem 'cheap' compared to their earnings. The idea is the market has undervalued them and they'll rise."
    ),
    Concept(
        id="FU03",
        name="Mega-Cap Stability",
        category=Category.FUNDAMENTALS,
        trigger=lambda s: s.market_cap > 1_000_000_000_000,  # $1T
        base_score=70,
        partial_score=30,
        description="Trillion-dollar company",
        beginner_explanation="The biggest companies in the world are worth over a trillion dollars. They tend to be more stable because they're so large and diverse."
    ),
    Concept(
        id="FU04",
        name="Mid-Cap Opportunity",
        category=Category.FUNDAMENTALS,
        trigger=lambda s: 10_000_000_000 < s.market_cap < 100_000_000_000,  # $10B-$100B
        base_score=65,
        partial_score=25,
        description="Medium-sized company",
        beginner_explanation="Mid-cap stocks are medium-sized companies. They often offer a balance between the stability of large caps and the growth potential of small caps."
    ),
    Concept(
        id="FU05",
        name="Small-Cap Risk/Reward",
        category=Category.FUNDAMENTALS,
        trigger=lambda s: s.market_cap < 2_000_000_000,  # $2B
        base_score=70,
        partial_score=20,
        description="Small company stock",
        beginner_explanation="Small-cap stocks are smaller companies with more room to grow - but also more risk. They can double quickly or lose half their value."
    ),
    Concept(
        id="FU06",
        name="Dividend Income",
        category=Category.FUNDAMENTALS,
        trigger=lambda s: s.dividend_yield is not None and s.dividend_yield > 0.02,
        base_score=75,
        partial_score=20,
        description="Pays 2%+ dividend yield",
        beginner_explanation="Some companies pay dividends - cash payments to shareholders. It's like getting paid just for owning the stock, regardless of price changes."
    ),
    Concept(
        id="FU07",
        name="Growth vs Value",
        category=Category.FUNDAMENTALS,
        trigger=lambda s: s.pe_ratio is not None and (s.pe_ratio > 30 or s.pe_ratio < 15),
        base_score=65,
        partial_score=25,
        description="Classic investing debate",
        beginner_explanation="Growth stocks trade at high prices expecting future gains. Value stocks trade cheaply hoping for a turnaround. Both strategies can work."
    ),
    Concept(
        id="FU08",
        name="Earnings Power",
        category=Category.FUNDAMENTALS,
        trigger=lambda s: s.pe_ratio is not None and 15 <= s.pe_ratio <= 25,
        base_score=60,
        partial_score=30,
        description="Healthy earnings ratio",
        beginner_explanation="A company's earnings power shows how much profit it generates. Stocks with steady, growing earnings often make reliable long-term investments."
    ),
    Concept(
        id="FU09",
        name="Sector Leaders",
        category=Category.FUNDAMENTALS,
        trigger=lambda s: s.market_cap > 500_000_000_000,  # $500B
        base_score=65,
        partial_score=25,
        description="Industry-leading company",
        beginner_explanation="Sector leaders are the dominant players in their industry. They often have competitive advantages that protect their market share."
    ),
    Concept(
        id="FU10",
        name="Company Valuation",
        category=Category.FUNDAMENTALS,
        trigger=lambda s: True,  # Default fundamental concept
        base_score=50,
        partial_score=30,
        description="Understanding stock prices",
        beginner_explanation="A stock's price doesn't tell you if it's expensive or cheap. You need to compare price to earnings, sales, or assets to understand true value."
    ),
]


# =============================================================================
# CATEGORY C: MARKET MECHANICS (10 Concepts)
# =============================================================================

MM_CONCEPTS = [
    Concept(
        id="MM01",
        name="Sector Rotation",
        category=Category.MARKET_MECHANICS,
        trigger=lambda s: s.sector in ["Technology", "Healthcare", "Energy"] and abs(s.change_percent) > 1,
        base_score=70,
        partial_score=25,
        description="Money flowing between sectors",
        beginner_explanation="Investors often rotate money between sectors based on economic conditions. Tech might lead in growth periods, while utilities lead in uncertainty."
    ),
    Concept(
        id="MM02",
        name="Fear Index (VIX)",
        category=Category.MARKET_MECHANICS,
        trigger=lambda s: s.vix_level > 25,
        base_score=85,
        partial_score=20,
        description="Market fear is elevated",
        beginner_explanation="The VIX measures how nervous investors are. When it spikes, people are scared. Some investors see high fear as a buying opportunity."
    ),
    Concept(
        id="MM03",
        name="Market Correlation",
        category=Category.MARKET_MECHANICS,
        trigger=lambda s: (s.change_percent > 0 and s.sp500_change > 0) or (s.change_percent < 0 and s.sp500_change < 0),
        base_score=65,
        partial_score=30,
        description="Stock moving with the market",
        beginner_explanation="Most stocks move with the overall market. When the S&P 500 rises, most stocks rise too. This correlation is normal and expected."
    ),
    Concept(
        id="MM04",
        name="Company-Specific Move",
        category=Category.MARKET_MECHANICS,
        trigger=lambda s: (s.change_percent > 1 and s.sp500_change < 0) or (s.change_percent < -1 and s.sp500_change > 0),
        base_score=80,
        partial_score=20,
        description="Stock diverging from market",
        beginner_explanation="When a stock moves opposite to the market, something specific to that company is driving it - like news, earnings, or a product launch."
    ),
    Concept(
        id="MM05",
        name="Analyst Opinions",
        category=Category.MARKET_MECHANICS,
        trigger=lambda s: s.has_news,
        base_score=65,
        partial_score=25,
        description="Wall Street research impact",
        beginner_explanation="Analysts at big banks rate stocks as buy, hold, or sell. Their upgrades or downgrades can move stock prices significantly."
    ),
    Concept(
        id="MM06",
        name="Institutional Ownership",
        category=Category.MARKET_MECHANICS,
        trigger=lambda s: s.market_cap > 100_000_000_000,  # Large caps have high institutional ownership
        base_score=60,
        partial_score=25,
        description="Big funds own this stock",
        beginner_explanation="Institutional investors like mutual funds and pensions own most large stocks. Their buying and selling can move prices significantly."
    ),
    Concept(
        id="MM07",
        name="Market Sentiment",
        category=Category.MARKET_MECHANICS,
        trigger=lambda s: s.news_sentiment in ["positive", "negative"],
        base_score=70,
        partial_score=25,
        description="Overall investor mood",
        beginner_explanation="Market sentiment is the overall mood of investors. When people are optimistic, stocks tend to rise. Fear causes selling."
    ),
    Concept(
        id="MM08",
        name="Trading Liquidity",
        category=Category.MARKET_MECHANICS,
        trigger=lambda s: s.avg_volume > 10_000_000,
        base_score=55,
        partial_score=30,
        description="Easy to buy and sell",
        beginner_explanation="Liquidity means how easily you can buy or sell a stock. High-volume stocks are more liquid - you can trade without moving the price."
    ),
    Concept(
        id="MM09",
        name="News Reaction",
        category=Category.MARKET_MECHANICS,
        trigger=lambda s: s.has_news and abs(s.change_percent) > 1,
        base_score=80,
        partial_score=20,
        description="Stock responding to headlines",
        beginner_explanation="Stocks often react instantly to news. Good news pushes prices up, bad news pushes them down. But sometimes the reaction is the opposite!"
    ),
    Concept(
        id="MM10",
        name="Stock Ownership Basics",
        category=Category.MARKET_MECHANICS,
        trigger=lambda s: True,  # Default fallback
        base_score=40,
        partial_score=35,
        description="What it means to own stock",
        beginner_explanation="When you buy a stock, you own a tiny piece of a real company. If the company grows and becomes more valuable, so does your share."
    ),
]


# =============================================================================
# COMBINED CONCEPT LIBRARY
# =============================================================================

ALL_CONCEPTS = PA_CONCEPTS + FU_CONCEPTS + MM_CONCEPTS


def get_concept_by_id(concept_id: str) -> Optional[Concept]:
    """Retrieve a concept by its ID."""
    for concept in ALL_CONCEPTS:
        if concept.id == concept_id:
            return concept
    return None


def get_concepts_by_category(category: Category) -> list[Concept]:
    """Get all concepts in a category."""
    return [c for c in ALL_CONCEPTS if c.category == category]


def evaluate_all_concepts(context: StockContext) -> dict[str, int]:
    """
    Evaluate all concepts against stock context.
    Returns dict of concept_id -> score.
    """
    scores = {}
    for concept in ALL_CONCEPTS:
        try:
            if concept.trigger(context):
                scores[concept.id] = concept.base_score
            else:
                scores[concept.id] = concept.partial_score
        except Exception:
            # If trigger fails, use partial score
            scores[concept.id] = concept.partial_score
    return scores
