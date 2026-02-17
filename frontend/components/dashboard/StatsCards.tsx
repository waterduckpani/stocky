"use client"

import { Zap, Flame, BookOpen, Target } from "lucide-react"

interface StatsCardsProps {
    streakData?: {
        totalStreak: number
        weeklyGoal: number
        weeklyProgress: number
    }
}

// Static placeholder data for non-streak cards
const staticData = {
    level: 12,
    currentXp: 2340,
    xpToNextLevel: 3000,
    currentCourse: "Technical Analysis",
    currentUnit: "Candlestick Patterns",
    unitProgress: 65,
    totalUnits: 8,
    completedUnits: 5,
    avgQuizScore: 87,
    dailyChallengeStreak: 7,
}

export function StatsCards({ streakData }: StatsCardsProps) {
    const xpProgress = (staticData.currentXp / staticData.xpToNextLevel) * 100

    // Use provided streak data or defaults
    const totalStreak = streakData?.totalStreak ?? 0
    const weeklyGoal = streakData?.weeklyGoal ?? 5
    const weeklyProgress = streakData?.weeklyProgress ?? 0
    const weeklyStreakProgress = weeklyGoal > 0 ? (weeklyProgress / weeklyGoal) * 100 : 0

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Level & XP Card */}
            <div className="p-5 rounded-2xl border-2 border-foreground bg-card shadow-pop transition-bounce hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-pop-hover">
                <div className="flex items-center gap-3 mb-4">
                    <div className="h-12 w-12 rounded-xl bg-quaternary border-2 border-foreground flex items-center justify-center shadow-pop-mint">
                        <Zap className="h-6 w-6 text-quaternary-foreground" strokeWidth={2.5} />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground font-medium">Current Level</p>
                        <p className="text-xl font-extrabold text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>Level {staticData.level}</p>
                    </div>
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground font-medium">XP Progress</span>
                        <span className="text-foreground font-bold">{staticData.currentXp} / {staticData.xpToNextLevel}</span>
                    </div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden border-2 border-foreground/20">
                        <div
                            className="h-full bg-quaternary rounded-full transition-all duration-500"
                            style={{ width: `${xpProgress}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Weekly Streak Card */}
            <div className="p-5 rounded-2xl border-2 border-foreground bg-card shadow-pop transition-bounce hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-pop-hover">
                <div className="flex items-center gap-3 mb-4">
                    <div className="h-12 w-12 rounded-xl bg-tertiary border-2 border-foreground flex items-center justify-center shadow-pop-yellow">
                        <Flame className="h-6 w-6 text-tertiary-foreground" strokeWidth={2.5} />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground font-medium">Weekly Streak</p>
                        <p className="text-xl font-extrabold text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>{totalStreak} day streak</p>
                    </div>
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground font-medium">This Week</span>
                        <span className="text-foreground font-bold">{weeklyProgress} / {weeklyGoal} days</span>
                    </div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden border-2 border-foreground/20">
                        <div
                            className="h-full bg-tertiary rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(weeklyStreakProgress, 100)}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Current Course Card */}
            <div className="p-5 rounded-2xl border-2 border-foreground bg-card shadow-pop transition-bounce hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-pop-hover">
                <div className="flex items-center gap-3 mb-4">
                    <div className="h-12 w-12 rounded-xl bg-primary border-2 border-foreground flex items-center justify-center shadow-pop-violet">
                        <BookOpen className="h-6 w-6 text-primary-foreground" strokeWidth={2.5} />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground font-medium">Current Course</p>
                        <p className="text-base font-bold text-foreground">{staticData.currentCourse}</p>
                    </div>
                </div>
                <div className="space-y-2">
                    <p className="text-sm text-muted-foreground font-medium">{staticData.currentUnit}</p>
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground font-medium">Unit {staticData.completedUnits}/{staticData.totalUnits}</span>
                        <span className="text-foreground font-bold">{staticData.unitProgress}%</span>
                    </div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden border-2 border-foreground/20">
                        <div
                            className="h-full bg-primary rounded-full transition-all duration-500"
                            style={{ width: `${staticData.unitProgress}%` }}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
