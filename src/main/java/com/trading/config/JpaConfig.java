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

    private final com.trading.modules.user.service.UserService userService;

    public JpaConfig(com.trading.modules.user.service.UserService userService) {
        this.userService = userService;
    }

    @Bean
    @NonNull
    public AuditorAware<UUID> auditorProvider() {
        return () -> {
            org.springframework.security.core.Authentication auth = org.springframework.security.core.context.SecurityContextHolder
                    .getContext().getAuthentication();
            if (auth == null || !auth.isAuthenticated())
                return Optional.empty();

            Object principal = auth.getPrincipal();
            if (principal instanceof org.springframework.security.oauth2.jwt.Jwt jwt) {
                return userService.getUserByClerkId(jwt.getSubject())
                        .map(com.trading.modules.user.model.User::getId);
            }
            return Optional.empty();
        };
    }
}
