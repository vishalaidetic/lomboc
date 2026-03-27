import type { PortfolioResponse } from "@/types/portfolio";
import type { TradeResponse } from "@/types/trade";
import { api } from "./client";

export const portfolioService = {
    getUserPortfolio: async (userId: string): Promise<PortfolioResponse[]> => {
        const { data } = await api.get<PortfolioResponse[]>(`/portfolio/${userId}`);
        return data;
    },

    getRecentTrades: async (userId?: string): Promise<TradeResponse[]> => {
        const url = userId ? `/trades/user/${userId}` : "/trades/recent";
        const { data } = await api.get<TradeResponse[]>(url);
        return data;
    },
};
