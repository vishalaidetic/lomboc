package com.trading.modules.matching.consumer;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import com.trading.modules.matching.engine.MatchingEngine;
import com.trading.shared.event.OrderCreatedEvent;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrderConsumer {

    private final MatchingEngine engine;

    @KafkaListener(topics = "order.created", groupId = "matching-group")
    public void consume(OrderCreatedEvent event) {
        log.info("Consumed OrderCreatedEvent for order: {}", event.getOrderId());
        engine.process(event);
    }
}
