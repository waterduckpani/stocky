"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useAnimation, AnimatePresence } from "framer-motion"
import { Anchor, ArrowRight, CheckCircle2, Ruler, TrendingUp, TrendingDown, HelpCircle, X, Trophy } from "lucide-react"
import { cn } from "@/lib/utils"
import { MinigameCompletionPopup } from "./MinigameCompletionPopup"

interface ThePriceAnchorProps {
    onComplete: () => void
    ticker: string
    stockData: any
}

type GameState = "intro" | "playing" | "complete"

interface Scenario {
    id: string
    title: string
    description: string
    targetPrice: number
    icon: any
    color: string
}

export default function ThePriceAnchor({ onComplete, ticker, stockData }: ThePriceAnchorProps) {
    const [gameState, setGameState] = useState<GameState>("intro")
    const [round, setRound] = useState(0)
    const [score, setScore] = useState(0)
    const [scenarios, setScenarios] = useState<Scenario[]>([])
    const [sliderValue, setSliderValue] = useState(50) // 0 to 100% position
    const [feedback, setFeedback] = useState<{ text: string, type: "success" | "warning" | "error" } | null>(null)
    const [showResult, setShowResult] = useState(false)

    // Ranges
    const price = stockData.price || 100
    const high52 = stockData.week_52_high || (price * 1.5)
    const low52 = stockData.week_52_low || (price * 0.7)
    const range = high52 - low52

    // Initialize Scenarios
    useEffect(() => {
        // Scenario 1: The Peak (High)
        const peakTarget = high52 - (range * 0.05) // Near top
        const peakScenario = {
            id: "peak",
            title: "The Euphoria",
            description: "Investors were extremely greedy and optimistic. The stock was dangerously expensive.",
            targetPrice: peakTarget,
            icon: TrendingUp,
            color: "text-green-500"
        }

        // Scenario 2: The Panic (Low)
        const panicTarget = low52 + (range * 0.1) // Near bottom
        const panicScenario = {
            id: "panic",
            title: "The Panic",
            description: "Fear took over. Everyone was selling, creating a massive discount.",
            targetPrice: panicTarget,
            icon: TrendingDown,
            color: "text-red-500"
        }

        // Scenario 3: The Recovery (Dip Buy)
        const recoveryTarget = low52 + (range * 0.3)
        const recoveryScenario = {
            id: "recovery",
            title: "The Recovery",
            description: "Smart money stepped in after the panic. Where do you think the first bounce went?",
            targetPrice: recoveryTarget,
            icon: TrendingUp,
            color: "text-yellow-600"
        }

        // Scenario 4: The Reality (Current)
        const currentScenario = {
            id: "current",
            title: "Right Now",
            description: "Where is the stock choosing to sit today relative to its history?",
            targetPrice: price,
            icon: HelpCircle,
            color: "text-blue-500"
        }

        setScenarios([peakScenario, panicScenario, recoveryScenario, currentScenario])
    }, [high52, low52, price, range])

    const currentScenario = scenarios[round]

    // Convert Slider (0-100) to Price
    const getPriceFromSlider = (val: number) => {
        return low52 + (val / 100) * range
    }

    // Convert Price to Slider (0-100)
    const getSliderFromPrice = (p: number) => {
        return Math.min(100, Math.max(0, ((p - low52) / range) * 100))
    }

    const handleGuess = () => {
        if (!currentScenario) return

        const userPrice = getPriceFromSlider(sliderValue)
        const targetSlider = getSliderFromPrice(currentScenario.targetPrice)
        const diff = Math.abs(sliderValue - targetSlider)

        let points = 0
        let msg = ""
        let type: "success" | "warning" | "error" = "error"

        if (diff < 10) {
            points = 1
            msg = "Perfect! Spot on!"
            type = "success"
        } else if (diff < 25) {
            msg = "Close! But not quite."
            type = "warning"
        } else {
            msg = "Way off! Watch the range."
            type = "error"
        }

        setScore(s => s + points)
        setFeedback({ text: msg, type })
        setShowResult(true)

        // Auto-advance after 1.5 seconds
        setTimeout(() => {
            handleNextRound()
        }, 1500)
    }

    const handleNextRound = () => {
        if (round < scenarios.length - 1) {
            setRound(r => r + 1)
            setSliderValue(50)
            setFeedback(null)
            setShowResult(false)
        } else {
            setGameState("complete")
        }
    }

    // Draggable Constraints
    const constraintsRef = useRef(null)

    return (
        <div className="w-full max-w-xl mx-auto bg-card rounded-[2rem] border-2 border-foreground shadow-pop p-6 relative overflow-hidden flex flex-col gap-6 animate-pop-in select-none">

            {/* Header */}
            <div className="text-center relative z-10">
                <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/20 text-primary border-2 border-primary/30 shadow-pop-active transform rotate-3">
                        <Anchor className="w-6 h-6" strokeWidth={2.5} />
                    </div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs font-black uppercase tracking-wider border-2 border-border">
                        Price Anchor
                    </div>
                </div>
                <h3 className="text-xl font-black text-foreground mt-2" style={{ fontFamily: 'var(--font-heading)' }}>
                    Historical Moods
                </h3>
                <p className="text-sm font-medium text-muted-foreground mt-1">
                    Round {round + 1}/{scenarios.length} • Drag to guess the price!
                </p>
            </div>

            {/* Game Stage */}
            <div className="relative w-full h-96 bg-background rounded-[1.5rem] border-2 border-foreground shadow-inner overflow-hidden flex flex-col items-center justify-between p-6">

                {/* Intro Overlay */}
                {gameState === "intro" && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 z-30 bg-background/90 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center"
                    >
                        <div className="bg-primary/10 p-4 rounded-full mb-4 ring-4 ring-primary/20">
                            <Ruler className="w-10 h-10 text-primary" strokeWidth={2.5} />
                        </div>
                        <h2 className="text-2xl font-black mb-2" style={{ fontFamily: 'var(--font-heading)' }}>Values change.</h2>
                        <p className="text-muted-foreground font-medium mb-8">
                            A stock price is never static. It swings between <span className="text-green-600 font-bold">Euphoria (High)</span> and <span className="text-red-500 font-bold">Panic (Low)</span>.
                            <br /><br />
                            Can you identify where the price was during these moments?
                        </p>
                        <button
                            onClick={() => setGameState("playing")}
                            className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-bold shadow-pop hover:translate-y-0.5 hover:shadow-none transition-all flex items-center justify-center gap-2"
                        >
                            Start Anchoring
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </motion.div>
                )}

                {/* Scenario Text */}
                {gameState === "playing" && currentScenario && (
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentScenario.id}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="text-center w-full max-w-sm mb-4"
                        >
                            <div className={cn("inline-flex items-center gap-2 mb-2 px-3 py-1 rounded-full bg-muted border border-foreground/10 text-xs font-bold uppercase tracking-wider", currentScenario.color)}>
                                <currentScenario.icon className="w-4 h-4" />
                                {currentScenario.title}
                            </div>
                            <p className="text-lg font-bold leading-tight">
                                {currentScenario.description}
                            </p>
                        </motion.div>
                    </AnimatePresence>
                )}

                {/* The Slider Track - Only Show when Playing */}
                {gameState === "playing" && (
                    <div className="w-full relative px-6 mt-auto mb-8 animate-in fade-in zoom-in duration-500" ref={constraintsRef}>

                        {/* Labels */}
                        <div className="absolute -top-8 left-6 text-xs font-bold text-muted-foreground">
                            Low ${low52.toFixed(0)}
                        </div>
                        <div className="absolute -top-8 right-6 text-xs font-bold text-muted-foreground">
                            High ${high52.toFixed(0)}
                        </div>

                        {/* Track Container with Interaction Layer */}
                        <div className="relative h-12 flex items-center">

                            {/* Visual Track Line */}
                            <div className="w-full h-4 bg-muted rounded-full border-2 border-border relative overflow-visible">
                                {/* Range Fill (Visual only) */}
                                <div className="absolute inset-y-0 left-0 bg-foreground/5 w-full rounded-full" />

                                {/* Correct Answer Marker */}
                                {showResult && currentScenario && (
                                    <motion.div
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-green-500 rounded-full border-2 border-white shadow-sm z-10"
                                        style={{ left: `${getSliderFromPrice(currentScenario.targetPrice)}%`, marginLeft: '-8px' }}
                                    >
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md whitespace-nowrap">
                                            Target
                                        </div>
                                    </motion.div>
                                )}
                            </div>

                            {/* INVISIBLE RANGE INPUT - COVERS ENTIRE WIDTH */}
                            <input
                                type="range"
                                min="0"
                                max="100"
                                step="0.5"
                                value={sliderValue}
                                onChange={(e) => !showResult && setSliderValue(Number(e.target.value))}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-30"
                                disabled={showResult}
                            />

                            {/* Visual Thumb (Follows state) */}
                            <div
                                className="absolute top-1/2 -translate-y-1/2 w-10 h-10 -ml-5 pointer-events-none z-20 transition-transform duration-75 ease-out"
                                style={{ left: `${sliderValue}%` }}
                            >
                                <div className={cn(
                                    "w-10 h-10 rounded-full bg-white border-4 shadow-pop flex items-center justify-center transition-colors",
                                    showResult && feedback?.type === 'success' ? "border-green-500 text-green-500" :
                                        showResult && feedback?.type === 'error' ? "border-red-500 text-red-500" :
                                            "border-primary text-primary"
                                )}>
                                    <Anchor className="w-5 h-5" />
                                </div>

                                {/* Current Value Tooltip */}
                                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-foreground text-background text-xs font-bold px-2 py-1 rounded-md whitespace-nowrap border border-border shadow-sm">
                                    ${getPriceFromSlider(sliderValue).toFixed(2)}
                                </div>
                            </div>

                        </div>
                    </div>
                )}

                {/* Result Feedback Overlay */}
                <AnimatePresence>
                    {showResult && feedback && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            className={cn(
                                "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-6 py-3 rounded-xl border-2 shadow-pop z-40 text-center min-w-[200px]",
                                feedback.type === 'success' ? "bg-green-100 border-green-600 text-green-800" :
                                    feedback.type === 'warning' ? "bg-yellow-100 border-yellow-600 text-yellow-800" :
                                        "bg-red-100 border-red-600 text-red-800"
                            )}
                        >
                            <div className="font-black text-lg mb-1">{feedback.type === 'success' ? "Great!" : feedback.type === 'error' ? "Oops!" : "Close!"}</div>
                            <div className="text-sm font-medium">{feedback.text}</div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Controls - Only Show when Playing */}
            <div>
                {gameState === "playing" && !showResult && (
                    <button
                        onClick={handleGuess}
                        className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-bold border-2 border-foreground shadow-pop hover:translate-y-0.5 hover:shadow-none transition-all flex items-center justify-center gap-2"
                    >
                        Lock In Price
                        <CheckCircle2 className="w-5 h-5" />
                    </button>
                )}
            </div>

            <MinigameCompletionPopup
                completed={gameState === "complete"}
                onComplete={onComplete}
                title={score >= 2 ? "Range Master! ⚓" : "Keep Watching! 👀"}
                description={`You scored ${score}/${scenarios.length}. ${score >= 2 ? "Understanding the 52-week range helps you know if a stock is cheap or expensive." : "Stock prices are like moods — they swing from high to low. Keep practicing!"}`}
                icon={score >= 2 ? Trophy : Anchor}
            />

        </div>
    )
}
