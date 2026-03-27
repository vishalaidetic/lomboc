package com.trading.modules.order.service.impl;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import com.trading.infrastructure.kafka.producer.EventPublisher;
import com.trading.modules.order.dao.OrderRepository;
import com.trading.modules.order.dto.CreateOrderRequest;
import com.trading.modules.order.model.Order;
import com.trading.modules.order.service.OrderService;
import com.trading.shared.event.OrderCreatedEvent;
import com.trading.modules.order.model.OrderStatus;

import lombok.RequiredArgsConstructor;

import com.trading.modules.order.dto.OrderResponse;
import com.trading.modules.order.mapper.OrderMapper;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository repository;
    private final EventPublisher publisher;
    private final OrderMapper mapper;

    @Override
    public List<OrderResponse> getOrdersByUserId(UUID userId) {
        return repository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(mapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public OrderResponse createOrder(CreateOrderRequest req) {

        Order order = new Order();
        order.setUserId(req.getUserId());
        order.setSymbol(req.getSymbol());
        order.setType(req.getType());
        order.setSide(req.getSide());
        order.setPrice(req.getPrice());
        order.setQuantity(req.getQuantity());

        Order savedOrder = repository.save(order);

        OrderCreatedEvent event = new OrderCreatedEvent();
        event.setOrderId(savedOrder.getId().toString());
        event.setUserId(savedOrder.getUserId());
        event.setSymbol(savedOrder.getSymbol());
        event.setType(savedOrder.getType());
        event.setSide(savedOrder.getSide());
        event.setPrice(savedOrder.getPrice());
        event.setQuantity(savedOrder.getQuantity());

        publisher.publish("order.created", event.getSymbol(), event);

        return mapper.toResponse(savedOrder);
    }

    @Override
    @Transactional
    public void updateOrderStatus(UUID orderId, OrderStatus status) {
        repository.findById(orderId).ifPresent(order -> {
            order.setStatus(status);
            repository.save(order);
        });
    }
}
