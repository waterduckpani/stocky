"use client"

import { useState, useEffect, useCallback } from "react"
import { Search, TrendingUp, TrendingDown, Loader2, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { logActivity } from "@/lib/streaks"

interface Stock {
    symbol: string
    name: string
    price?: number
    change?: number
    changePercent?: number
}

interface SearchResult {
    symbol: string
    name: string
    exchange?: string
    type?: string
}

interface StockSearchProps {
    className?: string
    onStockSelect?: (symbol: string) => void
}

export function StockSearch({ className, onStockSelect }: StockSearchProps) {
    const [query, setQuery] = useState("")
    const [isFocused, setIsFocused] = useState(false)
    const [popularStocks, setPopularStocks] = useState<Stock[]>([])
    const [searchResults, setSearchResults] = useState<SearchResult[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isSearching, setIsSearching] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    // Fetch popular stocks when dropdown opens
    useEffect(() => {
        if (isFocused && popularStocks.length === 0) {
            setIsLoading(true)
            fetch("http://localhost:8000/api/popular")
                .then(res => res.json())
                .then(data => {
                    setPopularStocks(data.stocks || [])
                })
                .catch(err => {
                    console.error("Error fetching popular stocks:", err)
                })
                .finally(() => setIsLoading(false))
        }
    }, [isFocused, popularStocks.length])

    // Debounced search
    useEffect(() => {
        if (!query || query.length < 1) {
            setSearchResults([])
            return
        }

        const timer = setTimeout(async () => {
            setIsSearching(true)
            try {
                const res = await fetch(`http://localhost:8000/api/search?q=${encodeURIComponent(query)}`)
                const data = await res.json()
                setSearchResults(data.results || [])
            } catch (err) {
                console.error("Search error:", err)
            } finally {
                setIsSearching(false)
            }
        }, 300) // 300ms debounce

        return () => clearTimeout(timer)
    }, [query])

    const handleSelect = (symbol: string) => {
        // Log activity for streak tracking
        logActivity('search')

        if (onStockSelect) {
            onStockSelect(symbol)
        } else {
            router.push(`/ticker/${symbol}`)
        }
        setQuery("")
        setIsFocused(false)
        setError(null)
    }

    const handleKeyDown = async (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && query.trim()) {
            e.preventDefault()

            // Optimization: If we already have results visible for this query, pick the top one
            if (searchResults.length > 0) {
                handleSelect(searchResults[0].symbol)
                return
            }

            // Otherwise, perform a fresh search to find the best match
            setIsSearching(true)
            setError(null)

            try {
                // Use SEARCH API to find best match instead of strict validation
                const res = await fetch(`http://localhost:8000/api/search?q=${encodeURIComponent(query.trim())}`)
                const data = await res.json()

                if (data.results && data.results.length > 0) {
                    // Smart Select: default to the first (most relevant) result
                    handleSelect(data.results[0].symbol)
                } else {
                    // Fallback: Try strict validation just in case it's a direct valid ticker not in search index
                    const validRes = await fetch(`http://localhost:8000/api/validate/${encodeURIComponent(query.trim())}`)
                    const validData = await validRes.json()

                    if (validData.valid) {
                        handleSelect(validData.symbol)
                    } else {
                        setError("No matching stock found.")
                    }
                }
            } catch (err) {
                setError("Connection error. Please try again.")
            } finally {
                setIsSearching(false)
            }
        }
    }

    // Determine what to show in dropdown
    const displayItems = query.length > 0 ? searchResults : popularStocks

    return (
        <div className={`relative w-full ${className || "max-w-md"}`}>
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" strokeWidth={2.5} />
                <input
                    type="text"
                    placeholder="Search stocks, ETFs, crypto..."
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value)
                        setError(null)
                    }}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                    onKeyDown={handleKeyDown}
                    className={`w-full pl-12 pr-4 h-11 text-sm font-bold bg-card border-2 rounded-full shadow-sm hover:border-primary/50 hover:shadow-pop transition-all outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground/70 ${error ? 'border-destructive' : 'border-foreground/20'}`}
                />
                {isSearching && (
                    <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary animate-spin" />
                )}
            </div>

            {/* Error Message */}
            {error && (
                <div className="absolute top-full left-0 right-0 mt-2 p-3 bg-destructive/10 border-2 border-destructive rounded-xl flex items-center gap-2 text-destructive font-bold text-sm z-50">
                    <AlertCircle className="h-4 w-4" strokeWidth={2.5} />
                    {error}
                </div>
            )}

            {/* Dropdown */}
            {isFocused && !error && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-card border-2 border-foreground rounded-xl shadow-pop overflow-hidden z-50">
                    <div className="p-3 border-b-2 border-foreground/10 bg-muted/50">
                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
                            {query ? "Search Results" : "Popular Stocks"}
                        </span>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                        {isLoading || isSearching ? (
                            <div className="p-4 flex items-center justify-center gap-2 text-muted-foreground">
                                <Loader2 className="h-5 w-5 animate-spin" />
                                <span className="font-medium">Loading...</span>
                            </div>
                        ) : displayItems.length === 0 ? (
                            <div className="p-4 text-center text-muted-foreground font-medium">
                                {query ? "No results found. Press Enter to validate." : "No stocks available"}
                            </div>
                        ) : (
                            displayItems.map((stock) => (
                                <button
                                    key={stock.symbol}
                                    onClick={() => handleSelect(stock.symbol)}
                                    className="w-full flex items-center justify-between p-4 hover:bg-muted transition-colors text-left border-b border-foreground/5 last:border-0"
                                >
                                    <div>
                                        <p className="font-bold text-foreground">{stock.symbol}</p>
                                        <p className="text-sm text-muted-foreground font-medium">{stock.name}</p>
                                    </div>
                                    {/* Show price/change only for popular stocks with price data */}
                                    {'price' in stock && stock.price !== undefined && stock.price > 0 && (
                                        <div className="text-right">
                                            <p className="font-bold text-foreground">${stock.price.toFixed(2)}</p>
                                            {'changePercent' in stock && (
                                                <p className={`text-sm flex items-center gap-1 justify-end font-bold ${(stock.changePercent || 0) >= 0 ? "text-quaternary" : "text-destructive"}`}>
                                                    {(stock.changePercent || 0) >= 0 ? (
                                                        <TrendingUp className="h-3 w-3" strokeWidth={2.5} />
                                                    ) : (
                                                        <TrendingDown className="h-3 w-3" strokeWidth={2.5} />
                                                    )}
                                                    {(stock.changePercent || 0) >= 0 ? "+" : ""}{(stock.changePercent || 0).toFixed(2)}%
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </button>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
