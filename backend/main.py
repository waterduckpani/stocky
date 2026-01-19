from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import yfinance as yf
from datetime import datetime
import math
import feedparser
from urllib.parse import quote

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Explicitly allow frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def format_large_number(num):
    if num >= 1_000_000_000_000:
        return f"{num / 1_000_000_000_000:.2f}T"
    elif num >= 1_000_000_000:
        return f"{num / 1_000_000_000:.2f}B"
    elif num >= 1_000_000:
        return f"{num / 1_000_000:.2f}M"
    else:
        return str(num)

def fetch_google_news(query: str, limit: int = 3):
    """Fetch news from Google News RSS feed."""
    try:
        encoded_query = quote(f"{query} stock")
        url = f"https://news.google.com/rss/search?q={encoded_query}&hl=en-US&gl=US&ceid=US:en"
        feed = feedparser.parse(url)
        
        news_items = []
        for entry in feed.entries[:limit]:
            # Parse published time
            published = entry.get('published_parsed')
            if published:
                pub_datetime = datetime(*published[:6])
                time_diff = datetime.now() - pub_datetime
                if time_diff.days > 0:
                    time_str = f"{time_diff.days}d ago"
                elif time_diff.seconds >= 3600:
                    time_str = f"{time_diff.seconds // 3600}h ago"
                else:
                    time_str = f"{time_diff.seconds // 60}m ago"
            else:
                time_str = "Recent"
            
            # Extract source from title (Google News format: "Title - Source")
            title = entry.get('title', '')
            source = entry.get('source', {}).get('title', 'News')
            
            news_items.append({
                "title": title,
                "publisher": source,
                "link": entry.get('link', '#'),
                "time": time_str
            })
        
        return news_items
    except Exception as e:
        print(f"Error fetching Google News: {e}")
        return []

@app.get("/api/ticker/{symbol}")
async def get_ticker_data(symbol: str):
    try:
        # Let yfinance handle the session with curl_cffi
        ticker = yf.Ticker(symbol)
        
        # Get basic info
        info = ticker.info
        
        # Get recent history (1mo for the chart)
        history = ticker.history(period="1mo")
        chart_data = []
        for date, row in history.iterrows():
            chart_data.append({
                "date": date.strftime("%b %d"),
                "price": round(row['Close'], 2)
            })

        # Get news from Google News RSS
        company_name = info.get('shortName') or info.get('longName') or symbol
        formatted_news = fetch_google_news(company_name)

        # Construct response
        response = {
            "symbol": symbol.upper(),
            "name": info.get('shortName') or info.get('longName') or symbol.upper(),
            "price": info.get('currentPrice') or info.get('regularMarketPrice') or 0,
            "change": round((info.get('currentPrice', 0) - info.get('previousClose', 0)), 2),
            "changePercent": round(((info.get('currentPrice', 0) - info.get('previousClose', 0)) / info.get('previousClose', 1)) * 100, 2),
            "description": info.get('longBusinessSummary') or "No description available.",
            "sector": info.get('sector') or "Unknown Sector",
            "marketCap": format_large_number(info.get('marketCap', 0)),
            "peRatio": round(info.get('trailingPE', 0), 2) if info.get('trailingPE') else "N/A",
            "chart": chart_data,
            "news": formatted_news
        }
        
        return response

    except Exception as e:
        print(f"Error fetching data for {symbol}: {e}")
        # Valid Mock Fallback for Demo Purposes
        mock_response = {
            "symbol": symbol.upper(),
            "name": f"{symbol.upper()} Corp (Mock)",
            "price": 150.00,
            "change": 2.50,
            "changePercent": 1.67,
            "description": "This is a fallback description because the live data connection failed. In a real production environment, this would handle rate limits gracefully.",
            "sector": "Technology",
            "marketCap": "2.5T",
            "peRatio": 35.5,
            "chart": [
                {"date": "Jan 01", "price": 140},
                {"date": "Jan 08", "price": 145},
                {"date": "Jan 15", "price": 142},
                {"date": "Jan 22", "price": 148},
                {"date": "Jan 29", "price": 150}
            ],
            "news": [
                {"title": "Stock Market Rally Continues", "publisher": "Finance Daily", "link": "#", "time": "2h ago"},
                {"title": "Tech Sector Leads Gains", "publisher": "Market Watch", "link": "#", "time": "4h ago"}
            ]
        }
        return mock_response
        # raise HTTPException(status_code=500, detail=str(e))

# Cache for popular stocks (1 minute TTL)
_popular_cache = {"data": None, "timestamp": None}
POPULAR_SYMBOLS = ["AAPL", "GOOGL", "MSFT", "TSLA", "AMZN", "META", "NVDA"]

@app.get("/api/search")
async def search_stocks(q: str):
    """Search for stocks by name or symbol."""
    if not q or len(q) < 1:
        return {"results": []}
    
    try:
        # Use yfinance search functionality
        import yfinance.screener as screener
        
        # Try direct ticker lookup first
        query = q.upper().strip()
        results = []
        
        # Check if it's a direct symbol match
        try:
            ticker = yf.Ticker(query)
            info = ticker.info
            if info and info.get('shortName'):
                results.append({
                    "symbol": query,
                    "name": info.get('shortName') or info.get('longName', ''),
                    "exchange": info.get('exchange', 'N/A'),
                    "type": info.get('quoteType', 'EQUITY')
                })
        except:
            pass
        
        # If no direct match or query looks like a name, search more broadly
        if len(results) == 0 or not q.isupper():
            # Common company name to ticker mappings
            name_mappings = {
                "apple": "AAPL", "microsoft": "MSFT", "google": "GOOGL",
                "alphabet": "GOOGL", "amazon": "AMZN", "tesla": "TSLA",
                "meta": "META", "facebook": "META", "nvidia": "NVDA",
                "netflix": "NFLX", "disney": "DIS", "walmart": "WMT",
                "coca-cola": "KO", "coca cola": "KO", "coke": "KO",
                "pepsi": "PEP", "pepsico": "PEP", "boeing": "BA",
                "intel": "INTC", "amd": "AMD", "paypal": "PYPL",
                "visa": "V", "mastercard": "MA", "jpmorgan": "JPM",
                "bank of america": "BAC", "wells fargo": "WFC",
                "goldman sachs": "GS", "morgan stanley": "MS"
            }
            
            query_lower = q.lower().strip()
            if query_lower in name_mappings:
                symbol = name_mappings[query_lower]
                try:
                    ticker = yf.Ticker(symbol)
                    info = ticker.info
                    if info and info.get('shortName'):
                        results = [{
                            "symbol": symbol,
                            "name": info.get('shortName') or info.get('longName', ''),
                            "exchange": info.get('exchange', 'N/A'),
                            "type": info.get('quoteType', 'EQUITY')
                        }]
                except:
                    pass
            else:
                # Fuzzy match against our known tickers
                for name, symbol in name_mappings.items():
                    if query_lower in name:
                        try:
                            ticker = yf.Ticker(symbol)
                            info = ticker.info
                            if info and info.get('shortName'):
                                results.append({
                                    "symbol": symbol,
                                    "name": info.get('shortName') or info.get('longName', ''),
                                    "exchange": info.get('exchange', 'N/A'),
                                    "type": info.get('quoteType', 'EQUITY')
                                })
                        except:
                            pass
                        if len(results) >= 5:
                            break
        
        return {"results": results[:5]}
    
    except Exception as e:
        print(f"Search error: {e}")
        return {"results": []}

@app.get("/api/validate/{symbol}")
async def validate_symbol(symbol: str):
    """Check if a ticker symbol is valid."""
    try:
        ticker = yf.Ticker(symbol.upper())
        info = ticker.info
        
        # Check if we got valid data
        if info and (info.get('shortName') or info.get('longName')):
            return {
                "valid": True,
                "symbol": symbol.upper(),
                "name": info.get('shortName') or info.get('longName')
            }
        else:
            return {"valid": False, "symbol": symbol.upper(), "name": None}
    
    except Exception as e:
        print(f"Validation error for {symbol}: {e}")
        return {"valid": False, "symbol": symbol.upper(), "name": None}

@app.get("/api/popular")
async def get_popular_stocks():
    """Get real-time data for popular stocks."""
    import time
    
    # Check cache (1 minute TTL)
    if _popular_cache["data"] and _popular_cache["timestamp"]:
        if time.time() - _popular_cache["timestamp"] < 60:
            return {"stocks": _popular_cache["data"]}
    
    stocks = []
    for symbol in POPULAR_SYMBOLS:
        try:
            ticker = yf.Ticker(symbol)
            info = ticker.info
            
            price = info.get('currentPrice') or info.get('regularMarketPrice') or 0
            prev_close = info.get('previousClose') or price
            change = round(price - prev_close, 2)
            change_pct = round((change / prev_close) * 100, 2) if prev_close else 0
            
            stocks.append({
                "symbol": symbol,
                "name": info.get('shortName') or info.get('longName') or symbol,
                "price": round(price, 2),
                "change": change,
                "changePercent": change_pct
            })
        except Exception as e:
            print(f"Error fetching {symbol}: {e}")
            # Add placeholder for failed fetches
            stocks.append({
                "symbol": symbol,
                "name": symbol,
                "price": 0,
                "change": 0,
                "changePercent": 0
            })
    
    # Update cache
    _popular_cache["data"] = stocks
    _popular_cache["timestamp"] = time.time()
    
    return {"stocks": stocks}

# =============================================================================
# LLM CONTENT GENERATION
# =============================================================================
from ollama_client import generate_text, generate_json, check_connection
from cache import get_cached, set_cached, TTL_BREAKDOWN, TTL_CONCEPT, TTL_QUIZ
from prompts import (
    BREAKDOWN_PROMPT, CONCEPT_PROMPT, QUIZ_PROMPT,
    FALLBACK_BREAKDOWN, FALLBACK_CONCEPT, FALLBACK_QUIZ,
    select_concept
)

@app.get("/api/generate/{symbol}")
async def generate_content(symbol: str):
    """
    Generate LLM-powered educational content for a stock.
    Uses cache to minimize Ollama calls.
    """
    symbol = symbol.upper()
    
    # First, get stock info from yfinance for context
    try:
        ticker = yf.Ticker(symbol)
        info = ticker.info
        company_name = info.get('shortName') or info.get('longName') or symbol
        sector = info.get('sector') or 'Unknown'
        quote_type = info.get('quoteType', 'EQUITY')
        is_crypto = quote_type == 'CRYPTOCURRENCY'
        
        # Price and change data
        price = info.get('currentPrice') or info.get('regularMarketPrice') or 0
        prev_close = info.get('previousClose') or price
        change = price - prev_close if price and prev_close else 0
        change_percent = round((change / prev_close) * 100, 2) if prev_close else 0
        
        # 52-week data for context
        week_52_high = info.get('fiftyTwoWeekHigh') or price
        week_52_low = info.get('fiftyTwoWeekLow') or price
        week_52_range = f"${week_52_low:.2f} - ${week_52_high:.2f}" if week_52_low and week_52_high else "N/A"
        
        # Calculate approximate YTD return
        ytd_return = 0
        try:
            year_start_price = info.get('fiftyTwoWeekLow', price)  # Rough approximation
            if year_start_price and price:
                ytd_return = round(((price - year_start_price) / year_start_price) * 100, 1)
        except:
            pass
        
        market_cap = info.get('marketCap') or 0
        market_cap_str = format_large_number(market_cap) if market_cap else 'N/A'
        
        # Stock data for concept selection
        stock_data = {
            "change_percent": change_percent,
            "market_cap_raw": market_cap,
            "ytd_return": ytd_return,
            "is_crypto": is_crypto
        }
    except Exception as e:
        print(f"Error fetching stock data for {symbol}: {e}")
        company_name = symbol
        sector = "Unknown"
        price = 0
        change_percent = 0
        market_cap_str = 'N/A'
        week_52_range = 'N/A'
        ytd_return = 0
        is_crypto = 'BTC' in symbol or 'ETH' in symbol or 'CRYPTO' in symbol.upper()
        stock_data = {"is_crypto": is_crypto}
    
    # Get news for sentiment display
    news = fetch_google_news(company_name, limit=3)
    
    # Check Ollama connection
    ollama_available = await check_connection()
    
    # === KEY CONCEPT (Deterministic Lesson Trigger Engine with Cooldown) ===
    from lesson_triggers import StockData as LessonStockData, prepare_lesson_prompt, get_lesson_topic
    from prompts import generate_breakdown_prompt
    from supabase_client import get_recent_lessons, record_lesson_view, get_or_create_anonymous_user_id
    
    # Get user ID (demo: anonymous for now)
    user_id = get_or_create_anonymous_user_id()
    
    # Fetch recently viewed lessons for cooldown
    recently_viewed = get_recent_lessons(user_id, limit=10)
    
    # Build StockData for lesson trigger engine
    lesson_stock = LessonStockData(
        symbol=symbol,
        name=company_name,
        price=price,
        change_percent=change_percent,
        pe_ratio=info.get('trailingPE') if 'info' in dir() else None,
        market_cap=market_cap,
        beta=info.get('beta') if 'info' in dir() else None,
        dividend_yield=info.get('dividendYield') if 'info' in dir() else None,
        week_52_high=week_52_high if 'week_52_high' in dir() else None,
        week_52_low=week_52_low if 'week_52_low' in dir() else None
    )
    
    # Get lesson topic deterministically (BEFORE breakdown), respecting cooldown
    lesson_result = prepare_lesson_prompt(lesson_stock, recently_viewed)
    lesson_topic = lesson_result['topic']
    trigger_id = lesson_result['trigger_id']
    
    # Record this lesson view asynchronously (fire and forget)
    record_lesson_view(user_id, trigger_id, symbol)
    
    # === SMART CONTEXT (Market correlation + News) ===
    from smart_context import build_stock_context
    
    # Extract headlines from news for smart context
    news_headlines = [item.get('title', '') for item in news[:2]] if news else []
    
    # Build smart context with market data + news
    smart_context = build_stock_context(change_percent, news_headlines)
    
    # === BREAKDOWN (Structured 3-sentence narrative bridging to topic) ===
    cache_key_breakdown = f"breakdown:{symbol}"
    breakdown = get_cached(cache_key_breakdown)
    
    if not breakdown:
        if ollama_available:
            # Use new structured prompt with smart context
            stock_data_for_prompt = {
                'name': company_name,
                'symbol': symbol,
                'price': price,
                'change_percent': change_percent
            }
            prompt = generate_breakdown_prompt(stock_data_for_prompt, lesson_topic, smart_context)
            breakdown = await generate_text(prompt, max_tokens=150)
        
        if breakdown:
            set_cached(cache_key_breakdown, breakdown, TTL_BREAKDOWN)
        else:
            breakdown = FALLBACK_BREAKDOWN.format(company_name=company_name)
    
    # === KEY CONCEPT (Use already-prepared lesson) ===
    cache_key_concept = f"concept:{symbol}"
    concept_data = get_cached(cache_key_concept)
    
    if not concept_data:
        # lesson_result was already prepared before breakdown
        concept_name = lesson_result['topic']
        trigger_id = lesson_result['trigger_id']
        
        if ollama_available:
            # Use the pre-generated prompt from trigger engine
            concept_explanation = await generate_text(lesson_result['prompt'], max_tokens=120)
        else:
            concept_explanation = f"When looking at {symbol}, the key concept to understand is {concept_name}."
        
        concept_data = {
            "name": concept_name,
            "trigger_id": trigger_id,
            "explanation": concept_explanation or f"Understanding {concept_name} helps you make sense of what you're seeing with {symbol}."
        }
        
        if concept_explanation:
            set_cached(cache_key_concept, concept_data, TTL_CONCEPT)
    
    # === QUIZ (Contextual - based on concept taught) ===
    cache_key_quiz = f"quiz:{symbol}"
    quiz = get_cached(cache_key_quiz)
    
    if not quiz:
        # Get concept name for context
        current_concept = concept_data.get("name", "stock ownership") if isinstance(concept_data, dict) else "stock ownership"
        change_info = f"{change_percent}% {'up' if change_percent >= 0 else 'down'} today"
        
        if ollama_available:
            prompt = QUIZ_PROMPT.format(
                company_name=company_name,
                symbol=symbol,
                concept_name=current_concept,
                change_info=change_info
            )
            quiz = await generate_json(prompt)
        
        if quiz and isinstance(quiz, list) and len(quiz) >= 3:
            set_cached(cache_key_quiz, quiz, TTL_QUIZ)
        else:
            # Use fallback with company-specific values
            quiz = []
            for q in FALLBACK_QUIZ:
                quiz.append({
                    "question": q["question"].format(company_name=company_name, sector=sector),
                    "options": [opt.format(sector=sector) for opt in q["options"]],
                    "correctIndex": q["correctIndex"]
                })
    
    return {
        "symbol": symbol,
        "company_name": company_name,
        "breakdown": breakdown,
        "concept": concept_data,
        "news": news,
        "quiz": quiz,
        "ollama_available": ollama_available
    }

@app.get("/api/health")
async def health_check():
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
