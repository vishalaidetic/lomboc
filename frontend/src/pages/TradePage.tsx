import { marketService } from "@/api/marketService";
import { OrderBook } from "@/components/OrderBook";
import { OrderForm } from "@/components/OrderForm";
import { OrderList } from "@/components/OrderList";
import { PriceChart } from "@/components/PriceChart";
import { PriceTicker } from "@/components/PriceTicker";
import { useMarketWebSocket } from "@/hooks/useMarketWebSocket";
import { cn } from "@/lib/utils";
import { useMarketStore } from "@/store/useMarketStore";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";

export default function TradePage() {
    const { currentSymbol: symbol, setCurrentSymbol, currency, setCurrency, setSymbols, exchangeRate, setExchangeRate } = useMarketStore();
    const { isConnected } = useMarketWebSocket();
    const updatePrice = useMarketStore((state) => state.updatePrice);

    // Fetch Full Market Metadata
    const { data: marketData } = useQuery({
        queryKey: ["symbols"],
        queryFn: async () => {
            const data = await marketService.getSymbols();
            setSymbols(data);
            return data;
        },
    });

    // Fetch EUR Exchange Rate
    const { data: rateData } = useQuery({
        queryKey: ["rate"],
        queryFn: async () => {
            const data = await marketService.getExchangeRate();
            if (data?.EUR) setExchangeRate(data.EUR);
            return data;
        },
    });

    const currentRate = currency === "EUR" ? exchangeRate : 1;

    // Performance State: Batching updates
    const [uiPriceData, setUiPriceData] = useState<{ time: number; value: number }[]>([]);
    const [uiOrderBook, setUiOrderBook] = useState<{ bids: any[]; asks: any[] }>({ bids: [], asks: [] });

    // Internal Buffers for batching
    const lastPriceRef = useRef<{ time: number; value: number } | null>(null);
    const lastBookRef = useRef<{ bids: any[]; asks: any[] } | null>(null);
    const frameRef = useRef<number | null>(null);


    const { data: latestPrice } = useQuery({
        queryKey: ["price", symbol],
        queryFn: () => marketService.getLatestPrice(symbol),
        refetchInterval: 100, // Very frequent polling for demo
        enabled: isConnected,
    });

    const { data: bookData } = useQuery({
        queryKey: ["orderbook", symbol],
        queryFn: () => marketService.getOrderBook(symbol),
        refetchInterval: 500, // Balanced frequency for order book
        enabled: isConnected,
    });

    // BATCHER: Uses requestAnimationFrame to sync UI once per frame (~60-120Hz)
    useEffect(() => {
        const updateUIFrame = () => {
            if (lastPriceRef.current) {
                const price = lastPriceRef.current;
                const displayPrice = currency === "EUR" ? price.value * exchangeRate : price.value;

                setUiPriceData(prev => {
                    if (prev.length > 0 && prev[prev.length - 1].time === price.time) return prev;
                    return [...prev, { ...price, value: displayPrice }].slice(-200);
                });
                updatePrice(symbol, price.value); // Keep internally in USD
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
        return () => {
            if (frameRef.current) cancelAnimationFrame(frameRef.current);
        };
    }, [symbol, updatePrice, currency, exchangeRate]);

    // Buffer incoming data
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

    useEffect(() => {
        if (bookData) {
            lastBookRef.current = bookData;
        }
    }, [bookData]);

    return (
        <div className="flex min-h-screen flex-col bg-zinc-950 text-white overflow-hidden p-6 sm:p-10 relative">
            <div className="absolute top-0 -left-40 w-80 h-80 bg-emerald-500/10 blur-[120px] rounded-full" />
            <div className="absolute bottom-0 -right-40 w-80 h-80 bg-rose-500/10 blur-[120px] rounded-full" />

            <main className="z-10 grid flex-1 grid-cols-1 gap-10 lg:grid-cols-12 h-full">
                <div className="lg:col-span-8 flex flex-col gap-10 overflow-hidden">
                    <header className="flex flex-col gap-8 border-b border-white/5 pb-10">
                        <div className="flex items-center justify-between">
                            <PriceTicker symbol={symbol} />

                            <div className="flex items-center gap-6">
                                {/* Currency Switcher */}
                                <div className="flex bg-zinc-900/50 p-1 rounded-2xl border border-white/5">
                                    {["USD", "EUR"].map((c) => (
                                        <button
                                            key={c}
                                            onClick={() => setCurrency(c as any)}
                                            className={cn(
                                                "px-4 py-2 rounded-xl text-[10px] font-black tracking-widest transition-all",
                                                currency === c
                                                    ? "bg-zinc-800 text-white shadow-xl border border-white/10"
                                                    : "text-zinc-600 hover:text-white"
                                            )}
                                        >
                                            {c}
                                        </button>
                                    ))}
                                </div>

                                {/* Symbol Switcher */}
                                <div className="flex bg-zinc-900/50 p-1 rounded-2xl border border-white/5">
                                    {(useMarketStore.getState().symbols.length > 0
                                        ? useMarketStore.getState().symbols.map(s => s.symbol)
                                        : ["BTCUSD", "AAPL", "XAUUSD"]).map((s) => (
                                            <button
                                                key={s}
                                                onClick={() => setCurrentSymbol(s)}
                                                className={cn(
                                                    "px-4 py-2 rounded-xl text-[10px] font-black tracking-widest transition-all",
                                                    symbol === s
                                                        ? "bg-white text-black shadow-xl"
                                                        : "text-zinc-500 hover:text-white"
                                                )}
                                            >
                                                {s}
                                            </button>
                                        ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-5 text-[10px] font-black tracking-[0.2em] uppercase">
                                <div className={cn(
                                    "h-2 w-2 rounded-full ring-4 ring-offset-4 ring-offset-zinc-950 transition-all duration-500",
                                    isConnected ? "bg-emerald-500 ring-emerald-500/20 animate-pulse" : "bg-rose-500 ring-rose-500/20"
                                )} />
                                {isConnected ? "Sub-Millisecond Synced" : "Establishing Handshake..."}
                            </div>
                            <div className="flex items-center gap-10">
                                <div className="hidden sm:flex flex-col items-end gap-1">
                                    <span className="text-[10px] font-black tracking-widest text-zinc-600 uppercase">System Latency</span>
                                    <span className="text-xs font-mono text-emerald-400 font-bold">~1.2ms</span>
                                </div>
                                <div className="hidden sm:flex flex-col items-end gap-1 border-l border-white/5 pl-10">
                                    <span className="text-[10px] font-black tracking-widest text-zinc-600 uppercase">Kafka Stream</span>
                                    <span className="text-xs font-mono text-emerald-400 font-bold">ACTIVE</span>
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

                {/* Right Panel: Trading Controls */}
                <aside className="lg:col-span-4 flex flex-col gap-10 h-full">
                    <div className="p-8 rounded-[40px] border border-white/10 bg-gradient-to-b from-white/[0.03] to-transparent shadow-2xl backdrop-blur-lg">
                        <OrderForm symbol={symbol} />
                    </div>
                    <div className="flex-1 min-h-[400px]">
                        <OrderList />
                    </div>
                </aside>
            </main>
        </div>
    );
}
