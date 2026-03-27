import { create } from "zustand";

interface OrderBookData {
    bids: any[];
    asks: any[];
}

interface MarketState {
    prices: Record<string, number>;
    orderBooks: Record<string, OrderBookData>;
    updatePrice: (symbol: string, price: number) => void;
    setOrderBook: (symbol: string, bids: any[], asks: any[]) => void;
}

export const useMarketStore = create<MarketState>((set) => ({
    prices: {},
    orderBooks: {},
    updatePrice: (symbol, price) =>
        set((state) => ({
            prices: { ...state.prices, [symbol]: price },
        })),
    setOrderBook: (symbol, bids, asks) =>
        set((state) => ({
            orderBooks: {
                ...state.orderBooks,
                [symbol]: { bids, asks }
            },
        })),
}));
