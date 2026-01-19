"use client"

import { useState } from "react"
import { Search, TrendingUp, TrendingDown } from "lucide-react"

const popularStocks = [
  { symbol: "AAPL", name: "Apple Inc.", price: 182.52, change: 2.34 },
  { symbol: "GOOGL", name: "Alphabet Inc.", price: 141.80, change: -0.56 },
  { symbol: "MSFT", name: "Microsoft Corp.", price: 378.91, change: 4.12 },
  { symbol: "TSLA", name: "Tesla Inc.", price: 248.42, change: -3.21 },
]

export function StockSearch() {
  const [query, setQuery] = useState("")
  const [isFocused, setIsFocused] = useState(false)

  const filteredStocks = popularStocks.filter(
    (stock) =>
      stock.symbol.toLowerCase().includes(query.toLowerCase()) ||
      stock.name.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" strokeWidth={2.5} />
        <input
          type="text"
          placeholder="Search stocks, ETFs, crypto..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          className="w-full pl-12 pr-4 h-11 text-sm font-medium bg-muted border-2 border-transparent rounded-xl focus:bg-card focus:border-foreground focus:shadow-pop focus:-translate-x-0.5 focus:-translate-y-0.5 transition-all outline-none placeholder:text-muted-foreground"
        />
      </div>

      {isFocused && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border-2 border-foreground rounded-xl shadow-pop overflow-hidden z-50">
          <div className="p-3 border-b-2 border-foreground/10 bg-muted/50">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
              {query ? "Results" : "Popular Stocks"}
            </span>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {filteredStocks.map((stock) => (
              <button
                key={stock.symbol}
                className="w-full flex items-center justify-between p-4 hover:bg-muted transition-colors text-left border-b border-foreground/5 last:border-0"
              >
                <div>
                  <p className="font-bold text-foreground">{stock.symbol}</p>
                  <p className="text-sm text-muted-foreground font-medium">{stock.name}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-foreground">${stock.price.toFixed(2)}</p>
                  <p className={`text-sm flex items-center gap-1 justify-end font-bold ${stock.change >= 0 ? "text-quaternary" : "text-destructive"}`}>
                    {stock.change >= 0 ? (
                      <TrendingUp className="h-3 w-3" strokeWidth={2.5} />
                    ) : (
                      <TrendingDown className="h-3 w-3" strokeWidth={2.5} />
                    )}
                    {stock.change >= 0 ? "+" : ""}{stock.change.toFixed(2)}%
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
