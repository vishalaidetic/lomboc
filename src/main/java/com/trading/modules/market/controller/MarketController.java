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

    @GetMapping("/fundamentals/{symbol}")
    public ResponseEntity<com.trading.modules.market.dto.StockFundamentalResponse> getFundamentals(
            @PathVariable String symbol) {
        // Mocking professional fundamental data for simulation
        java.math.BigDecimal marketCap = java.math.BigDecimal.valueOf(2.5)
                .multiply(java.math.BigDecimal.valueOf(Math.pow(10, 12))); // $2.5T
        if (symbol.equals("NVDA"))
            marketCap = java.math.BigDecimal.valueOf(2.2).multiply(java.math.BigDecimal.valueOf(Math.pow(10, 12)));
        if (symbol.equals("TSLA"))
            marketCap = java.math.BigDecimal.valueOf(550).multiply(java.math.BigDecimal.valueOf(Math.pow(10, 9)));

        return ResponseEntity.ok(com.trading.modules.market.dto.StockFundamentalResponse.builder()
                .symbol(symbol)
                .marketCap(marketCap)
                .peRatio(java.math.BigDecimal.valueOf(28.4 + (Math.random() * 5)))
                .dividendYield(java.math.BigDecimal.valueOf(0.65))
                .volume24h(java.math.BigDecimal.valueOf(18500000))
                .high52w(java.math.BigDecimal.valueOf(195.4))
                .low52w(java.math.BigDecimal.valueOf(120.5))
                .companyDescription(
                        "Leading global technology company focused on innovation and sustainable growth in the "
                                + symbol + " sector.")
                .build());
    }

    @GetMapping("/exchange-rate")
    public ResponseEntity<Map<String, BigDecimal>> getExchangeRate() {
        return ResponseEntity.ok(Map.of("EUR", BigDecimal.valueOf(0.925)));
    }
}
