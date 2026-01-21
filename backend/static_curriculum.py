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
            "explanation": "You searched for {company_name}, but on the market, it is known by its unique code: {symbol}.\n\nThis is called a Ticker Symbol. Think of it like a website address.\n\n1. **The ID**: The first part ({base_ticker}) is the unique name, like 'Google'.\n2. **The Extension**: The ending ({suffix}) works like '.com' or '.in'. It tells you exactly where the stock lives.\n\nIn this case, the **{suffix}** tells you this stock trades on the **{exchange_name}**.\n\n**The Rule**: You need the full address to ensure you aren't buying the wrong company in the wrong country.",
            "beginner_explanation": "A unique ID for a stock."
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
        "id": "lesson_3_market_cap",
        "title": "Market Cap",
        "concept": {
            "name": "Market Capitalization",
            "explanation": "Market Cap is just the 'price tag' for the entire company. \n\nThink of a company like a pizza. The share price is the cost of just one slice. But to know how big the pizza is, you need to multiply the price of a slice by the number of slices.\n\n**Formula:** Share Price × Total Number of Shares = Market Cap.\n\nInvestors use this to sort companies by size: Small Cap (Risky), Mid Cap (Growth), and Large Cap (Stable).",
            "beginner_explanation": "The total value of the company."
        },
        "breakdown": "You know the Ticker and the Exchange. Now let's ask: How big is the company?",
        "news": [],
        "game_config": {
            "type": "cap_clash",
            "instruction": "Which company is bigger? (Higher Market Cap)"
        },
        "quiz": [
            {
                "question": "What does Market Cap represent?",
                "options": [
                    "The price of one share",
                    "The location of the headquarters",
                    "The total value of the entire company",
                    "The CEO's bonus"
                ],
                "correctIndex": 2
            },
            {
                "question": "If a pizza slice is $5 and there are 8 slices, what is the 'Market Cap'?",
                "options": [
                    "$5",
                    "$13",
                    "$40",
                    "$8"
                ],
                "correctIndex": 2
            },
            {
                "question": "Which category is typically considered most stable?",
                "options": [
                    "Small Cap",
                    "Large Cap",
                    "Bottle Cap",
                    "No Cap"
                ],
                "correctIndex": 1
            }
        ]
    }
]
