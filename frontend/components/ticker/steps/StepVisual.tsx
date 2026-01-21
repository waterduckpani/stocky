"use client"

import { InteractiveChart } from "../InteractiveChart"
import { ArrowUp, ArrowDown, Activity, BarChart3, TrendingUp, Layers } from "lucide-react"

interface StepVisualProps {
    symbol: string
    stockData: any
}

export function StepVisual({ symbol, stockData }: StepVisualProps) {
    const tech = stockData.technicals || {}

    return (
        <div className="animate-pop-in max-w-5xl mx-auto">
            {/* Unified 'Sticker' Card Container */}
            <div className="bg-card rounded-3xl border-2 border-foreground shadow-pop overflow-hidden flex flex-col">

                {/* Header */}
                <div className="p-4 border-b-2 border-foreground bg-muted/30 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded-xl border-2 border-primary/20">
                            <Activity className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold leading-none mb-1" style={{ fontFamily: 'var(--font-heading)' }}>
                                Price & Analysis
                            </h2>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">
                                30 Days • {symbol}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="bg-white flex-1 flex flex-col">
                    {/* Top: Chart */}
                    <div className="h-[250px] w-full p-2 border-b-2 border-foreground/5 relative">
                        {/* Chart Component */}
                        <InteractiveChart data={stockData.chart} />
                    </div>

                    {/* Bottom: Technical Tiles */}
                    <div className="p-4 bg-muted/10 grid grid-cols-2 lg:grid-cols-4 gap-3">
                        {/* RSI - Violet */}
                        <div className="bg-white p-3 rounded-2xl border-2 border-foreground/10 shadow-sm hover:shadow-md hover:border-accent/40 transition-all duration-300 group">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-[10px] font-bold text-muted-foreground uppercase">RSI (14)</span>
                                <Layers className="w-3.5 h-3.5 text-accent/50 group-hover:text-accent transition-colors" />
                            </div>
                            <div className="text-xl font-black text-foreground mb-1" style={{ fontFamily: 'var(--font-heading)' }}>
                                {tech.rsi?.value || "--"}
                            </div>
                            <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full w-fit border text-foreground ${tech.rsi?.label === "Overbought" ? "bg-secondary/10 border-secondary/30" :
                                tech.rsi?.label === "Oversold" ? "bg-quaternary/10 border-quaternary/30" :
                                    "bg-muted border-foreground/10"
                                }`}>
                                {tech.rsi?.label || "Neutral"}
                            </div>
                        </div>

                        {/* MACD - Pink */}
                        <div className="bg-white p-3 rounded-2xl border-2 border-foreground/10 shadow-sm hover:shadow-md hover:border-secondary/40 transition-all duration-300 group">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-[10px] font-bold text-muted-foreground uppercase">MACD</span>
                                <TrendingUp className="w-3.5 h-3.5 text-secondary/50 group-hover:text-secondary transition-colors" />
                            </div>
                            <div className="text-xl font-black text-foreground mb-1" style={{ fontFamily: 'var(--font-heading)' }}>
                                {tech.macd?.value || "--"}
                            </div>
                            <div className="text-[10px] font-bold flex items-center gap-1 text-foreground">
                                {tech.macd?.signal === "Bullish" ? <ArrowUp className="w-3 h-3 text-quaternary" strokeWidth={3} /> :
                                    tech.macd?.signal === "Bearish" ? <ArrowDown className="w-3 h-3 text-secondary" strokeWidth={3} /> : <Activity className="w-3 h-3 text-muted-foreground" />}
                                {tech.macd?.signal || "Neutral"}
                            </div>
                        </div>

                        {/* MA 50 - Yellow */}
                        <div className="bg-white p-3 rounded-2xl border-2 border-foreground/10 shadow-sm hover:shadow-md hover:border-tertiary/40 transition-all duration-300 group">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-[10px] font-bold text-muted-foreground uppercase">MA (50)</span>
                                <Activity className="w-3.5 h-3.5 text-tertiary/50 group-hover:text-tertiary transition-colors" />
                            </div>
                            <div className="text-xl font-black text-foreground mb-1" style={{ fontFamily: 'var(--font-heading)' }}>
                                {tech.ma50?.value || "--"}
                            </div>
                            <div className={`text-[10px] font-bold px-2 py-0.5 rounded-md w-fit text-foreground ${tech.ma50?.trend === "Above" ? "bg-quaternary/10 border border-quaternary/30" :
                                "bg-secondary/10 border border-secondary/30"
                                }`}>
                                {tech.ma50?.trend === "Above" ? "Price > MA" : "Price < MA"}
                            </div>
                        </div>

                        {/* Volume - Mint */}
                        <div className="bg-white p-3 rounded-2xl border-2 border-foreground/10 shadow-sm hover:shadow-md hover:border-quaternary/40 transition-all duration-300 group">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-[10px] font-bold text-muted-foreground uppercase">Rel Vol</span>
                                <BarChart3 className="w-3.5 h-3.5 text-quaternary/50 group-hover:text-quaternary transition-colors" />
                            </div>
                            <div className="text-xl font-black text-foreground mb-1" style={{ fontFamily: 'var(--font-heading)' }}>
                                {tech.volume?.relative || "1.0x"}
                            </div>
                            <p className="text-[10px] text-muted-foreground truncate">
                                {tech.volume?.value || "--"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
