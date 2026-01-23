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


def get_currency_config(symbol: str) -> dict:
    """
    Determines currency config based on ticker suffix.
    """
    # Default (US)
    if "." not in symbol:
        return { "code": "USD", "symbol": "$", "decimals": 2 }

    suffix = "." + symbol.split(".")[-1].upper()
    
    # The Currency Map
    currency_map = {
        ".NS": { "code": "INR", "symbol": "₹", "decimals": 2 },  # India
        ".BO": { "code": "INR", "symbol": "₹", "decimals": 2 },
        ".KS": { "code": "KRW", "symbol": "₩", "decimals": 0 },  # Korea (No decimals!)
        ".T":  { "code": "JPY", "symbol": "¥", "decimals": 0 },  # Japan (No decimals!)
        ".HK": { "code": "HKD", "symbol": "HK$", "decimals": 2 },
        ".L":  { "code": "GBP", "symbol": "£", "decimals": 2 },  # UK
        ".DE": { "code": "EUR", "symbol": "€", "decimals": 2 },  # Europe
        ".TO": { "code": "CAD", "symbol": "C$", "decimals": 2 }, # Canada
    }
    
    return currency_map.get(suffix, { "code": "USD", "symbol": "$", "decimals": 2 })


def get_exchange_context(symbol: str, name: str) -> dict:
    """
    Determines the "home turf" exchange and appropriate game mode.
    Returns:
        {
            "exchange": "London Stock Exchange",
            "pivot_text": "...",
            "game_mode": "US_Standard" | "India_Dual"
        }
    """
    # 1. Check Suffix for International Stocks
    if "." in symbol:
        suffix = "." + symbol.split(".")[-1].upper()
        
        # The Global Atlas
        exchange_map = {
            ".HK": "Hong Kong Stock Exchange",
            ".TO": "Toronto Stock Exchange",
            ".L":  "London Stock Exchange",
            ".DE": "Deutsche Börse (Germany)",
            ".PA": "Euronext Paris",
            ".T":  "Tokyo Stock Exchange",
            ".SS": "Shanghai Stock Exchange",
            ".KS": "Korean Stock Exchange",
            ".NS": "National Stock Exchange of India",
            ".BO": "Bombay Stock Exchange"
        }
        
        home_exchange = exchange_map.get(suffix, "International Exchange")
        
        # Special Case: India (Has its own full mode)
        if suffix in [".NS", ".BO"]:
            return {
                "exchange": home_exchange,
                "pivot_text": f"You are looking at **{name}**. It lives on the **{home_exchange}**.",
                "game_mode": "India_Dual"
            }

        # THE PIVOT: Acknowledge Local -> Pivot to Global
        return {
            "exchange": home_exchange,
            "pivot_text": (
                f"You are looking at **{name}** on its home turf: the **{home_exchange}**.\n\n"
                "To understand how *all* exchanges work, let's look at the world's two most famous examples."
            ),
            "game_mode": "US_Standard" 
        }

    # 2. US Logic (Standard)
    target_exchange = "Nasdaq" if len(symbol) >= 4 else "NYSE"
    target_category = "modern Tech Innovator" if len(symbol) >= 4 else "historic 'Blue Chip' Giant"
    
    return {
        "exchange": target_exchange,
        "pivot_text": f"You are looking at **{name}**, which lives on the **{target_exchange}**. Why? Because it is a **{target_category}**.",
        "game_mode": "US_Standard"
    }


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


def select_best_concept(context: StockContext, user_history: list[str]) -> any:
    """
    Select the most relevant investing concept based on stock context.
    Returns Concept object OR static lesson dictionary.
    """
    # === PRESET ACADEMY FLOW ===
    # Forcing Lesson 1 (The Ticker Symbol) for all users during demo
    # if len(user_history) == 0:
    if True:
        from static_curriculum import TIER_1_LESSONS
        import copy
        
        # FOR TESTING: Force Lesson 5 (Market Cap)
        # FOR TESTING: Force Lesson 6 (IPO)
        lesson_ref = next((l for l in TIER_1_LESSONS if l["id"] == "lesson_6_ipo"), TIER_1_LESSONS[0])
        lesson = copy.deepcopy(lesson_ref) # CRITICAL: Copy to avoid shared state pollution
        print(f"DEBUG: Selected Lesson {lesson['id']}")
        
        # return lesson, {"type": "static", "reason": "Forced Lesson 6"} # REMOVED EARLY RETURN
        
        # Inject Context (Chameleon Mode)
        if lesson["id"] == "lesson_2_exchange":
            # === LESSON 2: THE EXCHANGE (CAROUSEL LOGIC) ===
            # === LESSON 2: THE EXCHANGE (GLOBAL PIVOT LOGIC) ===
            exchange_ctx = get_exchange_context(context.symbol, context.name)
            
            # Inject Pivot Text into Slide 1
            lesson["concept"]["slides"][0]["text"] = exchange_ctx["pivot_text"]

            # Handle India Special Case (NSE/BSE Split)
            if exchange_ctx.get("game_mode") == "India_Dual":
                   # Update Slide 1 (The Analogy) for India Context
                   lesson["concept"]["slides"][1]["text"] = "Think of an Exchange as a specialized supermarket where shares of companies are bought and sold. In India, there are two main 'stores'."

                   # Update Slide 2 (The Rivals) for India Context
                   lesson["concept"]["slides"][2] = {
                       "title": "The Dual Giants",
                       "icon": "Scale",
                       "text": "India's market is split between two giants:\n\n• **NSE:** Modern & Digital (Like Nasdaq).\n• **BSE:** Historic & Vast (Like NYSE)."
                   }

                   # Remove Blue Chip slide (Slide 3) as it only applies to US
                   lesson["concept"]["slides"] = [s for s in lesson["concept"]["slides"] if s["title"] != "Jargon: Blue Chips"]
                   
                   # Overwrite Game Config for India
                   lesson["game_config"]["instruction"] = f"Sort {context.name} into the correct bin (NSE) to start."
                   lesson["game_config"]["market_sort_config"] = {
                       "bins": [
                           {"id": "BSE", "label": "BSE", "description": "Asia's Oldest\nHistoric Giants", "color": "amber"},
                           {"id": "NSE", "label": "NSE", "description": "Market Leader\nVolume & Tech", "color": "cyan"}
                       ],
                       "companies": [
                           {"id": 1, "name": "Infosys", "ticker": "INFY", "type": "NSE", "icon": "cpu"},
                           {"id": 2, "name": "Tata Steel", "ticker": "TATASTEEL", "type": "BSE", "icon": "factory"},
                           {"id": 3, "name": "Zomato", "ticker": "ZOMATO", "type": "NSE", "icon": "smartphone"},
                           {"id": 4, "name": "ITC", "ticker": "ITC", "type": "BSE", "icon": "cup-soda"},
                           {"id": 5, "name": "Reliance", "ticker": "RELIANCE", "type": "NSE", "icon": "factory"},
                           {"id": 6, "name": "SBI", "ticker": "SBIN", "type": "BSE", "icon": "landmark"},
                           {"id": 7, "name": "Paytm", "ticker": "PAYTM", "type": "NSE", "icon": "smartphone"},
                           {"id": 8, "name": "HDFC Bank", "ticker": "HDFCBANK", "type": "NSE", "icon": "landmark"},
                       ]
                   }
                   
                   # Overwrite Quiz for India Context
                   lesson["quiz"] = [
                       {
                           "question": "What is the NSE (National Stock Exchange) known for?",
                           "options": [
                               "Traditional physical floor trading",
                               "Modern digital trading (like Nasdaq)",
                               "Only selling gold bonds",
                               "Being located in New Delhi"
                           ],
                           "correctIndex": 1
                       },
                       {
                           "question": "Which statement describes the BSE (Bombay Stock Exchange)?",
                           "options": [
                               "It is Asia's oldest stock exchange",
                               "It was founded in 2020",
                               "It only lists tech startups",
                               "It is located in the Himalayas"
                           ],
                           "correctIndex": 0
                       },
                       {
                           "question": "Where are both the NSE and BSE headquartered?",
                           "options": [
                               "New Delhi",
                               "Bangalore (Bengaluru)",
                               "Mumbai",
                               "Kolkata"
                           ],
                           "correctIndex": 2
                       }
                   ]
            
            # Additional Quiz Question Logic (Dynamic)
            dynamic_question = {}
            if exchange_ctx.get("game_mode") == "India_Dual":
                 dynamic_question = {
                    "question": f"Which exchange is known as the modern market leader in India?",
                    "options": ["The NSE (National Stock Exchange)", "The BSE (Bombay Stock Exchange)", "The New Delhi Market", "The spices market"],
                    "correctIndex": 0
                }
            elif exchange_ctx.get("exchange") == "Nasdaq":
                 dynamic_question = {
                    "question": f"Based on what you learned, which exchange does {context.name} list on?",
                    "options": ["The NYSE", "The Nasdaq", "The London Stock Exchange", "A local farmers market"],
                    "correctIndex": 1
                }
            elif exchange_ctx.get("exchange") == "NYSE":
                 dynamic_question = {
                    "question": f"Based on what you learned, which exchange does {context.name} list on?",
                    "options": ["The NYSE", "The Nasdaq", "The Tokyo Stock Exchange", "An online crypto forum"],
                    "correctIndex": 0
                }
            else:
                 # Generic International Question
                 home = exchange_ctx.get("exchange", "International Exchange")
                 dynamic_question = {
                    "question": f"Based on what you learned, which exchange does {context.name} list on?",
                    "options": ["The Nasdaq", "The NYSE", home, "The Moon"],
                    "correctIndex": 2
                }

            if dynamic_question:
                lesson["quiz"].append(dynamic_question)

        # Inject Context (Chameleon Mode) - Lesson 1 Specific
        if lesson["id"] == "lesson_1_ticker":
            symbol = context.symbol
            
            # Safe Carousel Access
            concept = lesson.get("concept", {})
            if concept.get("type") == "carousel" and "slides" in concept:
                slides = concept["slides"]
                
                # Slide 1: Context (Text Injection)
                if len(slides) > 0:
                    try:
                        slides[0]["text"] = slides[0]["text"].format(
                            company_name=context.name,
                            symbol=symbol
                        )
                    except Exception as e:
                        print(f"Error injecting Slide 1 context: {e}")

                # Slide 3: Mechanics (Dynamic Logic)
                if len(slides) > 2:
                    if "." in symbol:
                        # Scenario B: International Stock (Suffix)
                        suffix = "." + symbol.split(".")[-1].upper()
                        
                        # Simple Manual Map for Demo
                        suffix_map = {
                            ".NS": "National Stock Exchange of India",
                            ".BO": "Bombay Stock Exchange",
                            ".L": "London Stock Exchange",
                            ".TO": "Toronto Stock Exchange",
                            ".KS": "Korea",
                            ".DE": "Germany",
                            ".T": "Japan"
                        }
                        location = suffix_map.get(suffix, "International Markets")
                        
                        mechanics_text = f"The ending **{suffix}** acts like a country code (like '.kr' or '.in'), telling you this stock lives in **{location}**."
                    else:
                        # Scenario A: Standard US Stock (No Suffix)
                        mechanics_text = f"Since **{symbol}** has no 'ending' (like .com), it trades on the standard **US Market**."

                    slides[2]["text"] = mechanics_text
            
            # Update Game Config Target
            if "game_config" in lesson and "target" in lesson["game_config"]:
                try:
                    lesson["game_config"]["target"] = lesson["game_config"]["target"].format(
                        symbol=context.symbol
                    )
                    lesson["game_config"]["instruction"] = lesson["game_config"]["instruction"].format(
                        company_name=context.name
                    )
                except Exception as e:
                    print(f"Error injecting game config: {e}")

            # Construct fallback explanation from slides for AI consistency
            explanation = " ".join([s.get("text", "") for s in slides])
            lesson["concept"]["explanation"] = explanation
            
            # Note: Game Config updated safely above (lines 310-319)
            # Generate fake tickers
            sanitized_name = context.name.replace(" ", "").upper()
            fake_1 = sanitized_name[:3] if len(sanitized_name) >= 3 else "ABC"
            fake_2 = context.symbol + "X"
            fake_3 = sanitized_name[:4] + "CO" if len(sanitized_name) >= 4 else "CORP"
            
            # Inject into Quiz
            for question in lesson["quiz"]:
                if "{company_name}" in question["question"]:
                    question["question"] = question["question"].format(company_name=context.name)
                    question["options"] = [
                        opt.format(
                            symbol=context.symbol,
                            fake_1=fake_1,
                            fake_2=fake_2,
                            fake_3=fake_3
                        ) for opt in question["options"]
                    ]

        # === LESSON 5: MARKET CAP (Dynamic Content) ===
        elif lesson["id"] == "lesson_5_market_cap":
            from utils import format_large_number # Helper import
            
            market_cap = context.market_cap or 0
            
            # 1. Determine Category
            category = "Small Cap"
            category_icon = "Zap" # Speedboat
            if market_cap >= 200_000_000_000: # 200B
                category = "Mega Cap"
                category_icon = "Ship" # Ocean Liner
            elif market_cap >= 10_000_000_000: # 10B
                category = "Large Cap"
                category_icon = "Ship"
            elif market_cap >= 2_000_000_000: # 2B
                category = "Mid Cap"
                category_icon = "Zap" # Speedboat (ish)
            
            # 2. Dynamic Slide 2 (The Analogy)
            slides = lesson["concept"]["slides"]
            if len(slides) > 1:
                if category in ["Mega Cap", "Large Cap"]:
                    slides[1]["text"] = f"You searched for **{context.symbol}**, an **Ocean Liner**. It anchors the market with its massive size."
                    slides[1]["icon"] = "Anchor"
                else: 
                    slides[1]["text"] = f"You searched for **{context.symbol}**, a **Speedboat**. It is fast and nimble but easily rocked by waves."
                    slides[1]["icon"] = "Zap"

            # 3. Dynamic Game Config
            # Pass real data so Frontend can calculate physics
            lesson["game_config"]["market_cap"] = market_cap
            lesson["game_config"]["category"] = category 
            lesson["game_config"]["symbol"] = context.symbol
            
            # 4. Dynamic Quiz Question (Challenge Injection)
            formatted_cap = format_large_number(market_cap)
            
            # Correct answer logic: 
            # If Mega/Large Cap (Harder to move) -> "Harder" (Index 0)
            # If Small/Mid Cap (Easier to move) -> "Easier" (Index 1) - actually let's standardise the options
            
            is_huge = category in ["Mega Cap", "Large Cap"]
            correct_idx = 0 if is_huge else 1
            
            challenge_question = {
                "id": "q_dynamic_cap",
                "question": f"Given {context.symbol} has a Market Cap of {formatted_cap}, is it harder or easier to double its price compared to a Small Cap?",
                "options": [
                    "Harder (Needs way more money)", 
                    "Easier (Needs less money)",
                    "Exactly the same",
                    "Impossible to say"
                ],
                "correctIndex": correct_idx,
                "explanation": "The bigger the cap, the more money is required to move the price. It's physics!"
            }
            
            # Replace the generic Q3 or append
            # Currently static_curriculum has 3 qs. Let's replace the last one (Apple one) if it exists, or just append.
            # Actually, user asked to INJECT it. Let's make it the 3rd question.
            if len(lesson["quiz"]) >= 3:
                lesson["quiz"][2] = challenge_question
            else:
                lesson["quiz"].append(challenge_question)

        # === LESSON 13: P/E RATIO (Dynamic Content) ===
        elif lesson["id"] == "lesson_13_pe_ratio":
            pe_ratio = context.pe_ratio
            if pe_ratio is None:
                pe_ratio = 20.0 # Default fallback
            
            # Determine Currency
            curr_config = get_currency_config(context.symbol)
            curr = curr_config["symbol"]

            # 1. Determine Category (Value vs Growth)
            valuation_type = "Average"
            machine_cost = 20
            
            if pe_ratio > 30:
                valuation_type = "Growth (Expensive)"
                machine_cost = int(pe_ratio)
                desc = f"Investors are paying **{curr}{int(pe_ratio)}** for every {curr}1 of earnings because they expect massive growth."
                icon_override = "Rocket"
            elif pe_ratio < 15 and pe_ratio > 0:
                valuation_type = "Value (Cheap)"
                machine_cost = int(pe_ratio)
                desc = f"Investors are only paying **{curr}{int(pe_ratio)}** for every {curr}1 of earnings. It's a bargain (or a trap?)"
                icon_override = "Tag"
            else:
                valuation_type = "Fair Value"
                machine_cost = int(pe_ratio) if pe_ratio > 0 else 20
                desc = f"Investors are paying a standard **{curr}{int(pe_ratio)}** for every {curr}1 of earnings."
                icon_override = "Scale"
            
            # 2. Inject Context into Slide 1
            slides = lesson["concept"]["slides"]
            if len(slides) > 0:
                 slides[0]["text"] = f"**{context.symbol}** has a P/E Ratio of **{pe_ratio:.1f}**.\n\nThis means you are paying **{curr}{pe_ratio:.2f}** for every {curr}1 of profit the company makes."

            # 3. Inject Context into Slide 2 (The Analogy)
            if len(slides) > 1:
                slides[1]["text"] = f"Think of **{context.symbol}** as a Money Machine.\n\nIt prints {curr}1/year. The market price for this machine is **{curr}{pe_ratio:.0f}**.\n\n{desc}"
                slides[1]["icon"] = icon_override
            
            # 4. Update Game Config
            lesson["game_config"]["pe_ratio"] = pe_ratio
            lesson["game_config"]["valuation_type"] = valuation_type
            lesson["game_config"]["symbol"] = context.symbol
            
            # 5. Dynamic Quiz
            dynamic_q = {
                 "id": "q_dynamic_pe",
                 "question": f"Based on its P/E of {pe_ratio:.1f}, how would you classify {context.symbol}?",
                 "options": [
                     "High Growth / Expensive Premium",
                     "Deep Value / Check for Traps", 
                     "Fairly Valued", 
                     "It has no earnings"
                 ],
                 "correctIndex": 0 if pe_ratio > 30 else (1 if pe_ratio < 15 else 2),
                 "explanation": f"A P/E of {pe_ratio:.1f} is considered {valuation_type.split(' ')[0]}."
            }
             # Append or replace
            if len(lesson["quiz"]) >= 3:
                lesson["quiz"][2] = dynamic_q
            else:
                 lesson["quiz"].append(dynamic_q)
            
        return lesson, {"type": "static", "reason": "Beginner preset"}
    
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
