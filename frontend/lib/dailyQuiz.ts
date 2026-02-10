import { supabase } from '@/utils/supabase/client'

/**
 * Daily quiz data structure (matches backend response)
 */
export interface DailyQuiz {
    lessonNumber: number
    question: string
    options: string[]
    correctAnswer: number
    explanation: string
}

/**
 * Check if user has completed a lesson today (required before quiz)
 */
export async function hasCompletedLessonToday(): Promise<boolean> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return false

    const today = new Date().toISOString().split('T')[0]

    // Check user_activity for any lesson-related activity today
    const { data, error } = await supabase
        .from('user_activity')
        .select('activity_date')
        .eq('user_id', user.id)
        .eq('activity_date', today)
        .limit(1)

    if (error) {
        console.error('Error checking lesson completion:', error)
        return false
    }

    return data && data.length > 0
}

/**
 * Fetch daily quiz for user's current lesson from backend
 */
export async function fetchDailyQuiz(lessonNumber: number): Promise<DailyQuiz | null> {
    try {
        const response = await fetch(`http://localhost:8000/api/daily-quiz/${lessonNumber}`)

        if (!response.ok) {
            console.error('Failed to fetch daily quiz:', response.statusText)
            return null
        }

        return await response.json()
    } catch (error) {
        console.error('Error fetching daily quiz:', error)
        return null
    }
}

/**
 * Get user's current lesson number
 */
export async function getCurrentLesson(): Promise<number> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return 1

    const { data } = await supabase
        .from('user_lesson_progress')
        .select('current_lesson')
        .eq('user_id', user.id)
        .single()

    return data?.current_lesson || 1
}
