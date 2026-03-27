package com.trading.modules.market.consumer;

import com.trading.modules.market.cache.MarketCacheService;
import com.trading.modules.market.websocket.MarketWebSocketHandler;
import com.trading.shared.event.TradeExecutedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class MarketKafkaConsumer {

    private final MarketCacheService cacheService;
    private final MarketWebSocketHandler socketHandler;

    @KafkaListener(topics = "trade.executed", groupId = "market-data-group")
    public void consumeTrade(TradeExecutedEvent event) {
        log.info("Consumed TradeExecutedEvent for {}: {} @ {}",
                event.getSymbol(), event.getQuantity(), event.getPrice());

        // 1. Update latest price in Redis
        cacheService.updatePrice(event.getSymbol(), event.getPrice());

        // 2. Broadcast to all active WebSocket sessions
        socketHandler.broadcast(event);
    }
}
