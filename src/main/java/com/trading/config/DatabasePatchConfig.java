package com.trading.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Configuration
public class DatabasePatchConfig {

    @Bean
    public CommandLineRunner dropCheckConstraint(JdbcTemplate jdbcTemplate) {
        return args -> {
            try {
                log.info("Executing Database Patch: Dropping legacy order status check constraint...");

                // This SQL drops the strict ENUM check that blocks the new 'SETTLED' status.
                // We use 'IF EXISTS' to ensure it doesn't crash on clean databases.
                jdbcTemplate
                        .execute("ALTER TABLE trading_orders DROP CONSTRAINT IF EXISTS trading_orders_status_check");

                log.info("Database Patch Successful: constraint dropped.");
            } catch (Exception e) {
                log.warn("Database Patch Note: Could not drop constraint (it may have been dropped already): {}",
                        e.getMessage());
            }
        };
    }
}
