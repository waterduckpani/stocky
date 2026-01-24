import yfinance as yf
from datetime import datetime, timedelta

symbol = "AAPL"
print(f"Testing {symbol}...")

try:
    ticker = yf.Ticker(symbol)
    meta = ticker.history_metadata
    first_trade_ts = meta.get('firstTradeDate')
    print(f"First Trade TS: {first_trade_ts}")

    if first_trade_ts:
        start_date = datetime.fromtimestamp(first_trade_ts)
        start_str = start_date.strftime('%Y-%m-%d')
        print(f"Start Date: {start_str}")
        
        # Test the failing call
        print("Attempting with max_results=5...")
        try:
            # Note: yfinance might not support max_results in .history()
            ipo_hist = ticker.history(start=start_str, max_results=5)
            print(f"Rows: {len(ipo_hist)}")
        except Exception as e:
            print(f"FAILED with max_results: {e}")

        # Test the FIX (using end date)
        print("Attempting with end date (window)...")
        end_str = (start_date + timedelta(days=7)).strftime('%Y-%m-%d')
        ipo_hist_fix = ticker.history(start=start_str, end=end_str)
        print(f"Rows: {len(ipo_hist_fix)}")
        if not ipo_hist_fix.empty:
            print(f"Price: {ipo_hist_fix.iloc[0]['Close']}")

except Exception as e:
    print(f"Top level error: {e}")
