import { supabase } from '@/utils/supabase/client'

/**
 * Log user activity (e.g., search, lesson completion) for streak tracking.
 * Uses upsert to increment the count if activity already exists for today.
 */
export async function logActivity(activityType: string = 'search'): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return false

    const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD format

    // Try to upsert - if record exists for today, increment count
    const { error } = await supabase
        .from('user_activity')
        .upsert(
            {
                user_id: user.id,
                activity_date: today,
                activity_type: activityType,
                activity_count: 1
            },
            {
                onConflict: 'user_id,activity_date,activity_type',
                ignoreDuplicates: false
            }
        )

    if (error) {
        console.error('Error logging activity:', error)
        return false
    }

    return true
}

interface ActivityRecord {
    activity_date: string
}

/**
 * Get weekly activity count (how many unique days the user was active this week).
 */
export async function getWeeklyProgress(): Promise<number> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return 0

    // Get start of current week (Monday)
    const now = new Date()
    const dayOfWeek = now.getDay()
    const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1
    const weekStart = new Date(now)
    weekStart.setDate(now.getDate() - daysToMonday)
    weekStart.setHours(0, 0, 0, 0)

    const weekStartStr = weekStart.toISOString().split('T')[0]

    const { data, error } = await supabase
        .from('user_activity')
        .select('activity_date')
        .eq('user_id', user.id)
        .gte('activity_date', weekStartStr)

    if (error) {
        console.error('Error fetching weekly progress:', error)
        return 0
    }

    // Count unique days
    const records = data as ActivityRecord[] | null
    const uniqueDays = new Set(records?.map((d: ActivityRecord) => d.activity_date) || [])
    return uniqueDays.size
}

/**
 * Calculate total consecutive day streak (days in a row with activity).
 */
export async function getTotalStreak(): Promise<number> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return 0

    // Fetch all activity dates ordered descending
    const { data, error } = await supabase
        .from('user_activity')
        .select('activity_date')
        .eq('user_id', user.id)
        .order('activity_date', { ascending: false })

    if (error || !data || data.length === 0) {
        return 0
    }

    const records = data as ActivityRecord[]

    // Get unique dates
    const uniqueDates = [...new Set(records.map((d: ActivityRecord) => d.activity_date))].sort().reverse()

    if (uniqueDates.length === 0) return 0

    // Check if streak is still active (last activity was today or yesterday)
    const today = new Date().toISOString().split('T')[0]
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]

    if (uniqueDates[0] !== today && uniqueDates[0] !== yesterday) {
        return 0 // Streak broken
    }

    // Count consecutive days
    let streak = 1
    for (let i = 1; i < uniqueDates.length; i++) {
        const prevDate = new Date(uniqueDates[i - 1])
        const currDate = new Date(uniqueDates[i])

        // Check if dates are consecutive
        const diffDays = Math.floor((prevDate.getTime() - currDate.getTime()) / 86400000)

        if (diffDays === 1) {
            streak++
        } else {
            break // Streak broken
        }
    }

    return streak
}

/**
 * Get user's weekly goal from their metadata.
 */
export async function getWeeklyGoal(): Promise<number> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return 5 // Default to 5 days

    return user.user_metadata?.weekly_goal ?? 5
}

/**
 * Get all streak data in one call (optimized for dashboard).
 */
export async function getStreakData(): Promise<{
    totalStreak: number
    weeklyGoal: number
    weeklyProgress: number
}> {
    const [totalStreak, weeklyGoal, weeklyProgress] = await Promise.all([
        getTotalStreak(),
        getWeeklyGoal(),
        getWeeklyProgress()
    ])

    return { totalStreak, weeklyGoal, weeklyProgress }
}
