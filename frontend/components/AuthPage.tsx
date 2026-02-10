"use client"

import * as React from "react"
import { Sparkles, ArrowRight, LogIn, Loader2, User, Camera, ArrowLeft, Mail, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { supabase } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

export default function AuthPage() {
    // Mode: 'login' (default) vs 'signup' (wizard)
    const [authMode, setAuthMode] = React.useState<'login' | 'signup'>('login')

    // Signup Wizard State
    // 0: Method Selection (Email vs Google)
    // 1: Email Form (Email/Pass/Confirm)
    // 2: Names (First/Last)
    // 3: Profile (Username/Avatar)
    // 4: Weekly Goal Selection
    const [signupStep, setSignupStep] = React.useState(0)

    const [isLoading, setIsLoading] = React.useState(false)
    const [errorMsg, setErrorMsg] = React.useState<React.ReactNode>(null)
    const [showGoogleHint, setShowGoogleHint] = React.useState(false)

    // Data
    const [formData, setFormData] = React.useState({
        email: "",
        password: "",
        confirmPassword: "",
        firstName: "",
        lastName: "",
        username: "",
        avatarUrl: "",
        weeklyGoal: 5  // Default to 5 days/week
    })

    const router = useRouter()

    // Resume Google Signup Flow if needed
    React.useEffect(() => {
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (session?.user) {
                // If user has username, they are done -> Redirect
                if (session.user.user_metadata?.username) {
                    router.push('/')
                    return
                }

                // If user MISSING username, they are in incomplete signup state
                // Prefill details from Google
                const { user } = session
                const fullName = user.user_metadata?.full_name || ""
                const [first, ...rest] = fullName.split(" ")
                const last = rest.join(" ")

                setFormData(prev => ({
                    ...prev,
                    email: user.email || "",
                    firstName: prev.firstName || first || "",
                    lastName: prev.lastName || last || ""
                }))

                // Switch to Signup - Step 2 (Names)
                setAuthMode('signup')
                setSignupStep(2)
            }
        }
        checkSession()
    }, [router])

    const toggleMode = () => {
        setAuthMode(prev => prev === 'login' ? 'signup' : 'login')
        setSignupStep(0)
        setErrorMsg(null)
        setShowGoogleHint(false)
    }

    const updateForm = (key: string, value: string) => {
        setFormData(prev => ({ ...prev, [key]: value }))
        setErrorMsg(null)
        setShowGoogleHint(false)
    }

    const validatePassword = (pass: string) => {
        if (pass.length < 8) return "Password must be at least 8 characters."
        if (!/[0-9]/.test(pass)) return "Password must contain at least one number."
        if (!/[!@#$%^&*]/.test(pass)) return "Password must contain at least one special character (!@#$%^&*)."
        return null
    }

    // --- HANDLERS ---

    const handleGoogleAuth = async () => {
        setIsLoading(true)
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/`,
            }
        })
        if (error) {
            setErrorMsg(error.message)
            setIsLoading(false)
        }
    }

    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setErrorMsg(null)
        setIsLoading(true)

        const { error } = await supabase.auth.signInWithPassword({
            email: formData.email,
            password: formData.password,
        })

        if (error) {
            // Check if this email might be linked to a Google account
            if (error.message === "Invalid login credentials") {
                setErrorMsg("Invalid credentials. Signed up with Google?")
                setShowGoogleHint(true)
            } else {
                setErrorMsg(error.message)
                setShowGoogleHint(false)
            }
            setIsLoading(false)
        } else {
            router.push('/')
            router.refresh()
        }
    }

    // Signup Step 1: Email/Password Validation
    const handleSignupEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setErrorMsg(null)

        if (!formData.email || !formData.password || !formData.confirmPassword) {
            setErrorMsg("Please fill in all fields.")
            return
        }
        if (formData.password !== formData.confirmPassword) {
            setErrorMsg("Passwords do not match.")
            return
        }

        const passError = validatePassword(formData.password)
        if (passError) {
            setErrorMsg(passError)
            return
        }

        // Smart Check: Try logging in to see if user exists
        setIsLoading(true)
        const { error: loginError } = await supabase.auth.signInWithPassword({
            email: formData.email,
            password: formData.password,
        })

        if (!loginError) {
            // Success -> User exists -> Login
            router.push('/')
            router.refresh()
            return
        }

        // Login failed -> Proceed as new signup
        setIsLoading(false)
        setSignupStep(2)
    }

    // Signup Step 2: Names
    const handleSignupNamesSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.firstName || !formData.lastName) {
            setErrorMsg("Please enter your full name.")
            return
        }
        setSignupStep(3)
    }

    // Signup Step 4: Finalize (Atomic Create/Update)
    const handleFinalSignup = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        if (!formData.username) {
            setErrorMsg("Please choose a username.")
            setIsLoading(false)
            return
        }

        // Check if we are updating an existing session (Google flow) or creating new (Email flow)
        const { data: { session } } = await supabase.auth.getSession()

        if (session) {
            // Update existing user (Google Flow)
            const { error } = await supabase.auth.updateUser({
                data: {
                    first_name: formData.firstName,
                    last_name: formData.lastName,
                    username: formData.username,
                    full_name: `${formData.firstName} ${formData.lastName}`,
                    avatar_url: formData.avatarUrl || session.user.user_metadata?.avatar_url,
                    weekly_goal: formData.weeklyGoal
                }
            })
            if (error) {
                setErrorMsg(error.message)
                setIsLoading(false)
            } else {
                router.push('/')
                router.refresh()
            }
        } else {
            // Create new user (Email Flow)
            const { data, error } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    data: {
                        first_name: formData.firstName,
                        last_name: formData.lastName,
                        username: formData.username,
                        full_name: `${formData.firstName} ${formData.lastName}`,
                        avatar_url: formData.avatarUrl,
                        weekly_goal: formData.weeklyGoal
                    }
                }
            })

            if (error) {
                setErrorMsg(error.message)
                setIsLoading(false)
            } else if (data.session) {
                router.push('/')
                router.refresh()
            } else {
                alert("Account created! Check your email to confirm.")
                setIsLoading(false)
            }
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

            {/* Background */}
            <div className="absolute inset-0 z-0 opacity-[0.4]" style={{ backgroundImage: 'radial-gradient(#CBD5E1 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 rounded-full bg-primary/20 blur-3xl animate-pulse" />
            <div className="absolute bottom-[-5%] right-[-5%] w-[30rem] h-[30rem] bg-secondary/20 blur-3xl rotate-45 rounded-[3rem] animate-pulse delay-700" />
            <div className="absolute top-[20%] right-[15%] w-32 h-32 rounded-full bg-tertiary/20 blur-2xl" />

            <div className={cardClasses}>
                <motion.div
                    animate={{ height: "auto" }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                >
                    <div className="p-6 pb-12">
                        <AnimatePresence mode="wait" initial={false}>

                            {/* --- LOGIN MODE --- */}
                            {authMode === 'login' && (
                                <motion.div
                                    key="login"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <div className="flex flex-col space-y-1.5 pt-6 pb-6 text-center">
                                        <h3 className="font-heading text-3xl text-foreground font-semibold leading-none tracking-tight">Welcome Back!</h3>
                                        <p className="font-sans text-base text-muted-foreground">Ready to level up your financial skills?</p>
                                    </div>

                                    {errorMsg && (
                                        <div className="mb-4 bg-destructive/15 text-destructive text-sm font-bold px-4 py-3 rounded-md border-2 border-destructive/20 text-center">
                                            {errorMsg}
                                            {showGoogleHint && (
                                                <button
                                                    type="button"
                                                    onClick={handleGoogleAuth}
                                                    className="block w-full mt-2 text-primary font-bold underline hover:text-secondary transition-colors"
                                                >
                                                    → Use Google Login
                                                </button>
                                            )}
                                        </div>
                                    )}

                                    <Button
                                        variant="outline"
                                        className="w-full h-12 text-base font-bold font-heading bg-white text-foreground border-2 border-foreground shadow-pop hover:translate-y-0.5 hover:shadow-none transition-all mb-6"
                                        onClick={handleGoogleAuth}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <svg className="mr-2 h-5 w-5" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" /></svg>}
                                        Continue with Google
                                    </Button>

                                    <div className="relative mb-6">
                                        <div className="absolute inset-0 flex items-center"><span className="w-full border-t-2 border-dashed border-muted-foreground/20" /></div>
                                        <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground font-bold">Or</span></div>
                                    </div>

                                    <form className="space-y-4" onSubmit={handleLoginSubmit}>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold font-heading ml-1 text-foreground">Email Address</label>
                                            <Input type="email" placeholder="u.warren@berkshire.com" className="h-11 border-2 border-slate-400 shadow-none focus-visible:ring-0 focus-visible:border-primary focus-visible:shadow-none font-sans" value={formData.email} onChange={(e) => updateForm('email', e.target.value)} disabled={isLoading} required />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold font-heading ml-1 text-foreground">Password</label>
                                            <Input type="password" placeholder="••••••••" className="h-11 border-2 border-slate-400 shadow-none focus-visible:ring-0 focus-visible:border-primary focus-visible:shadow-none font-sans" value={formData.password} onChange={(e) => updateForm('password', e.target.value)} disabled={isLoading} required />
                                        </div>
                                        <Button className="w-full h-12 text-base font-bold font-heading bg-primary text-primary-foreground border-foreground shadow-pop hover:translate-y-0.5 hover:shadow-none transition-all mt-6 border-0 ring-0" size="lg" disabled={isLoading} type="submit">
                                            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <><LogIn className="mr-2 h-5 w-5" /> Login</>}
                                        </Button>
                                    </form>

                                    <div className="flex items-center pt-8 justify-center">
                                        <p className="text-sm text-muted-foreground font-sans">
                                            Don't have an account? <button onClick={(e) => { e.stopPropagation(); toggleMode(); }} className="text-primary font-bold hover:text-secondary hover:underline transition-colors">Sign up</button>
                                        </p>
                                    </div>
                                </motion.div>
                            )}

                            {/* --- SIGNUP MODE --- */}
                            {authMode === 'signup' && (
                                <>
                                    {/* STEP 0: METHOD SELECTION */}
                                    {signupStep === 0 && (
                                        <motion.div
                                            key="signup-method"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <div className="flex flex-col space-y-1.5 pt-6 pb-6 text-center">
                                                <h3 className="font-heading text-3xl text-foreground font-semibold leading-none tracking-tight">Join the Club</h3>
                                                <p className="font-sans text-base text-muted-foreground">Start your journey to financial freedom.</p>
                                            </div>

                                            <div className="space-y-4">
                                                <Button
                                                    variant="outline"
                                                    className="w-full h-12 text-base font-bold font-heading bg-white text-foreground border-2 border-foreground shadow-pop hover:translate-y-0.5 hover:shadow-none transition-all"
                                                    onClick={handleGoogleAuth}
                                                >
                                                    <svg className="mr-2 h-5 w-5" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" /></svg>
                                                    Sign up with Google
                                                </Button>

                                                <div className="bg-card px-2 text-muted-foreground font-bold text-center text-xs uppercase py-2">Or</div>

                                                <Button
                                                    className="w-full h-12 text-base font-bold font-heading bg-secondary text-secondary-foreground border-2 border-foreground shadow-pop hover:translate-y-0.5 hover:shadow-none transition-all border-0 ring-0"
                                                    onClick={() => setSignupStep(1)}
                                                >
                                                    <Mail className="mr-2 h-5 w-5" /> Sign up with Email
                                                </Button>
                                            </div>

                                            <div className="flex items-center pt-8 justify-center">
                                                <p className="text-sm text-muted-foreground font-sans">
                                                    Already have an account? <button onClick={(e) => { e.stopPropagation(); toggleMode(); }} className="text-primary font-bold hover:text-secondary hover:underline transition-colors">Log in</button>
                                                </p>
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* STEP 1: EMAIL FORM */}
                                    {signupStep === 1 && (
                                        <motion.div
                                            key="signup-email"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <div className="text-center pt-6 pb-6">
                                                <h3 className="font-heading text-2xl text-foreground font-bold">Create Account</h3>
                                                <p className="text-muted-foreground text-sm mt-1">Let's set up your credentials.</p>
                                            </div>

                                            {errorMsg && <div className="mb-4 bg-destructive/15 text-destructive text-sm font-bold px-4 py-2 rounded-md border-2 border-destructive/20 text-center">{errorMsg}</div>}

                                            <form onSubmit={handleSignupEmailSubmit} className="space-y-4">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-bold font-heading ml-1 text-foreground">Email Address</label>
                                                    <Input type="email" placeholder="u.warren@berkshire.com" className="h-11 border-2 border-slate-400 shadow-none focus-visible:ring-0 focus-visible:border-primary focus-visible:shadow-none font-sans" value={formData.email} onChange={(e) => updateForm('email', e.target.value)} disabled={isLoading} required />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-bold font-heading ml-1 text-foreground">Password</label>
                                                    <Input type="password" placeholder="••••••••" className="h-11 border-2 border-slate-400 shadow-none focus-visible:ring-0 focus-visible:border-primary focus-visible:shadow-none font-sans" value={formData.password} onChange={(e) => updateForm('password', e.target.value)} disabled={isLoading} required />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-bold font-heading ml-1 text-foreground">Confirm Password</label>
                                                    <Input type="password" placeholder="••••••••" className="h-11 border-2 border-slate-400 shadow-none focus-visible:ring-0 focus-visible:border-primary focus-visible:shadow-none font-sans" value={formData.confirmPassword} onChange={(e) => updateForm('confirmPassword', e.target.value)} disabled={isLoading} required />
                                                </div>

                                                <div className="flex gap-3 pt-4">
                                                    <Button type="button" variant="outline" onClick={() => setSignupStep(0)} className="h-12 w-12 border-2 border-foreground shadow-pop hover:translate-y-0.5 hover:shadow-none transition-all bg-white"><ArrowLeft className="h-5 w-5" /></Button>
                                                    <Button type="submit" className="flex-1 h-12 text-base font-bold font-heading bg-primary text-primary-foreground border-foreground shadow-pop hover:translate-y-0.5 hover:shadow-none transition-all border-0 ring-0" disabled={isLoading}>
                                                        {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Next Step"}
                                                    </Button>
                                                </div>
                                            </form>
                                        </motion.div>
                                    )}

                                    {/* STEP 2: NAMES */}
                                    {signupStep === 2 && (
                                        <motion.div
                                            key="signup-names"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <div className="text-center pt-6 pb-8">
                                                <h3 className="font-heading text-2xl text-foreground font-bold">Who are you?</h3>
                                                <p className="text-muted-foreground text-sm mt-1">First things first.</p>
                                            </div>

                                            {errorMsg && <div className="mb-4 bg-destructive/15 text-destructive text-sm font-bold px-4 py-2 rounded-md border-2 border-destructive/20 text-center">{errorMsg}</div>}

                                            <form onSubmit={handleSignupNamesSubmit} className="space-y-4">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <label className="text-sm font-bold font-heading ml-1 text-foreground">First Name</label>
                                                        <Input placeholder="Buffett" className="h-11 border-2 border-slate-400 shadow-none focus-visible:ring-0 focus-visible:border-primary focus-visible:shadow-none font-sans" value={formData.firstName} onChange={(e) => updateForm('firstName', e.target.value)} autoFocus />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-sm font-bold font-heading ml-1 text-foreground">Last Name</label>
                                                        <Input placeholder="Warren" className="h-11 border-2 border-slate-400 shadow-none focus-visible:ring-0 focus-visible:border-primary focus-visible:shadow-none font-sans" value={formData.lastName} onChange={(e) => updateForm('lastName', e.target.value)} />
                                                    </div>
                                                </div>
                                                <div className="flex gap-3 pt-6">
                                                    {/* Allow back ONLY if came from email flow. If Google flow, back should probably logout or reset? For simplicity, we allow going back to 0 which resets everything. */}
                                                    <Button type="button" variant="outline" onClick={() => setSignupStep(0)} className="h-12 w-12 border-2 border-foreground shadow-pop hover:translate-y-0.5 hover:shadow-none transition-all bg-white"><ArrowLeft className="h-5 w-5" /></Button>
                                                    <Button type="submit" className="flex-1 h-12 text-base font-bold font-heading bg-primary text-primary-foreground border-foreground shadow-pop hover:translate-y-0.5 hover:shadow-none transition-all border-0 ring-0">Next Step <ArrowRight className="ml-2 h-5 w-5" /></Button>
                                                </div>
                                            </form>
                                        </motion.div>
                                    )}

                                    {/* STEP 3: PROFILE */}
                                    {signupStep === 3 && (
                                        <motion.div
                                            key="signup-profile"
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <div className="text-center pt-6 pb-6">
                                                <h3 className="font-heading text-2xl text-foreground font-bold">Your Profile</h3>
                                                <p className="text-muted-foreground text-sm mt-1">Add a photo and pick a username.</p>
                                            </div>

                                            <form onSubmit={(e) => { e.preventDefault(); if (formData.username) setSignupStep(4); else setErrorMsg("Please choose a username."); }} className="space-y-4 pt-2">

                                                {/* Avatar Upload */}
                                                <div className="flex justify-center mb-6">
                                                    <div className="relative group">
                                                        <div
                                                            className="w-24 h-24 rounded-full bg-muted border-2 border-foreground shadow-pop overflow-hidden cursor-pointer relative"
                                                            onClick={() => document.getElementById('avatar-upload')?.click()}
                                                        >
                                                            {formData.avatarUrl ? (
                                                                <img src={formData.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                                                    <User className="h-10 w-10" />
                                                                </div>
                                                            )}
                                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                                                                <Camera className="h-6 w-6" />
                                                            </div>
                                                        </div>
                                                        <input
                                                            id="avatar-upload"
                                                            type="file"
                                                            accept="image/*"
                                                            className="hidden"
                                                            onChange={async (e) => {
                                                                const file = e.target.files?.[0]
                                                                if (!file) return

                                                                setIsLoading(true)
                                                                try {
                                                                    const fileExt = file.name.split('.').pop()
                                                                    const fileName = `${Date.now()}.${fileExt}`
                                                                    const { error: uploadError } = await supabase.storage
                                                                        .from('avatars')
                                                                        .upload(fileName, file)

                                                                    if (uploadError) throw uploadError

                                                                    const { data: { publicUrl } } = supabase.storage
                                                                        .from('avatars')
                                                                        .getPublicUrl(fileName)

                                                                    setFormData(prev => ({ ...prev, avatarUrl: publicUrl }))
                                                                } catch (err: any) {
                                                                    setErrorMsg(err.message)
                                                                } finally {
                                                                    setIsLoading(false)
                                                                }
                                                            }}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <label htmlFor="username" className="text-sm font-bold font-heading ml-1 text-foreground">Username</label>
                                                    <Input
                                                        id="username"
                                                        type="text"
                                                        placeholder="@trader_joe"
                                                        value={formData.username}
                                                        onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                                                        required
                                                        className="h-11 border-2 border-slate-400 shadow-none focus-visible:ring-0 focus-visible:border-primary focus-visible:shadow-none font-sans"
                                                    />
                                                </div>

                                                {errorMsg && (
                                                    <div className="p-3 rounded-lg bg-destructive/15 text-destructive text-sm font-medium border border-destructive/20 flex items-center gap-2 animate-wiggle">
                                                        <AlertCircle className="h-4 w-4 shrink-0" />
                                                        {errorMsg}
                                                    </div>
                                                )}

                                                <div className="flex gap-3 pt-2">
                                                    <Button type="button" variant="outline" onClick={() => setSignupStep(2)} className="h-12 w-12 border-2 border-foreground shadow-pop hover:translate-y-0.5 hover:shadow-none transition-all bg-white"><ArrowLeft className="h-5 w-5" /></Button>
                                                    <Button type="submit" className="flex-1 h-12 text-base font-bold font-heading bg-primary text-primary-foreground border-foreground shadow-pop hover:translate-y-0.5 hover:shadow-none transition-all border-0 ring-0" disabled={isLoading}>
                                                        {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <>Next <ArrowRight className="ml-2 h-5 w-5" /></>}
                                                    </Button>
                                                </div>
                                            </form>
                                        </motion.div>
                                    )}

                                    {/* Step 4: Weekly Goal Selection */}
                                    {signupStep === 4 && (
                                        <motion.div
                                            key="step4"
                                            initial={{ x: 100, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            exit={{ x: -100, opacity: 0 }}
                                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                        >
                                            <div className="text-center pt-6 pb-6">
                                                <h3 className="font-heading text-2xl text-foreground font-bold">Set Your Goal 🎯</h3>
                                                <p className="text-muted-foreground text-sm mt-1">How many days per week do you want to learn?</p>
                                            </div>

                                            <form onSubmit={handleFinalSignup} className="space-y-6 pt-2">
                                                {/* Weekly Goal Options */}
                                                <div className="grid grid-cols-5 gap-2">
                                                    {[3, 4, 5, 6, 7].map((days) => (
                                                        <button
                                                            key={days}
                                                            type="button"
                                                            onClick={() => setFormData(prev => ({ ...prev, weeklyGoal: days }))}
                                                            className={cn(
                                                                "h-14 rounded-xl border-2 font-heading font-bold text-lg transition-bounce",
                                                                formData.weeklyGoal === days
                                                                    ? "border-foreground bg-tertiary text-tertiary-foreground shadow-pop -translate-y-0.5"
                                                                    : "border-foreground/30 bg-muted hover:border-foreground/50 hover:bg-muted/80"
                                                            )}
                                                        >
                                                            {days}
                                                        </button>
                                                    ))}
                                                </div>

                                                <div className="text-center py-4">
                                                    <p className="text-lg font-bold text-foreground">
                                                        {formData.weeklyGoal} days
                                                        <span className="text-muted-foreground font-normal"> per week</span>
                                                    </p>
                                                    <p className="text-sm text-muted-foreground mt-1">
                                                        {formData.weeklyGoal === 7 ? "🔥 Ultimate dedication!" :
                                                            formData.weeklyGoal >= 5 ? "💪 Great commitment!" :
                                                                "👍 A solid start!"}
                                                    </p>
                                                </div>

                                                {errorMsg && (
                                                    <div className="p-3 rounded-lg bg-destructive/15 text-destructive text-sm font-medium border border-destructive/20 flex items-center gap-2 animate-wiggle">
                                                        <AlertCircle className="h-4 w-4 shrink-0" />
                                                        {errorMsg}
                                                    </div>
                                                )}

                                                <div className="flex gap-3 pt-2">
                                                    <Button type="button" variant="outline" onClick={() => setSignupStep(3)} className="h-12 w-12 border-2 border-foreground shadow-pop hover:translate-y-0.5 hover:shadow-none transition-all bg-white"><ArrowLeft className="h-5 w-5" /></Button>
                                                    <Button type="submit" className="flex-1 h-12 text-base font-bold font-heading bg-secondary text-secondary-foreground border-foreground shadow-pop hover:translate-y-0.5 hover:shadow-none transition-all border-0 ring-0" disabled={isLoading}>
                                                        {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <>Complete Setup <Sparkles className="ml-2 h-5 w-5" /></>}
                                                    </Button>
                                                </div>
                                            </form>
                                        </motion.div>
                                    )}
                                </>
                            )}

                        </AnimatePresence>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
