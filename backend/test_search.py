
import requests
import json

def test_search(query):
    url = "https://query2.finance.yahoo.com/v1/finance/search"
    headers = {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
    params = {
        "q": query,
        "quotesCount": 10,
        "newsCount": 0,
        "enableFuzzyQuery": "false",
        "quotesQueryId": "tss_match_phrase_query"
    }
    
    print(f"Searching for: {query}")
    try:
        response = requests.get(url, headers=headers, params=params, timeout=5)
        data = response.json()
        
        print(json.dumps(data, indent=2))
        
        results = []
        if "quotes" in data:
            for item in data["quotes"]:
                if item.get("quoteType") in ["EQUITY", "ETF", "MUTUALFUND"]:
                    results.append({
                        "symbol": item.get("symbol"),
                        "name": item.get("shortname") or item.get("longname") or item.get("symbol"),
                        "exchange": item.get("exchange", "N/A"),
                        "type": item.get("quoteType", "EQUITY"),
                        "score": item.get("score", "N/A")
                    })
        
        print("\nFiltered Results:")
        for r in results:
            print(f"- {r['symbol']} ({r['name']}) [{r['exchange']}]")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_search("airtel")
