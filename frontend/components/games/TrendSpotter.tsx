"use client"

import React, { useState, useEffect } from 'react'
import { Card } from "@/components/ui/card"
import { motion, AnimatePresence } from "framer-motion"
import { TrendingUp, TrendingDown, ArrowRight, CheckCircle2, XCircle } from 'lucide-react'
import { Area, AreaChart, ResponsiveContainer, YAxis } from "recharts"
import { cn } from "@/lib/utils"

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
            if (onComplete) onComplete()
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

                    {/* Feedback Overlay */}
                    <AnimatePresence>
                        {showFeedback && (
                            <motion.div
                                initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                                animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
                                className="absolute inset-0 flex flex-col items-center justify-center bg-white/60 z-10 p-4 text-center"
                            >
                                <motion.div
                                    initial={{ scale: 0.5, y: 20 }}
                                    animate={{ scale: 1, y: 0 }}
                                    className={cn(
                                        "flex flex-col items-center p-6 rounded-3xl border-2 shadow-xl bg-white",
                                        isCorrect ? "border-green-500 shadow-green-200" : "border-red-500 shadow-red-200"
                                    )}
                                >
                                    {isCorrect ? (
                                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-3">
                                            <CheckCircle2 className="w-8 h-8 text-green-600" />
                                        </div>
                                    ) : (
                                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-3">
                                            <XCircle className="w-8 h-8 text-red-600" />
                                        </div>
                                    )}

                                    <h4 className="text-2xl font-black mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                                        {isCorrect ? "Spot On!" : "Not Quite."}
                                    </h4>
                                    <p className="text-muted-foreground font-bold text-sm mb-6 max-w-[200px] leading-tight">
                                        {currentScenario.explanation}
                                    </p>

                                    {isCorrect ? (
                                        <button
                                            onClick={handleNext}
                                            className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-bold shadow-pop hover:translate-y-0.5 hover:shadow-none transition-all flex items-center justify-center gap-2"
                                        >
                                            {currentRound < scenarios.length - 1 ? "Next Round" : "Finish Lesson"}
                                            <ArrowRight className="w-5 h-5" />
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => setShowFeedback(false)}
                                            className="w-full py-3 bg-muted text-muted-foreground rounded-xl font-bold shadow-[0_4px_0_0_rgba(0,0,0,0.2)] hover:translate-y-0.5 hover:shadow-none transition-all"
                                        >
                                            Try Again
                                        </button>
                                    )}
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Controls */}
                <div className="grid grid-cols-2 w-full p-4 gap-4 bg-muted/20">
                    <button
                        onClick={() => handleSelect('bear')}
                        disabled={showFeedback}
                        className="group relative bg-white rounded-2xl border-2 border-foreground p-4 hover:-translate-y-1 hover:shadow-pop-red transition-all disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none"
                    >
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center group-hover:bg-red-100 transition-colors">
                                <TrendingDown className="w-6 h-6 text-red-500" />
                            </div>
                            <span className="font-black text-foreground text-lg uppercase tracking-wide">Bear</span>
                        </div>
                    </button>

                    <button
                        onClick={() => handleSelect('bull')}
                        disabled={showFeedback}
                        className="group relative bg-white rounded-2xl border-2 border-foreground p-4 hover:-translate-y-1 hover:shadow-pop-green transition-all disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none"
                    >
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center group-hover:bg-green-100 transition-colors">
                                <TrendingUp className="w-6 h-6 text-green-500" />
                            </div>
                            <span className="font-black text-foreground text-lg uppercase tracking-wide">Bull</span>
                        </div>
                    </button>
                </div>

            </div>
        </div>
    )
}
