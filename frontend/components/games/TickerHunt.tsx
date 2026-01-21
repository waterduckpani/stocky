"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import confetti from "canvas-confetti"
import { Search, CheckCircle2, AlertCircle, ArrowRight, HelpCircle } from "lucide-react"

interface TickerHuntProps {
    target: string // e.g. "NFLX"
    instruction: string
    companyName: string
    onComplete: () => void
}

export function TickerHuntGame({ target, instruction, companyName, onComplete }: TickerHuntProps) {
    const [query, setQuery] = useState("")
    const [result, setResult] = useState<{ symbol: string, name: string } | null>(null)
    const [status, setStatus] = useState<"idle" | "success" | "hint" | "unknown">("idle")
    const [attempts, setAttempts] = useState(0)

    const [isLoading, setIsLoading] = useState(false)

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault()
        const term = query.toLowerCase().trim()

        if (!term) return

        setAttempts(prev => prev + 1)
        setIsLoading(true)

        try {
            // Call Search API to find ANY matching stock (Sandbox Mode)
            const res = await fetch(`http://localhost:8000/api/search?q=${encodeURIComponent(term)}`)
            const data = await res.json()
            const foundStock = data.results && data.results.length > 0 ? data.results[0] : null

            if (foundStock) {
                const foundSymbol = foundStock.symbol
                const foundName = foundStock.name
                setResult({ symbol: foundSymbol, name: foundName })
                setStatus("success") // Always success in Sandbox

                // Trigger confetti on every success
                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 },
                    colors: ['#22c55e', '#3b82f6', '#f59e0b']
                })
            } else {
                setResult(null)
                setStatus("unknown")
            }
        } catch (error) {
            console.error("Search failed", error)
            setStatus("unknown")
        } finally {
            setIsLoading(false)
        }
    }

    // Always allow proceed in Sandbox mode
    const canProceed = true

    return (
        <div className="w-full max-w-xl mx-auto animate-pop-in">
            {/* The 'Sticker' Card Container */}
            <div className="bg-card rounded-3xl border-2 border-foreground shadow-pop overflow-hidden">
                {/* Header with decorative bg */}
                <div className="bg-primary/5 p-6 border-b-2 border-foreground text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Search className="w-24 h-24 text-primary rotate-12" />
                    </div>
                    <div className="relative z-10">
                        <div className="inline-flex items-center justify-center p-3 bg-white rounded-2xl border-2 border-foreground shadow-sm mb-4">
                            <Search className="w-6 h-6 text-primary" strokeWidth={3} />
                        </div>
                        <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                            Ticker Sandbox
                        </h2>
                        <p className="text-muted-foreground font-medium text-lg">
                            Sandbox Mode: Search ANY company to see its ticker!
                        </p>
                    </div>
                </div>

                <div className="p-8 space-y-8">
                    {/* Input Area */}
                    <form onSubmit={handleSearch} className="flex gap-3">
                        <div className="relative flex-1">
                            <Input
                                placeholder="Search any company (e.g. Apple)..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                disabled={isLoading}
                                className="text-lg py-6 pl-4 border-2 border-border rounded-xl shadow-sm focus:border-accent focus:shadow-pop-violet transition-all duration-300"
                            />
                        </div>
                        <Button
                            type="submit"
                            size="lg"
                            disabled={isLoading}
                            className="bg-primary hover:bg-primary/90 text-white rounded-xl shadow-pop hover:translate-y-0.5 hover:shadow-none transition-all h-auto px-6 border-0"
                        >
                            {isLoading ? (
                                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <Search className="w-6 h-6" strokeWidth={3} />
                            )}
                        </Button>
                    </form>

                    {/* Result Area - Dynamic Feedback */}
                    <div className="bg-muted/30 rounded-2xl p-8 min-h-[180px] flex items-center justify-center border-2 border-dashed border-foreground/10 relative">
                        {/* Decorative background shapes */}
                        <div className="absolute top-4 left-4 w-2 h-2 rounded-full bg-secondary/30" />
                        <div className="absolute bottom-4 right-4 w-3 h-3 rounded-full bg-tertiary/30" />

                        {status === "idle" && (
                            <div className="text-center text-muted-foreground">
                                <Search className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                <p className="font-medium">Enter any name to reveal its ticker.</p>
                            </div>
                        )}

                        {status === "unknown" && (
                            <div className="text-center animate-pop-in">
                                <div className="bg-white p-3 rounded-full border-2 border-foreground/10 inline-block mb-3 shadow-sm">
                                    <HelpCircle className="w-8 h-8 text-muted-foreground" />
                                </div>
                                <h3 className="font-bold text-lg mb-1">Company Not Found</h3>
                                <p className="text-muted-foreground text-sm">
                                    Try searching for a major company like <strong>Apple</strong>.
                                </p>
                            </div>
                        )}

                        {status === "success" && result && (
                            <div className="text-center w-full animate-pop-in">
                                <div className="inline-block bg-white px-8 py-6 rounded-2xl border-2 border-foreground shadow-soft mb-4 transform rotate-1 transition-transform hover:rotate-2">
                                    <div className="text-5xl font-extrabold text-foreground mb-1 tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
                                        {result.symbol}
                                    </div>
                                    <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest bg-muted px-2 py-1 rounded-md inline-block">
                                        {result.name}
                                    </div>
                                </div>

                                <div className="flex items-center justify-center gap-2 text-primary font-bold animate-fadeIn">
                                    <CheckCircle2 className="w-5 h-5" />
                                    <span>Found! Search again or proceed.</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Progression Control */}
                    {canProceed && (
                        <div className="animate-pop-in pt-2">
                            <Button
                                onClick={onComplete}
                                className="w-full py-6 bg-quaternary hover:bg-quaternary/90 text-white rounded-full font-bold text-xl shadow-pop hover:translate-y-0.5 hover:shadow-none transition-all group border-0 ring-0 outline-none"
                            >
                                Continue to Quiz
                                <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-1 transition-transform" strokeWidth={3} />
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {/* Attempt Counter */}
            <div className="text-center mt-6">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white rounded-full border-2 border-foreground/10 shadow-sm text-sm font-bold text-muted-foreground">
                    <span>Searches: {attempts}</span>
                </div>
            </div>
        </div>
    )
}
