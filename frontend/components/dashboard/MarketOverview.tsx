"use client"

import { TrendingUp, TrendingDown } from "lucide-react"

const marketData = [
    { symbol: "S&P 500", value: "5,021.84", change: 0.82, trend: "up" },
    { symbol: "NASDAQ", value: "15,838.21", change: 1.24, trend: "up" },
    { symbol: "DOW", value: "38,654.42", change: -0.12, trend: "down" },
    { symbol: "BTC", value: "43,521.00", change: 2.45, trend: "up" },
]

export function MarketOverview() {
    return (
        <div className="flex items-center gap-6 overflow-x-auto pb-2 scrollbar-hide">
            {marketData.map((item) => (
                <div
                    key={item.symbol}
                    className="flex items-center gap-3 flex-shrink-0 px-4 py-2 rounded-xl border-2 border-foreground/10 bg-card/50 hover:border-foreground/30 transition-colors"
                >
                    <div>
                        <p className="text-xs text-muted-foreground font-bold uppercase tracking-wide">{item.symbol}</p>
                        <p className="font-bold text-foreground">{item.value}</p>
                    </div>
                    <div
                        className={`flex items-center gap-1 text-sm font-bold px-2 py-1 rounded-lg ${item.trend === "up"
                                ? "text-quaternary bg-quaternary/10"
                                : "text-destructive bg-destructive/10"
                            }`}
                    >
                        {item.trend === "up" ? (
                            <TrendingUp className="h-4 w-4" strokeWidth={2.5} />
                        ) : (
                            <TrendingDown className="h-4 w-4" strokeWidth={2.5} />
                        )}
                        {item.change >= 0 ? "+" : ""}{item.change}%
                    </div>
                </div>
            ))}
        </div>
    )
}
