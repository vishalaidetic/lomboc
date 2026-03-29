import { type PriceTickEvent } from "@/types/market";
import { api } from "./client";

export interface Market {
    symbol: string;
    type: string;
    active: boolean;
    lastPrice?: number;
    openTime?: string;
    closeTime?: string;
}

export const marketService = {
    getLatestPrice: async (symbol: string): Promise<PriceTickEvent> => {
        const { data } = await api.get<PriceTickEvent>(`/market/price/${symbol}`);
        return data;
    },
    getOrderBook: async (symbol: string): Promise<{ bids: any[], asks: any[] }> => {
        const { data } = await api.get(`/matching/orderbook/${symbol}`);
        return data;
    },
    getSymbols: async (): Promise<Market[]> => {
        const { data } = await api.get<Market[]>("/market/symbols");
        return data;
    },
    getFundamentals: async (symbol: string): Promise<any> => {
        const { data } = await api.get(`/market/fundamentals/${symbol}`);
        return data;
    },
    getExchangeRate: async (): Promise<{ EUR: number }> => {
        const { data } = await api.get<{ EUR: number }>("/market/exchange-rate");
        return data;
    },
};
