"use client"

import { Trophy, Medal, Flame, Crown } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const leaderboardData = [
  { rank: 1, name: "Alex Chen", xp: 12450, streak: 42, initials: "AC" },
  { rank: 2, name: "Sarah Miller", xp: 11200, streak: 38, initials: "SM" },
  { rank: 3, name: "James Wilson", xp: 10890, streak: 31, initials: "JW" },
  { rank: 4, name: "Emily Davis", xp: 9750, streak: 28, initials: "ED" },
  { rank: 5, name: "Michael Brown", xp: 9200, streak: 25, initials: "MB" },
]

const currentUser = { rank: 24, name: "You", xp: 4850, streak: 12, initials: "YU" }

export function Leaderboard() {
  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return { bg: "bg-tertiary", border: "border-foreground", shadow: "shadow-pop-yellow", text: "text-tertiary-foreground" }
      case 2:
        return { bg: "bg-muted", border: "border-foreground", shadow: "shadow-pop", text: "text-foreground" }
      case 3:
        return { bg: "bg-secondary", border: "border-foreground", shadow: "shadow-pop-pink", text: "text-secondary-foreground" }
      default:
        return { bg: "bg-muted", border: "border-foreground/30", shadow: "", text: "text-muted-foreground" }
    }
  }

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-4 w-4" strokeWidth={2.5} />
    if (rank <= 3) return <Medal className="h-4 w-4" strokeWidth={2.5} />
    return rank
  }

  return (
    <div className="rounded-2xl border-2 border-foreground bg-card shadow-soft overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b-2 border-foreground/10 flex items-center justify-between bg-quaternary/10">
        <h3 className="text-lg font-bold flex items-center gap-2 text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>
          <div className="h-8 w-8 rounded-lg bg-quaternary border-2 border-foreground flex items-center justify-center">
            <Trophy className="h-4 w-4 text-quaternary-foreground" strokeWidth={2.5} />
          </div>
          Leaderboard
        </h3>
        <span className="text-xs font-bold text-muted-foreground bg-muted px-3 py-1 rounded-full border border-foreground/20">This Week</span>
      </div>

      {/* Content */}
      <div className="p-4 space-y-2">
        {leaderboardData.map((user) => {
          const style = getRankStyle(user.rank)
          return (
            <div
              key={user.rank}
              className={`flex items-center gap-3 p-3 rounded-xl transition-bounce ${
                user.rank <= 3 ? "border-2 border-foreground/10 bg-muted/30" : ""
              }`}
            >
              <div className={`h-9 w-9 rounded-lg flex items-center justify-center text-sm font-bold border-2 ${style.bg} ${style.border} ${style.shadow} ${style.text}`}>
                {getRankIcon(user.rank)}
              </div>
              
              <Avatar className="h-10 w-10 border-2 border-foreground">
                <AvatarFallback className="bg-primary text-primary-foreground text-sm font-bold">
                  {user.initials}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <p className="font-bold text-foreground truncate">{user.name}</p>
                <p className="text-xs text-muted-foreground font-medium">{user.xp.toLocaleString()} XP</p>
              </div>
              
              <div className="flex items-center gap-1 text-sm font-bold text-tertiary bg-tertiary/10 px-2 py-1 rounded-full">
                <Flame className="h-4 w-4" strokeWidth={2.5} />
                {user.streak}
              </div>
            </div>
          )
        })}
        
        {/* Divider */}
        <div className="border-t-2 border-dashed border-foreground/20 my-3" />
        
        {/* Current User */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-primary/10 border-2 border-primary shadow-pop-violet">
          <div className="h-9 w-9 rounded-lg flex items-center justify-center text-sm font-bold bg-primary text-primary-foreground border-2 border-foreground">
            {currentUser.rank}
          </div>
          
          <Avatar className="h-10 w-10 border-2 border-primary">
            <AvatarFallback className="bg-primary text-primary-foreground text-sm font-bold">
              {currentUser.initials}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <p className="font-bold text-foreground">{currentUser.name}</p>
            <p className="text-xs text-muted-foreground font-medium">{currentUser.xp.toLocaleString()} XP</p>
          </div>
          
          <div className="flex items-center gap-1 text-sm font-bold text-primary bg-primary/20 px-2 py-1 rounded-full border border-primary/30">
            <Flame className="h-4 w-4" strokeWidth={2.5} />
            {currentUser.streak}
          </div>
        </div>
      </div>
    </div>
  )
}
