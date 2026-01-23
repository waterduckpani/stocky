"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Printer, DollarSign, CheckCircle2, ArrowRight } from 'lucide-react'

// Strict "Playful Geometric" Styling
// - Card: bg-white rounded-[2rem] border-2 border-foreground shadow-pop
// - Same logic as TheScale.tsx for consistency

interface ValuationStationProps {
    onComplete: () => void
    gameConfig?: {
        pe_ratio?: number
        valuation_type?: string
        symbol?: string
    }
}

export default function ValuationStation({ onComplete, gameConfig }: ValuationStationProps) {
    const peRatio = gameConfig?.pe_ratio || 20
    const valuationType = gameConfig?.valuation_type || "Average"
    const parsedPe = Math.round(peRatio)

    // Safety clamp (visuals get weird if PE is too huge or negative)
    const visualPe = Math.max(1, Math.min(parsedPe, 100))

    const [selectedMachine, setSelectedMachine] = useState<'A' | 'B' | null>(null)
    const [showFeedback, setShowFeedback] = useState(false)

    // Machine A: "The Value Machine" (P/E 10)
    // Machine B: "This Stock" (Dynamic P/E)
    // Concept: User has to "Buy" the machine representing the stock.
    // Wait, the instruction says "Which Money Machine is this stock behaving like?" 
    // But P/E is exact.
    // Let's make it simpler: "Buy this Stock's Machine".
    // Left: "Standard Machine ($20)" vs Right: "This Stock Machine ($X)"
    // User clicks ONLY the stock machine to reveal if it's cheap or expensive.

    // Actually, let's stick to the Implementation Plan: 
    // "Compare 'Cheap' vs 'Expensive' money machines"
    // Let's display TWO machines.
    // Machine 1: The "Market Average" ($20 for $1 earnings) = P/E 20
    // Machine 2: "{Symbol}" ($X for $1 earnings) = P/E X
    // User must TAP the {Symbol} machine to see the verdict.

    const handleSelect = (machine: 'A' | 'B') => {
        setSelectedMachine(machine)
        if (machine === 'B') { // Machine B is always the stock
            setShowFeedback(true)
        }
    }

    const isExpensive = peRatio > 25
    const isCheap = peRatio < 15

    const feedbackTitle = isExpensive
        ? "Premium Price! 🚀"
        : (isCheap ? "Bargain Price! 🏷️" : "Fair Price ⚖️")

    const feedbackText = isExpensive
        ? `You are paying $${visualPe} for every $1 of profit. Investors expect huge growth!`
        : (isCheap
            ? `You are only paying $${visualPe} for every $1 of profit. It's on sale!`
            : `You are paying $${visualPe}, which is standard for a healthy company.`)

    return (
        <div className="flex flex-col items-center w-full max-w-xl mx-auto p-1 h-full max-h-[600px] justify-between animate-pop-in">

            {/* Header */}
            <div className="text-center space-y-0.5 mb-4 shrink-0">
                <h3 className="text-xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
                    The Valuation Station
                </h3>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Compare the Price Tags
                </p>
            </div>

            {/* Main Stage */}
            <div className="w-full grid grid-cols-2 gap-4 grow mb-4">

                {/* Machine A (Benchmark) */}
                <div className="bg-white rounded-[2rem] border-2 border-foreground/10 shadow-sm p-4 flex flex-col items-center justify-center opacity-70 scale-95">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-3 border-2 border-slate-200">
                        <Printer size={32} className="text-slate-400" />
                    </div>
                    <div className="text-center">
                        <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">
                            Market Avg
                        </div>
                        <div className="text-2xl font-black text-slate-700">
                            $20.00
                        </div>
                        <div className="text-[10px] text-slate-400 font-medium">
                            Cost for $1 Earnings
                        </div>
                    </div>
                </div>

                {/* Machine B (The Stock) - INTERACTIVE */}
                <button
                    onClick={() => handleSelect('B')}
                    className={cn(
                        "bg-white rounded-[2rem] border-2 border-foreground shadow-pop p-4 flex flex-col items-center justify-center transition-all relative overflow-hidden group",
                        selectedMachine === 'B' ? "ring-4 ring-primary/20" : "hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
                    )}
                >
                    <div className={cn(
                        "w-20 h-20 rounded-full flex items-center justify-center mb-3 border-2 border-foreground shadow-sm transition-transform group-hover:scale-110",
                        isExpensive ? "bg-violet-100 text-violet-600" : (isCheap ? "bg-emerald-100 text-emerald-600" : "bg-blue-100 text-blue-600")
                    )}>
                        <DollarSign size={40} strokeWidth={2.5} />
                    </div>
                    <div className="text-center relative z-10">
                        <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">
                            {gameConfig?.symbol || "Stock"}
                        </div>
                        <div className="text-3xl font-black text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>
                            ${visualPe.toFixed(2)}
                        </div>
                        <div className="text-[10px] text-muted-foreground font-medium">
                            Cost for $1 Earnings
                        </div>
                    </div>

                    {/* "Click Me" Badge */}
                    {!selectedMachine && (
                        <div className="absolute top-3 right-3 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-1 rounded-full animate-bounce">
                            BUY?
                        </div>
                    )}
                </button>

            </div>

            {/* Instruction / Footer */}
            <div className="text-center text-sm font-medium text-muted-foreground max-w-xs mx-auto mb-6">
                Tap the stock machine to see if you're getting a good deal.
            </div>

            {/* Feedback Overlay */}
            <AnimatePresence>
                {showFeedback && (
                    <motion.div
                        initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                        animate={{ opacity: 1, backdropFilter: "blur(4px)" }}
                        className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/80 p-4 text-center rounded-[2rem]"
                    >
                        <motion.div
                            initial={{ scale: 0.8, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="bg-white border-2 border-foreground shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-2xl p-6 w-full max-w-xs flex flex-col items-center"
                        >
                            <div className={cn(
                                "w-16 h-16 rounded-full flex items-center justify-center mb-4 border-2 border-foreground shadow-[3px_3px_0px_0px_rgba(0,0,0,0.1)]",
                                isExpensive ? "bg-violet-100 text-violet-600" : (isCheap ? "bg-emerald-100 text-emerald-600" : "bg-blue-100 text-blue-600")
                            )}>
                                {isExpensive ? <div className="text-2xl">🚀</div> : (isCheap ? <div className="text-2xl">🏷️</div> : <div className="text-2xl">⚖️</div>)}
                            </div>

                            <h3 className="text-xl font-black text-foreground mb-2">
                                {feedbackTitle}
                            </h3>
                            <p className="text-muted-foreground font-medium text-sm mb-6 leading-tight">
                                {feedbackText}
                            </p>

                            <button
                                onClick={onComplete}
                                className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-bold shadow-[0px_4px_0px_0px_rgba(0,0,0,0.2)] hover:translate-y-[1px] hover:shadow-none transition-all flex items-center justify-center gap-2 text-sm"
                            >
                                Finish Lesson <ArrowRight size={16} />
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    )
}
