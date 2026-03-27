package com.trading.modules.market.cache;

import java.math.BigDecimal;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MarketCacheService {

    private final RedisTemplate<String, Object> redisTemplate;
    private static final String PRICE_PREFIX = "PRICE:";

    public void updatePrice(String symbol, BigDecimal price) {
        redisTemplate.opsForValue().set(PRICE_PREFIX + symbol, price);
    }

    public BigDecimal getPrice(String symbol) {
        Object price = redisTemplate.opsForValue().get(PRICE_PREFIX + symbol);
        if (price instanceof BigDecimal) {
            return (BigDecimal) price;
        } else if (price instanceof Double) {
            return BigDecimal.valueOf((Double) price);
        }
        return null;
    }
}
