"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Ship, Zap, DollarSign, ArrowRight, CheckCircle2 } from 'lucide-react'

// Strict "Playful Geometric" Styling - COMPACT VERSION
// - Card: bg-white rounded-[2rem] border-2 border-foreground shadow-pop
// - Same logic, tighter spacing for viewport fit

export default function TheScale({ onComplete }: { onComplete: () => void }) {
    const [mode, setMode] = useState<'small' | 'large'>('small')
    const [price, setPrice] = useState(100)
    const [pressure, setPressure] = useState(0)
    const [targetReached, setTargetReached] = useState(false)
    const [completedModes, setCompletedModes] = useState<string[]>([])
    const [showFeedback, setShowFeedback] = useState(false)
    const [isFinished, setIsFinished] = useState(false)

    // Reset when switching modes
    useEffect(() => {
        setPrice(100)
        setPressure(0)
        setTargetReached(false)
        setShowFeedback(false)
    }, [mode])

    const handleAddPressure = () => {
        if (targetReached) return

        const increment = mode === 'small' ? 20 : 2

        const newPressure = pressure + increment
        setPressure(newPressure)

        const wiggle = mode === 'small' ? (Math.random() * 5) : (Math.random() * 0.5)
        setPrice(prev => prev + wiggle + (mode === 'small' ? 2 : 0.2))

        if (newPressure >= 100) {
            setTargetReached(true)
            if (!completedModes.includes(mode)) {
                const newCompleted = [...completedModes, mode]
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

    const isSmall = mode === 'small'

    const handleNextLevel = () => {
        if (isFinished) {
            onComplete()
        } else {
            // Switch to the other mode automatically or close feedback
            const nextMode = mode === 'small' ? 'large' : 'small'
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
                    {isSmall ? "Small Cap Stock" : "Mega Cap Stock"}
                </h3>
                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
                    {isSmall
                        ? "Market Cap: $10 Million (Lightweight)"
                        : "Market Cap: $3 Trillion (Heavyweight)"}
                </p>
                {/* Progress Dots */}
                <div className="flex gap-1 justify-center mt-1">
                    <div className={cn("w-1.5 h-1.5 rounded-full transition-colors", completedModes.includes('small') ? "bg-primary" : "bg-muted")} />
                    <div className={cn("w-1.5 h-1.5 rounded-full transition-colors", completedModes.includes('large') ? "bg-primary" : "bg-muted")} />
                </div>
            </div>

            {/* Main Game Card */}
            <div className="w-full bg-white rounded-[2rem] border-2 border-foreground shadow-pop overflow-hidden flex flex-col items-center relative p-4 grow justify-center">

                {/* Mode Switcher (Tab Style) */}
                <div className="flex bg-muted/30 p-1 rounded-xl gap-1 w-full max-w-[300px] mb-4 border-2 border-transparent shrink-0">
                    <button
                        onClick={() => setMode('small')}
                        disabled={targetReached && showFeedback}
                        className={cn(
                            "flex-1 py-2 px-2 rounded-lg text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 border-2",
                            mode === 'small'
                                ? "bg-white text-emerald-600 border-emerald-500 shadow-sm"
                                : "text-muted-foreground border-transparent hover:bg-black/5"
                        )}
                    >
                        <Zap size={14} fill={mode === 'small' ? "currentColor" : "none"} /> Speedboat
                        {completedModes.includes('small') && <CheckCircle2 size={12} className="ml-0.5 text-emerald-500" />}
                    </button>
                    <button
                        onClick={() => setMode('large')}
                        disabled={targetReached && showFeedback}
                        className={cn(
                            "flex-1 py-2 px-2 rounded-lg text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 border-2",
                            mode === 'large'
                                ? "bg-white text-violet-600 border-violet-500 shadow-sm"
                                : "text-muted-foreground border-transparent hover:bg-black/5"
                        )}
                    >
                        <Ship size={14} fill={mode === 'large' ? "currentColor" : "none"} /> Ocean Liner
                        {completedModes.includes('large') && <CheckCircle2 size={12} className="ml-0.5 text-violet-500" />}
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
                                isSmall ? "bg-emerald-500" : "bg-violet-600"
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
                            scale: isSmall ? 1 + (pressure / 80) : 1 + (pressure / 400),
                            rotate: isSmall ? (pressure / 5) - 10 : 0,
                            x: isSmall ? (Math.random() - 0.5) * pressure : 0
                        }}
                        className={cn(
                            "rounded-2xl p-6 border-4 transition-all duration-300 transform",
                            isSmall
                                ? "bg-emerald-100 border-emerald-500 text-emerald-600 shadow-[4px_4px_0px_0px_#10B981]"
                                : "bg-violet-100 border-violet-600 text-violet-700 shadow-[4px_4px_0px_0px_#7C3AED]"
                        )}
                    >
                        {isSmall ? <Zap size={48} strokeWidth={2.5} /> : <Ship size={48} strokeWidth={2.5} />}
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
                                className="bg-white border-2 border-foreground shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-2xl p-6 w-full max-w-xs flex flex-col items-center"
                            >
                                <div className={cn(
                                    "w-16 h-16 rounded-full flex items-center justify-center mb-4 border-2 border-foreground shadow-[3px_3px_0px_0px_rgba(0,0,0,0.1)]",
                                    isSmall ? "bg-emerald-100" : "bg-violet-100"
                                )}>
                                    {isSmall ? (
                                        <Zap size={32} className="text-emerald-600 fill-emerald-600" />
                                    ) : (
                                        <Ship size={32} className="text-violet-600 fill-violet-600" />
                                    )}
                                </div>

                                <h3 className="text-xl font-black text-foreground mb-1">
                                    {isSmall ? "Lift Off!" : "Barely Moved..."}
                                </h3>
                                <p className="text-muted-foreground font-medium text-sm mb-4 leading-tight">
                                    {isSmall
                                        ? "Small Caps are light! A little buying pressure sends them flying."
                                        : "Mega Caps are heavy! It takes BILLIONS to move them."}
                                </p>

                                <button
                                    onClick={handleNextLevel}
                                    className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-bold shadow-[0px_4px_0px_0px_rgba(0,0,0,0.2)] hover:translate-y-[1px] hover:shadow-none transition-all flex items-center justify-center gap-2 text-sm"
                                >
                                    {isFinished ? "Finish Lesson" : `Try the ${isSmall ? "Ocean Liner" : "Speedboat"} `} <ArrowRight size={16} />
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
                        isSmall
                            ? "bg-emerald-400 hover:bg-emerald-300 shadow-[0px_4px_0px_0px_#065F46] active:shadow-none active:translate-y-[4px]"
                            : "bg-violet-500 hover:bg-violet-400 shadow-[0px_4px_0px_0px_#5B21B6] active:shadow-none active:translate-y-[4px]"
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

        </div>
    )
}
