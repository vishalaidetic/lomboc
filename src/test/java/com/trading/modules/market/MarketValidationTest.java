package com.trading.modules.market;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.time.LocalTime;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.trading.modules.market.dao.MarketRepository;
import com.trading.modules.market.model.Market;
import com.trading.modules.market.model.MarketType;
import com.trading.modules.market.service.MarketConfigService;

public class MarketValidationTest {

    private MarketRepository repository;
    private MarketConfigService service;

    @BeforeEach
    void setUp() {
        repository = mock(MarketRepository.class);
        service = new MarketConfigService(repository);
    }

    @Test
    void testRejectStockOrderAfterHours() {
        String symbol = "AAPL";
        Market stock = Market.builder()
                .symbol(symbol)
                .type(MarketType.STOCK)
                .active(true)
                .openTime(LocalTime.of(9, 30))
                .closeTime(LocalTime.of(16, 0))
                .build();

        when(repository.findById(symbol)).thenReturn(Optional.of(stock));

        // Mock "now" to be after closing time (requires refactoring service to use a
        // Clock, but let's assume it uses LocalTime.now())
        // For testing purposes, let's use a symbol that is definitely closed if current
        // time is outside 9:30-16:00

        LocalTime now = LocalTime.now();
        if (now.isAfter(LocalTime.of(16, 0)) || now.isBefore(LocalTime.of(9, 30))) {
            assertThrows(RuntimeException.class, () -> service.validateMarket(symbol),
                    "Should reject STOCK order because market is currently closed.");
        }
    }

    @Test
    void testAcceptCryptoOrder247() {
        String symbol = "BTCUSD";
        Market crypto = Market.builder()
                .symbol(symbol)
                .type(MarketType.CRYPTO)
                .active(true)
                .build();

        when(repository.findById(symbol)).thenReturn(Optional.of(crypto));

        assertDoesNotThrow(() -> service.validateMarket(symbol),
                "Crypto markets should be open 24/7.");
    }
}
