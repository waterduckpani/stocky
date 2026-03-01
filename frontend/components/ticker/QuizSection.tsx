"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Check, X, Trophy, ArrowRight, Home, Sparkles, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

interface Question {
    question: string
    options: string[]
    correctIndex: number
}

interface QuizSectionProps {
    symbol: string
    questions?: Question[]
}

export function QuizSection({ symbol, questions: providedQuestions }: QuizSectionProps) {
    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
    const [isAnswered, setIsAnswered] = useState(false)
    const [score, setScore] = useState(0)
    const [completed, setCompleted] = useState(false)
    const [showUnlockPopup, setShowUnlockPopup] = useState(false)

    const router = useRouter()

    // Use provided questions or fallback to defaults
    const questions = providedQuestions && providedQuestions.length >= 3 ? providedQuestions : [
        {
            question: "What is the primary revenue driver for this company?",
            options: ["Hardware Sales", "Services", "Advertising", "Subscription"],
            correctIndex: 0
        },
        {
            question: "Which sector does this stock belong to?",
            options: ["Healthcare", "Technology", "Energy", "Finance"],
            correctIndex: 1
        },
        {
            question: "What recent event is driving positive sentiment?",
            options: ["CEO Change", "Product Launch", "Tax Cuts", "Factory Opening"],
            correctIndex: 1
        }
    ]

    const handleAnswer = (index: number) => {
        if (isAnswered) return
        setSelectedAnswer(index)
        setIsAnswered(true)

        if (index === questions[currentQuestion].correctIndex) {
            setScore(score + 1)
        }
    }

    const nextQuestion = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1)
            setSelectedAnswer(null)
            setIsAnswered(false)
        } else {
            setCompleted(true)
        }
    }

    if (completed) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                <div className="bg-card w-full max-w-md rounded-[2rem] p-8 border-4 border-foreground shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden animate-in zoom-in-95 duration-300">

                    {/* Confetti / Decor */}

                    <div className="absolute -right-6 -top-6 w-24 h-24 bg-tertiary/20 rounded-full blur-2xl pointer-events-none" />
                    <div className="absolute -left-6 -bottom-6 w-32 h-32 bg-secondary/10 rounded-full blur-2xl pointer-events-none" />

                    <div className="text-center relative z-10">
                        <div className="w-20 h-20 bg-quaternary text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-pop border-4 border-foreground transform rotate-3">
                            <Trophy className="w-10 h-10 drop-shadow-md" strokeWidth={2.5} />
                        </div>

                        <h3 className="text-3xl font-black text-foreground mb-2 tracking-tight">Lesson Completed!</h3>

                        <div className="flex justify-center items-center gap-2 mb-6">
                            <span className="text-muted-foreground font-bold">Score:</span>
                            <span className="text-xl font-black text-foreground bg-muted px-3 py-1 rounded-lg">
                                {score}/{questions.length}
                            </span>
                        </div>

                        {/* XP Reward Placeholder */}
                        <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-4 mb-8 flex items-center justify-center gap-3">
                            <div className="bg-tertiary text-tertiary-foreground p-2 rounded-xl">
                                <Sparkles className="w-5 h-5" />
                            </div>
                            <div className="text-left">
                                <p className="text-xs font-bold text-amber-600 uppercase tracking-wider">Reward</p>
                                <p className="text-xl font-black text-amber-900 leading-none">+50 XP</p>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={() => {
                                    setCompleted(false)
                                    const todayStr = new Date().toDateString()
                                    const hasUnlockedToday = localStorage.getItem('dailyQuizUnlockedDate') === todayStr

                                    if (!hasUnlockedToday) {
                                        localStorage.setItem('dailyQuizUnlockedDate', todayStr)
                                        setShowUnlockPopup(true)
                                    } else {
                                        router.push('/#daily-quiz')
                                    }
                                }}
                                className="flex-1 py-3 bg-white border-2 border-border text-foreground hover:bg-muted/50 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                            >
                                Continue
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (showUnlockPopup) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                <div className="bg-card w-full max-w-md rounded-[2rem] p-8 border-4 border-foreground shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden animate-in zoom-in-95 duration-300">

                    <div className="absolute -right-6 -top-6 w-24 h-24 bg-quaternary/20 rounded-full blur-2xl pointer-events-none" />

                    <div className="text-center relative z-10">
                        <div className="w-20 h-20 bg-quaternary text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-pop border-4 border-foreground transform -rotate-3">
                            <Zap className="w-10 h-10 drop-shadow-md" strokeWidth={2.5} />
                        </div>

                        <h3 className="text-3xl font-black text-foreground mb-2 tracking-tight">Daily Quiz Unlocked!</h3>

                        <p className="text-muted-foreground mb-8">
                            Head back to the dashboard to test your knowledge and earn more XP.
                        </p>

                        <button
                            onClick={() => router.push('/#daily-quiz')}
                            className="w-full py-4 bg-primary text-primary-foreground border-2 border-primary hover:border-primary-foreground/20 rounded-xl text-lg font-black shadow-pop hover:translate-y-0.5 hover:shadow-none transition-all flex items-center justify-center gap-2"
                        >
                            <Home className="w-5 h-5" />
                            Return Home to Play
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    // Quiz data structure for display
    const currentQ = questions[currentQuestion]
    const isCorrect = selectedAnswer === currentQ.correctIndex

    return (
        <div className="rounded-2xl border-2 border-foreground bg-card shadow-soft overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b-2 border-foreground/10 flex items-center justify-between bg-tertiary/10">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-tertiary border-2 border-foreground flex items-center justify-center">
                        <Trophy className="h-4 w-4 text-tertiary-foreground" strokeWidth={2.5} />
                    </div>
                    <h3 className="text-lg font-bold text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>
                        Quick Challenge
                    </h3>
                </div>
                <span className="text-sm font-bold text-muted-foreground bg-white/50 px-3 py-1 rounded-full border border-foreground/10">
                    {currentQuestion + 1} / {questions.length}
                </span>
            </div>

            {/* Content */}
            <div className="p-6 space-y-5">
                <p className="text-foreground font-semibold text-lg">{currentQ.question}</p>

                <div className="space-y-3">
                    {currentQ.options.map((option, index) => (
                        <button
                            key={index}
                            onClick={() => handleAnswer(index)}
                            disabled={isAnswered}
                            className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left font-medium transition-bounce
                                ${isAnswered
                                    ? index === currentQ.correctIndex
                                        ? "border-quaternary bg-quaternary/10 shadow-pop-mint"
                                        : index === selectedAnswer
                                            ? "border-destructive bg-destructive/10"
                                            : "border-foreground/20 text-muted-foreground"
                                    : "border-foreground/20 hover:border-foreground hover:shadow-pop hover:-translate-x-0.5 hover:-translate-y-0.5"
                                }
                                ${(!isAnswered) && "active:translate-x-0.5 active:translate-y-0.5 active:shadow-pop-active"}
                            `}
                        >
                            <span className={`h-8 w-8 rounded-full border-2 flex items-center justify-center text-sm font-bold shrink-0 transition-colors
                                ${isAnswered
                                    ? index === currentQ.correctIndex
                                        ? "border-quaternary bg-quaternary text-quaternary-foreground"
                                        : index === selectedAnswer
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

                {isAnswered && (
                    <div className={`p-5 rounded-xl border-2 animate-in fade-in slide-in-from-bottom-2 ${isCorrect ? "bg-quaternary/10 border-quaternary" : "bg-destructive/10 border-destructive"}`}>
                        <div className="flex items-center gap-2 mb-2">
                            {isCorrect ? (
                                <div className="h-8 w-8 rounded-full bg-quaternary border-2 border-foreground flex items-center justify-center">
                                    <Check className="h-4 w-4 text-quaternary-foreground" strokeWidth={2.5} />
                                </div>
                            ) : (
                                <div className="h-8 w-8 rounded-full bg-destructive border-2 border-foreground flex items-center justify-center">
                                    <X className="h-4 w-4 text-destructive-foreground" strokeWidth={2.5} />
                                </div>
                            )}
                            <span className={`font-bold text-lg ${isCorrect ? "text-quaternary" : "text-destructive"}`} style={{ fontFamily: 'var(--font-heading)' }}>
                                {isCorrect ? "Correct!" : "Not quite!"}
                            </span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                            {isCorrect
                                ? "Great job! You nailed it."
                                : `The correct answer is: ${currentQ.options[currentQ.correctIndex]}`
                            }
                        </p>

                        <button
                            onClick={nextQuestion}
                            className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-bold shadow-pop hover:translate-y-0.5 hover:shadow-none transition-all flex items-center justify-center gap-2 border-2 border-primary-foreground/20"
                        >
                            {currentQuestion < questions.length - 1 ? "Next Question" : "See Results"}
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
