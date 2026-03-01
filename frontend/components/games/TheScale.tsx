"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Ship, Zap, DollarSign, ArrowRight, CheckCircle2, Anchor } from 'lucide-react'
import { MinigameCompletionPopup } from "./MinigameCompletionPopup"

// Strict "Playful Geometric" Styling - COMPACT VERSION
// - Card: bg-white rounded-[2rem] border-2 border-foreground shadow-pop
// - Same logic, tighter spacing for viewport fit

interface TheScaleProps {
    onComplete: () => void
    gameConfig?: {
        type: string
        instruction: string
        market_cap?: number
        category?: string
        symbol?: string
    }
}

export default function TheScale({ onComplete, gameConfig }: TheScaleProps) {
    // Determine dynamic values from config or fallback
    const searchedSymbol = gameConfig?.symbol // e.g. "AAPL"
    const searchedCategory = gameConfig?.category || "Small Cap" // "Small Cap" or "Mega Cap"
    const realMarketCap = gameConfig?.market_cap || 10_000_000 // Default 10M

    // Is the user looking at a "Heavy" stock?
    const isHeavySearch = ["Mega Cap", "Large Cap"].includes(searchedCategory)

    // Modes:
    // If Heavy Search: Mode 1 = "Mega Cap (Searched)", Mode 2 = "Small Cap (Comparison)"
    // If Light Search: Mode 1 = "Small Cap (Searched)", Mode 2 = "Mega Cap (Comparison)"
    const [mode, setMode] = useState<'primary' | 'secondary'>('primary')

    // Config for Primary (Searched Stock)
    const primaryConfig = {
        label: isHeavySearch ? "Your Search: Ocean Liner" : "Your Search: Speedboat",
        subLabel: isHeavySearch ? `Mega Cap (${searchedSymbol || "Unknown"})` : `Small Cap (${searchedSymbol || "Startup"})`,
        icon: isHeavySearch ? Ship : Zap,
        color: isHeavySearch ? "blue" : "emerald",
        cap: realMarketCap
    }

    // Config for Secondary (Comparison)
    const secondaryConfig = {
        label: isHeavySearch ? "Compare: Speedboat" : "Compare: Ocean Liner",
        subLabel: isHeavySearch ? "Small Cap (Startup)" : "Mega Cap (Apple)",
        icon: isHeavySearch ? Zap : Ship,
        color: isHeavySearch ? "emerald" : "blue",
        cap: isHeavySearch ? 200_000_000 : 3_000_000_000_000 // 200M vs 3T
    }

    const currentConfig = mode === 'primary' ? primaryConfig : secondaryConfig

    const [price, setPrice] = useState(100)
    const [pressure, setPressure] = useState(0) // 0 to 100%
    const [targetReached, setTargetReached] = useState(false)
    const [completedModes, setCompletedModes] = useState<string[]>([])
    const [showFeedback, setShowFeedback] = useState(false)
    const [isFinished, setIsFinished] = useState(false)
    const [globalComplete, setGlobalComplete] = useState(false)

    // Reset when switching modes
    useEffect(() => {
        setPrice(100)
        setPressure(0)
        setTargetReached(false)
        setShowFeedback(false)
    }, [mode])

    const handleAddPressure = () => {
        if (targetReached) return

        // PHYSICS CALCULATION
        // We are adding $10 Million.
        // Percent Change = (10,000,000 / Market Cap) * 100
        const addedValue = 10_000_000
        const cap = currentConfig.cap
        const percentImpact = (addedValue / cap) * 100

        // Visual Scale: 
        // Small Cap (e.g. 10M cap) -> 100% move
        // Large Cap (e.g. 3T cap) -> 0.0003% move

        // We map "pressure" (visual fill) to this impact
        // Let's amplify it for visual sake but keep the ratio true.
        // Small caps should fly. Large caps should crawl.

        // If cap < 1B, it flies (20% per click)
        // If cap > 100B, it crawls (1% per click)

        let visualIncrement = 0
        if (cap < 2_000_000_000) visualIncrement = 25 // 4 clicks
        else if (cap < 50_000_000_000) visualIncrement = 10 // 10 clicks
        else visualIncrement = 2 // 50 clicks (Feels heavy)

        // Override for "Ocean Liner" feel vs "Speedboat" feel strictly
        const isSpeedboat = currentConfig.icon === Zap
        visualIncrement = isSpeedboat ? 25 : 2

        const newPressure = pressure + visualIncrement
        setPressure(newPressure)

        // Price Wiggle
        const priceWiggle = isSpeedboat ? (Math.random() * 5) : (Math.random() * 0.1)
        const priceJump = isSpeedboat ? 5 : 0.05

        setPrice(prev => prev + priceWiggle + priceJump)

        if (newPressure >= 100) {
            setTargetReached(true)
            const modeKey = mode
            if (!completedModes.includes(modeKey)) {
                const newCompleted = [...completedModes, modeKey]
                setCompletedModes(newCompleted)
                setShowFeedback(true)

                if (newCompleted.length === 2) {
                    setIsFinished(true)
                }
            } else {
                setShowFeedback(true)
            }
        }
    }

    const handleNextLevel = () => {
        if (isFinished) {
            setGlobalComplete(true)
            setShowFeedback(false)
        } else {
            // Switch to the other mode automatically or close feedback
            const nextMode = mode === 'primary' ? 'secondary' : 'primary'
            if (!completedModes.includes(nextMode)) {
                setMode(nextMode)
            } else {
                setShowFeedback(false)
            }
        }
    }

    return (
        <div className="flex flex-col items-center w-full max-w-xl mx-auto p-1 h-full max-h-[600px] justify-between animate-pop-in">

            {/* Header */}
            <div className="text-center space-y-0.5 mb-2 shrink-0">
                <h3 className="text-lg font-bold flex items-center justify-center gap-2" style={{ fontFamily: 'var(--font-heading)' }}>
                    {currentConfig.label}
                </h3>
                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
                    {currentConfig.subLabel}
                </p>
                {/* Progress Dots */}
                <div className="flex gap-1 justify-center mt-1">
                    <div className={cn("w-1.5 h-1.5 rounded-full transition-colors", completedModes.includes('primary') ? "bg-primary" : "bg-muted")} />
                    <div className={cn("w-1.5 h-1.5 rounded-full transition-colors", completedModes.includes('secondary') ? "bg-primary" : "bg-muted")} />
                </div>
            </div>

            {/* Main Game Card */}
            <div className="w-full bg-white rounded-[2rem] border-2 border-foreground shadow-pop overflow-hidden flex flex-col items-center relative p-4 grow justify-center">

                {/* Mode Switcher (Tab Style) */}
                <div className="flex bg-muted/30 p-1 rounded-xl gap-1 w-full max-w-[300px] mb-4 border-2 border-transparent shrink-0">
                    <button
                        onClick={() => setMode('primary')}
                        disabled={targetReached && showFeedback}
                        className={cn(
                            "flex-1 py-2 px-2 rounded-lg text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 border-2",
                            mode === 'primary'
                                ? `bg-white text-${primaryConfig.color}-600 border-${primaryConfig.color}-500 shadow-sm`
                                : "text-muted-foreground border-transparent hover:bg-black/5"
                        )}
                    >
                        <primaryConfig.icon size={14} fill={mode === 'primary' ? "currentColor" : "none"} />
                        {isHeavySearch ? "Ocean Liner" : "Speedboat"}
                        {completedModes.includes('primary') && <CheckCircle2 size={12} className={`ml-0.5 text-${primaryConfig.color}-500`} />}
                    </button>
                    <button
                        onClick={() => setMode('secondary')}
                        disabled={targetReached && showFeedback}
                        className={cn(
                            "flex-1 py-2 px-2 rounded-lg text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 border-2",
                            mode === 'secondary'
                                ? `bg-white text-${secondaryConfig.color}-600 border-${secondaryConfig.color}-500 shadow-sm`
                                : "text-muted-foreground border-transparent hover:bg-black/5"
                        )}
                    >
                        <secondaryConfig.icon size={14} fill={mode === 'secondary' ? "currentColor" : "none"} />
                        {isHeavySearch ? "Speedboat" : "Ocean Liner"}
                        {completedModes.includes('secondary') && <CheckCircle2 size={12} className={`ml-0.5 text-${secondaryConfig.color}-500`} />}
                    </button>
                </div>

                {/* VISUALIZATION */}
                <div className="relative w-full flex flex-col items-center gap-6 mb-2">

                    {/* Progress Bar Container */}
                    <div className="w-full h-6 bg-slate-100 rounded-full overflow-hidden border-2 border-slate-300 relative">
                        {/* The Fill */}
                        <motion.div
                            className={cn(
                                "h-full absolute left-0 top-0 border-r-4 border-white",
                                currentConfig.color === 'blue' ? "bg-blue-600" : "bg-emerald-500"
                            )}
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(pressure, 100)}%` }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        />
                        {/* Target Dashed Line */}
                        <div className="absolute right-0 top-0 bottom-0 w-1 bg-rose-400 z-20 dashed border-l-2 border-rose-400 opacity-50" />
                    </div>

                    {/* The Icon (Sticker Style) */}
                    <motion.div
                        animate={{
                            scale: currentConfig.icon === Zap ? 1 + (pressure / 80) : 1 + (pressure / 400),
                            rotate: currentConfig.icon === Zap ? (pressure / 5) - 10 : 0,
                            x: currentConfig.icon === Zap ? (Math.random() - 0.5) * pressure : 0
                        }}
                        className={cn(
                            "rounded-2xl p-6 border-4 transition-all duration-300 transform",
                            currentConfig.color === 'blue'
                                ? "bg-blue-100 border-blue-600 text-blue-700 shadow-[4px_4px_0px_0px_#2563EB]"
                                : "bg-emerald-100 border-emerald-500 text-emerald-600 shadow-[4px_4px_0px_0px_#10B981]"
                        )}
                    >
                        <currentConfig.icon size={48} strokeWidth={2.5} />
                    </motion.div>

                    {/* Price Display */}
                    <div className="text-center">
                        <div className="text-4xl font-black tracking-tighter text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>
                            ${price.toFixed(2)}
                        </div>
                        <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-0.5">
                            Current Price
                        </div>
                    </div>
                </div>

                {/* Feedback Overlay (Absolute) */}
                <AnimatePresence>
                    {showFeedback && (
                        <motion.div
                            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                            animate={{ opacity: 1, backdropFilter: "blur(4px)" }}
                            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/80 p-4 text-center"
                        >
                            <motion.div
                                initial={{ scale: 0.8, y: 20 }}
                                animate={{ scale: 1, y: 0 }}
                                className="bg-card text-foreground border-2 border-foreground shadow-pop rounded-[2rem] p-6 w-[85%] max-w-sm flex flex-col items-center"
                            >
                                <div className={cn(
                                    "w-16 h-16 rounded-full flex items-center justify-center mb-4 border-2 border-foreground shadow-pop-active",
                                    currentConfig.color === 'blue' ? "bg-blue-100" : "bg-emerald-100"
                                )}>
                                    {currentConfig.icon === Zap ? (
                                        <Zap size={32} className="text-emerald-600 fill-emerald-600" />
                                    ) : (
                                        <Ship size={32} className="text-blue-600 fill-blue-600" />
                                    )}
                                </div>

                                <h3 className="text-2xl font-black text-foreground mb-1 uppercase tracking-wide" style={{ fontFamily: 'var(--font-heading)' }}>
                                    {currentConfig.icon === Zap ? "Lift Off!" : "Barely Moved..."}
                                </h3>
                                <p className="text-muted-foreground font-medium text-sm mb-6 leading-tight">
                                    {currentConfig.icon === Zap
                                        ? "Small Caps are light! A little buying pressure sends them flying."
                                        : "Mega Caps are heavy! It takes BILLIONS to move them."}
                                </p>

                                <button
                                    onClick={handleNextLevel}
                                    className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-bold shadow-pop border-2 border-foreground hover:translate-y-0.5 hover:shadow-none transition-all flex items-center justify-center gap-2"
                                >
                                    {isFinished ? "Finish Lesson" : "Next Level"} <ArrowRight className="w-5 h-5" strokeWidth={3} />
                                </button>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>

            {/* Main Action Button */}
            <div className="w-full max-w-xl mt-2 shrink-0">
                <button
                    onClick={handleAddPressure}
                    disabled={targetReached}
                    className={cn(
                        "w-full py-4 rounded-xl border-2 border-foreground transition-all group relative overflow-hidden",
                        currentConfig.color === 'blue'
                            ? "bg-blue-500 hover:bg-blue-400 shadow-[0px_4px_0px_0px_#1E3A8A] active:shadow-none active:translate-y-[4px]"
                            : "bg-emerald-400 hover:bg-emerald-300 shadow-[0px_4px_0px_0px_#065F46] active:shadow-none active:translate-y-[4px]"
                    )}
                >
                    <div className="flex flex-col items-center relative z-10 text-white">
                        <span className="flex items-center gap-2 text-xl font-black uppercase tracking-wide">
                            <DollarSign className="w-6 h-6" strokeWidth={3} />
                            Add $10 Million
                        </span>
                        <span className="text-[10px] font-bold opacity-90 mt-0.5 uppercase tracking-widest">
                            Buying Pressure
                        </span>
                    </div>
                </button>
            </div>

            <MinigameCompletionPopup
                completed={globalComplete}
                onComplete={onComplete || (() => { })}
                title="Weight Class Pro!"
                description="You now understand the sheer mass of Mega Caps vs Small Caps."
            />
        </div>
    )
}
