"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/utils/supabase/client"
import { Bell, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { StockSearch } from "@/components/dashboard/StockSearch"
import { DailyQuiz } from "@/components/dashboard/DailyQuiz"
import { CourseList } from "@/components/dashboard/CourseList"
import { Leaderboard } from "@/components/dashboard/Leaderboard"
import { MarketOverview } from "@/components/dashboard/MarketOverview"
import { Sidebar } from "@/components/dashboard/Sidebar"
import { StatsCards } from "@/components/dashboard/StatsCards"
import { getStreakData } from "@/lib/streaks"
import { useAuth } from "@/contexts/AuthContext"

export default function Dashboard() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [streakData, setStreakData] = useState<{ totalStreak: number; weeklyGoal: number; weeklyProgress: number } | undefined>(undefined)
  const [popularStocks, setPopularStocks] = useState<any[]>([])
  const [isLoadingPopular, setIsLoadingPopular] = useState(true)

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
    }
  }, [isLoading, user, router])

  // Fetch streak data and popular stocks once user is available
  useEffect(() => {
    if (user) {
      getStreakData().then(setStreakData)

      // Fetch popular stocks for Ticker and Search
      setIsLoadingPopular(true)
      fetch("http://localhost:8000/api/popular")
        .then(res => res.json())
        .then(data => setPopularStocks(data.stocks || []))
        .catch(err => console.error("Error fetching popular stocks:", err))
        .finally(() => setIsLoadingPopular(false))
    }
  }, [user])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  // Show nothing while loading auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  // Don't render if no user (will redirect)
  if (!user) return null

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
            onClick={() => setShowLogoutModal(false)}
          />
          {/* Modal Card - Playful Geometry */}
          <div className="relative bg-card border-2 border-foreground rounded-xl shadow-pop p-6 max-w-sm w-full mx-4">
            <div className="text-center">
              {/* Icon with playful border */}
              <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-destructive/10 border-2 border-destructive shadow-pop flex items-center justify-center">
                <LogOut className="h-8 w-8 text-destructive" />
              </div>
              <h3 className="font-heading text-2xl font-bold text-foreground mb-2">Log out?</h3>
              <p className="text-muted-foreground text-sm mb-6">Are you sure you want to log out of your account?</p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 h-11 font-bold font-heading bg-muted border-0 shadow-pop hover:translate-y-0.5 hover:shadow-none transition-bounce"
                  onClick={() => setShowLogoutModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 h-11 font-bold font-heading bg-destructive text-destructive-foreground border-0 shadow-pop hover:translate-y-0.5 hover:shadow-none transition-bounce"
                  onClick={handleLogout}
                >
                  Log out
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Background Decorations */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-tertiary/20 blur-3xl" />
        <div className="absolute top-1/3 right-20 w-48 h-48 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-40 h-40 rounded-full bg-secondary/10 blur-3xl" />
      </div>

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="lg:pl-72 relative">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-card/90 backdrop-blur-sm border-b-2 border-foreground/10">
          <div className="px-4 sm:px-6 lg:px-8 relative">
            <div className="flex items-center justify-center h-16">
              {/* Mobile Logo (Absolute Left) */}
              <div className="absolute left-4 sm:left-6 lg:hidden flex items-center gap-2">
                <div className="h-10 w-10 rounded-xl bg-primary border-2 border-foreground shadow-pop flex items-center justify-center transition-bounce hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-pop-hover">
                  <span className="text-primary-foreground font-bold text-lg">S</span>
                </div>
                <span className="font-bold text-foreground text-xl" style={{ fontFamily: 'var(--font-heading)' }}>Stocky</span>
              </div>

              {/* Search Bar (Centered) */}
              <div className="hidden sm:block w-full max-w-lg mx-auto">
                <StockSearch popularStocks={popularStocks} isLoading={isLoadingPopular} />
              </div>

              {/* Right Icons (Absolute Right) */}
              <div className="absolute right-4 sm:right-6 lg:right-8 flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  className="border-2 border-foreground/20 hover:border-foreground hover:bg-tertiary transition-bounce rounded-full bg-transparent"
                >
                  <Bell className="h-5 w-5" strokeWidth={2.5} />
                  <span className="sr-only">Notifications</span>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowLogoutModal(true)}
                  className="border-2 border-foreground/20 hover:border-foreground hover:bg-destructive hover:text-destructive-foreground transition-bounce rounded-full bg-transparent"
                >
                  <LogOut className="h-5 w-5" strokeWidth={2.5} />
                  <span className="sr-only">Logout</span>
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Market Ticker */}
        <div className="border-b-2 border-foreground/10 bg-card/50">
          <div className="px-4 sm:px-6 lg:px-8 py-3">
            <MarketOverview stocks={popularStocks} isLoading={isLoadingPopular} />
          </div>
        </div>

        {/* Main Content */}
        <main className="px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome */}
          <section className="mb-8">
            <h2 className="text-3xl font-extrabold text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>
              Good morning
            </h2>
            <p className="text-muted-foreground mt-2 text-lg">Ready to learn something new today?</p>
          </section>

          {/* Stats Cards */}
          <section className="mb-8">
            <StatsCards streakData={streakData} />
          </section>

          {/* Main Grid */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column - Learning */}
            <div className="lg:col-span-2 space-y-6">
              <CourseList />
              <DailyQuiz />
            </div>

            {/* Right Column - Leaderboard */}
            <div className="space-y-6">
              <Leaderboard />
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t-2 border-foreground/10 mt-12 bg-card/30">
          <div className="px-4 sm:px-6 lg:px-8 py-6">
            <p className="text-center text-sm text-muted-foreground font-medium">
              Learn smarter, invest better
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}
