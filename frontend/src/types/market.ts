export interface PriceTickEvent {
    symbol: string;
    price: number;
    timestamp: number;
}

export interface TradeExecutedEvent {
    buyOrderId: string;
    sellOrderId: string;
    symbol: string;
    price: number;
    quantity: number;
    executedAt: string;
}
