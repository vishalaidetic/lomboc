import { portfolioService } from "@/api/portfolioService";
import { useQuery } from "@tanstack/react-query";

export function usePortfolio(userId: string) {
    return useQuery({
        queryKey: ["portfolio", userId],
        queryFn: () => portfolioService.getUserPortfolio(userId),
        enabled: !!userId,
    });
}

export function useRecentTrades(userId?: string) {
    return useQuery({
        queryKey: ["trades", "recent", userId],
        queryFn: () => portfolioService.getRecentTrades(userId),
    });
}
