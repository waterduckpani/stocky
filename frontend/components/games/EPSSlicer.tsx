"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Minus, Plus, TrendingUp } from 'lucide-react'
import { MinigameCompletionPopup } from "./MinigameCompletionPopup"

interface EPSSlicerProps {
    onComplete: () => void
    gameConfig?: { instruction?: string }
    stockData?: any
}

const BASE_PROFIT = 100
const MIN_SHARES = 4
const MAX_SHARES = 20
const CX = 100, CY = 100, R = 82, CRUST = 89, PULL = 10

function buildSlice(i: number, total: number) {
    const sliceAngle = (2 * Math.PI) / total
    const startAngle = -Math.PI / 2 - sliceAngle / 2 + i * sliceAngle
    const endAngle = startAngle + sliceAngle
    const midAngle = (startAngle + endAngle) / 2

    const ox = i === 0 ? +(Math.cos(midAngle) * PULL).toFixed(2) : 0
    const oy = i === 0 ? +(Math.sin(midAngle) * PULL).toFixed(2) : 0

    const sx = CX + ox, sy = CY + oy
    const x1 = sx + R * Math.cos(startAngle)
    const y1 = sy + R * Math.sin(startAngle)
    const x2 = sx + R * Math.cos(endAngle)
    const y2 = sy + R * Math.sin(endAngle)
    const large = sliceAngle > Math.PI ? 1 : 0

    return {
        d: `M ${sx.toFixed(1)} ${sy.toFixed(1)} L ${x1.toFixed(1)} ${y1.toFixed(1)} A ${R} ${R} 0 ${large} 1 ${x2.toFixed(1)} ${y2.toFixed(1)} Z`,
        midAngle, ox, oy,
    }
}

export default function EPSSlicer({ onComplete }: EPSSlicerProps) {
    const [shares, setShares] = useState(10)
    const [profitDoubled, setProfitDoubled] = useState(false)
    const [showCompletion, setShowCompletion] = useState(false)

    const profit = profitDoubled ? BASE_PROFIT * 2 : BASE_PROFIT
    const eps = profit / shares
    const epsStr = eps % 1 === 0 ? `$${eps}` : `$${eps.toFixed(2)}`
    const remaining = MAX_SHARES - shares

    // Complete when user reaches 20 shareholders
    useEffect(() => {
        if (shares >= MAX_SHARES) {
            const t = setTimeout(() => setShowCompletion(true), 700)
            return () => clearTimeout(t)
        }
    }, [shares])

    const changeShares = (delta: number) => {
        const next = Math.max(MIN_SHARES, Math.min(MAX_SHARES, shares + delta))
        setShares(next)
    }

    const toggleProfit = () => setProfitDoubled(p => !p)

    const insightText = (): string => {
        if (shares >= MAX_SHARES) return `You reached max dilution! ${epsStr}/share — that's what too many shares does. 📉`
        if (profitDoubled && shares >= 16) return `Even with ${shares} shareholders, doubled profits keep EPS at ${epsStr}. Profit growth fights dilution! 🚀`
        if (profitDoubled) return `Profits doubled to $${profit} — every slice got bigger. Your EPS jumped to ${epsStr}. 📈`
        if (shares >= 16) return `${shares} shareholders — tiny slices. Keep going to see max dilution.`
        if (shares > 10) return `More shareholders = smaller slices. Your EPS dropped to ${epsStr}.`
        if (shares <= 6) return `Only ${shares} shareholders — huge slices! Each earns ${epsStr}. 🍕`
        return `${shares} shareholders each get ${epsStr} of the $${profit} profit.`
    }

    const slices = Array.from({ length: shares }, (_, i) => buildSlice(i, shares))
    const s0 = slices[0]
    const labelX = CX + s0.ox + Math.cos(s0.midAngle) * R * 0.55
    const labelY = CY + s0.oy + Math.sin(s0.midAngle) * R * 0.55
    const showLabel = shares <= 10
    const insight = insightText()

    return (
        <div className="w-full max-w-xl mx-auto space-y-4 relative">

            <div className="bg-card rounded-3xl border-2 border-foreground shadow-pop p-5 space-y-5">

                {/* Header */}
                <div className="flex items-center gap-3">
                    <span className="text-3xl">🍕</span>
                    <div>
                        <h3 className="text-xl font-black" style={{ fontFamily: 'var(--font-heading)' }}>
                            The Profit Pizza
                        </h3>
                        <p className="text-sm text-muted-foreground font-bold">
                            Each share = one slice of the company's earnings
                        </p>
                    </div>
                </div>

                {/* Pizza */}
                <div>
                    <svg viewBox="0 0 200 200" className="w-full max-w-[200px] mx-auto block">
                        <circle cx={CX} cy={CY} r={CRUST} fill="#92400e" />
                        {slices.map((s, i) => (
                            <motion.path
                                key={`${shares}-${i}`}
                                d={s.d}
                                fill={i === 0 ? 'hsl(var(--primary))' : '#e8a020'}
                                stroke={i === 0 ? 'rgba(0,0,0,0.25)' : '#7c3a0a'}
                                strokeWidth={i === 0 ? 2 : 1.5}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: i * 0.025, duration: 0.2 }}
                            />
                        ))}
                        {showLabel && (
                            <motion.text
                                key={`lbl-${epsStr}-${shares}`}
                                x={labelX}
                                y={labelY}
                                textAnchor="middle"
                                dominantBaseline="middle"
                                fontSize={shares <= 6 ? 13 : 11}
                                fontWeight="bold"
                                fill="white"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                style={{ pointerEvents: 'none' }}
                            >
                                {epsStr}
                            </motion.text>
                        )}
                    </svg>
                    {/* Legend */}
                    <div className="flex items-center justify-center gap-4 mt-2">
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded-sm bg-primary" />
                            <span className="text-sm font-bold text-muted-foreground">Your slice</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded-sm" style={{ background: '#e8a020' }} />
                            <span className="text-sm font-bold text-muted-foreground">Other shares</span>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="bg-muted/50 rounded-2xl p-3 border border-foreground/10">
                        <p className="text-[10px] text-muted-foreground font-black uppercase tracking-wider mb-1">Profit</p>
                        <motion.p key={profit} initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="text-xl font-black">
                            ${profit}
                        </motion.p>
                    </div>
                    <div className="bg-muted/50 rounded-2xl p-3 border border-foreground/10">
                        <p className="text-[10px] text-muted-foreground font-black uppercase tracking-wider mb-1">Shares</p>
                        <motion.p key={shares} initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="text-xl font-black">
                            {shares}
                        </motion.p>
                    </div>
                    <div className="bg-primary/10 rounded-2xl p-3 border-2 border-primary/30">
                        <p className="text-[10px] text-muted-foreground font-black uppercase tracking-wider mb-1">Your EPS</p>
                        <motion.p key={eps} initial={{ scale: 0.8, opacity: 0.4 }} animate={{ scale: 1, opacity: 1 }} className="text-xl font-black text-primary">
                            {epsStr}
                        </motion.p>
                    </div>
                </div>

                {/* Controls: − | profit toggle | + */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => changeShares(-1)}
                        disabled={shares <= MIN_SHARES}
                        className="w-12 h-12 rounded-xl border-2 border-foreground bg-muted font-bold shadow-[0_4px_0_0_rgba(0,0,0,0.2)] hover:translate-y-0.5 hover:shadow-none transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center shrink-0"
                    >
                        <Minus className="w-5 h-5" strokeWidth={3} />
                    </button>

                    <button
                        onClick={toggleProfit}
                        className={`flex-1 h-12 rounded-xl border-2 font-bold transition-all flex items-center justify-center gap-2 text-sm ${
                            profitDoubled
                                ? 'bg-primary/10 border-primary/40 text-primary shadow-none'
                                : 'bg-muted border-foreground text-foreground shadow-[0_4px_0_0_rgba(0,0,0,0.2)] hover:translate-y-0.5 hover:shadow-none'
                        }`}
                    >
                        <TrendingUp className="w-4 h-4" strokeWidth={2.5} />
                        {profitDoubled ? 'Profit ×2 — reset' : '💰 Double profit!'}
                    </button>

                    <button
                        onClick={() => changeShares(1)}
                        disabled={shares >= MAX_SHARES}
                        className="w-12 h-12 rounded-xl border-2 border-foreground bg-muted font-bold shadow-[0_4px_0_0_rgba(0,0,0,0.2)] hover:translate-y-0.5 hover:shadow-none transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center shrink-0"
                    >
                        <Plus className="w-5 h-5" strokeWidth={3} />
                    </button>
                </div>

                {/* Shareholder counter + goal tip */}
                <div className="flex items-center justify-between">
                    <motion.p key={shares} initial={{ opacity: 0.5 }} animate={{ opacity: 1 }} className="text-sm font-bold text-foreground">
                        {shares} shareholders
                    </motion.p>
                    <p className="text-sm font-bold text-muted-foreground">
                        {shares >= MAX_SHARES ? '✓ Done!' : `+${remaining} to finish`}
                    </p>
                </div>

                {/* Progress bar */}
                <div className="h-2 bg-muted rounded-full overflow-hidden -mt-3">
                    <motion.div
                        className="h-full bg-primary rounded-full"
                        animate={{ width: `${(shares / MAX_SHARES) * 100}%` }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                    />
                </div>

                {/* Insight */}
                <AnimatePresence mode="wait">
                    <motion.p
                        key={insight}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="text-sm font-bold text-muted-foreground text-center"
                    >
                        {insight}
                    </motion.p>
                </AnimatePresence>
            </div>

            <MinigameCompletionPopup
                completed={showCompletion}
                onComplete={onComplete}
                title="EPS Mastered! 🍕"
                description="You've seen how EPS works — profit grows your slice bigger, more shares make it smaller. Now you know what to look for."
            />
        </div>
    )
}
