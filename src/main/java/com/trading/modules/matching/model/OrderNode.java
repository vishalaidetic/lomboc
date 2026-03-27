package com.trading.modules.matching.model;

import java.math.BigDecimal;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class OrderNode {
    private String orderId;
    private UUID userId;
    private BigDecimal price;
    private int quantity;
    private long timestamp;
}
