"use client"

import { Zap, Flame, BookOpen, Target } from "lucide-react"

const userData = {
    level: 12,
    currentXp: 2340,
    xpToNextLevel: 3000,
    streak: 14,
    currentCourse: "Technical Analysis",
    currentUnit: "Candlestick Patterns",
    unitProgress: 65,
    totalUnits: 8,
    completedUnits: 5,
    avgQuizScore: 87,
    dailyChallengeStreak: 7,
}

export function StatsCards() {
    const xpProgress = (userData.currentXp / userData.xpToNextLevel) * 100

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Level & XP Card */}
            <div className="p-5 rounded-2xl border-2 border-foreground bg-card shadow-pop transition-bounce hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-pop-hover">
                <div className="flex items-center gap-3 mb-4">
                    <div className="h-12 w-12 rounded-xl bg-quaternary border-2 border-foreground flex items-center justify-center shadow-pop-mint">
                        <Zap className="h-6 w-6 text-quaternary-foreground" strokeWidth={2.5} />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground font-medium">Current Level</p>
                        <p className="text-xl font-extrabold text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>Level {userData.level}</p>
                    </div>
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground font-medium">XP Progress</span>
                        <span className="text-foreground font-bold">{userData.currentXp} / {userData.xpToNextLevel}</span>
                    </div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden border-2 border-foreground/20">
                        <div
                            className="h-full bg-quaternary rounded-full transition-all duration-500"
                            style={{ width: `${xpProgress}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Daily Streak Card */}
            <div className="p-5 rounded-2xl border-2 border-foreground bg-card shadow-pop transition-bounce hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-pop-hover">
                <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-xl bg-tertiary border-2 border-foreground flex items-center justify-center shadow-pop-yellow">
                        <Flame className="h-6 w-6 text-tertiary-foreground" strokeWidth={2.5} />
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground font-medium">Daily Streak</p>
                        <p className="text-2xl font-extrabold text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>{userData.streak} days</p>
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
                        <p className="text-base font-bold text-foreground">{userData.currentCourse}</p>
                    </div>
                </div>
                <div className="space-y-2">
                    <p className="text-sm text-muted-foreground font-medium">{userData.currentUnit}</p>
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground font-medium">Unit {userData.completedUnits}/{userData.totalUnits}</span>
                        <span className="text-foreground font-bold">{userData.unitProgress}%</span>
                    </div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden border-2 border-foreground/20">
                        <div
                            className="h-full bg-primary rounded-full transition-all duration-500"
                            style={{ width: `${userData.unitProgress}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Quiz Performance Card */}
            <div className="p-5 rounded-2xl border-2 border-foreground bg-card shadow-pop transition-bounce hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-pop-hover">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-xl bg-secondary border-2 border-foreground flex items-center justify-center shadow-pop-pink">
                            <Target className="h-6 w-6 text-secondary-foreground" strokeWidth={2.5} />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground font-medium">Avg Quiz Score</p>
                            <p className="text-2xl font-extrabold text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>{userData.avgQuizScore}%</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-muted-foreground font-medium">Challenge</p>
                        <p className="text-base font-bold text-foreground">{userData.dailyChallengeStreak} day streak</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
