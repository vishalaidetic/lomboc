package com.trading.modules.market.consumer;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.trading.modules.market.cache.MarketCacheService;
import com.trading.modules.market.dao.MarketRepository;
import com.trading.modules.market.websocket.MarketWebSocketHandler;
import com.trading.shared.event.PriceTickEvent;
import com.trading.shared.event.TradeExecutedEvent;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class MarketKafkaConsumer {

    private final MarketCacheService cacheService;
    private final MarketWebSocketHandler socketHandler;
    private final MarketRepository marketRepository;

    @KafkaListener(topics = "trade.executed", groupId = "market-data-group")
    @Transactional
    public void consumeTrade(TradeExecutedEvent event) {
        log.info("Consumed TradeExecutedEvent for {}: {} @ {}",
                event.getSymbol(), event.getQuantity(), event.getPrice());

        // 1. Update latest price in Redis for sub-millisecond UI speed
        cacheService.updatePrice(event.getSymbol(), event.getPrice());

        // 2. Persist to Database for long-term consistency (Refreshes/Restarts)
        if (event.getSessionId() == null) {
            marketRepository.findById(event.getSymbol()).ifPresent(m -> {
                m.setLastPrice(event.getPrice());
                marketRepository.saveAndFlush(m);
            });
        }

        // 3. Broadcast to all active WebSocket sessions
        socketHandler.broadcast(event);
    }

    /**
     * Handle Price Tick Events (History Ticks & Replay Data)
     */
    @KafkaListener(topics = "price.tick", groupId = "market-price-group")
    public void consumePriceTick(PriceTickEvent event) {
        // Update Cache so the Big Ticker polls the right value during replay
        cacheService.updatePrice(event.getSymbol(), event.getPrice());

        // Broadcast to chart
        socketHandler.broadcast(event);
    }
}
