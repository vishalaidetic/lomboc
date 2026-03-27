package com.trading.shared.event;

import java.math.BigDecimal;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class TradeExecutedEvent extends BaseEvent {
    private UUID tradeId;

    private String buyOrderId;
    private UUID buyUserId;

    private String sellOrderId;
    private UUID sellUserId;

    private String symbol;
    private BigDecimal price;
    private int quantity;
    @com.fasterxml.jackson.annotation.JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS")
    private java.time.LocalDateTime executedAt;

    public TradeExecutedEvent(String buyOrderId, java.util.UUID buyUserId, String sellOrderId,
            java.util.UUID sellUserId, String symbol,
            java.math.BigDecimal price, int quantity) {
        this.tradeId = java.util.UUID.randomUUID();
        this.buyOrderId = buyOrderId;
        this.buyUserId = buyUserId;
        this.sellOrderId = sellOrderId;
        this.sellUserId = sellUserId;
        this.symbol = symbol;
        this.price = price;
        this.quantity = quantity;
        this.executedAt = java.time.LocalDateTime.now();
    }
}
