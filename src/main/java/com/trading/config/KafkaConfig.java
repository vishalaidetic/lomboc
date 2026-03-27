package com.trading.config;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;

@Configuration
public class KafkaConfig {

    @Bean
    public NewTopic orderTopic() {
        return TopicBuilder.name("order.created")
                .partitions(10)
                .replicas(1)
                .build();
    }

    @Bean
    public NewTopic tradeTopic() {
        return TopicBuilder.name("trade.executed")
                .partitions(10)
                .replicas(1)
                .build();
    }
}
