"use client"

import { Lightbulb, BookOpen } from "lucide-react"

interface ConceptData {
    name: string
    explanation: string
    trigger_id?: string
}

interface StepConceptProps {
    symbol: string
    stockData: any
    concept?: ConceptData | string
}

export function StepConcept({ symbol, stockData, concept }: StepConceptProps) {
    // Handle concept as either object or string
    let conceptTitle = "Understanding Stock Ownership"
    let conceptExplanation = "When you buy a stock, you own a tiny slice of the company. If the company grows and becomes more valuable, so does your slice."

    if (concept) {
        if (typeof concept === 'object' && concept.name) {
            conceptTitle = concept.name
            conceptExplanation = concept.explanation
        } else if (typeof concept === 'string') {
            conceptExplanation = concept
        }
    }

    return (
        <div className="animate-in slide-in-from-right fade-in duration-500">
            <div className="bg-card rounded-3xl p-8 border-2 border-foreground shadow-pop">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-full bg-secondary text-white flex items-center justify-center border-2 border-foreground shadow-pop">
                        <Lightbulb className="w-7 h-7" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-secondary uppercase tracking-wider">Key Concept</p>
                        <h2 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
                            {conceptTitle}
                        </h2>
                    </div>
                </div>

                <div className="bg-muted/50 rounded-2xl p-6 border border-foreground/5">
                    <p className="text-lg font-medium text-foreground/90 leading-relaxed">
                        {conceptExplanation}
                    </p>
                </div>

                <div className="mt-6 flex items-center gap-3 text-sm text-muted-foreground">
                    <BookOpen className="w-4 h-4" />
                    <span>Understanding this concept helps you read {symbol} better</span>
                </div>
            </div>
        </div>
    )
}
