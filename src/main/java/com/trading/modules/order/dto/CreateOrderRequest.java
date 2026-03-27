package com.trading.modules.order.dto;

import java.math.BigDecimal;
import java.util.UUID;

import com.trading.modules.order.model.OrderSide;
import com.trading.modules.order.model.OrderType;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class CreateOrderRequest {
    @NotNull(message = "User ID is required")
    private UUID userId;
    @NotBlank(message = "Symbol is required")
    private String symbol;
    @NotNull(message = "Order Type is required")
    private OrderType type;
    @NotNull(message = "Order Side is required")
    private OrderSide side;
    @NotNull(message = "Price is required")
    @Positive(message = "Price must be positive")
    private BigDecimal price;
    @Min(value = 1, message = "Quantity must be at least 1")
    private int quantity;
}
