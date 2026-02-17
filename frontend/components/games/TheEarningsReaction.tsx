"use client"

import { useState } from "react"
import { motion, AnimatePresence, useAnimation } from "framer-motion"
import { ArrowBigUp, ArrowBigDown, CheckCircle2, TrendingUp, Newspaper, Zap, ArrowRight, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface TheEarningsReactionProps {
    onComplete: () => void
    ticker: string
}

type GameState = "intro" | "playing" | "complete"

interface NewsScenario {
    id: number
    headline: string
    type: "good" | "bad"
    explanation: string
}

const SCENARIOS: NewsScenario[] = [
    { id: 1, headline: "Revenue Up 20%!", type: "good", explanation: "Growth drives stock prices up!" },
    { id: 2, headline: "CEO Resigns Unexpectedly", type: "bad", explanation: "Uncertainty scares investors." },
    { id: 3, headline: "Product Recall Announced", type: "bad", explanation: "Recalls cost money and damage reputation." },
    { id: 4, headline: "Beat Earnings Expectations", type: "good", explanation: "Beating expectations is a major bullish signal." },
    { id: 5, headline: "Guidance Lowered for Q4", type: "bad", explanation: "Weak future guidance kills momentum." },
    { id: 6, headline: "New Partnership with Tech Giant", type: "good", explanation: "Strategic partnerships unlock value." },
]

export default function TheEarningsReaction({ onComplete, ticker }: TheEarningsReactionProps) {
    const [gameState, setGameState] = useState<GameState>("intro")
    const [score, setScore] = useState(0)
    const [currentScenario, setCurrentScenario] = useState<NewsScenario | null>(null)
    const [round, setRound] = useState(0)
    const [feedback, setFeedback] = useState<{ text: string, type: "success" | "error" } | null>(null)

    // Ball Controls
    const ballControls = useAnimation()

    const TOTAL_ROUNDS = 5

    const startGame = () => {
        setGameState("playing")
        setScore(0)
        setRound(0)
        nextRound(0)
    }

    const nextRound = (currentRound: number) => {
        setFeedback(null)
        ballControls.set({ y: 0, scale: 1, x: 0, rotate: 0 })

        if (currentRound >= TOTAL_ROUNDS) {
            setGameState("complete")
            return
        }

        // Pick distinct random scenario
        let random: NewsScenario
        do {
            random = SCENARIOS[Math.floor(Math.random() * SCENARIOS.length)]
        } while (random === currentScenario)

        setCurrentScenario(random)
    }

    const handleReaction = async (action: "buy" | "sell") => {
        if (!currentScenario || feedback) return

        const isCorrect = (action === "buy" && currentScenario.type === "good") ||
            (action === "sell" && currentScenario.type === "bad")

        if (isCorrect) {
            setScore(p => p + 1)
            setFeedback({ text: `Correct! ${currentScenario.explanation}`, type: "success" })

            // Success Animation
            if (action === "buy") {
                await ballControls.start({
                    y: -80,
                    scale: 1.2,
                    transition: { type: "spring", stiffness: 200 }
                })
            } else {
                // Sell - Successful exit/short
                await ballControls.start({
                    y: 80,
                    scale: 0.9,
                    rotate: -15,
                    opacity: 0.5, // Fading out as we exited
                    transition: { type: "spring", stiffness: 200 }
                })
            }
        } else {
            setFeedback({ text: "Oops! Wrong Move.", type: "error" })

            // Fail Animation - Shake
            await ballControls.start({
                x: [0, -10, 10, -10, 10, 0],
                transition: { duration: 0.4 }
            })
        }

        // Wait then next round
        setTimeout(() => {
            const nextR = round + 1
            setRound(nextR)
            nextRound(nextR)
        }, 2000)
    }

    return (
        <div className="w-full max-w-xl mx-auto bg-card rounded-[2rem] border-2 border-foreground shadow-pop p-6 relative overflow-hidden flex flex-col gap-6 animate-pop-in select-none">

            {/* 1. Header Area (Matching BetaShadow) */}
            <div className="text-center relative z-10">
                <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/20 text-primary border-2 border-primary/30 shadow-pop-active transform -rotate-2">
                        <TrendingUp className="w-6 h-6" strokeWidth={2.5} />
                    </div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs font-black uppercase tracking-wider border-2 border-border">
                        MARKET SIMULATOR
                    </div>
                </div>
                <h3 className="text-xl font-black text-foreground mt-2" style={{ fontFamily: 'var(--font-heading)' }}>
                    Earnings Reaction
                </h3>
                <p className="text-sm font-medium text-muted-foreground mt-1">
                    Score: {score}/{TOTAL_ROUNDS} • React fast to the news!
                </p>
            </div>

            {/* 2. Visual Stage (Matching BetaShadow) */}
            <div className="relative w-full h-80 bg-background rounded-[1.5rem] border-2 border-foreground shadow-inner overflow-hidden flex flex-col items-center justify-center p-8">
                {/* Background Grid */}
                <div className="absolute inset-0 opacity-10 pointer-events-none flex justify-around px-12">
                    <div className="w-1 h-full bg-foreground/20 border-r-2 border-dashed border-foreground" />
                    <div className="w-1 h-full bg-foreground/50 border-r-4 border-foreground" />
                    <div className="w-1 h-full bg-foreground/20 border-r-2 border-dashed border-foreground" />
                </div>

                {/* Intro Screen Overlay */}
                {gameState === "intro" && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-background/90 backdrop-blur-sm p-6 text-center"
                    >
                        <div className="w-16 h-16 rounded-full bg-primary/10 text-primary border-2 border-primary/20 shadow-pop-active flex items-center justify-center mb-4">
                            <Newspaper className="w-8 h-8" strokeWidth={2.5} />
                        </div>
                        <h3 className="text-xl font-black mb-2" style={{ fontFamily: 'var(--font-heading)' }}>Trade the News</h3>
                        <p className="text-muted-foreground mb-6 text-sm font-medium max-w-[200px]">
                            Good News? <span className="text-primary font-bold">BUY</span><br />
                            Bad News? <span className="text-destructive font-bold">SELL</span>
                        </p>
                        <button
                            onClick={startGame}
                            className="px-8 py-3 bg-primary text-primary-foreground rounded-xl font-bold border-2 border-foreground shadow-pop hover:translate-y-0.5 hover:shadow-none transition-all"
                        >
                            Start Trading
                        </button>
                    </motion.div>
                )}

                {/* Playing State */}
                {gameState === "playing" && currentScenario && (
                    <div className="w-full h-full flex flex-col justify-between items-center relative z-20">

                        {/* News Card (Top) */}
                        <AnimatePresence mode="wait">
                            {!feedback && (
                                <motion.div
                                    key={currentScenario.id}
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, transition: { duration: 0.5 } }} // Smoother/slower exit
                                    className="bg-card border-2 border-foreground shadow-pop-active px-4 py-3 rounded-xl w-full max-w-[280px] text-center relative z-10"
                                >
                                    <div className="text-[10px] font-black text-destructive uppercase tracking-wider mb-1 flex items-center justify-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-destructive animate-pulse" />
                                        BREAKING NEWS
                                    </div>
                                    <h3 className="text-sm font-bold leading-tight text-foreground">
                                        {currentScenario.headline}
                                    </h3>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* The Stock Ball (Center) */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full flex items-center justify-center pointer-events-none">
                            <div className="absolute w-full h-1 bg-foreground/10" /> {/* Horizon Line */}
                            <motion.div
                                animate={ballControls}
                                className={cn(
                                    "w-16 h-16 rounded-full bg-white border-4 shadow-pop flex items-center justify-center relative z-10 transition-colors duration-300",
                                    feedback?.type === 'success' ? "border-primary text-primary" :
                                        feedback?.type === 'error' ? "border-destructive text-destructive" :
                                            "border-foreground text-foreground"
                                )}
                            >
                                <span className="font-black text-xs uppercase tracking-widest">{ticker}</span>
                            </motion.div>
                        </div>

                        {/* Feedback (Bottom/Overlay) */}
                        <AnimatePresence>
                            {feedback && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className={cn(
                                        "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-2 rounded-xl font-bold text-white shadow-pop z-50 text-center whitespace-nowrap text-sm border-2 border-foreground",
                                        feedback.type === "success" ? "bg-primary" : "bg-destructive"
                                    )}
                                >
                                    {feedback.text}
                                </motion.div>
                            )}
                        </AnimatePresence>

                    </div>
                )}

                {/* Complete State */}
                {gameState === "complete" && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 z-50 bg-background/80 backdrop-blur-[2px] flex items-center justify-center p-6"
                    >
                        <motion.div
                            initial={{ scale: 0.8, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="w-full bg-card text-foreground border-2 border-foreground rounded-[2rem] shadow-pop p-6 text-center"
                        >
                            <div className="w-16 h-16 rounded-full bg-primary/10 text-primary border-2 border-primary/20 shadow-pop-active flex items-center justify-center mx-auto mb-4">
                                {score >= 2 ? (
                                    <CheckCircle2 className="w-8 h-8" strokeWidth={3} />
                                ) : (
                                    <X className="w-8 h-8 text-destructive" strokeWidth={3} />
                                )}
                            </div>
                            <h4 className="font-black text-2xl uppercase tracking-wide mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                                {score >= 2 ? "Great Trade!" : "Volatile!"}
                            </h4>
                            <p className="text-sm text-muted-foreground font-medium mb-6 px-4">
                                You scored {score}/{TOTAL_ROUNDS}. <br />
                                {score >= 2
                                    ? "You reacted perfectly to market news."
                                    : "News moves fast. Keep practicing."}
                            </p>
                            <button
                                onClick={onComplete}
                                className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-bold shadow-pop hover:translate-y-0.5 hover:shadow-none transition-all flex items-center justify-center gap-2"
                            >
                                Continue Lesson
                                <ArrowRight className="w-5 h-5" strokeWidth={3} />
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </div>

            {/* 3. Controls (Matching BetaShadow Chunky Buttons) */}
            <div className="grid grid-cols-2 gap-4">
                <button
                    onClick={() => handleReaction('sell')}
                    className={cn(
                        "relative h-24 rounded-2xl border-2 transition-all duration-200 active:translate-y-1 active:shadow-none flex flex-col items-center justify-center gap-1 group overflow-hidden bg-white border-destructive shadow-pop-active text-destructive hover:bg-destructive/5"
                    )}
                >
                    <div className="absolute top-2 right-2 opacity-20">
                        <ArrowBigDown size={20} />
                    </div>
                    <ArrowBigDown className="w-8 h-8 z-10 fill-destructive/20" />
                    <div className="flex flex-col items-center leading-none z-10">
                        <span className="font-black text-sm uppercase mt-1">SELL</span>
                        <span className="text-[10px] opacity-70 font-bold">BAD NEWS</span>
                    </div>
                </button>

                <button
                    onClick={() => handleReaction('buy')}
                    className={cn(
                        "relative h-24 rounded-2xl border-2 transition-all duration-200 active:translate-y-1 active:shadow-none flex flex-col items-center justify-center gap-1 group overflow-hidden bg-white border-primary shadow-pop-active text-primary hover:bg-primary/5"
                    )}
                >
                    <div className="absolute top-2 right-2 opacity-20">
                        <ArrowBigUp size={20} />
                    </div>
                    <ArrowBigUp className="w-8 h-8 z-10 fill-primary/20" />
                    <div className="flex flex-col items-center leading-none z-10">
                        <span className="font-black text-sm uppercase mt-1">BUY</span>
                        <span className="text-[10px] opacity-70 font-bold">GOOD NEWS</span>
                    </div>
                </button>
            </div>
        </div>
    )
}
