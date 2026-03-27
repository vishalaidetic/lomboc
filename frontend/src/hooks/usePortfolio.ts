import { portfolioService } from "@/api/portfolioService";
import { useQuery } from "@tanstack/react-query";

export function usePortfolio(userId: string) {
    return useQuery({
        queryKey: ["portfolio", userId],
        queryFn: () => portfolioService.getUserPortfolio(userId),
        enabled: !!userId,
        refetchInterval: 3000, // Poll every 3 seconds for settlements
        staleTime: 0,
    });
}

export function useRecentTrades(userId?: string) {
    return useQuery({
        queryKey: ["trades", "recent", userId],
        queryFn: () => portfolioService.getRecentTrades(userId),
        refetchInterval: 5000, // Sync trade log every 5 seconds
    });
}
