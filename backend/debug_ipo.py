import yfinance as yf
from datetime import datetime

symbols = ["AAPL", "MSFT", "GOOGL", "AMZN", "005930.KS", "RELIANCE.NS"]

for symbol in symbols:
    print(f"--- {symbol} ---")
    try:
        ticker = yf.Ticker(symbol)
        # Try metadata
        try:
            meta = ticker.history_metadata
            print(f"Metadata: {meta.get('firstTradeDate', 'N/A')}")
        except:
            print("No Metadata")
            
        # Method 2: History Max
        hist = ticker.history(period="max")
        # This is expensive so we only do it if necessary, but good for price
        hist = ticker.history(period="max")
        if not hist.empty:
            first_row = hist.iloc[0]
            first_date = first_row.name.strftime('%Y-%m-%d')
            first_price = first_row['Close']
            print(f"Hist Date: {first_date}")
            print(f"Hist Price: {first_price}")
        else:
            print("Hist: Empty")
            
    except Exception as e:
        print(f"Error: {e}")
    print("\n")
