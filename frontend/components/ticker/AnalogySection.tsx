import { Lightbulb } from "lucide-react"

interface AnalogySectionProps {
    symbol: string
    name: string
}

export function AnalogySection({ symbol, name }: AnalogySectionProps) {
    // Mock data - in real app would come from API
    const getAnalogy = (sym: string) => {
        if (sym === 'AAPL') return {
            title: "The Digital Landlord",
            description: "Think of Apple not just as a phone maker, but as a landlord of a very popular digital city. Every time someone buys an app or subscribes to a service, they pay rent. The iPhone is just the key to get into the city."
        }
        if (sym === 'TSLA') return {
            title: "The Energy Battery",
            description: "Tesla isn't just a car company; it's like a giant battery for the world. They sell the cars (the device) but also the charging stations (the power grid) and the software (the brain). It's building the nervous system for future transport."
        }
        return {
            title: "The Business Engine",
            description: `Think of ${name} as a powerful engine powering a specific part of the economy. When that sector grows, this engine runs faster and more efficiently.`
        }
    }

    const content = getAnalogy(symbol)

    return (
        <div className="bg-card rounded-3xl p-8 border-2 border-foreground shadow-pop relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <Lightbulb className="w-32 h-32" />
            </div>

            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                    <div className="bg-tertiary/20 p-3 rounded-xl border-2 border-tertiary/20">
                        <Lightbulb className="w-6 h-6 text-tertiary-foreground" strokeWidth={2.5} />
                    </div>
                    <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Explain Like I'm 5</span>
                </div>

                <h2 className="text-2xl font-bold mb-3 text-foreground" style={{ fontFamily: 'var(--font-heading)' }}>
                    {content.title}
                </h2>

                <p className="text-lg text-muted-foreground leading-relaxed font-medium">
                    {content.description}
                </p>
            </div>
        </div>
    )
}
