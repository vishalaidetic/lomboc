package com.trading.modules.order.dto;

import com.trading.modules.order.model.OrderSide;
import com.trading.modules.order.model.OrderType;
import com.trading.modules.order.model.OrderStatus;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class OrderResponse {
    private UUID id;
    private UUID userId;
    private String symbol;
    private OrderType type;
    private OrderSide side;
    private BigDecimal price;
    private int quantity;
    private OrderStatus status;
    private LocalDateTime createdAt;
    private boolean active;
}
