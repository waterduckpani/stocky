"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Trophy, CheckCircle2, XCircle, ArrowRight, Activity, Thermometer, Zap } from "lucide-react"

export interface WiggleTamerConfig {
    instruction: string
    scenarios: {
        stock_type: string
        behavior: string
        difficulty: "Easy" | "Hard"
        explanation: string
    }[]
}

interface WiggleTamerProps {
    onComplete: () => void
    config: WiggleTamerConfig
}

export function WiggleTamer({ onComplete, config }: WiggleTamerProps) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [score, setScore] = useState(0)
    const [completed, setCompleted] = useState(false)
    const [feedback, setFeedback] = useState<{ type: "success" | "error", message: string } | null>(null)
    const [gameState, setGameState] = useState<"waiting" | "playing" | "captured">("waiting")

    const currentScenario = config.scenarios[currentIndex]
    const isLast = currentIndex >= config.scenarios.length - 1
    const isHard = currentScenario.difficulty === "Hard"

    // Hard mode randomization
    const [position, setPosition] = useState({ x: 0, y: 0 })
    const requestRef = useRef<number | null>(null)

    // Win condition handling
    const handleCapture = () => {
        if (feedback) return

        // Success!
        setFeedback({ type: "success", message: currentScenario.explanation })
        setGameState("captured")
        setScore(prev => prev + 1)

        setTimeout(() => {
            if (isLast) {
                setCompleted(true)
            } else {
                setFeedback(null)
                setGameState("waiting")
                setCurrentIndex(prev => prev + 1)
            }
        }, 2500)
    }

    // Jitter Loop for Hard Mode
    useEffect(() => {
        if (gameState !== "waiting" && gameState !== "playing") return

        const animate = (time: number) => {
            if (isHard) {
                // Chaotic movement
                const timeScale = time * 0.005
                const x = Math.sin(timeScale) * 120 + Math.cos(timeScale * 2.3) * 50
                const y = Math.cos(timeScale * 1.5) * 80 + Math.sin(timeScale * 3.1) * 40
                setPosition({ x, y })
            } else {
                // Steady center
                setPosition({ x: 0, y: 0 })
            }
            requestRef.current = requestAnimationFrame(animate)
        }

        requestRef.current = requestAnimationFrame(animate)
        return () => cancelAnimationFrame(requestRef.current!)
    }, [isHard, gameState])

    if (completed) {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-center animate-in zoom-in duration-500 min-h-[400px]">
                <div className="w-24 h-24 bg-primary/20 text-primary rounded-full flex items-center justify-center mb-6 animate-bounce">
                    <Trophy className="w-12 h-12" />
                </div>
                <h2 className="text-3xl font-black mb-2" style={{ fontFamily: 'var(--font-heading)' }}>Volatility Tamer!</h2>
                <p className="text-muted-foreground mb-8 text-lg">You've mastered the market's pulse.</p>
                <div className="text-xl font-bold mb-8">Score: {score} / {config.scenarios.length}</div>
                <button
                    onClick={onComplete}
                    className="bg-primary text-primary-foreground text-xl font-bold py-4 px-12 rounded-xl shadow-pop hover:translate-y-0.5 hover:shadow-none transition-all flex items-center gap-2"
                >
                    Continue Lesson <ArrowRight className="w-6 h-6" />
                </button>
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center w-full max-w-3xl mx-auto min-h-[500px] relative">
            {/* Header */}
            <div className="w-full flex justify-between items-center mb-6 px-4">
                <div className="text-lg font-bold text-muted-foreground">{config.instruction}</div>
                <div className="flex items-center gap-2 font-bold text-xl">
                    <Trophy className="w-5 h-5 text-amber-500" />
                    <span>{score} / {config.scenarios.length}</span>
                </div>
            </div>

            {/* Target Info */}
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted rounded-full text-sm font-black uppercase tracking-wide mb-2">
                    {isHard ? <Zap className="w-4 h-4 text-red-500" /> : <Activity className="w-4 h-4 text-blue-500" />}
                    {currentScenario.stock_type}
                </div>
                <h3 className="text-2xl font-black" style={{ fontFamily: 'var(--font-heading)' }}>
                    {isHard ? "High Volatility" : "Low Volatility"}
                </h3>
            </div>

            {/* Game Area */}
            <div className="flex-1 w-full relative flex items-center justify-center min-h-[300px] bg-muted/30 rounded-3xl border-2 border-dashed border-foreground/20 overflow-hidden cursor-crosshair">

                {/* The Target */}
                <motion.button
                    onClick={handleCapture}
                    disabled={!!feedback}
                    style={{ x: position.x, y: position.y }}
                    animate={{
                        scale: isHard ? [1, 0.8, 1.2, 0.9, 1] : [1, 1.2, 1],
                        rotate: isHard ? [0, -10, 10, -5, 5, 0] : 0,
                    }}
                    transition={{
                        duration: isHard ? 0.5 : 2,
                        repeat: Infinity,
                        ease: isHard ? "easeInOut" : "easeInOut"
                    }}
                    className={cn(
                        "w-24 h-24 rounded-2xl border-2 border-foreground shadow-pop flex items-center justify-center transition-colors active:scale-90 active:shadow-none active:translate-y-1 relative z-10",
                        isHard ? "bg-red-500 text-white hover:bg-red-400" : "bg-blue-500 text-white hover:bg-blue-400",
                        !!feedback && "pointer-events-none"
                    )}
                >
                    {isHard ? <Thermometer className="w-10 h-10 animate-pulse" /> : <Activity className="w-10 h-10" />}
                </motion.button>

                {/* Grid Lines for Effect */}
                <div className="absolute inset-0 pointer-events-none opacity-10"
                    style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '20px 20px' }}
                />

                {/* Feedback Overlay - Pop Style */}
                <AnimatePresence>
                    {feedback && (
                        <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.8, y: 20 }}
                                className="p-8 w-[90%] max-w-sm bg-white rounded-3xl border-2 border-foreground shadow-pop flex flex-col items-center justify-center text-center gap-4 pointer-events-auto"
                            >
                                <div className={cn(
                                    "w-20 h-20 rounded-full flex items-center justify-center mb-1 border-2 border-foreground shadow-sm",
                                    feedback.type === "success" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                                )}>
                                    {feedback.type === "success" ? (
                                        <CheckCircle2 className="w-10 h-10" />
                                    ) : (
                                        <XCircle className="w-10 h-10" />
                                    )}
                                </div>

                                <div>
                                    <h3 className={cn("text-2xl font-black mb-2", feedback.type === "success" ? "text-green-600" : "text-red-500")} style={{ fontFamily: 'var(--font-heading)' }}>
                                        {feedback.type === "success" ? "Captured!" : "Missed!"}
                                    </h3>
                                    <p className="font-bold text-lg text-muted-foreground leading-snug">{feedback.message}</p>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>

            <p className="mt-4 text-sm font-bold text-muted-foreground animate-pulse">
                Tap the square to capture the data point!
            </p>
        </div>
    )
}
