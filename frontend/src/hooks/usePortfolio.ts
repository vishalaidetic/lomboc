import { portfolioService } from "@/api/portfolioService";
import { useQuery } from "@tanstack/react-query";

export function usePortfolio() {
    return useQuery({
        queryKey: ["portfolio", "me"],
        queryFn: () => portfolioService.getUserPortfolio(),
        refetchInterval: 3000,
        staleTime: 0,
    });
}

export function useRecentTrades() {
    return useQuery({
        queryKey: ["trades", "me"],
        queryFn: () => portfolioService.getRecentTrades(),
        refetchInterval: 5000,
    });
}
