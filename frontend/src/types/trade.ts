export interface TradeResponse {
    id: string; // tradeId from backend
    buyOrderId: string;
    buyUserId: string;
    sellOrderId: string;
    sellUserId: string;
    symbol: string;
    price: number;
    quantity: number;
    timestamp?: number;
    executedAt?: string;
}
