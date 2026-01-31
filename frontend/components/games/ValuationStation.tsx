"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Printer, DollarSign, CheckCircle2, ArrowRight, Gem, ShoppingBag, Handshake } from 'lucide-react'

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
        <div className="w-full max-w-xl mx-auto bg-card rounded-[2.5rem] border-4 border-foreground shadow-pop p-6 relative overflow-hidden flex flex-col gap-6 animate-pop-in select-none">

            {/* Header */}
            <div className="text-center relative z-10">
                <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary border-2 border-primary/20 shadow-sm transform -rotate-2">
                        <Printer className="w-6 h-6 text-primary" strokeWidth={2.5} />
                    </div>
                    <h3 className="text-2xl font-black text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>
                        The Valuation Station
                    </h3>
                </div>
                <p className="text-muted-foreground font-bold text-base leading-tight max-w-sm mx-auto">
                    Compare the Price Tags
                </p>
            </div>

            {/* Main Stage */}
            <div className="w-full grid grid-cols-2 gap-4 grow min-h-[200px]">

                {/* Machine A (Benchmark) */}
                <div className="bg-tertiary/20 rounded-[2rem] border-2 border-tertiary/50 flex flex-col items-center justify-center p-4 relative overflow-hidden">
                    {/* Decorative Blob */}
                    <div className="absolute -top-12 -left-12 w-24 h-24 bg-tertiary/20 rounded-full blur-2xl pointer-events-none" />

                    <div className="w-16 h-16 bg-tertiary/30 rounded-full flex items-center justify-center mb-3 border-2 border-tertiary/50 shadow-sm relative z-10">
                        <Printer size={28} className="text-tertiary-foreground" />
                    </div>
                    <div className="text-center relative z-10">
                        <div className="text-[10px] font-black text-tertiary-foreground/70 uppercase tracking-wider mb-1">
                            Market Avg
                        </div>
                        <div className="text-3xl font-black text-tertiary-foreground">
                            $20.00
                        </div>
                        <div className="text-[10px] text-tertiary-foreground/60 font-bold mt-1">
                            Standard Price
                        </div>
                    </div>
                </div>

                {/* Machine B (The Stock) - INTERACTIVE */}
                <button
                    onClick={() => handleSelect('B')}
                    className={cn(
                        "bg-background rounded-[2rem] border-4 border-foreground flex flex-col items-center justify-center p-4 transition-all relative overflow-hidden group",
                        selectedMachine === 'B'
                            ? "ring-4 ring-secondary/20 translate-y-[4px] translate-x-[4px] shadow-none"
                            : "shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[4px] active:translate-x-[4px] active:shadow-none"
                    )}
                >
                    <div className={cn(
                        "w-16 h-16 rounded-full flex items-center justify-center mb-3 border-2 border-foreground shadow-sm transition-transform group-hover:scale-110",
                        "bg-secondary/20 text-secondary border-secondary/30"
                    )}>
                        <DollarSign size={32} strokeWidth={3} />
                    </div>
                    <div className="text-center relative z-10">
                        <div className="text-[10px] font-black text-muted-foreground uppercase tracking-wider mb-1">
                            {gameConfig?.symbol || "Stock"}
                        </div>
                        <div className="text-3xl font-black text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>
                            ${visualPe.toFixed(2)}
                        </div>
                        <div className="text-[10px] text-secondary font-bold mt-1 group-hover:underline decoration-2 underline-offset-2">
                            TAP TO REVEAL
                        </div>
                    </div>
                </button>

            </div>

            {/* Footer Instruction */}
            <div className="bg-muted/30 rounded-xl p-3 border-2 border-foreground/5 text-center text-xs font-bold text-muted-foreground">
                Which machine offers better value?
            </div>


            {/* Feedback Overlay */}
            <AnimatePresence>
                {showFeedback && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-50 bg-card/90 backdrop-blur-[2px] flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.8, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="w-full max-w-xs bg-card border-4 border-foreground rounded-[2rem] shadow-pop p-6 text-center"
                        >
                            <div className={cn(
                                "w-16 h-16 rounded-2xl flex items-center justify-center mb-4 mx-auto border-4 border-foreground shadow-sm transform -rotate-3",
                                isExpensive ? "bg-tertiary/20 text-tertiary-foreground" : (isCheap ? "bg-primary/20 text-primary" : "bg-secondary/20 text-secondary")
                            )}>
                                {isExpensive ? <Gem size={32} strokeWidth={2.5} /> : (isCheap ? <ShoppingBag size={32} strokeWidth={2.5} /> : <Handshake size={32} strokeWidth={2.5} />)}
                            </div>

                            <h3 className="text-2xl font-black text-foreground mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                                {feedbackTitle}
                            </h3>
                            <p className="text-muted-foreground font-medium text-sm mb-6 leading-tight max-w-[90%] mx-auto">
                                {feedbackText}
                            </p>

                            <button
                                onClick={onComplete}
                                className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-bold shadow-pop hover:translate-y-0.5 hover:shadow-none transition-all flex items-center justify-center gap-2"
                            >
                                Continue to Quiz <ArrowRight size={20} strokeWidth={3} />
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    )
}
