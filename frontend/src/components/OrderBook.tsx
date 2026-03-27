import { useVirtualizer } from '@tanstack/react-virtual';
import { memo, useMemo, useRef } from 'react';

interface OrderBookLevel {
    price: number;
    quantity: number;
    total?: number;
}

interface OrderBookProps {
    bids: OrderBookLevel[];
    asks: OrderBookLevel[];
    maxDepth?: number;
}

const OrderRow = memo(({ level, type, maxTotal, virtualItem }: {
    level: OrderBookLevel;
    type: 'bid' | 'ask';
    maxTotal: number;
    virtualItem: any;
}) => {
    const isAsk = type === 'ask';
    return (
        <div
            className="absolute top-0 left-0 w-full flex items-center h-6 text-xs hover:bg-white/[0.03] transition-colors group cursor-crosshair"
            style={{ transform: `translateY(${virtualItem.start}px)` }}
        >
            <div
                className={`absolute right-0 top-0 bottom-0 transition-all duration-500 ease-out ${isAsk ? 'bg-rose-500/10' : 'bg-emerald-500/10'}`}
                style={{ width: `${(level.total || 0) / maxTotal * 100}%` }}
            />
            <div className="z-10 flex-1 grid grid-cols-3 px-5 font-mono font-medium">
                <span className={`${isAsk ? 'text-rose-400' : 'text-emerald-400'} font-bold tracking-tighter`}>
                    ${level.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span className="text-zinc-300 text-right">{level.quantity.toLocaleString()}</span>
                <span className="text-zinc-500 text-right">{level.total?.toLocaleString()}</span>
            </div>
        </div>
    );
});

export const OrderBook = ({ bids, asks, maxDepth = 200 }: OrderBookProps) => {
    const parentRef = useRef<HTMLDivElement>(null);

    const processedAsks = useMemo(() => {
        let total = 0;
        return [...asks].slice(0, maxDepth).reverse().map(l => {
            total += l.quantity;
            return { ...l, total };
        });
    }, [asks, maxDepth]);

    const processedBids = useMemo(() => {
        let total = 0;
        return [...bids].slice(0, maxDepth).map(l => {
            total += l.quantity;
            return { ...l, total };
        });
    }, [bids, maxDepth]);

    const maxTotal = useMemo(() => {
        const askTotal = processedAsks.length > 0 ? processedAsks[0].total || 0 : 0;
        const bidTotal = processedBids.length > 0 ? (processedBids[processedBids.length - 1]?.total || 0) : 0;
        return Math.max(askTotal, bidTotal, 1);
    }, [processedAsks, processedBids]);

    const askVirtualizer = useVirtualizer({
        count: processedAsks.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 24,
        overscan: 5,
    });

    const bidVirtualizer = useVirtualizer({
        count: processedBids.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 24,
        overscan: 5,
    });

    return (
        <div className="flex flex-col h-full bg-zinc-950/40 rounded-3xl border border-white/5 overflow-hidden backdrop-blur-3xl shadow-2xl">
            <div className="p-5 border-b border-white/5 flex items-center justify-between bg-zinc-900/40">
                <div className="flex flex-col">
                    <h3 className="text-[10px] font-black tracking-[0.3em] text-zinc-400 uppercase">Live Order Book</h3>
                    <span className="text-[9px] font-bold text-emerald-500/60 uppercase">Virtualization Engine Active</span>
                </div>
                <div className="flex gap-2">
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-rose-500/10 border border-rose-500/20">
                        <span className="text-[8px] font-black text-rose-400 uppercase">Asks</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/20">
                        <span className="text-[8px] font-black text-emerald-400 uppercase">Bids</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-3 px-5 py-3 text-[10px] font-black tracking-widest text-zinc-500 uppercase border-b border-white/5">
                <span>Price</span>
                <span className="text-right">Size</span>
                <span className="text-right">Total</span>
            </div>

            <div ref={parentRef} className="flex-1 overflow-y-auto scrollbar-hide py-2">
                <div className="relative w-full" style={{ height: `${askVirtualizer.getTotalSize()}px` }}>
                    {askVirtualizer.getVirtualItems().map((virtualItem) => (
                        <OrderRow
                            key={`ask-${processedAsks[virtualItem.index].price}`}
                            level={processedAsks[virtualItem.index]}
                            type="ask"
                            maxTotal={maxTotal}
                            virtualItem={virtualItem}
                        />
                    ))}
                </div>

                <div className="my-4 py-2 bg-gradient-to-r from-transparent via-zinc-800/40 to-transparent flex items-center justify-center border-y border-white/5">
                    <span className="text-[10px] font-black tracking-[0.4em] text-zinc-600 uppercase">SPREAD</span>
                </div>

                <div className="relative w-full" style={{ height: `${bidVirtualizer.getTotalSize()}px` }}>
                    {bidVirtualizer.getVirtualItems().map((virtualItem) => (
                        <OrderRow
                            key={`bid-${processedBids[virtualItem.index].price}`}
                            level={processedBids[virtualItem.index]}
                            type="bid"
                            maxTotal={maxTotal}
                            virtualItem={virtualItem}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

