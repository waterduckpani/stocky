"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Zap, Shield, TrendingUp, ArrowRight, Newspaper } from "lucide-react"
import { cn } from "@/lib/utils"
import { MinigameCompletionPopup } from "./MinigameCompletionPopup"

interface ShortSqueezeProps {
    onComplete: () => void
    ticker?: string
    stockData?: any
    gameConfig?: any
}

type GamePhase = "intro" | "playing"

interface Scenario {
    id: number
    company: string
    emoji: string
    shortInterestPct: number
    news: string
    newsType: "good" | "bad"
    forcedCover: boolean
    explanation: string
}

const SCENARIOS: Scenario[] = [
    {
        id: 1,
        company: "MegaMed Pharma",
        emoji: "💊",
        shortInterestPct: 38,
        news: "FDA approves breakthrough drug!",
        newsType: "good",
        forcedCover: true,
        explanation: "38% short interest + great news = short sellers are wrong and losing money fast. They're all forced to buy back shares at once — that wave of panic buying pushes the price even higher.",
    },
    {
        id: 2,
        company: "SafeBank Corp",
        emoji: "🏦",
        shortInterestPct: 3,
        news: "Beat earnings by 12%!",
        newsType: "good",
        forcedCover: false,
        explanation: "Only 3% short interest — almost nobody is betting against it. Great news means a normal rally, but there are no trapped short sellers to create a chain reaction.",
    },
    {
        id: 3,
        company: "RetailRocket Inc",
        emoji: "🛍️",
        shortInterestPct: 44,
        news: "CEO suddenly resigns!",
        newsType: "bad",
        forcedCover: false,
        explanation: "44% short interest, but bad news confirms what the short sellers predicted. They're right — so they hold their bets. No panic, no forced buying.",
    },
    {
        id: 4,
        company: "TechTower Ltd",
        emoji: "🗼",
        shortInterestPct: 24,
        news: "Apple partnership confirmed!",
        newsType: "good",
        forcedCover: true,
        explanation: "24% short interest + a huge positive surprise. Short sellers are caught completely off guard — all forced to buy back at once, sending the price surging.",
    },
    {
        id: 5,
        company: "OldGuard Steel",
        emoji: "🏗️",
        shortInterestPct: 6,
        news: "Revenue surges 20%!",
        newsType: "good",
        forcedCover: false,
        explanation: "6% short interest is tiny. Good news drives a healthy rally, but there aren't enough short sellers to create the chain-reaction of forced buying.",
    },
]

function getSILevel(pct: number): "low" | "medium" | "high" {
    if (pct < 10) return "low"
    if (pct < 20) return "medium"
    return "high"
}

export function ShortSqueeze({ onComplete }: ShortSqueezeProps) {
    const [phase, setPhase] = useState<GamePhase>("intro")
    const [round, setRound] = useState(0)
    const [score, setScore] = useState(0)
    const [feedback, setFeedback] = useState<{ correct: boolean; explanation: string } | null>(null)
    const [gameComplete, setGameComplete] = useState(false)

    const TOTAL_ROUNDS = SCENARIOS.length
    const currentScenario = SCENARIOS[round]

    function startGame() {
        setPhase("playing")
        setRound(0)
        setScore(0)
        setFeedback(null)
        setGameComplete(false)
    }

    function handleAnswer(predictedForcedCover: boolean) {
        if (feedback) return
        const isCorrect = predictedForcedCover === currentScenario.forcedCover
        if (isCorrect) setScore(s => s + 1)
        setFeedback({ correct: isCorrect, explanation: currentScenario.explanation })
    }

    function handleNext() {
        const next = round + 1
        if (next >= TOTAL_ROUNDS) {
            setGameComplete(true)
        } else {
            setRound(next)
            setFeedback(null)
        }
    }

    return (
        <div className="w-full max-w-xl mx-auto bg-card rounded-[2rem] border-2 border-foreground shadow-pop p-6 relative overflow-hidden flex flex-col gap-6 select-none">

            {/* Header */}
            <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-secondary text-white border-2 border-foreground shadow-sm transform -rotate-2">
                        <TrendingUp className="w-6 h-6" strokeWidth={2.5} />
                    </div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs font-black uppercase tracking-wider border-2 border-border">
                        Short Interest Radar
                    </div>
                </div>
                <h3 className="text-xl font-black text-foreground mt-2" style={{ fontFamily: "var(--font-heading)" }}>
                    Will Short Sellers Be Forced to Cover?
                </h3>
                {phase === "playing" && (
                    <p className="text-sm font-medium text-muted-foreground mt-1">
                        Score: {score}/{TOTAL_ROUNDS} · Round {round + 1} of {TOTAL_ROUNDS}
                    </p>
                )}
                {phase === "intro" && (
                    <p className="text-sm font-medium text-muted-foreground mt-1">
                        5 stocks · Read the data · Call the outcome
                    </p>
                )}
            </div>

            {/* Visual Stage */}
            <div className="relative w-full bg-background rounded-[1.5rem] border-2 border-foreground shadow-inner overflow-hidden">

                {/* Background grid */}
                <div className="absolute inset-0 opacity-10 pointer-events-none flex justify-around px-12 rounded-[1.5rem] overflow-hidden">
                    <div className="w-px h-full border-r-2 border-dashed border-foreground" />
                    <div className="w-px h-full border-r-4 border-foreground" />
                    <div className="w-px h-full border-r-2 border-dashed border-foreground" />
                </div>

                {/* INTRO — flow content, not absolute, so it expands naturally */}
                {phase === "intro" && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className="relative z-10 flex flex-col items-center justify-center text-center p-8 gap-4"
                    >
                        <div className="w-16 h-16 rounded-full bg-secondary text-white flex items-center justify-center border-2 border-foreground shadow-pop">
                            <Zap className="w-8 h-8" strokeWidth={2.5} />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-black text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
                                Read the Short Interest
                            </h3>
                            <p className="text-sm font-medium text-muted-foreground max-w-xs mx-auto leading-relaxed">
                                You&apos;ll see a stock&apos;s{" "}
                                <span className="font-bold text-foreground">Short Interest %</span> and a
                                news headline. Decide: are short sellers forced to buy back their shares?
                            </p>
                        </div>
                        <button
                            onClick={startGame}
                            className="mt-2 px-8 py-4 bg-primary text-primary-foreground rounded-xl font-bold shadow-pop hover:translate-y-0.5 hover:shadow-none transition-all flex items-center gap-2"
                        >
                            Start Analysing
                            <ArrowRight className="w-5 h-5" strokeWidth={3} />
                        </button>
                    </motion.div>
                )}

                {/* PLAYING — key triggers enter-only animation; no AnimatePresence so old div
                    unmounts instantly on handleNext(), preventing the expand-then-contract shift */}
                {phase === "playing" && currentScenario && (
                        <motion.div
                            key={currentScenario.id}
                            initial={{ opacity: 0, x: 28 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.25, ease: "easeOut" }}
                            className="relative z-10 p-4 space-y-3"
                        >
                            {/* Company + Short Interest card */}
                            <div className="bg-card rounded-2xl border-2 border-foreground shadow-pop p-4 space-y-3">
                                <div className="flex items-center gap-3">
                                    <span className="text-3xl">{currentScenario.emoji}</span>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-black text-foreground text-base leading-tight">
                                            {currentScenario.company}
                                        </p>
                                        <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mt-0.5">
                                            Short Interest
                                        </p>
                                    </div>
                                    <span
                                        className={cn(
                                            "px-3 py-1 rounded-full text-xs font-bold shrink-0",
                                            getSILevel(currentScenario.shortInterestPct) === "high"
                                                ? "bg-primary/10 border-2 border-primary/20 text-primary"
                                                : getSILevel(currentScenario.shortInterestPct) === "medium"
                                                    ? "bg-secondary/10 border-2 border-secondary/20 text-foreground"
                                                    : "bg-muted/50 border-2 border-foreground/10 text-muted-foreground"
                                        )}
                                    >
                                        {getSILevel(currentScenario.shortInterestPct).toUpperCase()}
                                    </span>
                                </div>

                                {/* SI Gauge */}
                                <div className="space-y-1.5">
                                    <div className="flex items-center gap-3">
                                        <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{
                                                    width: `${Math.min(
                                                        (currentScenario.shortInterestPct / 50) * 100,
                                                        100
                                                    )}%`,
                                                }}
                                                transition={{ duration: 0.55, ease: "easeOut", delay: 0.15 }}
                                                className={cn(
                                                    "h-full rounded-full",
                                                    currentScenario.shortInterestPct >= 20
                                                        ? "bg-primary"
                                                        : "bg-muted-foreground/40"
                                                )}
                                            />
                                        </div>
                                        <span className="text-xl font-black text-foreground tabular-nums w-14 text-right">
                                            {currentScenario.shortInterestPct}%
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-[10px] text-muted-foreground font-bold px-0.5">
                                        <span>0%</span>
                                        <span>⚡ High Risk Zone (20%+)</span>
                                        <span>50%</span>
                                    </div>
                                </div>
                            </div>

                            {/* News Banner */}
                            <div className="bg-muted/50 rounded-2xl p-4 border border-foreground/5 flex items-start gap-3">
                                <div className="flex items-center gap-1.5 shrink-0 mt-0.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                                    <span className="text-[10px] font-black text-primary uppercase tracking-wider">
                                        News
                                    </span>
                                </div>
                                <p className="text-sm font-bold text-foreground leading-snug">
                                    {currentScenario.news}
                                </p>
                            </div>

                            {/* Feedback — no AnimatePresence exit so it unmounts instantly on Next,
                                preventing the expand-then-contract layout shift */}
                            {feedback && (
                                <motion.div
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="bg-muted/50 rounded-2xl p-4 border border-foreground/5 space-y-2"
                                >
                                    <p
                                        className={cn(
                                            "text-sm font-black",
                                            feedback.correct ? "text-primary" : "text-foreground"
                                        )}
                                    >
                                        {feedback.correct ? "✓ Correct!" : "✗ Not quite —"}
                                    </p>
                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                        {feedback.explanation}
                                    </p>
                                    <button
                                        onClick={handleNext}
                                        className="w-full mt-1 py-4 bg-primary text-primary-foreground rounded-xl font-bold shadow-pop hover:translate-y-0.5 hover:shadow-none transition-all flex items-center justify-center gap-2"
                                    >
                                        {round + 1 >= TOTAL_ROUNDS ? "See Results" : "Next Round"}
                                        <ArrowRight className="w-5 h-5" strokeWidth={3} />
                                    </button>
                                </motion.div>
                            )}
                        </motion.div>
                )}
            </div>

            {/* Choice buttons — only when playing, no feedback, and not yet complete */}
            {phase === "playing" && !feedback && !gameComplete && (
                <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className="grid grid-cols-2 gap-4"
                >
                    {/* Secondary — "Shorts Hold" */}
                    <button
                        onClick={() => handleAnswer(false)}
                        className="py-4 bg-muted hover:bg-muted/80 text-foreground shadow-[0_4px_0_0_rgba(0,0,0,0.2)] hover:translate-y-0.5 hover:shadow-none rounded-xl font-bold flex flex-col items-center justify-center gap-1 transition-all"
                    >
                        <Shield className="w-6 h-6 mb-0.5" strokeWidth={2.5} />
                        <span className="text-sm font-black uppercase">Shorts Hold</span>
                        <span className="text-[10px] font-bold text-muted-foreground">They stay short</span>
                    </button>

                    {/* Primary — "Forced Cover" */}
                    <button
                        onClick={() => handleAnswer(true)}
                        className="py-4 bg-primary text-primary-foreground rounded-xl font-bold shadow-pop hover:translate-y-0.5 hover:shadow-none transition-all flex flex-col items-center justify-center gap-1"
                    >
                        <Zap className="w-6 h-6 mb-0.5" strokeWidth={2.5} />
                        <span className="text-sm font-black uppercase">Forced Cover</span>
                        <span className="text-[10px] font-bold text-primary-foreground/70">Panic buy-back</span>
                    </button>
                </motion.div>
            )}

            {/* Completion popup — absolute inset-0 on this relative container,
                playing content stays rendered underneath so the card keeps its height */}
            <MinigameCompletionPopup
                completed={gameComplete}
                onComplete={onComplete}
                title={score >= 3 ? "Sharp Analyst! 🔥" : "Keep Watching! 📡"}
                description={score >= 3
                    ? "You can read the signals. High short interest + good news traps short sellers — their forced buybacks all at once are what makes short interest a danger signal."
                    : "The pattern to remember: high short interest (20%+) + good news = short sellers trapped and forced to buy back fast. All that panic buying at once is what makes prices explode."
                }
                icon={score >= 3 ? TrendingUp : Newspaper}
            />
        </div>
    )
}
