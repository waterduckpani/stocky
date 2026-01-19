"use client"

import { useState } from "react"
import { Zap, CheckCircle2, XCircle, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

const todaysQuiz = {
  question: "What does P/E ratio measure?",
  options: [
    "Price to Earnings",
    "Profit to Equity",
    "Price to Equity",
    "Profit to Earnings"
  ],
  correctAnswer: 0,
  explanation: "P/E ratio (Price-to-Earnings) compares a company's stock price to its earnings per share, helping investors assess if a stock is overvalued or undervalued."
}

export function DailyQuiz() {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)

  const handleAnswer = (index: number) => {
    setSelectedAnswer(index)
    setShowResult(true)
  }

  const isCorrect = selectedAnswer === todaysQuiz.correctAnswer

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
        <p className="text-foreground font-semibold text-lg">{todaysQuiz.question}</p>
        
        <div className="space-y-3">
          {todaysQuiz.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(index)}
              disabled={showResult}
              className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left font-medium transition-bounce
                ${showResult
                  ? index === todaysQuiz.correctAnswer
                    ? "border-quaternary bg-quaternary/10 shadow-pop-mint"
                    : selectedAnswer === index
                    ? "border-destructive bg-destructive/10"
                    : "border-foreground/20 text-muted-foreground"
                  : "border-foreground/20 hover:border-foreground hover:shadow-pop hover:-translate-x-0.5 hover:-translate-y-0.5"
                }
                ${!showResult && "active:translate-x-0.5 active:translate-y-0.5 active:shadow-pop-active"}
              `}
            >
              <span className={`h-8 w-8 rounded-full border-2 flex items-center justify-center text-sm font-bold shrink-0 transition-colors
                ${showResult
                  ? index === todaysQuiz.correctAnswer
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
            <p className="text-sm text-muted-foreground leading-relaxed">{todaysQuiz.explanation}</p>
          </div>
        )}
      </div>
    </div>
  )
}
