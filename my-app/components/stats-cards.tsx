"use client"

import { Flame, Target, BookOpen, Award } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const stats = [
  {
    icon: Flame,
    label: "Day Streak",
    value: "12",
    sublabel: "days",
    color: "text-orange-500"
  },
  {
    icon: Target,
    label: "Quiz Score",
    value: "89%",
    sublabel: "avg",
    color: "text-accent"
  },
  {
    icon: BookOpen,
    label: "Courses",
    value: "7",
    sublabel: "completed",
    color: "text-blue-500"
  },
  {
    icon: Award,
    label: "Total XP",
    value: "4,850",
    sublabel: "points",
    color: "text-amber-500"
  }
]

export function StatsCards() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">{stat.label}</p>
                <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.sublabel}</p>
              </div>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
