import yfinance as yf

def check(symbol):
    print(f"--- {symbol} ---")
    t = yf.Ticker(symbol)
    try:
        f = t.financials
        if f.empty:
            print("Financials empty")
        else:
            print("Keys:", f.index.tolist()[:10])
            print("Year:", f.columns[0])
            try:
                print("Rev:", f.loc['Total Revenue'].iloc[0])
            except:
                print("No 'Total Revenue'")
            try:
                print("Net:", f.loc['Net Income'].iloc[0])
            except:
                print("No 'Net Income'")
            
            # Check info ttm
            print("Info Rev (TTM):", t.info.get('totalRevenue'))
    except Exception as e:
        print(e)

check("AAPL")
check("BHARTIARTL.NS")
