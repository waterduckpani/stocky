"use client"

import {
    Home,
    Compass,
    BookOpen,
    Trophy,
    Settings
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/contexts/AuthContext"
import { usePathname } from "next/navigation"
import Link from "next/link"

const navigation = [
    {
        name: "Dashboard",
        icon: Home,
        href: "/",
        colorClass: "bg-violet-100 text-violet-600",
        activeClass: "bg-violet-500 text-white"
    },
    {
        name: "Explore",
        icon: Compass,
        href: "/explore",
        colorClass: "bg-amber-100 text-amber-600",
        activeClass: "bg-amber-500 text-white"
    },
    {
        name: "Courses",
        icon: BookOpen,
        href: "/courses",
        colorClass: "bg-[#729bf4]/20 text-[#729bf4]",
        activeClass: "bg-[#729bf4] text-white"
    },
    {
        name: "Leaderboard",
        icon: Trophy,
        href: "/leaderboard",
        colorClass: "bg-emerald-100 text-emerald-600",
        activeClass: "bg-emerald-500 text-white"
    },
]

export function Sidebar() {
    const { user, isLoading } = useAuth()
    const pathname = usePathname()

    // Show nothing while loading - this is now instant since context loads at app level
    if (isLoading || !user) return null

    // Determine active nav item based on pathname
    const isActive = (href: string) => {
        if (href === "/") return pathname === "/"
        return pathname.startsWith(href)
    }

    return (
        <aside className="hidden lg:flex lg:flex-col lg:w-72 lg:fixed lg:inset-y-0 lg:border-r-2 lg:border-foreground/10 lg:bg-card z-50">
            {/* Logo */}
            <div className="flex items-center gap-3 px-6 h-16 border-b-2 border-foreground/10 shrink-0">
                <Link href="/" className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-[#3BB273] border-2 border-foreground shadow-pop flex items-center justify-center">
                        <span className="text-white font-bold text-lg">S</span>
                    </div>
                    <span className="font-bold text-foreground text-xl" style={{ fontFamily: 'var(--font-heading)' }}>Stocky</span>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                {navigation.map((item) => {
                    const active = isActive(item.href)
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-bounce border-2",
                                active
                                    ? "bg-primary text-primary-foreground border-foreground shadow-pop"
                                    : "text-foreground border-transparent hover:border-foreground/20 hover:bg-muted"
                            )}
                        >
                            <div className={cn(
                                "h-10 w-10 rounded-full flex items-center justify-center transition-colors",
                                active ? "bg-white/20 text-white" : item.colorClass
                            )}>
                                <item.icon className="h-5 w-5" strokeWidth={2.5} />
                            </div>
                            {item.name}
                        </Link>
                    )
                })}
            </nav>

            {/* User Profile */}
            <div className="p-4 border-t-2 border-foreground/10">
                <div className="flex items-center gap-3 p-3 rounded-xl border-2 border-foreground/10 bg-muted/50 transition-bounce hover:border-foreground/30">
                    <Avatar className="h-11 w-11 border-2 border-foreground shadow-pop">
                        <AvatarImage src={user.avatarUrl || "/placeholder.svg"} alt={user.name} />
                        <AvatarFallback className="bg-tertiary text-tertiary-foreground font-bold">
                            {user.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-foreground truncate">{user.name}</p>
                        <p className="text-xs text-muted-foreground font-medium truncate">{user.username}</p>
                    </div>
                    <Link
                        href="/settings"
                        className="p-2 rounded-lg border-2 border-transparent hover:border-foreground/20 hover:bg-quaternary transition-bounce"
                        aria-label="Settings"
                    >
                        <Settings className="h-5 w-5" strokeWidth={2.5} />
                    </Link>
                </div>
            </div>
        </aside>
    )
}
