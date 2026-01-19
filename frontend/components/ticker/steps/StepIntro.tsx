"use client"

import { Lightbulb, TrendingUp, Info } from "lucide-react"

interface StepIntroProps {
    symbol: string
    stockData: any
    breakdown?: string
}

export function StepIntro({ symbol, stockData, breakdown }: StepIntroProps) {
    // Use LLM breakdown if available, fall back to stock description
    const displayDescription = breakdown || stockData.description

    return (
        <div className="h-full flex flex-col gap-6 animate-in slide-in-from-right fade-in duration-500">

            {/* Top: Header Card (Thinner) */}
            <div className="bg-card rounded-3xl p-6 border-2 border-foreground shadow-pop flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-primary/20 text-primary rounded-full flex items-center justify-center shrink-0">
                        <span className="text-3xl font-black">{symbol[0]}</span>
                    </div>
                    <div>
                        <h1 className="text-3xl font-black flex items-center gap-3" style={{ fontFamily: 'var(--font-heading)' }}>
                            {stockData.name}
                            <span className="text-xl text-muted-foreground font-bold tracking-normal">({symbol})</span>
                        </h1>
                        <p className="text-muted-foreground font-medium">
                            Let's break down exactly what is driving the price today.
                        </p>
                    </div>
                </div>

                <div className="bg-quaternary/10 text-quaternary px-5 py-3 rounded-xl font-bold border-2 border-quaternary/20 flex items-center gap-2 whitespace-nowrap">
                    <TrendingUp className="w-5 h-5" />
                    Market Mood: Bullish
                </div>
            </div>

            {/* Bottom: The Breakdown (Takes most space) */}
            <div className="bg-tertiary/10 rounded-3xl p-10 border-2 border-tertiary/50 relative overflow-hidden flex-1 flex flex-col justify-center text-center md:text-left">
                <div className="absolute top-0 right-0 p-8 opacity-5 md:opacity-10 pointer-events-none">
                    <Info className="w-80 h-80 text-tertiary" />
                </div>

                <div className="relative z-10 max-w-4xl mx-auto md:mx-0">
                    <div className="inline-flex items-center gap-3 mb-6 bg-tertiary/20 px-4 py-2 rounded-full border border-tertiary/20 self-center md:self-start">
                        <Info className="w-5 h-5 text-tertiary-foreground" strokeWidth={2.5} />
                        <span className="text-sm font-bold text-tertiary-foreground uppercase tracking-wider">The Breakdown</span>
                    </div>

                    <h2 className="text-2xl font-bold mb-4 text-foreground leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                        {breakdown ? "What You Need to Know" : "Business Overview"}
                    </h2>

                    <p className="text-lg text-foreground/80 leading-relaxed font-medium line-clamp-6">
                        {displayDescription}
                    </p>
                </div>
            </div>
        </div>
    )
}
