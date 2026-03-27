import { type PriceTickEvent } from "@/types/market";
import { api } from "./client";

export const marketService = {
    getLatestPrice: async (symbol: string): Promise<PriceTickEvent> => {
        const { data } = await api.get<PriceTickEvent>(`/market/price/${symbol}`);
        return data;
    },
    getOrderBook: async (symbol: string): Promise<{ bids: any[], asks: any[] }> => {
        const { data } = await api.get(`/matching/orderbook/${symbol}`);
        return data;
    },
    getSymbols: async (): Promise<string[]> => {
        const { data } = await api.get<string[]>("/market/symbols");
        return data;
    },
};
