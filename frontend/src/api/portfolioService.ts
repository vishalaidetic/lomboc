import type { PortfolioSummaryResponse } from "@/types/portfolio";
import type { TradeResponse } from "@/types/trade";
import { api } from "./client";

export const portfolioService = {
    getUserPortfolio: async (): Promise<PortfolioSummaryResponse> => {
        const { data } = await api.get<PortfolioSummaryResponse>("/portfolio/me");
        return data;
    },

    getRecentTrades: async (): Promise<TradeResponse[]> => {
        const { data } = await api.get<TradeResponse[]>("/trades/me");
        return data;
    },
};
