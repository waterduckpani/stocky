from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import yfinance as yf
from datetime import datetime, timedelta
import math
import feedparser
from urllib.parse import quote
import httpx
from utils import validate_and_fix_text, format_large_number

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Explicitly allow frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

@app.get("/api/search")
async def search_ticker(q: str):
    """
    Proxies the search query to Yahoo Finance's autocomplete API.
    Returns a list of { symbol, name, exchange, type }.
    """
    url = f"https://query2.finance.yahoo.com/v1/finance/search"
    params = {
        "q": q,
        "quotesCount": 10,
        "newsCount": 0,
        "enableFuzzyQuery": "true",
        "quotesQueryId": "tss_match_phrase_query"
    }
    headers = {"User-Agent": "Mozilla/5.0"}
    
    async with httpx.AsyncClient() as client:
        resp = await client.get(url, params=params, headers=headers)
        data = resp.json()
    
    # Extract clean list
    results = []
    if "quotes" in data:
        for item in data["quotes"]:
            # Filter out non-equity/ETF items if needed
            results.append({
                "symbol": item.get("symbol"),
                "name": item.get("shortname") or item.get("longname"),
                "exchange": item.get("exchange"),
                "type": item.get("quoteType")
            })
    return {"results": results}

@app.get("/api/ticker/{symbol}")
async def get_ticker_data(symbol: str):
    try:
        # Let yfinance handle the session with curl_cffi
        ticker = yf.Ticker(symbol)
        
        # Get basic info
        info = ticker.info
        
        # Currency extraction
        # currency_code = info.get('currency', 'USD')
        # currency_map = {'INR': '₹', 'EUR': '€', 'GBP': '£', 'JPY': '¥', 'USD': '$'}
        # currency_symbol = currency_map.get(currency_code, '$')
        
        # New Dynamic Currency Logic
        from smart_selector import get_currency_config
        currency_config = get_currency_config(symbol)
        currency_symbol = currency_config["symbol"]
        
        # Get recent history (6mo for technicals)
        history = ticker.history(period="6mo")
        chart_data = []
        
        # --- FETCH IPO DATA (Real) ---
        ipo_year = 2000
        ipo_price = 10.0
        try:
            # Optimize: Use metadata to find start date
            meta = ticker.history_metadata
            first_trade_ts = meta.get('firstTradeDate')
            
            if first_trade_ts:
                # Convert timestamp to date string
                start_dt = datetime.fromtimestamp(first_trade_ts)
                start_date = start_dt.strftime('%Y-%m-%d')
                end_date = (start_dt + timedelta(days=10)).strftime('%Y-%m-%d')
                
                # Fetch a small window (10 days) to ensure we get the first candle
                ipo_hist = ticker.history(start=start_date, end=end_date)
                
                if not ipo_hist.empty:
                    first_row = ipo_hist.iloc[0]
                    ipo_price = float(first_row['Close'])
                    ipo_year = int(start_dt.year)
        except Exception as ipo_e:
            print(f"IPO Fetch Error: {ipo_e}")
            
        # === TECHNICAL ANALYSIS CALCULATION ===
        technicals = {
            "rsi": {"value": 50, "label": "Neutral"},
            "macd": {"value": 0.00, "signal": "Neutral"},
            "ma50": {"value": 0, "trend": "Neutral"},
            "volume": {"value": format_large_number(info.get('volume', 0)), "relative": "1.0x Avg"},
            "sentiment": {"score": 50, "label": "Neutral"}
        }

        try:
            if not history.empty:
                # Prepare chart data (last 1mo for display)
                one_month_ago = datetime.now().timestamp() - (30 * 24 * 60 * 60)
                # Filter for chart: roughly last 22 trading days or simple slicing
                recent_hist = history.tail(30) 
                
                for date, row in recent_hist.iterrows():
                    chart_data.append({
                        "date": date.strftime("%b %d"),
                        "price": round(row['Close'], 2)
                    })
                
                closes = history['Close']
                volumes = history['Volume']
                
                # RSI (14)
                delta = closes.diff()
                gain = (delta.where(delta > 0, 0)).rolling(window=14).mean()
                loss = (-delta.where(delta < 0, 0)).rolling(window=14).mean()
                rs = gain / loss
                rs = rs.fillna(0)
                rsi_series = 100 - (100 / (1 + rs))
                rsi_val = rsi_series.iloc[-1] if not rsi_series.empty else 50
                rsi_label = "Overbought" if rsi_val > 70 else ("Oversold" if rsi_val < 30 else "Neutral")
                
                # MA(50)
                ma50_val = closes.rolling(window=50).mean().iloc[-1]
                current_price = closes.iloc[-1]
                ma50_trend = "Above" if current_price > ma50_val else "Below"
                
                # MACD
                ema12 = closes.ewm(span=12, adjust=False).mean()
                ema26 = closes.ewm(span=26, adjust=False).mean()
                macd_line = ema12 - ema26
                signal_line = macd_line.ewm(span=9, adjust=False).mean()
                macd_val = macd_line.iloc[-1]
                signal_val = signal_line.iloc[-1]
                macd_signal = "Bullish" if macd_val > signal_val else "Bearish"

                # Volume Relative (20-day avg)
                avg_vol = volumes.rolling(window=20).mean().iloc[-1]
                curr_vol = volumes.iloc[-1]
                rel_vol = round(curr_vol / avg_vol, 1) if avg_vol and avg_vol > 0 else 1.0
                
                # Sentiment (from Analyst Recommendation or Technicals)
                rec_key = info.get('recommendationKey', 'none').lower()
                sentiment_label = "Neutral"
                sentiment_score = 50
                
                change_percent = round(((info.get('currentPrice', 0) - info.get('previousClose', 0)) / info.get('previousClose', 1)) * 100, 2)

                if rec_key in ['buy', 'strong_buy']:
                    sentiment_label = "Bullish"
                    sentiment_score = 75
                elif rec_key in ['sell', 'underperform']:
                    sentiment_label = "Bearish"
                    sentiment_score = 25
                elif change_percent > 2:
                    sentiment_label = "Bullish"
                    sentiment_score = 70
                elif change_percent < -2:
                    sentiment_label = "Bearish"
                    sentiment_score = 30
                
                technicals = {
                    "rsi": {"value": round(rsi_val, 1), "label": rsi_label},
                    "macd": {"value": round(macd_val, 2), "signal": macd_signal},
                    "ma50": {"value": round(ma50_val, 2), "trend": ma50_trend},
                    "volume": {"value": format_large_number(curr_vol), "relative": f"{rel_vol}x Avg"},
                    "sentiment": {"score": sentiment_score, "label": sentiment_label}
                }
        except Exception as tech_e:
            print(f"Technicals calculation error: {tech_e}")

        # Get news from Google News RSS
        company_name = info.get('shortName') or info.get('longName') or symbol
        formatted_news = fetch_google_news(company_name)

        # Construct response
        response = {
            "symbol": symbol.upper(),
            "name": info.get('shortName') or info.get('longName') or symbol.upper(),
            "currency": currency_symbol,
            "price": info.get('currentPrice') or info.get('regularMarketPrice') or 0,
            "change": round((info.get('currentPrice', 0) - info.get('previousClose', 0)), 2),
            "changePercent": round(((info.get('currentPrice', 0) - info.get('previousClose', 0)) / info.get('previousClose', 1)) * 100, 2),
            "description": info.get('longBusinessSummary') or "No description available.",
            "sector": info.get('sector') or "Unknown Sector",
            "marketCap": format_large_number(info.get('marketCap', 0)),
            "peRatio": round(info.get('trailingPE', 0), 2) if info.get('trailingPE') else "N/A",
            "ipoYear": ipo_year,
            "ipoPrice": ipo_price,
            "chart": chart_data,
            "news": formatted_news,
            "technicals": technicals,
            "currencyConfig": currency_config,
            "revenue": info.get('totalRevenue'),
            "netIncome": info.get('netIncomeToCommon') or info.get('netIncome'),
            "eps": info.get('trailingEps')
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
            ],
            "technicals": {
                "rsi": {"value": 55, "label": "Neutral"},
                "macd": {"value": 0.50, "signal": "Bullish"},
                "ma50": {"value": 145.00, "trend": "Above"},
                "volume": {"value": "10M", "relative": "1.2x Avg"},
                "sentiment": {"score": 60, "label": "Bullish"}
            }
        }
        return mock_response
        # raise HTTPException(status_code=500, detail=str(e))

# Cache for popular stocks (1 minute TTL)
_popular_cache = {"data": None, "timestamp": None}
POPULAR_SYMBOLS = ["AAPL", "GOOGL", "MSFT", "TSLA", "AMZN", "META", "NVDA"]

@app.get("/api/search")
async def search_stocks(q: str):
    """Search for stocks by name or symbol using Yahoo Finance API."""
    if not q or len(q) < 1:
        return {"results": []}
    
    try:
        import requests
        
        # Use Yahoo Finance Typeahead API for robust global search
        url = "https://query2.finance.yahoo.com/v1/finance/search"
        headers = {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }
        params = {
            "q": q,
            "quotesCount": 10,
            "newsCount": 0,
            "enableFuzzyQuery": "false",
            "quotesQueryId": "tss_match_phrase_query" 
        }
        
        response = requests.get(url, headers=headers, params=params, timeout=5)
        data = response.json()
        
        results = []
        if "quotes" in data:
            for item in data["quotes"]:
                # Only include Equities and ETFs to reduce noise
                if item.get("quoteType") in ["EQUITY", "ETF", "MUTUALFUND"]:
                    results.append({
                        "symbol": item.get("symbol"),
                        "name": item.get("shortname") or item.get("longname") or item.get("symbol"),
                        "exchange": item.get("exchange", "N/A"),
                        "type": item.get("quoteType", "EQUITY")
                    })
        
        # Fallback: maintain the popular mapping for very common potential misspellings or common names
        # if the API returns nothing or as a booster
        if not results:
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
                "goldman sachs": "GS", "morgan stanley": "MS",
                "airtel": "BHARTIARTL.NS", "reliance": "RELIANCE.NS",
                "tata motors": "TATAMOTORS.NS", "hdfc": "HDFCBANK.NS",
                "infosys": "INFY.NS", "icici": "ICICIBANK.NS",
                "samsung": "005930.KS", "sony": "SONY", "toyota": "TM"
            }
            q_lower = q.lower().strip()
            if q_lower in name_mappings:
                 import yfinance as yf
                 symbol = name_mappings[q_lower]
                 try:
                    ticker = yf.Ticker(symbol)
                    info = ticker.info
                    results.append({
                        "symbol": symbol,
                        "name": info.get('shortName'),
                        "exchange": info.get('exchange'),
                        "type": "EQUITY"
                    })
                 except:
                     pass

        return {"results": results[:8]}
    
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
from utils import validate_and_fix_text
from smart_selector import get_currency_config
import asyncio

async def generate_text_safe(prompt: str, max_tokens: int = 300) -> str:
    """
    Generate text with retry logic for cutoffs.
    Boosts tokens if cutoff detected (ends without punctuation).
    """
    current_tokens = max_tokens
    for attempt in range(3):
        response = await generate_text(prompt, max_tokens=current_tokens)
        
        # Self-Healing Check
        valid_text = validate_and_fix_text(response)
        if valid_text:
            return valid_text
            
        # If failed, boost tokens and retry
        print(f"Text cutoff detected (Attempt {attempt+1}). Retrying with more tokens...")
        current_tokens += 150
        
    # Force a period if all else fails
    return (response or "") + "."
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
        
        # Currency extraction
        currency_code = info.get('currency', 'USD')
        currency_map = {'INR': '₹', 'EUR': '€', 'GBP': '£', 'JPY': '¥', 'USD': '$'}
        currency_symbol = currency_map.get(currency_code, '$')
        
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
        
        # Try to get market cap from info, then fast_info
        market_cap = info.get('marketCap')
        if not market_cap:
            try:
                market_cap = ticker.fast_info['market_cap']
            except:
                market_cap = 0
        
        market_cap_str = format_large_number(market_cap) if market_cap else 'N/A'
        
        # === TECHNICAL ANALYSIS ===
        technicals = {
            "rsi": {"value": 50, "label": "Neutral"},
            "macd": {"value": 0.00, "signal": "Neutral"},
            "ma50": {"value": round(price, 2), "trend": "Neutral"},
            "volume": {"value": format_large_number(info.get('volume', 0)), "relative": "1.0x Avg"},
            "sentiment": {"score": 50, "label": "Neutral"}
        }
        
        try:
            # Fetch 6 months history for calculations
            hist = ticker.history(period="6mo")
            if not hist.empty:
                closes = hist['Close']
                volumes = hist['Volume']
                
                # RSI (14) - Simple Rolling
                delta = closes.diff()
                gain = (delta.where(delta > 0, 0)).rolling(window=14).mean()
                loss = (-delta.where(delta < 0, 0)).rolling(window=14).mean()
                rs = gain / loss
                # Avoid div by zero
                rs = rs.fillna(0)
                rsi_series = 100 - (100 / (1 + rs))
                rsi_val = rsi_series.iloc[-1] if not rsi_series.empty else 50
                rsi_label = "Overbought" if rsi_val > 70 else ("Oversold" if rsi_val < 30 else "Neutral")
                
                # MA(50)
                ma50_val = closes.rolling(window=50).mean().iloc[-1]
                current_price = closes.iloc[-1]
                ma50_trend = "Above" if current_price > ma50_val else "Below"
                
                # MACD (12, 26, 9)
                ema12 = closes.ewm(span=12, adjust=False).mean()
                ema26 = closes.ewm(span=26, adjust=False).mean()
                macd_line = ema12 - ema26
                signal_line = macd_line.ewm(span=9, adjust=False).mean()
                macd_val = macd_line.iloc[-1]
                signal_val = signal_line.iloc[-1]
                macd_signal = "Bullish" if macd_val > signal_val else "Bearish"

                # Volume Relative (20-day avg)
                avg_vol = volumes.rolling(window=20).mean().iloc[-1]
                curr_vol = volumes.iloc[-1]
                rel_vol = round(curr_vol / avg_vol, 1) if avg_vol and avg_vol > 0 else 1.0
                
                # Sentiment (from Analyst Recommendation or Technicals)
                rec_key = info.get('recommendationKey', 'none').lower()
                sentiment_label = "Neutral"
                sentiment_score = 50
                
                if rec_key in ['buy', 'strong_buy']:
                    sentiment_label = "Bullish"
                    sentiment_score = 75
                elif rec_key in ['sell', 'underperform']:
                    sentiment_label = "Bearish"
                    sentiment_score = 25
                elif change_percent > 2:
                    sentiment_label = "Bullish"
                    sentiment_score = 70
                elif change_percent < -2:
                    sentiment_label = "Bearish"
                    sentiment_score = 30
                
                technicals = {
                    "rsi": {"value": round(rsi_val, 1), "label": rsi_label},
                    "macd": {"value": round(macd_val, 2), "signal": macd_signal},
                    "ma50": {"value": round(ma50_val, 2), "trend": ma50_trend},
                    "volume": {"value": format_large_number(curr_vol), "relative": f"{rel_vol}x Avg"},
                    "sentiment": {"score": sentiment_score, "label": sentiment_label}
                }
        except Exception as e:
            print(f"Error calculating technicals: {e}")
        
        # Get Fiscal Year and Financials
        fiscal_year = "TTM"
        revenue = info.get('totalRevenue')
        net_income = info.get('netIncomeToCommon') or info.get('netIncome')
        
        try:
            financials = ticker.financials
            if not financials.empty:
                # Use the most recent annual report data to match the year label
                last_date = financials.columns[0]
                fiscal_year = str(last_date.year)
                
                # Try to get consistent annual data
                # specific keys might vary slightly, but 'Total Revenue' and 'Net Income' are standard in yfinance
                try:
                    rev_annual = financials.loc['Total Revenue'].iloc[0]
                    # Handle NaN
                    if not pd.isna(rev_annual):
                        revenue = rev_annual
                except:
                    pass
                    
                try:
                    # Try specific net income keys
                    ni_keys = ['Net Income', 'Net Income Common Stock', 'Net Income Applicable To Common Shares']
                    found_ni = False
                    for key in ni_keys:
                        if key in financials.index:
                            val = financials.loc[key].iloc[0]
                            if not pd.isna(val):
                                net_income = val
                                found_ni = True
                                break
                except:
                    pass
        except Exception as e:
            print(f"Error extracting financials: {e}")
        
        # Stock data for concept selection
        stock_data = {
            "change_percent": change_percent,
            "market_cap_raw": market_cap,
            "ytd_return": ytd_return,
            "is_crypto": is_crypto,
            "technicals": technicals,
            "revenue": revenue,
            "netIncome": net_income,
            "currencyCode": info.get('currency', 'USD'),
            "fiscalYear": fiscal_year
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
        
        # Robust Fallback with Technicals
        market_cap = 0
        stock_data = {
            "is_crypto": is_crypto,
            "technicals": {
                "rsi": {"value": 50, "label": "Neutral"},
                "macd": {"value": 0, "signal": "Neutral"},
                "ma50": {"value": 0, "trend": "Neutral"},
                "volume": {"value": "0", "relative": "1.0x Avg"},
                "sentiment": {"score": 50, "label": "Neutral"}
            }
        }
    
    # Get news for sentiment display
    news = fetch_google_news(company_name, limit=3)
    
    # Check Ollama connection
    ollama_available = await check_connection()
    
    # === SMART CONCEPT SELECTOR (30-Concept Library with Anti-Repetition) ===
    from concept_library import StockContext
    from smart_selector import select_best_concept, generate_lesson_prompt
    from supabase_client import get_recent_lessons, record_lesson_view, get_or_create_anonymous_user_id
    
    # Get user ID (demo: anonymous for now)
    user_id = get_or_create_anonymous_user_id()
    
    # Fetch recently viewed concept IDs for rotation
    recently_viewed = get_recent_lessons(user_id, limit=5)
    
    # Build StockContext for smart selector
    stock_context = StockContext(
        symbol=symbol,
        name=company_name,
        price=price,
        change_percent=change_percent,
        volume=info.get('volume', 0) if 'info' in dir() else 0,
        avg_volume=info.get('averageVolume', 0) if 'info' in dir() else 0,
        market_cap=market_cap,
        pe_ratio=info.get('trailingPE') if 'info' in dir() else None,
        dividend_yield=info.get('dividendYield') if 'info' in dir() else None,
        week_52_high=week_52_high if 'week_52_high' in dir() else None,
        week_52_low=week_52_low if 'week_52_low' in dir() else None,
        beta=info.get('beta') if 'info' in dir() else None,
        sector=sector,
        has_news=len(news) > 0 if news else False,
        news_sentiment="neutral"  # TODO: Add sentiment analysis
    )
    
    # Select best concept with rotation (blocks last 5, dampens same category)
    selected_concept, selection_metadata = select_best_concept(stock_context, recently_viewed)
    
    # Check if static lesson (beginner flow)
    is_static = selection_metadata.get("type") == "static"
    
    if is_static:
        lesson_topic = selected_concept["title"]
        concept_id = selected_concept["id"]
        game_config = selected_concept.get("game_config")
    else:
        lesson_topic = selected_concept.name
        concept_id = selected_concept.id
        game_config = None
    
    # Record this concept view for rotation tracking
    record_lesson_view(user_id, concept_id, symbol)
    
    # === SMART CONTEXT (Market correlation + News) ===
    from smart_context import build_stock_context
    
    # Extract headlines from news for smart context
    news_headlines = [item.get('title', '') for item in news[:2]] if news else []
    
    # Build smart context with market data + news
    smart_context = build_stock_context(change_percent, news_headlines)
    
    # === BREAKDOWN ===
    if is_static:
        breakdown = selected_concept.get("breakdown", "Let's start your journey.")
    else:
        from prompts import generate_breakdown_prompt, FALLBACK_BREAKDOWN
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
                prompt = generate_breakdown_prompt(stock_data_for_prompt, lesson_topic, smart_context, currency_symbol)
                breakdown = await generate_text_safe(prompt, max_tokens=300)
            
            if breakdown:
                set_cached(cache_key_breakdown, breakdown, TTL_BREAKDOWN)
            else:
                breakdown = FALLBACK_BREAKDOWN.format(company_name=company_name)
    
    # === KEY CONCEPT ===
    if is_static:
        # Handle Carousel vs Text
        raw_concept = selected_concept["concept"]
        explanation_text = raw_concept.get("explanation", "")
        
        # If carousel, construct text fallback and pass slides
        slides = []
        concept_type = "text"
        
        if raw_concept.get("type") == "carousel":
            concept_type = "carousel"
            slides = raw_concept.get("slides", [])
            # Create fallback explanation from slides
            explanation_text = " ".join([s.get("text", "") for s in slides])

        concept_data = {
            "name": lesson_topic,
            "concept_id": concept_id,
            "category": "fundamentals",
            "explanation": explanation_text,
            "type": concept_type,
            "slides": slides
        }
    else:
        cache_key_concept = f"concept:{symbol}"
        concept_data = get_cached(cache_key_concept)
        
        if not concept_data:
            # Use the concept selected by smart_selector
            concept_name = selected_concept.name
            
            if ollama_available:
                # Generate lesson prompt using selected concept
                lesson_prompt = generate_lesson_prompt(selected_concept, stock_context)
                concept_explanation = await generate_text_safe(lesson_prompt, max_tokens=150)
            else:
                concept_explanation = selected_concept.beginner_explanation
            
            concept_data = {
                "name": concept_name,
                "concept_id": concept_id,
                "category": selected_concept.category.value,
                "explanation": concept_explanation or selected_concept.beginner_explanation
            }
            
            if concept_explanation:
                set_cached(cache_key_concept, concept_data, TTL_CONCEPT)
    
    # === QUIZ ===
    if is_static:
        quiz = selected_concept["quiz"]
    else:
        cache_key_quiz = f"quiz:{symbol}"
        quiz = get_cached(cache_key_quiz)
        
        if not quiz:
            # Get concept name for context
            current_concept = concept_data.get("name", "stock ownership") if isinstance(concept_data, dict) else "stock ownership"
            change_info = f"{change_percent}% {'up' if change_percent >= 0 else 'down'} today"
            
            if ollama_available:
                lesson_text = concept_data.get("explanation", "")
                prompt = QUIZ_PROMPT.format(
                    company_name=company_name,
                    symbol=symbol,
                    concept_name=current_concept,
                    change_info=change_info,
                    lesson_text=lesson_text
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
    
    # === SAVE CONTENT TO DB FOR FEEDBACK ===
    content_id = None
    is_ai_generated = True  # Currently all content is AI-generated
    
    if ollama_available:
        # Save to DB for feedback tracking
        from content_retriever import save_generated_content
        content_id = await save_generated_content(
            concept_id=concept_id,
            stock_symbol=symbol,
            breakdown=breakdown,
            lesson=concept_data.get("explanation", ""),
            quiz=quiz
        )
    
    # Format news for output
    formatted_news = [{"title": item["title"], "link": item["link"]} for item in news] if news else []

    return {
        "symbol": symbol,
        "company_name": company_name,
        "stock_data": stock_data,
        "breakdown": breakdown,
        "news": formatted_news,
        "concept": concept_data,
        "quiz": quiz,
        "content_id": content_id,
        "is_ai_generated": is_ai_generated,
        "game_config": game_config  # New field for interactive lessons
    }

@app.post("/api/feedback")
async def submit_feedback(content_id: str, vote: str, user_id: str = None):
    """
    Submit feedback for AI-generated content.
    
    Args:
        content_id: UUID of the generated content
        vote: 'up' or 'down'
        user_id: Optional user identifier
    
    Returns:
        Success status and new score
    """
    from content_retriever import update_quality_score
    
    if vote not in ["up", "down"]:
        raise HTTPException(status_code=400, detail="Vote must be 'up' or 'down'")
    
    increment = 1 if vote == "up" else -1
    success = await update_quality_score(content_id, increment)
    
    if not success:
        raise HTTPException(status_code=500, detail="Failed to update feedback")
    
    return {"success": True, "vote": vote}

@app.get("/api/health")
async def health_check():
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
