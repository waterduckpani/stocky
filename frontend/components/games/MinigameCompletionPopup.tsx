import { motion, AnimatePresence } from "framer-motion"
import { Trophy, ArrowRight, LucideIcon } from "lucide-react"

interface MinigameCompletionPopupProps {
    completed: boolean;
    onComplete: () => void;
    title?: string;
    description?: string;
    buttonText?: string;
    icon?: LucideIcon;
}

export function MinigameCompletionPopup({
    completed,
    onComplete,
    title = "Level Complete!",
    description = "Great job completing this minigame.",
    buttonText = "Continue to Quiz",
    icon: Icon = Trophy
}: MinigameCompletionPopupProps) {
    return (
        <AnimatePresence>
            {completed && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-50 bg-background/80 backdrop-blur-[2px] flex items-center justify-center p-6"
                >
                    <motion.div
                        initial={{ scale: 0.8, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.8, y: -20, opacity: 0 }}
                        className="bg-card text-foreground border-2 border-foreground shadow-pop rounded-[2rem] p-6 w-[85%] max-w-sm flex flex-col items-center"
                    >
                        <div className="w-16 h-16 bg-primary/10 text-primary border-primary/20 rounded-full flex items-center justify-center mb-4 border-2 shadow-pop-active">
                            <Icon className="w-8 h-8" strokeWidth={3} />
                        </div>

                        <h3 className="text-2xl font-black text-foreground mb-1 uppercase tracking-wide text-center" style={{ fontFamily: 'var(--font-heading)' }}>
                            {title}
                        </h3>
                        <p className="text-muted-foreground font-medium text-sm mb-6 px-4 text-center leading-tight">
                            {description}
                        </p>

                        <button
                            onClick={onComplete}
                            className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-bold shadow-pop hover:translate-y-0.5 hover:shadow-none transition-all flex items-center justify-center gap-2"
                        >
                            {buttonText} <ArrowRight className="w-5 h-5" strokeWidth={3} />
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
