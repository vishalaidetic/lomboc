package com.trading.shared.event;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class PriceTickEvent extends BaseEvent {
    private String symbol;
    private BigDecimal price;
    private long timestamp;
    private String sessionId; // null for live data, UUID for simulation

    public PriceTickEvent(String symbol, BigDecimal price) {
        this.symbol = symbol;
        this.price = price;
        this.timestamp = System.currentTimeMillis();
        this.sessionId = null; // Live default
    }
}
