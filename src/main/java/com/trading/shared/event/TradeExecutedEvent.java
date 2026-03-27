package com.trading.shared.event;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

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
    private LocalDateTime executedAt;

    public TradeExecutedEvent(String buyOrderId, UUID buyUserId, String sellOrderId, UUID sellUserId, String symbol,
            BigDecimal price, int quantity) {
        this.tradeId = UUID.randomUUID();
        this.buyOrderId = buyOrderId;
        this.buyUserId = buyUserId;
        this.sellOrderId = sellOrderId;
        this.sellUserId = sellUserId;
        this.symbol = symbol;
        this.price = price;
        this.quantity = quantity;
        this.executedAt = LocalDateTime.now();
    }
}
