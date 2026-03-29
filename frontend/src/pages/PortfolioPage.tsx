import { usePortfolio, useRecentTrades } from "@/hooks/usePortfolio";
import { useProfile } from "@/hooks/useProfile";
import { cn } from "@/lib/utils";
import { useMarketStore } from "@/store/useMarketStore";
import { usePortfolioStore } from "@/store/usePortfolioStore";
import { ArrowRightLeft, Clock, History, TrendingDown, TrendingUp, Wallet } from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router";

export default function PortfolioPage() {
    const { data: profile } = useProfile();
    const { data: initialPortfolio, isLoading: portfolioLoading } = usePortfolio();
    const { data: initialTrades, isLoading: tradesLoading } = useRecentTrades();

    const userId = profile?.id; // Current internal UUID
    const holdings = usePortfolioStore((state) => state.holdings);
    const trades = usePortfolioStore((state) => state.trades);
    const setPortfolio = usePortfolioStore((state) => state.setPortfolio);
    const setTrades = usePortfolioStore((state) => state.setTrades);
    const prices = useMarketStore((state) => state.prices);
    const currency = useMarketStore((state) => state.currency);
    const exchangeRate = useMarketStore((state) => state.exchangeRate);

    // Initial Sync
    useEffect(() => {
        if (initialPortfolio) setPortfolio(initialPortfolio);
    }, [initialPortfolio, setPortfolio]);

    useEffect(() => {
        if (initialTrades) setTrades(initialTrades);
    }, [initialTrades, setTrades]);

    const totalBalance = holdings.reduce((acc: number, h: any) => {
        const livePrice = prices[h.symbol] || h.avgPrice;
        const valueInUSD = h.quantity * livePrice;
        return acc + (currency === "EUR" ? valueInUSD * exchangeRate : valueInUSD);
    }, 0);

    return (
        <div className="flex flex-col p-6 sm:p-10">
            <header className="mb-12 flex items-center justify-between border-b border-white/5 pb-10">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-black tracking-tighter uppercase">Portfolio Control</h1>
                    <p className="text-[10px] font-bold tracking-[0.3em] text-zinc-500 uppercase">
                        Real-time Asset Monitoring & Settlement
                    </p>
                </div>
            </header>

            <main className="z-10 grid grid-cols-1 gap-10 lg:grid-cols-12">
                {/* Summary Cards */}
                <div className="col-span-full grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-3xl border border-white/5 bg-zinc-900/40 p-6 backdrop-blur-3xl shadow-2xl transition-all hover:bg-zinc-900/60">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                <Wallet className="h-5 w-5" />
                            </div>
                            <span className="text-[10px] font-black tracking-[0.2em] text-zinc-500 uppercase">Estimated Wealth</span>
                        </div>
                        <div className="text-3xl font-black text-white tabular-nums">
                            {currency === "EUR" ? "€" : "$"}
                            {totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                        <p className="mt-2 text-[10px] font-bold text-emerald-500 uppercase tracking-widest">+2.4% vs Yesterday</p>
                    </div>

                    <div className="rounded-3xl border border-white/5 bg-zinc-900/40 p-6 backdrop-blur-3xl shadow-2xl transition-all hover:bg-zinc-900/60">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                <TrendingUp className="h-5 w-5" />
                            </div>
                            <span className="text-[10px] font-black tracking-[0.2em] text-zinc-500 uppercase">Total Profit</span>
                        </div>
                        <div className="text-3xl font-black text-emerald-400 tabular-nums">
                            {currency === "EUR" ? "€" : "$"}
                            {(totalBalance * 0.15).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </div>
                        <p className="mt-2 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Across {holdings.length} symbols</p>
                    </div>

                    <div className="rounded-3xl border border-white/5 bg-zinc-900/40 p-6 backdrop-blur-3xl shadow-2xl transition-all hover:bg-zinc-900/60">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                <ArrowRightLeft className="h-5 w-5" />
                            </div>
                            <span className="text-[10px] font-black tracking-[0.2em] text-zinc-500 uppercase">Trade Count</span>
                        </div>
                        <div className="text-3xl font-black text-white tabular-nums">
                            {trades.length}
                        </div>
                        <p className="mt-2 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Lifetime activity</p>
                    </div>
                </div>

                {/* Holdings Section */}
                <section className="flex flex-col gap-6 lg:col-span-12 xl:col-span-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Wallet className="h-5 w-5 text-blue-500" />
                            <h2 className="text-xl font-bold tracking-tight">Your Assets</h2>
                        </div>
                        <div className="rounded-full bg-blue-500/10 px-3 py-1 text-[10px] font-black text-blue-500 uppercase tracking-widest border border-blue-500/20">
                            {holdings.length} Positions Live
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {portfolioLoading ? (
                            Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="h-40 animate-pulse rounded-2xl border border-white/5 bg-zinc-900/40" />
                            ))
                        ) : holdings.length === 0 ? (
                            <div className="col-span-full rounded-3xl border border-dashed border-white/10 p-20 text-center">
                                <p className="text-sm font-bold text-zinc-600 uppercase tracking-widest">No assets found in vault</p>
                            </div>
                        ) : (
                            holdings.map((h) => {
                                const currentPrice = prices[h.symbol] || h.avgPrice;
                                const pnl = (currentPrice - h.avgPrice) * h.quantity;
                                const isPositive = pnl >= 0;

                                return (
                                    <div key={h.id} className="group relative overflow-hidden rounded-3xl border border-white/5 bg-zinc-900/40 p-6 transition-all hover:bg-zinc-900/60 hover:border-white/10">
                                        <div className="mb-6 flex items-center justify-between">
                                            <div className="flex flex-col">
                                                <span className="text-lg font-black tracking-tighter">{h.symbol}</span>
                                                <span className="text-[10px] font-bold text-zinc-500 uppercase">Spot Position</span>
                                            </div>
                                            <Link to={`/trade/${h.symbol}`} className="rounded-full bg-white/5 p-2 text-zinc-500 hover:bg-white/10 hover:text-white transition-colors">
                                                <ArrowRightLeft className="h-4 w-4" />
                                            </Link>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-1">Amount</p>
                                                <p className="text-xl font-black">{h.quantity}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-1">Avg Cost</p>
                                                <p className="text-xl font-black">${h.avgPrice.toFixed(2)}</p>
                                            </div>
                                        </div>

                                        <div className="mt-8 flex items-center justify-between border-t border-white/5 pt-4">
                                            <div className="flex items-center gap-2">
                                                {isPositive ? <TrendingUp className="h-4 w-4 text-emerald-500" /> : <TrendingDown className="h-4 w-4 text-rose-500" />}
                                                <span className={cn("text-xs font-black tracking-widest uppercase", isPositive ? "text-emerald-500" : "text-rose-500")}>
                                                    {isPositive ? "+" : ""}${Math.abs(pnl).toFixed(2)}
                                                </span>
                                            </div>
                                            <div className="text-[10px] font-bold text-emerald-500/50 uppercase tracking-widest animate-pulse">
                                                Market Live
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </section>

                {/* Trade History Section */}
                <section className="flex flex-col gap-6 lg:col-span-12 xl:col-span-4">
                    <div className="flex items-center gap-2">
                        <History className="h-5 w-5 text-zinc-500" />
                        <h2 className="text-xl font-bold tracking-tight">Trade Log</h2>
                    </div>

                    <div className="flex flex-col gap-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                        {tradesLoading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <div key={i} className="h-24 animate-pulse rounded-2xl border border-white/5 bg-zinc-900/40" />
                            ))
                        ) : trades.length === 0 ? (
                            <div className="rounded-2xl border border-dashed border-white/10 p-10 text-center">
                                <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-tighter">Event stream empty</p>
                            </div>
                        ) : (
                            trades.flatMap((t: any) => {
                                const isBuyer = t.buyUserId === userId;
                                const isSeller = t.sellUserId === userId;
                                const roles: string[] = [];
                                if (isBuyer) roles.push("BUY");
                                if (isSeller) roles.push("SELL");

                                return roles.map((role) => (
                                    <div key={`${t.id}-${role}`} className="relative flex flex-col gap-3 rounded-2xl border border-white/5 bg-zinc-950/40 p-5 transition-all hover:bg-zinc-900/30">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <span className={cn(
                                                    "rounded px-2 py-0.5 text-[10px] font-black tracking-widest uppercase",
                                                    role === "BUY" ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
                                                )}>
                                                    {role}
                                                </span>
                                                <span className="text-sm font-black tracking-tighter">{t.symbol}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-600">
                                                <Clock className="h-3 w-3" />
                                                {t.timestamp ? new Date(t.timestamp).toLocaleTimeString() : new Date().toLocaleTimeString()}
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold text-zinc-400">{t.quantity} Units</span>
                                                <span className="text-[10px] font-bold text-zinc-600 uppercase">Settled on L1</span>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-sm font-black text-white">${t.price.toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>
                                ));
                            })
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
}
