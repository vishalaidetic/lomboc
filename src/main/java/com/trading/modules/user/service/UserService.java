package com.trading.modules.user.service;

import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.trading.modules.user.dao.UserRepository;
import com.trading.modules.user.model.User;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository repository;

    @Transactional
    public User syncUser(String clerkId, String email, String username, String profileImageUrl) {
        log.info("Syncing user details for {}: [clerkId={}, email={}]", username, clerkId, email);

        return repository.findByClerkId(clerkId)
                .map(existing -> {
                    existing.setEmail(email);
                    existing.setUsername(username);
                    existing.setProfileImageUrl(profileImageUrl);
                    return repository.save(existing);
                })
                .orElseGet(() -> {
                    User newUser = User.builder()
                            .clerkId(clerkId)
                            .email(email)
                            .username(username)
                            .profileImageUrl(profileImageUrl)
                            .build();
                    return repository.save(newUser);
                });
    }

    public Optional<User> getUserById(UUID id) {
        return repository.findById(id);
    }

    public Optional<User> getUserByClerkId(String clerkId) {
        return repository.findByClerkId(clerkId);
    }
}
