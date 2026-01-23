"use client"

import React, { useState, useEffect, useRef } from 'react'
import { Card } from "@/components/ui/card"
import { motion, AnimatePresence } from "framer-motion"
import { TrendingUp, TrendingDown, ArrowRight, Activity, Skull } from 'lucide-react'
import { Area, AreaChart, ResponsiveContainer, YAxis } from "recharts"
import { cn } from "@/lib/utils"

interface SentimentNavigatorProps {
    onComplete?: () => void
    instruction?: string
}

type MarketMode = 'bull' | 'bear'

export function SentimentNavigator({
    onComplete,
    instruction = "Identify the Trendline"
}: SentimentNavigatorProps) {
    const [mode, setMode] = useState<MarketMode>('bull')
    const [data, setData] = useState<{ i: number; value: number }[]>([])
    const [progress, setProgress] = useState(0) // 0 to 100

    // Animation refs
    const requestRef = useRef<number | null>(null)
    const startTimeRef = useRef<number | null>(null)
    const dataRef = useRef<{ i: number; value: number }[]>([])

    // Constants
    const WINDOW_SIZE = 80

    // Initialize Data
    useEffect(() => {
        // Start with some flat data
        const initialData = []
        let val = 100
        for (let i = 0; i < WINDOW_SIZE; i++) {
            val += (Math.random() - 0.5) * 2 // Small noise
            initialData.push({ i, value: val })
        }
        dataRef.current = initialData
        setData(initialData)
    }, [])

    // Game Loop
    useEffect(() => {
        const animate = (time: number) => {
            if (!startTimeRef.current) startTimeRef.current = time
            // const deltaTime = time - startTimeRef.current

            // Update Logic (Run every frame for smoothness)
            const currentData = dataRef.current
            const lastVal = currentData[currentData.length - 1].value

            // Core Physics
            // Bull: Trend UP (+0.3), Volatility Low
            // Bear: Trend DOWN (-0.5), Volatility High (Fear)

            let trend = 0
            let volatility = 0

            if (mode === 'bull') {
                trend = 0.2 + (Math.sin(time * 0.002) * 0.1) // Wavy upward
                volatility = 1.5
            } else {
                trend = -0.3 + (Math.sin(time * 0.005) * 0.2) // Erratic downward
                volatility = 3.5 // Fear causes spikes
            }

            const noise = (Math.random() - 0.5) * volatility
            let newVal = lastVal + trend + noise

            // Prevent going to 0
            if (newVal < 10) newVal = 10

            const newData = [...currentData.slice(1), { i: currentData[currentData.length - 1].i + 1, value: newVal }]
            dataRef.current = newData
            setData(newData)

            requestRef.current = requestAnimationFrame(animate)
        }

        requestRef.current = requestAnimationFrame(animate)
        return () => cancelAnimationFrame(requestRef.current!)
    }, [mode])

    const isBull = mode === 'bull'

    return (
        <div className="flex flex-col items-center space-y-4 w-full max-w-4xl mx-auto p-2 animate-pop-in">
            {/* Header */}
            <div className="text-center space-y-1">
                <h3 className="text-xl font-bold flex items-center justify-center gap-2" style={{ fontFamily: 'var(--font-heading)' }}>
                    Sentiment Navigator
                </h3>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    {instruction}
                </p>
            </div>

            {/* TV Frame */}
            <div className="w-full bg-card rounded-2xl border-4 border-foreground shadow-pop overflow-hidden flex flex-col items-center relative transition-colors duration-500">

                {/* Screen Header */}
                <div className="w-full px-4 py-3 border-b-2 border-foreground bg-muted/30 flex justify-between items-center z-10 relative">
                    <div className="flex items-center gap-2">
                        <div className={cn(
                            "p-1.5 rounded-lg border-2 transition-colors duration-300",
                            isBull ? "bg-green-100 border-green-500" : "bg-red-100 border-red-500"
                        )}>
                            {isBull ? <TrendingUp className="w-4 h-4 text-green-600" /> : <TrendingDown className="w-4 h-4 text-red-600" />}
                        </div>
                        <div className="text-sm font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
                            MARKET CYCLE
                        </div>
                    </div>

                    <div className="flex gap-2">
                        {/* Mode Toggles */}
                        <button
                            onClick={() => setMode('bull')}
                            className={cn(
                                "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border-2 transition-all",
                                isBull
                                    ? "bg-green-500 text-white border-green-700 shadow-[2px_2px_0px_0px_rgba(21,128,61,1)] translate-y-0"
                                    : "bg-white text-muted-foreground border-border hover:bg-green-50"
                            )}
                        >
                            Bull Mode 🐂
                        </button>
                        <button
                            onClick={() => setMode('bear')}
                            className={cn(
                                "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border-2 transition-all",
                                !isBull
                                    ? "bg-red-500 text-white border-red-700 shadow-[2px_2px_0px_0px_rgba(185,28,28,1)] translate-y-0"
                                    : "bg-white text-muted-foreground border-border hover:bg-red-50"
                            )}
                        >
                            Bear Mode 🐻
                        </button>
                    </div>
                </div>

                {/* Chart Area */}
                <div className={cn(
                    "w-full h-[240px] p-4 relative transition-colors duration-700",
                    isBull ? "bg-gradient-to-br from-green-50/50 to-white" : "bg-gradient-to-br from-red-50/50 to-white"
                )}>
                    {/* Background Grid Pattern (Optional) */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                        style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '10px 10px' }}
                    />

                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="bullGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="bearGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <YAxis domain={['auto', 'auto']} hide />
                            <Area
                                type="monotone"
                                dataKey="value"
                                stroke={isBull ? "#16a34a" : "#dc2626"}
                                strokeWidth={3}
                                fill={isBull ? "url(#bullGradient)" : "url(#bearGradient)"}
                                isAnimationActive={false} // Disable recharts animation for smooth custom loop
                            />
                        </AreaChart>
                    </ResponsiveContainer>

                    {/* Annotations */}
                    <AnimatePresence mode="wait">
                        {isBull ? (
                            <motion.div
                                key="bull-text"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute bottom-4 left-4 text-xs font-bold text-green-600 bg-green-100/80 px-2 py-1 rounded backdrop-blur border border-green-200"
                            >
                                <span className="mr-1">📈</span> Higher Highs & Higher Lows
                            </motion.div>
                        ) : (
                            <motion.div
                                key="bear-text"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute bottom-4 left-4 text-xs font-bold text-red-600 bg-red-100/80 px-2 py-1 rounded backdrop-blur border border-red-200"
                            >
                                <span className="mr-1">📉</span> Lower Highs & Lower Lows
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Continue Button */}
            {onComplete && (
                <div className="pt-4">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onComplete}
                        className="flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-xl font-bold shadow-pop hover:shadow-none hover:translate-y-0.5 transition-all"
                    >
                        Success! I see it <ArrowRight className="w-4 h-4" />
                    </motion.button>
                </div>
            )}
        </div>
    )
}
