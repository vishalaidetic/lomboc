package com.trading.modules.trade.dto;

import java.math.BigDecimal;
import java.util.UUID;

import lombok.Data;

@Data
public class TradeResponse {
    private UUID id;
    private String buyOrderId;
    private UUID buyUserId;
    private String sellOrderId;
    private UUID sellUserId;
    private String symbol;
    private BigDecimal price;
    private int quantity;
    private long timestamp;
}
