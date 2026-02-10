"use client"

import React, { useState, useEffect } from 'react'
import { motion, useTime, useTransform, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Activity, Zap, Shield, Repeat, ArrowRight, CheckCircle2, TrendingUp, BarChart3 } from 'lucide-react'

interface BetaShadowProps {
    onComplete: () => void
    gameConfig?: {
        instruction?: string
        base_beta?: string | number
    }
    stockData?: {
        beta?: number
    }
    ticker: string
}

type BetaMode = 'steady' | 'mirror' | 'wild'

// ... (imports remain)

export default function BetaShadow({ onComplete, gameConfig, stockData, ticker }: BetaShadowProps) {
    const [mode, setMode] = useState<BetaMode>('mirror')
    const [masteredModes, setMasteredModes] = useState<Set<BetaMode>>(new Set())
    const [progress, setProgress] = useState(0) // 0 to 100 for current mode
    const [isComplete, setIsComplete] = useState(false)

    // Verify mastery of current mode
    useEffect(() => {
        if (masteredModes.has(mode)) {
            setProgress(100)
            return
        }

        setProgress(0)
        const interval = setInterval(() => {
            setProgress(prev => {
                const next = prev + 2 // approx 2.5 seconds to 100% (50 ticks * 50ms)
                if (next >= 100) {
                    clearInterval(interval)
                    setMasteredModes(prevModes => {
                        const newModes = new Set(prevModes).add(mode)
                        if (newModes.size === 3) {
                            setTimeout(() => setIsComplete(true), 1500)
                        }
                        return newModes
                    })
                    return 100
                }
                return next
            })
        }, 50)

        return () => clearInterval(interval)
    }, [mode, masteredModes])

    // Animation Logic
    const time = useTime()
    // Use a direct function to transform time into continuous radians, avoiding any default clamping behavior
    const rawCycle = useTransform(time, (t) => (t / 4000) * 2 * Math.PI)
    const marketOffset = useTransform(rawCycle, (rad) => Math.sin(rad) * 35)

    const multipliers = {
        steady: 0.5,
        mirror: 1.0,
        wild: 2.5
    }

    const stockOffset = useTransform(marketOffset, (latest) => latest * multipliers[mode])
    const marketLeft = useTransform(marketOffset, (latest) => `${50 + latest}%`)
    const stockLeft = useTransform(stockOffset, (latest) => `${50 + latest}%`)

    const handleModeSelect = (newMode: BetaMode) => {
        if (!isComplete) setMode(newMode)
    }

    return (
        <div className="w-full max-w-xl mx-auto bg-card rounded-[2rem] border-2 border-foreground shadow-pop p-6 relative overflow-hidden flex flex-col gap-6 animate-pop-in select-none">

            {/* 1. Header Area */}
            <div className="text-center relative z-10">
                <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/20 text-primary border-2 border-primary/30 shadow-pop-active transform -rotate-2">
                        <Activity className="w-6 h-6" strokeWidth={2.5} />
                    </div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs font-black uppercase tracking-wider border-2 border-border">
                        VOLATILITY LAB
                    </div>
                </div>
                <h3 className="text-xl font-black text-foreground mt-2" style={{ fontFamily: 'var(--font-heading)' }}>
                    Master the 3 Beta Modes!
                </h3>
                <p className="text-sm font-medium text-muted-foreground mt-1">
                    Hold each mode for 3 seconds to analyze the pattern.
                </p>
            </div>

            {/* 2. Visual Stage */}
            <div className="relative w-full h-64 bg-background rounded-[1.5rem] border-2 border-foreground shadow-inner overflow-hidden flex flex-col justify-center gap-12 p-8">
                {/* Background Grid */}
                <div className="absolute inset-0 opacity-10 pointer-events-none flex justify-around px-12">
                    <div className="w-1 h-full bg-foreground/20 border-r-2 border-dashed border-foreground" />
                    <div className="w-1 h-full bg-foreground/50 border-r-4 border-foreground" />
                    <div className="w-1 h-full bg-foreground/20 border-r-2 border-dashed border-foreground" />
                </div>

                {/* Lane 1: The Market (Lead Runner) */}
                <div className="relative w-full h-12 flex items-center">
                    <div className="absolute left-0 -top-6 text-[10px] font-black text-tertiary-foreground bg-tertiary/20 px-2 py-0.5 rounded uppercase tracking-wider">
                        MARKET
                    </div>
                    <motion.div
                        style={{ left: marketLeft }}
                        className="absolute w-12 h-12 -ml-6 bg-tertiary rounded-2xl border-2 border-foreground shadow-pop flex items-center justify-center z-10"
                    >
                        <TrendingUp className="w-6 h-6 text-tertiary-foreground" />
                    </motion.div>
                    <div className="absolute w-full h-2 bg-muted rounded-full opacity-30" />
                </div>

                {/* Lane 2: The Stock (Follower) */}
                <div className="relative w-full h-12 flex items-center">
                    <div className="absolute left-0 -top-6 text-[10px] font-black text-muted-foreground bg-muted/30 px-2 py-0.5 rounded uppercase tracking-wider">
                        {ticker}
                    </div>
                    <motion.div
                        style={{ left: stockLeft }}
                        className={cn(
                            "absolute w-14 h-14 -ml-7 rounded-full border-4 border-white shadow-pop flex items-center justify-center z-10 transition-colors duration-300",
                            mode === 'steady' && "bg-secondary text-secondary-foreground",
                            mode === 'mirror' && "bg-primary text-primary-foreground",
                            mode === 'wild' && "bg-tertiary text-tertiary-foreground"
                        )}
                    >
                        {mode === 'steady' && <Shield className="w-7 h-7" />}
                        {mode === 'mirror' && <Activity className="w-7 h-7" />}
                        {mode === 'wild' && <Zap className="w-7 h-7" />}
                    </motion.div>
                    <div className={cn(
                        "absolute w-full h-3 rounded-full opacity-40 transition-colors duration-300",
                        mode === 'steady' ? "bg-secondary" :
                            mode === 'mirror' ? "bg-primary" : "bg-tertiary"
                    )} />
                </div>
            </div>

            {/* 3. Controls - Chunky Buttons */}
            <div className="grid grid-cols-3 gap-3">
                <button
                    onClick={() => handleModeSelect('steady')}
                    className={cn(
                        "relative h-24 rounded-2xl border-2 transition-all duration-200 active:translate-y-1 active:shadow-none flex flex-col items-center justify-center gap-1 group overflow-hidden",
                        mode === 'steady'
                            ? "bg-white border-secondary shadow-pop-blue text-secondary-foreground"
                            : "bg-white border-muted hover:border-foreground/30 text-muted-foreground"
                    )}
                >
                    {mode === 'steady' && <div className="absolute inset-0 bg-secondary/10 z-0" />}
                    {masteredModes.has('steady') && (
                        <div className="absolute top-2 right-2 bg-secondary text-white rounded-full p-0.5 z-20">
                            <CheckCircle2 size={12} strokeWidth={4} />
                        </div>
                    )}

                    <Shield className={cn("w-6 h-6 z-10", mode === 'steady' ? "text-secondary fill-secondary/20" : "")} />
                    <div className="flex flex-col items-center leading-none z-10">
                        <span className={cn("font-black text-xs uppercase mt-1", mode === 'steady' ? "text-secondary" : "")}>STEADY</span>
                        <span className="text-[10px] opacity-70 font-bold">0.5</span>
                    </div>
                </button>

                <button
                    onClick={() => handleModeSelect('mirror')}
                    className={cn(
                        "relative h-24 rounded-2xl border-2 transition-all duration-200 active:translate-y-1 active:shadow-none flex flex-col items-center justify-center gap-1 group overflow-hidden transform -translate-y-2",
                        mode === 'mirror'
                            ? "bg-primary border-foreground shadow-pop text-primary-foreground"
                            : "bg-white border-muted hover:border-foreground/30 text-muted-foreground"
                    )}
                >
                    {masteredModes.has('mirror') && (
                        <div className="absolute top-2 right-2 bg-primary-foreground text-primary rounded-full p-0.5 z-20">
                            <CheckCircle2 size={12} strokeWidth={4} />
                        </div>
                    )}
                    <Activity className={cn("w-8 h-8 z-10 transition-transform group-hover:scale-110", mode === 'mirror' ? "fill-white/20" : "")} />
                    <div className="flex flex-col items-center leading-none z-10">
                        <span className="font-black text-sm uppercase mt-1">MIRROR</span>
                        <span className="text-xs opacity-80 font-bold">1.0</span>
                    </div>
                </button>

                <button
                    onClick={() => handleModeSelect('wild')}
                    className={cn(
                        "relative h-24 rounded-2xl border-2 transition-all duration-200 active:translate-y-1 active:shadow-none flex flex-col items-center justify-center gap-1 group overflow-hidden",
                        mode === 'wild'
                            ? "bg-white border-tertiary shadow-pop-yellow text-tertiary-foreground"
                            : "bg-white border-muted hover:border-foreground/30 text-muted-foreground"
                    )}
                >
                    {mode === 'wild' && <div className="absolute inset-0 bg-tertiary/10 z-0" />}
                    {masteredModes.has('wild') && (
                        <div className="absolute top-2 right-2 bg-tertiary text-white rounded-full p-0.5 z-20">
                            <CheckCircle2 size={12} strokeWidth={4} />
                        </div>
                    )}

                    <Zap className={cn("w-6 h-6 z-10", mode === 'wild' ? "text-tertiary fill-tertiary/20" : "")} />
                    <div className="flex flex-col items-center leading-none z-10">
                        <span className={cn("font-black text-xs uppercase mt-1", mode === 'wild' ? "text-tertiary" : "")}>WILD</span>
                        <span className="text-[10px] opacity-70 font-bold">2.0+</span>
                    </div>
                </button>
            </div>

            {/* 4. Completion Modal - REDESIGNED */}
            <AnimatePresence>
                {isComplete && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-50 bg-foreground/20 backdrop-blur-[2px] flex items-center justify-center p-6"
                    >
                        <motion.div
                            initial={{ scale: 0.8, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="w-full bg-card text-foreground border-2 border-foreground rounded-[2rem] shadow-pop p-6 text-center"
                        >
                            <div className="w-16 h-16 rounded-full bg-primary/10 text-primary border-2 border-primary/20 shadow-pop-active flex items-center justify-center mx-auto mb-4">
                                <CheckCircle2 className="w-8 h-8" strokeWidth={3} />
                            </div>
                            <h4 className="font-black text-2xl uppercase tracking-wide mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                                Beta Mastered!
                            </h4>
                            <p className="text-sm text-muted-foreground font-medium mb-6 px-4">
                                You've experienced how Stocks (You) react to Market movements across different Beta levels.
                            </p>
                            <button
                                onClick={onComplete}
                                className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-bold shadow-pop hover:translate-y-0.5 hover:shadow-none transition-all flex items-center justify-center gap-2"
                            >
                                Continue to Quiz
                                <ArrowRight className="w-5 h-5" strokeWidth={3} />
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
