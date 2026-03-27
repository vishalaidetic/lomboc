export const OrderSide = {
    BUY: "BUY",
    SELL: "SELL",
} as const;
export type OrderSide = (typeof OrderSide)[keyof typeof OrderSide];

export const OrderType = {
    LIMIT: "LIMIT",
    MARKET: "MARKET",
} as const;
export type OrderType = (typeof OrderType)[keyof typeof OrderType];

export const OrderStatus = {
    PENDING: "PENDING",
    FILLED: "FILLED",
    CANCELLED: "CANCELLED",
    PARTIALLY_FILLED: "PARTIALLY_FILLED",
    SETTLED: "SETTLED",
} as const;
export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];

export interface CreateOrderRequest {
    userId: string;
    symbol: string;
    type: OrderType;
    side: OrderSide;
    price: number;
    quantity: number;
}

export interface OrderResponse {
    id: string;
    userId: string;
    symbol: string;
    type: OrderType;
    side: OrderSide;
    price: number;
    quantity: number;
    status: OrderStatus;
    createdAt: string;
}
