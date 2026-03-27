package com.trading.modules.portfolio.service;

import java.util.UUID;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PortfolioCacheService {

    private final RedisTemplate<String, Object> redisTemplate;

    public void cachePortfolio(UUID userId, Object data) {
        redisTemplate.opsForValue().set("PORTFOLIO:" + userId, data);
    }

    public Object getPortfolio(UUID userId) {
        return redisTemplate.opsForValue().get("PORTFOLIO:" + userId);
    }
}
