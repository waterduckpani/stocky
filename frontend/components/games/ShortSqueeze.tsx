"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { TrendingUp, TrendingDown } from "lucide-react"
import { MinigameCompletionPopup } from "./MinigameCompletionPopup"

interface ShortSqueezeProps {
    onComplete: () => void
    ticker?: string
    stockData?: any
    gameConfig?: any
}

const TOTAL_BEARS = 8

export function ShortSqueeze({ onComplete, ticker, stockData, gameConfig }: ShortSqueezeProps) {
    const [squeezed, setSqueezed] = useState(0)
    const [phase, setPhase] = useState<"playing" | "success">("playing")
    const [priceBoost, setPriceBoost] = useState(0)

    const shortPct = stockData?.shortPercentFloat ?? stockData?.stock_data?.shortPercentFloat ?? 8.5
    const companyName = stockData?.shortName || stockData?.name || ticker || "This Stock"
    const basePrice = stockData?.price || stockData?.stock_data?.current_price || 100
    const currentPrice = (basePrice + priceBoost).toFixed(2)

    function handleSqueeze() {
        if (squeezed >= TOTAL_BEARS) return
        const jump = parseFloat((Math.random() * 2.5 + 1.5).toFixed(2))
        setPriceBoost(prev => prev + jump)
        setSqueezed(prev => {
            const next = prev + 1
            if (next === TOTAL_BEARS) setTimeout(() => setPhase("success"), 500)
            return next
        })
    }

    const positions = Array.from({ length: TOTAL_BEARS }, (_, i) => i)

    return (
        <div className="w-full max-w-2xl mx-auto space-y-4">
            <AnimatePresence mode="wait">
                {phase === "playing" && (
                    <motion.div
                        key="playing"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                    >
                        {/* Single main card */}
                        <div className="bg-card rounded-3xl border-2 border-foreground shadow-pop p-6 space-y-5">

                            {/* Header */}
                            <div>
                                <p className="font-bold text-foreground text-center">
                                    {gameConfig?.instruction || "Bears are trapped — squeeze them out!"}
                                </p>
                                <p className="text-sm text-muted-foreground text-center mt-1">
                                    <span className="font-bold text-foreground">{shortPct}%</span> of {companyName}&apos;s float is shorted. Good news just dropped — force them to cover.
                                </p>
                            </div>

                            {/* Price */}
                            <div className="bg-muted/50 rounded-2xl p-4 flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{ticker} Price</p>
                                    <motion.p
                                        key={currentPrice}
                                        initial={{ scale: 1.1 }}
                                        animate={{ scale: 1 }}
                                        transition={{ duration: 0.3 }}
                                        className="text-2xl font-black"
                                    >
                                        ${currentPrice}
                                    </motion.p>
                                </div>
                                {priceBoost > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, x: 10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="flex items-center gap-1 text-green-500 font-bold text-sm"
                                    >
                                        <TrendingUp className="w-4 h-4" />
                                        +${priceBoost.toFixed(2)} squeeze rally
                                    </motion.div>
                                )}
                            </div>

                            {/* Short position grid */}
                            <div>
                                <div className="flex justify-between items-center mb-3">
                                    <p className="text-sm font-bold text-muted-foreground">Short positions open</p>
                                    <span className="px-3 py-1 rounded-full bg-primary/10 border-2 border-primary/20 text-primary font-bold text-sm">
                                        {TOTAL_BEARS - squeezed} remaining
                                    </span>
                                </div>

                                <div className="grid grid-cols-4 gap-2">
                                    {positions.map(i => {
                                        const isOut = i < squeezed
                                        return (
                                            <AnimatePresence key={i} mode="wait">
                                                {isOut ? (
                                                    <motion.div
                                                        key="covered"
                                                        initial={{ scale: 1, opacity: 1 }}
                                                        animate={{ scale: 0.6, opacity: 0, y: -16 }}
                                                        transition={{ duration: 0.35 }}
                                                        className="h-12 rounded-xl border-2 border-dashed border-foreground/20 bg-transparent"
                                                    />
                                                ) : (
                                                    <motion.div
                                                        key="open"
                                                        initial={{ scale: 0.85 }}
                                                        animate={{ scale: 1 }}
                                                        className="h-12 rounded-xl border-2 border-foreground bg-red-500/10 flex items-center justify-center gap-1"
                                                    >
                                                        <TrendingDown className="w-3 h-3 text-red-500" strokeWidth={3} />
                                                        <span className="text-xs font-black text-red-500">SHORT</span>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        )
                                    })}
                                </div>
                            </div>

                            {/* Progress bar */}
                            <div>
                                <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-primary rounded-full"
                                        animate={{ width: `${(squeezed / TOTAL_BEARS) * 100}%` }}
                                        transition={{ duration: 0.4, ease: "easeOut" }}
                                        style={{ width: "0%" }}
                                    />
                                </div>
                                {squeezed > 0 && squeezed < TOTAL_BEARS && (
                                    <p className="text-xs text-muted-foreground text-center mt-2">
                                        Each cover = forced buying = price climbs higher
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Squeeze button — outside the card */}
                        <motion.button
                            whileTap={{ scale: 0.97 }}
                            onClick={handleSqueeze}
                            disabled={squeezed >= TOTAL_BEARS}
                            className="mt-4 w-full py-5 bg-primary text-primary-foreground rounded-xl font-black text-lg shadow-pop hover:translate-y-0.5 hover:shadow-none transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            Force Cover ({TOTAL_BEARS - squeezed} left)
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>

            <MinigameCompletionPopup
                completed={phase === "success"}
                onComplete={onComplete}
                title="Short Squeeze Complete!"
                description={`All ${TOTAL_BEARS} short sellers were forced to buy back their positions. That panic-buying drove the price up $${priceBoost.toFixed(2)}. That's a Short Squeeze.`}
                icon={TrendingUp}
            />
        </div>
    )
}
