"use client"

import { useState } from "react"
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react"
import { StepIntro } from "./steps/StepIntro"
import { StepConcept } from "./steps/StepConcept"
import { StepNews } from "./steps/StepNews"
import { StepVisual } from "./steps/StepVisual"
import { QuizSection } from "./QuizSection"
import { cn } from "@/lib/utils"

interface LearningFlowProps {
    symbol: string
    stockData: any
    llmContent?: any
}

export function LearningFlow({ symbol, stockData, llmContent }: LearningFlowProps) {
    const [currentStep, setCurrentStep] = useState(0)

    // 5-step learning flow
    const steps = [
        { id: "intro", title: "The Breakdown", component: <StepIntro symbol={symbol} stockData={stockData} breakdown={llmContent?.breakdown} /> },
        { id: "concept", title: "Key Concept", component: <StepConcept symbol={symbol} stockData={stockData} concept={llmContent?.concept} /> },
        { id: "news", title: "News & Sentiment", component: <StepNews symbol={symbol} stockData={stockData} news={llmContent?.news} /> },
        { id: "visual", title: "Chart Analysis", component: <StepVisual symbol={symbol} stockData={stockData} /> },
        { id: "quiz", title: "Challenge", component: <QuizSection symbol={symbol} questions={llmContent?.quiz} /> },
    ]

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(prev => prev + 1)
            window.scrollTo({ top: 0, behavior: 'smooth' })
        }
    }

    const handlePrev = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1)
            window.scrollTo({ top: 0, behavior: 'smooth' })
        }
    }

    const progress = ((currentStep + 1) / steps.length) * 100

    return (
        <div className="max-w-3xl mx-auto pb-24">
            {/* Progress Bar */}
            <div className="mb-8">
                <div className="flex justify-between text-sm font-bold text-muted-foreground mb-2 px-1">
                    <span>Step {currentStep + 1} of {steps.length}</span>
                    <span className="text-primary">{steps[currentStep].title}</span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <div
                        className="h-full bg-primary transition-all duration-500 ease-out rounded-full"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/* Step Content */}
            <div className="min-h-[400px]">
                {steps[currentStep].component}
            </div>

            {/* Navigation Controls */}
            {currentStep < steps.length - 1 && (
                <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-md border-t-2 border-foreground/10 lg:pl-72 z-40">
                    <div className="max-w-3xl mx-auto flex justify-between gap-4">
                        <button
                            onClick={handlePrev}
                            disabled={currentStep === 0}
                            className={cn(
                                "flex-1 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all",
                                currentStep === 0
                                    ? "text-muted-foreground opacity-50 cursor-not-allowed"
                                    : "bg-muted hover:bg-muted/80 text-foreground"
                            )}
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Back
                        </button>

                        <button
                            onClick={handleNext}
                            className="flex-[2] py-4 bg-primary text-primary-foreground rounded-xl font-bold shadow-pop hover:shadow-none hover:translate-y-0.5 transition-all flex items-center justify-center gap-2"
                        >
                            Continue
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
