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
                "To understand how markets work, let's look at the world's two most famous examples."
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
        from static_curriculum import TIER_1_LESSONS, TIER_2_LESSONS
        import copy
        
        # TESTING OVERRIDE
        # lesson_ref = next((l for l in TIER_1_LESSONS if l['id'] == 'lesson_11_revenue_profit'), None)
        # lesson_ref = next((l for l in TIER_2_LESSONS if l['id'] == 'lesson_15_beta'), None)
        # lesson_ref = next((l for l in TIER_1_LESSONS if l['id'] == 'lesson_11_revenue_profit'), None)
        # lesson_ref = next((l for l in TIER_2_LESSONS if l['id'] == 'lesson_15_beta'), None)
        # lesson_ref = next((l for l in TIER_2_LESSONS if l['id'] == 'lesson_16_earnings_reports'), None)
        # lesson_ref = next((l for l in TIER_2_LESSONS if l['id'] == 'lesson_17_52_week_range'), None)
        # lesson_ref = next((l for l in TIER_2_LESSONS if l['id'] == 'lesson_16_earnings_reports'), None)
        lesson_ref = next((l for l in TIER_1_LESSONS if l['id'] == 'lesson_9_volatility'), None)
        
        if not lesson_ref and True: # FORCE HARDCODED FALLBACK
             print("DEBUG: Force-injecting Lesson 16 (Lookup Failed)")
             lesson_ref = {
                "id": "lesson_16_earnings_reports",
                "title": "Earnings Reports",
                "concept": {
                    "name": "The Quarterly Scorecard",
                    "category": "valuation_health",
                    "type": "carousel",
                    "slides": [
                        {
                            "title": "What is an Earnings Report? 📋",
                            "text": "Every 3 months, public companies like **{company_name}** are required by law to file a **10-Q report**. This isn't just news—it is a verified document showing exactly how much money they made and where it went.",
                            "icon": "FileText"
                        },
                        {
                            "title": "The Three Pillars 🏛️",
                            "text": "Investors focus on three key numbers compared to last year: **Revenue** (Total Sales), **Net Income** (Bottom Line Profit), and **EPS** (Profit per Share). If a company grows all three, it’s usually a 'winner.'",
                            "icon": "Columns"
                        },
                        {
                            "title": "Estimates vs. Actuals ⚖️",
                            "text": "The market doesn't just care about the numbers; it cares about the **Expectations Gap**. Before the report, analysts release 'Consensus Estimates.' If {symbol} reports $1B but everyone expected $1.2B, it’s a **Miss**—and the price will likely fall.",
                            "icon": "Scale"
                        },
                        {
                            "title": "Guidance: The Forward Look 🔮",
                            "text": "The past is history. Investors care most about **Guidance**—the CEO's official prediction for the next quarter. A 'Beat' on current earnings paired with 'Lowered Guidance' is a common reason for a stock crash.",
                            "icon": "Zap"
                        }
                    ]
                },
                "breakdown": "Earnings season is volatile.",
                "news": [],
                "game_config": {
                    "type": "earnings_reaction",
                    "instruction": "Read the News Flash. TAP FAST: Buy (Green) for Good News, Sell (Red) for Bad News!"
                },
                "quiz": [
                     {
                        "question": "What is an Earnings Report?",
                        "options": ["Daily Email", "Quarterly Report Card", "Secret Doc", "Birthday List"],
                        "correctIndex": 1
                    },
                    {
                        "question": "If {company_name} beats profit but drops, why?",
                        "options": ["Missed Expectations", "Fake Profit", "Illegal", "Glitch"],
                        "correctIndex": 0
                    },
                    {
                        "question": "What is Guidance?",
                        "options": ["Prediction for Next Quarter", "Office Map", "Fashion Advice", "History"],
                        "correctIndex": 0
                    }
                ]
            }

        if lesson_ref:
            lesson = copy.deepcopy(lesson_ref) # CRITICAL: Copy to avoid shared state pollution
            print(f"DEBUG: Selected Lesson {lesson['id']}")
        else:
            # Fallback to a default lesson if the override lesson is not found
            lesson = copy.deepcopy(TIER_1_LESSONS[0])
            print(f"DEBUG: Override lesson not found, falling back to {lesson['id']}")
            print(f"DEBUG: Available TIER_2_IDs: {[l['id'] for l in TIER_2_LESSONS]}")
        
        # return lesson, {"type": "static", "reason": "Forced Lesson 6"} # REMOVED EARLY RETURN
        
        lesson["debug_trace"] = f"CRITICAL_DEBUG: ID={lesson.get('id', 'MISSING')}"
        print(f"CRITICAL: {lesson.get('id')}")
        
        
        
        # === FORCE INJECTION (Lesson 14 Hotfix) ===
        if lesson["id"] == "lesson_14_dividend_yield":
            print(f"DEBUG: FORCING Lesson 14 Injection for {context.symbol} | Context Name: {context.name}")
            try:
                # 1. Safely extract Yield Data
                # context.dividend_yield handles None (e.g., non-dividend payers)
                yield_raw = context.dividend_yield if context.dividend_yield is not None else 0.0
                yield_percent = yield_raw * 100
                
                # context.dividend_rate handles None
                div_rate = context.dividend_rate if context.dividend_rate is not None else 2.0
                
                # 2. Reconstruct Slide 0 (Context) explicitly
                # This guarantees the dynamic values are used, bypassing any placeholder issues
                if "concept" in lesson and "slides" in lesson["concept"]:
                    slides = lesson["concept"]["slides"]
                    if slides:
                        # Construct f-string directly
                        new_text = (
                            f"You searched for **{context.name}**. Its **Dividend Yield** is **{yield_percent:.2f}%**.\n\n"
                            f"This number tells you exactly how much 'Cashback' you earn every year relative to the price of **{context.symbol}**."
                        )
                        print(f"DEBUG: Setting Slide 0 text to: {new_text}")
                        slides[0]["text"] = new_text
                        
                        # Add debug tracer
                        lesson["debug_trace"] = f"Reconstructed: {yield_percent:.2f}%"

                # 3. Update Game Config (Yield Magnet)
                if "game_config" in lesson:
                    print(f"DEBUG: Setting Game Rate to {div_rate}")
                    lesson["game_config"]["base_dividend"] = div_rate

                # 4. Update Quiz Question explicitly
                if "quiz" in lesson and lesson["quiz"]:
                    print(f"DEBUG: Updating Quiz Question")
                    q0_template = "If {company_name} pays a dividend and the stock price drops, what happens to the Yield %?"
                    lesson["quiz"][0]["question"] = q0_template.replace("{company_name}", str(context.name))

            except Exception as e:
                print(f"DEBUG: CRITICAL ERROR IN LESSON 14 INJECTION: {e}")
                import traceback
                traceback.print_exc()
                lesson["debug_trace"] = f"Exception: {e}"

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
                       "text": "India's market has two main exchanges:\n\n• **NSE:** Modern & Digital (Like Nasdaq).\n• **BSE:** Historic & Vast (Like NYSE)."
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
                           "correctIndex": 1,
                           "explanation": "The NSE is India's modern digital exchange — high volume, tech-forward, and similar in spirit to the Nasdaq."
                       },
                       {
                           "question": "Which statement describes the BSE (Bombay Stock Exchange)?",
                           "options": [
                               "It is Asia's oldest stock exchange",
                               "It was founded in 2020",
                               "It only lists tech startups",
                               "It is located in the Himalayas"
                           ],
                           "correctIndex": 0,
                           "explanation": "The BSE was founded in 1875, making it Asia's oldest stock exchange — the historic heavyweight of Indian markets."
                       },
                       {
                           "question": "Where are both the NSE and BSE headquartered?",
                           "options": [
                               "New Delhi",
                               "Bangalore (Bengaluru)",
                               "Mumbai",
                               "Kolkata"
                           ],
                           "correctIndex": 2,
                           "explanation": "Both the NSE and BSE are headquartered in Mumbai — India's financial capital, not its political capital Delhi."
                       }
                   ]
            
            # Additional Quiz Question Logic (Dynamic)
            dynamic_question = {}
            if exchange_ctx.get("game_mode") == "India_Dual":
                 dynamic_question = {
                    "question": f"Which exchange is known as the modern market leader in India?",
                    "options": ["The NSE (National Stock Exchange)", "The BSE (Bombay Stock Exchange)", "The New Delhi Market", "The spices market"],
                    "correctIndex": 0,
                    "explanation": "The NSE leads India in trading volume — it's the modern digital powerhouse, while the BSE is the older historic giant."
                }
            elif exchange_ctx.get("exchange") == "Nasdaq":
                 dynamic_question = {
                    "question": f"Based on what you learned, which exchange does {context.name} list on?",
                    "options": ["The NYSE", "The Nasdaq", "The London Stock Exchange", "A local farmers market"],
                    "correctIndex": 1,
                    "explanation": f"{context.name} lists on the Nasdaq — home to modern tech and digital-first companies."
                }
            elif exchange_ctx.get("exchange") == "NYSE":
                 dynamic_question = {
                    "question": f"Based on what you learned, which exchange does {context.name} list on?",
                    "options": ["The NYSE", "The Nasdaq", "The Tokyo Stock Exchange", "An online crypto forum"],
                    "correctIndex": 0,
                    "explanation": f"{context.name} lists on the NYSE — the home of historic blue-chip companies on Wall Street."
                }
            else:
                 # Generic International Question
                 home = exchange_ctx.get("exchange", "International Exchange")
                 dynamic_question = {
                    "question": f"Based on what you learned, which exchange does {context.name} list on?",
                    "options": ["The Nasdaq", "The NYSE", home, "The Moon"],
                    "correctIndex": 2,
                    "explanation": f"{context.name} lists on the {home}, its home exchange outside the US."
                }

            # Format {company_name} placeholders in the base quiz
            for question in lesson["quiz"]:
                q_text = question["question"]
                if "{company_name}" in q_text or "{symbol}" in q_text:
                    question["question"] = q_text.format(
                        company_name=context.name,
                        symbol=context.symbol
                    )

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
                q_text = question["question"]
                if "{company_name}" in q_text or "{symbol}" in q_text:
                    question["question"] = q_text.format(
                        company_name=context.name,
                        symbol=context.symbol
                    )
                    question["options"] = [
                        opt.format(
                            company_name=context.name,
                            symbol=context.symbol,
                            fake_1=fake_1,
                            fake_2=fake_2,
                            fake_3=fake_3
                        ) for opt in question["options"]
                    ]
                    if "explanation" in question:
                        question["explanation"] = question["explanation"].format(
                            company_name=context.name,
                            symbol=context.symbol
                        )

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
                    slides[1]["text"] = f"Think of **{context.name}** as an Ocean Liner -that's what a **{category}** looks like.\n\nMassive, stable, hard to sink. A small startup? A speedboat: fast and nimble, but one big wave could flip it."
                    slides[1]["icon"] = "Gem"
                else:
                    slides[1]["text"] = f"**{context.name}** is a speedboat -that's what a **{category}** looks like.\n\nFast and nimble, capable of huge moves. But it can get rocked by waves that an Ocean Liner wouldn't even notice."
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

        # === LESSON 6: IPO (Dynamic Content) ===
        elif lesson["id"] == "lesson_6_ipo":
            try:
                slides = lesson["concept"]["slides"]
                for slide in slides:
                    text = slide.get("text", "")
                    if "{company_name}" in text:
                        slide["text"] = text.replace("{company_name}", context.name)
                if "quiz" in lesson:
                    for q in lesson["quiz"]:
                        if "{company_name}" in q.get("question", ""):
                            q["question"] = q["question"].replace("{company_name}", context.name)
            except Exception as e:
                print(f"Error injecting Lesson 6 context: {e}")

        # === LESSON 7: SECTORS (Dynamic Content) ===
        elif lesson["id"] == "lesson_7_sectors":
            try:
                # Inject company_name + sector into Slide 0
                slides = lesson["concept"]["slides"]
                if len(slides) > 0:
                    slides[0]["text"] = slides[0]["text"].format(
                        company_name=context.name,
                        sector=context.sector
                    )
                # Inject company_name into quiz questions
                if "quiz" in lesson:
                    for q in lesson["quiz"]:
                        if "{company_name}" in q.get("question", ""):
                            q["question"] = q["question"].replace("{company_name}", context.name)
            except Exception as e:
                print(f"Error injecting Lesson 7 context: {e}")

        # === LESSON 8: VOLUME (Dynamic Content) ===
        elif lesson["id"] == "lesson_8_volume":
            try:
                # Inject company_name into Slide 0
                slides = lesson["concept"]["slides"]
                if len(slides) > 0:
                    slides[0]["text"] = slides[0]["text"].format(
                        company_name=context.name
                    )
                # Inject company_name into quiz questions
                if "quiz" in lesson:
                    for q in lesson["quiz"]:
                        if "{company_name}" in q.get("question", ""):
                            q["question"] = q["question"].replace("{company_name}", context.name)
            except Exception as e:
                print(f"Error injecting Lesson 8 context: {e}")
            
            # Inject Context into Game Scenarios
            if "game_config" in lesson and "scenarios" in lesson["game_config"]:
                for scenario in lesson["game_config"]["scenarios"]:
                    try:
                        scenario["headline"] = scenario["headline"].format(
                            company_name=context.name
                        )
                    except Exception as e:
                        print(f"Error injecting Lesson 8 game context: {e}")

        # === LESSON 9: VOLATILITY (Dynamic Content) ===
        elif lesson["id"] == "lesson_9_volatility":
            # Inject Context into Slide 0
            slides = lesson["concept"]["slides"]
            if len(slides) > 0:
                try:
                    slides[0]["text"] = slides[0]["text"].format(
                        company_name=context.name
                    )
                except Exception as e:
                    print(f"Error injecting Lesson 9 context: {e}")

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
            
            


        # === LESSON 10: DIVIDENDS (Dynamic Content) ===
        elif lesson["id"] == "lesson_10_dividends":
            # 1. Get Data
            try:
                # Assuming context has dividend_yield (as a percentage, e.g. 5.2 for 5.2%)
                # If not present, default to 0
                yield_percent = context.dividend_yield if context.dividend_yield is not None else 0.0
            except:
                yield_percent = 0.0

            pays_dividend = yield_percent > 0
            
            # Determine Currency
            curr_config = get_currency_config(context.symbol)
            curr = curr_config["symbol"]

            # 2. Inject Context into Slide 0
            slides = lesson["concept"]["slides"]
            if len(slides) > 0:
                try:
                    if pays_dividend:
                         slides[0]["text"] = f"You searched for **{context.name}**. Good news! It pays a **Dividend**, meaning it sends cash directly to your account just for owning the stock."
                    else:
                         slides[0]["text"] = f"You searched for **{context.name}**. Currently, it **does not** pay a dividend. Instead, it reinvests all its profit to grow bigger and faster."
                except Exception as e:
                    print(f"Error injecting Lesson 10 context: {e}")

            # 3. Inject Context into Slide 2 (The Yield)
            if len(slides) > 2:
                 if pays_dividend:
                     slides[2]["text"] = f"**{context.symbol}** has a Dividend Yield of **{yield_percent:.2f}%**.\n\nThis means if you invest {curr}100, you get back roughly **{curr}{yield_percent:.2f}** in cash every year."
                 else:
                     slides[2]["text"] = f"**{context.symbol}** has a Dividend Yield of **0%**.\n\nThis isn't bad! It just means your 'payday' only comes when you sell the stock for a higher price (Capital Gains)."

            # 4. Update Game Config (Compound Engine)
            if pays_dividend:
                 lesson["game_config"]["instruction"] = f"Decide: Pocket {context.symbol}'s dividends, or Reinvest them to grow the engine?"
            else:
                 # Even if no dividend, we explain the concept of compounding via reinvestment
                 lesson["game_config"]["instruction"] = f"{context.symbol} reinvests everything for you. But here, YOU choose! Try Reinvesting."

            # 5. Dynamic Quiz
            dynamic_q = {}
            if pays_dividend:
                dynamic_q = {
                     "id": "q_dynamic_div",
                     "question": f"{context.symbol} pays a dividend of {yield_percent:.2f}%. What does this mean for you?",
                     "options": [
                         "I have to pay a fee to own it",
                         f"I earn roughly {yield_percent:.2f}% interest on my investment annually",
                         "The stock price will drop to zero",
                         "Nothing, it's just a number"
                     ],
                     "correctIndex": 1,
                     "explanation": f"A {yield_percent:.2f}% yield means the company shares that percentage of its value back to you as cash."
                }
            else:
                 dynamic_q = {
                     "id": "q_dynamic_div",
                     "question": f"{context.symbol} pays a 0% dividend. Is this a bad thing?",
                     "options": [
                         "Yes, it's a scam",
                         "No, it likely means they are reinvesting cash to grow (Growth Stock)",
                         "Yes, only failing companies pay 0%",
                         "No, it means they forgot to pay"
                     ],
                     "correctIndex": 1,
                     "explanation": "Many top companies (like Google or Amazon in the past) pay 0% dividends so they can use that money to expand."
                }
            
            # Append Dynamic Logic
            if len(lesson["quiz"]) >= 3:
                lesson["quiz"][2] = dynamic_q
            else:
                 lesson["quiz"].append(dynamic_q)

        # === LESSON 11: REVENUE VS PROFIT (Dynamic Content) ===
        elif lesson["id"] == "lesson_11_revenue_profit":
             from utils import format_large_number 
             
             # 1. Get Data from context if available (assuming smart_context saves 'info' to context somehow, otherwise we rely on generic placeholders)
             # NOTE: In our current architecture, 'context' is a StockContext object. 
             # If we don't have revenue data in StockContext, we can't inject specific numbers.
             # However, we can inject the COMPANY NAME into the standard placeholder.
             
             # Let's see if we have access to financial data. Usually we might not in the lightweight context.
             # We will stick to name injection which is already handled by standard .format() in most cases, 
             # but static_curriculum has '{company_name}' which we need to enable.
             
             slides = lesson["concept"]["slides"]
             if len(slides) > 0:
                 try:
                     slides[0]["text"] = slides[0]["text"].replace("{company_name}", context.name)
                 except Exception as e:
                     print(f"Error injecting Lesson 11 context: {e}")
        
        # === LESSON 12: EPS (Dynamic Content) ===
        elif lesson["id"] == "lesson_12_eps":
             slides = lesson["concept"]["slides"]
             if len(slides) > 0:
                 try:
                     slides[0]["text"] = slides[0]["text"].replace("{company_name}", context.name)
                 except Exception as e:
                     print(f"Error injecting Lesson 12 context: {e}")

        # === LESSON 15: BETA (Dynamic Content) ===
        elif lesson["id"] == "lesson_15_beta":
             try:
                 # 1. Get Beta
                 beta_val = context.beta if context.beta is not None else 1.0
                 beta_str = f"{beta_val:.2f}"
                 
                 # 2. Inject Context into Slide 0
                 slides = lesson["concept"]["slides"]
                 if len(slides) > 0:
                     slides[0]["text"] = slides[0]["text"].replace("{beta}", beta_str).replace("{company_name}", context.name)
                 
                 # 3. Update Game Config
                 if "game_config" in lesson:
                     lesson["game_config"]["base_beta"] = beta_val
                     
                 # 4. Inject Quiz
                 if "quiz" in lesson and lesson["quiz"]:
                     for q in lesson["quiz"]:
                         q_text = q.get("question", "")
                         if "{beta}" in q_text:
                             q["question"] = q_text.replace("{beta}", beta_str)
                             q_text = q["question"] # Update for next check
                         if "{company_name}" in q_text:
                             q["question"] = q_text.replace("{company_name}", str(context.name))
             except Exception as e:
                 print(f"Error injecting Lesson 15 context: {e}")

        # === LESSON 16: EARNINGS REPORTS (Dynamic Content) ===
        elif lesson["id"] == "lesson_16_earnings_reports":
             try:
                 # Inject Context into Sliides
                 slides = lesson["concept"]["slides"]
                 for slide in slides:
                     if "{company_name}" in slide["text"]:
                        slide["text"] = slide["text"].replace("{company_name}", context.name)
                     if "{symbol}" in slide["text"]:
                        slide["text"] = slide["text"].replace("{symbol}", context.symbol)
                 
                 # Inject Context into Quiz
                 if "quiz" in lesson and lesson["quiz"]:
                     for q in lesson["quiz"]:
                         if "{company_name}" in q.get("question", ""):
                             q["question"] = q["question"].replace("{company_name}", str(context.name))
             except Exception as e:
                 print(f"Error injecting Lesson 16 context: {e}")

        # === LESSON 17: 52-WEEK RANGE (Dynamic Content) ===
        elif lesson["id"] == "lesson_17_52_week_range":
             try:
                 high = context.week_52_high if context.week_52_high else context.price * 1.5
                 low = context.week_52_low if context.week_52_low else context.price * 0.8
                 
                 # Inject into Slides
                 slides = lesson["concept"]["slides"]
                 for slide in slides:
                     text = slide.get("text", "")
                     if "{company_name}" in text:
                         text = text.replace("{company_name}", context.name)
                     if "{symbol}" in text:
                         text = text.replace("{symbol}", context.symbol)
                     if "{fiftyTwoWeekHigh}" in text:
                         text = text.replace("{fiftyTwoWeekHigh}", f"{get_currency_config(context.symbol)['symbol']}{high:.2f}")
                     if "{fiftyTwoWeekLow}" in text:
                         text = text.replace("{fiftyTwoWeekLow}", f"{get_currency_config(context.symbol)['symbol']}{low:.2f}")
                     slide["text"] = text
                 
                 # Inject into Game Config
                 if "game_config" in lesson:
                     lesson["game_config"]["instruction"] = lesson["game_config"]["instruction"].replace("{symbol}", context.symbol)
                     
                 # Inject into Quiz
                 if "quiz" in lesson:
                     for q in lesson["quiz"]:
                         # Add any specific quiz injections if needed
                         pass
             except Exception as e:
                 print(f"Error injecting Lesson 17 context: {e}")
                 high = context.week_52_high if context.week_52_high else context.price * 1.2
                 low = context.week_52_low if context.week_52_low else context.price * 0.8
                 price = context.price
                 
                 # Inject Context into Slides
                 slides = lesson["concept"]["slides"]
                 for slide in slides:
                     if "{company_name}" in slide["text"]:
                        slide["text"] = slide["text"].replace("{company_name}", context.name)
                     if "{price}" in slide["text"]:
                        slide["text"] = slide["text"].replace("{price}", f"${price:.2f}")
                     if "{symbol}" in slide["text"]:
                        slide["text"] = slide["text"].replace("{symbol}", context.symbol)
                 
                 # Inject into Quiz
                 if "quiz" in lesson and lesson["quiz"]:
                     for q in lesson["quiz"]:
                         if "{company_name}" in q.get("question", ""):
                             q["question"] = q["question"].replace("{company_name}", str(context.name))


             except Exception as e:
                 print(f"Error injecting Lesson 17 context: {e}")

        # === Lesson 18: Liquidity ===
        elif lesson["id"] == "lesson_18_liquidity":
            try:
                # Inject Context into Slides
                if "concept" in lesson and "slides" in lesson["concept"]:
                    slides = lesson["concept"]["slides"]
                    for slide in slides:
                        text = slide.get("text", "")
                        if "{company_name}" in text:
                            slide["text"] = text.replace("{company_name}", context.name)
                        if "{symbol}" in text:
                            slide["text"] = slide["text"].replace("{symbol}", context.symbol)
            except Exception as e:
                print(f"Error injecting Lesson 18 context: {e}")

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
