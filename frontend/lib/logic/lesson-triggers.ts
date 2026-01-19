/**
 * Lesson Trigger Engine
 * 
 * Deterministic logic for selecting lesson topics based on stock data.
 * The TypeScript logic chooses the topic FIRST, then generates a prompt for the LLM.
 * This ensures consistent, data-driven lesson selection without LLM variability.
 */

// =============================================================================
// INTERFACES
// =============================================================================

export interface StockData {
    symbol: string
    name: string
    price: number
    changePercent: number
    peRatio: number | null
    marketCap: number
    beta: number | null
    dividendYield: number | null
    week52High: number | null
    week52Low: number | null
}

export interface LessonTrigger {
    id: string
    topic: string
    condition: (stock: StockData) => boolean
    priority: number // Lower = higher priority
}

// =============================================================================
// LESSON TRIGGERS (Ordered by priority)
// =============================================================================

const LESSON_TRIGGERS: LessonTrigger[] = [
    {
        id: 'volatility_crash',
        topic: 'Volatility and Market Corrections',
        condition: (stock) => stock.changePercent <= -5,
        priority: 1
    },
    {
        id: 'volatility_spike',
        topic: 'Volatility and Momentum',
        condition: (stock) => stock.changePercent >= 5,
        priority: 2
    },
    {
        id: 'high_pe_growth',
        topic: 'High P/E Ratios and Growth Expectations',
        condition: (stock) => stock.peRatio !== null && stock.peRatio > 90,
        priority: 3
    },
    {
        id: 'mega_cap_stability',
        topic: 'Mega-Cap Stability',
        condition: (stock) => stock.marketCap > 1_000_000_000_000, // 1 Trillion
        priority: 4
    },
    {
        id: 'dividend_income',
        topic: 'Dividend Investing and Passive Income',
        condition: (stock) => stock.dividendYield !== null && stock.dividendYield > 0.02, // 2%+
        priority: 5
    },
    {
        id: 'high_beta_risk',
        topic: 'Beta and Market Sensitivity',
        condition: (stock) => stock.beta !== null && stock.beta > 1.5,
        priority: 6
    },
    {
        id: 'near_52_week_high',
        topic: 'All-Time Highs and Momentum',
        condition: (stock) => {
            if (!stock.week52High) return false
            return stock.price >= stock.week52High * 0.95 // Within 5% of 52-week high
        },
        priority: 7
    },
    {
        id: 'near_52_week_low',
        topic: 'Buying the Dip vs Catching a Falling Knife',
        condition: (stock) => {
            if (!stock.week52Low) return false
            return stock.price <= stock.week52Low * 1.1 // Within 10% of 52-week low
        },
        priority: 8
    },
    {
        id: 'default_ownership',
        topic: 'Understanding Stock Ownership',
        condition: () => true, // Always matches as fallback
        priority: 100
    }
]

// =============================================================================
// CORE FUNCTIONS
// =============================================================================

/**
 * Analyzes stock data and returns the most relevant lesson topic.
 * Uses deterministic rules - no LLM involvement in topic selection.
 */
export function getLessonTopic(stock: StockData): string {
    // Sort by priority and find first matching trigger
    const sortedTriggers = [...LESSON_TRIGGERS].sort((a, b) => a.priority - b.priority)

    for (const trigger of sortedTriggers) {
        if (trigger.condition(stock)) {
            return trigger.topic
        }
    }

    // Fallback (should never reach due to default trigger)
    return 'Understanding Stock Ownership'
}

/**
 * Returns the trigger ID for debugging/analytics purposes.
 */
export function getLessonTriggerId(stock: StockData): string {
    const sortedTriggers = [...LESSON_TRIGGERS].sort((a, b) => a.priority - b.priority)

    for (const trigger of sortedTriggers) {
        if (trigger.condition(stock)) {
            return trigger.id
        }
    }

    return 'default_ownership'
}

/**
 * Generates a structured prompt for the LLM.
 * The topic is pre-selected by TypeScript logic, NOT by the LLM.
 */
export function generateLlamaPrompt(topic: string, stock: StockData): string {
    const priceFormatted = stock.price.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD'
    })

    const changeDirection = stock.changePercent >= 0 ? 'up' : 'down'
    const changeFormatted = `${Math.abs(stock.changePercent).toFixed(2)}%`

    return `You are a financial mentor explaining investing concepts to a complete beginner.

The user is looking at ${stock.name} (${stock.symbol}), currently trading at ${priceFormatted}, ${changeDirection} ${changeFormatted} today.

The calculated lesson topic is: "${topic}"

Your task:
1. Explain this concept in 2-3 simple sentences using ${stock.symbol} as a real example.
2. Make it relevant to what the user is seeing right now.
3. Use everyday language a teenager would understand.

Rules:
- Do NOT give investment advice or recommendations.
- Do NOT say "you should buy/sell".
- Focus only on explaining the concept.
- Keep it under 60 words.`
}

/**
 * Complete lesson generation function.
 * Returns both the topic and the prompt.
 */
export function prepareLessonPrompt(stock: StockData): {
    topic: string
    triggerId: string
    prompt: string
} {
    const topic = getLessonTopic(stock)
    const triggerId = getLessonTriggerId(stock)
    const prompt = generateLlamaPrompt(topic, stock)

    return { topic, triggerId, prompt }
}
