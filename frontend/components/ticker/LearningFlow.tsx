"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react"
import { StepIntro } from "./steps/StepIntro"
import { StepConcept } from "./steps/StepConcept"
import { StepNews } from "./steps/StepNews"
import { StepVisual } from "./steps/StepVisual"
import { QuizSection } from "./QuizSection"
import { MarketSort } from "../games/MarketSort"
import { TickerHuntGame } from "../games/TickerHunt"
import { CapClashGame } from "../games/CapClash"
import SupplyDemandSandbox from "../games/SupplyDemandSandbox"
import { TrendSpotter } from "../games/TrendSpotter"
import TheScale from "../games/TheScale"
import ValuationStation from "../games/ValuationStation"
import IPOLaunchSimulator from "../games/IPOLaunchSimulator"
import { SectorSorter } from "../games/SectorSorter"
import { VolumeVault } from "../games/VolumeVault"
import { WiggleTamer } from "../games/WiggleTamer"

import { CompoundEngine } from "../games/CompoundEngine"
import { ProfitPunch } from "../games/ProfitPunch"
import EPSSlicer from "../games/EPSSlicer"
import YieldMagnet from "../games/YieldMagnet"

import BetaShadow from "../games/BetaShadow"
import TheEarningsReaction from "../games/TheEarningsReaction"
import ThePriceAnchor from "../games/ThePriceAnchor"
import TheLiquidityExit from "../games/TheLiquidityExit"
import TheSupplySqueeze from "../games/TheSupplySqueeze"

import { cn } from "@/lib/utils"

interface LearningFlowProps {
    symbol: string
    stockData: any
    onStepChange?: (step: number, total: number, title: string) => void
    llmContent?: any
}

export function LearningFlow({ symbol, stockData, llmContent, onStepChange }: LearningFlowProps) {
    const [currentStep, setCurrentStep] = useState(0)

    // Extract content ID for feedback (if available)
    const contentId = llmContent?.content_id || null
    const isAiGenerated = llmContent?.is_ai_generated !== false // Default to true

    // Handlers
    const handleNext = () => {
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' })
        setCurrentStep(prev => prev + 1)
    }

    const handlePrev = () => {
        if (currentStep > 0) {
            window.scrollTo({ top: 0, behavior: 'smooth' })
            setCurrentStep(prev => prev - 1)
        }
    }

    // Define steps
    let steps = [
        { id: "visual", title: "Chart Analysis", component: <StepVisual symbol={symbol} stockData={stockData} /> },
        {
            id: "concept",
            title: "Key Concept",
            component: (
                <div className="space-y-4">
                    <StepConcept symbol={symbol} stockData={stockData} concept={llmContent?.concept} />
                </div>
            )
        }
    ]

    // Inject Game if configured
    if (llmContent?.game_config) {
        const gameConfig = llmContent.game_config
        let GameComponent = null

        switch (gameConfig.type) {
            case "market_sort":
                GameComponent = <MarketSort onComplete={handleNext} config={gameConfig.market_sort_config} />
                break
            case "supply_demand_sandbox":
                GameComponent = <SupplyDemandSandbox
                    onComplete={handleNext}
                    symbol={symbol}
                    companyName={stockData.shortName || symbol}
                    initialPrice={stockData.price || 150}
                />
                break
            case "ticker_hunt":
                GameComponent = <TickerHuntGame
                    target={symbol}
                    companyName={stockData.shortName || symbol}
                    instruction={gameConfig.instruction}
                    onComplete={handleNext}
                />
                break
            case "trend_spotter":
                GameComponent = <TrendSpotter
                    onComplete={handleNext}
                    config={gameConfig}
                    instruction={gameConfig.instruction}
                />
                break
            case "market_cap_scale":
                GameComponent = <TheScale onComplete={handleNext} gameConfig={gameConfig} />
                break
            case "cap_clash":
                GameComponent = <CapClashGame
                    instruction={gameConfig.instruction}
                    onComplete={handleNext}
                />
                break
            case "valuation_station":
                GameComponent = <ValuationStation onComplete={handleNext} gameConfig={gameConfig} />
                break
            case "ipo_launch_simulator":
                GameComponent = <IPOLaunchSimulator onComplete={handleNext} gameConfig={gameConfig} symbol={symbol} stockData={stockData} />
                break
            case "sector_sorter":
                GameComponent = <SectorSorter onComplete={handleNext} config={gameConfig} />
                break
            case "volume_vault":
                GameComponent = <VolumeVault onComplete={handleNext} config={gameConfig} />
                break
            case "wiggle_tamer":
                GameComponent = <WiggleTamer onComplete={handleNext} config={gameConfig} />
                break

            case "compound_engine":
                GameComponent = <CompoundEngine onComplete={handleNext} config={gameConfig} />
                break
            case "profit_punch":
                GameComponent = <ProfitPunch
                    onComplete={handleNext}
                    totalRevenue={stockData.revenue || stockData.totalRevenue || 10000000000} // Fallback to 10B
                    netIncome={stockData.netIncome || stockData.income || 2000000000} // Fallback to 2B
                    symbol={symbol}
                    currencyCode={stockData.currencyCode || "USD"}
                    fiscalYear={stockData.fiscalYear || "TTM"}
                />
                break
            case "eps_slicer":
                GameComponent = <EPSSlicer onComplete={handleNext} gameConfig={gameConfig} />
                break
            case "yield_magnet":
                GameComponent = <YieldMagnet
                    onComplete={handleNext}
                    gameConfig={gameConfig}
                    stockData={{
                        price: stockData.price || stockData.stock_data?.current_price || 100,
                        dividendRate: stockData.stock_data?.dividend_rate || stockData.dividendRate || 2.0
                    }}
                />
                break
            case "beta_shadow":
                GameComponent = <BetaShadow
                    onComplete={handleNext}
                    gameConfig={gameConfig}
                    stockData={{
                        beta: stockData.stock_data?.beta || stockData.beta || 1.0
                    }}
                    ticker={symbol}
                />
                break
            case "earnings_reaction":
                GameComponent = <TheEarningsReaction
                    onComplete={handleNext}
                    ticker={symbol}
                />
                break
            case "price_anchor":
            case "sentiment_zone":
                GameComponent = <ThePriceAnchor
                    onComplete={handleNext}
                    ticker={symbol}
                    stockData={stockData}
                />
                break
            case "liquidity_exit":
                GameComponent = <TheLiquidityExit onComplete={handleNext} />
                break
            case "supply_squeeze":
                GameComponent = <TheSupplySqueeze
                    onComplete={handleNext}
                    ticker={symbol}
                    stockData={stockData}
                />
                break
        }

        if (GameComponent) {
            steps.push({
                id: "game",
                title: "Mini Game",
                component: GameComponent
            })
        }
    }

    // Generate Dynamic 4th Question based on Real-time Data
    const baseQuestions = llmContent?.quiz || []
    let finalQuestions = [...baseQuestions]

    // LESSON 4 SPECIFIC: Sentiment/Tide
    if (llmContent?.id === 'lesson_4_sentiment' && stockData && stockData.changePercent !== undefined) {
        const isPositive = stockData.change >= 0
        const percent = Math.abs(stockData.changePercent).toFixed(2)
        const direction = isPositive ? "up" : "down"

        finalQuestions.push({
            question: `Look at ${symbol} today: it is trading ${direction} by ${percent}%. Using the "Ocean" analogy from Lesson 4, what is the Tide doing?`,
            options: [
                "The Tide is coming IN (Bullish Optimism) 🌊",
                "The Tide is going OUT (Bearish Fear) 📉",
                "The Ocean is completely dry",
                "There is no tide today"
            ],
            correctIndex: isPositive ? 0 : 1
        })
    }

    // LESSON 5 SPECIFIC: Market Cap
    if (llmContent?.id === 'lesson_5_market_cap' && stockData) {
        // Estimate cap or use real if available. 
        // If not available, we use a generic question about price.
        // Assuming stockData has a price.
        const price = stockData.price || 100
        const fakeShares = 1000000 // 1 Million
        const calcCap = price * fakeShares

        // We'll create a question about the math
        finalQuestions.push({
            question: `If ${symbol} has 1 Million outstanding shares and the price is $${price.toFixed(2)}, what is its Market Cap?`,
            options: [
                `$${(price * 1000000).toLocaleString()}`, // Correct
                `$${(price * 1000).toLocaleString()}`,
                `$${(price * 2).toLocaleString()}`,
                "It's impossible to know"
            ],
            correctIndex: 0
        })
    }

    // Add Quiz last
    steps.push(
        { id: "quiz", title: "Challenge", component: <QuizSection symbol={symbol} companyName={stockData?.company_name || stockData?.name || symbol} questions={finalQuestions} /> }
    )

    // Prevent index out of bounds
    const safeCurrentStep = Math.min(currentStep, steps.length - 1)
    const stepsLength = steps.length
    const currentStepTitle = steps[safeCurrentStep]?.title || ""

    // Notify parent of step changes
    useEffect(() => {
        if (onStepChange) {
            onStepChange(safeCurrentStep + 1, stepsLength, currentStepTitle)
        }
    }, [safeCurrentStep, stepsLength, currentStepTitle, onStepChange])

    const progress = ((safeCurrentStep + 1) / steps.length) * 100

    return (
        <div className="max-w-3xl mx-auto pb-24 relative">
            {/* Progress Bar */}
            <div className="mb-8">
                <div className="flex justify-between text-sm font-bold text-muted-foreground mb-2 px-1">
                    <span>Step {safeCurrentStep + 1} of {steps.length}</span>
                    <span className="text-primary">{steps[safeCurrentStep].title}</span>
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
                {steps[safeCurrentStep].component}
            </div>

            {/* Navigation Controls */}
            {safeCurrentStep < steps.length - 1 && (
                <div className="fixed bottom-0 left-0 right-0 h-[92px] flex items-center px-6 bg-background/80 backdrop-blur-md border-t-2 border-foreground/10 lg:pl-72 z-40">
                    <div className="w-full max-w-3xl mx-auto flex justify-between gap-4">
                        <button
                            onClick={handlePrev}
                            disabled={safeCurrentStep === 0}
                            className={cn(
                                "flex-1 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all",
                                safeCurrentStep === 0
                                    ? "text-muted-foreground opacity-50 cursor-not-allowed shadow-none"
                                    : "bg-muted hover:bg-muted/80 text-foreground shadow-[0_4px_0_0_rgba(0,0,0,0.2)] hover:translate-y-0.5 hover:shadow-none"
                            )}
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Back
                        </button>

                        <button
                            onClick={handleNext}
                            className="flex-1 py-4 bg-primary text-primary-foreground rounded-xl font-bold shadow-pop hover:translate-y-0.5 hover:shadow-none transition-all flex items-center justify-center gap-2"
                        >
                            Next
                            <ArrowRight className="w-5 h-5" strokeWidth={3} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
