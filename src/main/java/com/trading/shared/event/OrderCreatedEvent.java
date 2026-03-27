package com.trading.shared.event;

import com.trading.modules.order.model.OrderSide;
import com.trading.modules.order.model.OrderType;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;
import java.util.UUID;

@Data
@EqualsAndHashCode(callSuper = true)
public class OrderCreatedEvent extends BaseEvent {
    private String orderId;
    private UUID userId;
    private String symbol;
    private OrderType type;
    private OrderSide side;
    private BigDecimal price;
    private int quantity;
}
