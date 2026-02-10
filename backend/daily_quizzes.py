"""
Daily Quiz Questions for Stocky Academy.
Each quiz corresponds to a lesson number (1-30).
Structure: {question, options, correctAnswer (index), explanation}
"""
from typing import Optional, Dict

DAILY_QUIZZES = {
    # TIER 1: The Mechanics (Lessons 1-10)
    
    1: {  # The Ticker Symbol
        "question": "What is a Ticker Symbol?",
        "options": [
            "A secret code for brokers",
            "A short, unique ID for a stock",
            "The company's phone number",
            "The price of the stock"
        ],
        "correctAnswer": 1,
        "explanation": "Think of a Ticker like an Airport Code (e.g., LAX). It is a short, unique ID that ensures you arrive at the exact right destination in the market."
    },
    
    2: {  # The Exchange & International Markets
        "question": "What is the main purpose of a Stock Exchange?",
        "options": [
            "To print money",
            "To act as a specialized marketplace for stocks",
            "To set the prices of all products",
            "To lend money to startups"
        ],
        "correctAnswer": 1,
        "explanation": "An Exchange is like a specialized marketplace. Just as you don't buy sneakers at a grocery store, companies pick a specific 'home' like the NYSE or Nasdaq."
    },
    
    3: {  # Price Action (Supply vs. Demand)
        "question": "What happens when 'Demand' is higher than 'Supply'?",
        "options": [
            "The price goes UP",
            "The price goes DOWN",
            "Nothing happens",
            "The market closes"
        ],
        "correctAnswer": 0,
        "explanation": "It's a Tug-of-War! When more people want to buy (Demand) than sell (Supply), the competition drives the price UP."
    },
    
    4: {  # Bull vs. Bear Markets
        "question": "Why is it called a 'Bull' market?",
        "options": [
            "Bulls are slow",
            "Bulls attack by thrusting their horns UP",
            "Bulls are red",
            "It's a random nickname"
        ],
        "correctAnswer": 1,
        "explanation": "Bulls thrust their horns UP (rising prices), while Bears swipe their paws DOWN (falling prices). Optimism drives the Bulls!"
    },
    
    5: {  # Market Cap (Size)
        "question": "How do you calculate a company's Market Cap?",
        "options": [
            "Stock Price + Debt",
            "Stock Price × Total Shares",
            "Yearly Revenue × 2",
            "Total Profit - Costs"
        ],
        "correctAnswer": 1,
        "explanation": "Market Cap is the total 'Price Tag' of a company. It helps you see if you're looking at a massive Mega Cap ship or a tiny Small Cap speedboat."
    },
    
    6: {  # The IPO
        "question": "What does IPO stand for?",
        "options": [
            "International Profit Organization",
            "Initial Public Offering",
            "Immediate Price Option",
            "Internet Protocol Owner"
        ],
        "correctAnswer": 1,
        "explanation": "An IPO is the 'Birth' of a stock—the first day a private company sells shares so anyone can own them."
    },
    
    7: {  # Stock Sectors
        "question": "What is a Stock Sector?",
        "options": [
            "A group of companies in the same industry",
            "The building where stocks are sold",
            "A type of high-speed trading",
            "A government tax group"
        ],
        "correctAnswer": 0,
        "explanation": "Sectors are 'Families' or neighborhoods. Companies in the same sector (like Technology) often react similarly to the same news."
    },
    
    8: {  # Volume (Activity)
        "question": "What does 'Volume' measure?",
        "options": [
            "The total number of shares traded",
            "The company's annual profit",
            "The speed of the website",
            "The number of employees"
        ],
        "correctAnswer": 0,
        "explanation": "Volume is the 'Power of the Crowd.' High volume means the crowd is in strong agreement about a price move."
    },
    
    9: {  # Volatility (Risk)
        "question": "What is Volatility?",
        "options": [
            "The age of the company",
            "The size of the price 'wiggles'",
            "The total number of shares",
            "The amount of debt"
        ],
        "correctAnswer": 1,
        "explanation": "Volatility is the 'Wiggle Factor.' High volatility means big price swings (high risk), while low volatility is a steadier ride."
    },
    
    10: {  # What is a Dividend?
        "question": "What is a Dividend?",
        "options": [
            "A loan to the company",
            "A portion of profit shared with shareholders",
            "A type of stock insurance",
            "A fine for selling early"
        ],
        "correctAnswer": 1,
        "explanation": "Dividends are the 'Payday.' It's like collecting 'Rent' on a property you own without ever having to sell it."
    },
    
    # TIER 2: The Scorecard (Lessons 11-20)
    
    11: {  # Revenue vs. Profit
        "question": "What is another name for 'The Top Line'?",
        "options": [
            "Net Income",
            "Revenue",
            "Taxes",
            "Expenses"
        ],
        "correctAnswer": 1,
        "explanation": "Revenue is the 'Top Line'—the total money that walked through the door before any bills were paid."
    },
    
    12: {  # Earnings Per Share (EPS)
        "question": "What does EPS tell you?",
        "options": [
            "The total value of the company",
            "How much profit belongs to each individual share",
            "The current stock price",
            "The CEO's bonus"
        ],
        "correctAnswer": 1,
        "explanation": "EPS is your 'Slice of the Pie.' It shows the portion of the profit allocated to every single share you own."
    },
    
    13: {  # The P/E Ratio
        "question": "What does the P/E Ratio measure?",
        "options": [
            "Price to Earnings",
            "Profit to Equity",
            "Price to Equity",
            "Profit to Earnings"
        ],
        "correctAnswer": 0,
        "explanation": "P/E is the 'Price Tag' of a company's earnings. It tells you if a stock is 'Cheap' or 'Expensive' relative to its profits."
    },
    
    14: {  # Dividend Yield %
        "question": "What is Dividend Yield?",
        "options": [
            "The total amount of dividends paid",
            "The annual payout shown as a percentage of the stock price",
            "The speed of dividend growth",
            "The tax on a dividend"
        ],
        "correctAnswer": 1,
        "explanation": "Yield tells you the 'Interest' you earn just for holding the share. A 5% yield means you earn $5 for every $100 of stock annually."
    },
    
    15: {  # Beta (Correlation)
        "question": "What does a Beta of 1.0 mean?",
        "options": [
            "The stock is very jumpy",
            "The stock moves exactly like the market",
            "The stock is stable",
            "The stock never moves"
        ],
        "correctAnswer": 1,
        "explanation": "Beta measures the 'Pulse.' 1.0 is the benchmark; higher means more 'wiggle,' lower means calmer than average."
    },
    
    16: {  # Earnings Reports
        "question": "When do most public companies release their 'Report Card'?",
        "options": [
            "Every week",
            "Every quarter (3 months)",
            "Once a decade",
            "Every year only"
        ],
        "correctAnswer": 1,
        "explanation": "These quarterly reports are the 'Scorecards' investors use to see if a company is winning or losing."
    },
    
    17: {  # 52-Week Range
        "question": "What is the 52-Week Range?",
        "options": [
            "The company's holiday schedule",
            "The highest and lowest price over the last year",
            "The time it takes to IPO",
            "The age of the CEO"
        ],
        "correctAnswer": 1,
        "explanation": "This gives 'Historical Context,' helping you see if the current price is a yearly 'sale' or a yearly peak."
    },
    
    18: {  # Liquidity
        "question": "Why does Liquidity matter?",
        "options": [
            "It measures company debt",
            "It tells you how easily you can buy or sell without moving the price",
            "It tracks dividend payouts",
            "It measures the company's cash"
        ],
        "correctAnswer": 1,
        "explanation": "High liquidity means the 'Exit Door' is wide open—you can trade instantly without a struggle."
    },
    
    19: {  # The Float
        "question": "What is the 'Float'?",
        "options": [
            "The amount of cash in the bank",
            "The number of shares actually available to the public to trade",
            "A type of dividend",
            "The company's shipping costs"
        ],
        "correctAnswer": 1,
        "explanation": "Not all shares are available for you! The Float is the 'Playable Supply' currently in the public market."
    },
    
    20: {  # Short Interest
        "question": "What does high Short Interest indicate?",
        "options": [
            "Everyone is buying",
            "Many investors are betting the price will fall",
            "The stock is very safe",
            "Dividends are increasing"
        ],
        "correctAnswer": 1,
        "explanation": "High short interest is a 'Warning Sign'—it means many traders are expecting a 'Bearish' drop."
    },
    
    # TIER 3: The Context (Lessons 21-30)
    
    21: {  # Institutional Ownership
        "question": "Who are the 'Whales' of the market?",
        "options": [
            "Small day traders",
            "Large institutions like banks and pension funds",
            "Company employees",
            "Government regulators"
        ],
        "correctAnswer": 1,
        "explanation": "These 'Whales' own the majority of most stocks. When they move, the entire market feels the waves."
    },
    
    22: {  # Insider Trading
        "question": "When is 'Insider' trading legal?",
        "options": [
            "It never is",
            "When company executives buy/sell and report it to regulators",
            "When it happens on a holiday",
            "If you keep it a secret"
        ],
        "correctAnswer": 1,
        "explanation": "Tracking legal insider trades is a 'Confidence Pulse.' If a CEO is buying more of their own stock, they usually expect good things!"
    },
    
    23: {  # Analyst Ratings
        "question": "What is the goal of an Analyst Rating?",
        "options": [
            "To force people to buy",
            "To provide a professional opinion on a stock's potential",
            "To set the daily price",
            "To manage the company's social media"
        ],
        "correctAnswer": 1,
        "explanation": "Analysts are 'Market Reviewers.' Ratings like 'Buy' or 'Sell' are their professional 'Report Cards' for a company."
    },
    
    24: {  # Support & Resistance
        "question": "What is a 'Resistance' level?",
        "options": [
            "A price 'Floor'",
            "A price 'Ceiling' where selling pressure usually increases",
            "A type of market tax",
            "The current stock price"
        ],
        "correctAnswer": 1,
        "explanation": "Resistance is the 'Ceiling.' It's a level where the price has struggled to break through in the past."
    },
    
    25: {  # Stock Buybacks
        "question": "What is a Stock Buyback?",
        "options": [
            "When you return a stock for a refund",
            "When a company buys its own shares to reduce supply",
            "A type of market crash",
            "When a company IPOs again"
        ],
        "correctAnswer": 1,
        "explanation": "Buybacks are a way companies 'Boost Value.' Fewer shares in the market mean your individual slice becomes more valuable."
    },
    
    26: {  # Share Dilution
        "question": "What happens during Share Dilution?",
        "options": [
            "Your ownership percentage gets smaller",
            "The stock price doubles",
            "You get a free dividend",
            "The company burns cash"
        ],
        "correctAnswer": 0,
        "explanation": "Dilution is the opposite of a buyback. It's when a company issues new shares, making your 'slice of the pie' smaller."
    },
    
    27: {  # Economic Moat
        "question": "What is an Economic Moat?",
        "options": [
            "A literal ditch around a company",
            "A competitive advantage that protects a company from rivals",
            "A type of corporate debt",
            "An international trade deal"
        ],
        "correctAnswer": 1,
        "explanation": "A Moat is a 'Defense System.' It's what makes a company (like Disney or Apple) hard for competitors to beat."
    },
    
    28: {  # The VIX (Fear Index)
        "question": "What does a high VIX reading usually mean?",
        "options": [
            "The market is calm",
            "Expect high volatility and market fear",
            "Interest rates are low",
            "Stock prices are at an all-time high"
        ],
        "correctAnswer": 1,
        "explanation": "The VIX is the 'Weather Report.' A high number means 'Stormy' weather—investors are scared and expect big swings."
    },
    
    29: {  # Sector Rotation
        "question": "What is Sector Rotation?",
        "options": [
            "When a company changes sectors",
            "When money flows from one industry to another",
            "Rotating the stock chart",
            "The earth's rotation affecting stocks"
        ],
        "correctAnswer": 1,
        "explanation": "Rotation is 'Following the Flow.' Big money often moves from 'Hot' sectors to 'Steady' ones depending on the economy."
    },
    
    30: {  # The Fed & Interest Rates
        "question": "How do rising interest rates often affect the stock market?",
        "options": [
            "They make borrowing more expensive and can slow growth",
            "They make all stocks go up",
            "They have no effect",
            "They are only for banks"
        ],
        "correctAnswer": 0,
        "explanation": "The Fed is the 'Ultimate Mover.' Higher rates mean higher costs for companies, which can put a 'brake' on the market's momentum."
    }
}


def get_quiz_for_lesson(lesson_number: int) -> Optional[Dict]:
    """Get the daily quiz for a specific lesson number."""
    return DAILY_QUIZZES.get(lesson_number)


def get_all_quizzes() -> Dict:
    """Get all daily quizzes."""
    return DAILY_QUIZZES
