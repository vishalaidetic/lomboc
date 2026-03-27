package com.trading.modules.market.websocket;

import java.io.IOException;
import java.util.Collections;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Component
@RequiredArgsConstructor
public class MarketWebSocketHandler extends TextWebSocketHandler {

    private final ObjectMapper objectMapper;
    private final Map<WebSocketSession, Set<String>> sessionSubscriptions = new ConcurrentHashMap<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        log.info("New market WebSocket connection: {}", session.getId());
        sessionSubscriptions.put(session, ConcurrentHashMap.newKeySet());
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        log.info("WebSocket connection closed: {}", session.getId());
        sessionSubscriptions.remove(session);
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        JsonNode node = objectMapper.readTree(message.getPayload());
        String type = node.path("type").asText();
        String symbol = node.path("symbol").asText();

        if ("SUBSCRIBE".equalsIgnoreCase(type)) {
            sessionSubscriptions.getOrDefault(session, Collections.emptySet()).add(symbol);
            log.info("Session {} subscribed to {}", session.getId(), symbol);
        } else if ("UNSUBSCRIBE".equalsIgnoreCase(type)) {
            sessionSubscriptions.getOrDefault(session, Collections.emptySet()).remove(symbol);
            log.info("Session {} unsubscribed from {}", session.getId(), symbol);
        } else if ("PING".equalsIgnoreCase(type)) {
            // Echo back PONG for latency measurement
            session.sendMessage(new TextMessage("{\"type\":\"PONG\"}"));
        }
    }

    /**
     * Broadcasts a message to all sessions subscribed to the symbol in the payload.
     * Payload must have a 'symbol' property.
     */
    public void broadcast(Object payload) {
        try {
            String message = objectMapper.writeValueAsString(payload);
            TextMessage textMessage = new TextMessage(message);

            // Extract symbol from payload
            JsonNode node = objectMapper.readTree(message);
            String symbol = node.path("symbol").asText();

            sessionSubscriptions.forEach((session, subscribedSymbols) -> {
                if (session.isOpen() && (symbol.isEmpty() || subscribedSymbols.contains(symbol))) {
                    synchronized (session) {
                        try {
                            session.sendMessage(textMessage);
                        } catch (IOException e) {
                            log.warn("Failed to send message to session {}: {}", session.getId(), e.getMessage());
                        }
                    }
                }
            });
        } catch (Exception e) {
            log.error("Failed to broadcast WebSocket payload: {}", e.getMessage());
        }
    }
}
