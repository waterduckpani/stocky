# Stocky

A stock market education app that teaches investing concepts through interactive lessons, minigames, and quizzes — all personalised to a real stock in real time.

## How It Works

Search any ticker (e.g. `AAPL`, `TSLA`, `NVDA`) and Stocky runs you through a **LearningFlow**:

1. **Lesson** — A short carousel of slides explaining one market concept (e.g. P/E Ratio, Beta, Dividends), with live data from the stock you searched injected into the content.
2. **Minigame** — A hands-on interactive game that reinforces the concept.
3. **Quiz** — A quick question to test your understanding before moving on.

Stocky picks the most relevant lesson for your stock automatically — a high-volatility stock might teach you about Beta; a dividend-paying stock might teach you about Yield.

## Stack

- **Frontend**: Next.js 14 (App Router), Tailwind CSS, Framer Motion, shadcn/ui
- **Backend**: FastAPI (Python), yfinance for live market data
- **Database**: Supabase (lesson rotation tracking, user feedback)

## Lessons

Stocky currently covers 19 core concepts:

| # | Topic |
|---|---|
| 1 | Ticker Symbols |
| 2 | Stock Exchanges |
| 3 | Supply & Demand |
| 4 | Bull vs. Bear Sentiment |
| 5 | Market Cap |
| 6 | IPOs |
| 7 | Stock Sectors |
| 8 | Volume |
| 9 | Volatility |
| 10 | Dividends |
| 11 | Revenue vs. Profit |
| 12 | EPS (Earnings Per Share) |
| 13 | P/E Ratio |
| 14 | Dividend Yield |
| 15 | Beta |
| 16 | Earnings Reports |
| 17 | 52-Week Range |
| 18 | Liquidity |
| 19 | Supply Constraints |

## Running Locally

**Backend**
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

**Frontend**
```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and search a ticker to start learning.
