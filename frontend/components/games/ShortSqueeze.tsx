"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { TrendingUp } from "lucide-react"
import { MinigameCompletionPopup } from "./MinigameCompletionPopup"

interface ShortSqueezeProps {
    onComplete: () => void
    ticker?: string
    stockData?: any
    gameConfig?: any
}

const TOTAL_BEARS = 7

// Each bear has an entry price (what they shorted at) and a cover price (their pain threshold)
const BEARS = [
    { id: 1, emoji: "🐻", entryPrice: 120, label: "Shorted at $120" },
    { id: 2, emoji: "🐻", entryPrice: 115, label: "Shorted at $115" },
    { id: 3, emoji: "🐻", entryPrice: 118, label: "Shorted at $118" },
    { id: 4, emoji: "🐻", entryPrice: 122, label: "Shorted at $122" },
    { id: 5, emoji: "🐻", entryPrice: 110, label: "Shorted at $110" },
    { id: 6, emoji: "🐻", entryPrice: 125, label: "Shorted at $125" },
    { id: 7, emoji: "🐻", entryPrice: 112, label: "Shorted at $112" },
]

export function ShortSqueeze({ onComplete, ticker, stockData, gameConfig }: ShortSqueezeProps) {
    const [squeezed, setSqueezed] = useState<number[]>([]) // ids of squeezed bears
    const [phase, setPhase] = useState<"playing" | "success">("playing")
    const [priceBoost, setPriceBoost] = useState(0) // price rise per squeeze

    const shortPct = stockData?.shortPercentFloat ?? stockData?.stock_data?.shortPercentFloat ?? 8.5
    const companyName = stockData?.shortName || stockData?.name || ticker || "This Stock"
    const basePrice = stockData?.price || stockData?.stock_data?.current_price || 100
    const currentPrice = Math.round((basePrice + priceBoost) * 100) / 100

    const remaining = TOTAL_BEARS - squeezed.length

    function squeezeBear() {
        if (squeezed.length >= TOTAL_BEARS) return

        const nextBear = BEARS.find(b => !squeezed.includes(b.id))
        if (!nextBear) return

        const priceJump = parseFloat((Math.random() * 3 + 2).toFixed(2)) // $2–$5 jump per squeeze
        setPriceBoost(prev => prev + priceJump)
        setSqueezed(prev => {
            const next = [...prev, nextBear.id]
            if (next.length === TOTAL_BEARS) {
                setTimeout(() => setPhase("success"), 600)
            }
            return next
        })
    }

    const squeezedPct = Math.round((squeezed.length / TOTAL_BEARS) * 100)

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
                        className="space-y-4"
                    >
                        {/* Instruction */}
                        <div className="bg-muted rounded-xl p-4 border border-foreground/10 text-center">
                            <p className="font-bold text-foreground">
                                {gameConfig?.instruction || "Bears are trapped — squeeze them out!"}
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                                <span className="font-bold text-foreground">{shortPct}%</span> of {companyName}&apos;s float is shorted.
                                Good news just dropped — force them to cover.
                            </p>
                        </div>

                        {/* Price Display */}
                        <div className="bg-card rounded-3xl border-2 border-foreground shadow-pop p-6 text-center">
                            <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-1">
                                {ticker || companyName} Price
                            </p>
                            <motion.p
                                key={currentPrice}
                                initial={{ scale: 1.15, color: "#22c55e" }}
                                animate={{ scale: 1, color: "var(--foreground)" }}
                                transition={{ duration: 0.4 }}
                                className="text-4xl font-black"
                            >
                                ${currentPrice.toFixed(2)}
                            </motion.p>
                            {priceBoost > 0 && (
                                <p className="text-green-500 font-bold text-sm mt-1 flex items-center justify-center gap-1">
                                    <TrendingUp className="w-4 h-4" />
                                    +${priceBoost.toFixed(2)} from squeeze buying
                                </p>
                            )}
                        </div>

                        {/* Bears Grid */}
                        <div className="bg-card rounded-3xl border-2 border-foreground shadow-pop p-6">
                            <div className="flex justify-between items-center mb-4">
                                <p className="font-bold text-foreground">Short Sellers</p>
                                <span className="px-3 py-1 rounded-full bg-primary/10 border-2 border-primary/20 text-primary font-bold text-sm">
                                    {remaining} remaining
                                </span>
                            </div>

                            <div className="grid grid-cols-7 gap-2 mb-4">
                                {BEARS.map(bear => {
                                    const isOut = squeezed.includes(bear.id)
                                    return (
                                        <AnimatePresence key={bear.id} mode="wait">
                                            {isOut ? (
                                                <motion.div
                                                    key="out"
                                                    initial={{ scale: 1, y: 0, opacity: 1 }}
                                                    animate={{ scale: 0.5, y: -40, opacity: 0 }}
                                                    transition={{ duration: 0.4, ease: "backIn" }}
                                                    className="text-3xl text-center"
                                                >
                                                    🚀
                                                </motion.div>
                                            ) : (
                                                <motion.div
                                                    key="in"
                                                    initial={{ scale: 0.8 }}
                                                    animate={{ scale: 1 }}
                                                    className="text-3xl text-center select-none"
                                                >
                                                    {bear.emoji}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    )
                                })}
                            </div>

                            {/* Squeeze Progress Bar */}
                            <div className="h-3 bg-muted rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-primary rounded-full"
                                    initial={{ width: "0%" }}
                                    animate={{ width: `${squeezedPct}%` }}
                                    transition={{ duration: 0.4, ease: "easeOut" }}
                                />
                            </div>
                            <p className="text-xs text-muted-foreground text-center mt-2">
                                {squeezed.length} / {TOTAL_BEARS} bears squeezed out
                            </p>
                        </div>

                        {/* Squeeze Button */}
                        <motion.button
                            whileTap={{ scale: 0.96 }}
                            onClick={squeezeBear}
                            disabled={remaining === 0}
                            className="w-full py-5 bg-primary text-primary-foreground rounded-xl font-black text-lg shadow-pop hover:translate-y-0.5 hover:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            🚀 SQUEEZE! ({remaining} left)
                        </motion.button>

                        {/* Teaching note */}
                        {squeezed.length > 0 && squeezed.length < TOTAL_BEARS && (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center text-sm text-muted-foreground px-4"
                            >
                                Each bear covering = forced buying = price goes higher = more bears panic 🔄
                            </motion.p>
                        )}
                    </motion.div>
                )}

            </AnimatePresence>

            <MinigameCompletionPopup
                completed={phase === "success"}
                onComplete={onComplete}
                title="Short Squeeze Complete! 🚀"
                description={`You forced all ${TOTAL_BEARS} short sellers to cover. That panic-buying drove ${ticker || companyName}'s price up $${priceBoost.toFixed(2)}. That's a Short Squeeze.`}
                icon={TrendingUp}
            />
        </div>
    )
}
