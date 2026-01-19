import yfinance as yf
import requests

def test_ticker_info():
    print("\n--- Testing Ticker.info ---")
    try:
        msft = yf.Ticker("MSFT")
        # Force a request
        print(f"Name: {msft.info.get('shortName')}")
        print("Success!")
        return True
    except Exception as e:
        print(f"Failed: {e}")
        return False

def test_ticker_history():
    print("\n--- Testing Ticker.history (1mo) ---")
    try:
        msft = yf.Ticker("MSFT")
        hist = msft.history(period="1mo")
        if not hist.empty:
            print(f"History fetched: {len(hist)} rows")
            print(hist.head(2))
            print("Success!")
            return True
        else:
            print("Failed: Empty history")
            return False
    except Exception as e:
        print(f"Failed: {e}")
        return False

def test_download():
    print("\n--- Testing yf.download (Legacy) ---")
    try:
        data = yf.download("MSFT", period="1mo", progress=False)
        if not data.empty:
            print(f"Download fetched: {len(data)} rows")
            print(data.head(2))
            print("Success!")
            return True
        else:
            print("Failed: Empty data")
            return False
    except Exception as e:
        print(f"Failed: {e}")
        return False

def test_custom_session():
    print("\n--- Testing Custom Session ---")
    try:
        session = requests.Session()
        session.headers.update({
             "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        })
        msft = yf.Ticker("MSFT", session=session)
        print(f"Name: {msft.info.get('shortName')}")
        print("Success!")
        return True
    except Exception as e:
        print(f"Failed: {e}")
        return False

if __name__ == "__main__":
    t1 = test_ticker_info()
    t2 = test_ticker_history()
    t3 = test_download()
    t4 = test_custom_session()
    
    print("\nSummary:")
    print(f"Ticker.info: {t1}")
    print(f"Ticker.history: {t2}")
    print(f"yf.download: {t3}")
    print(f"Custom Session: {t4}")
