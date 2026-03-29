import { marketService } from "@/api/marketService";
import { OrderBook } from "@/components/OrderBook";
import { OrderForm } from "@/components/OrderForm";
import { OrderList } from "@/components/OrderList";
import { PriceChart } from "@/components/PriceChart";
import { PriceTicker } from "@/components/PriceTicker";
import { SimulationPanel } from "@/components/SimulationPanel";
import { useMarketWebSocket } from "@/hooks/useMarketWebSocket";
import { cn } from "@/lib/utils";
import { useMarketStore } from "@/store/useMarketStore";
import { useQuery } from "@tanstack/react-query";
import {
    Activity,
    ActivityIcon,
    BarChart4,
    ChevronDown,
    Clock,
    Cpu,
    Database,
    Globe,
    HardDrive,
    Satellite,
    Settings,
    ShieldCheck,
    TrendingUp,
    Workflow,
    Zap
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";

export default function TradePage() {
    const { symbol: urlSymbol } = useParams();
    const navigate = useNavigate();
    const { currentSymbol: symbol, setCurrentSymbol, currency, setCurrency, symbols, setSymbols, exchangeRate, setExchangeRate } = useMarketStore();
    const { isConnected, latency } = useMarketWebSocket();
    const updatePrice = useMarketStore((state) => state.updatePrice);

    // Sync URL with Store
    useEffect(() => {
        if (urlSymbol && urlSymbol !== symbol) {
            setCurrentSymbol(urlSymbol);
        }
    }, [urlSymbol, symbol, setCurrentSymbol]);

    // Fetch Full Market Metadata
    useQuery({
        queryKey: ["symbols"],
        queryFn: async () => {
            const data = await marketService.getSymbols();
            setSymbols(data);
            return data;
        },
    });

    // Fetch EUR Exchange Rate
    useQuery({
        queryKey: ["rate"],
        queryFn: async () => {
            const data = await marketService.getExchangeRate();
            if (data?.EUR) setExchangeRate(data.EUR);
            return data;
        },
    });

    const [uiPriceData, setUiPriceData] = useState<{ time: number; value: number }[]>([]);
    const [uiOrderBook, setUiOrderBook] = useState<{ bids: any[]; asks: any[] }>({ bids: [], asks: [] });
    const [telemetry, setTelemetry] = useState<string[]>([]);

    const lastPriceRef = useRef<{ time: number; value: number } | null>(null);
    const lastBookRef = useRef<{ bids: any[]; asks: any[] } | null>(null);
    const frameRef = useRef<number | null>(null);

    const { data: latestPrice } = useQuery({
        queryKey: ["price", symbol],
        queryFn: () => marketService.getLatestPrice(symbol),
        refetchInterval: 1000,
        enabled: !!symbol,
    });

    const { data: bookData } = useQuery({
        queryKey: ["orderbook", symbol],
        queryFn: () => marketService.getOrderBook(symbol),
        refetchInterval: 1000,
        enabled: !!symbol,
    });

    // Live Telemetry Stream
    useEffect(() => {
        const interval = setInterval(() => {
            const entry = `${Math.random().toString(36).substr(2, 4).toUpperCase()}_DMA_${Date.now().toString(16).slice(-4)}_SECURED`;
            setTelemetry(prev => [entry, ...prev].slice(0, 10));
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    // BATCHER: UI Frame Sync Logic
    useEffect(() => {
        const updateUIFrame = () => {
            if (lastPriceRef.current) {
                const price = lastPriceRef.current;
                const displayPrice = currency === "EUR" ? price.value * exchangeRate : price.value;
                setUiPriceData(prev => {
                    if (prev.length > 0 && prev[prev.length - 1].time === price.time) return prev;
                    return [...prev, { ...price, value: displayPrice }].slice(-200);
                });
                updatePrice(symbol, price.value);
                lastPriceRef.current = null;
            }

            if (lastBookRef.current) {
                const book = lastBookRef.current;
                const convertLevel = (level: any) => ({
                    ...level,
                    price: currency === "EUR" ? level.price * exchangeRate : level.price
                });
                setUiOrderBook({
                    bids: (book.bids || []).map(convertLevel),
                    asks: (book.asks || []).map(convertLevel)
                });
                lastBookRef.current = null;
            }

            frameRef.current = requestAnimationFrame(updateUIFrame);
        };

        frameRef.current = requestAnimationFrame(updateUIFrame);
        return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current); };
    }, [symbol, updatePrice, currency, exchangeRate]);

    useEffect(() => {
        setUiPriceData([]);
        setUiOrderBook({ bids: [], asks: [] });
    }, [symbol]);

    useEffect(() => {
        if (latestPrice && latestPrice.price) {
            const now = Math.floor(Date.now() / 1000);
            lastPriceRef.current = { time: now, value: latestPrice.price };
        }
    }, [latestPrice]);

    useEffect(() => { if (bookData) lastBookRef.current = bookData; }, [bookData]);

    return (
        <div className="flex min-h-screen flex-col bg-[#02040a] text-white overflow-hidden p-6 sm:p-10 relative">

            {/* Scientific Overlays */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(#3b82f6_1px,transparent_1px),linear-gradient(90deg,#3b82f6_1px,transparent_1px)] bg-[size:60px_60px]" />
                <div className="absolute top-0 right-0 w-[1000px] h-[1000px] bg-blue-500/[0.03] blur-[250px] rounded-full" />
                <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-indigo-500/[0.03] blur-[200px] rounded-full" />
            </div>

            <main className="z-10 grid flex-1 grid-cols-1 gap-10 lg:grid-cols-12 h-full">

                {/* LEFT: MONITORING & CHART */}
                <div className="lg:col-span-8 flex flex-col gap-10">

                    {/* A. SCI_TERMINAL HUD */}
                    <div className="flex flex-col gap-8 rounded-[40px] border border-white/5 bg-zinc-900/10 p-10 backdrop-blur-3xl relative overflow-hidden group">

                        {/* Interactive Watermark Icons */}
                        <div className="absolute top-1/2 -translate-y-1/2 right-10 flex flex-col gap-6 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                            <Workflow className="w-16 h-16" />
                            <Cpu className="w-16 h-16" />
                            <Satellite className="w-16 h-16" />
                        </div>

                        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10 relative z-10">
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-2.5">
                                    <ActivityIcon className="w-3 h-3 text-blue-500 animate-[pulse_2s_infinite]" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.6em] text-blue-500/80">Unified Exchange Interface</span>
                                </div>
                                <div className="flex items-center gap-10">
                                    <PriceTicker symbol={symbol} />
                                    <div className="flex flex-col">
                                        <TrendingUp className="w-4 h-4 text-emerald-500 mb-1" />
                                        <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Live Momentum</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="flex items-center p-1 rounded-2xl bg-black/40 border border-white/5 backdrop-blur-md transition-all hover:border-blue-500/20 group/terminal shadow-2xl">
                                    <div className="flex items-center gap-1">
                                        <Selector icon={Globe} label="" current={currency} options={["USD", "EUR"]} onSelect={(v: any) => setCurrency(v as any)} align="left" />
                                        <div className="w-[1px] h-6 bg-white/5" />
                                        <Selector icon={Cpu} label="" current={symbol} options={symbols.filter(s => s.type !== "STOCK").map(s => s.symbol)} onSelect={(v: any) => navigate(`/trade/${v}`)} isAsset align="right" />
                                    </div>
                                </div>

                                <div className="hidden sm:flex flex-col items-end gap-1 px-8 border-l border-white/5">
                                    <div className="flex items-center gap-2">
                                        <Zap className="w-3 h-3 text-blue-400" />
                                        <span className="text-[9px] font-black tracking-widest text-zinc-600 uppercase">Latency</span>
                                    </div>
                                    <span className="text-sm font-mono text-blue-400 font-bold tracking-tighter">{latency}ms</span>
                                </div>
                            </div>
                        </div>

                        {/* Telemetry Multi-Log Under Menu */}
                        <div className="flex gap-12 mt-8 border-t border-white/5 pt-8 overflow-hidden grayscale opacity-20">
                            <div className="flex items-center gap-3">
                                <HardDrive className="w-3 h-3" />
                                <span className="text-[8px] font-mono whitespace-nowrap uppercase">Disk_State: SYNCHRONIZED</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Database className="w-3 h-3" />
                                <span className="text-[8px] font-mono whitespace-nowrap uppercase">Mem_DB: REDIS_ACTIVE</span>
                            </div>
                            <div className="h-px bg-zinc-800 flex-1" />
                            {telemetry.map((log, i) => (
                                <div key={i} className="flex gap-3 items-center whitespace-nowrap animate-in fade-in duration-500">
                                    <div className="h-1 w-1 bg-white rounded-full animate-pulse" />
                                    <span className="text-[8px] font-mono">{log}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* B. CHARTING ENGINE */}
                    <div className="flex flex-col gap-6 relative group">
                        <div className="absolute -top-3 -left-3 w-10 h-10 border-t-2 border-l-2 border-blue-500/10 group-hover:border-blue-500/40 transition-all duration-700" />
                        <div className="absolute -bottom-3 -right-3 w-10 h-10 border-b-2 border-r-2 border-blue-500/10 group-hover:border-blue-500/40 transition-all duration-700" />

                        <div className="rounded-[48px] border border-white/5 bg-zinc-900/10 p-10 backdrop-blur-3xl shadow-2xl relative overflow-hidden">
                            {/* Chart Data Overlay Icons */}
                            <div className="absolute top-8 right-8 flex gap-4">
                                <Activity className="w-4 h-4 text-zinc-800" />
                                <Workflow className="w-4 h-4 text-zinc-800" />
                            </div>
                            <PriceChart symbol={symbol} data={uiPriceData} />
                        </div>
                    </div>

                    {/* C. ORDER BOOK (Depth) */}
                    <div className="flex-1 rounded-[48px] border border-white/5 bg-zinc-900/10 p-10 backdrop-blur-3xl relative overflow-hidden">
                        <div className="flex items-center gap-3 mb-10">
                            <BarChart4 className="w-4 h-4 text-blue-500" />
                            <span className="text-[11px] font-black uppercase tracking-[0.6em] text-white/40 italic">Deep Book Analysis // Grid 0x4f</span>
                        </div>
                        <OrderBook bids={uiOrderBook.bids} asks={uiOrderBook.asks} />
                    </div>
                </div>

                {/* RIGHT: CONTROLS & TRADES */}
                <aside className="lg:col-span-4 flex flex-col gap-10 h-full">
                    <div className="rounded-[52px] border border-white/10 bg-gradient-to-br from-white/[0.06] via-transparent to-transparent p-1.5 shadow-2xl backdrop-blur-3xl relative group">
                        <div className="absolute top-6 right-10 flex gap-2 opacity-10 group-hover:opacity-30 transition-opacity">
                            <Settings className="w-4 h-4" />
                            <Clock className="w-4 h-4" />
                        </div>
                        <div className="bg-zinc-950/60 rounded-[50px] p-10">
                            <div className="flex items-center gap-3 mb-10">
                                <Zap className="w-4 h-4 text-blue-500" />
                                <h2 className="text-xl font-black uppercase italic tracking-tighter">Instant Buy / Sell</h2>
                            </div>
                            <OrderForm symbol={symbol} />
                        </div>
                    </div>

                    <div className="flex-1 rounded-[48px] border border-white/5 bg-zinc-900/10 p-10 backdrop-blur-2xl">
                        <div className="flex items-center gap-4 mb-10">
                            <div className="h-8 w-8 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[11px] font-black uppercase tracking-[0.4em] text-white/50">Execution History</span>
                                <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">TLS 256bit Encrypted</span>
                            </div>
                        </div>
                        <OrderList />
                    </div>
                </aside>
            </main>

            <SimulationPanel symbol={symbol} />
        </div>
    );
}

function Selector({ label, current, options, onSelect, isAsset, icon: Icon, align = "left" }: any) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div ref={containerRef} className="relative inline-block">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "flex h-11 items-center justify-between gap-3 rounded-xl px-4 text-[10px] font-black uppercase tracking-widest transition-all relative z-10",
                    isOpen ? "bg-white/10 text-white border border-white/10" : "text-zinc-400 hover:bg-white/5 hover:text-white"
                )}
            >
                <Icon className={cn("w-3.5 h-3.5 text-blue-500 transition-opacity", isOpen ? "opacity-100" : "opacity-60")} />
                {current} {label}
                <ChevronDown className={cn("h-3 w-3 transition-transform", isOpen ? "rotate-180" : "rotate-0")} />
            </button>
            <div className={cn(
                "absolute top-full z-[100] mt-1 w-64 origin-top rounded-2xl border border-white/10 bg-[#0a0a0c]/98 p-1 backdrop-blur-3xl shadow-[0_20px_60px_rgba(0,0,0,0.8)]",
                align === "right" ? "right-0" : "left-0",
                isOpen ? "visible scale-100 opacity-100" : "invisible scale-95 opacity-0"
            )}>
                <div className="max-h-64 overflow-y-auto custom-scrollbar">
                    {options.map((opt: any) => (
                        <button
                            key={opt}
                            onClick={() => {
                                onSelect(opt);
                                setIsOpen(false);
                            }}
                            className={cn(
                                "flex w-full items-center justify-between px-4 py-2.5 rounded-xl text-[10px] font-black text-left transition-all",
                                current === opt ? "bg-blue-600/20 text-blue-400 border border-blue-500/30" : "text-zinc-500 hover:bg-white/5 hover:text-white"
                            )}
                        >
                            <span className="flex items-center gap-3">
                                {isAsset && <div className={cn("h-1.5 w-1.5 rounded-full", current === opt ? "bg-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.5)]" : "bg-emerald-500")} />}
                                {opt}
                            </span>
                            {current === opt && <div className="h-1 w-1 rounded-full bg-blue-400" />}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
