"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/utils/supabase/client"
import { Bell, LogOut, TrendingUp, TrendingDown, Activity, Layers, BarChart3, Heart, ArrowUp, ArrowDown, Newspaper, ExternalLink, Clock, Building2, PieChart, ChevronLeft, Compass } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sidebar } from "@/components/dashboard/Sidebar"
import { MobileNav } from "@/components/dashboard/MobileNav"
import { StockSearch } from "@/components/dashboard/StockSearch"
import { InteractiveChart } from "@/components/ticker/InteractiveChart"
import { formatPrice, formatLargeCurrency } from "@/utils/formatters"
import { useAuth } from "@/contexts/AuthContext"
import { motion, AnimatePresence } from "framer-motion"

// ─── Floating background decorations ─────────────────────────────────────────

const FLOAT_ITEMS = [
    { icon: TrendingUp,   label: "Bullish",     textColor: "text-quaternary",  bg: "bg-quaternary/15",   border: "border-quaternary/25",  left: "3%",  top: "15%", delay: 0,   dur: 7  },
    { icon: TrendingDown, label: "Bearish",     textColor: "text-destructive", bg: "bg-destructive/10",  border: "border-destructive/20", left: "87%", top: "20%", delay: 1.2, dur: 9  },
    { icon: Activity,     label: "RSI 68",      textColor: "text-secondary",   bg: "bg-secondary/10",    border: "border-secondary/20",   left: "6%",  top: "54%", delay: 2,   dur: 8  },
    { icon: BarChart3,    label: "Volume",      textColor: "text-primary",     bg: "bg-primary/10",      border: "border-primary/20",     left: "85%", top: "50%", delay: 0.6, dur: 10 },
    { icon: ArrowUp,      label: "MACD Bull",   textColor: "text-quaternary",  bg: "bg-quaternary/15",   border: "border-quaternary/25",  left: "12%", top: "78%", delay: 3,   dur: 7  },
    { icon: ArrowDown,    label: "MACD Bear",   textColor: "text-destructive", bg: "bg-destructive/10",  border: "border-destructive/20", left: "83%", top: "73%", delay: 1.8, dur: 9  },
    { icon: Layers,       label: "MA (50)",     textColor: "text-tertiary",    bg: "bg-tertiary/10",     border: "border-tertiary/20",    left: "2%",  top: "86%", delay: 2.5, dur: 8  },
    { icon: TrendingUp,   label: "Strong Buy",  textColor: "text-primary",     bg: "bg-primary/10",      border: "border-primary/20",     left: "19%", top: "8%",  delay: 0.8, dur: 11 },
    { icon: Heart,        label: "Sentiment",   textColor: "text-secondary",   bg: "bg-secondary/10",    border: "border-secondary/20",   left: "73%", top: "10%", delay: 4,   dur: 8  },
    { icon: Activity,     label: "Neutral",     textColor: "text-tertiary",    bg: "bg-tertiary/10",     border: "border-tertiary/20",    left: "90%", top: "84%", delay: 3.5, dur: 9  },
    { icon: TrendingDown, label: "Oversold",    textColor: "text-destructive", bg: "bg-destructive/10",  border: "border-destructive/20", left: "38%", top: "5%",  delay: 1.5, dur: 7  },
    { icon: BarChart3,    label: "Overbought",  textColor: "text-primary",     bg: "bg-primary/10",      border: "border-primary/20",     left: "55%", top: "89%", delay: 2.2, dur: 10 },
]

function FloatingItems() {
    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
            {FLOAT_ITEMS.map((item, i) => (
                <motion.div
                    key={i}
                    className={`absolute flex items-center gap-1.5 px-3 py-2 rounded-full border ${item.bg} ${item.border} backdrop-blur-sm`}
                    style={{ left: item.left, top: item.top }}
                    animate={{ y: [0, -14, 6, 0], opacity: [0.18, 0.32, 0.22, 0.18] }}
                    transition={{ duration: item.dur, delay: item.delay, repeat: Infinity, ease: "easeInOut" }}
                >
                    <item.icon className={`w-3.5 h-3.5 ${item.textColor}`} strokeWidth={2.5} />
                    <span className={`text-xs font-bold ${item.textColor}`}>{item.label}</span>
                </motion.div>
            ))}
        </div>
    )
}


// ─── Technical indicator card ─────────────────────────────────────────────────

function TechCard({
    title, value, label, icon: Icon, iconColor, labelClass, tooltip,
}: {
    title: string
    value: React.ReactNode
    label: React.ReactNode
    icon: React.ElementType
    iconColor: string
    labelClass: string
    tooltip: string
}) {
    return (
        <div className="relative group bg-card p-3 rounded-2xl border-2 border-foreground/10 shadow-sm hover:border-foreground/30 hover:shadow-[0_4px_0_0_rgba(0,0,0,0.1)] transition-all duration-200 cursor-default">
            <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">{title}</span>
                <Icon className={`w-3.5 h-3.5 transition-colors ${iconColor}`} />
            </div>
            <div className="text-xl font-black text-foreground mb-1.5" style={{ fontFamily: "var(--font-heading)" }}>
                {value}
            </div>
            <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full w-fit border ${labelClass}`}>
                {label}
            </div>
            {/* Hover tooltip */}
            <div className="absolute bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2 w-60 p-3 bg-foreground text-background text-xs rounded-xl shadow-pop opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[200] pointer-events-none">
                <p className="font-bold text-sm mb-1">{title}</p>
                <p className="leading-relaxed">{tooltip}</p>
                <span className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-foreground" />
            </div>
        </div>
    )
}

function StatRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex justify-between items-center py-2.5 border-b border-foreground/5 last:border-0">
            <span className="text-sm text-muted-foreground font-medium">{label}</span>
            <span className="text-sm font-bold text-foreground">{value}</span>
        </div>
    )
}

// ─── Exploration content ──────────────────────────────────────────────────────

function ExploreContent({
    symbol, stockData, ma20, onReset,
}: {
    symbol: string
    stockData: any
    ma20: { value: number; trend: string } | null
    onReset: () => void
}) {
    const tech = stockData.technicals || {}
    const isPositive = stockData.change >= 0
    const currencyConfig = stockData.currencyConfig
    const currSymbol = currencyConfig?.symbol || "$"

    const rsiTooltip = `RSI measures momentum on a 0–100 scale. ${symbol}'s RSI of ${tech.rsi?.value ?? "--"} suggests ${tech.rsi?.label === "Overbought" ? "the stock has rallied sharply and may be due for a pullback." : tech.rsi?.label === "Oversold" ? "the stock has fallen hard and may be due for a bounce." : "balanced buying and selling pressure — no extreme conditions."}`
    const macdTooltip = `MACD tracks short-term vs long-term momentum. ${symbol}'s ${tech.macd?.signal || "Neutral"} signal means the 12-day average is ${tech.macd?.signal === "Bullish" ? "rising faster than the 26-day average — a potential buy signal." : tech.macd?.signal === "Bearish" ? "falling behind the 26-day average — momentum may be weakening." : "roughly in line with the 26-day average."}`
    const ma50Tooltip = `The 50-day Moving Average is the average closing price over the last 50 trading days. ${symbol} is trading ${tech.ma50?.trend === "Above" ? "above its MA50 — typically a bullish sign of sustained strength." : "below its MA50 — can signal a downtrend or consolidation."}`
    const ma20Tooltip = ma20 ? `The 20-day Moving Average reflects near-term price trends. ${symbol} is ${ma20.trend === "Above" ? "above its MA20, showing short-term strength." : "below its MA20, showing recent weakness."} MA20 reacts faster to price changes than MA50.` : ""
    const volumeTooltip = `Volume is the number of shares traded today. ${symbol}'s volume is ${tech.volume?.relative || "1.0x Avg"} — ${parseFloat(tech.volume?.relative || "1") > 1.5 ? "notably higher than usual, suggesting strong conviction or a major catalyst." : parseFloat(tech.volume?.relative || "1") < 0.7 ? "lower than usual — low conviction or a quiet session." : "close to the 20-day average, indicating normal activity."}`
    const sentimentTooltip = `Sentiment for ${symbol} combines analyst ratings and price momentum. A score of ${tech.sentiment?.score ?? 50}/100 reflects ${tech.sentiment?.label === "Bullish" ? "positive analyst consensus and recent price strength." : tech.sentiment?.label === "Bearish" ? "cautious views or recent price weakness." : "a neutral mix — no strong directional conviction."}`

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            {/* Hero */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
            >
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <h1 className="text-4xl font-black text-foreground tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
                            {symbol}
                        </h1>
                        <button
                            onClick={onReset}
                            className="flex items-center gap-1 text-xs font-bold text-muted-foreground hover:text-foreground border-2 border-foreground/20 hover:border-foreground/50 px-3 py-1.5 rounded-xl transition-all"
                        >
                            <ChevronLeft className="w-3 h-3" strokeWidth={3} />
                            Change
                        </button>
                    </div>
                    <p className="text-xl text-muted-foreground font-medium">{stockData.name}</p>
                    <span className="inline-block mt-1 text-xs font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-md">
                        {stockData.sector}
                    </span>
                </div>
                <div className="text-left sm:text-right">
                    <div className="text-4xl font-black text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
                        {formatPrice(stockData.price, currencyConfig)}
                    </div>
                    <div className={`inline-flex items-center gap-1.5 mt-1.5 px-3 py-1.5 rounded-xl font-bold text-sm border-2 ${isPositive ? "bg-quaternary/10 text-quaternary border-quaternary/30" : "bg-destructive/10 text-destructive border-destructive/30"}`}>
                        {isPositive ? <TrendingUp className="w-4 h-4" strokeWidth={2.5} /> : <TrendingDown className="w-4 h-4" strokeWidth={2.5} />}
                        {isPositive ? "+" : ""}{stockData.change} ({stockData.changePercent}%) Today
                    </div>
                </div>
            </motion.div>

            {/* Main grid */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Left: Chart + Technicals */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Chart */}
                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.05 }} className="bg-card rounded-3xl border-2 border-foreground shadow-pop overflow-hidden">
                        <div className="p-4 border-b-2 border-foreground bg-muted/30 flex items-center gap-3">
                            <div className="bg-primary/10 p-2 rounded-xl border-2 border-primary/20">
                                <Activity className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold leading-none mb-0.5" style={{ fontFamily: "var(--font-heading)" }}>Price Chart</h2>
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Interactive · {symbol}</p>
                            </div>
                        </div>
                        <div className="bg-card h-[300px] p-2">
                            <InteractiveChart data={stockData.chart} />
                        </div>
                    </motion.div>

                    {/* Technical Indicators */}
                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.1 }} className="bg-card rounded-3xl border-2 border-foreground shadow-pop">
                        <div className="p-4 border-b-2 border-foreground bg-muted/30 flex items-center gap-3 rounded-t-3xl">
                            <div className="bg-secondary/10 p-2 rounded-xl border-2 border-secondary/20">
                                <BarChart3 className="w-5 h-5 text-secondary" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold leading-none mb-0.5" style={{ fontFamily: "var(--font-heading)" }}>Technical Indicators</h2>
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">Hover any card for context</p>
                            </div>
                        </div>
                        <div className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-3 overflow-visible">
                            <TechCard title="RSI (14)" value={tech.rsi?.value ?? "--"} label={tech.rsi?.label || "Neutral"} icon={Layers} iconColor="text-accent/50 group-hover:text-accent" labelClass={tech.rsi?.label === "Overbought" ? "bg-secondary/10 border-secondary/30 text-foreground" : tech.rsi?.label === "Oversold" ? "bg-quaternary/10 border-quaternary/30 text-foreground" : "bg-muted border-foreground/10 text-foreground"} tooltip={rsiTooltip} />
                            <TechCard title="MACD" value={tech.macd?.value ?? "--"} label={<span className="flex items-center gap-1">{tech.macd?.signal === "Bullish" ? <ArrowUp className="w-3 h-3 text-quaternary" strokeWidth={3} /> : tech.macd?.signal === "Bearish" ? <ArrowDown className="w-3 h-3 text-secondary" strokeWidth={3} /> : <Activity className="w-3 h-3 text-muted-foreground" />}{tech.macd?.signal || "Neutral"}</span>} icon={TrendingUp} iconColor="text-secondary/50 group-hover:text-secondary" labelClass="bg-muted border-foreground/10 text-foreground" tooltip={macdTooltip} />
                            <TechCard title="MA (50)" value={tech.ma50?.value !== undefined ? formatPrice(tech.ma50.value, currencyConfig) : "--"} label={tech.ma50?.trend === "Above" ? "Price > MA50" : "Price < MA50"} icon={Activity} iconColor="text-tertiary/50 group-hover:text-tertiary" labelClass={tech.ma50?.trend === "Above" ? "bg-quaternary/10 border-quaternary/30 text-foreground" : "bg-secondary/10 border-secondary/30 text-foreground"} tooltip={ma50Tooltip} />
                            {ma20 && <TechCard title="MA (20)" value={formatPrice(ma20.value, currencyConfig)} label={ma20.trend === "Above" ? "Price > MA20" : "Price < MA20"} icon={Activity} iconColor="text-primary/50 group-hover:text-primary" labelClass={ma20.trend === "Above" ? "bg-quaternary/10 border-quaternary/30 text-foreground" : "bg-secondary/10 border-secondary/30 text-foreground"} tooltip={ma20Tooltip} />}
                            <TechCard title="Volume" value={tech.volume?.value ?? "--"} label={tech.volume?.relative || "1.0x Avg"} icon={BarChart3} iconColor="text-quaternary/50 group-hover:text-quaternary" labelClass="bg-muted border-foreground/10 text-foreground" tooltip={volumeTooltip} />
                            <TechCard title="Sentiment" value={tech.sentiment?.label || "Neutral"} label={`Score: ${tech.sentiment?.score ?? 50}/100`} icon={Heart} iconColor={tech.sentiment?.label === "Bullish" ? "text-quaternary fill-quaternary" : "text-muted-foreground group-hover:text-quaternary"} labelClass={tech.sentiment?.label === "Bullish" ? "bg-quaternary/10 border-quaternary/30 text-foreground" : tech.sentiment?.label === "Bearish" ? "bg-secondary/10 border-secondary/30 text-foreground" : "bg-muted border-foreground/10 text-foreground"} tooltip={sentimentTooltip} />
                        </div>
                    </motion.div>
                </div>

                {/* Right: Stats + News + About */}
                <div className="space-y-6">
                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.15 }} className="bg-card rounded-3xl border-2 border-foreground shadow-pop overflow-hidden">
                        <div className="p-4 border-b-2 border-foreground bg-muted/30 flex items-center gap-3">
                            <div className="bg-tertiary/10 p-2 rounded-xl border-2 border-tertiary/30">
                                <PieChart className="w-5 h-5 text-tertiary" />
                            </div>
                            <h2 className="text-lg font-bold" style={{ fontFamily: "var(--font-heading)" }}>Key Stats</h2>
                        </div>
                        <div className="px-4 pb-2">
                            <StatRow label="Market Cap" value={stockData.marketCap || "N/A"} />
                            <StatRow label="P/E Ratio" value={stockData.peRatio !== undefined ? String(stockData.peRatio) : "N/A"} />
                            <StatRow label="EPS" value={stockData.eps != null ? `${currSymbol}${stockData.eps}` : "N/A"} />
                            <StatRow label="Revenue" value={stockData.revenue ? formatLargeCurrency(stockData.revenue, currencyConfig) : "N/A"} />
                            <StatRow label="Net Income" value={stockData.netIncome ? formatLargeCurrency(stockData.netIncome, currencyConfig) : "N/A"} />
                            <StatRow label="Div. Yield" value={stockData.dividendYield != null && stockData.dividendYield > 0 ? `${stockData.dividendYield}%` : "None"} />
                            <StatRow label="Sector" value={stockData.sector || "N/A"} />
                        </div>
                    </motion.div>

                    {stockData.news && stockData.news.length > 0 && (
                        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.2 }} className="bg-card rounded-3xl border-2 border-foreground shadow-pop overflow-hidden">
                            <div className="p-4 border-b-2 border-foreground bg-muted/30 flex items-center gap-3">
                                <div className="bg-primary/10 p-2 rounded-xl border-2 border-primary/20">
                                    <Newspaper className="w-5 h-5 text-primary" />
                                </div>
                                <h2 className="text-lg font-bold" style={{ fontFamily: "var(--font-heading)" }}>Latest News</h2>
                            </div>
                            <div className="divide-y divide-foreground/5">
                                {stockData.news.map((item: any, i: number) => (
                                    <a key={i} href={item.link} target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 p-4 hover:bg-muted/50 transition-colors group">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors leading-snug mb-1 line-clamp-2">{item.title}</p>
                                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                                                <span>{item.publisher}</span>
                                                <span>·</span>
                                                <Clock className="w-3 h-3" />
                                                <span>{item.time}</span>
                                            </div>
                                        </div>
                                        <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-0.5" />
                                    </a>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {stockData.description && stockData.description !== "No description available." && (
                        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.25 }} className="bg-card rounded-3xl border-2 border-foreground shadow-pop overflow-hidden">
                            <div className="p-4 border-b-2 border-foreground bg-muted/30 flex items-center gap-3">
                                <div className="bg-muted p-2 rounded-xl border-2 border-foreground/20">
                                    <Building2 className="w-5 h-5 text-foreground" />
                                </div>
                                <h2 className="text-lg font-bold" style={{ fontFamily: "var(--font-heading)" }}>About</h2>
                            </div>
                            <div className="p-4">
                                <p className="text-sm text-muted-foreground font-medium leading-relaxed line-clamp-5">{stockData.description}</p>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function ExplorePage() {
    const router = useRouter()
    const { user, isLoading } = useAuth()

    const [showLogoutModal, setShowLogoutModal] = useState(false)
    const [searchFocused, setSearchFocused] = useState(false)
    const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null)
    const [stockData, setStockData] = useState<any>(null)
    const [isLoadingStock, setIsLoadingStock] = useState(false)
    const [stockError, setStockError] = useState<string | null>(null)
    const [popularStocks, setPopularStocks] = useState<any[]>([])
    const [isLoadingPopular, setIsLoadingPopular] = useState(true)

    useEffect(() => {
        if (!isLoading && !user) router.push("/login")
    }, [isLoading, user, router])

    useEffect(() => {
        if (!user) return
        fetch("http://localhost:8000/api/popular")
            .then((r) => r.json())
            .then((d) => setPopularStocks(d.stocks || []))
            .catch(console.error)
            .finally(() => setIsLoadingPopular(false))
    }, [user])

    const handleStockSelect = useCallback(async (symbol: string) => {
        setSelectedSymbol(symbol)
        setStockData(null)
        setStockError(null)
        setIsLoadingStock(true)
        try {
            const res = await fetch(`http://localhost:8000/api/ticker/${symbol}`)
            if (!res.ok) throw new Error("Failed")
            setStockData(await res.json())
        } catch {
            setStockError("Could not load stock data. Please try again.")
        } finally {
            setIsLoadingStock(false)
        }
    }, [])

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push("/login")
    }

    const ma20 = useMemo(() => {
        if (!stockData?.chart || stockData.chart.length < 20) return null
        const last20: number[] = stockData.chart.slice(-20).map((d: any) => d.price)
        const avg = last20.reduce((a, b) => a + b, 0) / 20
        return { value: Math.round(avg * 100) / 100, trend: stockData.price > avg ? "Above" : "Below" }
    }, [stockData])

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }
    if (!user) return null

    const isExploring = selectedSymbol !== null

    return (
        <div className="min-h-screen bg-background relative overflow-x-hidden">
            {/* Logout modal */}
            {showLogoutModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center">
                    <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={() => setShowLogoutModal(false)} />
                    <div className="relative bg-card border-2 border-foreground rounded-xl shadow-pop p-6 max-w-sm w-full mx-4">
                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-destructive/10 border-2 border-destructive shadow-pop flex items-center justify-center">
                                <LogOut className="h-8 w-8 text-destructive" />
                            </div>
                            <h3 className="font-heading text-2xl font-bold text-foreground mb-2">Log out?</h3>
                            <p className="text-muted-foreground text-sm mb-6">Are you sure you want to log out?</p>
                            <div className="flex gap-3">
                                <button className="flex-1 py-3 bg-white border-2 border-border text-foreground hover:bg-muted/50 rounded-xl font-bold transition-all" onClick={() => setShowLogoutModal(false)}>Cancel</button>
                                <button className="flex-1 py-3 bg-destructive text-destructive-foreground border-2 border-destructive rounded-xl font-bold shadow-pop hover:translate-y-0.5 hover:shadow-none transition-all" onClick={handleLogout}>Log out</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Background blobs */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-tertiary/20 blur-3xl" />
                <div className="absolute top-1/3 right-20 w-48 h-48 rounded-full bg-primary/10 blur-3xl" />
                <div className="absolute bottom-1/4 left-1/4 w-40 h-40 rounded-full bg-secondary/10 blur-3xl" />
            </div>

            <Sidebar />

            <div className="lg:pl-72 relative">
                {/* Header — identical structure to main dashboard */}
                <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-sm border-b-2 border-foreground/10">
                    <div className="px-4 sm:px-6 lg:px-8 relative">
                        <div className="flex items-center justify-center h-[92px]">
                            {/* Mobile logo */}
                            <div className="absolute left-4 sm:left-6 lg:hidden flex items-center gap-2">
                                <div className="h-10 w-10 rounded-xl bg-primary border-2 border-foreground shadow-pop flex items-center justify-center transition-bounce hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-pop-hover">
                                    <span className="text-primary-foreground font-bold text-lg">S</span>
                                </div>
                                <span className="font-bold text-foreground text-xl" style={{ fontFamily: "var(--font-heading)" }}>Stocky</span>
                            </div>

                            {/* Centred search — always present, routes to lesson flow */}
                            <div className="hidden sm:block w-full max-w-[620px] mx-auto transform transition-all hover:scale-[1.01]">
                                <StockSearch
                                    popularStocks={popularStocks}
                                    isLoading={isLoadingPopular}
                                    placeholder="Search a stock to start a lesson..."
                                />
                            </div>

                            {/* Right icons */}
                            <div className="absolute right-4 sm:right-6 lg:right-8 flex items-center gap-3">
                                <Button variant="outline" size="icon" className="border-2 border-foreground/20 hover:border-foreground hover:bg-tertiary transition-bounce rounded-full bg-transparent">
                                    <Bell className="h-5 w-5" strokeWidth={2.5} />
                                    <span className="sr-only">Notifications</span>
                                </Button>
                                <Button variant="outline" size="icon" onClick={() => setShowLogoutModal(true)} className="border-2 border-foreground/20 hover:border-foreground hover:bg-destructive hover:text-destructive-foreground transition-bounce rounded-full bg-transparent">
                                    <LogOut className="h-5 w-5" strokeWidth={2.5} />
                                    <span className="sr-only">Logout</span>
                                </Button>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page body */}
                <AnimatePresence mode="wait">
                    {!isExploring ? (
                        /* ── PHASE 1: Landing ── */
                        <motion.div
                            key="landing"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0, y: -16 }}
                            transition={{ duration: 0.3 }}
                            className="relative min-h-[calc(100vh-92px)] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 pb-32 lg:pb-8 overflow-hidden"
                        >
                            {/* Animated floating market badges */}
                            <FloatingItems />

                            {/* Hero content */}
                            <div className="relative z-10 text-center mb-10">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.08, duration: 0.4, ease: "backOut" }}
                                    className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-amber-100 border-2 border-foreground shadow-pop flex items-center justify-center"
                                >
                                    <Compass className="w-10 h-10 text-amber-600" strokeWidth={2} />
                                </motion.div>
                                <motion.h1
                                    initial={{ opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.18, duration: 0.35 }}
                                    className="text-4xl sm:text-5xl font-black text-foreground mb-3"
                                    style={{ fontFamily: "var(--font-heading)" }}
                                >
                                    Explore Markets
                                </motion.h1>
                                <motion.p
                                    initial={{ opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.26, duration: 0.35 }}
                                    className="text-muted-foreground text-lg font-medium max-w-sm mx-auto"
                                >
                                    Dive into any stock — live charts, technicals & news, all in one place.
                                </motion.p>
                            </div>

                            {/* Central explore search bar */}
                            <motion.div
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.34, duration: 0.35 }}
                                className="relative z-10 w-full max-w-[620px]"
                            >
                                <StockSearch
                                    popularStocks={popularStocks}
                                    isLoading={isLoadingPopular}
                                    onStockSelect={handleStockSelect}
                                    autoFocus
                                    className="max-w-full"
                                    placeholder="Search any stock, ETF or crypto..."
                                    onFocusChange={setSearchFocused}
                                />
                            </motion.div>

                            {/* Popular picks — MarketOverview pill style, fades when search is open */}
                            {popularStocks.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 16 }}
                                    animate={{ opacity: searchFocused ? 0 : 1, y: 0, pointerEvents: searchFocused ? "none" : "auto" }}
                                    transition={{ delay: searchFocused ? 0 : 0.44, duration: 0.2 }}
                                    className="relative z-10 mt-10 w-full max-w-2xl"
                                >
                                    <p className="text-center text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">
                                        Popular right now
                                    </p>
                                    <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide justify-center flex-wrap">
                                        {popularStocks.map((stock) => (
                                            <button
                                                key={stock.symbol}
                                                onClick={() => handleStockSelect(stock.symbol)}
                                                className="flex items-center gap-3 flex-shrink-0 px-4 py-2 rounded-xl border-2 border-foreground/10 bg-card/50 hover:border-foreground/30 hover:bg-card transition-all cursor-pointer text-left"
                                            >
                                                <div>
                                                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-wide">{stock.symbol}</p>
                                                    <p className="font-bold text-foreground">
                                                        {stock.price > 0 ? `$${stock.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : stock.name}
                                                    </p>
                                                </div>
                                                {stock.price > 0 && (
                                                    <div className={`flex items-center gap-1 text-sm font-bold px-2 py-1 rounded-lg ${(stock.changePercent ?? 0) >= 0 ? "text-quaternary bg-quaternary/10" : "text-destructive bg-destructive/10"}`}>
                                                        {(stock.changePercent ?? 0) >= 0
                                                            ? <TrendingUp className="h-4 w-4" strokeWidth={2.5} />
                                                            : <TrendingDown className="h-4 w-4" strokeWidth={2.5} />
                                                        }
                                                        {Math.abs(stock.changePercent ?? 0).toFixed(2)}%
                                                    </div>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>
                    ) : (
                        /* ── PHASE 2: Exploration view ── */
                        <motion.main
                            key="explore"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.35 }}
                            className="px-4 sm:px-6 lg:px-8 pt-8 pb-32 lg:pb-12"
                        >
                            {isLoadingStock ? (
                                <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                                    <p className="text-muted-foreground font-medium animate-pulse">Loading {selectedSymbol}…</p>
                                </div>
                            ) : stockError ? (
                                <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center">
                                    <p className="text-destructive font-bold text-xl">{stockError}</p>
                                    <button onClick={() => setSelectedSymbol(null)} className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold shadow-pop hover:translate-y-0.5 hover:shadow-none transition-all">
                                        Try another stock
                                    </button>
                                </div>
                            ) : stockData ? (
                                <ExploreContent symbol={selectedSymbol!} stockData={stockData} ma20={ma20} onReset={() => setSelectedSymbol(null)} />
                            ) : null}
                        </motion.main>
                    )}
                </AnimatePresence>

                <MobileNav popularStocks={popularStocks} />
            </div>
        </div>
    )
}
