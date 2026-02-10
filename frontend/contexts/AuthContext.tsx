"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { supabase } from "@/utils/supabase/client"
import { User } from "@supabase/supabase-js"

interface UserData {
    id: string
    name: string
    username: string
    avatarUrl?: string
    weeklyGoal?: number
}

interface AuthContextType {
    user: UserData | null
    rawUser: User | null
    isLoading: boolean
    refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    rawUser: null,
    isLoading: true,
    refreshUser: async () => { }
})

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<UserData | null>(null)
    const [rawUser, setRawUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    const fetchUser = async () => {
        try {
            const { data: { user: authUser } } = await supabase.auth.getUser()

            if (authUser?.user_metadata?.username) {
                setRawUser(authUser)
                setUser({
                    id: authUser.id,
                    name: authUser.user_metadata.full_name || "User",
                    username: `@${authUser.user_metadata.username}`,
                    avatarUrl: authUser.user_metadata.avatar_url,
                    weeklyGoal: authUser.user_metadata.weekly_goal
                })
            } else {
                setUser(null)
                setRawUser(authUser)
            }
        } catch (error) {
            console.error("Error fetching user:", error)
            setUser(null)
            setRawUser(null)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        // Fetch user on mount
        fetchUser()

        // Listen for auth state changes (login, logout, token refresh)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                const authUser = session.user
                if (authUser.user_metadata?.username) {
                    setRawUser(authUser)
                    setUser({
                        id: authUser.id,
                        name: authUser.user_metadata.full_name || "User",
                        username: `@${authUser.user_metadata.username}`,
                        avatarUrl: authUser.user_metadata.avatar_url,
                        weeklyGoal: authUser.user_metadata.weekly_goal
                    })
                } else {
                    setUser(null)
                    setRawUser(authUser)
                }
            } else {
                setUser(null)
                setRawUser(null)
            }
            setIsLoading(false)
        })

        return () => subscription.unsubscribe()
    }, [])

    return (
        <AuthContext.Provider value={{ user, rawUser, isLoading, refreshUser: fetchUser }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}
