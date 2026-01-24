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
    },
    {
        "id": "lesson_5_market_cap",
        "title": "Market Cap",
        "concept": {
            "type": "carousel",
            "slides": [
                {
                    "title": "The Price Tag 🏷️",
                    "text": "**Market Capitalization (Market Cap)** is just the total 'Price Tag' of a company.\n\nIt's simple math: \n**Stock Price** × **Total Shares** = **Market Cap**.",
                    "icon": "Tag"
                },
                {
                    "title": "Speedboats vs. Ocean Liners 🚢",
                    "text": "**Small Cap** stocks are like speedboats: they can turn fast (high growth) but get rocked by waves (high risk).\n\n**Mega Cap** stocks (like Apple) are like Ocean Liners: very stable, but hard to turn quickly.",
                    "icon": "Ship"
                },
                {
                    "title": "Why Size Matters ⚖️",
                    "text": "It takes way more money to move a Mega Cap stock by 1% than it does a Small Cap.\n\nBig stocks are **harder to move** (less volatile). Small stocks are **easier to move** (more volatile).",
                    "icon": "Scale"
                }
            ]
        },
        "breakdown": "Market Cap tells you the true size of a company usually derived from share price * total shares.",
        "news": [
            {
                "headline": "Small Cap 'RocketCorp' Soars 50% on Minor News",
                "sentiment": "Positive",
                "summary": "Low float and small size allow for massive volatility."
            },
            {
                "headline": "Mega Cap 'GiantCo' Moves 0.5% After Billion Dollar Deal",
                "sentiment": "Neutral",
                "summary": "It takes a lot of capital to move a giant ship."
            }
        ],
        "game_config": {
            "type": "market_cap_scale",
            "instruction": "Add money to the scale. See how much harder it is to move a Giant."
        },
        "quiz": [
            {
                "id": "q1",
                "question": "How do you calculate Market Cap?",
                "options": ["Stock Price + Debt", "Stock Price × Total Shares", "Yearly Revenue × 2", "Total Profit - Costs"],
                "correctIndex": 1,
                "explanation": "Market Cap is simply the current Price multiplied by the number of Shares existing."
            },
            {
                "id": "q2",
                "question": "Which stock is generally MORE volatile?",
                "options": ["Mega Cap (Ocean Liner)", "Small Cap (Speedboat)", "They are the same", "None of the above"],
                "correctIndex": 1,
                "explanation": "Small Caps are like speedboats—easier to push around, meaning higher volatility."
            },
            {
                "id": "q3",
                "question": "Why is it hard to double the price of Apple?",
                "options": ["Apple has bad phones", "Apple is too small", "It requires trillions of dollars of buying power", "Apple is a fruit"],
                "correctIndex": 2,
                "explanation": "To double a $3 Trillion company, you need to add another $3 Trillion in value. That is a lot of money!"
            }
        ]
    },
    {
        "id": "lesson_6_ipo",
        "title": "The IPO",
        "concept": {
            "type": "carousel",
            "slides": [
                {
                    "title": "The Birth of a Stock 🐣",
                    "text": "**IPO (Initial Public Offering)** is the first day a private company sells shares to the public.\n\nIt transforms from a company owned by a few, to one that **anyone can own**.",
                    "icon": "Egg"
                },
                {
                    "title": "The Primary Market 🏦",
                    "text": "Before you can buy it on the public market, big banks and institutions buy it first (The Primary Market).\n\nBy the time it reaches you, the price may have already skyrocketed.",
                    "icon": "Building2"
                },
                {
                    "title": "Launch Day Volatility 🎢",
                    "text": "IPOs are famous for being **volatile**.\n\nWithout history to guide the price, it is driven purely by hype. 'Pop and Drop' patterns are common.",
                    "icon": "TrendingUp"
                }
            ]
        },
        "breakdown": "An IPO is when a company invites the world to be its partner.",
        "news": [],
        "game_config": {
            "type": "ipo_launch_simulator",
            "instruction": "Navigate the chaos of Launch Day. Buy and Sell to survive."
        },
        "quiz": [
            {
                "id": "q1",
                "question": "What does IPO stand for?",
                "options": ["International Profit Organization", "Initial Public Offering", "Immediate Price Option", "Internet Protocol Owner"],
                "correctIndex": 1,
                "explanation": "It stands for Initial Public Offering - the first time shares are offered to the general public."
            },
            {
                "id": "q2",
                "question": "Who usually buys the stock BEFORE it hits the public market?",
                "options": ["You and me", "Big Banks and Institutions", "Government officials", "Nobody"],
                "correctIndex": 1,
                "explanation": "Institutional investors get 'allocations' at the IPO price. Retail investors (us) usually buy when it hits the exchange."
            },
            {
                "id": "q3",
                "question": "Why are IPOs considered risky?",
                "options": ["They are illegal", "They have no trading history and high volatility", "They are too boring", "They always go up"],
                "correctIndex": 1,
                "explanation": "With no price history, IPOs are driven by speculation, leading to massive swings (Volatility)."
            }
        ]
    },
    {
        "id": "lesson_13_pe_ratio",
        "title": "P/E Ratio",
        "concept": {
            "type": "carousel",
            "slides": [
                {
                    "title": "The Price Tag for Earnings 🏷️",
                    "text": "**Price-to-Earnings (P/E)** tells you if a stock is 'Cheap' or 'Expensive'.\n\nIt asks: **How much are you paying for $1 of the company's profit?**",
                    "icon": "Tag"
                },
                {
                    "title": "The Money Machine 🖨️",
                    "text": "Imagine a machine that prints **$1 every year**.\n\n• If you pay **$10** for it, the P/E is **10** (Cheap/Value).\n• If you pay **$50** for it, the P/E is **50** (Expensive/Growth).",
                    "icon": "Banknote"
                },
                {
                    "title": "Growth vs. Value ⚖️",
                    "text": "**High P/E (>30):** Investors pay extra because they expect the machine to print MORE money in the future (e.g., Tech/AI).\n\n**Low P/E (<15):** The machine is steady but boring (e.g., Banks/Energy).",
                    "icon": "Scale"
                }
            ]
        },
        "breakdown": "Price gives you the cost. P/E gives you the value.",
        "news": [],
        "game_config": {
            "type": "valuation_station",
            "instruction": "Which Money Machine is this stock behaving like?"
        },
        "quiz": [
            {
                "id": "q1",
                "question": "What does the P/E Ratio tell you?",
                "options": ["The total debt of the company", "How much you pay for $1 of earnings", "The CEO's salary", "The stock price divided by 10"],
                "correctIndex": 1,
                "explanation": "P/E stands for Price-to-Earnings. It measures the price you pay for each dollar of profit."
            },
            {
                "id": "q2",
                "question": "If a stock has a P/E of 100, what does it usually mean?",
                "options": ["It is going bankrupt", "It is very cheap", "Investors expect huge future growth", "It is a bank"],
                "correctIndex": 2,
                "explanation": "A high P/E means investors are willing to pay a premium now because they expect earnings to explode later."
            },
            {
                "id": "q3",
                "question": "Which company typically has a LOWER P/E ratio?",
                "options": ["A brand new AI startup", "A stable Utility company", "A flying car company", "A biotech researcher"],
                "correctIndex": 1,
                "explanation": "Stable, slow-growing companies (Value Stocks) usually trade at lower P/E ratios than high-growth tech stocks."
            }
        ]
    }
]
