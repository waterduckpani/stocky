# =============================================================================
# BREAKDOWN PROMPT (Step 1 - Structured 3-sentence narrative)
# =============================================================================

import random

def get_movement_context(change_percent: float) -> str:
    """
    Categorize stock movement with DIRECTION-AWARE phrases.
    Returns a human-readable context phrase that matches the actual direction.
    """
    abs_change = abs(change_percent)
    
    # Small movements (< 1%) - use direction-specific language
    if abs_change < 1:
        if change_percent > 0:
            return random.choice([
                "holding steady with minor gains",
                "up slightly",
                "showing minor gains",
                "consolidating recent gains"
            ])
        else:
            return random.choice([
                "down slightly",
                "a minor pullback",
                "routine profit taking",
                "trading flat with slight pressure"
            ])
    
    # Medium movements (1-3%)
    elif abs_change < 3:
        if change_percent > 0:
            return random.choice([
                "gaining momentum",
                "moving higher",
                "showing strength"
            ])
        else:
            return random.choice([
                "pulling back",
                "under some pressure",
                "seeing a dip"
            ])
    
    # Large movements (3-5%)
    elif abs_change < 5:
        if change_percent > 0:
            return random.choice([
                "surging higher",
                "making notable gains",
                "rallying strongly"
            ])
        else:
            return random.choice([
                "dropping significantly",
                "facing selling pressure",
                "seeing a notable decline"
            ])
    
    # Very large movements (> 5%)
    else:
        if change_percent > 0:
            return random.choice([
                "skyrocketing",
                "making a major move higher",
                "surging dramatically"
            ])
        else:
            return random.choice([
                "plunging",
                "in a major selloff",
                "dropping sharply"
            ])


def generate_breakdown_prompt(stock: dict, topic: str, smart_context: dict = None, currency_symbol: str = "$") -> str:
    """
    Generate a dynamic market analyst breakdown.
    """
    name = stock.get('name', stock.get('symbol', 'This stock'))
    symbol = stock.get('symbol', '')
    price = stock.get('price', 0)
    change_percent = stock.get('change_percent', 0)
    
    return f"""Act as a senior market analyst on a trading floor. Give me a 3-sentence pulse check on {name} ({symbol}).

DATA: Price {currency_symbol}{price:.2f}, Change {change_percent}%.
Target Lesson Topic: {topic}

STYLE RULES:
1. VARIETY: Do NOT start with "{symbol} is trading at...". Start with the movement (e.g., "{name} is taking a breather today..." or "Bulls are charging into {symbol}...").
2. CONTEXT: If the move is small (<1%), call it "consolidation" or "flat". If large (>3%), call it a "rally" or "correction".
3. NO ROBOTIC FILLER: Do not say "This dip is likely due to normal market movement." Say "Traders are pausing to reassess after the recent rally."
4. BRIDGE: The 3rd sentence MUST bridge naturally to the lesson topic: "{topic}".

Write the 3 sentences now:"""


# Legacy prompt for fallback (keeping for compatibility)
BREAKDOWN_PROMPT = """You are a financial friend giving a quick market update to someone new to investing.

Company: {company_name} ({symbol})
Current Price: ${price}
Today's Change: {change_percent}%
52-Week Range: {week_52_range}
Market Cap: {market_cap}

Write a quick, useful breakdown in exactly 3 sentences:
1. State what's happening to the price today.
2. Explain the context (is this normal movement or unusual?).
3. Bridge to what we'll learn next.

Rules:
- Do NOT explain what the company does.
- Do NOT give advice.
- Keep it simple and direct.

Just provide the breakdown, nothing else."""


# =============================================================================
# TRUE BEGINNER INVESTING CONCEPTS
# =============================================================================
CONCEPT_LIST = [
    {
        "id": "investing_vs_saving",
        "name": "Investing vs Saving",
        "condition": "high_growth",  # Stock up significantly
        "relevant_data_template": "This stock has grown significantly",
        "description": "Money in a savings account barely grows - maybe 4% a year. But investments like stocks can grow much more. That's why people invest: to make their money work harder. Of course, stocks can also go down, which is the trade-off."
    },
    {
        "id": "what_moves_prices",
        "name": "What Makes Prices Move",
        "condition": "volatile",  # High daily change
        "relevant_data_template": "Today's price change: {change}%",
        "description": "Stock prices move based on supply and demand. When more people want to buy than sell, price goes up. When more want to sell, it drops. News, earnings, and even tweets can shift this balance instantly."
    },
    {
        "id": "risk_and_reward",
        "name": "Risk and Reward",
        "condition": "high_volatility_asset",  # Crypto or volatile stock
        "relevant_data_template": "This asset can swing wildly",
        "description": "Higher potential gains usually mean higher risk of losses. Stable investments grow slowly but safely. Volatile ones can double or halve quickly. That's the risk-reward tradeoff every investor faces."
    },
    {
        "id": "long_term_thinking",
        "name": "Why Time in Market Beats Timing",
        "condition": "established",  # Large, established company
        "relevant_data_template": "Established company with track record",
        "description": "Trying to buy at the 'perfect' moment rarely works. Most successful investors buy good companies and hold for years. Daily ups and downs matter less when you're thinking 5-10 years ahead."
    },
    {
        "id": "ownership_basics",
        "name": "What You Actually Own",
        "condition": "default",
        "relevant_data_template": "Stock basics",
        "description": "When you buy a stock, you own a tiny slice of the company. If the company grows and becomes more valuable, so does your slice. You're not lending money - you're becoming a part-owner."
    }
]

def select_concept(stock_data: dict) -> dict:
    """Select the most relevant concept based on stock behavior."""
    change_pct = abs(stock_data.get("change_percent", 0))
    total_return = stock_data.get("ytd_return", 0)  # Year-to-date return
    is_crypto = stock_data.get("is_crypto", False)
    market_cap = stock_data.get("market_cap_raw", 0)
    
    # Priority: teach the most relevant lesson for this situation
    if change_pct > 3 or is_crypto:
        # High volatility - teach risk/reward
        return next(c for c in CONCEPT_LIST if c["id"] == "risk_and_reward")
    elif total_return > 20:
        # Stock has grown a lot - explain investing vs saving
        return next(c for c in CONCEPT_LIST if c["id"] == "investing_vs_saving")
    elif change_pct > 1.5:
        # Notable daily movement - explain what moves prices
        return next(c for c in CONCEPT_LIST if c["id"] == "what_moves_prices")
    elif market_cap > 100_000_000_000:  # 100B+
        # Established company - teach long-term thinking
        return next(c for c in CONCEPT_LIST if c["id"] == "long_term_thinking")
    else:
        return next(c for c in CONCEPT_LIST if c["id"] == "ownership_basics")


# =============================================================================
# KEY CONCEPT PROMPT (Step 2 - Teach an investing fundamental)
# =============================================================================
CONCEPT_PROMPT = """You're teaching someone their FIRST investing lesson using a real example.

Concept to teach: {concept_name}
Using this example: {company_name} ({symbol})
Context: {relevant_data}

Explain this concept:
1. What is "{concept_name}" in one simple sentence?
2. Use {company_name} as a real-world example to make it click

Rules:
- This is about INVESTING, not about the company's products
- Make them understand WHY this matters for their money
- Use a relatable comparison if helpful
- Keep it under 50 words
- No jargon - explain like they've never invested before"""


# =============================================================================
# QUIZ PROMPT (Step 5 - Test THE SPECIFIC CONCEPT taught, not generic investing)
# =============================================================================
QUIZ_PROMPT = """Create 3 quiz questions based EXACTLY on the text below.

REFERENCE LESSON:
"{lesson_text}"

CONTEXT:
- Stock: {company_name} ({symbol})
- Concept: {concept_name}

CRITICAL RULES:
1. SOURCE OF TRUTH: You MUST ONLY ask questions whose answers are explicitly found in the "REFERENCE LESSON" text above.
2. NO OUTSIDE KNOWLEDGE: If the text doesn't mention it, do not ask about it.
3. VERIFICATION: Double-check that `options[correctIndex]` is the undeniably correct answer based on the text.

CRITICAL LOGIC STEP:
1. First, write the CORRECT answer based verbatim on the text.
2. Then, write 3 plausible but WRONG distractors.
3. Shuffle them into the options list.
4. Triple-Check: Does options[correctIndex] match the Correct Answer?

CONSTRAINT: The Correct Answer MUST be a paraphrase of the text. Do not invent "facts" like "promises low prices forever".

JSON FORMAT:
[
  {{
    "question": "According to the lesson, why...",
    "options": ["Wrong A", "Correct Answer", "Wrong B", "Wrong C"],
    "correctIndex": 1
  }},
  {{
    "question": "Another question from the text?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctIndex": 2
  }},
  {{
    "question": "Final question from the text?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctIndex": 0
  }}
]"""


# =============================================================================
# FALLBACK CONTENT
# =============================================================================
FALLBACK_BREAKDOWN = "The stock is currently trading and moving with the broader market. As a new investor, focus less on daily swings and more on understanding why you're interested in this investment in the first place."

FALLBACK_CONCEPT = """When you invest in a stock, you're buying ownership in a real company. 
Unlike a savings account where you earn small fixed interest, stocks can grow (or shrink) based on how the company performs. 
That's both the opportunity and the risk of investing."""

FALLBACK_QUIZ = [
    {
        "question": "Why do people invest in stocks instead of just saving in a bank?",
        "options": ["Potential for higher returns over time", "Banks don't accept large deposits", "Stocks are guaranteed to go up", "It's required by law"],
        "correctIndex": 0
    },
    {
        "question": "What happens when more people want to buy a stock than sell it?",
        "options": ["The price stays the same", "The price goes down", "The price goes up", "Trading stops"],
        "correctIndex": 2
    },
    {
        "question": "What's the trade-off with risky investments?",
        "options": ["No trade-off, they're always better", "Higher potential gains but also higher potential losses", "They're only for professionals", "They cost more to buy"],
        "correctIndex": 1
    }
]
