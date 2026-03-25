"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Gavel, CheckCircle2, XCircle, Trophy, BarChart2, ArrowRight, Tag, Scale, TrendingUp, Newspaper } from 'lucide-react'
import { cn } from '@/lib/utils'
import { MinigameCompletionPopup } from "./MinigameCompletionPopup"

interface ValuationStationProps {
    onComplete: () => void
    gameConfig?: {
        pe_ratio?: number
        symbol?: string
        instruction?: string
    }
}

type Verdict = "bargain" | "fair" | "overpriced"

interface Round {
    sector: string
    description: string
    pe: number
    correct: Verdict
    why: string
}

const STATIC_ROUNDS: Round[] = [
    {
        sector: "🏭",
        description: "Energy giant. Steady profits. Growing 3% a year.",
        pe: 10,
        correct: "bargain",
        why: "Mature, slow-growing companies trade at low P/E — investors don't expect big earnings jumps, so they won't pay a premium."
    },
    {
        sector: "☁️",
        description: "Cloud software startup. Revenue up 40%/year. No dividends yet.",
        pe: 42,
        correct: "fair",
        why: "High-growth companies command high P/E — investors pay a premium now for the big profits they expect later."
    }
]

const VERDICT_CONFIG = {
    bargain:    { label: "BARGAIN",    sub: "P/E under 15",  Icon: Tag,        border: "border-primary",     text: "text-primary",     hover: "hover:bg-primary/5"     },
    fair:       { label: "FAIR DEAL",  sub: "P/E 15 – 30",   Icon: Scale,      border: "border-foreground",  text: "text-foreground",  hover: "hover:bg-muted/50"      },
    overpriced: { label: "OVERPRICED", sub: "P/E above 30",  Icon: TrendingUp, border: "border-destructive", text: "text-destructive", hover: "hover:bg-destructive/5" },
} as const

function getCorrectVerdict(pe: number): Verdict {
    if (pe < 15) return "bargain"
    if (pe <= 30) return "fair"
    return "overpriced"
}

function getRound3Why(pe: number, symbol: string): string {
    if (pe < 15) return `At a P/E of ${pe}, ${symbol} is priced like a value stock — the market expects steady, not spectacular, earnings growth.`
    if (pe <= 30) return `At a P/E of ${pe}, ${symbol} sits in fair-value territory — the market sees balanced risk and growth ahead.`
    return `At a P/E of ${pe}, ${symbol} is priced for big growth — investors are betting on a significant earnings jump ahead.`
}

export default function ValuationStation({ onComplete, gameConfig }: ValuationStationProps) {
    const peRatio = Math.max(1, Math.round(gameConfig?.pe_ratio || 20))
    const symbol = gameConfig?.symbol || "This Stock"

    const round3: Round = {
        sector: "🔍",
        description: `${symbol} — the stock you searched for.`,
        pe: peRatio,
        correct: getCorrectVerdict(peRatio),
        why: getRound3Why(peRatio, symbol),
    }

    const ALL_ROUNDS = [...STATIC_ROUNDS, round3]

    const [gameState, setGameState] = useState<"intro" | "playing" | "complete">("intro")
    const [currentRound, setCurrentRound] = useState(0)
    const [score, setScore] = useState(0)
    const [selected, setSelected] = useState<Verdict | null>(null)

    const round = ALL_ROUNDS[currentRound]
    const isCorrect = selected !== null && selected === round.correct

    const handleVerdict = (verdict: Verdict) => {
        if (selected !== null) return
        setSelected(verdict)
        if (verdict === round.correct) setScore(prev => prev + 1)
    }

    const handleNext = () => {
        if (currentRound < ALL_ROUNDS.length - 1) {
            setCurrentRound(prev => prev + 1)
            setSelected(null)
        } else {
            setGameState("complete")
        }
    }

    const completionTitle = score === 3 ? "Market Analyst! 🏆" : score === 2 ? "Sharp Eye! 👁️" : "Keep Watching! 📊"
    const completionDesc = score === 3
        ? "Perfect score! P/E only makes sense compared to the right peer group — and you knew that."
        : `${score}/3 correct. Remember: always compare P/E within the same sector, not the whole market.`

    return (
        <div className="w-full max-w-xl mx-auto bg-card rounded-[2rem] border-2 border-foreground shadow-pop p-6 flex flex-col gap-5 select-none">

            {/* ── HEADER ── */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-primary/20 text-primary border-2 border-primary/30 shadow-sm flex items-center justify-center -rotate-2 shrink-0">
                        <Gavel className="w-6 h-6" strokeWidth={2.5} />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>
                            Judge the Market
                        </h3>
                        <p className="text-sm text-muted-foreground font-bold">
                            Score: {score}/{ALL_ROUNDS.length} · Is it a bargain?
                        </p>
                    </div>
                </div>

                {/* Progress dots */}
                <div className="flex gap-1.5 items-center shrink-0">
                    {ALL_ROUNDS.map((_, i) => (
                        <div key={i} className={cn(
                            "h-2 rounded-full transition-all duration-300 border border-foreground/10",
                            i === currentRound ? "w-8 bg-primary" :
                            i < currentRound  ? "w-2 bg-primary/40" : "w-2 bg-muted/50"
                        )} />
                    ))}
                </div>
            </div>

            {/* ── VISUAL STAGE ── */}
            <div className="relative w-full h-80 bg-background rounded-[1.5rem] border-2 border-foreground overflow-hidden flex items-center justify-center p-6">

                {/* Intro overlay — same pattern as TheEarningsReaction */}
                {gameState === "intro" && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-background/95 backdrop-blur-sm p-8 text-center gap-5"
                    >
                        <div className="w-16 h-16 rounded-full bg-primary/10 text-primary border-2 border-primary/20 shadow-sm flex items-center justify-center">
                            <Newspaper className="w-8 h-8" strokeWidth={2} />
                        </div>
                        <div>
                            <h3 className="text-xl font-black mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                                3 Stocks. 3 Verdicts.
                            </h3>
                            <p className="text-muted-foreground text-sm font-medium max-w-[240px] mx-auto">
                                See the P/E. Decide if it's a{" "}
                                <span className="text-primary font-bold">Bargain</span>,{" "}
                                <span className="text-foreground font-bold">Fair Deal</span>, or{" "}
                                <span className="text-destructive font-bold">Overpriced</span>.
                            </p>
                        </div>
                        <button
                            onClick={() => setGameState("playing")}
                            className="px-8 py-3 bg-primary text-primary-foreground rounded-xl font-bold border-2 border-foreground shadow-pop hover:translate-y-0.5 hover:shadow-none transition-all"
                        >
                            Start Judging
                        </button>
                    </motion.div>
                )}

                {/* Company card (per round) */}
                {gameState === "playing" && (
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={`company-${currentRound}`}
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -30 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="flex flex-col items-center gap-4 text-center w-full"
                        >
                            <div className="text-6xl leading-none">{round.sector}</div>
                            <p className="text-base font-bold text-foreground leading-snug">
                                {round.description}
                            </p>

                            {/* P/E badge — prominent */}
                            <div className="flex items-center gap-4 bg-primary/10 rounded-2xl px-8 py-4 border-2 border-primary/30">
                                <div className="text-center">
                                    <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mb-1">P/E Ratio</p>
                                    <p className="text-6xl font-black text-primary leading-none" style={{ fontFamily: 'var(--font-heading)' }}>
                                        {round.pe}
                                    </p>
                                </div>
                                <div className="text-left border-l-2 border-primary/20 pl-4">
                                    <p className="text-sm text-muted-foreground font-bold leading-snug">
                                        per $1<br />of earnings
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                )}
            </div>

            {/* ── CONTROLS ── */}
            {gameState === "playing" && (
                <AnimatePresence mode="wait">
                    {selected === null ? (
                        /* Verdict buttons — squarish 3-col grid matching TheEarningsReaction */
                        <motion.div
                            key="buttons"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="grid grid-cols-3 gap-3"
                        >
                            {(["bargain", "fair", "overpriced"] as Verdict[]).map((v) => {
                                const { label, sub, Icon, border, text, hover } = VERDICT_CONFIG[v]
                                return (
                                    <button
                                        key={v}
                                        onClick={() => handleVerdict(v)}
                                        className={cn(
                                            "relative h-24 rounded-2xl border-2 bg-card transition-all duration-200 shadow-pop hover:translate-y-0.5 hover:shadow-none active:translate-y-0.5 active:shadow-none flex flex-col items-center justify-center gap-1 overflow-hidden",
                                            border, text, hover
                                        )}
                                    >
                                        {/* Ghost corner icon */}
                                        <div className="absolute top-2 right-2 opacity-20">
                                            <Icon size={20} />
                                        </div>

                                        {/* Main icon */}
                                        <Icon className="w-8 h-8 z-10" strokeWidth={2} />

                                        {/* Label */}
                                        <div className="flex flex-col items-center leading-none z-10">
                                            <span className="font-black text-[11px] uppercase tracking-wide mt-1">{label}</span>
                                            <span className="text-[10px] opacity-60 font-bold">{sub}</span>
                                        </div>
                                    </button>
                                )
                            })}
                        </motion.div>
                    ) : (
                        /* Feedback card */
                        <motion.div
                            key="feedback"
                            initial={{ scale: 0.92, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 300, damping: 24 }}
                            className={cn(
                                "rounded-2xl border-2 p-4 flex flex-col gap-3",
                                isCorrect ? "bg-primary/10 border-primary/40" : "bg-destructive/10 border-destructive/40"
                            )}
                        >
                            <div className="flex items-center gap-2">
                                {isCorrect
                                    ? <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                                    : <XCircle className="w-5 h-5 text-destructive shrink-0" />
                                }
                                <span className={cn("font-black text-base", isCorrect ? "text-primary" : "text-destructive")}>
                                    {isCorrect ? "Correct!" : `Answer: ${VERDICT_CONFIG[round.correct].label}`}
                                </span>
                            </div>
                            <p className="text-sm text-foreground/80 font-medium leading-relaxed">
                                {round.why}
                            </p>

                            <button
                                onClick={handleNext}
                                className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-bold shadow-pop hover:translate-y-0.5 hover:shadow-none transition-all flex items-center justify-center gap-2"
                            >
                                {currentRound < ALL_ROUNDS.length - 1
                                    ? <><span>Next</span><ArrowRight className="w-5 h-5" strokeWidth={3} /></>
                                    : <><span>See Results</span><Trophy className="w-5 h-5" /></>
                                }
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            )}

            <MinigameCompletionPopup
                completed={gameState === "complete"}
                onComplete={onComplete}
                title={completionTitle}
                description={completionDesc}
                icon={score >= 2 ? Trophy : BarChart2}
            />
        </div>
    )
}
