import { useAuthStore } from "@/store/useAuthStore";
import { useMarketStore } from "@/store/useMarketStore";
import { useOrderStore } from "@/store/useOrderStore";
import { usePortfolioStore } from "@/store/usePortfolioStore";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";

const WS_URL = import.meta.env.VITE_WS_URL || "ws://localhost:8081/ws/market";

export function useMarketWebSocket() {
    const socketRef = useRef<WebSocket | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    // Selectors
    const { currentSymbol, updatePrice } = useMarketStore();
    const addTrade = usePortfolioStore((state) => state.addTrade);
    const handleOrderTrade = useOrderStore((state) => state.handleTradeEvent);
    const { userId } = useAuthStore();
    const queryClient = useQueryClient();

    useEffect(() => {
        let reconnectTimeout: ReturnType<typeof setTimeout>;

        const connect = () => {
            const socket = new WebSocket(WS_URL);

            socket.onopen = () => {
                setIsConnected(true);
                // Dynamic Subscription on login/connect
                if (currentSymbol) {
                    socket.send(JSON.stringify({ type: "SUBSCRIBE", symbol: currentSymbol }));
                }
            };

            socket.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);

                    // Routing Logic based on Event Type
                    if (data.symbol && data.price) {
                        updatePrice(data.symbol, data.price);
                    }

                    // Trade Execution Flow
                    if (data.tradeId || (data.buyUserId && data.sellUserId)) {
                        const isRelevant = data.buyUserId === userId || data.sellUserId === userId;

                        if (isRelevant) {
                            // Update matching order statuses
                            handleOrderTrade(data, userId);

                            // Sync portfolio data
                            queryClient.invalidateQueries({ queryKey: ["portfolio", userId] });

                            // Record trade in local history
                            addTrade({
                                id: data.tradeId || Math.random().toString(),
                                buyOrderId: data.buyOrderId,
                                buyUserId: data.buyUserId,
                                sellOrderId: data.sellOrderId,
                                sellUserId: data.sellUserId,
                                symbol: data.symbol,
                                price: data.price,
                                quantity: data.quantity,
                                executedAt: data.executedAt || new Date().toISOString()
                            });
                        }
                    }
                } catch (error) {
                    console.error("WS Parse Error", error);
                }
            };

            socket.onclose = () => {
                console.log("Market WebSocket disconnected, retrying...");
                setIsConnected(false);
                reconnectTimeout = setTimeout(connect, 3000);
            };

            socket.onerror = (error) => {
                console.error("Market WebSocket error:", error);
                socket.close();
            };

            socketRef.current = socket;
        };

        connect();

        return () => {
            if (socketRef.current) {
                socketRef.current.close();
            }
            clearTimeout(reconnectTimeout);
        };
    }, [updatePrice, currentSymbol, userId]); // Re-connect or send sub on symbol change

    return { isConnected };
}
