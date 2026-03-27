package com.trading.modules.order.mapper;

import org.springframework.stereotype.Component;

import com.trading.modules.order.dto.OrderResponse;
import com.trading.modules.order.model.Order;

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

    public com.trading.modules.order.model.Order toEntity(com.trading.modules.order.dto.CreateOrderRequest request) {
        if (request == null) {
            return null;
        }
        com.trading.modules.order.model.Order order = new com.trading.modules.order.model.Order();
        order.setUserId(request.getUserId());
        order.setSymbol(request.getSymbol());
        order.setType(request.getType());
        order.setSide(request.getSide());
        order.setPrice(request.getPrice());
        order.setQuantity(request.getQuantity());
        return order;
    }

    public com.trading.shared.event.OrderCreatedEvent toEvent(com.trading.modules.order.model.Order order) {
        if (order == null) {
            return null;
        }
        com.trading.shared.event.OrderCreatedEvent event = new com.trading.shared.event.OrderCreatedEvent();
        event.setOrderId(order.getId().toString());
        event.setUserId(order.getUserId());
        event.setSymbol(order.getSymbol());
        event.setType(order.getType());
        event.setSide(order.getSide());
        event.setPrice(order.getPrice());
        event.setQuantity(order.getQuantity());
        return event;
    }
}
