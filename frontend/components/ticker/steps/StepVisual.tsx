"use client"

import { InteractiveChart } from "../InteractiveChart"
import { MousePointerClick } from "lucide-react"

interface StepVisualProps {
    symbol: string
    stockData: any
}

export function StepVisual({ symbol, stockData }: StepVisualProps) {
    return (
        <div className="space-y-6 animate-in slide-in-from-right fade-in duration-500">
            <div className="bg-card rounded-3xl p-8 border-2 border-foreground shadow-pop text-center">
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full font-bold mb-4">
                    <MousePointerClick className="w-5 h-5" />
                    Interactive Proof
                </div>
                <h2 className="text-2xl font-bold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
                    See Sentiment in Action
                </h2>
                <p className="text-muted-foreground font-medium mb-6 max-w-lg mx-auto">
                    Hover over the chart below. Notice how the price trends over the last month based on market news. That's sentiment driving value.
                </p>

                {/* Simplified version of chart for the lesson */}
                <div className="bg-white rounded-2xl overflow-hidden">
                    <InteractiveChart data={stockData.chart} />
                </div>
            </div>
        </div>
    )
}
