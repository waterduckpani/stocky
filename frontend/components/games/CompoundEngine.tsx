"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Trophy, ArrowRight, Wallet, TrendingUp, RefreshCcw, DollarSign } from "lucide-react"

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
    const [walletScore, setWalletScore] = useState(0) // Linear Growth
    const [engineSize, setEngineSize] = useState(INITIAL_FUEL) // Exponential Growth
    const [spawnRate, setSpawnRate] = useState(2000) // MS per spawn
    const [enginePower, setEnginePower] = useState(0) // Visual power level

    const [timeLeft, setTimeLeft] = useState(GAME_DURATION)
    const [dividends, setDividends] = useState<Dividend[]>([])

    const containerRef = useRef<HTMLDivElement>(null)
    const spawnTimer = useRef<NodeJS.Timeout | null>(null)
    const gameTimer = useRef<NodeJS.Timeout | null>(null)


    // Calculate engine power for visuals (0-100%)
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

        // Game Timer
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
    }, [gameState]) // Restart loop if game state changes (e.g. paused/started)


    const spawnDividend = () => {
        const newId = Date.now() + Math.random() // Unique ID
        // Random floating position (top half mostly)
        // Kept within bounds 10-90%
        setDividends(prev => [...prev, {
            id: newId,
            x: Math.random() * 80 + 10,
            y: Math.random() * 40 + 10, // Top half
        }])
    }

    const endGame = () => {
        if (spawnTimer.current) clearTimeout(spawnTimer.current)
        if (gameTimer.current) clearInterval(gameTimer.current)
        setGameState("finished")
    }

    const handleAction = (action: "pocket" | "reinvest") => {
        if (dividends.length === 0) return // Nothing to act on

        // Consume the OLDEST dividend (FIFO)
        const target = dividends[0]
        setDividends(prev => prev.slice(1))

        if (action === "pocket") {
            // Linear Reward
            setWalletScore(prev => prev + 10)
        } else {
            // Exponential Reward
            setEngineSize(prev => prev + 15)
            setSpawnRate(prev => Math.max(200, prev * 0.9)) // Can go very fast
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
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-6 bg-white rounded-[2rem] border-2 border-foreground shadow-pop animate-in zoom-in">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6 animate-pulse">
                    <RefreshCcw className="w-10 h-10 text-blue-600" />
                </div>
                <h2 className="text-3xl font-black mb-4" style={{ fontFamily: 'var(--font-heading)' }}>The Compound Engine</h2>
                <p className="text-lg text-muted-foreground mb-8 max-w-md">
                    {config.instruction}
                </p>
                <div className="flex gap-4 mb-8">
                    <div className="flex flex-col items-center p-4 bg-muted/20 rounded-2xl">
                        <Wallet className="w-8 h-8 text-amber-500 mb-2" />
                        <span className="font-bold text-sm">Pocket (Cash)</span>
                    </div>
                    <ArrowRight className="text-muted-foreground mt-8" />
                    <div className="flex flex-col items-center p-4 bg-muted/20 rounded-2xl">
                        <TrendingUp className="w-8 h-8 text-blue-500 mb-2" />
                        <span className="font-bold text-sm">Reinvest (Grow)</span>
                    </div>
                </div>
                <button
                    onClick={startGame}
                    className="w-full max-w-sm py-4 bg-primary text-primary-foreground text-xl font-bold rounded-xl shadow-pop hover:translate-y-0.5 hover:shadow-none transition-all"
                >
                    Start Engine
                </button>
            </div>
        )
    }

    if (gameState === "finished") {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-6 bg-white rounded-[2rem] border-2 border-foreground shadow-pop animate-in zoom-in">
                <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 animate-bounce">
                    <Trophy className="w-12 h-12" />
                </div>
                <h2 className="text-3xl font-black mb-2" style={{ fontFamily: 'var(--font-heading)' }}>Compounding Complete!</h2>

                <div className="grid grid-cols-2 gap-8 w-full max-w-sm mb-8 mt-4">
                    <div className="text-center">
                        <p className="text-muted-foreground font-bold uppercase text-xs tracking-wider mb-1">Cash Collected</p>
                        <p className="text-3xl font-black text-amber-500">${walletScore}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-muted-foreground font-bold uppercase text-xs tracking-wider mb-1">Engine Growth</p>
                        <p className="text-3xl font-black text-blue-500">+{Math.round(((engineSize - INITIAL_FUEL) / INITIAL_FUEL) * 100)}%</p>
                    </div>
                </div>

                <p className="text-muted-foreground mb-8 text-sm max-w-xs mx-auto">
                    {engineSize > INITIAL_FUEL * 1.5
                        ? "You figured it out! Reinvesting made the engine go wild! 🚀"
                        : "You took the cash early. Safe, but notice how the engine stayed small? 🌱"}
                </p>

                <button
                    onClick={onComplete}
                    className="bg-primary text-primary-foreground text-xl font-bold py-4 px-12 rounded-xl shadow-pop hover:translate-y-0.5 hover:shadow-none transition-all flex items-center gap-2"
                >
                    Continue Lesson <ArrowRight className="w-6 h-6" />
                </button>
            </div>
        )
    }

    return (
        <div
            ref={containerRef}
            className="w-full max-w-xl mx-auto h-[500px] bg-slate-50 rounded-[2.5rem] border-2 border-foreground shadow-inner relative overflow-hidden select-none touch-none flex flex-col"
        >
            {/* Header / Timer */}
            <div className="absolute top-6 left-0 right-0 flex justify-center z-10 pointer-events-none">
                <div className="bg-white/90 backdrop-blur border-2 border-foreground px-4 py-1 rounded-full font-black text-xl tabular-nums shadow-sm">
                    {timeLeft}s
                </div>
            </div>

            {/* Game Area (Engine + Dividends) */}
            <div className="flex-1 relative">
                {/* THE ENGINE (Center-ish) */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none pb-20">
                    <motion.div
                        layout
                        className="relative flex items-center justify-center bg-blue-500 rounded-3xl border-4 border-white shadow-2xl z-10 transition-all duration-300"
                        style={{
                            width: engineSize,
                            height: engineSize,
                        }}
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: spawnRate / 1000, repeat: Infinity }}
                    >
                        <RefreshCcw className="text-white opacity-50" style={{ width: engineSize * 0.4, height: engineSize * 0.4 }} />
                        {enginePower > 20 && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-full h-full animate-ping rounded-3xl bg-blue-400 opacity-20" />
                            </div>
                        )}
                    </motion.div>
                </div>

                {/* VISUAL DIVIDENDS */}
                <AnimatePresence>
                    {dividends.map(div => (
                        <motion.div
                            key={div.id}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0, y: div.y + 100 }} // Fall out
                            className="absolute w-12 h-12 -ml-6 -mt-6 bg-amber-400 rounded-full border-2 border-white shadow-lg flex items-center justify-center z-20"
                            style={{ left: `${div.x}%`, top: `${div.y}%` }}
                        >
                            <span className="font-bold text-black opacity-50">$</span>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* CONTROLS (Bottom) */}
            <div className="p-4 grid grid-cols-2 gap-4 bg-white border-t-2 border-foreground">
                <button
                    onClick={() => handleAction("pocket")}
                    disabled={dividends.length === 0}
                    className="py-6 rounded-2xl bg-amber-100 border-2 border-amber-300 text-amber-800 font-black text-xl shadow-[0_4px_0_0_#fcd34d] active:shadow-none active:translate-y-1 hover:bg-amber-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex flex-col items-center gap-1"
                >
                    <div className="flex items-center gap-2">
                        <Wallet className="w-6 h-6" /> KEEP ($)
                    </div>
                    <span className="text-xs opacity-70 font-bold uppercase tracking-wider">Balance: ${walletScore}</span>
                </button>

                <button
                    onClick={() => handleAction("reinvest")}
                    disabled={dividends.length === 0}
                    className="py-6 rounded-2xl bg-blue-100 border-2 border-blue-300 text-blue-800 font-black text-xl shadow-[0_4px_0_0_#93c5fd] active:shadow-none active:translate-y-1 hover:bg-blue-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex flex-col items-center gap-1"
                >
                    <div className="flex items-center gap-2">
                        <RefreshCcw className="w-6 h-6" /> GROW (↻)
                    </div>
                    <span className="text-xs opacity-70 font-bold uppercase tracking-wider">Rate: {Math.round(2000 / spawnRate)}x</span>
                </button>
            </div>

        </div>
    )
}
