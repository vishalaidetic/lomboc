import { api } from "@/api/client";
import { useOrderStore } from "@/store/useOrderStore";
import { type CreateOrderRequest, type OrderResponse, OrderStatus } from "@/types/order";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useOrderMutation() {
    const queryClient = useQueryClient();
    const addOrder = useOrderStore((state) => state.addOrder);

    return useMutation({
        mutationFn: async (req: CreateOrderRequest) => {
            const { data } = await api.post<OrderResponse>("/orders", req);
            return data;
        },
        // Optimistic Update
        onMutate: async (newOrderRequest) => {
            // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
            await queryClient.cancelQueries({ queryKey: ["orders"] });

            // Create a temporary ID and response structure
            const tempId = `temp-${Date.now()}`;
            const optimisticOrder: OrderResponse = {
                id: tempId,
                userId: newOrderRequest.userId || "",
                symbol: newOrderRequest.symbol,
                type: newOrderRequest.type,
                side: newOrderRequest.side,
                price: newOrderRequest.price,
                quantity: newOrderRequest.quantity,
                status: OrderStatus.PENDING,
                createdAt: new Date().toISOString(),
            };

            // Update Zustand store optimistically
            addOrder(optimisticOrder);

            return { tempId };
        },
        onSuccess: (realOrder, _variables, context) => {
            toast.success(`Order Placed: ${realOrder.side} ${realOrder.symbol} @ ${realOrder.price}`);

            // Replace the temporary order in the store with the real one from server
            useOrderStore.setState((state) => ({
                orders: state.orders.map((o) =>
                    o.id === context?.tempId ? realOrder : o
                ),
            }));
        },
        onError: (err: any, variables, context) => {
            console.error("Order failed:", err);

            const message = err.response?.data?.message || err.message || "Something went wrong";
            toast.error(`Order Failed: ${message}`, {
                description: `${variables.side} ${variables.symbol} was not submitted.`
            });

            // Remove the failed optimistic order
            useOrderStore.setState((state) => ({
                orders: state.orders.filter((o) => o.id !== context?.tempId),
            }));
        },
        onSettled: () => {
            // Invalidate the cache to ensure we're in sync with the server
            queryClient.invalidateQueries({ queryKey: ["orders"] });
        },
    });
}
