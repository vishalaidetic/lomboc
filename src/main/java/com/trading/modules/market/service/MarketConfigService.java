package com.trading.modules.market.service;

import java.util.List;
import java.util.Optional;

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
                    Market.builder().symbol("SOLUSD").type(MarketType.CRYPTO).active(true).build(),
                    Market.builder().symbol("AAPL").type(MarketType.STOCK).active(true).build());
            repository.saveAll(defaults);
        }
    }

    public List<String> getActiveSymbols() {
        return repository.findByActiveTrue().stream().map(Market::getSymbol).toList();
    }

    public void validateMarket(String symbol) {
        Optional<Market> market = repository.findById(symbol);
        if (market.isEmpty() || !market.get().isActive()) {
            throw new RuntimeException("Market " + symbol + " is closed or does not exist");
        }
    }
}
