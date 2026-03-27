package com.trading.modules.order.consumer;

import com.trading.shared.event.TradeExecutedEvent;
import com.trading.modules.order.service.OrderService;
import com.trading.modules.order.model.OrderStatus;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrderTradeConsumer {

    private final OrderService orderService;

    @KafkaListener(topics = "trade.executed", groupId = "order-group")
    public void consume(TradeExecutedEvent event) {
        log.info("Order Trade Consumer received event for trade: {} | Symbol: {}",
                event.getTradeId(), event.getSymbol());

        try {
            // Update Buy Order
            orderService.updateOrderStatus(UUID.fromString(event.getBuyOrderId()), OrderStatus.FILLED);
            log.info("Updated Buy order: {} to FILLED", event.getBuyOrderId());

            // Update Sell Order
            orderService.updateOrderStatus(UUID.fromString(event.getSellOrderId()), OrderStatus.FILLED);
            log.info("Updated Sell order: {} to FILLED", event.getSellOrderId());
        } catch (Exception e) {
            log.error("Error updating order statuses: {}", e.getMessage(), e);
        }
    }
}
