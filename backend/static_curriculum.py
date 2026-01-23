"""
Static Curriculum for Stocky Academy.
Preset lessons for beginners.
"""

TIER_1_LESSONS = [
    {
        "id": "lesson_1_ticker",
        "title": "The Ticker Symbol",
        "concept": {
            "name": "The Ticker Symbol",
            "category": "market_mechanics",
            "type": "carousel",
            "slides": [
                {
                    "title": "The Context",
                    "text": "You searched for **{company_name}**, but on the market, it is known as **{symbol}**.",
                    "icon": "Tag",
                    "image": "/images/ticker_tag.png"  # Placeholder
                },
                {
                    "title": "The Analogy",
                    "text": "Think of a Ticker like an **Airport Code** (e.g., LAX). It is a short, unique ID that ensures you arrive at the exact right destination.",
                    "icon": "Plane"
                },
                {
                    "title": "The Mechanics",
                    "text": "Since **{symbol}** has no 'ending' (like .com), it trades on the standard **US Market**.", # Default (US)
                    "icon": "Globe"
                },
                {
                    "title": "The Rule",
                    "text": "Names can be confusingly similar. Always trade using the **Ticker Code** to guarantee you buy the right asset.",
                    "icon": "Shield"
                }
            ]
        },
        "breakdown": "This is your first lesson. We'll start with the basics: The Ticker Symbol.",
        "news": [],
        "game_config": {
            "type": "ticker_hunt",
            "target": "{symbol}",
            "instruction": "Find the ticker for {company_name}"
        },
        "quiz": [
            {
                "question": "What is a Ticker Symbol?",
                "options": [
                    "A unique series of letters for a stock",
                    "The current price of a stock",
                    "The CEO's nickname",
                    "A type of bank account"
                ],
                "correctIndex": 0
            },
            {
                "question": "Which ticker belongs to {company_name}?",
                "options": [
                    "{fake_1}",
                    "{fake_2}",
                    "{symbol}",
                    "{fake_3}"
                ],
                "correctIndex": 2
            },
            {
                "question": "Why do we use tickers?",
                "options": [
                    "To save time typing",
                    "To avoid confusion between similar names",
                    "Because they look cool",
                    "Both A and B"
                ],
                "correctIndex": 3
            },
            {
                "question": "In the Ticker Symbol, what does a suffix like '.KS' or '.NS' tell you?",
                "options": [
                    "The company's profit margin",
                    "It acts like a 'Country Code' showing where it trades",
                    "The CEO's middle name",
                    "It means the stock is on sale"
                ],
                "correctIndex": 1
            }
        ]
    },
    {
        "id": "lesson_2_exchange",
        "title": "The Exchange",
        "concept": {
            "type": "carousel",
            "name": "The Stock Exchange",
            "slides": [
                {
                    "title": "The Context",
                    "icon": "Target",
                    "text": "{pivot_text}"
                },
                {
                    "title": "The Analogy",
                    "icon": "Store",
                    "text": "Think of an Exchange as a specialized marketplace. Just as you don't buy sneakers at a grocery store, companies pick a specific 'home' based on their industry and identity."
                },
                {
                    "title": "The Two Giants",
                    "icon": "Scale",
                    "text": "The US Market sets the global standard with two rivals:\n\n🏛️ **NYSE (The Tradition):** A physical floor on Wall Street. Home to historic 'Blue Chip' industries.\n\n💻 **Nasdaq (The Future):** A 100% digital network. Home to modern Tech innovators."
                },
                {
                    "title": "Jargon: Blue Chips",
                    "icon": "Gem",
                    "text": "The term comes from poker, where blue chips hold the highest value.\n\nIn stocks, a **Blue Chip** is a massive, reliable company with a long history of stability (like Coca-Cola). These are typically the 'Safe Giants' found on the NYSE."
                },
                {
                    "title": "How You Buy",
                    "icon": "Zap",
                    "text": "You don't need to visit the exchange yourself. When you tap 'Buy' on the app, your broker acts as a high-speed courier, sprinting to the right exchange to execute your deal instantly."
                }
            ]
        },
        "breakdown": "Now that you know the 'Where' (The Exchange), let's master the 'How'.",
        "news": [],
        "game_config": {
            "type": "market_sort",
            "instruction": "Sort the companies to their correct home: NYSE (Classic/Physical) or Nasdaq (Tech/Digital)"
        },
        "quiz": [
            {
                "question": "What is the Nasdaq best known for?",
                "options": [
                    "Agriculture and Farming",
                    "Tech companies and digital trading",
                    "Physical floor trading with shouting",
                    "Only international stocks"
                ],
                "correctIndex": 1
            },
            {
                "question": "Which company would most likely live on the NYSE?",
                "options": [
                    "A stable, historic 'Blue Chip' (e.g., Walmart)",
                    "A brand new AI startup",
                    "A cryptocurrency",
                    "A small local bakery"
                ],
                "correctIndex": 0
            },
            {
                "question": "Why are they called 'Blue Chips'?",
                "options": [
                    "Because the logos are usually blue",
                    "They are named after high-value poker chips",
                    "They make computer chips",
                    "It's a random nickname"
                ],
                "correctIndex": 1
            }
        ]
    },
    {
        "id": "lesson_3_supply_demand",
        "title": "Supply & Demand",
        "concept": {
            "name": "Supply & Demand",
            "category": "market_mechanics",
            "type": "carousel",
            "slides": [
                {
                    "title": "The Constant Battle",
                    "text": "Stock prices are not random. They represent a continuous **Tug-of-War** between Buyers (Bulls) and Sellers (Bears). Every tick up or down is a record of who won the battle in that specific moment.",
                    "icon": "Swords"
                },
                {
                    "title": "The Force of Demand",
                    "text": "**Demand** represents the collective buying pressure. When investors believe a company is valuable, they compete to own shares. This competition creates scarcity, forcing buyers to bid higher prices to secure a stake.",
                    "icon": "TrendingUp"
                },
                {
                    "title": "The Force of Supply",
                    "text": "**Supply** represents the selling pressure. When fear or profit-taking dominates, investors flood the market with shares. To find buyers for all this stock, sellers must lower their asking price, causing the chart to drop.",
                    "icon": "TrendingDown"
                }
            ]
        },
        "breakdown": "Prices don't move by magic. They move because of two simple forces: Supply and Demand.",
        "news": [],
        "game_config": {
            "type": "supply_demand_sandbox",
            "target": "Create a Demand Spike!",
            "instruction": "Slide RIGHT to create Demand (Hype). Slide LEFT to create Supply (Panic)."
        },
        "quiz": [
            {
                "question": "What happens when 'Demand' is higher than 'Supply'?",
                "options": ["The price goes UP", "The price goes DOWN", "Nothing happens", "The market closes"],
                "correctIndex": 0
            },
            {
                "question": "If investors are scared and want to sell, what does this create?",
                "options": ["High Demand", "High Supply", "Stable Prices", "New Shares"],
                "correctIndex": 1
            },
            {
                "question": "A Green Bar on a chart means:",
                "options": ["Sellers won that minute", "Buyers won that minute", "The market is closed", "It's a holiday"],
                "correctIndex": 1
            }
        ]
    },
    {
        "id": "lesson_4_sentiment",
        "title": "Bull vs. Bear",
        "concept": {
            "name": "Market Current",
            "category": "market_psychology",
            "type": "carousel",
            "slides": [
                {
                    "title": "The Bull Market 🐂",
                    "text": "A Bull Market is a period where stock prices are rising or expected to rise. It is driven by **optimism** and high investor confidence. In this environment, the 'path of least resistance' is **upward**.",
                    "icon": "TrendingUp"
                },
                {
                    "title": "The Bear Market 🐻",
                    "text": "A Bear Market is defined by a sustained price drop, usually **20% or more**. Fear replaces confidence, and investors sell to protect cash, which often causes prices to fall even further.",
                    "icon": "TrendingDown"
                },
                {
                    "title": "Identifying the Trend 📈",
                    "text": "Don't get distracted by daily 'wiggles'.\n\n**The Noise:** Single days that don't change the direction.\n**The Trend:** The clear path (Up/Down) over months.\n\nLook for **Higher Highs** or **Lower Lows** to see who is truly in control.",
                    "icon": "Activity"
                }
            ]
        },
        "breakdown": "Don't swim against the tide. Let's learn to spot the difference.",
        "news": [],
        "game_config": {
            "type": "trend_spotter",
            "instruction": "Look at the Chart + News. Is this a Bull (Buy) or Bear (Sell) market?",
            "scenarios": [
                {
                    "id": 1,
                    "text": "Unemployment is at record lows. People are spending money freely.",
                    "chart_cond": "uptrend",
                    "correct": "bull",
                    "explanation": "Strong economy = Optimism! 🐂"
                },
                {
                    "id": 2,
                    "text": "A major bank just collapsed. Panic is spreading across the news.",
                    "chart_cond": "downtrend",
                    "correct": "bear",
                    "explanation": "Fear causes selling. Cash is king! 🐻"
                },
                {
                    "id": 3,
                    "text": "Prices dropped yesterday, but buyers are rushing in to get 'cheap' shares.",
                    "chart_cond": "recovery",
                    "correct": "bull",
                    "explanation": "Buying the dip is a classic Bull move! 🚀"
                }
            ]
        },
        "quiz": [
            {
                "question": "In a Bull Market, what is the general specific mood?",
                "options": ["Optimism and Greed", "Fear and Panic", "Boredom", "Hunger"],
                "correctIndex": 0
            },
            {
                "question": "If the 'Tide' is going out (Bear Market), what usually happens?",
                "options": ["Prices hit new highs", "Prices generally fall", "Everyone buys more", "The market closes"],
                "correctIndex": 1
            },
            {
                "question": "Why is it called a 'Bull' market?",
                "options": ["Bulls are slow", "Bulls attack by thrusting their horns UP", "Bulls assume the fetal position", "Bulls are red"],
                "correctIndex": 1
            }
        ]
    }
]
