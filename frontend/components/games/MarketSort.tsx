"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import {
    Building2, Laptop, ArrowRight, CheckCircle2, XCircle,
    Smartphone, CupSoda, Search, ShoppingCart, Car, Landmark, Cpu, Clapperboard,
    Factory, Globe
} from "lucide-react"
import { MinigameCompletionPopup } from "./MinigameCompletionPopup"

export interface MarketSortConfig {
    bins: [
        { id: string, label: string, description: string, color: "amber" | "cyan" | "indigo" | "rose" },
        { id: string, label: string, description: string, color: "amber" | "cyan" | "indigo" | "rose" }
    ],
    companies: {
        id: number
        name: string
        ticker: string
        type: string // Must match bin.id
        icon: "smartphone" | "cup-soda" | "search" | "shopping-cart" | "car" | "landmark" | "cpu" | "clapperboard" | "factory" | "globe"
    }[]
}

interface MarketSortProps {
    onComplete: () => void
    config?: MarketSortConfig
}

// Default US Config (Fallback)
const DEFAULT_CONFIG: MarketSortConfig = {
    bins: [
        { id: "NYSE", label: "NYSE", description: "Physical Floor\nBlue Chips", color: "amber" },
        { id: "NASDAQ", label: "NASDAQ", description: "Digital Screen\nTech Giants", color: "cyan" }
    ],
    companies: [
        { id: 1, name: "Apple", ticker: "AAPL", type: "NASDAQ", icon: "smartphone" },
        { id: 2, name: "Coca-Cola", ticker: "KO", type: "NYSE", icon: "cup-soda" },
        { id: 3, name: "Google", ticker: "GOOGL", type: "NASDAQ", icon: "search" },
        { id: 4, name: "Walmart", ticker: "WMT", type: "NYSE", icon: "shopping-cart" },
        { id: 5, name: "Tesla", ticker: "TSLA", type: "NASDAQ", icon: "car" },
        { id: 6, name: "JP Morgan", ticker: "JPM", type: "NYSE", icon: "landmark" },
        { id: 7, name: "Nvidia", ticker: "NVDA", type: "NASDAQ", icon: "cpu" },
        { id: 8, name: "Disney", ticker: "DIS", type: "NYSE", icon: "clapperboard" },
    ]
}

const ICON_MAP: Record<string, any> = {
    "smartphone": Smartphone, "cup-soda": CupSoda, "search": Search,
    "shopping-cart": ShoppingCart, "car": Car, "landmark": Landmark,
    "cpu": Cpu, "clapperboard": Clapperboard, "factory": Factory, "globe": Globe
}

export function MarketSort({ onComplete, config = DEFAULT_CONFIG }: MarketSortProps) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [score, setScore] = useState(0)
    const [status, setStatus] = useState<"idle" | "correct" | "wrong">("idle")
    const [completed, setCompleted] = useState(false)

    // Only need 5 correct to pass
    const WIN_THRESHOLD = 5

    const currentCompany = config.companies[currentIndex]
    // Loop back to start if we run out of companies but haven't won (infinite mode style)
    // or just safeguard index access
    const safeCompany = currentCompany || config.companies[currentIndex % config.companies.length]

    const handleSort = (direction: "left" | "right") => {
        if (!safeCompany) return

        // Left = Bin 0, Right = Bin 1
        const targetBinId = direction === "left" ? config.bins[0].id : config.bins[1].id
        const isCorrect = safeCompany.type === targetBinId

        if (isCorrect) {
            setStatus("correct")
            const newScore = score + 1
            setScore(newScore)

            setTimeout(() => {
                if (newScore >= WIN_THRESHOLD) {
                    setCompleted(true)
                } else {
                    setCurrentIndex((prev: number) => prev + 1)
                    setStatus("idle")
                }
            }, 800)
        } else {
            setStatus("wrong")
            setTimeout(() => setStatus("idle"), 800)
        }
    }


    if (!safeCompany) return null

    const IconComponent = ICON_MAP[safeCompany.icon] || Globe

    return (
        <div className="flex flex-col items-center max-w-2xl mx-auto w-full">
            {/* Progress */}
            <div className="w-full flex justify-between items-center mb-8 px-4">
                <div className="text-sm font-bold text-muted-foreground">SCORE</div>
                <div className="flex gap-1">
                    {[...Array(WIN_THRESHOLD)].map((_, i) => (
                        <div
                            key={i}
                            className={cn(
                                "w-8 h-2 rounded-full transition-all duration-300",
                                i < score ? "bg-quaternary" : "bg-muted"
                            )}
                        />
                    ))}
                </div>
                <div className="text-sm font-bold text-muted-foreground">{score}/{WIN_THRESHOLD}</div>
            </div>

            {/* Instruction */}
            <h3 className="text-xl font-bold mb-8 text-center">Where does <span className="text-primary">{safeCompany.name}</span> trade?</h3>

            {/* Game Area */}
            <div className="relative w-full h-[300px] flex justify-center items-center mb-8">

                <AnimatePresence mode="wait">
                    <motion.div
                        key={safeCompany.id}
                        initial={{ scale: 0.8, opacity: 0, y: 50 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.8, opacity: 0, transition: { duration: 0.2 } }}
                        whileHover={{ scale: 1.05, y: -5 }}
                        whileTap={{ scale: 0.95 }}
                        className={cn(
                            "w-72 h-80 bg-white rounded-[2rem] border-2 shadow-pop flex flex-col items-center justify-center gap-2 z-10 relative cursor-grab active:cursor-grabbing touch-none",
                            status === "correct" ? "border-quaternary shadow-pop-green bg-quaternary/5" :
                                status === "wrong" ? "border-destructive shadow-pop-red bg-destructive/5" :
                                    "border-foreground"
                        )}
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={0.2}
                        onDragEnd={(_, info) => {
                            if (info.offset.x < -100) handleSort("left")
                            else if (info.offset.x > 100) handleSort("right")
                        }}
                    >
                        {/* Status Overlay */}
                        {status !== "idle" && (
                            <motion.div
                                initial={{ scale: 0 }} animate={{ scale: 1 }}
                                className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-20 rounded-3xl"
                            >
                                {status === "correct" ? (
                                    <CheckCircle2 className="w-20 h-20 text-quaternary drop-shadow-lg" />
                                ) : (
                                    <XCircle className="w-20 h-20 text-destructive drop-shadow-lg" />
                                )}
                            </motion.div>
                        )}

                        <div className="mb-4 filter drop-shadow-sm">
                            <IconComponent className="w-20 h-20 text-foreground" strokeWidth={1.5} />
                        </div>
                        <div className="text-center">
                            <h2 className="text-3xl font-black text-foreground tracking-tight mb-1" style={{ fontFamily: 'var(--font-heading)' }}>{safeCompany.name}</h2>
                            <div className="inline-block bg-muted px-3 py-1 rounded-lg text-sm font-bold text-muted-foreground uppercase tracking-wide">
                                {safeCompany.ticker}
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Left Bin */}
                <div className={cn(
                    "absolute left-0 bottom-0 top-0 w-1/3 border-2 border-dashed border-foreground/20 rounded-2xl flex flex-col justify-center items-center p-4 bg-muted/5 group transition-colors",
                    config.bins[0].color === "amber" && "hover:bg-amber-500/10",
                    config.bins[0].color === "cyan" && "hover:bg-cyan-500/10",
                    config.bins[0].color === "indigo" && "hover:bg-indigo-500/10"
                )}>
                    {config.bins[0].color === "amber" && <Building2 className="w-12 h-12 text-amber-500 mb-2 opacity-50 group-hover:opacity-100 transition-opacity" />}
                    {config.bins[0].color === "indigo" && <Building2 className="w-12 h-12 text-indigo-500 mb-2 opacity-50 group-hover:opacity-100 transition-opacity" />}

                    <span className={cn("font-black text-lg", config.bins[0].color === "amber" ? "text-amber-600" : "text-indigo-600")}>
                        {config.bins[0].label}
                    </span>
                    <span className="text-xs font-bold text-muted-foreground text-center mt-1 whitespace-pre-line">
                        {config.bins[0].description}
                    </span>
                </div>

                {/* Right Bin */}
                <div className={cn(
                    "absolute right-0 bottom-0 top-0 w-1/3 border-2 border-dashed border-foreground/20 rounded-2xl flex flex-col justify-center items-center p-4 bg-muted/5 group transition-colors",
                    config.bins[1].color === "cyan" && "hover:bg-cyan-500/10",
                    config.bins[1].color === "rose" && "hover:bg-rose-500/10"
                )}>
                    {config.bins[1].color === "cyan" && <Laptop className="w-12 h-12 text-cyan-500 mb-2 opacity-50 group-hover:opacity-100 transition-opacity" />}
                    {config.bins[1].color === "rose" && <Building2 className="w-12 h-12 text-rose-500 mb-2 opacity-50 group-hover:opacity-100 transition-opacity" />}

                    <span className={cn("font-black text-lg", config.bins[1].color === "cyan" ? "text-cyan-600" : "text-rose-600")}>
                        {config.bins[1].label}
                    </span>
                    <span className="text-xs font-bold text-muted-foreground text-center mt-1 whitespace-pre-line">
                        {config.bins[1].description}
                    </span>
                </div>

            </div>

            <p className="text-sm font-bold text-muted-foreground animate-pulse">Drag card Left or Right</p>

            <MinigameCompletionPopup
                completed={completed}
                onComplete={onComplete}
                title="Market Master!"
                description="You know exactly where the big players live."
            />
        </div>
    )
}

function Trophy(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
            <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
            <path d="M4 22h16" />
            <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
            <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
            <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
        </svg>
    )
}
