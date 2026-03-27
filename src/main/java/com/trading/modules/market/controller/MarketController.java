package com.trading.modules.market.controller;

import java.math.BigDecimal;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.trading.modules.market.cache.MarketCacheService;
import com.trading.shared.event.PriceTickEvent;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/market")
public class MarketController {

    private final MarketCacheService cacheService;

    @GetMapping("/price/{symbol}")
    public ResponseEntity<PriceTickEvent> getPrice(@PathVariable String symbol) {
        BigDecimal price = cacheService.getPrice(symbol);
        if (price == null) {
            price = BigDecimal.valueOf(50000.00); // Default placeholder
        }
        return ResponseEntity.ok(new PriceTickEvent(symbol, price));
    }

    @GetMapping("/symbols")
    public ResponseEntity<java.util.List<String>> getSymbols() {
        return ResponseEntity.ok(java.util.List.of("BTCUSD", "ETHUSD", "SOLUSD"));
    }
}
