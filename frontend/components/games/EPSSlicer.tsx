"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Slider } from '@/components/ui/slider'
import { cn } from '@/lib/utils'
import { PieChart, Users, CheckCircle2, ArrowRight } from 'lucide-react'

interface EPSSlicerProps {
    onComplete: () => void
    gameConfig?: {
        instruction?: string
    }
}

export default function EPSSlicer({ onComplete, gameConfig }: EPSSlicerProps) {
    const [shareCount, setShareCount] = useState([1])
    const [hasInteracted, setHasInteracted] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)

    // Derived values
    const count = shareCount[0]

    // Win condition: User maximizes dilution (20 shares)
    const handleSliderChange = (value: number[]) => {
        setShareCount(value)
    }

    const handleSliderCommit = (value: number[]) => {
        if (value[0] === 20 && !hasInteracted) {
            setHasInteracted(true) // Immediate checkmark
            setTimeout(() => setShowSuccess(true), 2000) // 2s delay for modal
        }
    }

    return (
        <div className="w-full max-w-xl mx-auto bg-card rounded-[2.5rem] border-4 border-foreground shadow-pop p-6 relative overflow-hidden flex flex-col gap-6 animate-pop-in select-none">

            {/* 1. Header Area - Balanced */}
            <div className="text-center relative z-10">
                <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-tertiary/20 text-tertiary-foreground border-2 border-tertiary/30 shadow-sm transform -rotate-2">
                        <PieChart className="w-6 h-6 text-tertiary-foreground" strokeWidth={2.5} />
                    </div>
                    <h3 className="text-2xl font-black text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>
                        The Profit Pizza
                    </h3>
                </div>
                <p className="text-muted-foreground font-bold text-base leading-tight max-w-sm mx-auto">
                    {gameConfig?.instruction || "Slide to add more shares!"}
                </p>
            </div>

            {/* 2. Visual Stage (Inset) - Viewport Friendly */}
            <div className="relative w-full h-40 bg-muted/20 rounded-3xl border-2 border-dashed border-foreground/20 flex items-center justify-center overflow-hidden p-3 shadow-inner">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5 pointer-events-none"
                    style={{ backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)', backgroundSize: '14px 14px' }} />

                <AnimatePresence mode='popLayout'>
                    {Array.from({ length: count }).map((_, i) => (
                        <motion.div
                            layout
                            key={i}
                            initial={{ scale: 0, width: 0, opacity: 0 }}
                            animate={{ scale: 1, width: "100%", opacity: 1 }}
                            exit={{ scale: 0, width: 0, opacity: 0 }}
                            transition={{
                                type: "spring",
                                stiffness: 400,
                                damping: 28
                            }}
                            className={cn(
                                "h-full rounded-2xl border-2 border-foreground shadow-sm flex-1 min-w-[10px] transition-colors relative group mx-[1px]",
                                i === 0 ? "bg-primary z-10 scale-105 shadow-md ring-4 ring-background" : "bg-card hover:bg-muted"
                            )}
                        >
                            {/* Highlight "Yours" */}
                            {i === 0 && (
                                <motion.div
                                    className="absolute inset-0 flex flex-col items-center justify-center"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                >
                                    <div className="hidden sm:block -rotate-90 text-primary-foreground font-black text-xs uppercase tracking-widest opacity-90 whitespace-nowrap">
                                        EPS
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* 3. Stats Grid - Prominent Cards */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/20 p-5 rounded-2xl border-2 border-border border-b-4 flex flex-col items-center justify-center gap-1 transition-transform active:scale-95 duration-200 cursor-default hover:bg-muted/30">
                    <div className="flex items-center gap-2 text-muted-foreground font-black text-xs uppercase tracking-wider">
                        <Users className="w-4 h-4" /> Shares
                    </div>
                    <div className="text-5xl font-black text-foreground tabular-nums tracking-tight leading-none mt-1">
                        {count}
                    </div>
                </div>

                <div className="bg-primary/10 p-5 rounded-2xl border-2 border-primary/20 border-b-4 border-b-primary/30 flex flex-col items-center justify-center gap-1 relative overflow-hidden transition-transform active:scale-95 duration-200 cursor-default hover:bg-primary/15">
                    <div className="flex items-center gap-2 text-primary font-black text-xs uppercase tracking-wider relative z-10">
                        <PieChart className="w-4 h-4" /> EPS Value
                    </div>
                    <div className="text-5xl font-black text-primary tabular-nums tracking-tight leading-none relative z-10 mt-1">
                        ${(100 / count).toFixed(0)}
                    </div>
                </div>
            </div>

            {/* 4. Controls - Integrated */}
            <div className="bg-muted/30 rounded-2xl p-5 border-2 border-foreground/5">
                <Slider
                    defaultValue={[1]}
                    max={20}
                    min={1}
                    step={1}
                    value={shareCount}
                    onValueChange={handleSliderChange}
                    onValueCommit={handleSliderCommit}
                    className="cursor-pointer py-2"
                />
                <div className="flex justify-between text-[10px] font-black mt-2 uppercase text-muted-foreground tracking-widest px-1">
                    <span>Low Dilution</span>
                    <span>High Dilution</span>
                </div>
            </div>

            {/* Subtle Success Indicator */}
            <AnimatePresence>
                {hasInteracted && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute top-4 right-4 text-primary bg-primary/10 p-1.5 rounded-full border-2 border-primary/20"
                    >
                        <CheckCircle2 className="w-5 h-5" />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Win Modal Overlay */}
            <AnimatePresence>
                {showSuccess && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-50 bg-card/90 backdrop-blur-[2px] flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.8, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="w-full bg-card border-4 border-foreground rounded-[2rem] shadow-pop p-6 text-center"
                        >
                            <div className="w-16 h-16 bg-primary/20 text-primary rounded-full flex items-center justify-center mb-4 mx-auto border-2 border-primary/30 animate-bounce">
                                <CheckCircle2 className="w-8 h-8" strokeWidth={3} />
                            </div>

                            <h3 className="text-2xl font-black text-foreground mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                                Dilution Detected!
                            </h3>

                            <p className="text-muted-foreground font-bold text-sm mb-6 leading-relaxed">
                                You saw how adding more shares makes each slice smaller. That's why <span className="text-foreground">EPS drops</span> when share count rises!
                            </p>

                            <button
                                onClick={onComplete}
                                className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-black shadow-pop hover:translate-y-0.5 hover:shadow-none transition-all flex items-center justify-center gap-2 border-2 border-primary-foreground/20"
                            >
                                Continue to Quiz <ArrowRight className="w-5 h-5" strokeWidth={3} />
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    )
}
