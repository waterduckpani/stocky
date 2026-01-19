"use client"

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceDot, ReferenceArea } from "recharts"

interface InteractiveChartProps {
    data?: any[]
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-card p-4 rounded-xl border-2 border-foreground shadow-pop z-50">
                <p className="font-bold text-foreground mb-1">{label}</p>
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
    return (
        <div className="bg-card rounded-3xl p-6 border-2 border-foreground shadow-pop h-[350px] flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-foreground">Price Journey</h3>
                <div className="flex gap-2">
                    {["1M", "3M", "1Y", "ALL"].map((period) => (
                        <button
                            key={period}
                            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${period === "3M"
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
                    <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.1} />
                                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <XAxis
                            dataKey="date"
                            stroke="#94a3b8"
                            fontSize={11}
                            tickLine={false}
                            axisLine={false}
                            dy={10}
                        />
                        <YAxis
                            stroke="#94a3b8"
                            fontSize={11}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `$${value}`}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#8B5CF6', strokeWidth: 2, strokeDasharray: '5 5' }} />
                        <Line
                            type="monotone"
                            dataKey="price"
                            stroke="#8B5CF6"
                            strokeWidth={3}
                            dot={<CustomDot />}
                            activeDot={{ r: 6, fill: "#8B5CF6", stroke: "#FFF", strokeWidth: 2 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-2 text-center text-xs font-medium text-muted-foreground">
                Hover over the <span className="inline-block w-4 h-4 bg-secondary text-white rounded-full text-[10px] leading-4 align-middle mx-1">?</span> points to see what drove the price.
            </div>
        </div>
    )
}
