export interface PortfolioItemResponse {
    id: string;
    symbol: string;
    quantity: number;
    avgPrice: number;
    currentPrice: number;
    realizedProfit: number;
    unrealizedPnL: number;
    equityValue: number;
}

export interface PortfolioSummaryResponse {
    estimatedWealth: number;
    totalProfit: number;
    tradeCount: number;
    holdings: PortfolioItemResponse[];
}

// Backward compatibility or for use with old hooks
export type PortfolioResponse = PortfolioItemResponse;
