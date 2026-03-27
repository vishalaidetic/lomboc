import { create } from "zustand";

interface Market {
    symbol: string;
    type: string;
    active: boolean;
    openTime?: string;
    closeTime?: string;
}

interface OrderBookData {
    bids: any[];
    asks: any[];
}

interface MarketState {
    currentSymbol: string;
    symbols: Market[];
    prices: Record<string, number>;
    currency: "USD" | "EUR";
    exchangeRate: number;
    orderBooks: Record<string, OrderBookData>;

    setCurrentSymbol: (symbol: string) => void;
    setSymbols: (symbols: Market[]) => void;
    setCurrency: (currency: "USD" | "EUR") => void;
    setExchangeRate: (rate: number) => void;
    updatePrice: (symbol: string, price: number) => void;
    setOrderBook: (symbol: string, bids: any[], asks: any[]) => void;
}

export const useMarketStore = create<MarketState>((set) => ({
    currentSymbol: "BTCUSD",
    symbols: [],
    prices: {},
    currency: "USD",
    exchangeRate: 0.925,
    orderBooks: {},

    setCurrentSymbol: (symbol) => set({ currentSymbol: symbol }),
    setSymbols: (symbols) => set({ symbols }),
    setCurrency: (currency) => set({ currency }),
    setExchangeRate: (rate) => set({ exchangeRate: rate }),
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
