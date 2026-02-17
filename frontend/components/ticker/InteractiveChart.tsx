"use client"

import { useState, useEffect } from "react"
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceDot, ReferenceArea } from "recharts"

interface InteractiveChartProps {
    data?: any[]
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        // label is timestamp now
        const dateStr = new Date(label).toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })

        return (
            <div className="bg-card p-4 rounded-xl border-2 border-foreground shadow-pop z-50">
                <p className="font-bold text-foreground mb-1">{dateStr}</p>
                <p className="text-primary font-bold text-lg">
                    ${payload[0].value}
                </p>
                {payload[0].payload.info && (
                    <div className="mt-2 text-xs font-bold bg-tertiary/20 text-tertiary-foreground px-2 py-1 rounded-lg inline-block border border-tertiary/20">
                        {payload[0].payload.info}
                    </div>
                )}
            </div>
        )
    }
    return null
}

const CustomDot = (props: any) => {
    const { cx, cy, payload } = props;
    if (payload.info) {
        return (
            <svg x={cx - 12} y={cy - 12} width={24} height={24} viewBox="0 0 24 24" className="overflow-visible group cursor-pointer">
                {/* Pulse Effect */}
                <circle cx="12" cy="12" r="12" className="fill-secondary/30 animate-ping origin-center" />
                {/* Background */}
                <circle cx="12" cy="12" r="10" className="fill-secondary stroke-white stroke-2" />
                {/* Question Mark */}
                <text x="12" y="16" textAnchor="middle" className="fill-white text-[12px] font-bold select-none pointer-events-none">?</text>
            </svg>
        );
    }
    return <circle cx={cx} cy={cy} r={4} className="fill-primary" />
};

export function InteractiveChart({ data = [] }: InteractiveChartProps) {
    const [timeRange, setTimeRange] = useState("1Y")
    const [filteredData, setFilteredData] = useState<any[]>([])

    useEffect(() => {
        if (!data || data.length === 0) {
            setFilteredData([])
            return
        }

        const now = new Date()
        let startDate = new Date(0) // Default to epoch for ALL

        switch (timeRange) {
            case "5D":
                startDate = new Date()
                startDate.setDate(now.getDate() - 10) // Increase lookback to ensure ~5 trading days
                break
            case "1M":
                startDate = new Date()
                startDate.setMonth(now.getMonth() - 1)
                break
            case "6M":
                startDate = new Date()
                startDate.setMonth(now.getMonth() - 6)
                break
            case "YTD":
                startDate = new Date(now.getFullYear(), 0, 1)
                break
            case "1Y":
                startDate = new Date()
                startDate.setFullYear(now.getFullYear() - 1)
                break
            case "3Y":
                startDate = new Date()
                startDate.setFullYear(now.getFullYear() - 3)
                break
            case "5Y":
                startDate = new Date()
                startDate.setFullYear(now.getFullYear() - 5)
                break
            case "ALL":
                startDate = new Date(0)
                break
            default:
                startDate = new Date()
                startDate.setFullYear(now.getFullYear() - 1)
        }

        // Handle "YYYY-MM-DD" (new) and "Mon DD" (legacy/fallback)
        const parseDate = (dateStr: string) => {
            const d = new Date(dateStr)
            if (!isNaN(d.getTime())) return d

            // Fallback for "Dec 26" style -> assume current or last year
            const currentYear = new Date().getFullYear()
            const fallback = new Date(`${dateStr} ${currentYear}`)
            if (fallback > new Date()) {
                fallback.setFullYear(currentYear - 1)
            }
            return fallback
        }

        // 1. Initial Filter & Sort
        const rawFiltered = data
            .filter(item => parseDate(item.date) >= startDate)
            .map(item => ({
                ...item,
                time: parseDate(item.date).getTime()
            }))
            .sort((a, b) => a.time - b.time)

        // 2. Fill Gaps (Weekends/Holidays)
        const filledData: any[] = []
        if (rawFiltered.length > 0) {
            const oneDay = 24 * 60 * 60 * 1000

            for (let i = 0; i < rawFiltered.length - 1; i++) {
                const current = rawFiltered[i]
                const next = rawFiltered[i + 1]
                filledData.push(current)

                const diffTime = next.time - current.time
                const diffDays = Math.round(diffTime / oneDay)

                if (diffDays > 1) {
                    for (let d = 1; d < diffDays; d++) {
                        const missingTime = current.time + (d * oneDay)
                        filledData.push({
                            ...current, // Copy price from previous day
                            time: missingTime,
                            isFiller: true
                        })
                    }
                }
            }
            filledData.push(rawFiltered[rawFiltered.length - 1])
        }

        setFilteredData(filledData)
    }, [data, timeRange])

    return (
        <div className="w-full h-full flex flex-col">
            <div className="flex justify-end items-center mb-2 px-2 pt-2">
                <div className="flex gap-2">
                    {["5D", "1M", "6M", "YTD", "1Y", "3Y", "5Y", "ALL"].map((period) => (
                        <button
                            key={period}
                            onClick={() => setTimeRange(period)}
                            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${timeRange === period
                                ? "bg-primary text-white shadow-sm"
                                : "bg-muted text-muted-foreground hover:bg-muted/80"
                                }`}
                        >
                            {period}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={filteredData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3BB273" stopOpacity={0.1} />
                                <stop offset="95%" stopColor="#3BB273" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <XAxis
                            dataKey="time"
                            type="number"
                            domain={['dataMin', 'dataMax']}
                            stroke="#94a3b8"
                            fontSize={11}
                            tickLine={false}
                            axisLine={false}
                            dy={10}
                            minTickGap={50}
                            tickFormatter={(unixTime) => {
                                const date = new Date(unixTime);
                                if (["3Y", "5Y", "ALL"].includes(timeRange)) {
                                    return date.getFullYear().toString();
                                }
                                return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                            }}
                        />
                        <YAxis
                            stroke="#94a3b8"
                            fontSize={11}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `$${value}`}
                            domain={['auto', 'auto']}
                        />
                        <Tooltip
                            content={<CustomTooltip />}
                            cursor={{ stroke: '#3BB273', strokeWidth: 2, strokeDasharray: '5 5' }}
                            isAnimationActive={false}
                        />
                        <Area
                            type="monotone"
                            dataKey="price"
                            stroke="#3BB273"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorPrice)"
                            activeDot={{ r: 6, fill: "#3BB273", stroke: "#FFF", strokeWidth: 2 }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-2 text-center text-xs font-medium text-muted-foreground pb-2">
                Hover over the chart to see price history.
            </div>
        </div>
    )
}
