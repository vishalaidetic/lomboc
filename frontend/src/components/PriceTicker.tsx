import { cn } from "@/lib/utils";
import { useMarketStore } from "@/store/useMarketStore";
import { useEffect, useRef, useState } from "react";

interface PriceTickerProps {
    symbol: string;
}

export function PriceTicker({ symbol }: PriceTickerProps) {
    // Selective subscription: This component ONLY re-renders when symbol price changes
    const price = useMarketStore((state) => state.prices[symbol] || 50000.5);
    const prevPriceRef = useRef(price);
    const [flash, setFlash] = useState<"up" | "down" | null>(null);

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
        <div className="flex flex-col">
            <span className="text-[10px] font-black tracking-widest text-zinc-600 uppercase">
                {symbol} Index Price
            </span>
            <div className={cn(
                "text-4xl font-black tracking-tighter transition-colors duration-300 sm:text-5xl lg:text-6xl",
                flash === "up" ? "text-emerald-400" : flash === "down" ? "text-rose-400" : "text-white"
            )}>
                ${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
        </div>
    );
}
