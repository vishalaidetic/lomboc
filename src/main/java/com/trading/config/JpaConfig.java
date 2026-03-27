package com.trading.config;

import java.util.Optional;
import java.util.UUID;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.domain.AuditorAware;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.lang.NonNull;

@Configuration
@EnableJpaAuditing
public class JpaConfig {

    @Bean
    @NonNull
    public AuditorAware<UUID> auditorProvider() {
        // This should be integrated with Spring Security to return the actual user UUID
        return () -> Optional.of(UUID.fromString("00000000-0000-0000-0000-000000000000"));
    }
}
