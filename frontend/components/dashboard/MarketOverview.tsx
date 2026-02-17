"use client"

import { TrendingUp, TrendingDown } from "lucide-react"
import { useRouter } from "next/navigation"
import { Stock } from "@/types/stock"

import { Skeleton } from "@/components/ui/skeleton"

interface MarketOverviewProps {
    stocks?: Stock[]
    isLoading?: boolean
}

export function MarketOverview({ stocks, isLoading }: MarketOverviewProps) {
    const router = useRouter()
    // Fallback to empty array if not provided yet (loading)
    const displayStocks = stocks && stocks.length > 0 ? stocks : []

    if (isLoading) {
        return (
            <div className="flex items-center gap-6 overflow-x-auto pb-2 scrollbar-hide">
                {[...Array(6)].map((_, i) => (
                    <div
                        key={i}
                        className="flex items-center gap-3 flex-shrink-0 px-4 py-2 rounded-xl border-2 border-foreground/10 bg-card/50 w-[180px]"
                    >
                        <div className="space-y-1 w-full">
                            <Skeleton className="h-3 w-12" />
                            <Skeleton className="h-5 w-20" />
                        </div>
                        <Skeleton className="h-8 w-16 rounded-lg ml-auto" />
                    </div>
                ))}
            </div>
        )
    }

    return (
        <div className="flex items-center gap-6 overflow-x-auto pb-2 scrollbar-hide">
            {displayStocks.map((item) => (
                <button
                    key={item.symbol}
                    onClick={() => router.push(`/ticker/${item.symbol}`)}
                    className="flex items-center gap-3 flex-shrink-0 px-4 py-2 rounded-xl border-2 border-foreground/10 bg-card/50 hover:border-foreground/30 hover:bg-card transition-all cursor-pointer text-left"
                >
                    <div>
                        <p className="text-xs text-muted-foreground font-bold uppercase tracking-wide">{item.symbol}</p>
                        <p className="font-bold text-foreground">${item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    </div>
                    <div
                        className={`flex items-center gap-1 text-sm font-bold px-2 py-1 rounded-lg ${item.change >= 0
                            ? "text-quaternary bg-quaternary/10"
                            : "text-destructive bg-destructive/10"
                            }`}
                    >
                        {item.change >= 0 ? (
                            <TrendingUp className="h-4 w-4" strokeWidth={2.5} />
                        ) : (
                            <TrendingDown className="h-4 w-4" strokeWidth={2.5} />
                        )}
                        {Math.abs(item.changePercent).toFixed(2)}%
                    </div>
                </button>
            ))}
            {displayStocks.length === 0 && (
                <div className="text-sm text-muted-foreground px-4 py-2">Loading market data...</div>
            )}
        </div>
    )
}
