"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Trophy, CheckCircle2, XCircle, ArrowRight, Zap, Volume2 } from "lucide-react"

export interface VolumeVaultConfig {
    instruction: string
    scenarios: {
        headline: string
        correct_vault: "Low" | "Medium" | "High"
        explanation: string
    }[]
}

interface VolumeVaultProps {
    onComplete: () => void
    config: VolumeVaultConfig
}

const VAULTS = [
    { id: "Low", label: "Quiet Day", intensity: 3, speed: 2, color: "bg-blue-500" },
    { id: "Medium", label: "Steady Flow", intensity: 15, speed: 1, color: "bg-amber-500" },
    { id: "High", label: "Market Frenzy", intensity: 60, speed: 0.2, color: "bg-red-500" },
]

export function VolumeVault({ onComplete, config }: VolumeVaultProps) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [score, setScore] = useState(0)
    const [completed, setCompleted] = useState(false)
    const [feedback, setFeedback] = useState<{ type: "success" | "error", message: string } | null>(null)

    const currentScenario = config.scenarios[currentIndex]
    const isLast = currentIndex >= config.scenarios.length - 1

    const handleChoice = (vaultId: string) => {
        if (feedback) return // Prevent double pulse

        const isCorrect = vaultId === currentScenario.correct_vault

        if (isCorrect) {
            setFeedback({ type: "success", message: currentScenario.explanation })
            setScore(prev => prev + 1)
        } else {
            setFeedback({ type: "error", message: currentScenario.explanation })
        }

        setTimeout(() => {
            if (isLast) {
                setCompleted(true)
            } else {
                setFeedback(null)
                setCurrentIndex(prev => prev + 1)
            }
        }, 2000)
    }

    if (completed) {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-center animate-in zoom-in duration-500 min-h-[400px]">
                <div className="w-24 h-24 bg-primary/20 text-primary rounded-full flex items-center justify-center mb-6 animate-bounce">
                    <Trophy className="w-12 h-12" />
                </div>
                <h2 className="text-3xl font-black mb-2" style={{ fontFamily: 'var(--font-heading)' }}>Volume Virtuoso!</h2>
                <p className="text-muted-foreground mb-8 text-lg">You can hear the market's heartbeat.</p>
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
            <div className="w-full flex justify-between items-center mb-2">
                <div className="text-lg font-bold text-muted-foreground">{config.instruction}</div>
                <div className="flex items-center gap-2 font-bold text-xl">
                    <Trophy className="w-5 h-5 text-amber-500" />
                    <span>{score} / {config.scenarios.length}</span>
                </div>
            </div>

            {/* News Ticker Display */}
            <div className="w-full bg-white border-2 border-foreground rounded-3xl p-6 shadow-pop mb-8 min-h-[140px] flex items-center justify-center relative overflow-hidden">
                <div className="absolute top-0 left-0 bg-destructive/10 text-destructive px-3 py-1 text-xs font-black rounded-br-xl flex items-center gap-1 uppercase tracking-wider">
                    <Zap className="w-3 h-3" /> Live News
                </div>
                <h3 className="text-2xl font-black text-center animate-in slide-in-from-right duration-500 leading-tight" style={{ fontFamily: 'var(--font-heading)' }} key={currentIndex}>
                    "{currentScenario.headline}"
                </h3>


            </div>

            {/* The Vaults */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full relative z-10">
                {VAULTS.map((vault) => (
                    <button
                        key={vault.id}
                        onClick={() => handleChoice(vault.id)}
                        disabled={!!feedback}
                        className="group relative h-64 border-2 border-foreground rounded-3xl bg-white overflow-hidden hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none flex flex-col justify-end shadow-sm hover:shadow-pop"
                    >
                        {/* Dot Swarm Container */}
                        <div className="absolute inset-0 pointer-events-none p-4 opacity-70 group-hover:opacity-100 transition-opacity">
                            {[...Array(vault.intensity)].map((_, i) => (
                                <SwarmingDot key={i} speed={vault.speed} color={vault.color} />
                            ))}
                        </div>

                        {/* Label */}
                        <div className="relative z-10 p-4 border-t-2 border-foreground/5 bg-white/90 backdrop-blur-sm w-full">
                            <h4 className="font-black text-lg text-center uppercase tracking-wide" style={{ fontFamily: 'var(--font-heading)' }}>{vault.label}</h4>
                            <div className="flex justify-center mt-2">
                                <Volume2 className={cn("w-5 h-5",
                                    vault.id === "Low" ? "text-blue-500" :
                                        vault.id === "Medium" ? "text-amber-500" : "text-red-500"
                                )} />
                            </div>
                        </div>
                    </button>
                ))}
            </div>

            {/* Feedback Overlay - Centered in Game Area */}
            <AnimatePresence>
                {feedback && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.8, y: 20 }}
                            className="p-8 w-[90%] max-w-sm bg-white rounded-[2rem] shadow-pop border-2 border-foreground flex flex-col items-center justify-center text-center gap-4 pointer-events-auto"
                        >
                            <div className={cn(
                                "w-20 h-20 rounded-full flex items-center justify-center mb-1 ring-4 ring-offset-2",
                                feedback.type === "success" ? "bg-green-100 ring-green-100/50 text-green-600" : "bg-red-100 ring-red-100/50 text-red-600"
                            )}>
                                {feedback.type === "success" ? (
                                    <CheckCircle2 className="w-10 h-10" />
                                ) : (
                                    <XCircle className="w-10 h-10" />
                                )}
                            </div>

                            <div>
                                <h3 className={cn("text-2xl font-black mb-2", feedback.type === "success" ? "text-green-600" : "text-red-500")} style={{ fontFamily: 'var(--font-heading)' }}>
                                    {feedback.type === "success" ? "Spot On!" : "Not Quite"}
                                </h3>
                                <p className="font-bold text-lg text-muted-foreground leading-snug">{feedback.message}</p>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

        </div>
    )
}

function SwarmingDot({ speed, color }: { speed: number, color: string }) {
    // Randomize movement parameters per dot
    const duration = speed * (Math.random() + 0.5) * 2

    return (
        <motion.div
            className={cn("absolute w-3 h-3 rounded-full", color)}
            initial={{
                x: Math.random() * 200 - 100 + "%",
                y: Math.random() * 200 - 100 + "%",
                opacity: 0
            }}
            animate={{
                x: [
                    Math.random() * 200 + "%",
                    Math.random() * 200 + "%",
                    Math.random() * 200 + "%"
                ],
                y: [
                    Math.random() * 200 + "%",
                    Math.random() * 200 + "%",
                    Math.random() * 200 + "%"
                ],
                opacity: [0.6, 1, 0.6]
            }}
            transition={{
                duration: duration,
                repeat: Infinity,
                ease: "linear",
                repeatType: "mirror"
            }}
            style={{
                left: Math.random() * 80 + 10 + "%",
                top: Math.random() * 80 + 10 + "%"
            }}
        />
    )
}
