package com.trading.infrastructure.kafka.producer;

public interface EventPublisher {

    void publish(String topic, String key, Object event);
}
