"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Lightbulb, BookOpen, Target, Store, Scale, Zap, ArrowRight, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Slide {
    title: string
    icon: string
    text: string
}

interface ConceptData {
    name: string
    explanation?: string
    trigger_id?: string
    type?: "carousel"
    slides?: Slide[]
}

interface StepConceptProps {
    symbol: string
    stockData: any
    concept?: ConceptData | string
}

const ICON_MAP: Record<string, any> = {
    "Target": Target,
    "Store": Store,
    "Scale": Scale,
    "Zap": Zap
}

export function StepConcept({ symbol, stockData, concept }: StepConceptProps) {
    const [currentSlide, setCurrentSlide] = useState(0)

    // Handle string (legacy)
    if (typeof concept === 'string') {
        return (
            <div className="animate-in slide-in-from-right fade-in duration-500">
                <div className="bg-card rounded-3xl p-8 border-2 border-foreground shadow-pop">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-14 h-14 rounded-full bg-secondary text-white flex items-center justify-center border-2 border-foreground shadow-pop">
                            <Lightbulb className="w-7 h-7" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-secondary uppercase tracking-wider">Key Concept</p>
                            <h2 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>Understanding This</h2>
                        </div>
                    </div>
                    <div className="bg-muted/50 rounded-2xl p-6 border border-foreground/5">
                        <p className="text-lg font-medium text-foreground/90 leading-relaxed">{concept}</p>
                    </div>
                </div>
            </div>
        )
    }

    // Handle Carousel
    if (concept?.type === "carousel" && concept.slides) {
        const slide = concept.slides[currentSlide]
        const IconComponent = ICON_MAP[slide.icon] || Lightbulb
        const isLast = currentSlide === concept.slides.length - 1

        const nextSlide = () => {
            if (currentSlide < (concept.slides?.length || 0) - 1) setCurrentSlide(prev => prev + 1)
        }
        const prevSlide = () => {
            if (currentSlide > 0) setCurrentSlide(prev => prev - 1)
        }

        return (
            <div className="w-full max-w-2xl mx-auto animate-in zoom-in-50 duration-500">
                <div className="bg-card rounded-3xl border-2 border-foreground shadow-pop overflow-hidden relative">

                    <div className="p-8 relative z-10">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl bg-secondary text-white flex items-center justify-center border-2 border-foreground shadow-sm">
                                    <IconComponent className="w-6 h-6" strokeWidth={2.5} />
                                </div>
                                <h3 className="text-xl font-bold text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>{slide.title}</h3>
                            </div>
                            <div className="flex gap-1">
                                {concept.slides.map((_, i) => (
                                    <div key={i} className={`h-2 rounded-full transition-all duration-300 border border-foreground/10 ${i === currentSlide ? "w-8 bg-primary" : "w-2 bg-muted/50"}`} />
                                ))}
                            </div>
                        </div>

                        {/* Content */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentSlide}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                className="min-h-[120px] flex items-center"
                            >
                                <p className="text-xl font-medium leading-relaxed text-foreground/90"
                                    dangerouslySetInnerHTML={{
                                        __html: slide.text.replace(/\*\*(.*?)\*\*/g, '<span class="text-primary font-bold">$1</span>').replace(/\n/g, '<br/>')
                                    }}
                                />
                            </motion.div>
                        </AnimatePresence>

                        {/* Navigation */}
                        <div className="flex justify-between items-center mt-8 pt-6 border-t border-foreground/5">
                            <button
                                onClick={prevSlide}
                                disabled={currentSlide === 0}
                                className="p-3 rounded-full hover:bg-muted disabled:opacity-0 transition-all text-muted-foreground border-2 border-transparent hover:border-foreground/10"
                            >
                                <ArrowLeft className="w-6 h-6" />
                            </button>

                            {!isLast ? (
                                <button
                                    onClick={nextSlide}
                                    className="px-8 py-3 bg-primary text-primary-foreground rounded-xl font-bold shadow-pop hover:translate-y-0.5 hover:shadow-none transition-all flex items-center justify-center gap-2"
                                >
                                    Next <ArrowRight className="w-4 h-4 text-primary-foreground" strokeWidth={3} />
                                </button>
                            ) : (
                                <div className="px-6 py-3 text-primary font-bold bg-primary/10 rounded-full animate-pulse border-2 border-primary/20">
                                    Continue below 👇
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // Fallback handling (Standard Object)
    const title = concept?.name || "Key Concept"
    const text = concept?.explanation || ""

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
                            {title}
                        </h2>
                    </div>
                </div>

                <div className="bg-muted/50 rounded-2xl p-6 border border-foreground/5">
                    <p className="text-lg font-medium text-foreground/90 leading-relaxed">
                        {text}
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
