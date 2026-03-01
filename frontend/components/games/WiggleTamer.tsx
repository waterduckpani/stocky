"use client"

import { useState } from "react"
import { motion, AnimatePresence, useTime, useTransform } from "framer-motion"
import { cn } from "@/lib/utils"
import { CheckCircle2, ArrowRight, Activity } from "lucide-react"
import { MinigameCompletionPopup } from "./MinigameCompletionPopup"

export interface WiggleTamerConfig {
    instruction: string
    betas: {
        category: "low" | "market" | "high"
        label: string
        example: string
        description: string
    }[]
}

interface WiggleTamerProps {
    onComplete: () => void
    config: WiggleTamerConfig
}

const CATEGORY_STYLE = {
    low: {
        barColor: "#729bf4",        // --secondary
        accentClass: "bg-secondary",
        textClass: "text-secondary-foreground",
        btnClass: "bg-secondary text-secondary-foreground border-secondary shadow-[0_4px_0_0_#5a7fe0]",
        btnIdle: "bg-card text-foreground border-foreground shadow-pop hover:translate-y-0.5 hover:shadow-none",
    },
    market: {
        barColor: "#FBBF24",        // amber / --tertiary
        accentClass: "bg-tertiary",
        textClass: "text-tertiary-foreground",
        btnClass: "bg-tertiary text-tertiary-foreground border-amber-400 shadow-[0_4px_0_0_#d97706]",
        btnIdle: "bg-card text-foreground border-foreground shadow-pop hover:translate-y-0.5 hover:shadow-none",
    },
    high: {
        barColor: "#EF4444",        // --destructive
        accentClass: "bg-destructive",
        textClass: "text-destructive-foreground",
        btnClass: "bg-destructive text-destructive-foreground border-destructive shadow-[0_4px_0_0_#b91c1c]",
        btnIdle: "bg-card text-foreground border-foreground shadow-pop hover:translate-y-0.5 hover:shadow-none",
    },
}

const VISUALIZER_CONFIG = {
    low:    { amplitude: 9,  speed: 3.5  },
    market: { amplitude: 26, speed: 1.8  },
    high:   { amplitude: 55, speed: 0.55 },
}

const BAR_COUNT = 16

function VisualizerBar({
    amplitude,
    speed,
    phase,
    barColor,
}: {
    amplitude: number
    speed: number
    phase: number
    barColor: string
}) {
    const time = useTime()
    const height = useTransform(time, (t) => {
        const base = 32
        const wave = Math.sin((t / (speed * 1000)) * Math.PI * 2 + phase * Math.PI * 2) * amplitude
        return Math.max(6, base + wave)
    })
    return (
        <motion.div
            className="flex-1 rounded-full"
            style={{ height, backgroundColor: barColor }}
        />
    )
}

function BetaVisualizer({ category }: { category: "low" | "market" | "high" }) {
    const { amplitude, speed } = VISUALIZER_CONFIG[category]
    const { barColor } = CATEGORY_STYLE[category]
    return (
        <div className="flex items-end justify-center gap-1.5 h-28 w-full px-2">
            {[...Array(BAR_COUNT)].map((_, i) => (
                <VisualizerBar
                    key={i}
                    amplitude={amplitude}
                    speed={speed}
                    phase={i / BAR_COUNT}
                    barColor={barColor}
                />
            ))}
        </div>
    )
}

export function WiggleTamer({ onComplete, config }: WiggleTamerProps) {
    const [active, setActive] = useState<"low" | "market" | "high" | null>(null)
    const [tried, setTried] = useState<Set<string>>(new Set())
    const [completed, setCompleted] = useState(false)

    const allTried = tried.size >= config.betas.length

    const handleSelect = (category: "low" | "market" | "high") => {
        setActive(category)
        setTried((prev) => new Set([...prev, category]))
    }

    const activeBeta = config.betas.find((b) => b.category === active) ?? null

    return (
        <div className="flex flex-col items-center w-full max-w-2xl mx-auto space-y-4">

            {/* Instruction */}
            <div className="bg-muted rounded-xl p-4 border border-foreground/10 text-center w-full">
                <p className="font-bold text-foreground">{config.instruction}</p>
            </div>

            {/* Visualiser Card */}
            <div className="w-full bg-card rounded-3xl border-2 border-foreground shadow-pop overflow-hidden">

                {/* Coloured accent header — changes with selection */}
                <div
                    className={cn(
                        "px-6 py-3 transition-colors duration-300",
                        active ? CATEGORY_STYLE[active].accentClass : "bg-muted"
                    )}
                >
                    <span
                        className={cn(
                            "text-lg font-black transition-colors duration-300",
                            active ? CATEGORY_STYLE[active].textClass : "text-muted-foreground"
                        )}
                        style={{ fontFamily: "var(--font-heading)" }}
                    >
                        {activeBeta ? activeBeta.label : "Pick a Beta type below"}
                    </span>
                </div>

                {/* Wave area */}
                <div className="px-6 py-6 bg-muted/30 min-h-[140px] flex items-center justify-center">
                    <AnimatePresence mode="wait">
                        {active ? (
                            <motion.div
                                key={active}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.25 }}
                                className="w-full"
                            >
                                <BetaVisualizer category={active} />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex flex-col items-center gap-2 text-muted-foreground"
                            >
                                <Activity className="w-8 h-8 opacity-30" />
                                <p className="text-sm font-bold opacity-50">
                                    Select a Beta type to see the wiggle
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Active beta info */}
                <AnimatePresence mode="wait">
                    {activeBeta && (
                        <motion.div
                            key={active}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 8 }}
                            transition={{ duration: 0.2 }}
                            className="px-6 py-4 border-t border-foreground/10"
                        >
                            <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-0.5">
                                e.g. {activeBeta.example}
                            </p>
                            <p className="text-sm font-medium text-foreground leading-snug">
                                {activeBeta.description}
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Beta Selector Buttons */}
            <div className="grid grid-cols-3 gap-3 w-full">
                {config.betas.map((beta) => {
                    const isActive = active === beta.category
                    const isTried = tried.has(beta.category)
                    const style = CATEGORY_STYLE[beta.category]

                    return (
                        <button
                            key={beta.category}
                            onClick={() => handleSelect(beta.category)}
                            className={cn(
                                "relative py-4 px-3 rounded-xl border-2 font-bold transition-all flex flex-col items-center gap-1",
                                isActive
                                    ? cn("translate-y-0.5 shadow-none", style.btnClass)
                                    : style.btnIdle
                            )}
                        >
                            <span className="text-base font-black">{beta.label}</span>

                            {/* Tried checkmark */}
                            <AnimatePresence>
                                {isTried && !isActive && (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-primary rounded-full flex items-center justify-center"
                                    >
                                        <CheckCircle2 className="w-3.5 h-3.5 text-primary-foreground" />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </button>
                    )
                })}
            </div>

            {/* Progress hint */}
            {!allTried && (
                <p className="text-sm text-muted-foreground font-bold text-center">
                    Try all three to continue ({tried.size} / {config.betas.length} explored)
                </p>
            )}

            {/* Continue — appears once all three tried */}
            <AnimatePresence>
                {allTried && (
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, ease: "backOut" }}
                        className="w-full"
                    >
                        <button
                            onClick={() => setCompleted(true)}
                            className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-bold shadow-pop hover:translate-y-0.5 hover:shadow-none transition-all flex items-center justify-center gap-2"
                        >
                            Got it, let's go! <ArrowRight className="w-5 h-5" strokeWidth={3} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            <MinigameCompletionPopup
                completed={completed}
                onComplete={onComplete}
                title="Volatility Tamer!"
                description="You've explored all three Beta types."
            />
        </div>
    )
}
