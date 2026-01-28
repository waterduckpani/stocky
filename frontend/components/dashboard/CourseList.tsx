"use client"

import { BookOpen, PlayCircle, Clock, ChevronRight } from "lucide-react"

const courses = [
    {
        id: 1,
        title: "Technical Analysis Fundamentals",
        module: "Module 3: Candlestick Patterns",
        progress: 65,
        duration: "12 min left",
        lessons: 8,
        completed: 5,
        color: "primary"
    },
    {
        id: 2,
        title: "Value Investing Masterclass",
        module: "Module 1: Understanding Intrinsic Value",
        progress: 20,
        duration: "45 min left",
        lessons: 12,
        completed: 2,
        color: "secondary"
    },
    {
        id: 3,
        title: "Risk Management Essentials",
        module: "Module 2: Position Sizing",
        progress: 80,
        duration: "8 min left",
        lessons: 6,
        completed: 5,
        color: "tertiary"
    }
]

const colorMap = {
    primary: { bg: "bg-primary", shadow: "shadow-pop-violet", text: "text-primary-foreground" },
    secondary: { bg: "bg-secondary", shadow: "shadow-pop-blue", text: "text-secondary-foreground" },
    tertiary: { bg: "bg-tertiary", shadow: "shadow-pop-yellow", text: "text-tertiary-foreground" },
}

export function CourseList() {
    return (
        <div className="rounded-2xl border-2 border-foreground bg-card shadow-soft overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b-2 border-foreground/10 flex items-center justify-between bg-primary/10">
                <h3 className="text-lg font-bold flex items-center gap-2 text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>
                    <div className="h-8 w-8 rounded-lg bg-primary border-2 border-foreground flex items-center justify-center">
                        <BookOpen className="h-4 w-4 text-primary-foreground" strokeWidth={2.5} />
                    </div>
                    Continue Learning
                </h3>
                <button className="text-sm font-bold text-primary hover:text-primary/80 transition-colors">
                    View all
                </button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4">
                {courses.map((course) => {
                    const colors = colorMap[course.color as keyof typeof colorMap]
                    return (
                        <button
                            key={course.id}
                            className="w-full p-4 rounded-xl border-2 border-foreground/20 hover:border-foreground transition-bounce group text-left bg-background hover:shadow-pop hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-pop-active"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-foreground group-hover:text-primary transition-colors truncate" style={{ fontFamily: 'var(--font-heading)' }}>
                                        {course.title}
                                    </h4>
                                    <p className="text-sm text-muted-foreground mt-1 font-medium">{course.module}</p>

                                    <div className="mt-3">
                                        <div className="h-2.5 bg-muted rounded-full overflow-hidden border border-foreground/10">
                                            <div
                                                className={`h-full ${colors.bg} rounded-full transition-all duration-500`}
                                                style={{ width: `${course.progress}%` }}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground font-medium">
                                        <span className="flex items-center gap-1">
                                            <Clock className="h-3 w-3" strokeWidth={2.5} />
                                            {course.duration}
                                        </span>
                                        <span>{course.completed}/{course.lessons} lessons</span>
                                    </div>
                                </div>

                                <div className={`flex-shrink-0 h-12 w-12 rounded-xl ${colors.bg} border-2 border-foreground ${colors.shadow} flex items-center justify-center group-hover:scale-110 transition-bounce`}>
                                    <PlayCircle className={`h-6 w-6 ${colors.text}`} strokeWidth={2.5} />
                                </div>
                            </div>
                        </button>
                    )
                })}

                <button className="w-full py-4 text-center text-sm font-bold text-primary hover:text-primary/80 transition-colors flex items-center justify-center gap-1 rounded-xl border-2 border-dashed border-primary/30 hover:border-primary hover:bg-primary/5">
                    Explore more courses
                    <ChevronRight className="h-4 w-4" strokeWidth={2.5} />
                </button>
            </div>
        </div>
    )
}
