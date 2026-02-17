"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, KeyRound, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

export default function ResetPasswordPage() {
    const [password, setPassword] = React.useState("")
    const [confirmPassword, setConfirmPassword] = React.useState("")
    const [isLoading, setIsLoading] = React.useState(false)
    const [errorMsg, setErrorMsg] = React.useState<string | null>(null)
    const [successMsg, setSuccessMsg] = React.useState<string | null>(null)
    const router = useRouter()

    React.useEffect(() => {
        // Listen for auth state changes, specifically PASSWORD_RECOVERY
        const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === "PASSWORD_RECOVERY") {
                // User is signed in with a recovery session. They can update their password now.
                console.log("Recovery session established")
            }
        })

        return () => {
            authListener.subscription.unsubscribe()
        }
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setErrorMsg(null)
        setIsLoading(true)

        if (password !== confirmPassword) {
            setErrorMsg("Passwords do not match")
            setIsLoading(false)
            return
        }

        if (password.length < 8) {
            setErrorMsg("Password must be at least 8 characters")
            setIsLoading(false)
            return
        }

        const { error } = await supabase.auth.updateUser({
            password: password
        })

        if (error) {
            setErrorMsg(error.message)
            setIsLoading(false)
        } else {
            setSuccessMsg("Password updated successfully!")
            setIsLoading(false)
            setTimeout(() => {
                router.push("/login")
            }, 2000)
        }
    }

    const cardClasses = cn(
        "w-full max-w-md relative z-10 border-2 border-foreground bg-card rounded-xl overflow-hidden",
        "transition-all duration-200 ease-out",
        "shadow-[8px_8px_0px_0px_#1E293B]"
    )

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary/40 to-secondary/40 relative overflow-hidden flex flex-col items-center justify-center p-4">
            {/* Branding */}
            <div className="absolute top-8 left-8 z-20">
                <h2 className="font-heading text-3xl font-bold text-primary tracking-tight">STOCKY</h2>
            </div>

            {/* Background Elements */}
            <div className="absolute inset-0 z-0 opacity-[0.4]" style={{ backgroundImage: 'radial-gradient(#CBD5E1 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 rounded-full bg-primary/20 blur-3xl animate-pulse" />
            <div className="absolute bottom-[-5%] right-[-5%] w-[30rem] h-[30rem] bg-secondary/20 blur-3xl rotate-45 rounded-[3rem] animate-pulse delay-700" />

            <div className={cardClasses}>
                <div className="p-6 pb-12">
                    <div className="flex flex-col space-y-1.5 pt-6 pb-6 text-center">
                        <div className="mx-auto bg-primary/10 p-4 rounded-full mb-4 w-fit">
                            <KeyRound className="h-8 w-8 text-primary" />
                        </div>
                        <h3 className="font-heading text-2xl text-foreground font-bold">Set New Password</h3>
                        <p className="font-sans text-base text-muted-foreground">Secure your account with a fresh password.</p>
                    </div>

                    {errorMsg && (
                        <div className="mb-4 bg-destructive/15 text-destructive text-sm font-bold px-4 py-3 rounded-md border-2 border-destructive/20 text-center animate-shake">
                            {errorMsg}
                        </div>
                    )}

                    {successMsg && (
                        <div className="mb-4 bg-green-100 text-green-700 text-sm font-bold px-4 py-3 rounded-md border-2 border-green-200 text-center animate-pulse">
                            {successMsg}
                        </div>
                    )}

                    {!successMsg && (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-bold font-heading ml-1 text-foreground">New Password</label>
                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    className="h-11 border-2 border-slate-400 shadow-none focus-visible:ring-0 focus-visible:border-primary focus-visible:shadow-none font-sans"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={isLoading}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold font-heading ml-1 text-foreground">Confirm Password</label>
                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    className="h-11 border-2 border-slate-400 shadow-none focus-visible:ring-0 focus-visible:border-primary focus-visible:shadow-none font-sans"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    disabled={isLoading}
                                    required
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-12 text-base font-bold font-heading bg-primary text-primary-foreground border-foreground shadow-pop hover:translate-y-0.5 hover:shadow-none transition-all mt-6 border-0 ring-0"
                                disabled={isLoading}
                            >
                                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Update Password"}
                            </Button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    )
}
