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
                    "text": "The US market is home to two main exchanges:\n\n🏛️ **NYSE:** The historic physical floor on Wall Street.\n\n💻 **Nasdaq:** The modern digital network for tech companies."
                },
                {
                    "title": "Jargon: Blue Chips",
                    "icon": "Gem",
                    "text": "The term comes from poker, where blue chips hold the highest value.\n\nIn stocks, a **Blue Chip** is a massive, reliable company (like Coca-Cola). These are typically found on the NYSE."
                },
                {
                    "title": "How You Buy",
                    "icon": "Zap",
                    "text": "You don't trade with the exchange directly. When you place a 'Buy' order, your broker acts as a messenger, sprinting to the exchange to execute the deal for you."
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
        "id": "lesson_7_sectors",
        "title": "Stock Sectors",
        "concept": {
            "name": "Understanding 'Families'",
            "category": "market_mechanics",
            "type": "carousel",
            "slides": [
                {
                    "title": "The Context",
                    "text": "You searched for **{company_name}**. This company doesn't exist in a vacuum—it belongs to a 'Family' known as the **{sector}** sector.",
                    "icon": "Users",
                    "image": "/images/sector_family.png"
                },
                {
                    "title": "The Market Grid",
                    "text": "The stock market is divided into **11 Sectors**. Think of them as neighborhoods: companies in the same neighborhood often react similarly to economic news and trends.",
                    "icon": "LayoutGrid"
                },
                {
                    "title": "Cyclical vs. Defensive",
                    "text": "Some families are **Cyclical** (they thrive when the economy is booming, like Tech or Luxury Goods). Others are **Defensive** (they stay steady even in recessions, like Healthcare or Utilities).",
                    "icon": "Scale"
                },
                {
                    "title": "The Golden Rule",
                    "text": "The secret to safety is **Diversification**. By owning stocks in different sectors, you ensure that a single 'neighborhood' crash won't bring down your entire portfolio.",
                    "icon": "ShieldCheck"
                }
            ]
        },
        "breakdown": "Every stock belongs to a sector. Learning how these 'Families' move is key to building a balanced portfolio.",
        "news": [],
        "game_config": {
            "type": "sector_sorter",
            "instruction": "Tap the correct Sector family for the falling brand!",
            "items": [
                {"brand": "Apple", "sector": "Technology"},
                {"brand": "Pfizer", "sector": "Healthcare"},
                {"brand": "Coca-Cola", "sector": "Consumer Staples"},
                {"brand": "ExxonMobil", "sector": "Energy"}
            ]
        },
        "quiz": [
            {
                "question": "What is a Stock Sector?",
                "options": [
                    "A group of companies in the same industry",
                    "The building where stocks are sold",
                    "A type of high-speed trading",
                    "A government tax group"
                ],
                "correctIndex": 0,
                "explanation": "Sectors are categories that group companies with similar business models together."
            },
            {
                "question": "Why would an investor own stocks in different sectors?",
                "options": [
                    "To get more mail from companies",
                    "To diversify and reduce risk",
                    "Because it is required by law",
                    "To pay fewer trading fees"
                ],
                "correctIndex": 1,
                "explanation": "Diversification ensures that if one sector (like Tech) falls, your other sectors (like Healthcare) might stay steady."
            },
            {
                "question": "Which of these is considered a 'Defensive' sector?",
                "options": [
                    "Luxury Travel",
                    "Utilities (Electricity/Water)",
                    "High-Tech AI Startups",
                    "Cryptocurrency"
                ],
                "correctIndex": 1,
                "explanation": "Defensive sectors provide essentials that people need regardless of how the economy is doing."
            }
        ]
    },
    {
        "id": "lesson_8_volume",
        "title": "Volume (Activity)",
        "concept": {
            "name": "The Power of the Crowd",
            "category": "market_mechanics",
            "type": "carousel",
            "slides": [
                {
                    "title": "The Pulse of the Market",
                    "text": "You searched for **{company_name}**. While the price tells you **where** the stock is, **Volume** tells you how many people are actually participating in the trade.",
                    "icon": "Activity",
                    "image": "/images/volume_pulse.png"
                },
                {
                    "title": "The Stadium Analogy",
                    "text": "Imagine a stadium. If one person yells 'Goal!', it's barely a whisper. If 50,000 people yell it, it's a **massive event**. High volume means the 'Crowd' is in strong agreement.",
                    "icon": "Users"
                },
                {
                    "title": "Volume as Confirmation",
                    "text": "If a stock price moves up on **High Volume**, it's a strong signal of conviction. If it moves up on **Low Volume**, it might be a 'fake-out' because very few people are backing the move.",
                    "icon": "CheckCircle"
                },
                {
                    "title": "The Volume Climax",
                    "text": "A sudden, massive spike in volume often signals the end of a trend. It's the moment everyone has finally 'piled in' or 'panicked out', often leading to a price reversal.",
                    "icon": "Zap"
                }
            ]
        },
        "breakdown": "Volume is the fuel for price. Without activity from the crowd, a price move lacks the power to sustain itself.",
        "news": [],
        "game_config": {
            "type": "volume_vault",
            "instruction": "Read the News. Tap the Vault that matches the expected Volume.",
            "scenarios": [
                {
                    "headline": "{company_name} files for Bankruptcy!",
                    "correct_vault": "High",
                    "explanation": "Panic selling creates massive volume! 📉"
                },
                {
                    "headline": "{company_name} releases a boring annual report with no surprises.",
                    "correct_vault": "Low",
                    "explanation": "No news is... low volume. Zzz. 😴"
                },
                {
                    "headline": "Rumors swirl about a potential merger with a rival.",
                    "correct_vault": "Medium",
                    "explanation": "Rumors bring interest, increasing volume steadily. 👀"
                }
            ]
        },
        "quiz": [
            {
                "question": "What does 'Volume' measure in a stock?",
                "options": [
                    "The total number of shares traded",
                    "The company's annual profit",
                    "The speed of the stock's website",
                    "The number of employees at the company"
                ],
                "correctIndex": 0,
                "explanation": "Volume is simply a count of how many shares changed hands in a given time period."
            },
            {
                "question": "If a stock price falls on very high volume, what does it suggest?",
                "options": [
                    "The market is about to close",
                    "There is strong conviction in the selling pressure",
                    "Nobody is interested in the stock",
                    "It's a good time to ignore the chart"
                ],
                "correctIndex": 1,
                "explanation": "High volume during a drop means a large 'crowd' is actively selling, showing the move has strong momentum."
            },
            {
                "question": "Why is low volume often considered 'dangerous' for a trader?",
                "options": [
                    "The stock price is too high",
                    "It can be harder to buy or sell without moving the price yourself",
                    "The company might go bankrupt immediately",
                    "It makes the app run slower"
                ],
                "correctIndex": 1,
                "explanation": "Low volume means low liquidity; a single small trade can cause a massive price swing, making it hard to get a fair price."
            }
        ]
    },
    {
        "id": "lesson_9_volatility",
        "title": "Volatility (Risk)",
        "concept": {
            "name": "Understanding the 'Wiggle'",
            "category": "risk_management",
            "type": "carousel",
            "slides": [
                {
                    "title": "The Wiggle Factor",
                    "text": "You searched for **{company_name}**. Volatility is simply a measure of how much a stock's price 'wiggles' up and down over a short period of time.",
                    "icon": "Activity",
                    "image": "/images/volatility_wiggle.png"
                },
                {
                    "title": "The Emotional Temperature",
                    "text": "Think of Volatility as the **Market's Pulse**. High volatility means investors are uncertain or excited, causing big swings. Low volatility means the market is calm and confident.",
                    "icon": "Thermometer"
                },
                {
                    "title": "Risk vs. Reward",
                    "text": "High volatility (big wiggles) offers the chance for fast profits but carries the risk of fast losses. Low volatility is like a 'Walk in the Park'—slower, but much easier to predict.",
                    "icon": "Scale"
                },
                {
                    "title": "Beta: The Benchmark",
                    "text": "Pros use a number called **Beta** to measure wiggle. \n\n• **Beta 1.0:** Moves exactly like the market.\n• **Beta > 1.0:** Extra jumpy (Tech/Startups).\n• **Beta < 1.0:** Steady and calm (Utilities/Banks).",
                    "icon": "Compass"
                }
            ]
        },
        "breakdown": "Volatility isn't 'bad'—it's just a measure of intensity. Understanding the wiggle helps you choose stocks that match your comfort level.",
        "news": [],
        "game_config": {
            "type": "wiggle_tamer",
            "instruction": "Try to 'Capture' the moving square. Notice how the Jumpy stocks are harder to catch!",
            "scenarios": [
                {
                    "stock_type": "Utility Company",
                    "behavior": "Stable/Slow Pulse",
                    "difficulty": "Easy",
                    "explanation": "Low volatility stocks are predictable and steady. 🧘"
                },
                {
                    "stock_type": "AI Startup",
                    "behavior": "Erratic/Fast Jitter",
                    "difficulty": "Hard",
                    "explanation": "High volatility means prices move fast and unpredictably. 🎢"
                }
            ]
        },
        "quiz": [
            {
                "question": "What does Volatility measure?",
                "options": [
                    "The total number of employees",
                    "The size of the price 'wiggles' or swings",
                    "The age of the company",
                    "The amount of debt the company has"
                ],
                "correctIndex": 1,
                "explanation": "Volatility is the frequency and size of price movements over time."
            },
            {
                "question": "Which 'Beta' score represents a stock that is CALMER than the average market?",
                "options": [
                    "Beta of 2.5",
                    "Beta of 1.0",
                    "Beta of 0.5",
                    "Beta of 5.0"
                ],
                "correctIndex": 2,
                "explanation": "A Beta below 1.0 means the stock is less volatile than the general market."
            },
            {
                "question": "True or False: High volatility always means a stock is 'bad'.",
                "options": [
                    "True: It is too dangerous.",
                    "False: It just means it is high-intensity; it can lead to high rewards or high losses."
                ],
                "correctIndex": 1
            }
        ]
    },

    {
        "id": "lesson_10_dividends",
        "title": "What is a Dividend?",
        "concept": {
            "name": "Profit-sharing Basics",
            "category": "market_mechanics",
            "type": "carousel",
            "slides": [
                {
                    "title": "The Reward 🎁",
                    "text": "You searched for **{company_name}**. When a company is profitable, it can choose to send a portion of that cash directly to you. This 'Thank You' payment is called a **Dividend**.",
                    "icon": "Gift",
                    "image": "/images/dividend_reward.png"
                },
                {
                    "title": "The Rental Analogy 🏠",
                    "text": "Think of a stock like a **Rental Property**. You own the building (the stock), and the dividend is the **Rent** you collect every month without ever having to sell the house.",
                    "icon": "Home"
                },
                {
                    "title": "The Yield 📊",
                    "text": "The **Dividend Yield** is the annual payout shown as a percentage of the stock price. It tells you how much 'Interest' you are earning just for holding the share.",
                    "icon": "Percent"
                },
                {
                    "title": "Growth vs. Income ⚖️",
                    "text": "Not every company pays a dividend. **Growth** companies (like Tech) often keep the cash to build new things. **Value** companies (like Banks or Utilities) usually have extra cash to share with you.",
                    "icon": "Briefcase"
                }
            ]
        },
        "breakdown": "Dividends are the 'Payday' of the stock market. They allow you to earn money while you wait for the stock price to grow.",
        "news": [],
        "game_config": {
            "type": "compound_engine",
            "instruction": "Drag Circles to Wallet for Cash ($), or back to the Engine to Compound (Growth)!",
            "initial_rate": 2000, # ms per spawn
            "growth_factor": 0.9 # Spawn rate multiplier per reinvest
        },
        "quiz": [
            {
                "question": "What is a Dividend?",
                "options": [
                    "A loan you give to the company",
                    "A portion of profit shared with shareholders",
                    "The price of a single share",
                    "A fine for selling too early"
                ],
                "correctIndex": 1,
                "explanation": "A dividend is a distribution of a company's earnings to its shareholders."
            },
            {
                "question": "If a company has a 5% Dividend Yield, what does that mean?",
                "options": [
                    "The stock price will go up 5%",
                    "You earn $5 for every $100 worth of stock you own annually",
                    "The company is losing 5% of its value",
                    "You must pay a 5% fee to own it"
                ],
                "correctIndex": 1,
                "explanation": "Yield represents the annual dividend payment as a percentage of the current stock price."
            },
            {
                "question": "Why do some companies NOT pay a dividend?",
                "options": [
                    "They are not allowed to by law",
                    "They prefer to use the cash to grow the business",
                    "They forgot to set up the payments",
                    "Dividends are only for small companies"
                ],
                "correctIndex": 1,
                "explanation": "Growth-focused companies often reinvest all their profits back into the company to expand faster."
            }
        ]
    },
]

TIER_2_LESSONS = [
    {
        "id": "lesson_12_eps",
        "title": "Earnings Per Share (EPS)",
        "concept": {
            "name": "The Pulse of Profitability",
            "category": "valuation_health",
            "type": "carousel",
            "slides": [
                {
                    "title": "The Meaning 🍕",
                    "text": "You searched for **{company_name}**. If the company's total profit is a giant **Pizza**, **EPS** is the amount of pizza on **Your Single Slice** (Share).",
                    "icon": "PieChart"
                },
                {
                    "title": "The Formula ➗",
                    "text": "It's simple division:\n\n**Total Profit** ÷ **Total Shares** = **EPS**.\n\nA higher EPS means your slice of the profit pie is bigger and tastier!",
                    "icon": "Divide"
                },
                {
                    "title": "The Growth Engine 🚀",
                    "text": "Investors love seeing EPS grow. It means the company is becoming more efficient at making money for every share you hold.",
                    "icon": "TrendingUp"
                }
            ]
        },
        "breakdown": "EPS tells you exactly how much profit belongs to the single share in your pocket.",
        "news": [],
        "game_config": {
            "type": "eps_slicer",
            "instruction": "Slide to see how adding more shares makes your 'Profit Slice' smaller!"
        },
        "quiz": [
            {
                "question": "What does EPS stand for?",
                "options": [
                    "Earnings Per Stock",
                    "Earnings Per Share",
                    "Every Pizza Slice",
                    "Extra Profit Source"
                ],
                "correctIndex": 1
            },
            {
                "question": "If a company has $100 Profit and 10 Shares, what is the EPS?",
                "options": [
                    "$1",
                    "$10",
                    "$100",
                    "$1000"
                ],
                "correctIndex": 1
            },
            {
                "question": "Why is a Rising EPS good?",
                "options": [
                    "It means the company is printing more shares",
                    "It means each share is becoming more valuable",
                    "It means the pizza is getting smaller",
                    "It's not good, it's bad"
                ],
                "correctIndex": 1
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
    },

    {
        "id": "lesson_11_revenue_profit",
        "title": "Revenue vs. Profit",
        "concept": {
            "name": "Top Line vs. Bottom Line",
            "category": "valuation_health",
            "type": "carousel",
            "slides": [
                {
                    "title": "The Context 📉",
                    "text": "You searched for **{company_name}**. You might see a massive number for its **Revenue**, but that isn't the whole story. Revenue is just the 'Total Sales'—the money that walked through the front door.",
                    "icon": "ArrowDownToLine"
                },
                {
                    "title": "The Analogy 🍋",
                    "text": "Think of a **Lemonade Stand**. If you sell 100 cups at $1 each, your **Revenue** is $100. But if the lemons, sugar, and cups cost you $80, your **Profit** is only $20. Revenue is the size of the stand; Profit is what you actually keep.",
                    "icon": "Store"
                },
                {
                    "title": "The 'Lines' 📏",
                    "text": "In a financial report, Revenue is at the very top (**Top Line**). After you subtract costs like salaries, taxes, and materials, you reach the final number at the very bottom (**Bottom Line**): The Net Profit.",
                    "icon": "AlignJustify"
                },
                {
                    "title": "The Margin ✂️",
                    "text": "The gap between the top and bottom lines is the **Profit Margin**. A healthy company is efficient at keeping as much of that 'Top Line' as possible.",
                    "icon": "Activity"
                }
            ]
        },
        "breakdown": "Revenue shows popularity; Profit shows efficiency. A company can have billions in sales but still lose money if its costs are too high.",
        "game_config": {
            "type": "profit_punch",
            "instruction": "Punch out the Expenses to reveal the true Bottom Line!"
        },
        "quiz": [
            {
                "question": "What is another name for 'The Top Line'?",
                "options": [
                    "Net Income",
                    "Revenue",
                    "Taxes",
                    "CEO Salary"
                ],
                "correctIndex": 1,
                "explanation": "Revenue sits at the top of the income statement because it is the starting point for all financial calculations."
            },
            {
                "question": "If a company has $1 Billion in Revenue and $1.1 Billion in Expenses, what is their Profit?",
                "options": [
                    "$100 Million",
                    "-$100 Million (A Loss)",
                    "$2.1 Billion",
                    "Zero"
                ],
                "correctIndex": 1,
                "explanation": "Profit is Revenue minus Expenses. If expenses are higher than revenue, the company is 'unprofitable' or 'operating at a loss'."
            },
            {
                "question": "Why do investors care about the 'Bottom Line'?",
                "options": [
                    "It shows how much money the company actually keeps to grow or pay dividends",
                    "It is the biggest number on the page",
                    "It tells you the stock price",
                    "It shows how many employees the company has"
                ],
                "correctIndex": 0,
                "explanation": "The bottom line represents the actual 'wealth' created by the company after all bills are paid."
            }
        ]
    }
]
