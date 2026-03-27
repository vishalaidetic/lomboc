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
    const [latency, setLatency] = useState<number>(0);
    const pingSentTimeRef = useRef<number>(0);

    // Selectors
    const { currentSymbol, updatePrice } = useMarketStore();
    const addTrade = usePortfolioStore((state) => state.addTrade);
    const handleOrderTrade = useOrderStore((state) => state.handleTradeEvent);
    const { userId } = useAuthStore();
    const queryClient = useQueryClient();

    useEffect(() => {
        let reconnectTimeout: ReturnType<typeof setTimeout>;
        let heartbeatInterval: ReturnType<typeof setInterval>;

        const connect = () => {
            const socket = new WebSocket(WS_URL);

            socket.onopen = () => {
                setIsConnected(true);
                if (currentSymbol) {
                    socket.send(JSON.stringify({ type: "SUBSCRIBE", symbol: currentSymbol }));
                }

                // Start Latency Heartbeat
                heartbeatInterval = setInterval(() => {
                    if (socket.readyState === WebSocket.OPEN) {
                        pingSentTimeRef.current = Date.now();
                        socket.send(JSON.stringify({ type: "PING" }));
                    }
                }, 5000);
            };

            socket.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);

                    if (data.type === "PONG") {
                        const rtt = Date.now() - pingSentTimeRef.current;
                        setLatency(rtt);
                        return;
                    }

                    const isSimulationMode = useMarketStore.getState().isSimulationMode;
                    const simulationSessionId = useMarketStore.getState().simulationSessionId;

                    if (data.symbol && data.price) {
                        const tickSessionId = data.sessionId || null;
                        const isMatch = isSimulationMode
                            ? (tickSessionId === simulationSessionId)
                            : (tickSessionId === null);

                        if (isMatch) {
                            updatePrice(data.symbol, data.price);
                        }
                    }

                    if (data.tradeId || (data.buyUserId && data.sellUserId)) {
                        const isRelevant = data.buyUserId === userId || data.sellUserId === userId;
                        if (isRelevant) {
                            handleOrderTrade(data, userId);
                            queryClient.invalidateQueries({ queryKey: ["portfolio", userId] });
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
                setIsConnected(false);
                clearInterval(heartbeatInterval);
                reconnectTimeout = setTimeout(connect, 3000);
            };

            socket.onerror = (error) => {
                socket.close();
            };

            socketRef.current = socket;
        };

        connect();

        return () => {
            if (socketRef.current) socketRef.current.close();
            clearTimeout(reconnectTimeout);
            clearInterval(heartbeatInterval);
        };
    }, [updatePrice, currentSymbol, userId]);

    return { isConnected, latency };
}
