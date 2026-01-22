import yfinance as yf
import json
import time

def test_connection():
    print("\n📡 INITIATING SINGLE PING TO YAHOO FINANCE...")
    print("------------------------------------------------")
    
    try:
        # 1. Force a fresh connection (no cache)
        ticker = yf.Ticker("AAPL")
        
        # 2. Trigger the network call
        # Note: Just creating the Ticker object doesn't hit the API. 
        # Accessing .info DOES hit the API.
        start_time = time.time()
        info = ticker.info
        end_time = time.time()
        
        # 3. Success Logic
        if "symbol" in info:
            print("✅ SUCCESS: Connection Established!")
            print(f"🔹 Received Data for: {info['symbol']}")
            print(f"🔹 Current Price: ${info.get('currentPrice', 'N/A')}")
            print(f"⏱️ Latency: {round((end_time - start_time) * 1000)}ms")
            print("------------------------------------------------")
            print("👉 CONCLUSION: You are NOT banned. The issue is in your server code.")
        else:
            print("⚠️ WARNING: Connection open, but data is empty.")
            
    except Exception as e:
        # 4. Failure Logic (The Smoking Gun)
        print("❌ CRITICAL FAILURE: Connection Blocked")
        print(f"🛑 Error Details: {str(e)}")
        print("------------------------------------------------")
        
        error_msg = str(e).lower()
        if "429" in error_msg or "too many requests" in error_msg or "jsondecodeerror" in error_msg:
            print("👉 CONCLUSION: CONFIRMED RATE LIMIT 🛑")
            print("Yahoo has blocked your IP. You must wait 1-24 hours.")
        else:
            print("👉 CONCLUSION: Unknown Network Error (Check DNS/Wifi)")

if __name__ == "__main__":
    test_connection()
