import type { CreateOrderRequest, OrderResponse } from "@/types/order";
import { api } from "./client";

export const orderService = {
    createOrder: async (request: CreateOrderRequest): Promise<OrderResponse> => {
        const { data } = await api.post<OrderResponse>("/orders", request);
        return data;
    },

    getOrdersByUserId: async (userId: string): Promise<OrderResponse[]> => {
        const { data } = await api.get<OrderResponse[]>(`/orders/user/${userId}`);
        return data;
    },
};
