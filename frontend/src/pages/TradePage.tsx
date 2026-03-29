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
import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function TradePage() {
    const { currentSymbol: symbol, setCurrentSymbol, currency, setCurrency, setSymbols, exchangeRate, setExchangeRate } = useMarketStore();
    const { isConnected, latency } = useMarketWebSocket();
    const updatePrice = useMarketStore((state) => state.updatePrice);

    // Fetch Full Market Metadata (Background)
    useQuery({
        queryKey: ["symbols"],
        queryFn: async () => {
            const data = await marketService.getSymbols();
            setSymbols(data);
            return data;
        },
    });

    // Fetch EUR Exchange Rate (Background)
    useQuery({
        queryKey: ["rate"],
        queryFn: async () => {
            const data = await marketService.getExchangeRate();
            if (data?.EUR) setExchangeRate(data.EUR);
            return data;
        },
    });

    // Performance State: Batching updates for chart and orderbook
    const [uiPriceData, setUiPriceData] = useState<{ time: number; value: number }[]>([]);
    const [uiOrderBook, setUiOrderBook] = useState<{ bids: any[]; asks: any[] }>({ bids: [], asks: [] });

    // Internal Buffers for high-frequency batching
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
                updatePrice(symbol, price.value); // Store base price internally
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

    // Buffer incoming price/book data
    useEffect(() => {
        setUiPriceData([]);
        setUiOrderBook({ bids: [], asks: [] });
        lastPriceRef.current = null;
        lastBookRef.current = null;
    }, [symbol]);

    useEffect(() => {
        if (latestPrice && latestPrice.price) {
            const now = Math.floor(Date.now() / 1000);
            lastPriceRef.current = { time: now, value: latestPrice.price };
        }
    }, [latestPrice]);

    useEffect(() => { if (bookData) lastBookRef.current = bookData; }, [bookData]);

    return (
        <div className="flex min-h-screen flex-col bg-zinc-950 text-white overflow-hidden p-6 sm:p-10 relative">
            <div className="absolute top-0 -left-40 w-80 h-80 bg-emerald-500/10 blur-[120px] rounded-full" />
            <div className="absolute bottom-0 -right-40 w-80 h-80 bg-rose-500/10 blur-[120px] rounded-full" />

            <main className="z-10 grid flex-1 grid-cols-1 gap-10 lg:grid-cols-12 h-full">
                <div className="lg:col-span-8 flex flex-col gap-10 overflow-hidden">
                    <header className="flex flex-col gap-8 border-b border-white/5 pb-10">
                        <div className="flex items-center justify-between">
                            <PriceTicker symbol={symbol} />

                            <div className="flex items-center gap-8">
                                <div className="flex items-center gap-4">
                                    {/* Currency Dropdown */}
                                    <div className="group relative">
                                        <button className="flex h-11 w-24 items-center justify-between rounded-xl border border-white/5 bg-zinc-900/50 px-4 text-[10px] font-black uppercase tracking-widest text-zinc-400 transition-all hover:bg-zinc-800 hover:text-white">
                                            {currency}
                                            <ChevronDown className="h-3 w-3 transition-transform group-hover:rotate-180" />
                                        </button>
                                        <div className="invisible absolute top-full left-0 z-50 mt-2 w-full origin-top scale-95 rounded-2xl border border-white/5 bg-zinc-900/90 p-1 opacity-0 backdrop-blur-3xl transition-all group-hover:visible group-hover:scale-100 group-hover:opacity-100">
                                            {["USD", "EUR"].map((c) => (
                                                <button
                                                    key={c}
                                                    onClick={() => setCurrency(c as any)}
                                                    className={cn(
                                                        "w-full px-3 py-2 rounded-xl text-[10px] font-black text-left transition-all",
                                                        currency === c ? "bg-white text-black" : "text-zinc-500 hover:bg-white/5 hover:text-white"
                                                    )}
                                                >
                                                    {c}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Symbol Dropdown */}
                                    <div className="group relative">
                                        <button className="flex h-11 w-48 items-center justify-between rounded-xl border border-white/5 bg-zinc-900/50 px-5 text-[10px] font-black uppercase tracking-widest text-zinc-400 transition-all hover:bg-zinc-800 hover:text-white">
                                            <span className="flex items-center gap-2">
                                                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                                {symbol}
                                            </span>
                                            <ChevronDown className="h-3 w-3 transition-transform group-hover:rotate-180" />
                                        </button>
                                        <div className="invisible absolute top-full right-0 z-50 mt-2 w-64 origin-top scale-95 rounded-2xl border border-white/5 bg-zinc-900/95 p-1 opacity-0 backdrop-blur-3xl transition-all group-hover:visible group-hover:scale-100 group-hover:opacity-100 shadow-2xl">
                                            {(useMarketStore.getState().symbols.length > 0
                                                ? useMarketStore.getState().symbols.map(s => s.symbol)
                                                : ["BTCUSD", "AAPL", "XAUUSD"]).map((s) => (
                                                    <button
                                                        key={s}
                                                        onClick={() => setCurrentSymbol(s)}
                                                        className={cn(
                                                            "flex w-full items-center justify-between px-4 py-3 rounded-xl text-[10px] font-black text-left transition-all",
                                                            symbol === s ? "bg-white text-black" : "text-zinc-500 hover:bg-white/5 hover:text-white"
                                                        )}
                                                    >
                                                        {s}
                                                        {symbol === s && <div className="h-1 w-1 rounded-full bg-current" />}
                                                    </button>
                                                ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="h-10 w-px bg-white/5" />

                                <div className="flex items-center gap-10">
                                    <div className="flex flex-col items-end gap-0.5">
                                        <span className="text-[10px] font-black tracking-widest text-zinc-600 uppercase">Latency</span>
                                        <span className="text-xs font-mono text-emerald-400 font-bold">~{latency}ms</span>
                                    </div>
                                    <div className="flex flex-col items-end gap-0.5 border-l border-white/5 pl-8">
                                        <span className="text-[10px] font-black tracking-widest text-zinc-600 uppercase">Stream</span>
                                        <span className={cn(
                                            "text-xs font-mono font-bold uppercase",
                                            isConnected ? "text-emerald-400" : "text-rose-500"
                                        )}>
                                            {isConnected ? 'Active' : 'Offline'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </header>

                    <div className="rounded-3xl border border-white/5 bg-zinc-900/10 p-10 backdrop-blur-3xl shadow-xl min-h-[400px]">
                        <PriceChart symbol={symbol} data={uiPriceData} />
                    </div>

                    <div className="flex-1 min-h-[500px] overflow-hidden">
                        <OrderBook bids={uiOrderBook.bids || []} asks={uiOrderBook.asks || []} />
                    </div>
                </div>

                <aside className="lg:col-span-4 flex flex-col gap-10 h-full">
                    <div className="p-8 rounded-[40px] border border-white/10 bg-gradient-to-b from-white/[0.03] to-transparent shadow-2xl backdrop-blur-lg">
                        <OrderForm symbol={symbol} />
                    </div>
                    <div className="flex-1 min-h-[400px]">
                        <OrderList />
                    </div>
                </aside>
            </main>

            {/* Simulation Time Master Bar */}
            <SimulationPanel symbol={symbol} />
        </div>
    );
}
