package com.trading.modules.order.service;

import org.springframework.stereotype.Service;

import com.trading.shared.event.OrderCreatedEvent;

@Service
public class OrderRoutingService {

    /**
     * Resolves the partition key for Kafka.
     * Partitioning by symbol guarantees order sequence correctness
     * and ensures no cross-thread conflicts for the same symbol.
     */
    public String resolvePartitionKey(OrderCreatedEvent event) {
        return event.getSymbol();
    }
}
