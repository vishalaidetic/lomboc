package com.trading.modules.order.service.impl;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.trading.infrastructure.kafka.producer.EventPublisher;
import com.trading.modules.market.service.MarketConfigService;
import com.trading.modules.order.dao.OrderRepository;
import com.trading.modules.order.dto.CreateOrderRequest;
import com.trading.modules.order.dto.OrderResponse;
import com.trading.modules.order.mapper.OrderMapper;
import com.trading.modules.order.model.Order;
import com.trading.modules.order.model.OrderStatus;
import com.trading.modules.order.service.OrderService;
import com.trading.shared.event.OrderCreatedEvent;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final OrderMapper orderMapper;
    private final EventPublisher eventPublisher;
    private final MarketConfigService marketConfigService;

    @Override
    public List<OrderResponse> getOrdersByUserId(UUID userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(orderMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public OrderResponse createOrder(CreateOrderRequest request) {
        // Phase 5: Distributed Validation
        marketConfigService.validateMarket(request.getSymbol());

        Order order = orderMapper.toEntity(request);
        order.setStatus(OrderStatus.PENDING);
        Order savedOrder = orderRepository.save(order);

        OrderCreatedEvent event = orderMapper.toEvent(savedOrder);

        // Phase 5: Partitioned Scaling - Symbol as the Kafka Key
        // This ensures orders for the same symbol are always processed in sequence by
        // the same engine instance
        eventPublisher.publish("order.created", event.getSymbol(), event);

        return orderMapper.toResponse(savedOrder);
    }

    @Override
    @Transactional
    public void updateOrderStatus(UUID orderId, OrderStatus status) {
        orderRepository.findById(orderId).ifPresent(order -> {
            order.setStatus(status);
            orderRepository.save(order);
        });
    }
}
