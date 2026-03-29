package com.trading.shared.service;

import java.util.UUID;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import com.trading.modules.user.model.User;
import com.trading.modules.user.service.UserService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CurrentUserService {

    private final UserService userService;

    public UUID getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            throw new RuntimeException("User not authenticated");
        }

        Object principal = auth.getPrincipal();
        if (principal instanceof Jwt jwt) {
            return userService.getUserByClerkId(jwt.getSubject())
                    .map(User::getId)
                    .orElseThrow(() -> new RuntimeException("User not found in local database"));
        }

        throw new RuntimeException("Unexpected principal type: " + principal.getClass().getName());
    }
}
