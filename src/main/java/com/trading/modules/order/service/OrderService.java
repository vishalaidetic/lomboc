package com.trading.modules.order.service;

import java.util.List;
import java.util.UUID;
import com.trading.modules.order.dto.CreateOrderRequest;
import com.trading.modules.order.dto.OrderResponse;
import com.trading.modules.order.model.OrderStatus;

public interface OrderService {
    OrderResponse createOrder(CreateOrderRequest request);

    List<OrderResponse> getOrdersByUserId(UUID userId);

    void updateOrderStatus(UUID orderId, OrderStatus status);
}
