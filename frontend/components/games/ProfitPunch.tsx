"use client"

import React, { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { ArrowDown, DollarSign, Sparkles, ArrowRight } from 'lucide-react'
import confetti from "canvas-confetti"

// Geometric Components Re-implmented for Profit Punch
// Style Reference: ValuationStation.tsx & globals.css

interface ProfitPunchProps {
    onComplete: () => void
    totalRevenue: number
    netIncome: number
    symbol?: string
    currencyCode?: string
    fiscalYear?: string
}

type GameState = "intro" | "playing" | "finished"

export function ProfitPunch({
    onComplete,
    totalRevenue,
    netIncome,
    symbol = "STOCK",
    currencyCode = "USD",
    fiscalYear = "TTM"
}: ProfitPunchProps) {
    const [gameState, setGameState] = useState<GameState>("intro")

    // 1. Calculate Real Profit Margin
    const revenue = totalRevenue || 1
    const income = netIncome || 0
    const rawMargin = income / revenue
    // Clamp for visuals: Min 10%, Max 90%
    const profitMargin = Math.max(0.10, Math.min(rawMargin, 0.90))
    const profitPercentage = Math.round(profitMargin * 100)

    // Select Locale based on Currency
    const locale = currencyCode === 'INR' ? 'en-IN' : 'en-US'

    // 2. Derive Expenses
    // The "Expense Block" fills the rest (1 - profitMargin)
    // We split this block into 3 chunks for the gameplay.
    const totalExpenseRatio = 1 - profitMargin
    const cogsHeight = totalExpenseRatio * 0.50
    const opexHeight = totalExpenseRatio * 0.35
    const taxHeight = totalExpenseRatio * 0.15

    // State: Track which expenses have been "punched in"
    const [punchedBatches, setPunchedBatches] = useState<string[]>([])

    const isPunched = (id: string) => punchedBatches.includes(id)
    const allPunched = punchedBatches.length === 3

    // Current profit display (starts at 100%, drops as expenses are punched in)
    const currentPunchedExpenseRatio = useMemo(() => {
        let ratio = 0
        if (isPunched('cogs')) ratio += cogsHeight
        if (isPunched('opex')) ratio += opexHeight
        if (isPunched('tax')) ratio += taxHeight
        return ratio
    }, [punchedBatches, cogsHeight, opexHeight, taxHeight])

    const displayedProfitPercentage = Math.round((1 - currentPunchedExpenseRatio) * 100)

    const expenses = useMemo(() => [
        {
            id: 'cogs',
            label: 'Cost of Goods',
            desc: 'Materials & Labor',
            heightPct: cogsHeight * 100,
            color: 'bg-secondary',
            textColor: 'text-secondary-foreground',
        },
        {
            id: 'opex',
            label: 'Operating Expenses',
            desc: 'Marketing, R&D, Admin',
            heightPct: opexHeight * 100,
            color: 'bg-tertiary',
            textColor: 'text-tertiary-foreground',
        },
        {
            id: 'tax',
            label: 'Taxes & Interest',
            desc: 'The Gov & Banks',
            heightPct: taxHeight * 100,
            color: 'bg-destructive',
            textColor: 'text-destructive-foreground',
        }
    ], [cogsHeight, opexHeight, taxHeight])

    const handlePunch = (id: string) => {
        if (!isPunched(id)) {
            setPunchedBatches(prev => [...prev, id])
        }
    }

    // Effect: check completion
    useEffect(() => {
        if (allPunched && gameState === "playing") {
            const timer = setTimeout(() => {
                setGameState("finished")
                confetti({
                    particleCount: 150,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ['#3BB273', '#729bf4', '#FBBF24']
                })
            }, 1000)
            return () => clearTimeout(timer)
        }
    }, [allPunched, gameState])

    return (
        <div className="w-full max-w-2xl mx-auto space-y-6 animate-pop-in min-h-[550px] flex flex-col items-center justify-center">

            {/* External Header (Matches Lesson 4 & 6) */}
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-black text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>
                    Profit Punch 🥊
                </h2>
                <p className="text-muted-foreground font-medium text-lg">
                    Revenue is vanity. Profit is sanity.
                </p>
            </div>

            <AnimatePresence mode="wait">

                {/* --- STATE: INTRO --- */}
                {gameState === "intro" && (
                    <motion.div
                        key="intro"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="w-full max-w-xl bg-[#FFFDF5] border-4 border-foreground rounded-[2.5rem] p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center space-y-8 relative overflow-hidden"
                    >
                        {/* Decorative Background Icon */}
                        <div className="absolute top-[-20px] left-[-20px] opacity-5 rotate-12">
                            <DollarSign size={150} />
                        </div>

                        <div className="w-24 h-24 mx-auto bg-primary/10 rounded-full flex items-center justify-center border-4 border-primary/20 mb-4">
                            <Sparkles className="w-12 h-12 text-primary animate-pulse" />
                        </div>

                        <div className="relative z-10 space-y-4">
                            <h3 className="text-4xl font-black text-foreground tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                                100% Profit... Right?
                            </h3>
                            <p className="text-xl text-muted-foreground font-bold max-w-md mx-auto leading-relaxed">
                                Revenue looks like pure profit at first.
                                <br /><span className="text-foreground">Punch in the costs</span> to see what&apos;s really left!
                            </p>
                        </div>

                        <div className="pt-4 relative z-10">
                            <button
                                onClick={() => setGameState("playing")}
                                className="w-full max-w-xs py-4 bg-primary text-primary-foreground rounded-xl font-bold shadow-pop hover:translate-y-0.5 hover:shadow-none transition-all flex items-center justify-center gap-2 mx-auto text-xl"
                            >
                                Start Punching
                                <ArrowRight className="w-6 h-6" strokeWidth={3} />
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* --- STATE: PLAYING --- */}
                {gameState === "playing" && (
                    <motion.div
                        key="playing"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.4 }}
                        className="w-full bg-card border-4 border-foreground rounded-[2.5rem] p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row gap-8 items-stretch relative"
                    >
                        {/* Status Tag */}
                        <div className="absolute top-8 left-8 hidden md:block">
                            <div className="inline-block px-3 py-1 bg-foreground text-background rounded-lg text-xs font-black uppercase tracking-widest">
                                Status: Auditing
                            </div>
                        </div>

                        {/* Left: The Stack */}
                        <div className="flex-1 flex flex-col items-center justify-end min-h-[400px] pt-12">
                            {/* Revenue Container */}
                            <div className="relative w-48 h-[360px] rounded-2xl border-[3px] border-foreground overflow-hidden bg-muted/10 shadow-inner flex flex-col justify-start"> {/* Changed justify-end to justify-start for top-down stacking */}

                                {/* Label: Total Revenue */}
                                <div className="absolute -top-8 left-0 right-0 text-center">
                                    <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Total Revenue</span>
                                </div>

                                {/* STACK: ABSOLUTE SIZES based on Revenue % */}

                                {/* 1. Expenses Section (Top) */}
                                {expenses.map((exp) => (
                                    <div
                                        key={exp.id}
                                        className="w-full relative transition-[height] duration-500 ease-in-out"
                                        style={{ height: isPunched(exp.id) ? `${exp.heightPct}%` : '0%' }}
                                    >
                                        <AnimatePresence>
                                            {isPunched(exp.id) && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: "100%" }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    transition={{ duration: 0.5, ease: "circOut" }}
                                                    className={cn(
                                                        "w-full h-full border-b-[2px] border-foreground/10 flex items-center justify-center relative z-20 overflow-hidden",
                                                        exp.color
                                                    )}
                                                >
                                                    <motion.span
                                                        initial={{ scale: 0.5, opacity: 0 }}
                                                        animate={{ scale: 1, opacity: 1 }}
                                                        transition={{ delay: 0.2 }}
                                                        className={cn("text-xs font-black uppercase opacity-90 tracking-wider text-center px-1 truncate", exp.textColor)}
                                                    >
                                                        {exp.label}
                                                    </motion.span>
                                                    {/* Texture */}
                                                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/diagonal-stripes.png')] pointer-events-none" />
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ))}

                                {/* 2. Profit Section (Remaining Space) */}
                                {/* This fills the rest of the height automatically using flex-1, 
                                    which is mathematically correct given that expenses take up their exact % space.
                                    Expenses + Profit = 100% of Revenue. 
                                    If Expenses is 80%, this will be 20%. */}
                                <motion.div
                                    className="bg-primary w-full flex-1 flex items-center justify-center relative z-10 border-t-2 border-foreground/10 transition-all duration-500 ease-in-out min-h-0"
                                >
                                    <div className="text-center text-primary-foreground drop-shadow-md">
                                        <span className="font-black text-2xl">
                                            {displayedProfitPercentage}%
                                        </span>
                                        <div className="text-[10px] font-bold uppercase opacity-80">PROFIT</div>
                                    </div>
                                </motion.div>
                            </div>
                            <div className="mt-6 font-black text-xl text-foreground">
                                {symbol}
                            </div>
                        </div>

                        {/* Right: The Controls */}
                        <div className="flex-1 flex flex-col justify-center gap-4">
                            <div className="text-center mb-4 md:text-left">
                                <h3 className="font-bold text-2xl font-heading">Expense Sheet</h3>
                                <p className="text-sm text-muted-foreground font-medium">Punch them in to see the truth!</p>
                            </div>

                            {expenses.map((exp) => (
                                <motion.button
                                    key={exp.id}
                                    onClick={() => handlePunch(exp.id)}
                                    disabled={isPunched(exp.id)}
                                    layout
                                    className={cn(
                                        "relative w-full h-20 rounded-2xl border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-4 transition-all overflow-hidden group hover:translate-y-1 hover:shadow-none hover:border-black active:translate-y-2 disabled:opacity-40 disabled:pointer-events-none disabled:shadow-none disabled:translate-y-1",
                                        exp.color,
                                        "px-6"
                                    )}
                                >
                                    <div className="flex items-center gap-4 w-full">
                                        <div className="w-10 h-10 rounded-full bg-white/30 flex items-center justify-center text-foreground font-black text-lg border-2 border-foreground/10 group-hover:scale-110 transition-transform flex-shrink-0">
                                            <ArrowDown size={20} className="group-hover:translate-y-1 transition-transform" />
                                        </div>
                                        <div className="text-left flex-1 min-w-0">
                                            <div className={cn("font-black uppercase text-base leading-none mb-1 truncate", exp.textColor)}>{exp.label}</div>
                                            <div className={cn("text-xs font-bold opacity-80 truncate", exp.textColor)}>{exp.desc}</div>
                                        </div>
                                    </div>
                                    {/* Checkmark when punched */}
                                    {isPunched(exp.id) && (
                                        <div className="absolute right-4 text-foreground/50 font-black text-xl">
                                            ✓
                                        </div>
                                    )}
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* --- STATE: FINISHED --- */}
                {gameState === "finished" && (
                    <motion.div
                        key="finished"
                        initial={{ opacity: 0, scale: 0.9, rotate: -1 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        className="w-full max-w-xl bg-[#FFFDF5] border-4 border-foreground rounded-[2.5rem] p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center space-y-8 relative overflow-hidden"
                    >
                        {/* Confetti / Sparkle Decor */}
                        <div className="absolute top-0 right-0 p-8 opacity-10 text-primary">
                            <DollarSign size={200} className="rotate-12" />
                        </div>

                        <div className="w-24 h-24 mx-auto bg-green-100 rounded-full flex items-center justify-center border-4 border-green-600 text-green-700 shadow-sm mb-2 animate-bounce">
                            <DollarSign size={40} strokeWidth={4} />
                        </div>

                        <div className="relative z-10">
                            <h2 className="text-4xl font-black font-heading tracking-tight mb-2 text-foreground">
                                Reality Check!
                            </h2>
                            <p className="text-muted-foreground font-bold text-lg mb-8">
                                After all expenses, here is what&apos;s actually left.
                            </p>

                            <div className="bg-white rounded-2xl p-6 border-2 border-foreground shadow-sm mb-8 transform -rotate-1 hover:rotate-0 transition-transform">
                                <div className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-2">
                                    Net Income ({fiscalYear})
                                </div>
                                <div className="text-5xl font-black text-foreground tracking-tighter">
                                    {new Intl.NumberFormat(locale, {
                                        style: 'currency',
                                        currency: currencyCode,
                                        notation: 'compact',
                                        maximumFractionDigits: 1
                                    }).format(income)}
                                </div>
                                <div className="inline-block mt-2 bg-primary/20 text-primary-foreground px-3 py-1 rounded-full text-xs font-black uppercase">
                                    {Math.round(rawMargin * 100)}% Margin
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={onComplete}
                            className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-bold shadow-pop hover:translate-y-0.5 hover:shadow-none transition-all flex items-center justify-center gap-2 text-xl"
                        >
                            Continue to Quiz
                            <ArrowRight className="w-6 h-6" strokeWidth={3} />
                        </button>
                    </motion.div>
                )}

            </AnimatePresence>
        </div>
    )
}
