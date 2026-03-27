package com.trading.modules.market.websocket;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class MarketBroadcastService {

    private final StringRedisTemplate redisTemplate;
    private final ObjectMapper objectMapper;
    private final MarketWebSocketHandler webSocketHandler;

    private static final String MARKET_DATA_TOPIC = "trading:market:data";

    /**
     * Listen to trade executions from any matching engine instance
     * and broadcast to Redis for cross-node UI synchronization.
     */
    @KafkaListener(topics = "trade.executed", groupId = "market-broadcast-group")
    public void handleTradeExecuted(Object event) {
        try {
            String payload = objectMapper.writeValueAsString(event);

            // 1. Broadcast to local WebSocket sessions on this instance
            webSocketHandler.broadcast(event);

            // 2. Publish to Redis for other WebSocket node instances to hear
            redisTemplate.convertAndSend(MARKET_DATA_TOPIC, payload);

        } catch (Exception e) {
            log.error("Failed to broadcast market event: {}", e.getMessage());
        }
    }
}
