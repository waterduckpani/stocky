"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { ArrowRight, CheckCircle2, AlertTriangle, Zap, DollarSign, TrendingDown, ArrowBigDown, ArrowBigUp, Trophy } from "lucide-react"
import confetti from "canvas-confetti"
import { MinigameCompletionPopup } from "./MinigameCompletionPopup"

interface TheLiquidityExitProps {
    onComplete: () => void
    ticker?: string
}

type LiquidityMode = "HIGH" | "LOW" | null

interface BuyOrder {
    id: number
    price: number
}

export default function TheLiquidityExit({ onComplete, ticker = "STOCK" }: TheLiquidityExitProps) {
    const [activeMode, setActiveMode] = useState<LiquidityMode>(null)

    // Progress
    const [completedHigh, setCompletedHigh] = useState(false)
    const [completedLow, setCompletedLow] = useState(false)

    // Trading
    const [price, setPrice] = useState(220)
    const [isFilled, setIsFilled] = useState(false)
    const [buyers, setBuyers] = useState<BuyOrder[]>([])
    const nextId = useRef(0)

    // Reset on mode change
    useEffect(() => {
        setBuyers([])
        setPrice(220)
        setIsFilled(false)
        nextId.current = 0
    }, [activeMode])

    // Streaming buy orders
    useEffect(() => {
        if (!activeMode || isFilled) return

        const interval = setInterval(() => {
            if (activeMode === "HIGH") {
                if (Math.random() > 0.25) {
                    setBuyers(prev => {
                        if (prev.length >= 4) return prev
                        return [{ id: nextId.current++, price: 220 }, ...prev]
                    })
                }
            } else {
                if (price <= 212 && Math.random() > 0.4) {
                    setBuyers(prev => {
                        if (prev.length >= 4) return prev
                        return [{ id: nextId.current++, price }, ...prev]
                    })
                } else if (price > 212) {
                    setBuyers([])
                }
            }
        }, 700)

        return () => clearInterval(interval)
    }, [activeMode, price, isFilled])

    const handleSell = () => {
        if (buyers.length === 0) return
        setIsFilled(true)

        const mode = activeMode
        confetti({
            particleCount: 80,
            spread: 60,
            origin: { y: 0.6 },
            colors: mode === "HIGH" ? ['#3BB273', '#ffffff'] : ['#FBBF24', '#ffffff'],
        })

        if (mode === "HIGH") setCompletedHigh(true)
        if (mode === "LOW") setCompletedLow(true)

        setTimeout(() => {
            setActiveMode(null)
            setIsFilled(false)
        }, 2500)
    }

    const slippage = 220 - price
    const hasBuyers = buyers.length > 0
    const allDone = completedHigh && completedLow

    return (
        <div className="w-full max-w-xl mx-auto bg-card rounded-[2rem] border-2 border-foreground shadow-pop p-6 relative overflow-hidden flex flex-col gap-6 animate-pop-in select-none">

            {/* ── 1. Header (Matching ThePriceAnchor / TheEarningsReaction) ── */}
            <div className="text-center relative z-10">
                <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/20 text-primary border-2 border-primary/30 shadow-pop-active transform -rotate-3">
                        <DollarSign className="w-6 h-6" strokeWidth={2.5} />
                    </div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs font-black uppercase tracking-wider border-2 border-border">
                        Liquidity Lab
                    </div>
                </div>
                <h3 className="text-xl font-black text-foreground mt-2" style={{ fontFamily: 'var(--font-heading)' }}>
                    The Liquidity Exit
                </h3>
                <p className="text-sm font-medium text-muted-foreground mt-1">
                    {!activeMode && "Choose a market condition below."}
                    {activeMode === "HIGH" && "Buyers everywhere — sell your shares!"}
                    {activeMode === "LOW" && "No buyers in sight. Lower your price."}
                </p>
            </div>

            {/* ── 2. Game Stage (Matching ThePriceAnchor inner box) ── */}
            <div className={cn(
                "relative w-full h-96 bg-background rounded-[1.5rem] border-2 border-foreground shadow-inner overflow-hidden flex flex-col p-5 transition-colors duration-500",
                activeMode === "HIGH" && "bg-primary/[0.03]",
                activeMode === "LOW" && "bg-tertiary/[0.03]"
            )}>

                {/* Subtle background grid for depth */}
                <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
                    <div className="w-full h-full" style={{
                        backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
                        backgroundSize: '24px 24px'
                    }} />
                </div>

                <div className="flex gap-4 flex-1 relative z-10">

                    {/* LEFT: Your Sell Order */}
                    <div className="flex-1 flex flex-col gap-3 border-r-2 border-dashed border-border pr-4">
                        <div className="flex items-center gap-2">
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Your Sell Order</p>
                            {activeMode && !isFilled && (
                                <motion.div
                                    animate={{ scale: [1, 1.3, 1] }}
                                    transition={{ repeat: Infinity, duration: 2 }}
                                    className={cn(
                                        "w-2 h-2 rounded-full",
                                        activeMode === "HIGH" ? "bg-primary" : "bg-tertiary"
                                    )}
                                />
                            )}
                        </div>

                        <motion.div
                            key={price}
                            initial={{ scale: 0.95 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 500, damping: 25 }}
                        >
                            <div className="flex items-baseline gap-0.5">
                                <span className="text-lg text-muted-foreground font-bold">$</span>
                                <span className={cn(
                                    "text-4xl font-black tracking-tight transition-colors duration-300",
                                    isFilled ? "text-primary" : slippage > 0 ? "text-destructive" : "text-foreground"
                                )}>{price}</span>
                            </div>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mt-0.5">{ticker} • Limit</p>
                        </motion.div>

                        {/* Slider for LOW mode (range input matching ThePriceAnchor slider style) */}
                        {activeMode === "LOW" && !isFilled && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-auto space-y-2"
                            >
                                <div className="flex justify-between text-[10px] font-bold text-muted-foreground">
                                    <span>$200</span>
                                    <span>$220</span>
                                </div>
                                {/* Track matching ThePriceAnchor: bg-muted rounded-full border-2 border-border */}
                                <div className="relative h-12 flex items-center">
                                    <div className="w-full h-4 bg-muted rounded-full border-2 border-border" />
                                    <input
                                        type="range"
                                        min={200}
                                        max={220}
                                        step={1}
                                        value={price}
                                        onChange={(e) => setPrice(Number(e.target.value))}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-30"
                                    />
                                    {/* Visual Thumb matching ThePriceAnchor */}
                                    <div
                                        className="absolute top-1/2 -translate-y-1/2 w-10 h-10 -ml-5 pointer-events-none z-20"
                                        style={{ left: `${((price - 200) / 20) * 100}%` }}
                                    >
                                        <div className="w-10 h-10 rounded-full bg-white border-4 border-primary shadow-pop flex items-center justify-center">
                                            <DollarSign className="w-5 h-5 text-primary" />
                                        </div>
                                        <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 bg-foreground text-background text-xs font-bold px-2 py-0.5 rounded-md whitespace-nowrap">
                                            ${price}
                                        </div>
                                    </div>
                                </div>
                                {slippage > 0 && (
                                    <p className="text-[11px] font-black text-destructive text-right animate-pulse mt-1">
                                        Slippage: -${slippage}/share
                                    </p>
                                )}
                            </motion.div>
                        )}

                        {/* Sell button — same pattern as ThePriceAnchor "Lock In Price" */}
                        {activeMode && !isFilled && (
                            <button
                                onClick={handleSell}
                                disabled={!hasBuyers}
                                className={cn(
                                    "w-full py-4 rounded-xl font-bold border-2 transition-all flex items-center justify-center gap-2 mt-auto",
                                    hasBuyers
                                        ? "bg-primary text-primary-foreground border-foreground shadow-pop hover:translate-y-0.5 hover:shadow-none"
                                        : "bg-muted text-muted-foreground border-border cursor-not-allowed"
                                )}
                            >
                                {hasBuyers ? (
                                    <>SELL NOW <CheckCircle2 className="w-5 h-5" /></>
                                ) : "NO BUYERS"}
                            </button>
                        )}

                        {isFilled && (
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="w-full py-4 rounded-xl bg-primary/10 border-2 border-primary text-primary font-black text-center mt-auto flex items-center justify-center gap-2"
                            >
                                <CheckCircle2 className="w-5 h-5" /> FILLED @ ${price}
                            </motion.div>
                        )}

                        {!activeMode && (
                            <div className="flex-1 flex items-center justify-center">
                                <p className="text-xs text-muted-foreground font-medium text-center opacity-50">Select a mode below ↓</p>
                            </div>
                        )}
                    </div>

                    {/* RIGHT: Live Order Book */}
                    <div className="w-[140px] flex flex-col gap-2">
                        <div className="flex items-center justify-center gap-1.5">
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest text-center">Live Buyers</p>
                            {hasBuyers && (
                                <motion.div
                                    animate={{ opacity: [0.4, 1, 0.4] }}
                                    transition={{ repeat: Infinity, duration: 1.5 }}
                                    className="w-1.5 h-1.5 rounded-full bg-primary"
                                />
                            )}
                        </div>

                        <div className={cn(
                            "flex-1 rounded-xl border-2 p-2 flex flex-col-reverse justify-end gap-1.5 overflow-hidden relative transition-all duration-300",
                            hasBuyers
                                ? "bg-primary/[0.06] border-primary/30"
                                : "bg-muted/20 border-border/60"
                        )}>
                            <AnimatePresence>
                                {buyers.map((b, i) => (
                                    <motion.div
                                        key={b.id}
                                        initial={{ x: 40, opacity: 0, scale: 0.6 }}
                                        animate={{ x: 0, opacity: 1, scale: 1 }}
                                        exit={{ x: -20, opacity: 0, scale: 0.8 }}
                                        transition={{ type: "spring", stiffness: 500, damping: 30, delay: i * 0.05 }}
                                        className="w-full bg-card rounded-lg border-2 border-primary/20 p-2 flex items-center justify-between shadow-sm"
                                    >
                                        <div className="flex items-center gap-1.5">
                                            <motion.div
                                                animate={{ scale: [1, 1.4, 1] }}
                                                transition={{ repeat: Infinity, duration: 2, delay: i * 0.3 }}
                                                className="w-2.5 h-2.5 rounded-full bg-primary"
                                            />
                                            <span className="text-[9px] font-black text-primary uppercase">Bid</span>
                                        </div>
                                        <span className="font-black text-sm text-foreground">${b.price}</span>
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {buyers.length === 0 && activeMode && !isFilled && (
                                <motion.div
                                    animate={{ opacity: [0.2, 0.4, 0.2] }}
                                    transition={{ repeat: Infinity, duration: 3 }}
                                    className="absolute inset-0 flex flex-col items-center justify-center gap-2"
                                >
                                    <div className="w-8 h-8 rounded-full border-2 border-dashed border-foreground/20 flex items-center justify-center">
                                        <TrendingDown className="w-4 h-4 text-foreground/20" />
                                    </div>
                                    <span className="text-[10px] font-bold uppercase text-foreground/20">No Bids</span>
                                    {activeMode === "LOW" && (
                                        <span className="text-[9px] font-bold text-tertiary/60">Lower price ←</span>
                                    )}
                                </motion.div>
                            )}

                            {!activeMode && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 opacity-20">
                                    {[0, 1, 2].map(i => (
                                        <motion.div
                                            key={i}
                                            animate={{ opacity: [0.3, 0.6, 0.3] }}
                                            transition={{ repeat: Infinity, duration: 2, delay: i * 0.5 }}
                                            className="w-[80%] h-8 rounded-lg border-2 border-dashed border-foreground/30"
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>

            {/* ── 3. Controls (Copied from TheEarningsReaction Buy/Sell buttons) ── */}
            <div className="grid grid-cols-2 gap-4">
                <button
                    onClick={() => !activeMode && !completedHigh && setActiveMode("HIGH")}
                    className={cn(
                        "relative h-24 rounded-2xl border-2 transition-all duration-200 active:translate-y-1 active:shadow-none flex flex-col items-center justify-center gap-1 group overflow-hidden",
                        completedHigh
                            ? "bg-primary/10 border-primary/30 text-primary cursor-default"
                            : activeMode === "HIGH"
                                ? "bg-primary/10 border-primary shadow-pop-active text-primary"
                                : activeMode !== null
                                    ? "bg-card border-border text-muted-foreground opacity-50 cursor-not-allowed"
                                    : "bg-card border-primary shadow-pop-active text-primary hover:bg-primary/5"
                    )}
                >
                    <div className="absolute top-2 right-2 opacity-20">
                        <Zap size={20} />
                    </div>
                    {completedHigh ? (
                        <CheckCircle2 className="w-8 h-8 z-10" />
                    ) : (
                        <Zap className="w-8 h-8 z-10 fill-primary/20" />
                    )}
                    <div className="flex flex-col items-center leading-none z-10">
                        <span className="font-black text-sm uppercase mt-1">{completedHigh ? "DONE" : "HIGH"}</span>
                        <span className="text-[10px] opacity-70 font-bold">{completedHigh ? "COMPLETED" : "LOTS OF BUYERS"}</span>
                    </div>
                </button>

                {/* LOW LIQUIDITY — Copied from TheEarningsReaction SELL button */}
                <button
                    onClick={() => !activeMode && !completedLow && setActiveMode("LOW")}
                    className={cn(
                        "relative h-24 rounded-2xl border-2 transition-all duration-200 active:translate-y-1 active:shadow-none flex flex-col items-center justify-center gap-1 group overflow-hidden",
                        completedLow
                            ? "bg-tertiary/10 border-tertiary/30 text-tertiary cursor-default"
                            : activeMode === "LOW"
                                ? "bg-tertiary/10 border-tertiary shadow-pop-active text-tertiary"
                                : activeMode !== null
                                    ? "bg-card border-border text-muted-foreground opacity-50 cursor-not-allowed"
                                    : "bg-card border-tertiary shadow-pop-active text-tertiary hover:bg-tertiary/5"
                    )}
                >
                    <div className="absolute top-2 right-2 opacity-20">
                        <AlertTriangle size={20} />
                    </div>
                    {completedLow ? (
                        <CheckCircle2 className="w-8 h-8 z-10" />
                    ) : (
                        <AlertTriangle className="w-8 h-8 z-10 fill-tertiary/20" />
                    )}
                    <div className="flex flex-col items-center leading-none z-10">
                        <span className="font-black text-sm uppercase mt-1">{completedLow ? "DONE" : "LOW"}</span>
                        <span className="text-[10px] opacity-70 font-bold">{completedLow ? "COMPLETED" : "FEW BUYERS"}</span>
                    </div>
                </button>
            </div>

            <MinigameCompletionPopup
                completed={allDone}
                onComplete={onComplete}
                title="Liquidity Legend! 🌊"
                description="You've mastered the exit! Whether it's a flood of buyers or a desert, you know how to find the price that gets the deal done."
                icon={Trophy}
            />

        </div>
    )
}
