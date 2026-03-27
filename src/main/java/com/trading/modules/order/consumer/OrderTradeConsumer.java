package com.trading.modules.order.consumer;

import java.util.UUID;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import com.trading.modules.order.model.OrderStatus;
import com.trading.modules.order.service.OrderService;
import com.trading.shared.event.TradeExecutedEvent;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrderTradeConsumer {

    private final OrderService orderService;

    @KafkaListener(topics = "trade.executed", groupId = "order-group")
    public void consumeTrade(TradeExecutedEvent event) {
        log.info("Order Trade Consumer matching triggered for trade: {}", event.getTradeId());
        try {
            orderService.updateOrderStatus(UUID.fromString(event.getBuyOrderId()), OrderStatus.FILLED);
            orderService.updateOrderStatus(UUID.fromString(event.getSellOrderId()), OrderStatus.FILLED);
        } catch (Exception e) {
            log.error("Execution status update failed: {}", e.getMessage());
        }
    }

    @KafkaListener(topics = "order.settled", groupId = "order-group")
    public void consumeSettlement(com.trading.shared.event.OrderSettledEvent event) {
        log.info("Order SETTLED: Order ID {}", event.getOrderId());
        try {
            orderService.updateOrderStatus(UUID.fromString(event.getOrderId()), OrderStatus.SETTLED);
        } catch (Exception e) {
            log.error("Settlement status update failed: {}", e.getMessage());
        }
    }
}
