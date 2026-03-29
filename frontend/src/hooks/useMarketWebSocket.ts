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

    // Stably selected actions/state
    const currentSymbol = useMarketStore(s => s.currentSymbol);
    const updatePrice = useMarketStore(s => s.updatePrice);
    const addTrade = usePortfolioStore(s => s.addTrade);
    const handleOrderTrade = useOrderStore(s => s.handleTradeEvent);
    const userId = useAuthStore(s => s.userId);
    const queryClient = useQueryClient();

    // Use refs for stable access to actions inside the effect
    const actionsRef = useRef({ updatePrice, addTrade, handleOrderTrade, userId });
    useEffect(() => {
        actionsRef.current = { updatePrice, addTrade, handleOrderTrade, userId };
    }, [updatePrice, addTrade, handleOrderTrade, userId]);

    useEffect(() => {
        let reconnectTimeout: ReturnType<typeof setTimeout>;
        let heartbeatInterval: ReturnType<typeof setInterval>;
        let isActive = true;

        const connect = () => {
            if (!isActive) return;

            console.log(`[WS] Attempting connection to ${WS_URL} for symbol: ${currentSymbol}`);
            const socket = new WebSocket(WS_URL);
            socketRef.current = socket;

            socket.onopen = () => {
                if (!isActive) {
                    socket.close();
                    return;
                }
                console.log(`[WS] Connected to market: ${currentSymbol}`);
                setIsConnected(true);
                if (currentSymbol) {
                    socket.send(JSON.stringify({ type: "SUBSCRIBE", symbol: currentSymbol }));
                }

                heartbeatInterval = setInterval(() => {
                    if (socket.readyState === WebSocket.OPEN) {
                        pingSentTimeRef.current = Date.now();
                        socket.send(JSON.stringify({ type: "PING" }));
                    }
                }, 10000); // 10s heartbeat
            };

            socket.onmessage = (event) => {
                if (!isActive) return;
                try {
                    const data = JSON.parse(event.data);
                    const { updatePrice: up, addTrade: at, handleOrderTrade: hot } = actionsRef.current;

                    if (data.type === "PONG") {
                        setLatency(Date.now() - pingSentTimeRef.current);
                        return;
                    }

                    const state = useMarketStore.getState();
                    if (data.symbol && data.price) {
                        const isMatch = state.isSimulationMode
                            ? (data.sessionId === state.simulationSessionId)
                            : (!data.sessionId);

                        if (isMatch) up(data.symbol, data.price);
                    }

                    if (data.tradeId || (data.buyUserId && data.sellUserId)) {
                        const uid = actionsRef.current.userId;
                        if (data.buyUserId === uid || data.sellUserId === uid) {
                            hot(data, uid || "");
                            queryClient.invalidateQueries({ queryKey: ["portfolio", uid] });
                            at({
                                id: data.tradeId || Math.random().toString(),
                                ...data,
                                executedAt: data.executedAt || new Date().toISOString()
                            });
                        }
                    }
                } catch (error) {
                    console.error("[WS] Parse Error", error);
                }
            };

            socket.onclose = () => {
                setIsConnected(false);
                clearInterval(heartbeatInterval);
                if (isActive) {
                    reconnectTimeout = setTimeout(connect, 3000);
                }
            };

            socket.onerror = (error) => {
                console.error("[WS] Connection Error", error);
            };
        };

        // Delay the first connection slightly to let the component settle
        reconnectTimeout = setTimeout(connect, 100);

        return () => {
            isActive = false;
            console.log("[WS] Cleaning up connection");
            if (socketRef.current) {
                if (socketRef.current.readyState === WebSocket.CONNECTING || socketRef.current.readyState === WebSocket.OPEN) {
                    socketRef.current.close();
                }
                socketRef.current = null;
            }
            clearTimeout(reconnectTimeout);
            clearInterval(heartbeatInterval);
        };
    }, [currentSymbol, userId, queryClient]); // Only reconnect if the symbol or user identification changes.

    return { isConnected, latency };
}
