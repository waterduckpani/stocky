"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Check, X, Trophy, ArrowRight, Home, Sparkles } from "lucide-react"
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
                                onClick={() => router.push('/')}
                                className="flex-1 py-3 bg-white border-2 border-border text-foreground hover:bg-muted/50 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                            >
                                <Home className="w-4 h-4" />
                                Return Home
                            </button>
                            <button
                                onClick={() => router.push('/explore')} // Placeholder next action
                                className="flex-1 py-3 bg-primary text-primary-foreground border-2 border-primary hover:border-primary-foreground/20 rounded-xl font-bold shadow-pop hover:translate-y-0.5 hover:shadow-none transition-all flex items-center justify-center gap-2"
                            >
                                Next Lesson
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const question = questions[currentQuestion]

    return (
        <div className="bg-card rounded-3xl p-8 border-2 border-foreground shadow-pop">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center font-bold">
                        ?
                    </div>
                    <h3 className="text-xl font-bold text-foreground">Quick Challenge</h3>
                </div>
                <span className="text-sm font-bold text-muted-foreground bg-muted px-3 py-1 rounded-full">
                    {currentQuestion + 1} / {questions.length}
                </span>
            </div>

            <h4 className="text-lg font-bold mb-6">{question.question}</h4>

            <div className="space-y-3">
                {question.options.map((option, idx) => (
                    <button
                        key={idx}
                        onClick={() => handleAnswer(idx)}
                        disabled={isAnswered}
                        className={cn(
                            "w-full p-4 rounded-xl border-2 text-left font-semibold transition-all flex justify-between items-center",
                            isAnswered
                                ? idx === question.correctIndex
                                    ? "bg-quaternary text-white border-quaternary shadow-none"
                                    : idx === selectedAnswer
                                        ? "bg-destructive text-white border-destructive shadow-none"
                                        : "bg-muted text-muted-foreground border-transparent opacity-50"
                                : "bg-muted hover:bg-muted/80 border-transparent hover:border-foreground/20 text-foreground"
                        )}
                    >
                        {option}
                        {isAnswered && idx === question.correctIndex && <Check className="w-5 h-5" />}
                        {isAnswered && idx === selectedAnswer && idx !== question.correctIndex && <X className="w-5 h-5" />}
                    </button>
                ))}
            </div>

            {isAnswered && (
                <div className="mt-6 pt-6 border-t-2 border-border animate-in fade-in slide-in-from-bottom-2">
                    <p className="text-sm font-medium text-muted-foreground mb-4">
                        <span className="font-bold text-foreground">
                            {selectedAnswer === question.correctIndex ? "✓ Correct!" : "✗ Not quite."}
                        </span> The correct answer is: {(() => {
                            // Safety check for correctIndex
                            let idx = question.correctIndex;
                            // Handle 1-based index from backend (1-4 instead of 0-3)
                            if (idx >= 1 && idx <= 4 && !question.options[idx]) {
                                idx = idx - 1;
                            }
                            // Ensure index is valid (0-3)
                            if (idx < 0 || idx > 3 || !question.options[idx]) {
                                return `Option ${(question.correctIndex || 0) + 1}`;
                            }
                            return question.options[idx];
                        })()}
                    </p>
                    <button
                        onClick={nextQuestion}
                        className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-bold shadow-pop hover:translate-y-0.5 hover:shadow-none transition-all flex items-center justify-center gap-2"
                    >
                        {currentQuestion < questions.length - 1 ? "Next Question" : "See Results"}
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    )
}
