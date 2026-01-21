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
        
        print("🔰 Beginner User detected: Serving Static Lesson 2 (Exchange)")
        
        # Clone Lesson 2
        lesson = copy.deepcopy(TIER_1_LESSONS[1])
        
        # Inject Context (Chameleon Mode)
        if lesson["id"] == "lesson_2_exchange":
            # === LESSON 2: THE EXCHANGE (CAROUSEL LOGIC) ===
            symbol = context.symbol
            name = context.name
            
            # Default values (Targeting formatting)
            target_exchange = "US Market"
            target_category = "Public Company"
            
            # Bucket C: International (Has Suffix)
            if "." in symbol:
                suffix = "." + symbol.split(".")[1]
                suffix_map = {
                    ".NS": "National Stock Exchange of India",
                    ".BO": "Bombay Stock Exchange",
                    ".L": "London Stock Exchange",
                    ".TO": "Toronto Stock Exchange",
                    ".KS": "Korean Stock Exchange",
                    ".DE": "Deutsche Börse Xetra"
                }
                home_exchange = suffix_map.get(suffix, "International Exchange")
                target_exchange = home_exchange
                target_category = "global leader on its home turf"
                
                # Special Logic for INDIA (NSE/BSE)
                if suffix in [".NS", ".BO"]:
                   target_exchange = home_exchange
                   target_category = "market leader in India"

                   # Update Slide 1 (The Analogy) for India Context
                   lesson["concept"]["slides"][1]["text"] = "Think of an Exchange as a specialized supermarket where shares of companies are bought and sold. In India, there are two main 'stores'."

                   # Update Slide 2 (The Rivals) for India Context
                   lesson["concept"]["slides"][2] = {
                       "title": "The Dual Giants",
                       "icon": "Scale",
                       "text": "India's market is split between two giants:\n\n• **NSE:** Modern & Digital (Like Nasdaq).\n• **BSE:** Historic & Vast (Like NYSE)."
                   }
                   
                   # Overwrite Game Config for India (Existing Logic)
                   lesson["game_config"]["instruction"] = f"Sort {name} into the correct bin (NSE) to start."
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
                   
                   # Overwrite Quiz for India Context (Existing Logic)
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

            # Bucket A: US Tech (4+ letters, No Suffix)
            elif len(symbol) >= 4:
                target_exchange = "Nasdaq"
                target_category = "modern Tech Innovator"
            
            # Bucket B: US Classic (1-3 letters, No Suffix)
            else:
                target_exchange = "NYSE"
                target_category = "historic 'Blue Chip' Giant"

            # Inject into Slide 0 (The Context)
            slide_0_text = lesson["concept"]["slides"][0]["text"]
            lesson["concept"]["slides"][0]["text"] = slide_0_text.format(
                company_name=name,
                exchange=target_exchange,
                category=target_category
            )

            # Update Game Instruction (Generic)
            if "market_sort_config" not in lesson["game_config"]:
                 lesson["game_config"]["instruction"] = f"Sort {name} into the correct bin (NYSE) to start."

            # Inject Dynamic 4th Question
            dynamic_question = {}
            if "." in symbol: # International
                if symbol.endswith(".NS") or symbol.endswith(".BO"):
                     dynamic_question = {
                        "question": f"Which exchange is known as the modern market leader in India?",
                        "options": [
                            "The NSE (National Stock Exchange)",
                            "The BSE (Bombay Stock Exchange)",
                            "The New Delhi Market",
                            "The spices market"
                        ],
                        "correctIndex": 0
                    }
                else:
                    dynamic_question = {
                        "question": f"Based on what you learned, which exchange does {name} list on?",
                        "options": [
                            "The Nasdaq",
                            "The NYSE",
                            home_exchange,
                            "The Moon"
                        ],
                        "correctIndex": 2
                    }
            elif len(symbol) >= 4: # Nasdaq
                dynamic_question = {
                    "question": f"Based on what you learned, which exchange does {name} list on?",
                    "options": [
                        "The NYSE",
                        "The Nasdaq",
                        "The London Stock Exchange",
                        "A local farmers market"
                    ],
                    "correctIndex": 1
                }
            else: # NYSE
                dynamic_question = {
                    "question": f"Based on what you learned, which exchange does {name} list on?",
                    "options": [
                        "The NYSE",
                        "The Nasdaq",
                        "The Tokyo Stock Exchange",
                        "An online crypto forum"
                    ],
                    "correctIndex": 0
                }
            
            if dynamic_question:
                lesson["quiz"].append(dynamic_question)

        # Inject Context (Chameleon Mode) - only if lesson has a target to inject
        elif "target" in lesson["game_config"] and "{symbol}" in lesson["game_config"]["target"]:
            # Parse components
            symbol = context.symbol
            
            if "." in symbol:
                # Scenario B: International Stock (Suffix)
                suffix = "." + symbol.split(".")[1]
                
                # Simple Manual Map for Demo
                suffix_map = {
                    ".NS": "National Stock Exchange of India",
                    ".BO": "Bombay Stock Exchange",
                    ".L": "London Stock Exchange",
                    ".TO": "Toronto Stock Exchange",
                    ".KS": "Korean Stock Exchange",
                    ".DE": "Deutsche Börse Xetra"
                }
                exchange_name = suffix_map.get(suffix, "International Exchange")
                
                explanation = (
                    f"You searched for {context.name}, but on the market, it is known by its unique code: {context.symbol}.\n\n"
                    "This is called a Ticker Symbol. Think of it like a website address. "
                    f"The ending ({suffix}) acts like a country code (like '.kr' or '.in'). "
                    f"In this case, the {suffix} tells you this stock lives on the {exchange_name}. "
                    "You need the full address to ensure you don't buy the wrong stock in the wrong country."
                )
            else:
                # Scenario A: Standard US Stock (No Suffix)
                explanation = (
                    f"You searched for {context.name}, but on the market, it is known by its unique code: {context.symbol}.\n\n"
                    "This is called a Ticker Symbol. Think of it like a website address. "
                    "Since this ticker has no special ending (like '.com' or '.in'), it means it trades on the standard US Market (NYSE/Nasdaq). "
                    "Always check the code to ensure you are buying the right company."
                )

            lesson["concept"]["explanation"] = explanation
            
            lesson["game_config"]["target"] = lesson["game_config"]["target"].format(
                symbol=context.symbol
            )
            lesson["game_config"]["instruction"] = lesson["game_config"]["instruction"].format(
                company_name=context.name
            )
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
