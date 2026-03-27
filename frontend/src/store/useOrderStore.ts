import { type OrderResponse } from "@/types/order";
import { create } from "zustand";

interface OrderState {
    orders: OrderResponse[];
    addOrder: (order: OrderResponse) => void;
    setOrders: (orders: OrderResponse[]) => void;
    updateOrderStatus: (id: string, status: OrderResponse["status"]) => void;
    handleTradeEvent: (trade: {
        buyOrderId: string;
        sellOrderId: string;
        buyUserId: string;
        sellUserId: string;
    }, currentUserId: string) => void;
}

export const useOrderStore = create<OrderState>((set) => ({
    orders: [],
    addOrder: (order) =>
        set((state) => ({
            orders: [order, ...state.orders].slice(0, 50),
        })),
    setOrders: (orders) => set({ orders }),
    updateOrderStatus: (id, status) =>
        set((state) => ({
            orders: state.orders.map((o) => (o.id === id ? { ...o, status } : o)),
        })),
    handleTradeEvent: (trade, currentUserId) => {
        set((state) => ({
            orders: state.orders.map((o) => {
                const isMatched = (o.id === trade.buyOrderId && trade.buyUserId === currentUserId) ||
                    (o.id === trade.sellOrderId && trade.sellUserId === currentUserId);
                return isMatched ? { ...o, status: 'FILLED' as any } : o;
            }),
        }));
    },
}));
