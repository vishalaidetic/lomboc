package com.trading.modules.market.websocket;

import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.connection.MessageListener;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class MarketBroadcastService implements MessageListener {

    private final RedisTemplate<String, Object> redisTemplate;
    private final MarketWebSocketHandler webSocketHandler;

    @Override
    public void onMessage(Message message, byte[] pattern) {
        try {
            // Redis Template deserializes based on its config.
            // If using GenericJackson2JsonRedisSerializer, we can get the object directly.
            Object event = redisTemplate.getValueSerializer().deserialize(message.getBody());

            log.debug("Received trade from Redis: {}", event);

            // Broadcast to local subscribers of the symbol
            webSocketHandler.broadcast(event);

        } catch (Exception e) {
            log.error("Failed to process Redis broadcast message: {}", e.getMessage());
        }
    }
}
