package com.trading.modules.market.service;

import java.time.LocalTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.trading.modules.market.dao.MarketRepository;
import com.trading.modules.market.model.Market;
import com.trading.modules.market.model.MarketType;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class MarketConfigService {

    private final MarketRepository repository;

    @PostConstruct
    @Transactional
    public void initDefaultMarkets() {
        log.info("Checking and initializing default markets...");
        LocalTime open = LocalTime.of(9, 30);
        LocalTime close = LocalTime.of(16, 0);

        List<Market> defaults = List.of(
                Market.builder().symbol("BTCUSD").type(MarketType.CRYPTO).active(true).build(),
                Market.builder().symbol("ETHUSD").type(MarketType.CRYPTO).active(true).build(),
                Market.builder().symbol("XAUUSD").type(MarketType.FOREX).active(true).build(),
                Market.builder().symbol("AAPL").type(MarketType.STOCK).active(true).openTime(open).closeTime(close)
                        .build(),
                Market.builder().symbol("TSLA").type(MarketType.STOCK).active(true).openTime(open).closeTime(close)
                        .build(),
                Market.builder().symbol("NVDA").type(MarketType.STOCK).active(true).openTime(open).closeTime(close)
                        .build(),
                Market.builder().symbol("MSFT").type(MarketType.STOCK).active(true).openTime(open).closeTime(close)
                        .build(),
                Market.builder().symbol("GOOGL").type(MarketType.STOCK).active(true).openTime(open).closeTime(close)
                        .build(),
                Market.builder().symbol("AMZN").type(MarketType.STOCK).active(true).openTime(open).closeTime(close)
                        .build(),
                Market.builder().symbol("META").type(MarketType.STOCK).active(true).openTime(open).closeTime(close)
                        .build(),
                Market.builder().symbol("NFLX").type(MarketType.STOCK).active(true).openTime(open).closeTime(close)
                        .build(),
                Market.builder().symbol("AMD").type(MarketType.STOCK).active(true).openTime(open).closeTime(close)
                        .build(),
                Market.builder().symbol("BTCUSD-REPLAY").type(MarketType.REPLAY).active(true).build());

        defaults.forEach(market -> {
            String symbol = java.util.Objects.requireNonNull(market.getSymbol());
            if (!repository.existsById(symbol)) {
                log.info("Adding missing default market: {}", symbol);
                repository.saveAndFlush(market);
            }
        });
    }

    public List<String> getActiveSymbols() {
        return repository.findByActiveTrue().stream().map(Market::getSymbol).toList();
    }

    public List<Market> getMarketsByType(MarketType type) {
        return repository.findByActiveTrue().stream()
                .filter(m -> type.equals(m.getType()))
                .toList();
    }

    public void validateMarket(String symbol) {
        String nonNullSymbol = java.util.Objects.requireNonNull(symbol);
        Market market = repository.findById(nonNullSymbol)
                .orElseThrow(() -> new RuntimeException("Market " + nonNullSymbol + " does not exist"));

        if (!market.isActive()) {
            throw new RuntimeException("Market " + symbol + " is closed");
        }

        // Check Timed Sessions (STOCK)
        if (MarketType.STOCK.equals(market.getType())) {
            LocalTime now = LocalTime.now();
            if (market.getOpenTime() != null && now.isBefore(market.getOpenTime())) {
                throw new RuntimeException("Market " + symbol + " not yet open. Opens at " + market.getOpenTime());
            }
            if (market.getCloseTime() != null && now.isAfter(market.getCloseTime())) {
                throw new RuntimeException(
                        "Market " + symbol + " is closed for the day. Closed at " + market.getCloseTime());
            }
        }
    }
}
