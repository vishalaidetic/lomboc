package com.trading.config;

import java.util.HashMap;
import java.util.Map;

import org.apache.kafka.clients.admin.NewTopic;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.apache.kafka.common.serialization.StringSerializer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.config.TopicBuilder;
import org.springframework.kafka.core.ConsumerFactory;
import org.springframework.kafka.core.DefaultKafkaConsumerFactory;
import org.springframework.kafka.core.DefaultKafkaProducerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.core.ProducerFactory;
import org.springframework.kafka.support.serializer.ErrorHandlingDeserializer;
import org.springframework.kafka.support.serializer.JsonDeserializer;
import org.springframework.kafka.support.serializer.JsonSerializer;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

@Configuration
public class KafkaConfig {

    @Value("${spring.kafka.bootstrap-servers}")
    private String bootstrapServers;

    // ─── Topics ───────────────────────────────────────────────────────────────

    @Bean
    public NewTopic orderTopic() {
        return TopicBuilder.name("order.created").partitions(10).replicas(1).build();
    }

    @Bean
    public NewTopic tradeTopic() {
        return TopicBuilder.name("trade.executed").partitions(10).replicas(1).build();
    }

    /**
     * Creates a Kafka-specific ObjectMapper copy with JavaTimeModule explicitly
     * registered.
     * This is separate from the Spring MVC ObjectMapper to avoid side effects.
     */
    private ObjectMapper kafkaObjectMapper(ObjectMapper base) {
        return base.copy()
                .registerModule(new JavaTimeModule())
                .disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    }

    // ─── Producer ─────────────────────────────────────────────────────────────

    @Bean
    public ProducerFactory<String, Object> producerFactory(ObjectMapper objectMapper) {
        Map<String, Object> config = new HashMap<>();
        config.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);

        // Use a copy of Spring's ObjectMapper with JavaTimeModule — fixes LocalDateTime
        JsonSerializer<Object> serializer = new JsonSerializer<>(kafkaObjectMapper(objectMapper));
        serializer.setAddTypeInfo(true); // Keep type headers so consumers know the exact type

        return new DefaultKafkaProducerFactory<>(config, new StringSerializer(), serializer);
    }

    @Bean
    public KafkaTemplate<String, Object> kafkaTemplate(ProducerFactory<String, Object> producerFactory) {
        return new KafkaTemplate<>(producerFactory);
    }

    // ─── Consumer ─────────────────────────────────────────────────────────────

    @Bean
    public ConsumerFactory<String, Object> consumerFactory(ObjectMapper objectMapper) {
        Map<String, Object> config = new HashMap<>();
        config.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        config.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "earliest");

        // JsonDeserializer uses same ObjectMapper so LocalDateTime is handled correctly
        JsonDeserializer<Object> jsonDeserializer = new JsonDeserializer<>(kafkaObjectMapper(objectMapper));
        jsonDeserializer.addTrustedPackages("com.trading.*");
        jsonDeserializer.setUseTypeHeaders(true); // Use type headers set by producer

        // Wrap with ErrorHandlingDeserializer to gracefully skip unreadable messages
        ErrorHandlingDeserializer<Object> safeDeserializer = new ErrorHandlingDeserializer<>(jsonDeserializer);

        return new DefaultKafkaConsumerFactory<>(config, new StringDeserializer(), safeDeserializer);
    }

    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, Object> kafkaListenerContainerFactory(
            ConsumerFactory<String, Object> consumerFactory) {
        ConcurrentKafkaListenerContainerFactory<String, Object> factory = new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(consumerFactory);
        return factory;
    }
}
