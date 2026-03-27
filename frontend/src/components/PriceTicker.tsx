import { cn } from "@/lib/utils";
import { useMarketStore } from "@/store/useMarketStore";
import { useEffect, useRef, useState } from "react";

interface PriceTickerProps {
    symbol: string;
}

export function PriceTicker({ symbol }: PriceTickerProps) {
    const prices = useMarketStore((state) => state.prices);
    const currency = useMarketStore((state) => state.currency);
    const rate = useMarketStore((state) => state.exchangeRate);
    const symbols = useMarketStore((state) => state.symbols);

    // Find market metadata
    const market = symbols.find(s => s.symbol === symbol);

    const rawPrice = prices[symbol] || 0;
    const price = currency === "EUR" ? rawPrice * rate : rawPrice;

    const prevPriceRef = useRef(price);
    const [flash, setFlash] = useState<"up" | "down" | null>(null);

    // Calc market status
    const isMarketOpen = () => {
        if (!market) return true;
        if (market.type !== "STOCK" && market.type !== "FOREX") return true;

        const now = new Date();
        const currentTime = now.getHours() * 60 + now.getMinutes();

        if (market.openTime && market.closeTime) {
            const [openH, openM] = market.openTime.split(":").map(Number);
            const [closeH, closeM] = market.closeTime.split(":").map(Number);
            const openMinutes = openH * 60 + openM;
            const closeMinutes = closeH * 60 + closeM;

            return currentTime >= openMinutes && currentTime < closeMinutes;
        }
        return true;
    };

    const isOpen = isMarketOpen();

    useEffect(() => {
        if (price > prevPriceRef.current) {
            setFlash("up");
        } else if (price < prevPriceRef.current) {
            setFlash("down");
        }
        prevPriceRef.current = price;
        const timer = setTimeout(() => setFlash(null), 1000);
        return () => clearTimeout(timer);
    }, [price]);

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
                <span className="text-[10px] font-black tracking-widest text-zinc-600 uppercase">
                    {symbol} Index Price ({currency})
                </span>
                <div className={cn(
                    "px-2 py-0.5 rounded-full text-[8px] font-black tracking-widest uppercase",
                    isOpen ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" : "bg-rose-500/10 text-rose-500 border border-rose-500/20"
                )}>
                    {isOpen ? "• Market Open" : "• Market Closed"}
                </div>
            </div>

            <div className={cn(
                "text-4xl font-black tracking-tighter transition-colors duration-300 sm:text-5xl lg:text-7xl flex items-baseline gap-2",
                flash === "up" ? "text-emerald-400" : flash === "down" ? "text-rose-400" : "text-white"
            )}>
                <span className="text-2xl font-black text-zinc-600 self-center">
                    {currency === "EUR" ? "€" : "$"}
                </span>
                {price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>

            {!isOpen && market?.openTime && (
                <span className="text-[10px] font-bold text-rose-500/60 uppercase tracking-widest">
                    Next Open: {market.openTime} (Local Time)
                </span>
            )}
        </div>
    );
}
