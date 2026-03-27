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
        if (repository.count() == 0) {
            log.info("Initializing default markets...");
            List<Market> defaults = List.of(
                    Market.builder().symbol("BTCUSD").type(MarketType.CRYPTO).active(true).build(),
                    Market.builder().symbol("ETHUSD").type(MarketType.CRYPTO).active(true).build(),
                    Market.builder().symbol("XAUUSD").type(MarketType.FOREX).active(true).build(),
                    Market.builder().symbol("AAPL").type(MarketType.STOCK).active(true)
                            .openTime(LocalTime.of(9, 30))
                            .closeTime(LocalTime.of(16, 0))
                            .build(),
                    Market.builder().symbol("BTCUSD-REPLAY").type(MarketType.REPLAY).active(true).build());
            repository.saveAll(defaults);
        }
    }

    public List<String> getActiveSymbols() {
        return repository.findByActiveTrue().stream().map(Market::getSymbol).toList();
    }

    public void validateMarket(String symbol) {
        Market market = repository.findById(symbol)
                .orElseThrow(() -> new RuntimeException("Market " + symbol + " does not exist"));

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
