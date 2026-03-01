
"use client"

import React, { useState, useEffect } from 'react'
import { Card } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { motion } from "framer-motion"
import { TrendingUp, TrendingDown, ArrowRight } from 'lucide-react'
import { Area, AreaChart, ResponsiveContainer, YAxis, XAxis, Tooltip } from "recharts"
import { MinigameCompletionPopup } from "./MinigameCompletionPopup"

interface SupplyDemandSandboxProps {
    onComplete?: () => void
    symbol?: string
    companyName?: string
    initialPrice?: number
}

export default function SupplyDemandSandbox({
    onComplete,
    symbol = "STOCK",
    companyName = "The Market",
    initialPrice = 150
}: SupplyDemandSandboxProps) {
    const [sliderValue, setSliderValue] = useState(0) // -50 (Supply) to 50 (Demand)
    const [price, setPrice] = useState(initialPrice)
    const [history, setHistory] = useState<{ time: number; price: number }[]>([])
    const [completed, setCompleted] = useState(false)

    // Animation Loop - Slower and smoother
    useEffect(() => {
        const interval = setInterval(() => {
            setPrice(prev => {
                // Determine drift as a PERCENTAGE of the price
                // Max slider (50) = ~1.5% change per tick
                // This ensures visibility on the +/- 15% fixed Y-axis
                const percentChange = (sliderValue / 50) * 0.015
                const drift = prev * percentChange * (Math.random() + 0.5)

                // Noise is also percentage based (0.1% typically)
                const noiseBase = sliderValue === 0 ? 0.0005 : 0.002
                const noise = prev * (Math.random() - 0.5) * noiseBase

                let newPrice = prev + drift + noise

                // Soft Boundaries (relative to start price)
                const minPrice = initialPrice * 0.6
                const maxPrice = initialPrice * 1.4

                if (newPrice < minPrice) newPrice = minPrice + (Math.random() * initialPrice * 0.01)
                if (newPrice > maxPrice) newPrice = maxPrice - (Math.random() * initialPrice * 0.01)

                return newPrice
            })

            setHistory(prev => {
                const newHistory = [...prev, { time: Date.now(), price: price }]
                if (newHistory.length > 60) newHistory.shift() // Broader window (60 points)
                return newHistory
            })

        }, 800) // Slightly faster updates (800ms) but smoother due to fixed axis

        return () => clearInterval(interval)
    }, [sliderValue, price, initialPrice])

    // Theme Colors (from globals.css)
    const COLOR_NEUTRAL = "#3BB273" // Violet
    const COLOR_UP = "#34D399"      // Mint
    const COLOR_DOWN = "#EF4444"    // Red

    const activeColor = sliderValue > 0 ? COLOR_UP : sliderValue < 0 ? COLOR_DOWN : COLOR_NEUTRAL

    // Fixed Domain for Y-Axis
    const yDomain = [initialPrice * 0.85, initialPrice * 1.15] // Fixed +/- 15% range

    return (
        <div className="flex flex-col items-center space-y-3 w-full max-w-4xl mx-auto p-2 animate-pop-in">

            {/* Header */}
            <div className="text-center space-y-1">
                <h3 className="text-xl font-bold flex items-center justify-center gap-2" style={{ fontFamily: 'var(--font-heading)' }}>
                    Manipulate {symbol}
                </h3>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Supply & Demand Sandbox
                </p>
            </div>

            {/* Main Chart Card - Matching 'InteractiveChart' styling */}
            <div className="w-full bg-card rounded-2xl border-2 border-foreground shadow-pop overflow-hidden flex flex-col items-center">

                {/* Chart Header */}
                <div className="w-full px-4 py-2 border-b-2 border-foreground bg-muted/30 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="bg-primary/10 p-1.5 rounded-lg border-2 border-primary/20">
                            <TrendingUp className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                            <div className="text-sm font-bold leading-none mb-0.5 text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>
                                Live Simulation
                            </div>
                            <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-wide">
                                Real-time Market Forces
                            </div>
                        </div>
                    </div>

                    <div className="text-right">
                        <div className="text-lg font-black text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>
                            ${price.toFixed(2)}
                        </div>
                        <div
                            className="text-[10px] font-bold transition-colors duration-300"
                            style={{ color: activeColor }}
                        >
                            {sliderValue > 0 ? "High Demand" : sliderValue < 0 ? "High Supply" : "Stable"}
                        </div>
                    </div>
                </div>

                {/* Chart Area */}
                <div className="w-full h-[220px] bg-white p-2 relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={history} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorPriceDynamic" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={activeColor} stopOpacity={0.2} />
                                    <stop offset="95%" stopColor={activeColor} stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis
                                dataKey="time"
                                hide
                            />
                            <YAxis
                                domain={yDomain}
                                stroke="#94a3b8"
                                fontSize={10}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(val) => `$${val.toFixed(0)}`}
                            />
                            <Area
                                type="monotone"
                                dataKey="price"
                                stroke={activeColor}
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorPriceDynamic)"
                                isAnimationActive={true}
                                animationDuration={1000}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Control Area */}
            <Card className="w-full max-w-2xl px-6 py-4 space-y-4 border-2 border-border/50 bg-white/50 backdrop-blur-sm">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    <span className="flex items-center gap-1 group transition-colors hover:text-red-500">
                        <TrendingDown className="w-3 h-3 transition-transform group-hover:-translate-y-0.5" />
                        Supply (Sell)
                    </span>
                    <span className="opacity-50">Equilibrium</span>
                    <span className="flex items-center gap-1 group transition-colors hover:text-green-500">
                        Demand (Buy)
                        <TrendingUp className="w-3 h-3 transition-transform group-hover:-translate-y-0.5" />
                    </span>
                </div>

                <div className="relative h-8 flex items-center justify-center">
                    <Slider
                        defaultValue={[0]}
                        min={-50}
                        max={50}
                        step={1}
                        value={[sliderValue]}
                        onValueChange={(val) => setSliderValue(val[0])}
                        className="py-2 cursor-grab active:cursor-grabbing"
                    />
                </div>

                <p className="text-[10px] text-center text-muted-foreground font-medium">
                    You control the market forces. See how price reacts.
                </p>
            </Card>

            {/* Manual Continue Button since auto-win is removed */}
            {onComplete && !completed && (
                <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2 }}
                    onClick={() => setCompleted(true)}
                    className="flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-xl font-bold shadow-pop hover:shadow-none hover:translate-y-0.5 transition-all"
                >
                    Finish Simulation <ArrowRight className="w-4 h-4" />
                </motion.button>
            )}

            <MinigameCompletionPopup
                completed={completed}
                onComplete={onComplete || (() => { })}
                title="Market Mover!"
                description="You've seen firsthand how supply and demand dictate price."
            />

        </div>
    )
}

