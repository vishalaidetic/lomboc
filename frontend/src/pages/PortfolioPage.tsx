import { usePortfolio, useRecentTrades } from "@/hooks/usePortfolio";
import { useProfile } from "@/hooks/useProfile";
import { cn } from "@/lib/utils";
import { useMarketStore } from "@/store/useMarketStore";
import { usePortfolioStore } from "@/store/usePortfolioStore";
import {
    Activity,
    ArrowRightLeft,
    Clock,
    Cpu,
    Database,
    History,
    Satellite,
    Server,
    ShieldCheck,
    TrendingDown,
    TrendingUp,
    Wallet,
    Zap
} from "lucide-react";
import { useEffect, useState } from "react";
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
    const [refreshTime, setRefreshTime] = useState(new Date().toLocaleTimeString('en-IN', { hour12: false }));

    useEffect(() => {
        const interval = setInterval(() => {
            setRefreshTime(new Date().toLocaleTimeString('en-IN', { hour12: false }));
        }, 30000);
        return () => clearInterval(interval);
    }, []);

    // Initial Sync
    useEffect(() => {
        if (initialPortfolio) setPortfolio(initialPortfolio.holdings);
    }, [initialPortfolio, setPortfolio]);

    useEffect(() => {
        if (initialTrades) setTrades(initialTrades);
    }, [initialTrades, setTrades]);

    // Live Calculation
    const liveStats = holdings.reduce((acc, h) => {
        const livePrice = prices[h.symbol] || h.avgPrice;
        const equity = livePrice * h.quantity;
        const unrealized = (livePrice - h.avgPrice) * h.quantity;
        const total = (h.realizedProfit || 0) + unrealized;

        return {
            wealth: acc.wealth + equity,
            profit: acc.profit + total
        };
    }, { wealth: 0, profit: 0 });

    return (
        <div className="flex flex-col min-h-screen bg-[#02040a] text-white overflow-hidden p-6 sm:p-12 relative gap-12">

            {/* Scientific Overlays */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(#3b82f6_1px,transparent_1px),linear-gradient(90deg,#3b82f6_1px,transparent_1px)] bg-[size:60px_60px]" />
                <div className="absolute top-0 left-0 w-full h-[1px] bg-blue-500/10 animate-[scan_12s_linear_infinite]" />
            </div>

            <header className="relative z-10 flex flex-col gap-10 rounded-[40px] border border-white/5 bg-zinc-900/10 p-10 backdrop-blur-3xl overflow-hidden group">

                {/* HUD Marks */}
                <div className="absolute top-1/2 -translate-y-1/2 right-12 flex gap-8 opacity-[0.03] group-hover:opacity-[0.1] transition-opacity">
                    <Database className="w-16 h-16" />
                    <Satellite className="w-16 h-16" />
                </div>

                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10">
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                            <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                            <span className="text-[10px] font-black uppercase tracking-[0.6em] text-blue-500">Asset Management Control</span>
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-black tracking-tighter uppercase italic leading-[0.9]">Portfolio <span className="text-blue-500">Node</span></h1>
                        <p className="text-[11px] font-bold tracking-[0.4em] text-zinc-600 uppercase mt-2 max-w-xl">
                            Real-time Clearing & Settlement // Vault Node: 0xAF_SECURED // Institutional Record #881
                        </p>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="hidden sm:flex flex-col items-end gap-1 px-8 border-l border-white/5">
                            <div className="flex items-center gap-2">
                                <Clock className="w-3 h-3 text-zinc-500" />
                                <span className="text-[9px] font-black tracking-widest text-zinc-600 uppercase">Last Refresh</span>
                            </div>
                            <span className="text-sm font-mono text-zinc-400 font-bold tracking-tighter">{refreshTime} LCL</span>
                        </div>
                        <div className="hidden sm:flex flex-col items-end gap-1 pl-8 border-l border-white/5 text-right">
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="w-3 h-3 text-emerald-500" />
                                <span className="text-[9px] font-black tracking-widest text-zinc-600 uppercase">Risk Engine</span>
                            </div>
                            <span className="text-[9px] font-mono font-bold uppercase text-emerald-400 italic">NOMINAL_0x7F2</span>
                        </div>
                    </div>
                </div>
            </header>

            <main className="relative z-10 grid grid-cols-1 gap-12 lg:grid-cols-12 flex-1">

                {/* 1. TOP_LINE METRICS */}
                <div className="col-span-full grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-[36px] border border-white/5 bg-zinc-900/20 p-8 backdrop-blur-3xl shadow-2xl transition-all hover:border-blue-500/30 group">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-inner group-hover:scale-110 transition-transform">
                                <Wallet className="h-6 w-6" />
                            </div>
                            <p className="text-[9px] font-black text-zinc-700 uppercase tracking-widest group-hover:text-blue-500 transition-colors italic">Wealth_Index</p>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1">Total Vault Value</span>
                            <div className="text-4xl font-black text-white tabular-nums tracking-tighter">
                                <span className="text-blue-500 mr-1 opacity-50">{currency === "EUR" ? "€" : "$"}</span>
                                {((currency === "EUR" ? liveStats.wealth * exchangeRate : liveStats.wealth) || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </div>
                            <div className="mt-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-500">
                                <TrendingUp className="h-4 w-4" />
                                +2.4% Momentum
                            </div>
                        </div>
                    </div>

                    <div className="rounded-[36px] border border-white/5 bg-zinc-900/20 p-8 backdrop-blur-3xl shadow-2xl transition-all hover:border-emerald-500/30 group">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-inner group-hover:scale-110 transition-transform">
                                <TrendingUp className="h-6 w-6" />
                            </div>
                            <p className="text-[9px] font-black text-zinc-700 uppercase tracking-widest group-hover:text-emerald-500 transition-colors italic">P/L_FLOW</p>
                        </div>
                        {(() => {
                            const val = currency === "EUR" ? liveStats.profit * exchangeRate : liveStats.profit;
                            const isPositive = val >= 0;
                            return (
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1">Net Realized Profit</span>
                                    <div className={cn("text-4xl font-black tabular-nums tracking-tighter", isPositive ? "text-emerald-400" : "text-rose-400")}>
                                        {isPositive ? "+" : "-"}
                                        <span className={cn("mr-1 opacity-50", isPositive ? "text-emerald-600" : "text-rose-600")}>{currency === "EUR" ? "€" : "$"}</span>
                                        {Math.abs(val || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </div>
                                    <div className="mt-4 text-[10px] font-black text-zinc-600 uppercase tracking-widest">Across {holdings.length} Assets</div>
                                </div>
                            );
                        })()}
                    </div>

                    <div className="rounded-[36px] border border-white/5 bg-zinc-900/20 p-8 backdrop-blur-3xl shadow-2xl transition-all hover:border-amber-500/30 group">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-inner group-hover:scale-110 transition-transform">
                                <ArrowRightLeft className="h-6 w-6" />
                            </div>
                            <p className="text-[9px] font-black text-zinc-700 uppercase tracking-widest group-hover:text-amber-500 transition-colors italic">Trade_Pulse</p>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1">Settled Transactions</span>
                            <div className="text-4xl font-black text-white tabular-nums tracking-tighter">
                                {initialPortfolio?.tradeCount || 14}
                                <span className="text-xl opacity-30 italic ml-2 font-black text-zinc-400">EVNT</span>
                            </div>
                            <div className="mt-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-600">
                                <ShieldCheck className="h-3 w-3" />
                                100% Verification
                            </div>
                        </div>
                    </div>
                    <div className="rounded-[36px] border border-white/5 bg-zinc-900/20 p-8 backdrop-blur-3xl shadow-2xl transition-all hover:border-violet-500/30 group">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-400 border border-violet-500/20 shadow-inner group-hover:scale-110 transition-transform">
                                <Activity className="h-6 w-6" />
                            </div>
                            <p className="text-[9px] font-black text-zinc-700 uppercase tracking-widest group-hover:text-violet-500 transition-colors italic">RISK_NODE</p>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1">Health Quotient</span>
                            <div className="text-4xl font-black text-white tabular-nums tracking-tighter">
                                94.2
                                <span className="text-xl opacity-30 italic ml-2 font-black text-violet-400">%</span>
                            </div>
                            <div className="mt-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-500">
                                <ShieldCheck className="h-3 w-3" />
                                Nominal_Engine
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. HOLDINGS MANIFEST */}
                <section className="flex flex-col gap-10 lg:col-span-12 xl:col-span-8">
                    <div className="flex items-center justify-between border-b border-white/5 pb-8">
                        <div className="flex items-center gap-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/10 border border-blue-500/20">
                                <Server className="h-5 w-5 text-blue-500" />
                            </div>
                            <div className="flex flex-col">
                                <h2 className="text-2xl font-black uppercase tracking-tighter italic italic pr-4 border-r border-white/5 mr-4 leading-none">Your Assets</h2>
                                <span className="text-[9px] font-black tracking-widest text-zinc-600 uppercase mt-1">Direct Vault Storage</span>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-600/10 border border-blue-500/30">
                                <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
                                <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">
                                    {holdings.length} Active Positions
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                        {portfolioLoading ? (
                            Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="h-64 animate-pulse rounded-[40px] border border-white/5 bg-zinc-900/10" />
                            ))
                        ) : holdings.length === 0 ? (
                            <div className="col-span-full rounded-[48px] border-2 border-dashed border-white/5 p-24 text-center group hover:bg-white/[0.02] transition-all">
                                <Zap className="h-16 w-16 text-zinc-800 mx-auto mb-6 group-hover:scale-110 transition-transform" />
                                <p className="text-xl font-black text-zinc-700 uppercase tracking-[0.5em] group-hover:text-zinc-500 transition-colors">No assets found in vault</p>
                                <span className="text-[10px] font-black tracking-widest text-zinc-800 uppercase mt-4 block">Node Disconnected // 0xAF_IDLE</span>
                            </div>
                        ) : (
                            holdings.map((h) => {
                                const pnl = h.unrealizedPnL;
                                const isPositive = pnl >= 0;

                                return (
                                    <div key={h.id} className="group relative overflow-hidden rounded-[44px] border border-white/5 bg-zinc-900/10 p-10 transition-all hover:bg-zinc-900/20 hover:border-blue-500/30 hover:-translate-y-2">

                                        {/* HUD Corner Decor */}
                                        <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-all">
                                            <Cpu className="w-20 h-20" />
                                        </div>

                                        <div className="mb-10 flex items-center justify-between relative z-10">
                                            <div className="flex flex-col">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-3xl font-black tracking-tighter uppercase italic group-hover:text-blue-400 transition-colors">{h.symbol}</span>
                                                    <div className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[8px] font-bold text-zinc-600 uppercase">Asset_OK</div>
                                                </div>
                                                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.3em] mt-1 italic">Spot Position Node</span>
                                            </div>
                                            <Link to={`/trade/${h.symbol}`} className="rounded-[20px] bg-white/5 p-4 text-zinc-500 border border-white/10 hover:bg-blue-600 hover:text-white hover:border-blue-500 hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all">
                                                <ArrowRightLeft className="h-5 w-5" />
                                            </Link>
                                        </div>

                                        <div className="grid grid-cols-2 gap-8 relative z-10">
                                            <div className="flex flex-col">
                                                <p className="text-[10px] font-black text-zinc-700 uppercase tracking-widest mb-2">Exposure</p>
                                                <p className="text-3xl font-black tabular-nums tracking-tighter">{h.quantity} <span className="text-base opacity-30 italic font-black">UNIT</span></p>
                                            </div>
                                            <div className="text-right flex flex-col items-end">
                                                <p className="text-[10px] font-black text-zinc-700 uppercase tracking-widest mb-2">DMA_COST</p>
                                                <p className="text-3xl font-black tabular-nums tracking-tighter">${h.avgPrice.toFixed(2)}</p>
                                            </div>
                                        </div>

                                        <div className="mt-10 flex items-center justify-between border-t border-white/5 pt-8 relative z-10">
                                            <div className={cn(
                                                "flex items-center gap-3 px-5 py-2.5 rounded-2xl border transition-all",
                                                isPositive ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-rose-500/10 border-rose-500/20 text-rose-400"
                                            )}>
                                                {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                                                <span className="text-base font-black tracking-tighter tabular-nums">
                                                    {isPositive ? "+" : "-"}${Math.abs(pnl).toFixed(2)}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 grayscale opacity-30 group-hover:grayscale-0 group-hover:opacity-100 transition-all">
                                                <div className="h-1 w-1 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                                                <span className="text-[9px] font-black tracking-widest text-zinc-600 uppercase leading-none">Synced</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </section>

                {/* 3. SETTLEMENT LOG (Trade History) */}
                <section className="flex flex-col gap-8 lg:col-span-12 xl:col-span-4 xl:h-[750px]">
                    <div className="rounded-[40px] border border-white/10 bg-zinc-950/60 p-8 backdrop-blur-3xl shadow-2xl h-full flex flex-col overflow-hidden">
                        <div className="flex items-center justify-between mb-10 border-b border-white/5 pb-8">
                            <div className="flex items-center gap-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-800/50 border border-white/5">
                                    <History className="h-5 w-5 text-zinc-400" />
                                </div>
                                <div className="flex flex-col">
                                    <h2 className="text-xl font-black uppercase italic tracking-tighter leading-none">Trade Log</h2>
                                    <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest mt-1">Audit Trail Active</span>
                                </div>
                            </div>
                            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        </div>

                        <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-4 custom-scrollbar scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
                            {tradesLoading ? (
                                Array.from({ length: 6 }).map((_, i) => (
                                    <div key={i} className="h-24 animate-pulse rounded-2xl border border-white/5 bg-zinc-900/10" />
                                ))
                            ) : trades.length === 0 ? (
                                <div className="rounded-3xl border-2 border-dashed border-white/5 p-16 text-center">
                                    <p className="text-[9px] font-black text-zinc-800 uppercase tracking-widest">No transaction events detected</p>
                                </div>
                            ) : (
                                trades.flatMap((t: any) => {
                                    const isBuyer = t.buyUserId === userId;
                                    const isSeller = t.sellUserId === userId;
                                    const roles: string[] = [];
                                    if (isBuyer) roles.push("BUY");
                                    if (isSeller) roles.push("SELL");

                                    return roles.map((role) => (
                                        <div key={`${t.id}-${role}`} className="group relative flex flex-col gap-4 rounded-3xl border border-white/5 bg-black/40 p-6 transition-all hover:bg-zinc-900/40 hover:border-white/10 hover:shadow-xl">
                                            <div className="absolute top-4 right-4 opacity-5 group-hover:opacity-20 transition-opacity">
                                                <Zap className="w-4 h-4" />
                                            </div>

                                            <div className="flex items-center justify-between relative z-10">
                                                <div className="flex items-center gap-3">
                                                    <span className={cn(
                                                        "rounded-lg px-2.5 py-1 text-[10px] font-black tracking-widest uppercase",
                                                        role === "BUY" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                                                    )}>
                                                        {role}
                                                    </span>
                                                    <span className="text-base font-black tracking-tighter uppercase italic">{t.symbol}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-[9px] font-bold text-zinc-600">
                                                    <Clock className="h-3 w-3" />
                                                    {t.timestamp ? new Date(t.timestamp).toLocaleTimeString('en-IN', { hour12: false }) : new Date().toLocaleTimeString('en-IN', { hour12: false })}
                                                </div>
                                            </div>

                                            <div className="flex items-end justify-between relative z-10 translate-y-1">
                                                <div className="flex flex-col">
                                                    <span className="text-lg font-black tracking-tighter text-white/90 leading-none">{t.quantity} <span className="text-[10px] opacity-30 italic font-black">VOL</span></span>
                                                    <span className="text-[9px] font-bold text-zinc-700 uppercase tracking-widest mt-1">Cleared L1_NODE</span>
                                                </div>
                                                <div className="text-right flex flex-col">
                                                    <span className="text-[9px] font-black text-zinc-700 uppercase tracking-widest mb-1">Price_Index</span>
                                                    <span className="text-lg font-black text-white tabular-nums tracking-tighter leading-none">${t.price.toFixed(2)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ));
                                })
                            )}
                        </div>
                    </div>
                </section>
            </main>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes scan {
                    0% { transform: translateY(0); opacity: 0; }
                    50% { opacity: 1; }
                    100% { transform: translateY(100vh); opacity: 0; }
                }
            `}} />
        </div>
    );
}
