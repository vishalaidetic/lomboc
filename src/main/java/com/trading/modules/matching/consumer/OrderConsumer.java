package com.trading.modules.matching.consumer;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.annotation.RetryableTopic;
import org.springframework.kafka.retrytopic.TopicSuffixingStrategy;
import org.springframework.retry.annotation.Backoff;
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

    @RetryableTopic(attempts = "3", backoff = @Backoff(delay = 1000, multiplier = 2.0), topicSuffixingStrategy = TopicSuffixingStrategy.SUFFIX_WITH_INDEX_VALUE, dltStrategy = org.springframework.kafka.retrytopic.DltStrategy.FAIL_ON_ERROR)
    @KafkaListener(topics = "order.created", groupId = "matching-group")
    public void consume(OrderCreatedEvent event) {
        log.info("Processing OrderCreatedEvent: {}", event.getOrderId());
        try {
            engine.process(event);
        } catch (Exception e) {
            log.error("Error matching order {}: {}", event.getOrderId(), e.getMessage());
            throw e; // Trigger retry/DLQ
        }
    }
}
