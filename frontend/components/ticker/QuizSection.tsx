"use client"

import { useState } from "react"
import { Check, X, Trophy, ArrowRight } from "lucide-react"
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
            <div className="bg-quaternary/10 rounded-3xl p-8 border-2 border-quaternary text-center">
                <div className="w-16 h-16 bg-quaternary text-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-pop">
                    <Trophy className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">Challenge Complete!</h3>
                <p className="text-muted-foreground font-medium mb-6">You scored {score}/{questions.length} on the {symbol} knowledge check.</p>
                <button
                    onClick={() => window.location.reload()}
                    className="bg-foreground text-background px-6 py-3 rounded-xl font-bold hover:bg-foreground/90 transition-colors"
                >
                    Back to Dashboard
                </button>
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
