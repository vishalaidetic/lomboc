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
        Boolean alreadyProcessed = redisTemplate.opsForSet().isMember(PROCESSED_TRADES_KEY,
                event.getTradeId().toString());
        if (Boolean.TRUE.equals(alreadyProcessed)) {
            log.warn("Trade {} already settled, skipping duplicate.", event.getTradeId());
            return;
        }

        log.info("TradeConsumer: processing trade {} | symbol: {}", event.getTradeId(), event.getSymbol());

        try {
            tradeService.saveTrade(event);
            settlementService.process(event);
            redisTemplate.opsForSet().add(PROCESSED_TRADES_KEY, event.getTradeId().toString());
            log.info("Settlement complete for trade: {}", event.getTradeId());
        } catch (Exception e) {
            log.error("Settlement failed for trade {}: {}", event.getTradeId(), e.getMessage(), e);
        }
    }
}
