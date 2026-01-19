"""
Smart Context Engine

Provides market context for explaining stock movements using:
- S&P 500 correlation (market trend)
- VIX (fear index)
- News headlines

The engine determines WHY a stock is moving based on data, not random guessing.
"""

import yfinance as yf
from typing import Optional, List, Dict
from dataclasses import dataclass


@dataclass
class MarketContext:
    """Market-wide context data."""
    sp500_change: float  # S&P 500 % change
    vix_level: float     # VIX current level
    vix_change: float    # VIX % change
    is_high_fear: bool   # VIX > 20 and rising
    

@dataclass
class StockContext:
    """Full context for a stock's movement."""
    stock_change: float
    market_context: MarketContext
    headlines: List[str]
    
    # Computed reasoning
    reason_type: str  # 'news', 'market', 'fear', 'normal'
    reason_text: str  # Human readable reason


def fetch_market_context() -> MarketContext:
    """
    Fetch current market context from S&P 500 and VIX.
    """
    try:
        # Fetch S&P 500
        sp500 = yf.Ticker("^GSPC")
        sp500_info = sp500.info
        sp500_price = sp500_info.get('regularMarketPrice', 0)
        sp500_prev = sp500_info.get('previousClose', sp500_price)
        sp500_change = ((sp500_price - sp500_prev) / sp500_prev * 100) if sp500_prev else 0
        
        # Fetch VIX
        vix = yf.Ticker("^VIX")
        vix_info = vix.info
        vix_level = vix_info.get('regularMarketPrice', 15)
        vix_prev = vix_info.get('previousClose', vix_level)
        vix_change = ((vix_level - vix_prev) / vix_prev * 100) if vix_prev else 0
        
        # High fear = VIX > 20 and rising
        is_high_fear = vix_level > 20 and vix_change > 0
        
        return MarketContext(
            sp500_change=round(sp500_change, 2),
            vix_level=round(vix_level, 2),
            vix_change=round(vix_change, 2),
            is_high_fear=is_high_fear
        )
    except Exception as e:
        print(f"Error fetching market context: {e}")
        return MarketContext(
            sp500_change=0,
            vix_level=15,
            vix_change=0,
            is_high_fear=False
        )


def determine_movement_reason(
    stock_change: float,
    market_context: MarketContext,
    headlines: List[str]
) -> tuple[str, str]:
    """
    Determine WHY a stock is moving based on hierarchy:
    1. News Match: Stock moved > 1% AND news exists
    2. Market Match: Stock moves with S&P 500 (within 0.5% margin)
    3. Fear Match: Stock down AND VIX > 20
    4. Fallback: Normal volatility
    
    Returns: (reason_type, reason_text)
    
    NOTE: reason_text uses SIMPLE language - no "S&P 500", "VIX", or percentages.
    """
    abs_change = abs(stock_change)
    same_direction = (stock_change >= 0) == (market_context.sp500_change >= 0)
    
    # 1. NEWS MATCH: Significant move + news exists
    if abs_change > 1 and headlines:
        headline = headlines[0][:60]  # Truncate for prompt
        return ("news", f"reacting to recent news about the company")
    
    # 2. MARKET CORRELATION: Moves with broader market
    margin = abs(stock_change - market_context.sp500_change)
    if same_direction and margin < 1.5 and abs(market_context.sp500_change) > 0.3:
        if stock_change >= 0:
            return ("market_correlated", "following the broader market, which is also up today")
        else:
            return ("market_correlated", "following the broader market, which is also down today")
    
    # 3. COMPANY SPECIFIC: Opposite of market
    if not same_direction and abs(market_context.sp500_change) > 0.3:
        if stock_change >= 0:
            return ("company_specific", "moving up even while most stocks are down")
        else:
            return ("company_specific", "moving down even while most stocks are up")
    
    # 4. FEAR MATCH: Stock down + high VIX (simplified - no VIX mention)
    if stock_change < -0.5 and market_context.is_high_fear:
        return ("fear", "experiencing a dip along with general market nervousness")
    
    # 5. FALLBACK: Normal volatility
    if abs_change < 1:
        return ("normal", "experiencing normal day-to-day movement")
    else:
        direction = "gaining some momentum" if stock_change > 0 else "pulling back slightly"
        return ("normal", f"{direction} today")


def build_stock_context(
    stock_change: float,
    headlines: List[str] = None
) -> StockContext:
    """
    Build complete context for a stock's movement.
    """
    headlines = headlines or []
    market_context = fetch_market_context()
    
    reason_type, reason_text = determine_movement_reason(
        stock_change,
        market_context,
        headlines
    )
    
    return StockContext(
        stock_change=stock_change,
        market_context=market_context,
        headlines=headlines,
        reason_type=reason_type,
        reason_text=reason_text
    )
