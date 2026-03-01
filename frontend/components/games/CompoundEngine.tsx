"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Trophy, ArrowRight, Wallet, TrendingUp, RefreshCcw } from "lucide-react"

interface CompoundEngineProps {
    onComplete: () => void
    config: {
        instruction: string
    }
}

// Game Constants
const GAME_DURATION = 15 // Seconds
const INITIAL_FUEL = 100 // Starting engine size

interface Dividend {
    id: number
    x: number
    y: number
}

export function CompoundEngine({ onComplete, config }: CompoundEngineProps) {
    const [gameState, setGameState] = useState<"intro" | "playing" | "finished">("intro")
    const [walletScore, setWalletScore] = useState(0)
    const [engineSize, setEngineSize] = useState(INITIAL_FUEL)
    const [spawnRate, setSpawnRate] = useState(2000)
    const [enginePower, setEnginePower] = useState(0)
    const [timeLeft, setTimeLeft] = useState(GAME_DURATION)
    const [dividends, setDividends] = useState<Dividend[]>([])

    const containerRef = useRef<HTMLDivElement>(null)
    const spawnTimer = useRef<NodeJS.Timeout | null>(null)
    const gameTimer = useRef<NodeJS.Timeout | null>(null)

    const calculatePower = () => {
        const power = Math.min(100, ((engineSize - INITIAL_FUEL) / 200) * 100)
        setEnginePower(power)
    }

    const startGame = () => {
        setGameState("playing")
        setWalletScore(0)
        setEngineSize(INITIAL_FUEL)
        setSpawnRate(1500)
        setDividends([])
        setTimeLeft(GAME_DURATION)

        gameTimer.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    endGame()
                    return 0
                }
                return prev - 1
            })
        }, 1000)
    }

    // Spawn Loop handling rate changes
    const rateRef = useRef(1500)
    useEffect(() => {
        rateRef.current = spawnRate
    }, [spawnRate])

    useEffect(() => {
        if (gameState !== "playing") return

        let timeout: NodeJS.Timeout
        const loop = () => {
            spawnDividend()
            timeout = setTimeout(loop, rateRef.current)
        }
        loop()

        return () => clearTimeout(timeout)
    }, [gameState])

    const spawnDividend = () => {
        const newId = Date.now() + Math.random()
        setDividends(prev => [...prev, {
            id: newId,
            x: Math.random() * 80 + 10,
            y: Math.random() * 40 + 10,
        }])
    }

    const endGame = () => {
        if (spawnTimer.current) clearTimeout(spawnTimer.current)
        if (gameTimer.current) clearInterval(gameTimer.current)
        setGameState("finished")
    }

    const handleAction = (action: "pocket" | "reinvest") => {
        if (dividends.length === 0) return

        setDividends(prev => prev.slice(1))

        if (action === "pocket") {
            setWalletScore(prev => prev + 10)
        } else {
            setEngineSize(prev => prev + 15)
            setSpawnRate(prev => Math.max(200, prev * 0.9))
            calculatePower()
        }
    }

    // Cleanup
    useEffect(() => {
        return () => {
            if (spawnTimer.current) clearTimeout(spawnTimer.current)
            if (gameTimer.current) clearInterval(gameTimer.current)
        }
    }, [])

    if (gameState === "intro") {
        return (
            <motion.div
                initial={{ scale: 0.92, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "backOut" }}
                className="flex flex-col items-center justify-center min-h-[400px] text-center p-6 bg-card rounded-[2rem] border-2 border-foreground shadow-pop"
            >
                <div className="w-20 h-20 bg-secondary/20 rounded-full flex items-center justify-center mb-6 animate-pulse border-2 border-foreground shadow-sm">
                    <RefreshCcw className="w-10 h-10 text-secondary" />
                </div>
                <h2 className="text-3xl font-black mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                    The Compound Engine
                </h2>
                <p className="text-lg text-muted-foreground mb-8 max-w-md">
                    {config.instruction}
                </p>
                <div className="flex gap-4 mb-8">
                    <div className="flex flex-col items-center p-4 bg-muted/40 rounded-2xl border border-foreground/10">
                        <Wallet className="w-8 h-8 text-amber-500 mb-2" />
                        <span className="font-bold text-sm">Pocket (Cash)</span>
                    </div>
                    <ArrowRight className="text-muted-foreground mt-8" />
                    <div className="flex flex-col items-center p-4 bg-muted/40 rounded-2xl border border-foreground/10">
                        <TrendingUp className="w-8 h-8 text-primary mb-2" />
                        <span className="font-bold text-sm">Reinvest (Grow)</span>
                    </div>
                </div>
                <button
                    onClick={startGame}
                    className="w-full max-w-sm py-4 bg-primary text-primary-foreground text-xl font-bold rounded-xl shadow-pop hover:translate-y-0.5 hover:shadow-none transition-all flex items-center justify-center gap-2"
                >
                    Start Engine <ArrowRight className="w-5 h-5" strokeWidth={3} />
                </button>
            </motion.div>
        )
    }

    if (gameState === "finished") {
        return (
            <motion.div
                initial={{ scale: 0.92, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "backOut" }}
                className="flex flex-col items-center justify-center min-h-[400px] text-center p-6 bg-card rounded-[2rem] border-2 border-foreground shadow-pop"
            >
                <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 border-2 border-foreground shadow-sm animate-bounce">
                    <Trophy className="w-12 h-12" />
                </div>
                <h2 className="text-3xl font-black mb-2" style={{ fontFamily: "var(--font-heading)" }}>
                    Compounding Complete!
                </h2>

                <div className="grid grid-cols-2 gap-8 w-full max-w-sm mb-8 mt-4">
                    <div className="text-center">
                        <p className="text-muted-foreground font-bold uppercase text-xs tracking-wider mb-1">
                            Cash Collected
                        </p>
                        <p className="text-3xl font-black text-amber-500">${walletScore}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-muted-foreground font-bold uppercase text-xs tracking-wider mb-1">
                            Engine Growth
                        </p>
                        <p className="text-3xl font-black text-primary">
                            +{Math.round(((engineSize - INITIAL_FUEL) / INITIAL_FUEL) * 100)}%
                        </p>
                    </div>
                </div>

                <p className="text-muted-foreground mb-8 text-sm max-w-xs mx-auto">
                    {engineSize > INITIAL_FUEL * 1.5
                        ? "You figured it out! Reinvesting made the engine go wild! 🚀"
                        : "You took the cash early. Safe, but notice how the engine stayed small? 🌱"}
                </p>

                <button
                    onClick={onComplete}
                    className="w-full max-w-sm py-4 bg-primary text-primary-foreground text-xl font-bold rounded-xl shadow-pop hover:translate-y-0.5 hover:shadow-none transition-all flex items-center justify-center gap-2"
                >
                    Continue Lesson <ArrowRight className="w-6 h-6" />
                </button>
            </motion.div>
        )
    }

    return (
        <div
            ref={containerRef}
            className="w-full max-w-xl mx-auto h-[500px] bg-muted/30 rounded-[2.5rem] border-2 border-foreground shadow-pop relative overflow-hidden select-none touch-none flex flex-col"
        >
            {/* Header / Timer */}
            <div className="absolute top-6 left-0 right-0 flex justify-center z-10 pointer-events-none">
                <div className="bg-card/90 backdrop-blur border-2 border-foreground px-4 py-1 rounded-full font-black text-xl tabular-nums shadow-sm">
                    {timeLeft}s
                </div>
            </div>

            {/* Game Area */}
            <div className="flex-1 relative">
                {/* The Engine */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none pb-20">
                    <motion.div
                        layout
                        className="relative flex items-center justify-center bg-secondary rounded-3xl border-4 border-foreground shadow-pop z-10"
                        style={{ width: engineSize, height: engineSize }}
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: spawnRate / 1000, repeat: Infinity }}
                    >
                        <RefreshCcw
                            className="text-secondary-foreground opacity-60"
                            style={{ width: engineSize * 0.4, height: engineSize * 0.4 }}
                        />
                        {enginePower > 20 && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-full h-full animate-ping rounded-3xl bg-secondary opacity-20" />
                            </div>
                        )}
                    </motion.div>
                </div>

                {/* Dividend Tokens */}
                <AnimatePresence>
                    {dividends.map(div => (
                        <motion.div
                            key={div.id}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0, y: div.y + 100 }}
                            className="absolute w-12 h-12 -ml-6 -mt-6 bg-amber-400 rounded-full border-2 border-foreground shadow-sm flex items-center justify-center z-20"
                            style={{ left: `${div.x}%`, top: `${div.y}%` }}
                        >
                            <span className="font-black text-foreground text-sm">$</span>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Controls */}
            <div className="p-4 grid grid-cols-2 gap-4 bg-card border-t-2 border-foreground">
                <button
                    onClick={() => handleAction("pocket")}
                    disabled={dividends.length === 0}
                    className="py-6 rounded-2xl bg-muted text-foreground font-black text-xl shadow-[0_4px_0_0_rgba(0,0,0,0.2)] hover:translate-y-0.5 hover:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed flex flex-col items-center gap-1 border-2 border-foreground"
                >
                    <div className="flex items-center gap-2">
                        <Wallet className="w-6 h-6 text-amber-500" /> KEEP ($)
                    </div>
                    <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider">
                        Balance: ${walletScore}
                    </span>
                </button>

                <button
                    onClick={() => handleAction("reinvest")}
                    disabled={dividends.length === 0}
                    className="py-6 rounded-2xl bg-primary text-primary-foreground font-black text-xl shadow-pop hover:translate-y-0.5 hover:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed flex flex-col items-center gap-1 border-2 border-foreground"
                >
                    <div className="flex items-center gap-2">
                        <RefreshCcw className="w-6 h-6" /> GROW (↻)
                    </div>
                    <span className="text-xs opacity-70 font-bold uppercase tracking-wider">
                        Rate: {Math.round(2000 / spawnRate)}x
                    </span>
                </button>
            </div>
        </div>
    )
}
