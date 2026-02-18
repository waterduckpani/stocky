"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { TrendingUp, Users, Box, ArrowRight, CheckCircle2, AlertTriangle, RefreshCcw } from "lucide-react"
import { cn } from "@/lib/utils"

interface TheSupplySqueezeProps {
    onComplete: () => void
    ticker: string
    stockData: any
}

type Mode = "HIGH" | "LOW" | null

export default function TheSupplySqueeze({ onComplete, ticker, stockData }: TheSupplySqueezeProps) {
    const [mode, setMode] = useState<Mode>(null)
    const [buyers, setBuyers] = useState<number[]>([]) // Array of buyer IDs
    const [price, setPrice] = useState(100)

    // Progress Tracking
    const [doneHigh, setDoneHigh] = useState(false)
    const [doneLow, setDoneLow] = useState(false)
    const [showCompletion, setShowCompletion] = useState(false)

    // Reset loop for simulation
    useEffect(() => {
        setBuyers([])
        setPrice(100)

        if (!mode) return

        // 1. Release Buyers
        const timeout1 = setTimeout(() => {
            // Add 12 buyers
            setBuyers(Array.from({ length: 12 }, (_, i) => i))
        }, 500)

        // 2. Process Transaction & Price Impact
        const timeout2 = setTimeout(() => {
            if (mode === "HIGH") {
                setPrice(102) // Small bump
                setDoneHigh(true)
            } else {
                setPrice(150) // HUGE bump
                setDoneLow(true)
            }
        }, 2000)

        return () => {
            clearTimeout(timeout1)
            clearTimeout(timeout2)
        }
    }, [mode])

    // Check for total completion
    useEffect(() => {
        if (doneHigh && doneLow) {
            const t = setTimeout(() => setShowCompletion(true), 1500)
            return () => clearTimeout(t)
        }
    }, [doneHigh, doneLow])

    const handleReset = () => {
        setMode(null)
        setBuyers([])
        setPrice(100)
    }

    // Grid Configuration
    // High Float: 40 shares. Low Float: 5 shares.
    const totalSlots = 40
    const availableShares = mode === "LOW" ? 5 : 40

    return (
        <div className="w-full max-w-xl mx-auto bg-card rounded-[2rem] border-2 border-foreground shadow-pop p-6 relative overflow-hidden flex flex-col gap-6 select-none animate-pop-in">

            {/* ── Header ── */}
            <div className="text-center relative z-10">
                <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/20 text-primary border-2 border-primary/30 shadow-pop-active transform -rotate-2">
                        <Box className="w-6 h-6" strokeWidth={2.5} />
                    </div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs font-black uppercase tracking-wider border-2 border-border">
                        SUPPLY & DEMAND LAB
                    </div>
                </div>
                <h3 className="text-xl font-black text-foreground mt-2" style={{ fontFamily: 'var(--font-heading)' }}>
                    {mode === "LOW" ? "The Low Float Squeeze" : mode === "HIGH" ? "The High Float Ocean" : "Choose Market Conditions"}
                </h3>
            </div>

            {/* ── Main Stage ── */}
            <div className="relative w-full h-80 bg-background rounded-[1.5rem] border-2 border-foreground shadow-inner overflow-hidden flex flex-col p-4">

                {/* Stats Bar */}
                <div className="flex justify-between items-center mb-4 px-2">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase text-muted-foreground tracking-wider">Current Price</span>
                        <motion.span
                            key={price}
                            initial={{ scale: 1.05, color: mode === "LOW" && price > 110 ? "#ef4444" : "#1e293b" }}
                            animate={{ scale: 1, color: mode === "LOW" && price > 110 ? "#ef4444" : "#1e293b" }}
                            className="text-2xl font-black"
                        >
                            ${price}
                        </motion.span>
                    </div>
                    <div className="flex flex-col text-right">
                        <span className="text-[10px] font-black uppercase text-muted-foreground tracking-wider">Shares Available</span>
                        <span className="text-xl font-bold">{mode ? availableShares : "--"}</span>
                    </div>
                </div>

                {/* The Market Grid */}
                <div className="flex-1 rounded-xl bg-muted/30 border-2 border-dashed border-border p-2 relative">
                    {/* Grid of Shares */}
                    <div className="grid grid-cols-10 gap-1 absolute inset-2">
                        {Array.from({ length: totalSlots }).map((_, i) => {
                            const isAvailable = i < availableShares
                            const buyerIndex = i
                            const hasBuyer = buyers.length > buyerIndex
                            const isSqueezed = !isAvailable && hasBuyer // Buyer wants it, but it's not there!

                            return (
                                <motion.div
                                    key={i}
                                    className={cn(
                                        "rounded-sm transition-all duration-300",
                                        !isAvailable
                                            ? "bg-transparent" // Empty space
                                            : hasBuyer
                                                ? "bg-amber-400 scale-95 shadow-[0_0_10px_rgba(251,191,36,0.5)] border border-amber-500" // Sold -> Amber!
                                                : "bg-primary/20" // Available
                                    )}
                                >
                                    {/* Squeezed Buyer Visualization (Floating angry dot) */}
                                    {isSqueezed && (
                                        <motion.div
                                            initial={{ scale: 0.8 }}
                                            animate={{ scale: [1, 1.1, 1] }} // Reduced bounce from 1.5 to 1.1
                                            transition={{ repeat: Infinity, duration: 0.8 }}
                                            className="w-full h-full bg-red-500 rounded-full shadow-sm opacity-80"
                                        />
                                    )}
                                </motion.div>
                            )
                        })}
                    </div>

                    {/* Overlay Label */}
                    {!mode && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <p className="text-sm font-bold text-muted-foreground/40 uppercase">Select Mode Below</p>
                        </div>
                    )}
                </div>

                {/* Feedback Text */}
                <div className="mt-4 h-12 flex items-center justify-center text-center">
                    <AnimatePresence mode="wait">
                        {mode === "HIGH" && buyers.length > 0 && (
                            <motion.div
                                key="high-feedback"
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-sm font-medium text-emerald-600"
                            >
                                Smooth! Buyers found shares easily. <br />Price stays stable.
                            </motion.div>
                        )}
                        {mode === "LOW" && buyers.length > 0 && (
                            <motion.div
                                key="low-feedback"
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-sm font-bold text-red-600 flex items-center gap-2"
                            >
                                <AlertTriangle className="w-4 h-4" />
                                SQUEEZE! Too many buyers, zero shares. <br />Price must go up!
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* ── Controls ── */}
            <div className="grid grid-cols-2 gap-4">
                <button
                    onClick={() => setMode("HIGH")}
                    disabled={mode === "HIGH" && !doneHigh}
                    className={cn(
                        "relative h-20 rounded-xl border-2 transition-all active:translate-y-1 active:shadow-none flex flex-col items-center justify-center overflow-hidden group",
                        doneHigh
                            ? "bg-muted border-foreground/10 text-muted-foreground opacity-50"
                            : "bg-white border-primary shadow-pop-active hover:bg-primary/5 text-primary"
                    )}
                >
                    {doneHigh && (
                        <div className="absolute top-2 right-2 text-emerald-500">
                            <CheckCircle2 size={16} />
                        </div>
                    )}
                    <span className="font-black text-sm uppercase">High Float</span>
                    <span className="text-[10px] font-bold opacity-70">Lots of Supply</span>
                </button>

                <button
                    onClick={() => setMode("LOW")}
                    disabled={mode === "LOW" && !doneLow}
                    className={cn(
                        "relative h-20 rounded-xl border-2 transition-all active:translate-y-1 active:shadow-none flex flex-col items-center justify-center overflow-hidden group",
                        doneLow
                            ? "bg-muted border-foreground/10 text-muted-foreground opacity-50"
                            : "bg-white border-destructive shadow-pop-active hover:bg-destructive/5 text-destructive"
                    )}
                >
                    {doneLow && (
                        <div className="absolute top-2 right-2 text-destructive">
                            <CheckCircle2 size={16} />
                        </div>
                    )}
                    <span className="font-black text-sm uppercase">Low Float</span>
                    <span className="text-[10px] font-bold opacity-70">Tiny Supply</span>
                </button>
            </div>

            {/* Reset / Continue */}
            {mode && (
                <button
                    onClick={handleReset}
                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground"
                >
                    <RefreshCcw className="w-4 h-4" />
                </button>
            )}

            {/* ── Completion Modal ── */}
            <AnimatePresence>
                {showCompletion && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-50 bg-foreground/20 backdrop-blur-sm flex items-center justify-center p-6"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 10 }}
                            animate={{ scale: 1, y: 0 }}
                            className="w-full bg-card text-foreground border-2 border-foreground rounded-[2rem] shadow-pop p-6 text-center"
                        >
                            <div className="w-16 h-16 rounded-full bg-primary/10 text-primary border-2 border-primary/20 shadow-pop-active flex items-center justify-center mx-auto mb-4">
                                <TrendingUp className="w-8 h-8" strokeWidth={3} />
                            </div>
                            <h4 className="font-black text-2xl uppercase tracking-wide mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                                Concept Unlock!
                            </h4>
                            <p className="text-sm text-muted-foreground font-medium mb-6 px-4">
                                <strong>Supply Constraints</strong> drive price volatility. When everyone wants a slice of a tiny pie, the price explodes.
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
