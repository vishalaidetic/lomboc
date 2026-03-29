import { marketService } from "@/api/marketService";
import { usePortfolio } from "@/hooks/usePortfolio";
import { cn } from "@/lib/utils";
import { useMarketStore } from "@/store/useMarketStore";
import { useQuery } from "@tanstack/react-query";
import type { IChartApi } from "lightweight-charts";
import { AreaSeries, ColorType, createChart } from "lightweight-charts";
import {
    Activity,
    ArrowUpRight,
    ChevronRight,
    Cpu,
    Database,
    Globe,
    PieChart,
    Search,
    ShieldCheck,
    TrendingUp,
    Wallet,
    Workflow,
    Zap
} from "lucide-react";
import { useEffect, useRef } from "react";
import { Link } from "react-router";

export default function DashboardPage() {
    const prices = useMarketStore((state) => state.prices);
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<IChartApi | null>(null);
    const { data: portfolio } = usePortfolio();
    const { data: allMarkets } = useQuery({
        queryKey: ["markets"],
        queryFn: () => marketService.getSymbols(),
    });

    // Calculate Summary Stats
    const totalWealth = (portfolio?.holdings || []).reduce((acc, h) => {
        const price = prices[h.symbol] || h.avgPrice;
        return acc + (price * h.quantity);
    }, 0);

    const assetTypes = (portfolio?.holdings || []).reduce((acc, h) => {
        const price = prices[h.symbol] || h.avgPrice;
        const market = allMarkets?.find(m => m.symbol === h.symbol);
        const type = market?.type || "OTHER";
        acc[type] = (acc[type] || 0) + (price * h.quantity);
        return acc;
    }, {} as Record<string, number>);

    // Initialize Chart
    useEffect(() => {
        if (!chartContainerRef.current) return;

        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: "transparent" },
                textColor: "#52525b",
                fontSize: 10,
            },
            grid: {
                vertLines: { color: "rgba(255, 255, 255, 0.02)" },
                horzLines: { color: "rgba(255, 255, 255, 0.02)" },
            },
            timeScale: {
                borderVisible: false,
                rightOffset: 5,
            },
            rightPriceScale: {
                borderVisible: false,
            },
            handleScroll: false,
            handleScale: false,
            autoSize: true,
        });

        const areaSeries = chart.addSeries(AreaSeries, {
            lineColor: "#3b82f6",
            topColor: "rgba(59, 130, 246, 0.2)",
            bottomColor: "rgba(59, 130, 246, 0)",
            lineWidth: 3,
        });

        // Mock Performance Data
        const mockData = Array.from({ length: 100 }).map((_, i) => ({
            time: (Date.now() / 1000 - (100 - i) * 3600) as any,
            value: 45000 + Math.sin(i / 10) * 5000 + i * 100 + Math.random() * 500,
        }));

        areaSeries.setData(mockData);
        chart.timeScale().fitContent();
        chartRef.current = chart;

        const handleResize = () => {
            if (chartContainerRef.current) {
                chart.applyOptions({ width: chartContainerRef.current.clientWidth });
            }
        };

        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
            chart.remove();
        };
    }, []);

    return (
        <div className="flex flex-col min-h-screen bg-[#02040a] text-white overflow-hidden p-6 sm:p-12 relative gap-12">

            {/* Scientific Overlays */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(#3b82f6_1px,transparent_1px),linear-gradient(90deg,#3b82f6_1px,transparent_1px)] bg-[size:60px_60px]" />
                <div className="absolute top-0 right-0 w-[1400px] h-[1400px] bg-blue-500/[0.04] blur-[300px] rounded-full" />

                {/* Horizontal Scanning Laser */}
                <div className="absolute top-0 left-0 w-full h-[1px] bg-blue-500/10 animate-[scan_15s_linear_infinite]" />
            </div>

            <header className="relative z-10 flex flex-col gap-10 rounded-[40px] border border-white/5 bg-zinc-900/10 p-10 backdrop-blur-3xl overflow-hidden group">

                {/* HUD Marks */}
                <div className="absolute top-1/2 -translate-y-1/2 right-12 flex gap-8 opacity-[0.03] group-hover:opacity-[0.1] transition-opacity">
                    <Database className="w-16 h-16" />
                    <Workflow className="w-16 h-16" />
                </div>

                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10">
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                            <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-500">Global Command Dashboard</span>
                        </div>
                        <h1 className="text-5xl lg:text-8xl font-black tracking-tighter uppercase italic leading-[0.85]">Mission <span className="text-blue-500">Control</span></h1>
                        <p className="text-[11px] font-bold tracking-[0.4em] text-zinc-600 uppercase mt-4 max-w-2xl leading-relaxed">
                            Centralized Asset Orchestration // Secure Node: 0xAF_882 // Real-time Telemetry Enabled
                        </p>
                    </div>

                    <div className="flex flex-col items-end text-right gap-3">
                        <div className="flex items-center gap-2 mb-1 px-4 py-1.5 rounded-full bg-blue-600/10 border border-blue-500/20">
                            <ShieldCheck className="w-3 h-3 text-emerald-400" />
                            <span className="text-[10px] font-black tracking-widest text-emerald-400 uppercase">Secure Connection</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black tracking-widest text-zinc-700 uppercase mb-1 leading-none italic">DMA_SYNC_REFRESH</span>
                            <span className="text-2xl font-mono text-zinc-400 font-bold tracking-tighter uppercase">OK_0x4F_ACTIVE</span>
                        </div>
                    </div>
                </div>
            </header>

            <main className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 flex-1">

                {/* 1. PRIMARY_TELEMETRY (Left Column) */}
                <div className="lg:col-span-8 flex flex-col gap-12">

                    {/* Performance Stage */}
                    <div className="rounded-[56px] border border-white/5 bg-zinc-900/10 p-12 backdrop-blur-3xl shadow-2xl relative overflow-hidden group">

                        <div className="flex items-center justify-between mb-12 relative z-10">
                            <div className="flex flex-col gap-1">
                                <span className="text-[11px] font-black tracking-[0.6em] text-zinc-600 uppercase">Growth_Vector_Index</span>
                                <h2 className="text-4xl font-black tracking-tighter uppercase italic">Wealth Evolution</h2>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="text-right">
                                    <p className="text-[10px] font-bold text-zinc-700 uppercase tracking-widest mb-1">Total Vault Value</p>
                                    <p className="text-3xl font-black tabular-nums tracking-tighter text-blue-500">${totalWealth.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                                </div>
                                <div className="h-10 w-[1px] bg-white/5" />
                                <div className="px-4 py-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                                    <TrendingUp className="w-4 h-4" />
                                </div>
                            </div>
                        </div>

                        <div ref={chartContainerRef} className="h-[380px] w-full relative z-10" />

                        <div className="mt-8 flex items-center justify-between border-t border-white/5 pt-8 relative z-10 opacity-30 group-hover:opacity-100 transition-opacity">
                            <div className="flex gap-6">
                                {["L1_SYNC", "HEARTBEAT_OK", "AUDIT_ENABLED"].map(tag => (
                                    <div key={tag} className="flex items-center gap-2">
                                        <div className="h-1 w-1 rounded-full bg-blue-500" />
                                        <span className="text-[9px] font-black uppercase tracking-widest text-zinc-600">{tag}</span>
                                    </div>
                                ))}
                            </div>
                            <span className="text-[9px] font-bold text-zinc-800 uppercase tracking-widest">Protocol Version 8.2.1</span>
                        </div>
                    </div>

                    {/* Market Hotlist */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="rounded-[44px] border border-white/5 bg-zinc-900/20 p-10 hover:border-blue-500/30 transition-all group">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <Zap className="h-4 w-4 text-amber-500 group-hover:animate-pulse" />
                                    <h3 className="text-sm font-black uppercase tracking-[0.4em] text-white">Top Performance</h3>
                                </div>
                                <Link to="/invest" className="text-zinc-600 hover:text-white transition-colors">
                                    <Search className="h-4 w-4" />
                                </Link>
                            </div>
                            <div className="flex flex-col gap-6">
                                {["NVDA", "AAPL", "BTCUSD"].map(symbol => (
                                    <div key={symbol} className="flex items-center justify-between p-4 rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-all cursor-pointer">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 text-blue-400 font-black text-xs">
                                                {symbol[0]}
                                            </div>
                                            <div>
                                                <p className="text-sm font-black tracking-tighter">{symbol}</p>
                                                <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Equities Node</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-black tabular-nums">${(prices[symbol] || 0).toLocaleString()}</p>
                                            <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest">+4.2%</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="rounded-[44px] border border-white/5 bg-zinc-900/20 p-10 hover:border-blue-500/30 transition-all group">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <Activity className="h-4 w-4 text-blue-500" />
                                    <h3 className="text-sm font-black uppercase tracking-[0.4em] text-white">Risk Exposure</h3>
                                </div>
                                <ShieldCheck className="h-4 w-4 text-zinc-800" />
                            </div>
                            <div className="flex flex-col gap-5">
                                {[
                                    { label: "Equity Margin", value: "98.4%", color: "bg-emerald-500" },
                                    { label: "Risk Coefficient", value: "0.12", color: "bg-blue-500" },
                                    { label: "Liquidity Pool", value: "$42.1M", color: "bg-amber-500" }
                                ].map(item => (
                                    <div key={item.label} className="flex flex-col gap-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">{item.label}</span>
                                            <span className="text-[10px] font-black text-white">{item.value}</span>
                                        </div>
                                        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                            <div className={cn("h-full transition-all duration-1000", item.color)} style={{ width: "70%" }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. SECONDARY_INSIGHTS (Right Column) */}
                <aside className="lg:col-span-4 flex flex-col gap-12">

                    {/* Allocation Donut */}
                    <div className="rounded-[48px] border border-white/10 bg-zinc-900/10 p-10 backdrop-blur-3xl relative overflow-hidden group">
                        <div className="flex items-center gap-4 mb-10">
                            <PieChart className="h-5 w-5 text-blue-500" />
                            <h3 className="text-xs font-black uppercase tracking-[0.4em] text-white">Asset Allocation</h3>
                        </div>

                        <div className="relative flex items-center justify-center py-8">
                            {/* Modern SVG Donut with Glass Shadows */}
                            <svg className="w-52 h-52 -rotate-90">
                                <circle cx="104" cy="104" r="90" fill="transparent" stroke="rgba(255,255,255,0.03)" strokeWidth="24" />
                                <circle
                                    cx="104" cy="104" r="90"
                                    fill="transparent"
                                    stroke="#3b82f6"
                                    strokeWidth="24"
                                    strokeDasharray="565"
                                    strokeDashoffset="140"
                                    strokeLinecap="round"
                                    className="drop-shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                                />
                                <circle
                                    cx="104" cy="104" r="90"
                                    fill="transparent"
                                    stroke="#ec4899"
                                    strokeWidth="24"
                                    strokeDasharray="565"
                                    strokeDashoffset="480"
                                    strokeLinecap="round"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-[10px] font-black text-zinc-700 uppercase tracking-widest">Diversified</span>
                                <span className="text-3xl font-black tracking-tighter">0xAF</span>
                            </div>
                        </div>

                        <div className="mt-10 flex flex-col gap-4">
                            {Object.entries(assetTypes).map(([type, value]) => (
                                <div key={type} className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                                    <div className="flex items-center gap-3">
                                        <div className={cn("h-2 w-2 rounded-full", type === "STOCK" ? "bg-blue-500" : "bg-pink-500")} />
                                        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{type} Assets</span>
                                    </div>
                                    <span className="text-sm font-black tabular-nums">${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Access Grid */}
                    <div className="flex-1 rounded-[48px] border border-white/5 bg-zinc-950/40 p-10 flex flex-col gap-8">
                        <div className="flex items-center gap-4 border-b border-white/5 pb-6">
                            <Workflow className="h-5 w-5 text-zinc-600" />
                            <h3 className="text-xs font-black uppercase tracking-[0.4em] text-white">System Portals</h3>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { label: "Trading Terminal", to: "/trade/BTCUSD", icon: Activity, desc: "Execute Orders" },
                                { label: "Asset Discovery", to: "/invest", icon: Globe, desc: "Find Stocks" },
                                { label: "Vault Control", to: "/portfolio", icon: Wallet, desc: "Manage Assets" },
                                { label: "System Config", to: "/", icon: Cpu, desc: "Node State" }
                            ].map(portal => (
                                <Link key={portal.label} to={portal.to} className="group p-6 rounded-[32px] border border-white/5 bg-zinc-900/40 hover:bg-blue-600 hover:border-blue-500 transition-all">
                                    <portal.icon className="h-5 w-5 text-zinc-600 group-hover:text-white mb-6 group-hover:scale-110 transition-transform" />
                                    <p className="text-[10px] font-black uppercase tracking-widest text-white mb-1 leading-tight">{portal.label}</p>
                                    <p className="text-[8px] font-bold text-zinc-600 group-hover:text-white/60 uppercase tracking-tighter">{portal.desc}</p>
                                </Link>
                            ))}
                        </div>

                        <div className="mt-auto p-6 rounded-[32px] bg-blue-600/10 border border-blue-500/20 flex items-center justify-between group cursor-pointer overflow-hidden relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                            <div className="flex items-center gap-4 relative z-10">
                                <ArrowUpRight className="h-5 w-5 text-blue-500" />
                                <span className="text-[11px] font-black uppercase tracking-[0.4em] text-blue-500">Upgrade to L2 Node</span>
                            </div>
                            <ChevronRight className="h-4 w-4 text-blue-500 relative z-10" />
                        </div>
                    </div>

                </aside>
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
