import type { PortfolioResponse } from "@/types/portfolio";
import type { TradeResponse } from "@/types/trade";
import { api } from "./client";

export const portfolioService = {
    getUserPortfolio: async (): Promise<PortfolioResponse[]> => {
        const { data } = await api.get<PortfolioResponse[]>("/portfolio/me");
        return data;
    },

    getRecentTrades: async (): Promise<TradeResponse[]> => {
        const { data } = await api.get<TradeResponse[]>("/trades/me");
        return data;
    },
};
