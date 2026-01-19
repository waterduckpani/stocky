"use client"

import { TrendingUp, TrendingDown, Newspaper, ExternalLink } from "lucide-react"

interface NewsItem {
    title: string
    publisher: string
    link: string
    time: string
}

interface StepNewsProps {
    symbol: string
    stockData: any
    news?: NewsItem[]
}

export function StepNews({ symbol, stockData, news }: StepNewsProps) {
    // Determine sentiment based on price change
    const isPositive = stockData?.change >= 0
    const sentimentLabel = isPositive ? "Bullish" : "Bearish"

    return (
        <div className="space-y-6 animate-in slide-in-from-right fade-in duration-500">
            {/* Sentiment Card */}
            <div className={`rounded-2xl p-5 border-2 ${isPositive ? 'bg-quaternary/10 border-quaternary/30' : 'bg-destructive/10 border-destructive/30'}`}>
                <div className="flex items-center gap-3 mb-2">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isPositive ? 'bg-quaternary text-white' : 'bg-destructive text-white'}`}>
                        {isPositive ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                    </div>
                    <div>
                        <h2 className="text-lg font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
                            Market Sentiment: <span className={isPositive ? 'text-quaternary' : 'text-destructive'}>{sentimentLabel}</span>
                        </h2>
                        <p className="text-muted-foreground font-medium">How investors are feeling about {symbol}</p>
                    </div>
                </div>



                <div className="mt-3 flex items-center gap-3 text-xs">
                    <div className={`px-3 py-1.5 rounded-full font-bold ${isPositive ? 'bg-quaternary/20 text-quaternary' : 'bg-destructive/20 text-destructive'}`}>
                        {stockData?.change >= 0 ? '+' : ''}{stockData?.change?.toFixed(2)} ({stockData?.changePercent}%)
                    </div>
                    <span className="text-muted-foreground">Today's performance</span>
                </div>
            </div>

            {/* News Feed */}
            <div className="bg-card rounded-3xl p-8 border-2 border-foreground shadow-pop">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-full bg-secondary text-white flex items-center justify-center border-2 border-foreground shadow-sm">
                        <Newspaper className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>Latest Headlines</h3>
                        <p className="text-sm text-muted-foreground font-medium">What's driving the conversation</p>
                    </div>
                </div>

                <div className="grid gap-3">
                    {news && news.length > 0 ? (
                        news.map((item, index) => (
                            <a
                                key={index}
                                href={item.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-muted p-4 rounded-xl border border-foreground/10 hover:border-primary/50 transition-colors cursor-pointer block group"
                            >
                                <div className="flex justify-between items-start gap-3">
                                    <p className="font-bold text-sm line-clamp-2 group-hover:text-primary transition-colors flex-1">
                                        {item.title}
                                    </p>
                                    <ExternalLink className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                                </div>
                                <div className="flex justify-between items-center text-xs text-muted-foreground mt-2">
                                    <span>{item.publisher}</span>
                                    <span>{item.time}</span>
                                </div>
                            </a>
                        ))
                    ) : (
                        <div className="text-center p-6 text-muted-foreground">
                            <Newspaper className="w-8 h-8 mx-auto mb-2 opacity-50" />
                            <p>No recent news available for {symbol}.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
