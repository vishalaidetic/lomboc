import type { PortfolioResponse } from "@/types/portfolio";
import type { TradeResponse } from "@/types/trade";
import { create } from "zustand";

interface PortfolioState {
    holdings: PortfolioResponse[];
    trades: TradeResponse[];
    setPortfolio: (holdings: PortfolioResponse[]) => void;
    setTrades: (trades: TradeResponse[]) => void;
    addTrade: (trade: TradeResponse) => void;
    updateHolding: (holding: PortfolioResponse) => void;
}

export const usePortfolioStore = create<PortfolioState>((set) => ({
    holdings: [],
    trades: [],
    setPortfolio: (holdings) => set({ holdings }),
    setTrades: (trades) => set({ trades }),
    addTrade: (trade) =>
        set((state) => ({
            trades: [trade, ...state.trades].slice(0, 50),
        })),
    updateHolding: (holding) =>
        set((state) => {
            const index = state.holdings.findIndex((h) => h.symbol === holding.symbol);
            if (index >= 0) {
                const newHoldings = [...state.holdings];
                newHoldings[index] = holding;
                return { holdings: newHoldings };
            } else {
                return { holdings: [...state.holdings, holding] };
            }
        }),
}));
