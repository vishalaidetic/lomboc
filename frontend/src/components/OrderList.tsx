import { orderService } from "@/api/orderService";
import { cn } from "@/lib/utils";
import { useOrderStore } from "@/store/useOrderStore";
import { OrderSide, OrderStatus } from "@/types/order";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, Clock, ListIcon } from "lucide-react";
import { useEffect } from "react";

export function OrderList() {
    const { orders, setOrders } = useOrderStore();
    const { data: initialOrders } = useQuery({
        queryKey: ["orders", "me"],
        queryFn: () => orderService.getOrdersByUser(),
        refetchInterval: 3000,
    });

    useEffect(() => {
        if (initialOrders) {
            setOrders(initialOrders);
        }
    }, [initialOrders, setOrders]);

    return (
        <div className="flex shrink-0 flex-col gap-6 rounded-2xl border border-white/10 bg-zinc-900/40 p-6 backdrop-blur-xl">
            <div className="flex items-center gap-2">
                <ListIcon className="h-5 w-5 text-zinc-500" />
                <h2 className="text-lg font-bold tracking-tight text-white">Recent Orders</h2>
            </div>

            <div className="max-h-[500px] overflow-y-auto pr-2 custom-scrollbar space-y-3">
                {orders.length === 0 ? (
                    <div className="py-20 text-center text-xs font-bold text-zinc-700 uppercase">
                        No active orders
                    </div>
                ) : (
                    orders.map((order) => (
                        <div
                            key={order.id}
                            className={cn(
                                "group flex flex-col gap-3 rounded-xl border p-4 transition-all duration-300",
                                order.status === "SETTLED"
                                    ? "bg-emerald-500/[0.03] border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.05)]"
                                    : "bg-zinc-950/50 border-white/5 hover:border-white/10"
                            )}
                        >
                            <div className="flex items-center justify-between">
                                <span
                                    className={cn(
                                        "rounded px-2 py-0.5 text-[10px] font-black tracking-widest uppercase",
                                        order.side === OrderSide.BUY
                                            ? "bg-emerald-500/10 text-emerald-500"
                                            : "bg-rose-500/10 text-rose-500"
                                    )}
                                >
                                    {order.side} {order.symbol}
                                </span>
                                <span className="text-[10px] font-bold text-zinc-600">
                                    {new Date(order.createdAt).toLocaleTimeString('en-IN', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        second: '2-digit',
                                        hour12: false
                                    })}
                                </span>
                            </div>

                            <div className="flex items-end justify-between">
                                <div className="flex flex-col gap-0.5">
                                    <span className="text-xs font-bold text-zinc-400 font-mono">
                                        {order.quantity.toLocaleString()} UNITS @ {order.price.toLocaleString()}
                                    </span>
                                    <div className="flex items-center gap-2 mt-1">
                                        {order.status === "SETTLED" ? (
                                            <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                                        ) : (
                                            <Clock className="h-3 w-3 text-zinc-600 animate-pulse" />
                                        )}
                                        <span className={cn(
                                            "text-[9px] font-black uppercase tracking-widest",
                                            order.status === "SETTLED" ? "text-emerald-500" : "text-zinc-600"
                                        )}>
                                            {order.status === "SETTLED" ? "FUNDS SETTLED" : "PHASE 1: MATCHED"}
                                        </span>
                                    </div>
                                </div>

                                <div className={cn(
                                    "flex items-center gap-2 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest transition-all duration-500",
                                    order.status === OrderStatus.PENDING
                                        ? "bg-zinc-800 text-zinc-400"
                                        : order.status === "SETTLED"
                                            ? "bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                                            : "bg-emerald-500/20 text-emerald-500"
                                )}>
                                    {order.status}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
