import { marketService } from "@/api/marketService";
import { OrderForm } from "@/components/OrderForm";
import { PriceChart } from "@/components/PriceChart";
import { useMarketWebSocket } from "@/hooks/useMarketWebSocket";
import { usePortfolio } from "@/hooks/usePortfolio";
import { cn } from "@/lib/utils";
import { useMarketStore } from "@/store/useMarketStore";
import { useQuery } from "@tanstack/react-query";
import {
    Activity,
    BarChart3,
    Building2,
    ChevronLeft,
    Cpu,
    Globe,
    Info,
    PieChart,
    ShieldCheck,
    TrendingUp,
    Wallet,
    Workflow,
    Zap
} from "lucide-react";
import { Link, useParams } from "react-router";

export default function StockDetailPage() {
    const { symbol } = useParams();
    const prices = useMarketStore((state) => state.prices);
    const currency = useMarketStore((state) => state.currency);
    const exchangeRate = useMarketStore((state) => state.exchangeRate);
    useMarketWebSocket(); // To keep prices ticking

    const { data: fundamentals } = useQuery({
        queryKey: ["fundamentals", symbol],
        queryFn: () => marketService.getFundamentals(symbol!),
        enabled: !!symbol,
    });

    const { data: portfolio } = usePortfolio();
    const position = portfolio?.holdings?.find(h => h.symbol === symbol);

    const currentPrice = prices[symbol!] || 0;
    const displayPrice = currency === "EUR" ? currentPrice * exchangeRate : currentPrice;

    return (
        <div className="flex flex-col min-h-screen bg-[#02040a] text-white overflow-hidden p-6 sm:p-12 relative gap-12">

            {/* Scientific Overlays */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(#3b82f6_1px,transparent_1px),linear-gradient(90deg,#3b82f6_1px,transparent_1px)] bg-[size:60px_60px]" />
                <div className="absolute top-0 right-0 w-[1200px] h-[1200px] bg-blue-500/[0.04] blur-[250px] rounded-full" />

                {/* Vertical Scanning Laser */}
                <div className="absolute top-0 left-0 w-[1px] h-full bg-blue-500/10 animate-[vscan_8s_linear_infinite]" />
            </div>

            {/* Professional Header */}
            <header className="relative z-10 flex flex-col gap-10 rounded-[40px] border border-white/5 bg-zinc-900/10 p-10 backdrop-blur-3xl overflow-hidden group">

                {/* HUD Marks */}
                <div className="absolute top-1/2 -translate-y-1/2 right-12 flex gap-8 opacity-[0.03] group-hover:opacity-[0.1] transition-opacity">
                    <Workflow className="w-16 h-16" />
                    <Cpu className="w-16 h-16" />
                </div>

                <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-10">
                    <div className="flex flex-col gap-6">
                        <Link to="/invest" className="flex items-center gap-2 text-[10px] font-black tracking-widest text-blue-500 uppercase hover:text-blue-400 transition-all hover:-translate-x-1">
                            <ChevronLeft className="h-4 w-4" />
                            Return to Asset Node
                        </Link>
                        <div className="flex items-center gap-8">
                            <div className="flex h-20 w-20 items-center justify-center rounded-[32px] bg-blue-600 shadow-[0_0_40px_rgba(37,99,235,0.3)] border border-white/10 relative overflow-hidden group/logo">
                                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                                <Building2 className="h-10 w-10 text-white relative z-10 group-hover/logo:scale-110 transition-transform" />
                            </div>
                            <div className="flex flex-col">
                                <div className="flex items-center gap-3">
                                    <h1 className="text-5xl lg:text-7xl font-black tracking-tighter uppercase italic leading-none">{symbol}</h1>
                                    <div className="px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-black text-emerald-500 uppercase tracking-widest mt-1">Market Open</div>
                                </div>
                                <p className="text-[11px] font-bold tracking-[0.5em] text-zinc-500 uppercase mt-4 flex items-center gap-2">
                                    <Globe className="h-3 w-3" />
                                    {symbol} Common Equity Asset // Node 0xAF_SECURED
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-end gap-2 text-right">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="h-1 w-1 rounded-full bg-blue-500 animate-pulse" />
                            <span className="text-[10px] font-black tracking-widest text-zinc-600 uppercase">Settlement Value (LOB)</span>
                        </div>
                        <div className="flex items-baseline gap-4">
                            <div className="flex items-center gap-2 text-emerald-500 px-4 py-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)] mb-1">
                                <TrendingUp className="h-4 w-4" />
                                <span className="text-xs font-black tracking-widest">+1.2% DEPRA</span>
                            </div>
                            <span className="text-6xl font-black tabular-nums tracking-tighter">
                                <span className="text-blue-500 mr-1 opacity-50">{currency === "EUR" ? "€" : "$"}</span>
                                {displayPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                        </div>
                    </div>
                </div>
            </header>

            <main className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 flex-1">
                {/* Left Column: Chart & Info */}
                <div className="lg:col-span-8 flex flex-col gap-10">
                    <div className="rounded-[48px] border border-white/5 bg-zinc-900/10 p-10 backdrop-blur-3xl shadow-2xl relative overflow-hidden group">

                        {/* Background Corner Marks */}
                        <div className="absolute top-0 right-0 p-8 opacity-[0.02]">
                            <BarChart3 className="w-24 h-24" />
                        </div>

                        <div className="flex items-center justify-between mb-10 relative z-10">
                            <div className="flex items-center gap-3">
                                <Activity className="h-3.5 w-3.5 text-blue-500" />
                                <span className="text-[11px] font-black tracking-[0.6em] text-zinc-500 uppercase italic">Institutional Performance Engine</span>
                            </div>
                            <div className="flex gap-2 bg-black/40 p-1 rounded-2xl border border-white/5">
                                {["1D", "1W", "1M", "1Y", "ALL"].map(t => (
                                    <button key={t} className={cn(
                                        "px-5 py-2 rounded-xl text-[10px] font-black tracking-widest transition-all uppercase",
                                        t === "1D" ? "bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]" : "text-zinc-500 hover:text-white hover:bg-white/5"
                                    )}>{t}</button>
                                ))}
                            </div>
                        </div>
                        <div className="h-[450px]">
                            <PriceChart symbol={symbol!} data={[]} />
                        </div>
                    </div>

                    {/* Fundamental Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[
                            { label: "Equity Cap", value: fundamentals?.marketCap ? `$${(fundamentals.marketCap / 1e12).toFixed(2)}T` : "N/A", icon: PieChart, color: "text-blue-500" },
                            { label: "Alpha Ratio", value: fundamentals?.peRatio?.toFixed(2) || "N/A", icon: Activity, color: "text-purple-500" },
                            { label: "Yield Yield", value: fundamentals?.dividendYield?.toFixed(2) + "%" || "N/A", icon: TrendingUp, color: "text-emerald-500" },
                            { label: "24H Volume", value: fundamentals?.volume24h ? `${(fundamentals.volume24h / 1e6).toFixed(1)}M` : "N/A", icon: BarChart3, color: "text-amber-500" }
                        ].map(stat => (
                            <div key={stat.label} className="rounded-[32px] border border-white/5 bg-zinc-900/20 p-8 group transition-all hover:bg-zinc-900/40 hover:border-blue-500/30 hover:-translate-y-1 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-[0.05] group-hover:opacity-[0.1] transition-opacity">
                                    <stat.icon className="h-8 w-8" />
                                </div>
                                <stat.icon className={cn("h-5 w-5 mb-6 transition-transform group-hover:scale-110", stat.color)} />
                                <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-2 leading-none">{stat.label}</p>
                                <p className="text-2xl font-black tracking-tighter text-white">{stat.value}</p>
                                <div className="mt-4 flex items-center gap-1.5 grayscale opacity-30 group-hover:grayscale-0 group-hover:opacity-100 transition-all">
                                    <div className="h-1 w-1 rounded-full bg-blue-500" />
                                    <span className="text-[8px] font-black tracking-widest text-zinc-600 uppercase">Safe_Channel_OK</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="rounded-[40px] border border-white/5 bg-zinc-900/10 p-10 backdrop-blur-2xl relative group">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 border border-white/10">
                                <Info className="h-5 w-5 text-blue-500" />
                            </div>
                            <div className="flex flex-col">
                                <h3 className="text-sm font-black uppercase tracking-[0.4em] text-white">Company Profile Analysis</h3>
                                <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest mt-1 italic">Verified Institutional Record #0x7F2</span>
                            </div>
                        </div>
                        <p className="text-base font-bold text-zinc-400 leading-relaxed italic pr-12">
                            {fundamentals?.companyDescription || "Leading global technology company focused on innovation and sustainable growth in the high-performance computing sector. Primary operations involve direct exchange settlements and algorithmic liquidity provisioning."}
                        </p>
                        <div className="absolute bottom-8 right-10 opacity-5 group-hover:opacity-10 transition-opacity">
                            <ShieldCheck className="w-12 h-12" />
                        </div>
                    </div>
                </div>

                {/* Right Column: Execution & Portfolio */}
                <aside className="lg:col-span-4 flex flex-col gap-10">

                    {/* Position Summary HUD */}
                    <div className="rounded-[44px] border border-white/5 bg-zinc-900/40 p-10 backdrop-blur-3xl shadow-2xl relative overflow-hidden group/pos hover:border-blue-500/30 transition-all">

                        {/* Status Glow */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-[50px] -translate-y-1/2 translate-x-1/2" />

                        <div className="flex items-center justify-between mb-10 relative z-10">
                            <div className="flex items-center gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-[18px] bg-blue-500/10 border border-blue-500/20 shadow-xl">
                                    <Wallet className="h-6 w-6 text-blue-400" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[11px] font-black tracking-[0.3em] text-white uppercase leading-none">Your Investment</span>
                                    <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest mt-1">Portfolio Core 0xAF</span>
                                </div>
                            </div>
                            <Zap className="h-4 w-4 text-blue-500/40 animate-pulse" />
                        </div>

                        {position ? (
                            <div className="flex flex-col gap-8 relative z-10">
                                <div className="flex flex-col">
                                    <div className="flex items-center gap-2 mb-2 opacity-50">
                                        <div className="h-1.5 w-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Active Position Exposure</span>
                                    </div>
                                    <p className="text-6xl font-black tabular-nums tracking-tighter text-white">{position.quantity} <span className="text-xl text-zinc-600 italic font-black">UNITS</span></p>
                                </div>

                                <div className="grid grid-cols-2 gap-6 p-6 rounded-[28px] bg-black/40 border border-white/5 backdrop-blur-md">
                                    <div className="flex flex-col gap-1">
                                        <p className="text-[9px] font-black uppercase tracking-widest text-zinc-600">Net P/L Flow</p>
                                        <div className="flex items-center gap-2">
                                            <TrendingUp className="h-4 w-4 text-emerald-400" />
                                            <p className="text-xl font-black truncate text-emerald-400">
                                                {currency === "EUR" ? "€" : "$"}{(position.unrealizedPnL || 0).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <p className="text-[9px] font-black uppercase tracking-widest text-zinc-600">Avg Cost (DMA)</p>
                                        <p className="text-xl font-black truncate text-white">
                                            {currency === "EUR" ? "€" : "$"}{(position.avgPrice || 0).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="relative z-10">
                                <div className="py-12 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-[32px] bg-white/[0.02] hover:bg-white/[0.04] transition-all group/empty">
                                    <div className="h-16 w-16 mb-6 rounded-full border border-white/5 flex items-center justify-center opacity-20 group-hover/empty:scale-110 transition-transform">
                                        <Zap className="h-8 w-8 text-white" />
                                    </div>
                                    <p className="text-xl font-black tracking-[0.4em] uppercase text-zinc-700 group-hover/empty:text-zinc-500 transition-colors">
                                        UNINVESTED
                                    </p>
                                    <span className="text-[9px] font-black tracking-widest text-zinc-800 uppercase mt-4">Node Disconnected // No Position</span>
                                </div>
                            </div>
                        )}

                        {/* Background Vector Marks */}
                        <div className="absolute -bottom-10 -left-10 opacity-10 blur-2xl">
                            <div className="h-40 w-40 rounded-full bg-white opacity-20" />
                        </div>
                    </div>

                    {/* Order Entry Node */}
                    <div className="rounded-[48px] border border-white/10 bg-zinc-950/60 p-10 backdrop-blur-xl relative overflow-hidden group/order">

                        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-blue-500/40 to-transparent opacity-0 group-hover/order:opacity-100 transition-opacity" />

                        <div className="mb-10 flex items-center justify-between">
                            <div className="flex flex-col gap-2">
                                <h3 className="text-xs font-black tracking-[0.5em] text-zinc-500 uppercase leading-none">Execution Engine</h3>
                                <div className="flex items-center gap-2">
                                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Active Settlement Node</span>
                                </div>
                            </div>
                            <Globe className="h-5 w-5 text-zinc-800" />
                        </div>

                        <OrderForm symbol={symbol!} />

                        <div className="mt-10 flex flex-col gap-4 border-t border-white/5 pt-8">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <ShieldCheck className="h-3 w-3 text-zinc-700" />
                                    <span className="text-[9px] font-black uppercase tracking-widest text-zinc-700">Security Core</span>
                                </div>
                                <span className="text-[9px] font-black uppercase tracking-widest text-blue-500/50">SHA_256_ACTIVE</span>
                            </div>
                            <div className="h-1 w-full bg-zinc-900 rounded-full overflow-hidden">
                                <div className="h-full w-[65%] bg-blue-600/30" />
                            </div>
                            <div className="flex items-center justify-center gap-3 grayscale hover:grayscale-0 transition-all opacity-20 hover:opacity-100 mt-2">
                                <div className="h-1 w-1 rounded-full bg-blue-500" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Institutional Settlement Engine V2.8.4</span>
                            </div>
                        </div>
                    </div>
                </aside>
            </main>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes vscan {
                    0% { transform: translateX(0); opacity: 0; }
                    50% { opacity: 1; }
                    100% { transform: translateX(100vw); opacity: 0; }
                }
            `}} />
        </div>
    );
}
