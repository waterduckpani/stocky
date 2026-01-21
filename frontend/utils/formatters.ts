
interface CurrencyConfig {
    code: string;
    symbol: string;
    decimals: number;
}

export const formatPrice = (price: number, config?: CurrencyConfig) => {
    // Default to USD if no config provided
    const safeConfig = config || { code: 'USD', symbol: '$', decimals: 2 };

    try {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: safeConfig.code,
            minimumFractionDigits: safeConfig.decimals,
            maximumFractionDigits: safeConfig.decimals,
        }).format(price).replace(safeConfig.code, safeConfig.symbol).replace('US$', '$').trim();
    } catch (e) {
        // Fallback for weird edge cases
        return `${safeConfig.symbol}${price.toFixed(safeConfig.decimals)}`;
    }
}

export const formatLargeCurrency = (value: number, config?: CurrencyConfig) => {
    const safeConfig = config || { code: 'USD', symbol: '$', decimals: 2 };

    if (value >= 1_000_000_000_000) return `${safeConfig.symbol}${(value / 1_000_000_000_000).toFixed(2)}T`;
    if (value >= 1_000_000_000) return `${safeConfig.symbol}${(value / 1_000_000_000).toFixed(2)}B`;
    if (value >= 1_000_000) return `${safeConfig.symbol}${(value / 1_000_000).toFixed(2)}M`;

    return formatPrice(value, safeConfig);
}
