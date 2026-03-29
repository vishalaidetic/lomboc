import { marketService } from "@/api/marketService";
import { useMarketStore } from "@/store/useMarketStore";
import { useQuery } from "@tanstack/react-query";
import {
    Activity,
    ArrowRight,
    Building2,
    Cpu,
    Database,
    Globe,
    Search,
    ShieldCheck,
    TrendingUp,
    Workflow,
    Zap
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";

export default function InvestPage() {
    const [search, setSearch] = useState("");
    const prices = useMarketStore((state) => state.prices);
    const currency = useMarketStore((state) => state.currency);
    const exchangeRate = useMarketStore((state) => state.exchangeRate);

    const { data: allMarkets } = useQuery({
        queryKey: ["markets"],
        queryFn: () => marketService.getSymbols(),
    });

    const stocks = allMarkets?.filter(m => m.type === "STOCK") || [];
    const filteredStocks = stocks.filter(s =>
        s.symbol.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="flex flex-col min-h-screen bg-[#02040a] text-white overflow-hidden p-6 sm:p-12 relative">

            {/* Scientific Overlays */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(#3b82f6_1px,transparent_1px),linear-gradient(90deg,#3b82f6_1px,transparent_1px)] bg-[size:60px_60px]" />
                <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-blue-500/[0.03] blur-[250px] rounded-full" />

                {/* Horizontal Scanning Laser */}
                <div className="absolute top-0 left-0 w-full h-[1px] bg-blue-500/10 animate-[scan_15s_linear_infinite]" />
            </div>

            <header className="relative z-10 mb-16 flex flex-col gap-10">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10 rounded-[40px] border border-white/5 bg-zinc-900/10 p-10 backdrop-blur-3xl relative overflow-hidden group">

                    {/* Interior HUD Marks */}
                    <div className="absolute top-1/2 -translate-y-1/2 right-10 flex gap-6 opacity-[0.03] group-hover:opacity-[0.1] transition-opacity">
                        <Database className="w-16 h-16" />
                        <Workflow className="w-16 h-16" />
                    </div>

                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                            <Activity className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-500">Asset Discovery Core</span>
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-black tracking-tighter uppercase italic leading-[0.9]">Company <span className="text-blue-500">Equity</span></h1>
                        <p className="text-[11px] font-bold tracking-[0.4em] text-zinc-500 uppercase max-w-lg mt-2 leading-relaxed">
                            Institutional Grade Stock Investment Portal // Direct Exchange Access Enabled
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex flex-col items-end gap-1 px-8 border-l border-white/5">
                            <div className="flex items-center gap-2">
                                <Zap className="w-3 h-3 text-blue-400" />
                                <span className="text-[9px] font-black tracking-widest text-zinc-600 uppercase">Search Port</span>
                            </div>
                            <span className="text-sm font-mono text-blue-400 font-bold tracking-tighter uppercase">PZ_0x4F_ACTIVE</span>
                        </div>
                        <div className="hidden sm:flex flex-col items-end gap-1 pl-8 border-l border-white/5 text-right">
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="w-3 h-3 text-emerald-500" />
                                <span className="text-[9px] font-black tracking-widest text-zinc-600 uppercase">Liquidity Status</span>
                            </div>
                            <span className="text-[9px] font-mono font-bold uppercase text-emerald-400">0x7F2_SYMMETRIC_OK</span>
                        </div>
                    </div>
                </div>

                <div className="relative group max-w-3xl mx-auto w-full">
                    <div className="absolute inset-x-4 -top-0 height-[1px] bg-blue-500/0 group-focus-within:bg-blue-500/50 transition-all duration-700 blur-[2px]" />
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-600 group-focus-within:text-blue-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="SEARCH_MARKETS (AAPL, TSLA, NVDA...)"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="h-16 w-full rounded-[32px] border border-white/5 bg-zinc-950/60 pl-16 pr-8 text-sm font-black uppercase tracking-[0.2em] text-white outline-none transition-all focus:bg-zinc-900 focus:border-blue-500/40 focus:ring-4 focus:ring-blue-500/10 placeholder:text-zinc-800"
                    />
                </div>
            </header>

            <main className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredStocks.map((stock) => {
                    const price = prices[stock.symbol] || stock.lastPrice || 0;
                    const displayPrice = currency === "EUR" ? price * exchangeRate : price;

                    return (
                        <div key={stock.symbol} className="group relative overflow-hidden rounded-[48px] border border-white/5 bg-zinc-900/10 p-10 backdrop-blur-3xl transition-all hover:-translate-y-2 hover:bg-zinc-900/20 hover:border-blue-500/30 hover:shadow-[0_40px_80px_rgba(0,0,0,0.4)]">

                            {/* HUD Watermark */}
                            <div className="absolute top-10 right-10 opacity-[0.02] group-hover:opacity-[0.08] transition-opacity">
                                <Cpu className="w-16 h-16" />
                            </div>

                            <div className="flex items-center justify-between mb-10">
                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner border border-white/5">
                                    <Building2 className="h-7 w-7" />
                                </div>
                                <div className="text-right flex flex-col items-end gap-1">
                                    <span className="text-[9px] font-black tracking-[0.3em] text-zinc-600 uppercase">Engine Status</span>
                                    <div className="flex items-center gap-2">
                                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" />
                                        <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest leading-none">Live Node 0xAF</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-4">
                                <div className="flex items-center gap-3">
                                    <h3 className="text-3xl font-black tracking-tighter uppercase italic text-white group-hover:text-blue-400 transition-colors">{stock.symbol}</h3>
                                    <div className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[8px] font-black text-zinc-500 group-hover:text-white transition-colors uppercase">NASDAQ</div>
                                </div>
                                <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-[0.3em] mt-1 italic">{stock.symbol} INC // Equity Asset</p>
                            </div>

                            <div className="flex items-center gap-3 mt-8">
                                <div className="flex flex-col">
                                    <span className="text-[9px] font-black uppercase text-zinc-700 tracking-widest">Mark-at-Market (USD)</span>
                                    <span className="text-4xl font-black tabular-nums tracking-tighter mt-1 group-hover:scale-105 transition-transform origin-left">
                                        <span className="text-blue-500 mr-1">{currency === "EUR" ? "€" : "$"}</span>
                                        {displayPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-10 flex items-center justify-between">
                                <Link
                                    to={`/invest/${stock.symbol}`}
                                    className="flex items-center gap-3 rounded-[20px] bg-white/5 border border-white/10 px-6 py-3.5 text-[10px] font-black uppercase tracking-widest text-zinc-400 transition-all hover:bg-blue-600 hover:text-white hover:border-blue-500 hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] relative group/btn"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700" />
                                    Access Asset
                                    <ArrowRight className="h-4 w-4 relative z-10" />
                                </Link>

                                <div className="flex items-center gap-2 text-emerald-500 px-4 py-1.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                                    <TrendingUp className="h-3.5 w-3.5" />
                                    <span className="text-[10px] font-black tracking-widest leading-none">+1.24%</span>
                                </div>
                            </div>

                            {/* Corner Decorative HUD Marks */}
                            <div className="absolute bottom-0 right-0 p-4 opacity-[0.03]">
                                <Globe className="h-4 w-4" />
                            </div>
                        </div>
                    );
                })}
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
