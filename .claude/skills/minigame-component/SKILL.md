---
name: minigame-component
description: Use when building a new minigame component in frontend/components/games/. Covers props interface, onComplete contract, success/fail state pattern, Framer Motion rules, and styling.
---


# Skill: Stocky Minigame Component Standard

## Purpose
Every game in `frontend/components/games/` must follow this contract exactly.
This ensures consistent props, behaviour, styling, and completion flow.

## Required Props Interface

```tsx
interface YourGameProps {
    onComplete: () => void        // ALWAYS required — called when game is won/finished
    ticker?: string               // Pass when the game displays the real stock symbol
    stockData?: any               // Pass when the game uses real stock numbers
    gameConfig?: any              // Pass the raw game_config object from the lesson
    config?: any                  // Some older games use "config" instead of "gameConfig" — be consistent with the lesson's game_config shape
}

Never:

    Navigate or use router.push() inside a game

    Call onComplete() before the user has done something meaningful

    Block the user from completing if they fail — always provide a "Try Again" or "Continue" path

State Pattern

Every game needs at minimum:

tsx
const [phase, setPhase] = useState<"playing" | "success" | "fail">("playing")
const [score, setScore] = useState(0)

On win: setPhase("success") → show success card → call onComplete() after a short delay or button press
On fail: setPhase("fail") → show explanation → allow retry or allow skip via onComplete()
Success State — Required Template

Every game must show this success state before calling onComplete():

tsx
{phase === "success" && (
    <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center p-8 bg-card rounded-3xl border-2 border-foreground shadow-pop"
    >
        <div className="text-6xl mb-4">🎉</div>
        <h3 className="text-2xl font-black mb-2">Nice work!</h3>
        <p className="text-muted-foreground mb-6">{successMessage}</p>
        <button
            onClick={onComplete}
            className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-bold shadow-pop hover:translate-y-0.5 hover:shadow-none transition-all flex items-center justify-center gap-2"
        >
            Continue <ArrowRight className="w-5 h-5" strokeWidth={3} />
        </button>
    </motion.div>
)}

Styling Rules

Follow the "Playful Geometry" design system. See ui_design_system.md for full reference.

Game container:

tsx
<div className="w-full max-w-2xl mx-auto space-y-4">

Interactive element (tappable card, button, draggable):

tsx
className="bg-card rounded-xl border-2 border-foreground shadow-pop 
           hover:translate-y-0.5 hover:shadow-none transition-all cursor-pointer p-4"

Instruction text at top of game:

tsx
<div className="bg-muted rounded-xl p-4 border border-foreground/10 text-center">
    <p className="font-bold text-foreground">{gameConfig.instruction}</p>
</div>

Framer Motion Rules

    Use AnimatePresence + mode="wait" for phase transitions (playing → success → fail)

    Feedback animations: 0.3s–0.5s max, ease-out

    Never use useTransform on scroll position inside games — it causes layout bugs

    Use useTime() for infinite loops (e.g., pulsing elements)

    Use layout prop for smooth list reordering

tsx
// Correct loop animation
const time = useTime()
const rotate = useTransform(time, , , { clamp: false })

Real Data Usage

When stockData is passed, always use real values with safe fallbacks:

tsx
const price = stockData?.price || stockData?.stock_data?.current_price || 100
const beta = stockData?.stock_data?.beta || stockData?.beta || 1.0
const companyName = stockData?.shortName || stockData?.name || ticker || "This Stock"

File Naming

    PascalCase, descriptive: YourConceptGame.tsx

    No "Game" suffix needed — the folder already signals that

    Exception: existing files like TickerHunt.tsx, TheScale.tsx — don't rename

Export Style

Named export preferred to match existing pattern:

tsx
export function YourGame({ onComplete, ticker, stockData, gameConfig }: YourGameProps) {

Some existing games use default export — be consistent with surrounding files if refactoring.