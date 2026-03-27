package com.trading.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.listener.PatternTopic;
import org.springframework.data.redis.listener.RedisMessageListenerContainer;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;
import org.springframework.lang.NonNull;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.trading.modules.market.websocket.MarketBroadcastService;

@Configuration
public class RedisConfig {

    private static final String TRADE_BROADCAST_TOPIC = "trading:trades:broadcast";

    /**
     * Shared RedisTemplate for and Object value serialization.
     * Uses application-managed ObjectMapper for consistent Date/Time handling.
     */
    @Bean
    public RedisTemplate<String, Object> redisTemplate(
            @NonNull RedisConnectionFactory connectionFactory,
            @NonNull ObjectMapper objectMapper) {

        RedisTemplate<String, Object> template = new RedisTemplate<>();
        template.setConnectionFactory(connectionFactory);
        template.setKeySerializer(new StringRedisSerializer());
        template.setValueSerializer(new GenericJackson2JsonRedisSerializer(objectMapper));

        return template;
    }

    @Bean
    public RedisMessageListenerContainer container(
            @NonNull RedisConnectionFactory connectionFactory,
            @NonNull MarketBroadcastService broadcastService) {

        RedisMessageListenerContainer container = new RedisMessageListenerContainer();
        container.setConnectionFactory(connectionFactory);
        container.addMessageListener(broadcastService, new PatternTopic(TRADE_BROADCAST_TOPIC));

        return container;
    }
}
