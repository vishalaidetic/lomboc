package com.trading.modules.trade.consumer;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import com.trading.modules.settlement.service.SettlementService;
import com.trading.modules.trade.service.TradeService;
import com.trading.shared.event.TradeExecutedEvent;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class TradeConsumer {

    private final TradeService tradeService;
    private final SettlementService settlementService;
    private final org.springframework.data.redis.core.StringRedisTemplate redisTemplate;

    private static final String PROCESSED_TRADES_KEY = "trading:trades:processed";

    @KafkaListener(topics = "trade.executed", groupId = "portfolio-group")
    public void consume(TradeExecutedEvent event) {
        // Phase 5: Distributed Deduplication (Exactly-once semantics)
        Boolean alreadyProcessed = redisTemplate.opsForSet().isMember(PROCESSED_TRADES_KEY,
                event.getTradeId().toString());
        if (Boolean.TRUE.equals(alreadyProcessed)) {
            log.warn("Trade {} already settled, skipping duplicate event.", event.getTradeId());
            return;
        }

        log.info("Trade Consumer received event for trade: {} | Symbol: {}",
                event.getTradeId(), event.getSymbol());

        try {
            tradeService.saveTrade(event);
            settlementService.process(event);

            // Mark as processed in Redis (idempotency)
            redisTemplate.opsForSet().add(PROCESSED_TRADES_KEY, event.getTradeId().toString());

            log.info("Trade and Settlement settled permanently for trade: {}", event.getTradeId());
        } catch (Exception e) {
            log.error("Critical Settlement Error for trade {}: {}", event.getTradeId(), e.getMessage());
        }
    }
}
