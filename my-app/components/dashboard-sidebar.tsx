"use client"

import { 
  Home, 
  Search, 
  BookOpen, 
  Trophy, 
  Settings
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const navigation = [
  { name: "Dashboard", icon: Home, href: "#", active: true, color: "bg-primary" },
  { name: "Explore", icon: Search, href: "#", active: false, color: "bg-tertiary" },
  { name: "Courses", icon: BookOpen, href: "#", active: false, color: "bg-secondary" },
  { name: "Leaderboard", icon: Trophy, href: "#", active: false, color: "bg-quaternary" },
]

const user = {
  name: "Alex Chen",
  username: "@alexchen",
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
}

export function DashboardSidebar() {
  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-72 lg:fixed lg:inset-y-0 lg:border-r-2 lg:border-foreground/10 lg:bg-card">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 h-16 border-b-2 border-foreground/10">
        <div className="h-10 w-10 rounded-xl bg-primary border-2 border-foreground shadow-pop flex items-center justify-center">
          <span className="text-primary-foreground font-bold text-lg">M</span>
        </div>
        <span className="font-bold text-foreground text-xl" style={{ fontFamily: 'var(--font-heading)' }}>MarketMind</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => (
          <a
            key={item.name}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-bounce border-2",
              item.active
                ? "bg-primary text-primary-foreground border-foreground shadow-pop"
                : "text-foreground border-transparent hover:border-foreground/20 hover:bg-muted"
            )}
          >
            <div className={cn(
              "h-8 w-8 rounded-lg flex items-center justify-center",
              item.active ? "bg-primary-foreground/20" : item.color + "/20"
            )}>
              <item.icon className="h-4 w-4" strokeWidth={2.5} />
            </div>
            {item.name}
          </a>
        ))}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t-2 border-foreground/10">
        <div className="flex items-center gap-3 p-3 rounded-xl border-2 border-foreground/10 bg-muted/50 transition-bounce hover:border-foreground/30">
          <Avatar className="h-11 w-11 border-2 border-foreground shadow-pop">
            <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
            <AvatarFallback className="bg-tertiary text-tertiary-foreground font-bold">
              {user.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-foreground truncate">{user.name}</p>
            <p className="text-xs text-muted-foreground font-medium truncate">{user.username}</p>
          </div>
          <a 
            href="#settings" 
            className="p-2 rounded-lg border-2 border-transparent hover:border-foreground/20 hover:bg-quaternary transition-bounce"
            aria-label="Settings"
          >
            <Settings className="h-5 w-5" strokeWidth={2.5} />
          </a>
        </div>
      </div>
    </aside>
  )
}
