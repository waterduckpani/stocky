
"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { DollarSign, TrendingUp, Trophy, ArrowRight, XCircle, CheckCircle2 } from "lucide-react"
import confetti from "canvas-confetti"

interface CapClashProps {
    instruction: string
    onComplete: () => void
}

// Mock comparison pairs (would ideally come from backend)
const PAIRS = [
    {
        left: { symbol: "AAPL", name: "Apple", cap: "3.4T", value: 3400 },
        right: { symbol: "GME", name: "GameStop", cap: "6.5B", value: 6.5 },
        winner: "left"
    },
    {
        left: { symbol: "KO", name: "Coca-Cola", cap: "270B", value: 270 },
        right: { symbol: "PEP", name: "PepsiCo", cap: "230B", value: 230 },
        winner: "left" // Close one!
    },
    {
        left: { symbol: "NVDA", name: "Nvidia", cap: "3.0T", value: 3000 },
        right: { symbol: "INTC", name: "Intel", cap: "95B", value: 95 },
        winner: "left"
    }
]

export function CapClashGame({ instruction, onComplete }: CapClashProps) {
    const [round, setRound] = useState(0)
    const [score, setScore] = useState(0)
    const [showResult, setShowResult] = useState<"correct" | "wrong" | null>(null)
    const [gameState, setGameState] = useState<"playing" | "finished">("playing")

    // Current pair
    const currentPair = PAIRS[round]

    const handleChoice = (choice: "left" | "right") => {
        if (showResult) return // Prevent double click

        const isCorrect = choice === currentPair.winner

        setShowResult(isCorrect ? "correct" : "wrong")

        if (isCorrect) {
            setScore(prev => prev + 1)
            confetti({
                particleCount: 50,
                spread: 60,
                origin: { x: choice === "left" ? 0.3 : 0.7, y: 0.6 }
            })
        }

        // Delay before next round
        setTimeout(() => {
            if (round < PAIRS.length - 1) {
                setRound(prev => prev + 1)
                setShowResult(null)
            } else {
                setGameState("finished")
            }
        }, 2000)
    }

    if (gameState === "finished") {
        return (
            <div className="text-center animate-pop-in p-8 bg-card border-2 border-foreground rounded-3xl shadow-pop">
                <Trophy className="w-24 h-24 mx-auto text-quaternary mb-4 animate-bounce" />
                <h2 className="text-3xl font-black mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                    Clash Complete!
                </h2>
                <p className="text-xl font-bold text-muted-foreground mb-8">
                    You scored {score}/{PAIRS.length}
                </p>
                <Button
                    onClick={onComplete}
                    className="w-full py-6 text-xl rounded-2xl font-bold bg-primary text-white shadow-pop hover:translate-y-0.5 hover:shadow-none border-0"
                >
                    Continue <ArrowRight className="ml-2 w-6 h-6" />
                </Button>
            </div>
        )
    }

    return (
        <div className="w-full max-w-2xl mx-auto space-y-6 animate-pop-in">
            {/* Header */}
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
                    Cap Clash 🥊
                </h2>
                <p className="text-muted-foreground font-medium text-lg">
                    {instruction}
                </p>
            </div>

            {/* Battle Arena */}
            <div className="relative flex flex-col md:flex-row gap-4 items-center justify-center">

                {/* Left Fighter */}
                <Card
                    data={currentPair.left}
                    onClick={() => handleChoice("left")}
                    result={showResult}
                    isWinner={currentPair.winner === "left"}
                    disabled={!!showResult}
                />

                {/* VS Badge */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                    <div className="bg-foreground text-background font-black text-xl w-12 h-12 rounded-full flex items-center justify-center border-4 border-background shadow-lg">
                        VS
                    </div>
                </div>

                {/* Right Fighter */}
                <Card
                    data={currentPair.right}
                    onClick={() => handleChoice("right")}
                    result={showResult}
                    isWinner={currentPair.winner === "right"}
                    disabled={!!showResult}
                />
            </div>

            {/* Progress */}
            <div className="flex justify-center gap-2">
                {PAIRS.map((_, i) => (
                    <div
                        key={i}
                        className={`w-3 h-3 rounded-full transition-colors ${i === round ? "bg-primary" :
                                i < round ? "bg-primary/30" : "bg-muted"
                            }`}
                    />
                ))}
            </div>
        </div>
    )
}

function Card({ data, onClick, result, isWinner, disabled }: any) {
    const showCap = result !== null

    return (
        <motion.button
            whileHover={!disabled ? { scale: 1.05, rotate: isWinner ? -2 : 2 } : {}}
            whileTap={!disabled ? { scale: 0.95 } : {}}
            onClick={onClick}
            disabled={disabled}
            className={`
                relative w-full md:w-1/2 h-64 rounded-3xl border-4 text-left p-6 flex flex-col justify-between transition-all overflow-hidden group
                ${showCap && isWinner ? "border-quaternary bg-quaternary/10 ring-4 ring-quaternary/20" :
                    showCap && !isWinner ? "border-muted opacity-50" :
                        "border-foreground bg-card hover:border-primary hover:shadow-pop"}
            `}
        >
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-5 pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(circle at center, currentColor 1px, transparent 1px)', backgroundSize: '20px 20px' }}
            />

            <div>
                <span className="inline-block px-3 py-1 rounded-lg bg-foreground/5 font-bold text-sm mb-2">
                    {data.symbol}
                </span>
                <h3 className="text-3xl font-black leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                    {data.name}
                </h3>
            </div>

            <div className="relative">
                <AnimatePresence mode="wait">
                    {showCap ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-1"
                        >
                            <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Market Cap</p>
                            <p className={`text-4xl font-black ${isWinner ? "text-quaternary" : "text-foreground"}`}>
                                {data.cap}
                            </p>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors"
                        >
                            <DollarSign className="w-6 h-6" strokeWidth={3} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.button>
    )
}
