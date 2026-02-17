"use client"

import { useState, useEffect } from "react"
import { Zap, CheckCircle2, XCircle, Sparkles, Lock } from "lucide-react"
import { supabase } from "@/utils/supabase/client"

interface QuizData {
    question: string
    options: string[]
    correctAnswer: number
    explanation: string
}

export function DailyQuiz() {
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
    const [showResult, setShowResult] = useState(false)
    const [quiz, setQuiz] = useState<QuizData | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [hasCompletedLesson, setHasCompletedLesson] = useState(false)
    const [currentLesson, setCurrentLesson] = useState(1)

    useEffect(() => {
        async function loadQuizState() {
            setIsLoading(true)

            try {
                // Check if user has completed a lesson today
                const { data: { user } } = await supabase.auth.getUser()

                if (user) {
                    const today = new Date().toISOString().split('T')[0]

                    // Check user_activity for any activity today
                    const { data: activityData } = await supabase
                        .from('user_activity')
                        .select('activity_date')
                        .eq('user_id', user.id)
                        .eq('activity_date', today)
                        .limit(1)

                    setHasCompletedLesson(!!(activityData && activityData.length > 0))

                    // Get current lesson from user_lesson_progress (or default to 1)
                    const { data: progressData } = await supabase
                        .from('user_lesson_progress')
                        .select('current_lesson')
                        .eq('user_id', user.id)
                        .single()

                    const lesson = progressData?.current_lesson || 1
                    setCurrentLesson(lesson)

                    // Fetch quiz from backend regardless of completion (so we can show the question)
                    try {
                        const response = await fetch(`http://localhost:8000/api/daily-quiz/${lesson}`)
                        if (response.ok) {
                            const quizData = await response.json()
                            setQuiz({
                                question: quizData.question,
                                options: quizData.options,
                                correctAnswer: quizData.correctAnswer,
                                explanation: quizData.explanation
                            })
                        } else {
                            // Fallback if fetch fails
                            setQuiz(getFallbackQuiz(lesson))
                        }
                    } catch {
                        // Backend not available, use fallback quiz
                        setQuiz(getFallbackQuiz(lesson))
                    }
                } else {
                    // Not logged in, use fallback
                    setQuiz(getFallbackQuiz(1))
                    setHasCompletedLesson(true)
                }
            } catch (error) {
                console.error('Error loading quiz state:', error)
                // Use fallback on any error
                setQuiz(getFallbackQuiz(1))
                setHasCompletedLesson(true)
            }

            setIsLoading(false)
        }

        loadQuizState()
    }, [])

    const handleAnswer = (index: number) => {
        if (!quiz) return
        setSelectedAnswer(index)
        setShowResult(true)
    }

    // Loading state
    if (isLoading) {
        return (
            <div className="rounded-2xl border-2 border-foreground bg-card shadow-soft overflow-hidden">
                <div className="px-6 py-4 border-b-2 border-foreground/10 flex items-center justify-between bg-tertiary/10">
                    <h3 className="text-lg font-bold flex items-center gap-2 text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>
                        <div className="h-8 w-8 rounded-lg bg-tertiary border-2 border-foreground flex items-center justify-center">
                            <Zap className="h-4 w-4 text-tertiary-foreground" strokeWidth={2.5} />
                        </div>
                        Daily Quiz
                    </h3>
                </div>
                <div className="p-6 flex items-center justify-center">
                    <div className="animate-pulse text-muted-foreground">Loading quiz...</div>
                </div>
            </div>
        )
    }



    // Quiz data not loaded - show fallback
    if (!quiz) {
        setQuiz(getFallbackQuiz(currentLesson))
        return null
    }

    const isCorrect = selectedAnswer === quiz.correctAnswer

    return (
        <div className="rounded-2xl border-2 border-foreground bg-card shadow-soft overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b-2 border-foreground/10 flex items-center justify-between bg-tertiary/10">
                <h3 className="text-lg font-bold flex items-center gap-2 text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>
                    <div className="h-8 w-8 rounded-lg bg-tertiary border-2 border-foreground flex items-center justify-center">
                        <Zap className="h-4 w-4 text-tertiary-foreground" strokeWidth={2.5} />
                    </div>
                    Daily Quiz
                </h3>
                <span className="text-sm font-bold bg-tertiary text-tertiary-foreground px-3 py-1.5 rounded-full border-2 border-foreground shadow-pop flex items-center gap-1">
                    <Sparkles className="h-4 w-4" strokeWidth={2.5} />
                    +50 XP
                </span>
            </div>

            {/* Content */}
            <div className="p-6 space-y-5">
                <p className="text-foreground font-semibold text-lg">{quiz.question}</p>

                <div className="relative">
                    {!hasCompletedLesson && (
                        <div className="absolute inset-0 z-10 backdrop-blur-[2px] bg-background/50 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-muted-foreground/30">
                            <div className="bg-card p-4 rounded-xl border-2 border-foreground shadow-pop text-center max-w-[80%]">
                                <div className="flex justify-center mb-2">
                                    <div className="h-10 w-10 rounded-full bg-muted border-2 border-foreground flex items-center justify-center">
                                        <Lock className="h-5 w-5 text-muted-foreground" strokeWidth={2.5} />
                                    </div>
                                </div>
                                <p className="font-bold text-foreground text-sm">Search for a stock first!</p>
                                <p className="text-xs text-muted-foreground mt-1">Unlock the options by completing a search.</p>
                            </div>
                        </div>
                    )}

                    <div className={`space-y-3 ${!hasCompletedLesson ? 'opacity-50 pointer-events-none select-none' : ''}`}>
                        {quiz.options.map((option, index) => (
                            <button
                                key={index}
                                onClick={() => handleAnswer(index)}
                                disabled={showResult || !hasCompletedLesson}
                                className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left font-medium transition-bounce
                    ${showResult
                                        ? index === quiz.correctAnswer
                                            ? "border-quaternary bg-quaternary/10 shadow-pop-mint"
                                            : selectedAnswer === index
                                                ? "border-destructive bg-destructive/10"
                                                : "border-foreground/20 text-muted-foreground"
                                        : "border-foreground/20 hover:border-foreground hover:shadow-pop hover:-translate-x-0.5 hover:-translate-y-0.5"
                                    }
                    ${(!showResult && hasCompletedLesson) && "active:translate-x-0.5 active:translate-y-0.5 active:shadow-pop-active"}
                `}
                            >
                                <span className={`h-8 w-8 rounded-full border-2 flex items-center justify-center text-sm font-bold shrink-0 transition-colors
                    ${showResult
                                        ? index === quiz.correctAnswer
                                            ? "border-quaternary bg-quaternary text-quaternary-foreground"
                                            : selectedAnswer === index
                                                ? "border-destructive bg-destructive text-destructive-foreground"
                                                : "border-foreground/30"
                                        : "border-foreground/30"
                                    }
                `}>
                                    {String.fromCharCode(65 + index)}
                                </span>
                                <span className="text-foreground">{option}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {showResult && (
                    <div className={`p-5 rounded-xl border-2 ${isCorrect ? "bg-quaternary/10 border-quaternary" : "bg-destructive/10 border-destructive"}`}>
                        <div className="flex items-center gap-2 mb-2">
                            {isCorrect ? (
                                <div className="h-8 w-8 rounded-full bg-quaternary border-2 border-foreground flex items-center justify-center">
                                    <CheckCircle2 className="h-4 w-4 text-quaternary-foreground" strokeWidth={2.5} />
                                </div>
                            ) : (
                                <div className="h-8 w-8 rounded-full bg-destructive border-2 border-foreground flex items-center justify-center">
                                    <XCircle className="h-4 w-4 text-destructive-foreground" strokeWidth={2.5} />
                                </div>
                            )}
                            <span className={`font-bold text-lg ${isCorrect ? "text-quaternary" : "text-destructive"}`} style={{ fontFamily: 'var(--font-heading)' }}>
                                {isCorrect ? "Correct!" : "Not quite!"}
                            </span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">{quiz.explanation}</p>
                    </div>
                )}
            </div>
        </div>
    )
}

// Fallback quizzes for when backend is unavailable
function getFallbackQuiz(lessonNumber: number): QuizData {
    const quizzes: Record<number, QuizData> = {
        1: {
            question: "What is a Ticker Symbol?",
            options: [
                "A secret code for brokers",
                "A short, unique ID for a stock",
                "The company's phone number",
                "The price of the stock"
            ],
            correctAnswer: 1,
            explanation: "Think of a Ticker like an Airport Code (e.g., LAX). It is a short, unique ID that ensures you arrive at the exact right destination in the market."
        },
        2: {
            question: "What is the main purpose of a Stock Exchange?",
            options: [
                "To print money",
                "To act as a specialized marketplace for stocks",
                "To set the prices of all products",
                "To lend money to startups"
            ],
            correctAnswer: 1,
            explanation: "An Exchange is like a specialized marketplace. Just as you don't buy sneakers at a grocery store, companies pick a specific 'home' like the NYSE or Nasdaq."
        },
        3: {
            question: "What happens when 'Demand' is higher than 'Supply'?",
            options: [
                "The price goes UP",
                "The price goes DOWN",
                "Nothing happens",
                "The market closes"
            ],
            correctAnswer: 0,
            explanation: "It's a Tug-of-War! When more people want to buy (Demand) than sell (Supply), the competition drives the price UP."
        }
    }

    return quizzes[lessonNumber] || quizzes[1]
}
