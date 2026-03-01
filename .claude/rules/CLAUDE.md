# Stocky — Claude Code Project Memory

## What This Project Is
Stocky is a stock market education app. Users search a ticker (e.g., AAPL), and the app
runs them through a "LearningFlow" — a carousel lesson → minigame → quiz — all
contextualised to that specific stock in real time.

## Stack
- **Frontend**: Next.js 14 (App Router), Tailwind CSS, Framer Motion, shadcn/ui, Lucide icons
- **Backend**: FastAPI (Python), yfinance for market data, feedparser for Google News RSS
- **DB**: Supabase (lesson rotation tracking, feedback votes)
- **No active LLM in LearningFlow** — all lesson content is static, from `backend/static_curriculum.py`

## Critical Architecture Rule
`/api/generate/{symbol}` is the ONLY backend endpoint that feeds LearningFlow.
It does the following in order:
1. Fetches live stock data via `yfinance`
2. Calls `smart_selector.select_best_concept()` to pick a lesson from `static_curriculum.py`
3. Injects real `{placeholder}` values (company_name, beta, dividendYield, etc.) into slides + quiz
4. Returns the fully hydrated lesson to the frontend

**The prompts.py / Ollama / LLM path is legacy dead code for the learning flow.
Do NOT touch it, route through it, or reference it for lesson work.**

## Key Files — Know These Cold
| File | Role |
|---|---|
| `backend/static_curriculum.py` | Source of truth for all 18 lesson texts, slides, quizzes, game_config |
| `backend/main.py` | Injects live data into placeholders, serves `/api/generate/{symbol}` |
| `backend/smart_selector.py` | Picks which lesson to show based on stock context + rotation history |
| `frontend/components/ticker/LearningFlow.tsx` | Orchestrates lesson steps: Visual → Concept → Game → Quiz |
| `frontend/components/ticker/steps/StepConcept.tsx` | Renders carousel slides; handles `**bold**` → `<span>` and `{placeholder}` replacement |
| `frontend/components/ticker/QuizSection.tsx` | Renders quiz with answer feedback |
| `frontend/components/games/` | 19 minigame components, one per lesson |

## Placeholder Injection — Two Places
1. **Backend** (`main.py`): Complex placeholders with real data — `{beta}`, `{dividendYield}`,
   `{sharesOutstanding}`, `{floatShares}` — injected in `generate_content()` per `concept_id`.
2. **Frontend** (`StepConcept.tsx`): Simple replacements only — `{company_name}`, `{symbol}`,
   `{dividendYield}` — done via `.replace()` in the `dangerouslySetInnerHTML` block.
   Never rely on frontend replacement for numeric data that needs formatting.

## Icon System
Icons in carousel slides are string keys (e.g., `"TrendingUp"`, `"Scale"`) mapped in
`StepConcept.tsx`'s `ICON_MAP`. **If you add a new icon string to a lesson in
`static_curriculum.py`, you MUST add it to `ICON_MAP` in `StepConcept.tsx` or it falls
back to `Lightbulb`.**

Current ICON_MAP keys: `Target`, `Store`, `Scale`, `Zap`, `Gem`.
All other icons fall back to Lightbulb silently — this is a common bug source.

## Game → LearningFlow Contract
Every game component in `frontend/components/games/` must:
- Accept `onComplete: () => void` as a prop (called when the user finishes the game)
- Accept `ticker` and/or `stockData` when real data is displayed in the game
- Never navigate or redirect — only call `onComplete()`

Games are wired in `LearningFlow.tsx` via a `switch(gameConfig.type)` block.
Adding a new game requires updating BOTH `static_curriculum.py` (game_config.type) AND
the switch block in `LearningFlow.tsx`.

## Design System — Non-Negotiable
See `.claude/skills/ui_design_system.md` for full reference.
Short version:
- Cards: `rounded-3xl border-2 border-foreground shadow-pop`
- Primary button: `py-4 bg-primary text-primary-foreground rounded-xl font-bold shadow-pop hover:translate-y-0.5 hover:shadow-none transition-all`
- Secondary button: `bg-muted hover:bg-muted/80 text-foreground shadow-[0_4px_0_0_rgba(0,0,0,0.2)] hover:translate-y-0.5 hover:shadow-none rounded-xl font-bold`
- Interactive press feel: always use `shadow-pop` + `hover:translate-y-0.5 hover:shadow-none`
- Animations: Framer Motion only, 0.3s–0.5s, never blocking

## Lesson ID Registry (18 active lessons)
| ID | Title | Game Type |
|---|---|---|
| lesson_1_ticker | The Ticker Symbol | ticker_hunt |
| lesson_2_exchange | The Exchange | market_sort |
| lesson_3_supply_demand | Supply & Demand | supply_demand_sandbox |
| lesson_4_sentiment | Bull vs. Bear | trend_spotter |
| lesson_5_market_cap | Market Cap | market_cap_scale |
| lesson_6_ipo | The IPO | ipo_launch_simulator |
| lesson_7_sectors | Stock Sectors | sector_sorter |
| lesson_8_volume | Volume | volume_vault |
| lesson_9_volatility | Volatility | wiggle_tamer |
| lesson_10_dividends | What is a Dividend? | compound_engine |
| lesson_11_revenue_profit | Revenue vs. Profit | profit_punch |
| lesson_12_eps | EPS | eps_slicer |
| lesson_13_pe_ratio | P/E Ratio | valuation_station |
| lesson_14_dividend_yield | Dividend Yield % | yield_magnet |
| lesson_15_beta | Beta | beta_shadow |
| lesson_16_earnings_reports | Earnings Reports | earnings_reaction |
| lesson_17_52_week_range | 52-Week Range | sentiment_zone |
| lesson_18_liquidity | Liquidity | liquidity_exit |
| lesson_19_supply_constraint | The Supply Constraint | supply_squeeze |

## Common Bugs to Watch For
1. **Icon not rendering** — string key missing from `ICON_MAP` in `StepConcept.tsx`
2. **`{placeholder}` showing raw** — forgot to add injection handler in `main.py` for new lesson
3. **Game not appearing** — forgot to add `case "game_type":` in `LearningFlow.tsx` switch block
4. **`UnboundLocalError` in main.py** — always initialise variables like `div_rate = None` before `try/except`
5. **Carousel text hardcoded** — lesson_17 and lesson_9 slide 4 use textbook language; the voice standard is in `.claude/skills/lesson_content_writing.md`
