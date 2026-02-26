"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Search, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { navigation } from "./Sidebar"
import { StockSearch } from "./StockSearch"
import { Button } from "@/components/ui/button"

interface MobileNavProps {
    popularStocks: any[]
}

export function MobileNav({ popularStocks }: MobileNavProps) {
    const pathname = usePathname()
    const [isSearchOpen, setIsSearchOpen] = useState(false)

    const isActive = (href: string) => {
        if (href === "/") return pathname === "/"
        return pathname.startsWith(href)
    }

    // Split navigation into two halves (first 2, last 2)
    const midPoint = Math.ceil(navigation.length / 2)
    const leftNav = navigation.slice(0, midPoint)
    const rightNav = navigation.slice(midPoint)

    return (
        <>
            {/* Bottom Navigation Bar */}
            <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden border-t-2 border-foreground/10 bg-background/95 backdrop-blur-md shadow-[0_-4px_20px_rgba(0,0,0,0.05)]" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
                <div className="flex items-center justify-between px-6 py-3">
                    <div className="grid grid-cols-5 gap-1 w-full max-w-md mx-auto">
                        {/* First 2 Nav Items */}
                        {leftNav.map((item) => {
                            const active = isActive(item.href)
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center justify-center p-2 rounded-xl transition-all duration-300",
                                        active
                                            ? "bg-primary text-primary-foreground shadow-pop scale-105"
                                            : "text-muted-foreground hover:bg-muted"
                                    )}
                                >
                                    <item.icon className="h-6 w-6" strokeWidth={2.5} />
                                    <span className="sr-only">{item.name}</span>
                                </Link>
                            )
                        })}

                        {/* Center Search Button */}
                        <div className="flex items-center justify-center">
                            <button
                                onClick={() => setIsSearchOpen(true)}
                                className={cn(
                                    "flex items-center justify-center p-2 rounded-xl transition-all duration-300 w-full h-full",
                                    isSearchOpen
                                        ? "bg-primary text-primary-foreground shadow-pop scale-105"
                                        : "text-muted-foreground hover:bg-muted"
                                )}
                            >
                                <Search className="h-6 w-6" strokeWidth={2.5} />
                                <span className="sr-only">Search</span>
                            </button>
                        </div>

                        {/* Last 2 Nav Items */}
                        {rightNav.map((item) => {
                            const active = isActive(item.href)
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center justify-center p-2 rounded-xl transition-all duration-300",
                                        active
                                            ? "bg-primary text-primary-foreground shadow-pop scale-105"
                                            : "text-muted-foreground hover:bg-muted"
                                    )}
                                >
                                    <item.icon className="h-6 w-6" strokeWidth={2.5} />
                                    <span className="sr-only">{item.name}</span>
                                </Link>
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* Popup Search Overlay */}
            {isSearchOpen && (
                <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 pb-24 sm:pb-4">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-background/60 backdrop-blur-sm animate-in fade-in duration-200"
                        onClick={() => setIsSearchOpen(false)}
                    />

                    {/* Search Popup */}
                    <div className="relative w-full max-w-lg bg-background border-2 border-foreground/10 shadow-[0_8px_30px_rgba(0,0,0,0.12)] rounded-3xl animate-in slide-in-from-bottom-10 zoom-in-95 duration-300 overflow-hidden">
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b-2 border-foreground/10 bg-background/50">
                            <span className="text-lg font-bold" style={{ fontFamily: 'var(--font-heading)' }}>Search</span>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsSearchOpen(false)}
                                className="h-8 w-8 rounded-full hover:bg-muted"
                            >
                                <X className="h-5 w-5" />
                            </Button>
                        </div>

                        {/* Search Content */}
                        <div className="p-6">
                            <StockSearch
                                popularStocks={popularStocks}
                                autoFocus={true}
                                className="max-w-full"
                                resultsVariant="inline"
                                onStockSelect={(symbol) => {
                                    setIsSearchOpen(false)
                                    // Navigation handled by StockSearch internal logic or parent if we passed a handler
                                    // Here we just want to close the popup first
                                    // But StockSearch has its own router.push, so we just close
                                }}
                            />


                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
