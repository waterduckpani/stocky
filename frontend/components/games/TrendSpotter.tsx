"use client"

import React, { useState, useEffect } from 'react'
import { Card } from "@/components/ui/card"
import { motion, AnimatePresence } from "framer-motion"
import { TrendingUp, TrendingDown, ArrowRight, CheckCircle2, XCircle } from 'lucide-react'
import { Area, AreaChart, ResponsiveContainer, YAxis } from "recharts"
import { cn } from "@/lib/utils"
import { MinigameCompletionPopup } from "./MinigameCompletionPopup"

interface Scenario {
    id: number
    text: string
    chart_cond: 'uptrend' | 'downtrend' | 'recovery'
    correct: 'bull' | 'bear'
    explanation: string
}

interface TrendSpotterProps {
    onComplete?: () => void
    instruction?: string
    config?: {
        scenarios: Scenario[]
    }
}

export function TrendSpotter({
    onComplete,
    instruction = "Spot the Trend",
    config
}: TrendSpotterProps) {
    const [currentRound, setCurrentRound] = useState(0)
    const [chartData, setChartData] = useState<{ i: number; value: number }[]>([])
    const [selectedAnswer, setSelectedAnswer] = useState<'bull' | 'bear' | null>(null)
    const [showFeedback, setShowFeedback] = useState(false)
    const [isCorrect, setIsCorrect] = useState(false)
    const [completed, setCompleted] = useState(false)

    const scenarios = config?.scenarios || []
    const currentScenario = scenarios[currentRound]

    // Generate Chart Data based on condition
    useEffect(() => {
        if (!currentScenario) return

        const data = []
        let val = 100
        const points = 60

        for (let i = 0; i < points; i++) {
            let change = 0
            const noise = (Math.random() - 0.5) * 2

            if (currentScenario.chart_cond === 'uptrend') {
                change = 0.5 + noise
            } else if (currentScenario.chart_cond === 'downtrend') {
                change = -0.5 + noise
            } else if (currentScenario.chart_cond === 'recovery') {
                // Dip then recovery
                if (i < 20) change = -0.8 + noise
                else change = 0.8 + noise
            }

            val += change
            if (val < 10) val = 10
            data.push({ i, value: val })
        }
        setChartData(data)
        setSelectedAnswer(null)
        setShowFeedback(false)
    }, [currentRound, currentScenario])

    const handleSelect = (choice: 'bull' | 'bear') => {
        if (showFeedback) return

        setSelectedAnswer(choice)
        const correct = choice === currentScenario.correct
        setIsCorrect(correct)
        setShowFeedback(true)
    }

    const handleNext = () => {
        if (currentRound < scenarios.length - 1) {
            setCurrentRound(prev => prev + 1)
        } else {
            setCompleted(true)
            setShowFeedback(false)
        }
    }

    if (!currentScenario) return <div>Loading...</div>

    return (
        <div className="flex flex-col items-center space-y-4 w-full max-w-4xl mx-auto p-2 animate-pop-in">
            {/* Header */}
            <div className="text-center space-y-1">
                <h3 className="text-xl font-bold flex items-center justify-center gap-2" style={{ fontFamily: 'var(--font-heading)' }}>
                    Trend Spotter
                </h3>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Round {currentRound + 1} of {scenarios.length}: {instruction}
                </p>
                {/* Progress Dots */}
                <div className="flex gap-1 justify-center mt-2">
                    {scenarios.map((_, idx) => (
                        <div key={idx} className={cn(
                            "w-2 h-2 rounded-full transition-colors",
                            idx < currentRound ? "bg-primary" :
                                idx === currentRound ? "bg-primary/50 animate-pulse" : "bg-muted"
                        )} />
                    ))}
                </div>
            </div>

            {/* Main Game Card */}
            <div className="w-full max-w-2xl bg-white rounded-[2.5rem] border-2 border-foreground shadow-pop overflow-hidden flex flex-col items-center relative">

                {/* Scenario Context */}
                <div className="w-full px-8 py-6 bg-primary/5 border-b-2 border-border text-center">
                    <p className="font-bold text-xl leading-snug text-foreground">
                        "{currentScenario.text}"
                    </p>
                </div>

                {/* Chart Area */}
                <div className="w-full h-[240px] p-2 bg-gradient-to-b from-white to-primary/5 relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3BB273" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#3BB273" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <YAxis domain={['auto', 'auto']} hide />
                            <Area
                                type="monotone"
                                dataKey="value"
                                stroke="#3BB273"
                                strokeWidth={3}
                                fill="url(#colorPrice)"
                                isAnimationActive={true}
                                animationDuration={1000}
                            />
                        </AreaChart>
                    </ResponsiveContainer>

                </div>

                {/* Controls */}
                <div className="grid grid-cols-2 gap-4 w-full p-4 relative z-40 bg-background">
                    <button
                        onClick={() => handleSelect('bear')}
                        disabled={showFeedback}
                        className={cn(
                            "relative h-24 rounded-2xl border-2 transition-all duration-200 flex flex-col items-center justify-center gap-1 group overflow-hidden bg-white border-destructive shadow-pop-active text-destructive hover:bg-destructive/5",
                            showFeedback ? "opacity-50 pointer-events-none" : "active:translate-y-1 active:shadow-none"
                        )}
                    >
                        <div className="absolute top-2 right-2 opacity-20">
                            <TrendingDown size={20} />
                        </div>
                        <TrendingDown className="w-8 h-8 z-10 fill-destructive/20" />
                        <div className="flex flex-col items-center leading-none z-10">
                            <span className="font-black text-sm uppercase mt-1">BEAR</span>
                        </div>
                    </button>

                    <button
                        onClick={() => handleSelect('bull')}
                        disabled={showFeedback}
                        className={cn(
                            "relative h-24 rounded-2xl border-2 transition-all duration-200 flex flex-col items-center justify-center gap-1 group overflow-hidden bg-white border-primary shadow-pop-active text-primary hover:bg-primary/5",
                            showFeedback ? "opacity-50 pointer-events-none" : "active:translate-y-1 active:shadow-none"
                        )}
                    >
                        <div className="absolute top-2 right-2 opacity-20">
                            <TrendingUp size={20} />
                        </div>
                        <TrendingUp className="w-8 h-8 z-10 fill-primary/20" />
                        <div className="flex flex-col items-center leading-none z-10">
                            <span className="font-black text-sm uppercase mt-1">BULL</span>
                        </div>
                    </button>
                </div>

                {/* Feedback Overlay */}
                <AnimatePresence>
                    {showFeedback && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="absolute inset-0 z-50 bg-background/80 backdrop-blur-[2px] flex items-center justify-center p-6"
                        >
                            <motion.div
                                initial={{ scale: 0.8, y: 20 }}
                                animate={{ scale: 1, y: 0 }}
                                className="w-[85%] max-w-sm bg-card text-foreground border-2 border-foreground rounded-[2rem] shadow-pop p-6 text-center"
                            >
                                <div className={cn(
                                    "w-16 h-16 rounded-full border-2 shadow-pop-active flex items-center justify-center mx-auto mb-4",
                                    isCorrect ? "bg-primary/10 text-primary border-primary/20" : "bg-destructive/10 text-destructive border-destructive/20"
                                )}>
                                    {isCorrect ? (
                                        <CheckCircle2 className="w-8 h-8" strokeWidth={3} />
                                    ) : (
                                        <XCircle className="w-8 h-8" strokeWidth={3} />
                                    )}
                                </div>
                                <h4 className="font-black text-2xl uppercase tracking-wide mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                                    {isCorrect ? "Spot On!" : "Not Quite."}
                                </h4>
                                <p className="text-sm text-muted-foreground font-medium mb-6 px-4">
                                    {currentScenario.explanation}
                                </p>
                                {isCorrect ? (
                                    <button
                                        onClick={handleNext}
                                        className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-bold shadow-pop hover:translate-y-0.5 hover:shadow-none transition-all flex items-center justify-center gap-2"
                                    >
                                        {currentRound < scenarios.length - 1 ? "Next Round" : "Finish Lesson"}
                                        <ArrowRight className="w-5 h-5" strokeWidth={3} />
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => setShowFeedback(false)}
                                        className="w-full py-4 bg-muted text-foreground rounded-xl font-bold border-2 border-foreground shadow-[0_4px_0_0_rgba(0,0,0,1)] hover:translate-y-0.5 hover:shadow-none transition-all"
                                    >
                                        Try Again
                                    </button>
                                )}
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>



            </div>

            <MinigameCompletionPopup
                completed={completed}
                onComplete={onComplete || (() => { })}
                title="Trend Spotter!"
                description="You easily spotted the market's current trajectory."
            />
        </div>
    )
}
