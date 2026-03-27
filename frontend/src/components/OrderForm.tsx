import { useOrderMutation } from "@/hooks/useOrderMutation";
import { cn } from "@/lib/utils";
import { OrderSide, OrderType } from "@/types/order";
import { DollarSign, Layers } from "lucide-react";
import { useState } from "react";

interface OrderFormProps {
    symbol: string;
}

export function OrderForm({ symbol }: OrderFormProps) {
    const [side, setSide] = useState<OrderSide>(OrderSide.BUY);
    const [price, setPrice] = useState<string>("50000.50");
    const [quantity, setQuantity] = useState<number>(10);

    const mutation = useOrderMutation();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutation.mutate({
            userId: "00000000-0000-0000-0000-000000000000", // Placeholder user
            symbol,
            type: OrderType.LIMIT,
            side,
            price: parseFloat(price),
            quantity,
        });
    };

    return (
        <div className="flex flex-col gap-6 rounded-2xl border border-white/10 bg-zinc-900/40 p-6 backdrop-blur-xl">
            <div className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-zinc-500" />
                <h2 className="text-lg font-bold tracking-tight text-white">Place Order</h2>
            </div>

            {/* Side Toggle */}
            <div className="flex rounded-lg bg-zinc-950 p-1">
                <button
                    onClick={() => setSide(OrderSide.BUY)}
                    className={cn(
                        "flex-1 rounded-md py-2 text-sm font-bold transition-all",
                        side === OrderSide.BUY
                            ? "bg-emerald-500 text-white shadow-lg"
                            : "text-zinc-500 hover:text-zinc-300"
                    )}
                >
                    BUY
                </button>
                <button
                    onClick={() => setSide(OrderSide.SELL)}
                    className={cn(
                        "flex-1 rounded-md py-2 text-sm font-bold transition-all",
                        side === OrderSide.SELL
                            ? "bg-rose-500 text-white shadow-lg"
                            : "text-zinc-500 hover:text-zinc-300"
                    )}
                >
                    SELL
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                        Price (USDT)
                    </label>
                    <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                        <input
                            type="number"
                            step="0.01"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className="w-full rounded-xl border border-white/10 bg-zinc-950 py-3 pl-10 pr-4 text-sm text-white focus:border-white/20 focus:outline-none"
                            placeholder="0.00"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                        Amount ({symbol})
                    </label>
                    <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        className="w-full rounded-xl border border-white/10 bg-zinc-950 py-3 px-4 text-sm text-white focus:border-white/20 focus:outline-none"
                        placeholder="0"
                    />
                </div>

                <button
                    type="submit"
                    disabled={mutation.isPending}
                    className={cn(
                        "mt-4 w-full rounded-xl py-4 text-sm font-black transition-all active:scale-95 disabled:opacity-50",
                        side === OrderSide.BUY
                            ? "bg-emerald-500 hover:bg-emerald-400 text-black shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                            : "bg-rose-500 hover:bg-rose-400 text-white shadow-[0_0_20px_rgba(244,63,94,0.2)]"
                    )}
                >
                    {mutation.isPending ? "PROCESSING..." : `${side} ${symbol}`}
                </button>
            </form>
        </div>
    );
}
