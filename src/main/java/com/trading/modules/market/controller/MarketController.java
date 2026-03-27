package com.trading.modules.market.controller;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.trading.modules.market.cache.MarketCacheService;
import com.trading.modules.market.dao.MarketRepository;
import com.trading.modules.market.model.Market;
import com.trading.shared.event.PriceTickEvent;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/market")
public class MarketController {

    private final MarketCacheService cacheService;
    private final MarketRepository marketRepository;

    @GetMapping("/price/{symbol}")
    public ResponseEntity<PriceTickEvent> getPrice(@PathVariable String symbol) {
        // 1. Check Redis for sub-millisecond price retrieval (Hot Data)
        BigDecimal price = cacheService.getPrice(symbol);

        // 2. Fallback to Database Persistence if Redis is cold (After Refresh/Restart)
        if (price == null) {
            price = marketRepository.findById(symbol)
                    .map(Market::getLastPrice)
                    .orElse(BigDecimal.ZERO); // Use actual 0 or last known DB price
        }

        return ResponseEntity.ok(new PriceTickEvent(symbol, price));
    }

    @GetMapping("/symbols")
    public ResponseEntity<List<Market>> getSymbols() {
        return ResponseEntity.ok(marketRepository.findAll());
    }

    @GetMapping("/exchange-rate")
    public ResponseEntity<Map<String, BigDecimal>> getExchangeRate() {
        return ResponseEntity.ok(Map.of("EUR", BigDecimal.valueOf(0.925)));
    }
}
