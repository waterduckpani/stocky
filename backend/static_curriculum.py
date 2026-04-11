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
                    "title": "What's in a Name?",
                    "text": "You searched for **{company_name}**, but on the market it doesn't go by that name. It goes by **{symbol}**. That short code is its **ticker symbol** -the only ID that matters when trading.",
                    "icon": "Tag"
                },
                {
                    "title": "The Airport Code",
                    "text": "Think of a **ticker symbol** like an airport code. 'Los Angeles International Airport' is a mouthful, so travelers just say 'LAX'. Short, unique, and impossible to mix up. Same idea.",
                    "icon": "Plane"
                },
                {
                    "title": "How It Works",
                    "text": "Every stock gets a unique code so brokers don't mix up orders. **{symbol}** has no suffix (like '.KS' for Korea), which means it trades right here on the **US market**.",
                    "icon": "Globe"
                },
                {
                    "title": "The Golden Rule",
                    "text": "Company names can look identical: there's a 'First Solar' and a 'First Solar Finance'. Always search by **ticker symbol**. It's the only thing that's guaranteed to be unique.",
                    "icon": "Shield"
                }
            ],
            "sources": [
                {"label": "Investopedia", "url": "https://www.investopedia.com/terms/t/tickersymbol.asp"},
                {"label": "SEC Investor.gov", "url": "https://www.investor.gov/introduction-investing/investing-basics/glossary/ticker-symbol"}
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
                "question": "What is a ticker symbol?",
                "options": [
                    "A short, unique code that identifies a stock on the market",
                    "The stock's live price, updated every second",
                    "The CEO's personal login to Wall Street",
                    "A secret code only brokers are allowed to read"
                ],
                "correctIndex": 0,
                "explanation": "A ticker is just a stock's unique ID, like a username that never changes. Every company on the market has one."
            },
            {
                "question": "Two companies are both named 'Green Energy Solutions Inc.' How do traders avoid buying the wrong one?",
                "options": [
                    "They call the CEO to double-check before buying",
                    "They flip a coin and hope for the best",
                    "They look at each company's unique ticker symbol",
                    "They refuse to trade any company with 'Solutions' in the name"
                ],
                "correctIndex": 2,
                "explanation": "Every company gets a unique ticker, so even if 1,000 companies share a similar name, the ticker code never overlaps. No confusion possible."
            },
            {
                "question": "You want to buy stock in {company_name}. Why search by {symbol} instead of the full company name?",
                "options": [
                    "Because typing the full name crashes the app",
                    "Because {symbol} is the unique code that guarantees you land on the right stock",
                    "Because {company_name} is classified information",
                    "Because brokers only speak in 4-letter codes"
                ],
                "correctIndex": 1,
                "explanation": "{symbol} is the only ID guaranteed to belong to {company_name} and no one else. The full name could match dozens of companies."
            },
            {
                "question": "A stock ticker ends in '.KS'. What does that suffix tell you?",
                "options": [
                    "The company exclusively sells Korean Snacks",
                    "The stock is discounted this week only",
                    "The suffix shows which country's exchange the stock trades on",
                    "It's a Collector's Edition share -extremely rare"
                ],
                "correctIndex": 2,
                "explanation": "Suffixes like '.KS' (Korea), '.NS' (India), and '.L' (London) work like country codes -they tell you exactly which market the stock is listed on."
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
                    "title": "Your Stock's Home",
                    "icon": "Target",
                    "text": "{pivot_text}"  # Dynamically replaced by get_exchange_context()
                },
                {
                    "title": "The Farmers' Market",
                    "icon": "Store",
                    "text": "Think of a stock **exchange** like a farmers' market. Not every farmer goes to every market -they pick one that fits what they sell. Companies do the same: they pick the exchange that fits their identity."
                },
                {
                    "title": "The Two Giants",
                    "icon": "Scale",
                    "text": "The US market has two main exchanges:\n\n🏛️ **NYSE:** Wall Street's oldest floor. Home to traditional giants: Walmart, Coca-Cola.\n\n💻 **Nasdaq:** Built for tech. Amazon, Google, and Apple all live here."
                },
                {
                    "title": "What's a Blue Chip?",
                    "icon": "Gem",
                    "text": "In poker, blue chips are the highest-value. In stocks, a **Blue Chip** is a huge, time-tested company that's survived crashes without folding. Think Coca-Cola, Walmart."
                }
            ],
            "sources": [
                {"label": "Investopedia", "url": "https://www.investopedia.com/terms/s/stock-exchange.asp"},
                {"label": "Khan Academy", "url": "https://www.khanacademy.org/economics-finance-domain/core-finance/stock-and-bonds"}
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
                "question": "What is a stock exchange?",
                "options": [
                    "A marketplace where buyers and sellers trade company shares",
                    "A place where you go to swap foreign currency",
                    "A government office that prints money",
                    "A website where stocks get reviewed by critics"
                ],
                "correctIndex": 0,
                "explanation": "A stock exchange is just a marketplace -like eBay but for company shares. Buyers and sellers meet there to agree on a price."
            },
            {
                "question": "Which exchange would a new AI startup most likely list on?",
                "options": [
                    "NYSE -it's older and more prestigious",
                    "Nasdaq -it's built for tech and innovation",
                    "The local farmers' market, if they can get a booth",
                    "Whichever one has the catchiest jingle"
                ],
                "correctIndex": 1,
                "explanation": "Nasdaq is the go-to for tech companies. It's digital, modern, and attracts innovation -exactly the vibe a startup wants."
            },
            {
                "question": "What would determine which exchange {company_name} picks to list on?",
                "options": [
                    "The CEO's favorite color",
                    "Its size, industry, and identity",
                    "Whichever exchange has the fanciest lobby",
                    "A coin flip between NYSE and Nasdaq"
                ],
                "correctIndex": 1,
                "explanation": "Companies pick their exchange based on what fits their brand and industry. Tech companies lean Nasdaq; historic blue chips prefer NYSE."
            },
            {
                "question": "Why is Coca-Cola called a 'Blue Chip' stock?",
                "options": [
                    "Because their logo used to be blue",
                    "It's a massive, time-tested company that's survived decades of market crashes",
                    "Because it tastes great on a Friday afternoon",
                    "Because the NYSE floor is painted blue"
                ],
                "correctIndex": 1,
                "explanation": "The term 'Blue Chip' comes from poker, where blue chips are the most valuable. In stocks, it means a huge, reliable company that's lasted through many market cycles."
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
                    "text": "Every time **{company_name}**'s price moves, it's a record of a battle. It's a **Tug-of-War** between Buyers who want in and Sellers who want out. Whoever wins that moment moves the price.",
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
            ],
            "sources": [
                {"label": "Investopedia", "url": "https://www.investopedia.com/terms/l/law-of-supply-demand.asp"},
                {"label": "Khan Academy", "url": "https://www.khanacademy.org/economics-finance-domain/core-finance/stock-and-bonds"}
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
                "options": ["High Demand", "Stable Prices", "High Supply", "New Shares"],
                "correctIndex": 2
            },
            {
                "question": "A Green Bar on a chart means:",
                "options": ["Sellers won that minute", "The market is closed", "It's a holiday", "Buyers won that minute"],
                "correctIndex": 3
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
                    "text": "Right now **{company_name}** is swimming in a current. A **Bull Market** is when that current runs upward: prices rising, confidence high, the overall mood is optimism.",
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
            ],
            "sources": [
                {"label": "Investopedia", "url": "https://www.investopedia.com/terms/b/bullmarket.asp"},
                {"label": "Khan Academy", "url": "https://www.khanacademy.org/economics-finance-domain/core-finance/stock-and-bonds"}
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
                "options": ["Bulls are slow", "Bulls are red", "Bulls attack by thrusting their horns UP", "Bulls assume the fetal position"],
                "correctIndex": 2
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
                    "title": "The Real Price Tag 🏷️",
                    "text": "You searched for **{company_name}**. Its share price isn't the full story. The real number (what it'd cost to buy the entire company) is its **Market Cap**. That's what investors actually compare.",
                    "icon": "Target"
                },
                {
                    "title": "The Ocean Liner 🚢",
                    "text": "Think of **{company_name}** as an Ocean Liner -that's what a **Mega Cap** looks like. Massive, stable, hard to sink.\n\nA tiny startup is a speedboat: nimble and fast, but one big wave could flip it.",
                    "icon": "Zap"
                },
                {
                    "title": "The Simple Math ➗",
                    "text": "**Market Cap** = Stock Price × Total Shares.\n\nIf **{company_name}** has 1 billion shares at $100 each, that's a $100 billion company. One formula, the whole picture.",
                    "icon": "Scale"
                },
                {
                    "title": "Don't Judge by Price Alone 💡",
                    "text": "A $1 stock can belong to a trillion-dollar company. Don't be fooled. Always check **Market Cap**, not just share price. That's how you know what you're actually buying into.",
                    "icon": "Gem"
                }
            ],
            "sources": [
                {"label": "Investopedia", "url": "https://www.investopedia.com/terms/m/marketcapitalization.asp"},
                {"label": "SEC Investor.gov", "url": "https://www.investor.gov/introduction-investing/investing-basics/how-stock-markets-work"}
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
                "options": ["Stock Price × Total Shares", "Stock Price + Debt", "Yearly Revenue × 2", "Total Profit - Costs"],
                "correctIndex": 0,
                "explanation": "Market Cap is simply the current Price multiplied by the number of Shares existing."
            },
            {
                "id": "q2",
                "question": "Which stock is generally MORE volatile?",
                "options": ["Mega Cap (Ocean Liner)", "They are the same", "None of the above", "Small Cap (Speedboat)"],
                "correctIndex": 3,
                "explanation": "Small Caps are like speedboats, easier to push around, meaning higher volatility."
            },
            {
                "id": "q3",
                "question": "Why is it generally easier for a tiny startup to double in price than a Mega Cap like {company_name}?",
                "options": ["Startups have better logos", "It takes far less buying power to double a smaller company's value", "Mega Caps aren't allowed to rise more than 50%", "Small companies have worse products and need the boost"],
                "correctIndex": 1,
                "explanation": "To double a $3 trillion company, you need $3 trillion MORE in buying pressure. A $10 million startup only needs $10 million. The math gets extreme fast."
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
                    "text": "Before {company_name} appeared on any watchlist, it had to go public. That moment is called an **IPO (Initial Public Offering)**: when a private company sells shares to the public for the very first time.",
                    "icon": "Target"
                },
                {
                    "title": "The Restaurant Opening 🍽️",
                    "text": "Think of an IPO like a restaurant's opening night. VIP guests (big banks) get first access and lock in the price. That's the **Primary Market**. By the time you walk in, the table may cost twice as much.",
                    "icon": "Store"
                },
                {
                    "title": "Pop and Drop 🎢",
                    "text": "**Volatility** is the IPO's defining trait. With no trading history, {company_name}'s price is driven by pure excitement. 'Pop and Drop' (huge opening gains followed by a crash) is one of the most common patterns.",
                    "icon": "Zap"
                },
                {
                    "title": "The Golden Rule 💡",
                    "text": "Don't get swept up in Day 1 excitement. Smart investors wait for the **Lock-Up Period** to expire. That's when insiders can finally sell, pressure clears, and the real price settles.",
                    "icon": "Gem"
                }
            ],
            "sources": [
                {"label": "Investopedia", "url": "https://www.investopedia.com/terms/i/ipo.asp"},
                {"label": "SEC Investor.gov", "url": "https://www.investor.gov/introduction-investing/investing-basics/investment-products/stocks"}
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
                "options": ["International Profit Organization", "Immediate Price Option", "Initial Public Offering", "Internet Protocol Owner"],
                "correctIndex": 2,
                "explanation": "It stands for Initial Public Offering: the first time shares are offered to the general public."
            },
            {
                "id": "q2",
                "question": "Who usually buys the stock BEFORE it hits the public market?",
                "options": ["Big Banks and Institutions", "You and me", "Government officials", "Nobody — it appears by magic"],
                "correctIndex": 0,
                "explanation": "Institutional investors get 'allocations' at the IPO price. Retail investors (us) usually buy after it hits the exchange, often at a higher price."
            },
            {
                "id": "q3",
                "question": "If {company_name} had its IPO today and the price 'popped' 80% on Day 1, what's the most likely risk?",
                "options": ["It's guaranteed to stay at that level", "A 'Pop and Drop' — excitement fades and price crashes back down", "The government will halt all trading", "The stock permanently delists after Day 1"],
                "correctIndex": 1,
                "explanation": "IPOs fueled by excitement often pop on Day 1 then drop as early investors cash out. No history means no anchor for the price."
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
                    "title": "Your Stock's Family 🏠",
                    "text": "Every stock has a family. {company_name} belongs to the **{sector}** sector, one of 11 official groups the entire market's sorted into. Your stock's sector shapes how it moves.",
                    "icon": "Target"
                },
                {
                    "title": "The Shopping Mall 🛍️",
                    "text": "Think of the market as a shopping mall. **Sectors** are the stores: Tech, Healthcare, Energy and 8 more. When the economy's hot, some stores pack out. When it slows, others barely notice.",
                    "icon": "Store"
                },
                {
                    "title": "Cyclical vs. Defensive ⚖️",
                    "text": "**Cyclical** sectors (Tech, Energy) boom with the economy and crash with it. **Defensive** sectors (Healthcare, Utilities) stay steady. People need medicine and electricity no matter what the market's doing.",
                    "icon": "Scale"
                },
                {
                    "title": "The Golden Rule 💎",
                    "text": "Don't pour everything into one sector. **Diversification** (owning stocks across multiple families) means a Tech crash won't take down your whole portfolio.",
                    "icon": "Gem"
                }
            ],
            "sources": [
                {"label": "Investopedia", "url": "https://www.investopedia.com/terms/s/sector.asp"},
                {"label": "Khan Academy", "url": "https://www.khanacademy.org/economics-finance-domain/core-finance/stock-and-bonds"}
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
                "id": "q1",
                "question": "How many official sectors is the stock market divided into?",
                "options": ["5", "11", "50", "It changes every year"],
                "correctIndex": 1,
                "explanation": "The market is split into exactly 11 official sectors by the Global Industry Classification Standard (GICS): from Technology to Consumer Staples to Utilities."
            },
            {
                "id": "q2",
                "question": "The economy enters a recession. Which type of sector's most likely to hold up?",
                "options": [
                    "Cyclical (Tech, Luxury)",
                    "Defensive (Healthcare, Utilities)",
                    "Whichever one's trending on social media",
                    "All sectors crash equally — no exceptions"
                ],
                "correctIndex": 1,
                "explanation": "Defensive sectors sell things people can't live without: medicine, electricity, food. Demand barely flinches even when the economy slows."
            },
            {
                "id": "q3",
                "question": "If {company_name}'s sector tanks, but you also hold stocks in Healthcare and Utilities, what happens to your overall portfolio?",
                "options": [
                    "It all crashes together",
                    "The other sectors may cushion the blow",
                    "You're legally required to sell everything",
                    "Nothing — sectors never affect each other"
                ],
                "correctIndex": 1,
                "explanation": "That's diversification working as intended. One sector's bad day doesn't have to mean a bad day for your whole portfolio."
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
                    "text": "You searched for {company_name}. While the price tells you where the stock is, **Volume** tells you how many people are actually participating in the trade.",
                    "icon": "Target"
                },
                {
                    "title": "The Stadium Analogy",
                    "text": "Imagine a stadium. If one person yells 'Goal!', it's barely a whisper. If 50,000 people yell it, it's a massive event. High volume means the crowd is in strong agreement.",
                    "icon": "Store"
                },
                {
                    "title": "Volume as Confirmation",
                    "text": "If a stock price moves up on **High Volume**, it's a strong signal of conviction. If it moves up on **Low Volume**, it might be a 'fake-out' because very few people are backing the move.",
                    "icon": "Scale"
                },
                {
                    "title": "The Volume Climax",
                    "text": "A sudden, massive spike in volume often signals the end of a trend. It's the moment everyone has finally 'piled in' or 'panicked out', often leading to a price reversal.",
                    "icon": "Zap"
                }
            ],
            "sources": [
                {"label": "Investopedia", "url": "https://www.investopedia.com/terms/v/volume.asp"},
                {"label": "SEC Investor.gov", "url": "https://www.investor.gov/introduction-investing/investing-basics/how-stock-markets-work"}
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
                "id": "q1",
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
                "id": "q2",
                "question": "If a stock price falls on very high volume, what does it suggest?",
                "options": [
                    "The market is about to close",
                    "Nobody is interested in the stock",
                    "There's strong conviction in the selling pressure",
                    "It's a good time to ignore the chart"
                ],
                "correctIndex": 2,
                "explanation": "High volume during a drop means a large crowd is actively selling, showing the move has strong momentum."
            },
            {
                "id": "q3",
                "question": "You're trying to sell your {company_name} shares but volume today is extremely low. What's the likely problem?",
                "options": [
                    "The price automatically drops to zero",
                    "It can be hard to sell without moving the price yourself",
                    "The government freezes your account",
                    "Low volume means the company is doing great"
                ],
                "correctIndex": 1,
                "explanation": "Low volume means there aren't many buyers. One decent-sized sell order can push the price down, making it hard to exit at a fair price."
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
                    "text": "You searched for **{company_name}**. **Volatility** measures how wildly a stock's price jumps around from day to day. Some stocks barely move. Others are all over the place.",
                    "icon": "Zap"
                },
                {
                    "title": "The Quiet Aisle vs. Black Friday",
                    "text": "Picture a grocery store at 7am: empty, calm, totally predictable. Now picture that same store on Black Friday: packed, chaotic, prices flying. **Low volatility** stocks feel like the quiet morning. **High volatility** stocks feel like Black Friday.",
                    "icon": "Store"
                },
                {
                    "title": "What Makes It Swing?",
                    "text": "Bad earnings, a surprise product launch, or a scandal can shake investor confidence overnight. That burst of fear or excitement is what makes **{company_name}**'s price jump 10% one day and slide 8% the next.",
                    "icon": "Scale"
                },
                {
                    "title": "Beta: The Wiggle Score",
                    "text": "Investors use a number called **Beta** to score a stock's wiggle.\n\nA **Beta above 1.0** means it's jumpier than the average market. A **Beta below 1.0** means it's steadier. Neither is bad. It just depends on how much of a ride you're okay with.",
                    "icon": "Target"
                }
            ],
            "sources": [
                {"label": "Investopedia", "url": "https://www.investopedia.com/terms/v/volatility.asp"},
                {"label": "FINRA", "url": "https://www.finra.org/investors/learn-to-invest/key-investing-concepts/risk-and-return"}
            ]
        },
        "breakdown": "Volatility isn't 'bad', it's just a measure of intensity. Understanding the wiggle helps you choose stocks that match your comfort level.",
        "news": [],
        "game_config": {
            "type": "wiggle_tamer",
            "instruction": "Tap each card to explore how stocks with different Beta scores actually move.",
            "betas": [
                {
                    "category": "low",
                    "label": "Beta < 1",
                    "example": "Electric Utility",
                    "description": "Calmer than the market. Steady, small moves day to day."
                },
                {
                    "category": "market",
                    "label": "Beta ≈ 1",
                    "example": "S&P 500 Index Fund",
                    "description": "Moves in sync with the average market. Neither calm nor wild."
                },
                {
                    "category": "high",
                    "label": "Beta > 1",
                    "example": "AI Startup",
                    "description": "Wilder than the market. Bigger swings in both directions."
                }
            ]
        },
        "quiz": [
            {
                "question": "What does volatility measure?",
                "options": [
                    "How wildly a stock's price swings",
                    "How popular the company is on social media",
                    "How many shares are traded each day",
                    "How old the company is"
                ],
                "correctIndex": 0,
                "explanation": "Volatility tracks how much a stock's price moves up and down day to day. Big swings = high volatility."
            },
            {
                "question": "A startup misses its earnings target and its stock drops 18% in one day. What best describes this?",
                "options": [
                    "A volume collapse",
                    "A market cap reset",
                    "A volatility spike",
                    "A Beta adjustment"
                ],
                "correctIndex": 2,
                "explanation": "A huge price swing triggered by news is a volatility spike. High-volatility stocks react dramatically to events."
            },
            {
                "question": "{company_name} has a Beta of 0.4. What does that tell you?",
                "options": [
                    "It moves more than the average market",
                    "It moves less than the average market",
                    "It's about to crash",
                    "It moves exactly like the market"
                ],
                "correctIndex": 1,
                "explanation": "Beta below 1.0 means calmer than the market. Less swing day-to-day, but typically less explosive upside too."
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
                    "title": "Your Cut of the Profits",
                    "text": "You searched for **{company_name}**. If it earns a profit, it might share a slice of that cash with you as a **Dividend**. It's a payment just for owning the stock.",
                    "icon": "Gem"
                },
                {
                    "title": "The Rental Property",
                    "text": "Think of a dividend stock like a **rental property**. You own it, and it sends you rent every three months. You never have to sell. The cash just shows up.",
                    "icon": "Store"
                },
                {
                    "title": "The Yield Number",
                    "text": "**Dividend Yield** is the annual payout as a percentage of the stock price. A $100 stock that pays $4 a year has a 4% yield. That cash hits your account on a schedule.",
                    "icon": "Scale"
                },
                {
                    "title": "Growth vs. Income",
                    "text": "Not every company pays one. **Tech and growth stocks** tend to reinvest every dollar to expand faster. **Banks, utilities, and consumer brands** usually have spare cash and pay steady dividends.",
                    "icon": "Target"
                }
            ],
            "sources": [
                {"label": "Investopedia", "url": "https://www.investopedia.com/terms/d/dividend.asp"},
                {"label": "SEC Investor.gov", "url": "https://www.investor.gov/introduction-investing/investing-basics/investment-products/stocks"}
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
                "question": "What is a dividend?",
                "options": [
                    "A loan you give to the company",
                    "The fee your broker charges to buy shares",
                    "A slice of company profits paid to shareholders",
                    "The difference between a stock's high and low price"
                ],
                "correctIndex": 2,
                "explanation": "When a company earns more than it spends, it can share some of that profit with shareholders. That payment is the dividend."
            },
            {
                "question": "You invest $1,000 in {company_name}. It has a 4% Dividend Yield. About how much would you receive in dividends over the year?",
                "options": [
                    "$40",
                    "$400",
                    "$4",
                    "$1,040"
                ],
                "correctIndex": 0,
                "explanation": "4% of $1,000 = $40 a year. The yield tells you your annual cash return without ever having to sell a single share."
            },
            {
                "question": "{company_name} pays no dividend and reinvests all its profits. What does that tell you?",
                "options": [
                    "It's breaking the law by withholding payments",
                    "It's about to go bankrupt",
                    "It's too small to afford dividends",
                    "It's focused on growth rather than paying shareholders now"
                ],
                "correctIndex": 3,
                "explanation": "Skipping dividends usually means a company wants to plow cash back into growing faster. Many of the world's biggest tech companies did this for years."
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
                    "text": "**{company_name}**'s **Earnings Per Share (EPS)** is **{eps}** right now. That's how much of the company's profit belongs to a single share. Your slice of the pizza.",
                    "icon": "Gem"
                },
                {
                    "title": "The Formula ➗",
                    "text": "It's simple: **Total Profit** divided by **Total Shares** gives you **EPS**. If profits grow but the number of shares stays the same, every slice gets bigger. That's the goal.",
                    "icon": "Scale"
                },
                {
                    "title": "The Growth Engine 🚀",
                    "text": "When **{company_name}**'s EPS rises quarter after quarter, investors take notice. It's the clearest sign a company is making more profit per share you own.",
                    "icon": "Zap"
                }
            ],
            "sources": [
                {"label": "Investopedia", "url": "https://www.investopedia.com/terms/e/eps.asp"},
                {"label": "SEC Investor.gov", "url": "https://www.investor.gov/introduction-investing/investing-basics/investment-products/stocks"}
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
                    "Every Pizza Slice",
                    "Earnings Per Share",
                    "Extra Profit Source"
                ],
                "correctIndex": 2,
                "explanation": "EPS stands for Earnings Per Share. It tells you how much of the company's total profit belongs to a single share you own."
            },
            {
                "question": "If a company has $100 Profit and 10 Shares, what is the EPS?",
                "options": [
                    "$10",
                    "$1",
                    "$100",
                    "$1000"
                ],
                "correctIndex": 0,
                "explanation": "EPS is Total Profit divided by Total Shares. $100 divided by 10 shares = $10 per share. Simple division!"
            },
            {
                "question": "If {company_name} reports EPS of $5 this year, up from $3 last year, what does that tell you?",
                "options": [
                    "The stock price doubled automatically",
                    "The company is paying less tax",
                    "The company issued a lot more shares",
                    "Each share you own earned more profit this year"
                ],
                "correctIndex": 3,
                "explanation": "Rising EPS means the company squeezed more profit out per share. Going from $3 to $5 EPS is a 67% jump, a strong sign the business is healthier."
            }
        ]
    },
    {
        "id": "lesson_16_earnings_reports",
        "title": "Earnings Reports",
        "concept": {
            "name": "The Quarterly Scorecard",
            "category": "valuation_health",
            "type": "carousel",
            "slides": [
                {
                    "title": "What is an Earnings Report? 📋",
                    "text": "Every 3 months, public companies like **{company_name}** are required by law to file a **10-Q report**. This isn't just news. It's a verified document showing exactly how much money they made and where it went.",
                    "icon": "FileText"
                },
                {
                    "title": "The Three Pillars 🏛️",
                    "text": "Investors track three numbers every quarter: **Revenue** (Total Sales), **Net Income** (Bottom Line Profit), and **EPS** (Earnings per Share). If a company grows all three, it’s usually a strong sign.",
                    "icon": "Columns"
                },
                {
                    "title": "Estimates vs. Actuals ⚖️",
                    "text": "The market doesn’t just care about the numbers. It cares about the **Expectations Gap**. Before the report, analysts publish their estimates. If {symbol} earns $1B but everyone expected $1.2B, it’s a **Miss** and the price will likely fall.",
                    "icon": "Scale"
                },
                {
                    "title": "Guidance: The Forward Look 🔮",
                    "text": "The past is history. Investors care most about **Guidance**, the CEO's official prediction for the next quarter. A 'Beat' on current earnings with 'Lowered Guidance' is one of the most common reasons a stock crashes after a good report.",
                    "icon": "Zap"
                }
            ],
            "sources": [
                {"label": "Investopedia", "url": "https://www.investopedia.com/terms/e/earningsreport.asp"},
                {"label": "SEC Investor.gov", "url": "https://www.investor.gov/introduction-investing/investing-basics/how-read-financial-statements"}
            ]
        },
        "breakdown": "Earnings season is the most volatile time of the year. It's when the truth comes out.",
        "news": [],
        "game_config": {
            "type": "earnings_reaction",
            "instruction": "Read the News Flash. TAP FAST: Buy (Green) for Good News, Sell (Red) for Bad News!"
        },
        "quiz": [
            {
                "question": "What is an Earnings Report?",
                "options": [
                    "A daily email from the CEO",
                    "A secret document for VIPs only",
                    "A list of employee birthdays",
                    "A quarterly public report of profits and losses"
                ],
                "correctIndex": 3,
                "explanation": "Public companies are required by law to report their financial performance every quarter (3 months)."
            },
            {
                "question": "If {company_name} reports a profit, but the stock price DROPS, what likely happened?",
                "options": [
                    "The profit was smaller than 'Expectations' (They Missed)",
                    "The profit was fake",
                    "Optimism is illegal",
                    "Everyone clicked the wrong button"
                ],
                "correctIndex": 0,
                "explanation": "Markets trade on expectations. Even if they made money, if it was LESS than expected, it counts as a failure."
            },
            {
                "question": "{company_name} beats earnings this quarter but lowers its Guidance for next quarter. What should you expect?",
                "options": [
                    "The stock will surge because the beat is all that matters",
                    "Nothing changes — guidance is just an opinion",
                    "The stock may fall despite the beat, because the future outlook weakened",
                    "The company is about to pay a special dividend"
                ],
                "correctIndex": 2,
                "explanation": "Guidance is often more important than current earnings. Investors price in the future, so a weaker forecast can erase a good quarter instantly."
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
                    "title": "Your Stock's Price Tag 🏷️",
                    "text": "**{company_name}**'s **Price-to-Earnings (P/E) Ratio** is **{pe_ratio}** right now.\n\nThat's how much you're paying for every **$1** of its profit. High or low? Let's find out what it means.",
                    "icon": "Tag"
                },
                {
                    "title": "The Money Machine 🖨️",
                    "text": "Think of **{company_name}** as a Money Machine. It earns **$1 a year**. Right now, the market's price for it is **{pe_ratio}**. That's what investors pay for every **$1** of profit. They're betting growth is ahead.",
                    "icon": "Banknote"
                },
                {
                    "title": "High vs. Low ⚖️",
                    "text": "**Low P/E (under 15):** Steady, mature business. Investors aren't expecting fireworks.\n\n**High P/E (over 30):** Investors believe earnings will explode. They're paying now for future profits.",
                    "icon": "Scale"
                },
                {
                    "title": "Compare Right, Not Wrong 🎯",
                    "text": "Don't compare **{company_name}**'s P/E to the whole market. Compare it to rivals in the **same sector**. A P/E of 40 is normal for Tech, but pricey for a supermarket.",
                    "icon": "Target"
                }
            ],
            "sources": [
                {"label": "Investopedia", "url": "https://www.investopedia.com/terms/p/price-earningsratio.asp"},
                {"label": "Khan Academy", "url": "https://www.khanacademy.org/economics-finance-domain/core-finance/stock-and-bonds"}
            ]
        },
        "breakdown": "P/E answers the real question: is this stock's price actually worth it?",
        "news": [],
        "game_config": {
            "type": "valuation_station",
            "instruction": "Which Money Machine is this stock behaving like?",
            "pe_ratio": "{pe_ratio}"
        },
        "quiz": [
            {
                "id": "q1",
                "question": "What does a stock's P/E Ratio measure?",
                "options": ["How much debt the company has", "The company's total annual revenue", "How much you pay per $1 of the company's earnings", "What dividend the stock pays each year"],
                "correctIndex": 2,
                "explanation": "P/E stands for Price-to-Earnings. It's the price investors pay for every $1 of profit the company generates."
            },
            {
                "id": "q2",
                "question": "A stock has a P/E of 90. What does that most likely signal?",
                "options": ["Investors expect its earnings to grow massively", "The stock is very cheap right now", "The company is paying huge dividends", "The CEO owns 90% of the shares"],
                "correctIndex": 0,
                "explanation": "A very high P/E means investors are paying a big premium, usually because they expect the company's profits to grow fast in the future."
            },
            {
                "id": "q3",
                "question": "If {company_name}'s P/E is much higher than a bank stock, what's the most likely reason?",
                "options": ["Banks are just poorly run companies", "It's a glitch in the stock data", "{company_name} pays way more in dividends", "Investors expect {company_name} to grow earnings much faster"],
                "correctIndex": 3,
                "explanation": "Companies expected to grow faster command higher P/E ratios. Investors pay a premium today for profits they expect to collect tomorrow."
            }
        ]
    },

    {
        "id": "lesson_14_dividend_yield",
        "title": "Dividend Yield %",
        "concept": {
            "name": "Your Annual 'Interest'",
            "category": "valuation_health",
            "type": "carousel",
            "slides": [
                {
                    "title": "The Context 🧲",
                    "text": "You searched for **{company_name}**. Its **Dividend Yield** is **{dividendYield}%**. That's the annual cash it pays you just for holding **{symbol}**, straight to your account, every year.",
                    "icon": "Magnet"
                },
                {
                    "title": "The Rental Analogy 🏠",
                    "text": "Think of owning a share like renting out a room. You paid $100 for it. It pays you $5 back every year. No extra work. That's $5 ÷ $100 = your **5% Dividend Yield**.",
                    "icon": "Banknote"
                },
                {
                    "title": "The Inverse Rule ⚖️",
                    "text": "Yield is a seesaw. If the dividend stays the same but the stock price **falls**, the yield goes **UP**! Buying low means you get a better 'interest rate' on your money.",
                    "icon": "Scale"
                }
            ],
            "sources": [
                {"label": "Investopedia", "url": "https://www.investopedia.com/terms/d/dividendyield.asp"},
                {"label": "SEC Investor.gov", "url": "https://www.investor.gov/introduction-investing/investing-basics/investment-products/stocks"}
            ]
        },
        "breakdown": "Dividend Yield turns a stock into an income engine. It helps you compare different companies to see which one pays you the best 'rent'.",
        "game_config": {
            "type": "yield_magnet",
            "instruction": "Slide the price down to see your 'Yield Magnet' grow stronger!",
            "base_dividend": 2.0
        },
        "quiz": [
            {
                "question": "What is a Dividend Yield?",
                "options": [
                    "How much the stock price grew this year",
                    "The fee your broker charges to buy dividend stocks",
                    "The annual cash a stock pays you per dollar you invest",
                    "The company's total profit divided by its debt"
                ],
                "correctIndex": 2,
                "explanation": "Dividend Yield = annual dividend per share divided by stock price. It tells you how much cash you earn each year just for holding the stock."
            },
            {
                "question": "{company_name} pays $4 per share each year. If the stock price falls from $100 to $50, what happens to the yield?",
                "options": [
                    "It drops from 4% to 2% along with the price",
                    "It stays at 4% because the dividend did not change",
                    "The company cancels the dividend automatically",
                    "It rises from 4% to 8% because you are paying less for the same payout"
                ],
                "correctIndex": 3,
                "explanation": "Yield = dividend divided by price. Same $4 dividend, but now you only paid $50 for the stock. $4 divided by $50 = 8%. Lower price, higher yield."
            },
            {
                "question": "{company_name} suddenly shows a yield of 18%. What should you check first?",
                "options": [
                    "Whether the CEO got a big bonus that year",
                    "If the stock price crashed and the dividend might get cut soon",
                    "Nothing. A high yield is obviously great news",
                    "Whether the company sells food or tech products"
                ],
                "correctIndex": 1,
                "explanation": "A very high yield often means the stock price crashed badly. The company may cut the dividend soon too. This is called a Yield Trap and it catches a lot of beginners."
            },
            {
                "question": "Which company is most likely to pay a reliable dividend every quarter?",
                "options": [
                    "A profitable electricity company that has paid dividends for 20 years",
                    "A startup that has never turned a profit",
                    "A crypto exchange that launched last year",
                    "A tech company reinvesting every dollar back into growth"
                ],
                "correctIndex": 0,
                "explanation": "Mature companies with stable, predictable revenue, like utilities, share profits as dividends because they do not need to reinvest everything to keep growing."
            }
        ]
    },
    {
        "id": "lesson_15_beta",
        "title": "Beta (Volatility)",
        "concept": {
            "name": "The Market Shadow",
            "category": "risk_management",
            "type": "carousel",
            "slides": [
                {
                    "title": "The Context 📉",
                    "text": "You searched for **{company_name}**. Its **Beta** ({beta}) measures its sensitivity to the overall market. It tells you if the stock is a 'Market Follower' or an 'Amplifier'.",
                    "icon": "Activity"
                },
                {
                    "title": "The Analogy 🏃",
                    "text": "Think of the Market as a **Lead Runner**.\n\n• **Beta 1.0:** You match its pace exactly.\n• **Beta above 1.5 (Sprinter):** Every market jog, you sprint. Bigger gains, bigger crashes.\n• **Beta below 0.8 (Stroller):** You move slower, on your own schedule.",
                    "icon": "Users"
                },
                {
                    "title": "Risk vs. Reward ⚖️",
                    "text": "**High Beta** (Tech/Growth) amplifies gains but also crashes harder during downturns.\n\n**Low Beta** (Utilities/Consumer Goods) provides safety and stability, often preserving wealth when the market falls.",
                    "icon": "ShieldCheck"
                }
            ],
            "sources": [
                {"label": "Investopedia", "url": "https://www.investopedia.com/terms/b/beta.asp"},
                {"label": "FINRA", "url": "https://www.finra.org/investors/learn-to-invest/key-investing-concepts/risk-and-return"}
            ]
        },
        "breakdown": "Beta is the 'Personality Test' of a stock. It measures how much it wiggles compared to the rest of the market.",
        "news": [],
        "game_config": {
            "type": "beta_shadow",
            "instruction": "Set the Beta Mode to match the Market's moves!",
            "base_beta": 1.0
        },
        "quiz": [
            {
                "question": "What does Beta measure in a stock?",
                "options": [
                    "The company's total debt load",
                    "How much the stock moves compared to the overall market",
                    "The dividend the company pays each quarter",
                    "How profitable the company was last year"
                ],
                "correctIndex": 1,
                "explanation": "Beta measures how much a stock moves when the market moves. A high Beta means it swings more than the market. A low Beta means it barely reacts."
            },
            {
                "question": "The market drops 10%. A stock has a Beta of 2.0. How much does the stock likely drop?",
                "options": [
                    "About 5% — it moves half as much",
                    "About 10% — it moves in sync",
                    "It goes up 10% — Beta means it reverses",
                    "About 20% — it amplifies the market move"
                ],
                "correctIndex": 3,
                "explanation": "Beta 2.0 means the stock moves roughly twice as much as the market. A 10% market drop becomes a 20% drop for this stock."
            },
            {
                "question": "{company_name} has a Beta of {beta}. What does that tell you about investing in it?",
                "options": [
                    "It tells you nothing useful about risk",
                    "It shows how much the company earned last quarter",
                    "It shows whether the stock swings more or less than the broader market",
                    "It confirms the company pays dividends"
                ],
                "correctIndex": 2,
                "explanation": "Beta is your risk preview. A Beta above 1 means {company_name} tends to swing harder than the market. Below 1 means it's calmer."
            },
            {
                "question": "Which type of company typically has a low Beta?",
                "options": [
                    "A steady utility that people rely on regardless of the economy",
                    "A new AI startup chasing rapid growth",
                    "A crypto exchange with daily price swings",
                    "A leveraged fund that amplifies market moves"
                ],
                "correctIndex": 0,
                "explanation": "Utilities are defensive. People pay their electricity bill in recessions too, so the stock price barely budges when markets fall."
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
                    "text": "You searched for **{company_name}**. Its **Revenue** is the total sales that walked in the door. But a big revenue number doesn't mean the company is making money. It's just where the story starts.",
                    "icon": "Zap"
                },
                {
                    "title": "The Analogy 🍋",
                    "text": "Think of a **Lemonade Stand**. You sell 100 cups at $1 each, so your **Revenue** is $100. But lemons, sugar, and cups cost $80, so your **Profit** is just $20. Revenue is what comes in. Profit is what you keep.",
                    "icon": "Store"
                },
                {
                    "title": "The 'Lines' 📏",
                    "text": "Revenue is the **Top Line** because it's the first number on any earnings report. Subtract salaries, rent, and taxes and you reach the **Bottom Line**: Net Profit. That's the number that actually matters.",
                    "icon": "Scale"
                },
                {
                    "title": "The Margin ✂️",
                    "text": "The gap is called the **Profit Margin**. If {company_name} keeps 20 cents of every dollar it earns, that's a 20% margin. A bigger margin means the company runs more efficiently.",
                    "icon": "Target"
                }
            ],
            "sources": [
                {"label": "Investopedia", "url": "https://www.investopedia.com/terms/r/revenue.asp"},
                {"label": "Khan Academy", "url": "https://www.khanacademy.org/economics-finance-domain/core-finance/stock-and-bonds"}
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
                    "Taxes",
                    "CEO Salary",
                    "Revenue"
                ],
                "correctIndex": 3,
                "explanation": "Revenue is always the first number in an earnings report. It's called the Top Line because it literally sits at the top before any costs are taken out."
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
                "explanation": "Profit is Revenue minus Expenses. When costs beat revenue, the company is running at a loss, spending more than it's making."
            },
            {
                "question": "If {company_name} reported $10B in Revenue but spent $9.8B on costs, what does that tell you?",
                "options": [
                    "It's thriving — huge revenue proves it's a winner",
                    "It's definitely going bankrupt",
                    "It's barely profitable — costs nearly erased all the revenue",
                    "Revenue and costs cancel out, so it's fine"
                ],
                "correctIndex": 2,
                "explanation": "Revenue only tells you what came in. When costs eat up $9.8B of a $10B revenue, only $200M in profit remains, a razor-thin 2% margin. Always check the Bottom Line."
            }
        ]
    },
    {
        "id": "lesson_17_52_week_range",
        "title": "52-Week Range",
        "concept": {
            "name": "Measuring Relative Performance",
            "category": "valuation_health",
            "type": "carousel",
            "slides": [
                {
                    "title": "The Yearly Scoreboard 📏",
                    "text": "You searched for **{company_name}**. Think of its **52-Week Range** as a yearly scoreboard. The high is the best it's done, the low is its worst. Right now, you can see exactly where **{symbol}** sits on that scoreboard.",
                    "icon": "Ruler"
                },
                {
                    "title": "The Anchors ⚓",
                    "text": "The 52-week high ({fiftyTwoWeekHigh}) and low ({fiftyTwoWeekLow}) are powerful anchors. When **{symbol}** drops to its low, buyers often rush in expecting a bounce. When it nears the high, some sell to lock in gains.",
                    "icon": "Anchor"
                },
                {
                    "title": "Reading the Position 🚀",
                    "text": "Near the 52-week high? That's strong **Buying Pressure**: the crowd is confident. Near the low? That's **Selling Pressure**: people are exiting. The position on the range tells you which side is winning.",
                    "icon": "Activity"
                },
                {
                    "title": "The Breakout 📈",
                    "text": "When **{symbol}** smashes through its yearly high, that's a **52-Week Breakout**. Every investor who bought in the last year is now in profit. Less pressure to sell means momentum tends to accelerate.",
                    "icon": "TrendingUp"
                }
            ],
            "sources": [
                {"label": "Investopedia", "url": "https://www.investopedia.com/terms/1/52wkhi.asp"},
                {"label": "SEC Investor.gov", "url": "https://www.investor.gov/introduction-investing/investing-basics/how-stock-markets-work"}
            ]
        },
        "breakdown": "The 52-Week Range is your stock's yearly scoreboard. It shows where the price has been so you can see where it stands today.",
        "news": [],
        "game_config": {
            "type": "sentiment_zone",
            "instruction": "Where does {symbol} sit on its 1-year price map? Drag to guess!"
        },
        "quiz": [
            {
                "question": "What is the 52-Week Range used for?",
                "options": [
                    "Showing where a stock has traded over the past year",
                    "Predicting the exact price tomorrow",
                    "Calculating the CEO's bonus",
                    "It has no use"
                ],
                "correctIndex": 0,
                "explanation": "The 52-week high and low are reference points. They show where the stock has been, so you can judge where it stands today."
            },
            {
                "question": "If a stock breaks above its 52-Week High, what does this often signal?",
                "options": [
                    "The company is going bankrupt",
                    "Everyone is selling",
                    "Strong buying pressure with no overhead resistance",
                    "The market is broken"
                ],
                "correctIndex": 2,
                "explanation": "When a stock hits a new 52-week high, every investor who bought in the last year is in profit. No one is desperate to sell, so the price can keep climbing."
            },
            {
                "question": "{company_name} is sitting near its 52-Week Low. What does that usually mean for buyers?",
                "options": [
                    "They will panic and sell immediately",
                    "The 52-week low is meaningless",
                    "It is an automatic guarantee of future gains",
                    "The stock is at a discount and some buyers see a potential bounce"
                ],
                "correctIndex": 3,
                "explanation": "Near the 52-week low, value hunters often step in expecting a bounce. It is not a guarantee, but it is a level where buying pressure tends to increase."
            }
        ]
    }, {
        "id": "lesson_18_liquidity",
        "title": "Liquidity",
        "concept": {
            "name": "The Exit Strategy",
            "category": "market_mechanics",
            "type": "carousel",
            "slides": [
                {
                    "title": "Defining Liquidity 🚪",
                    "text": "Say you buy **{company_name}** and need to sell fast. Can you? **Liquidity** is how quickly you can turn **{symbol}** shares into cash without crashing the price. Some stocks let you exit in seconds. Others trap you for days.",
                    "icon": "LogOut"
                },
                {
                    "title": "The Busy Market 🏪",
                    "text": "Think of a farmers market with hundreds of stalls. You can sell your apples instantly because buyers are everywhere. A stock with **High Volume** works the same: thousands of buyers mean you exit fast at a fair price.",
                    "icon": "Store"
                },
                {
                    "title": "Slippage & Market Impact ⚠️",
                    "text": "Try to dump a big block of a **Low Liquidity** stock and you'll experience **Slippage**. Your own sell order is so large that it pushes the price down as you exit, costing you money in the process.",
                    "icon": "AlertTriangle"
                }
            ],
            "sources": [
                {"label": "Investopedia", "url": "https://www.investopedia.com/terms/l/liquidity.asp"},
                {"label": "FINRA", "url": "https://www.finra.org/investors/learn-to-invest/key-investing-concepts/risk-and-return"}
            ]
        },
        "breakdown": "Liquidity is the hidden cost of trading. It determines if you can leave the room when the building catches fire.",
        "news": [],
        "game_config": {
            "type": "liquidity_exit",
            "instruction": "Drag your position through the Exit Door. Watch out for low liquidity!"
        },
        "quiz": [
            {
                "question": "What does Liquidity measure?",
                "options": [
                    "How much cash a company has",
                    "The amount of water in the CEO's office",
                    "How easily you can sell shares without moving the price",
                    "The stock's dividend yield"
                ],
                "correctIndex": 2,
                "explanation": "Liquidity is about how fast you can convert shares to cash at a fair price. Cash on hand is a balance sheet metric. Completely different thing."
            },
            {
                "question": "What drives high liquidity in a stock?",
                "options": [
                    "Low Trading Volume",
                    "Market Holidays",
                    "Secret Meetings",
                    "High Trading Volume"
                ],
                "correctIndex": 3,
                "explanation": "High volume means lots of buyers and sellers are active. That competition keeps the bid-ask spread tiny, so you can trade instantly at a fair price."
            },
            {
                "question": "You try to sell a big position in {company_name} but the stock has low liquidity. What happens?",
                "options": [
                    "Your order fills instantly at the listed price",
                    "The exchange waives your trade fee",
                    "Your sell order pushes the price down, so you get less than expected",
                    "The CEO personally buys your shares"
                ],
                "correctIndex": 2,
                "explanation": "In a low-liquidity stock, a large sell order overwhelms the available buyers. The price drops as you fill. That's slippage, and it costs you real money."
            }
        ]
    },
    {
        "id": "lesson_19_supply_constraint",
        "title": "The Supply Constraint",
        "concept": {
            "name": "The Supply Constraint",
            "category": "market_mechanics",
            "type": "carousel",
             "slides": [
                {
                    "title": "The Total Universe 🌌",
                    "text": "**{company_name}** has issued **{sharesOutstanding}** shares total. Every ownership slice that exists. But here's the twist: not all of them can actually be bought or sold.",
                    "icon": "Globe"
                },
                {
                    "title": "The Reserved Lot 🅿️",
                    "text": "Think of **{company_name}**'s shares like a parking lot. Most spaces are reserved for insiders: founders, board members, employees. They can't sell. Only the public spaces are left for everyday investors.",
                    "icon": "Lock"
                },
                {
                    "title": "The Public Float 🏊",
                    "text": "For **{company_name}**, only **{floatShares}** shares are in the **Public Float**, the open pool everyday investors can actually buy and sell.",
                    "icon": "Users"
                },
                {
                    "title": "The Squeeze Mechanic 📈",
                    "text": "The ratio between the Float and Total Shares determines price sensitivity. With a **Low Float**, even small demand can cause massive price spikes due to a lack of sellers.",
                    "icon": "TrendingUp"
                }
            ],
            "sources": [
                {"label": "Investopedia", "url": "https://www.investopedia.com/terms/o/outstandingshares.asp"},
                {"label": "SEC Investor.gov", "url": "https://www.investor.gov/introduction-investing/investing-basics/investment-products/stocks"}
            ]
        },
        "breakdown": "Supply and Demand isn't just a theory, it's a mechanical reality. Let's see how restricted supply creates explosive moves.",
        "news": [],
        "game_config": {
            "type": "supply_squeeze",
            "instruction": "Visualize how the 'Float' acts as a bottleneck for price."
        },
        "quiz": [
            {
                "question": "What is the Public Float?",
                "options": [
                    "The number of shares owned by the CEO",
                    "Shares available for trading by the general public",
                    "Money set aside for a rainy day",
                    "A parade float sponsored by the company"
                ],
                "correctIndex": 1,
                "explanation": "The Public Float is only the shares that can actually be traded, not the ones locked up with insiders. It's smaller than the total shares outstanding."
            },
            {
                "question": "If a stock has a very small float, what happens when a lot of buyers show up?",
                "options": [
                    "The price stays flat because supply doesn't matter",
                    "The company automatically creates more shares",
                    "The price spikes sharply because buyers compete for scarce shares",
                    "Trading is halted permanently"
                ],
                "correctIndex": 2,
                "explanation": "With a tiny float, even modest buying pressure overwhelms the available supply. Prices have to rise until enough sellers appear. That's a short squeeze in action."
            },
            {
                "question": "{company_name} has a float of only 5% of its total shares. What does that tell you?",
                "options": [
                    "It is a very safe, stable investment",
                    "The company is about to go bankrupt",
                    "The stock always moves slowly",
                    "95% of shares are locked with insiders and can't be traded"
                ],
                "correctIndex": 3,
                "explanation": "A 5% float means 95% of shares are restricted, held by insiders who can't or won't sell. The tiny tradeable supply makes the price extremely sensitive to any new demand."
            }
        ]
    }
]
