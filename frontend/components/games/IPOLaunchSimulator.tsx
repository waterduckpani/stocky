"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { ArrowRight, Bell, Building2 } from 'lucide-react'

interface IPOLaunchSimulatorProps {
    onComplete: () => void
    gameConfig?: any
    symbol: string
    stockData: any
}

export default function IPOLaunchSimulator({ onComplete, symbol, stockData }: IPOLaunchSimulatorProps) {
    const [isFlipped, setIsFlipped] = useState(false)
    const [currencyState, setCurrencyState] = useState({ symbol: '$', baseInvestment: 1000 })

    // --- 1. SMART CURRENCY & INVESTMENT ---
    useEffect(() => {
        const detect = () => {
            let sym = '$'
            let base = 1000

            // Suffix/Data Logic
            const s = (symbol || '').toUpperCase()
            const c = (stockData?.currency || '').toUpperCase()

            // India (INR)
            if (c === 'INR' || s.endsWith('.BO') || s.endsWith('.NS')) {
                sym = '₹'; base = 10000;
            }
            // Korea (KRW)
            else if (c === 'KRW' || s.endsWith('.KS') || s.endsWith('.KQ')) {
                sym = '₩'; base = 1000000;
            }
            // Japan (JPY)
            else if (c === 'JPY' || s.endsWith('.T')) {
                sym = '¥'; base = 100000;
            }
            // UK (GBP)
            else if (c === 'GBP' || s.endsWith('.L')) {
                sym = '£'; base = 1000;
            }
            // Europe (EUR)
            else if (c === 'EUR' || s.endsWith('.DE') || s.endsWith('.PA') || s.endsWith('.AS')) {
                sym = '€'; base = 1000;
            }
            // Canada (CAD)
            else if (c === 'CAD' || s.endsWith('.TO') || s.endsWith('.V')) {
                sym = 'C$'; base = 1000;
            }

            return { symbol: sym, baseInvestment: base }
        }

        setCurrencyState(detect())
    }, [symbol, stockData])

    const { symbol: currencySymbol, baseInvestment: investment } = currencyState
    const companyName = stockData?.shortName || symbol

    // --- 2. SIMULATE HISTORY (Deterministic) ---
    const generateIPOData = () => {
        if (!symbol) return { ipoYear: 2000, ipoPrice: 20 }
        const hash = symbol.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
        const years = Array.from({ length: 40 }, (_, i) => 2020 - i)
        // Deterministic but varied
        const ipoYear = years[hash % years.length]
        const ipoPrice = 15 + (hash % 35) // Random price 15-50
        return { ipoYear, ipoPrice }
    }

    const [ipoData] = useState(generateIPOData)

    // --- 3. CALCULATE GROWTH ---
    const currentPrice = stockData?.price || 100
    // Calculate shares bought with the *local* investment amount
    const sharesBought = investment / ipoData.ipoPrice
    const currentValue = sharesBought * currentPrice
    const percentReturn = ((currentValue - investment) / investment) * 100
    const isUp = percentReturn >= 0

    // Scaling for Bar Chart (Max height 150px)
    const maxValue = Math.max(investment, currentValue)
    // Avoid divide by zero
    const safeMax = maxValue > 0 ? maxValue : 100
    const scaleFactor = 120 / safeMax

    // Ensure at least a sliver is visible
    const barHeightInitial = Math.max(4, investment * scaleFactor)
    const barHeightCurrent = Math.max(4, currentValue * scaleFactor)

    // --- 4. OPACITY ANIMATION (The "Ghost" Fix) ---
    const frontAnim = {
        opacity: isFlipped ? 0 : 1,
        transition: { duration: 0, delay: 0.4 }
    }
    const backAnim = {
        opacity: isFlipped ? 1 : 0,
        transition: { duration: 0, delay: 0.4 }
    }

    return (
        <div className="w-full max-w-2xl mx-auto space-y-6 animate-pop-in">
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-black text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>
                    The Origin Story 📜
                </h2>
                <p className="text-muted-foreground font-medium text-lg">
                    Every giant started as a startup.
                </p>
            </div>

            {/* FLIP CARD CONTAINER */}
            {/* Added relative here so the button can animate in below it flow-wise */}
            <div className="relative w-full h-[500px] group" style={{ perspective: '1000px' }}>
                <motion.div
                    initial={false}
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{ duration: 0.8, type: "spring", stiffness: 60, damping: 12 }}
                    className="w-full h-full relative"
                    style={{ transformStyle: 'preserve-3d' }}
                >
                    {/* --- FRONT FACE --- */}
                    <motion.div
                        animate={frontAnim}
                        className="absolute inset-0 bg-[#FFFDF5] rounded-[2rem] border-4 border-foreground shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 flex flex-col items-center justify-center text-center overflow-hidden"
                        style={{
                            backfaceVisibility: 'hidden',
                            WebkitBackfaceVisibility: 'hidden',
                            zIndex: 2,
                            pointerEvents: isFlipped ? 'none' : 'auto'
                        }}
                    >
                        <Building2 className="absolute text-foreground/5 w-64 h-64 -bottom-10 -right-10 rotate-12" />

                        <div className="relative z-10 space-y-6">
                            <div className="inline-block px-4 py-2 bg-foreground text-white rounded-full text-xs font-black uppercase tracking-widest mb-4">
                                Status: Private
                            </div>
                            <h3 className="text-5xl font-black text-foreground tracking-tighter" style={{ fontFamily: 'var(--font-heading)' }}>
                                {companyName}
                            </h3>
                            <p className="text-xl text-muted-foreground font-bold max-w-md mx-auto">
                                It's {ipoData.ipoYear}. The founders are ready to take the company public.
                            </p>
                            <div className="pt-8">
                                <button
                                    onClick={() => setIsFlipped(true)}
                                    // Button specifically gets hidden/disabled
                                    className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-accent text-white rounded-2xl font-black text-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-2 border-foreground hover:translate-y-1 hover:shadow-none hover:border-black transition-all active:translate-y-2"
                                >
                                    <Bell className="w-6 h-6 animate-pulse group-hover:rotate-12 transition-transform" />
                                    Ring the Bell!
                                </button>
                            </div>
                        </div>
                    </motion.div>

                    {/* --- BACK FACE --- */}
                    <motion.div
                        animate={backAnim}
                        className="absolute inset-0 bg-white rounded-[2rem] border-4 border-foreground shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 flex flex-col overflow-hidden"
                        style={{
                            transform: 'rotateY(180deg)',
                            backfaceVisibility: 'hidden',
                            WebkitBackfaceVisibility: 'hidden',
                            zIndex: 1,
                            pointerEvents: isFlipped ? 'auto' : 'none'
                        }}
                    >
                        {/* Header */}
                        <div className="flex justify-between items-start mb-6 shrink-0">
                            <div>
                                <div className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-black uppercase tracking-widest border-2 border-green-700 mb-2">
                                    Status: Public
                                </div>
                                <h3 className="text-4xl font-black text-foreground truncate max-w-[200px]" style={{ fontFamily: 'var(--font-heading)' }}>
                                    {symbol}
                                </h3>
                            </div>
                            <div className="text-right">
                                <div className="text-sm font-bold text-muted-foreground">IPO Date</div>
                                <div className="text-xl font-black">{ipoData.ipoYear}</div>
                            </div>
                        </div>

                        {/* Chart Area */}
                        <div className="flex-1 flex flex-col justify-end relative min-h-0">
                            {/* Static Grid */}
                            <div className="absolute inset-x-0 bottom-0 top-0 flex flex-col justify-between pointer-events-none opacity-10 z-0">
                                <div className="w-full h-px bg-foreground border-t border-dashed border-foreground" />
                                <div className="w-full h-px bg-foreground border-t border-dashed border-foreground" />
                                <div className="w-full h-px bg-foreground border-t border-dashed border-foreground" />
                            </div>

                            {/* BASELINE - Solid Ground */}
                            <div className="absolute bottom-0 inset-x-0 h-px bg-foreground opacity-20 z-0" />

                            {/* BARS: Aligned to bottom using items-end */}
                            <div className="flex items-end justify-around relative z-10 h-[180px]">
                                {/* Bar A: Initial */}
                                <div className="flex flex-col items-center gap-1 group w-1/3 relative justify-end h-full">
                                    <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1 text-center">
                                        Initial Investment
                                    </div>
                                    {/* Value floating above bar */}
                                    <div className="text-lg font-black text-foreground z-10 mb-1">
                                        {currencySymbol}{investment.toLocaleString()}
                                    </div>
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: isFlipped ? barHeightInitial : 0 }}
                                        transition={{ delay: 0.4, duration: 0.8, type: "spring" }}
                                        className="w-full bg-slate-200 border-2 border-foreground rounded-t-xl"
                                    />
                                    {/* Date below baseline */}
                                    <div className="absolute -bottom-6 text-xs font-bold text-muted-foreground uppercase tracking-widest">{ipoData.ipoYear}</div>
                                </div>

                                {/* Bar B: Current */}
                                <div className="flex flex-col items-center gap-1 group w-1/3 relative justify-end h-full">
                                    <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1 text-center">
                                        Value Today
                                    </div>
                                    <div className={cn("text-lg font-black z-10 mb-1", isUp ? "text-emerald-600" : "text-rose-500")}>
                                        {currencySymbol}{currentValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                    </div>
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: isFlipped ? barHeightCurrent : 0 }}
                                        transition={{ delay: 0.6, duration: 0.8, type: "spring" }}
                                        className={cn(
                                            "w-full border-2 border-foreground rounded-t-xl relative overflow-hidden",
                                            isUp ? "bg-[#4ADE80]" : "bg-[#F472B6]"
                                        )}
                                    >
                                        <div className="absolute inset-0 opacity-20"
                                            style={{ backgroundImage: 'linear-gradient(45deg, #000 25%, transparent 25%, transparent 50%, #000 50%, #000 75%, transparent 75%, transparent)', backgroundSize: '10px 10px' }}
                                        />
                                    </motion.div>
                                    <div className="absolute -bottom-6 text-xs font-bold text-muted-foreground uppercase tracking-widest">Now</div>
                                </div>
                            </div>
                        </div>

                        {/* Result Banner - Moved Down slightly due to Chart Labels */}
                        <div className={cn(
                            "mt-8 p-4 rounded-xl border-2 border-foreground text-center relative z-10 shrink-0",
                            isUp ? "bg-emerald-50" : "bg-rose-50"
                        )}>
                            <div className="text-sm font-bold mb-1">
                                {isUp ? "Massive Growth! 🚀" : "Rough Patch 📉"}
                            </div>
                            <div className={cn("text-3xl font-black", isUp ? "text-emerald-600" : "text-rose-600")}>
                                {percentReturn > 0 ? "+" : ""}{percentReturn.toLocaleString(undefined, { maximumFractionDigits: 0 })}%
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>


        </div>
    )
}
