package com.trading.modules.market.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.trading.infrastructure.kafka.producer.EventPublisher;
import com.trading.shared.event.PriceTickEvent;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class MarketPulseGenerator {

    private final MarketConfigService configService;
    private final EventPublisher publisher;
    private final Random random = new Random();

    // Store current "synthetic" prices for each symbol
    private final Map<String, BigDecimal> lastPrices = new HashMap<>();

    /**
     * Generate minor price fluctuations every second for all active symbols.
     * This makes the dashboard feel alive and provides real-time PnL simulation.
     */
    @Scheduled(fixedRate = 1000)
    public void generatePulses() {
        // Only pulse STOCK type symbols for real-time simulation
        configService.getMarketsByType(com.trading.modules.market.model.MarketType.STOCK).forEach(market -> {
            String symbol = market.getSymbol();
            BigDecimal current = lastPrices.getOrDefault(symbol, getInitialPrice(symbol));

            // Generate a small fluctuation (-0.5% to +0.5%)
            double percentChange = (random.nextDouble() - 0.5) * 0.01;
            BigDecimal change = current.multiply(BigDecimal.valueOf(percentChange));
            BigDecimal updated = current.add(change).setScale(2, RoundingMode.HALF_UP);

            lastPrices.put(symbol, updated);

            // Publish to price.tick topic which is consumed by MarketKafkaConsumer
            // It will update Redis cache and broadcast to all WebSockets
            publisher.publish("price.tick", symbol, new PriceTickEvent(symbol, updated));
        });
    }

    private BigDecimal getInitialPrice(String symbol) {
        return switch (symbol) {
            case "BTCUSD" -> BigDecimal.valueOf(65000);
            case "ETHUSD" -> BigDecimal.valueOf(3500);
            case "XAUUSD" -> BigDecimal.valueOf(2350);
            case "AAPL" -> BigDecimal.valueOf(185);
            case "TSLA" -> BigDecimal.valueOf(175);
            case "NVDA" -> BigDecimal.valueOf(880);
            case "MSFT" -> BigDecimal.valueOf(420);
            case "GOOGL" -> BigDecimal.valueOf(155);
            default -> BigDecimal.valueOf(100);
        };
    }
}
