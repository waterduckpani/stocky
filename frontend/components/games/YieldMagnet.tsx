"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Slider } from '@/components/ui/slider'
import { cn } from '@/lib/utils'
import { Magnet, DollarSign, CheckCircle2, ArrowRight, Coins } from 'lucide-react'

interface YieldMagnetProps {
    onComplete: () => void
    gameConfig?: {
        instruction?: string
        base_dividend?: number
    }
    stockData?: {
        price?: number
        dividendRate?: number
    }
}

export default function YieldMagnet({ onComplete, gameConfig, stockData }: YieldMagnetProps) {
    // Base values from props or defaults
    // Robustly parse baseDividend, ignoring placeholder strings like "{dividendRate}"
    const stockDividendRate = stockData?.dividendRate;
    const configBaseDiv = gameConfig?.base_dividend;

    let baseDividend = 2.0;
    if (configBaseDiv && !isNaN(Number(configBaseDiv)) && !String(configBaseDiv).includes('{')) {
        baseDividend = Number(configBaseDiv);
    } else if (stockDividendRate && !isNaN(Number(stockDividendRate))) {
        baseDividend = Number(stockDividendRate);
    }

    const initialPrice = stockData?.price || 100

    // Slider state (price range from 30% to 150% of initial price)
    const minPrice = Math.round(initialPrice * 0.3)
    const maxPrice = Math.round(initialPrice * 1.5)
    const [currentPrice, setCurrentPrice] = useState([initialPrice])

    const [hasInteracted, setHasInteracted] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)

    // Derived values
    const price = currentPrice[0]
    const yieldPercent = (baseDividend / price) * 100


    // Magnet size scales inversely with price (lower price = bigger magnet)
    const magnetScale = Math.min(1.5, Math.max(0.5, (initialPrice / price)))

    // Win condition: User finds the "sweet spot" (price at or near minimum to see max yield)
    const handleSliderChange = (value: number[]) => {
        setCurrentPrice(value)
    }

    const handleSliderCommit = (value: number[]) => {
        // Trigger success when price is lowish (within 20% of min) and user hasn't completed yet
        if (value[0] <= minPrice * 1.2 && !hasInteracted) {
            setHasInteracted(true)
            setTimeout(() => setShowSuccess(true), 1500)
        }
    }

    // Coin count: More coins appear as yield increases
    const coinCount = Math.min(8, Math.floor(yieldPercent / 0.5))

    return (
        <div className="w-full max-w-xl mx-auto bg-card rounded-[2.5rem] border-4 border-foreground shadow-pop p-6 relative overflow-hidden flex flex-col gap-6 animate-pop-in select-none">

            {/* 1. Header Area */}
            <div className="text-center relative z-10">
                <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/20 text-primary border-2 border-primary/30 shadow-sm transform -rotate-2">
                        <Magnet className="w-6 h-6" strokeWidth={2.5} />
                    </div>
                    <h3 className="text-2xl font-black text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>
                        The Yield Magnet
                    </h3>
                </div>
                <p className="text-muted-foreground font-bold text-base leading-tight max-w-sm mx-auto">
                    {gameConfig?.instruction || "Slide the price down to see your 'Yield Magnet' grow stronger!"}
                </p>
            </div>

            {/* 2. Visual Stage */}
            <div className="relative w-full h-auto min-h-[220px] bg-muted/20 rounded-[2rem] border-2 border-dashed border-foreground/20 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8 p-6 shadow-inner overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5 pointer-events-none"
                    style={{ backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)', backgroundSize: '14px 14px' }} />

                {/* Price Block (Left) */}
                <motion.div
                    animate={{ scale: price > initialPrice ? 1.05 : (price < initialPrice * 0.5 ? 0.9 : 1) }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="flex-1 w-full bg-background border-2 border-secondary/30 rounded-2xl p-4 text-center relative z-10 shadow-pop"
                >
                    <div className="text-[10px] font-black text-secondary uppercase tracking-wider mb-1">
                        Stock Price
                    </div>
                    <div className="text-3xl font-black text-secondary" style={{ fontFamily: 'var(--font-heading)' }}>
                        ${price.toFixed(0)}
                    </div>
                </motion.div>

                {/* Magnet Centerpiece */}
                <motion.div
                    animate={{ scale: magnetScale }}
                    className="relative z-30 shrink-0"
                >
                    <div className={cn(
                        "w-16 h-16 rounded-2xl border-4 flex items-center justify-center shadow-pop transition-all duration-300",
                        yieldPercent > 5
                            ? "bg-tertiary text-tertiary-foreground border-foreground shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                            : "bg-background border-foreground text-foreground"
                    )}>
                        <Magnet className="w-8 h-8 transform -rotate-45" strokeWidth={3} />
                    </div>
                </motion.div>

                {/* Yield Block (Right) */}
                <motion.div
                    animate={{
                        scale: Math.min(1.2, 1 + (yieldPercent / 30)),
                        y: yieldPercent > 5 ? -5 : 0
                    }}
                    className={cn(
                        "flex-1 w-full border-2 rounded-2xl p-4 text-center relative z-10 shadow-pop transition-all duration-300",
                        yieldPercent > 4
                            ? "bg-primary text-primary-foreground border-foreground shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                            : "bg-background border-foreground text-primary"
                    )}
                >
                    <div className={cn(
                        "text-[10px] font-black uppercase tracking-wider mb-1",
                        yieldPercent > 4 ? "text-primary-foreground/90" : "text-primary/80"
                    )}>
                        Yield %
                    </div>
                    <div className="text-3xl font-black" style={{ fontFamily: 'var(--font-heading)' }}>
                        {isNaN(yieldPercent) ? "0.00" : yieldPercent.toFixed(2)}%
                    </div>
                </motion.div>

                {/* Floating Coins (Overlay) */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <AnimatePresence>
                        {Array.from({ length: coinCount }).map((_, i) => (
                            <motion.div
                                key={i}
                                initial={{ y: 200, opacity: 0, rotate: 0, x: (i % 2 === 0 ? -20 : 20) }}
                                animate={{
                                    y: -200,
                                    opacity: [0, 1, 0],
                                    rotate: i % 2 === 0 ? 360 : -360,
                                }}
                                transition={{ duration: 2.5, ease: "easeOut", delay: i * 0.2 }}
                                className="absolute left-1/2 top-1/2 text-tertiary"
                            >
                                <Coins className="w-8 h-8 drop-shadow-md" fill="currentColor" strokeWidth={1.5} />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Success Message Overlay */}
                <AnimatePresence>
                    {showSuccess && (
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            className="absolute inset-0 bg-background/90 backdrop-blur-[2px] z-30 flex items-center justify-center p-4 rounded-[1.8rem]"
                        >
                            <div className="bg-primary text-primary-foreground px-6 py-4 rounded-2xl font-black border-4 border-foreground shadow-pop flex flex-col items-center gap-2 text-center transform rotate-2">
                                <CheckCircle2 className="w-8 h-8" />
                                <span className="text-xl">Yield Maximized!</span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* 3. Slider Control */}
            <div className="px-2">
                <div className="flex justify-between text-xs font-bold text-muted-foreground mb-2">
                    <span>${minPrice} (Low)</span>
                    <span>${maxPrice} (High)</span>
                </div>
                <Slider
                    value={currentPrice}
                    onValueChange={handleSliderChange}
                    onValueCommit={handleSliderCommit}
                    min={minPrice}
                    max={maxPrice}
                    step={1}
                    className="w-full"
                />
            </div>

            {/* 4. Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/20 p-4 rounded-2xl border-2 border-border border-b-4 flex flex-col items-center justify-center gap-1">
                    <div className="flex items-center gap-2 text-muted-foreground font-black text-xs uppercase tracking-wider">
                        <Coins className="w-4 h-4" /> Dividend
                    </div>
                    <div className="text-2xl font-black text-foreground">
                        ${baseDividend.toFixed(2)}
                    </div>
                    <div className="text-[10px] text-muted-foreground/60">
                        Per Share / Year
                    </div>
                </div>

                <div className={cn(
                    "p-4 rounded-2xl border-2 border-b-4 flex flex-col items-center justify-center gap-1 transition-colors",
                    hasInteracted ? "bg-primary/20 border-primary/50" : "bg-muted/20 border-border"
                )}>
                    <div className="flex items-center gap-2 text-muted-foreground font-black text-xs uppercase tracking-wider">
                        <Magnet className="w-4 h-4" /> Yield %
                    </div>
                    <div className={cn(
                        "text-2xl font-black",
                        hasInteracted ? "text-primary" : "text-foreground"
                    )}>
                        {yieldPercent.toFixed(2)}%
                    </div>
                    <div className="text-[10px] text-muted-foreground/60">
                        {hasInteracted ? "Max Power! ✓" : "Slide to boost!"}
                    </div>
                </div>
            </div>

            {/* 5. Success Overlay */}
            <AnimatePresence>
                {showSuccess && (
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
                            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 mx-auto border-4 border-foreground shadow-sm transform -rotate-3 bg-primary/20 text-primary">
                                <CheckCircle2 size={32} strokeWidth={2.5} />
                            </div>

                            <h3 className="text-2xl font-black text-foreground mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                                Magnet Maxed! 🧲
                            </h3>
                            <p className="text-muted-foreground font-medium text-sm mb-4 leading-relaxed">
                                Buying when prices are low gives you a <span className="font-bold text-primary">higher yield</span> — your money works harder for you!
                            </p>

                            <button
                                onClick={onComplete}
                                className="w-full bg-primary text-primary-foreground rounded-xl py-4 text-base font-bold shadow-pop hover:translate-y-0.5 hover:shadow-none transition-all flex items-center justify-center gap-2"
                            >
                                Continue to Quiz <ArrowRight size={18} strokeWidth={3} />
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
