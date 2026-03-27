package com.trading.modules.order.mapper;

import com.trading.modules.order.dto.OrderResponse;
import com.trading.modules.order.model.Order;
import org.springframework.stereotype.Component;

@Component
public class OrderMapper {

    public OrderResponse toResponse(Order order) {
        if (order == null) {
            return null;
        }

        OrderResponse response = new OrderResponse();
        response.setId(order.getId());
        response.setUserId(order.getUserId());
        response.setSymbol(order.getSymbol());
        response.setType(order.getType());
        response.setSide(order.getSide());
        response.setPrice(order.getPrice());
        response.setQuantity(order.getQuantity());
        response.setStatus(order.getStatus());
        response.setCreatedAt(order.getCreatedAt());
        response.setActive(order.isActive());

        return response;
    }
}
