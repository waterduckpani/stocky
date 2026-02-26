"use client"

import { use, useState, useEffect, useRef, useCallback } from "react"
import { Sidebar } from "@/components/dashboard/Sidebar"
import { LearningFlow } from "@/components/ticker/LearningFlow"
import { ArrowLeft, Share2, Star } from "lucide-react"
import Link from "next/link"
import { formatPrice } from "@/utils/formatters"

interface PageProps {
    params: Promise<{ symbol: string }>
}

export default function TickerPage({ params }: PageProps) {
    const { symbol } = use(params)
    const decodedSymbol = decodeURIComponent(symbol).toUpperCase()

    // State
    const [data, setData] = useState<any>(null)
    const [llmContent, setLlmContent] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    // State for learning flow progress
    const [stepInfo, setStepInfo] = useState({ current: 0, total: 0, title: "" })

    // Ref to prevent double-firing in React Strict Mode
    const hasFetched = useRef<string | null>(null)

    // Stable handler for step changes (must be before early returns)
    const handleStepChange = useCallback((current: number, total: number, title: string) => {
        setStepInfo(prev => {
            if (prev.current === current && prev.total === total && prev.title === title) return prev
            return { current, total, title }
        })
    }, [])

    // Fetch data
    useEffect(() => {
        // Skip if already fetched for this symbol
        if (hasFetched.current === decodedSymbol) return

        const fetchData = async () => {
            // Lock immediately to prevent double calls
            hasFetched.current = decodedSymbol

            try {
                setLoading(true)

                // Fetch stock data and LLM content in parallel
                const [tickerRes, llmRes] = await Promise.all([
                    fetch(`http://localhost:8000/api/ticker/${decodedSymbol}`),
                    fetch(`http://localhost:8000/api/generate/${decodedSymbol}`)
                ])

                if (!tickerRes.ok) throw new Error("Failed to fetch stock data")
                const tickerJson = await tickerRes.json()
                setData(tickerJson)

                // LLM content is optional - use fallback if fails
                if (llmRes.ok) {
                    const llmJson = await llmRes.json()
                    setLlmContent(llmJson)
                }
            } catch (err) {
                console.error(err)
                setError("Could not load stock data. Please make sure the backend is running.")
                // Reset lock on error so user can retry
                hasFetched.current = null
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [decodedSymbol])

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    <p className="text-muted-foreground font-medium animate-pulse">Loading {decodedSymbol}...</p>
                </div>
            </div>
        )
    }

    if (error || !data) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center space-y-4">
                    <h2 className="text-2xl font-bold text-destructive">Error Loading Data</h2>
                    <p className="text-muted-foreground">{error}</p>
                    <Link href="/" className="inline-block px-6 py-2 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-primary/90 transition-colors">
                        Return Home
                    </Link>
                </div>
            </div>
        )
    }

    // Transform backend data for frontend components
    const stockHeroData = {
        name: data.name,
        price: data.price,
        change: `${data.change >= 0 ? "+" : ""}${data.change} (${data.changePercent}%)`,
        isPositive: data.change >= 0
    }



    return (
        <div className="min-h-screen bg-background relative overflow-hidden font-sans text-foreground">
            {/* Background Decorations */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-tertiary/20 blur-3xl" />
                <div className="absolute top-1/3 right-20 w-48 h-48 rounded-full bg-primary/10 blur-3xl" />
            </div>

            <Sidebar />

            <main className="lg:pl-72 min-h-screen pb-32">
                {/* Header: Sticky & Aligned with Sidebar */}
                <header className="sticky top-0 z-40 h-[92px] bg-background/95 backdrop-blur-sm border-b-2 border-foreground/10 flex items-center justify-between px-8 transition-all">
                    <div className="flex items-center gap-4 w-1/3">
                        <Link href="/" className="p-2 rounded-xl border-2 border-transparent hover:border-foreground/20 hover:bg-muted transition-colors">
                            <ArrowLeft className="w-6 h-6" strokeWidth={2.5} />
                        </Link>
                    </div>

                    {/* Centered Lesson Info */}
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center text-center w-full max-w-md">
                        <h2 className="text-xl md:text-2xl font-black text-foreground tracking-tight whitespace-nowrap overflow-hidden text-ellipsis w-full px-4" style={{ fontFamily: 'var(--font-heading)' }}>
                            {llmContent?.concept?.lesson_label ? `${llmContent.concept.lesson_label}: ` : ''}
                            {llmContent?.concept?.name || "Loading..."}
                        </h2>
                        <span className="text-[10px] font-extrabold text-muted-foreground/60 uppercase tracking-widest mt-0.5">
                            {stepInfo.title}
                        </span>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center justify-end gap-3 w-1/3">
                        <button className="p-2 rounded-xl bg-card border-2 border-foreground/10 hover:border-foreground/30 hover:bg-muted transition-colors shadow-sm">
                            <Share2 className="w-5 h-5" />
                        </button>
                        <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-card rounded-xl border-2 border-foreground/10 font-bold shadow-sm">
                            <div className={`w-2 h-2 rounded-full ${stockHeroData.isPositive ? 'bg-quaternary' : 'bg-destructive'} animate-pulse`} />
                            <span>Market Open</span>
                        </div>
                    </div>
                </header>

                <div className="p-8 max-w-5xl mx-auto space-y-8">

                    {/* Stock Hero - Restored */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 animate-in slide-in-from-bottom-4">
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h1 className="text-4xl md:text-5xl font-black tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                                    {decodedSymbol}
                                </h1>
                                <button className="p-2 rounded-full hover:bg-muted transition-colors">
                                    <Star className="w-6 h-6 text-muted-foreground hover:text-tertiary hover:fill-tertiary transition-all" />
                                </button>
                            </div>
                            <p className="text-xl text-muted-foreground font-medium">{stockHeroData.name}</p>
                        </div>
                        <div className="text-left md:text-right">
                            <div className="text-3xl md:text-4xl font-black text-foreground">
                                {formatPrice(stockHeroData.price, data.currencyConfig)}
                            </div>
                            <div className={`inline-flex items-center gap-1 ${stockHeroData.isPositive ? 'bg-quaternary/10 text-quaternary' : 'bg-destructive/10 text-destructive'} px-3 py-1 rounded-lg font-bold text-sm mt-1`}>
                                {stockHeroData.change} Today
                            </div>
                        </div>
                    </div>

                    {/* The Learning Wizard */}
                    <LearningFlow
                        symbol={decodedSymbol}
                        stockData={data}
                        llmContent={llmContent}
                        onStepChange={handleStepChange}
                    />

                </div>
            </main>
        </div>
    )
}
