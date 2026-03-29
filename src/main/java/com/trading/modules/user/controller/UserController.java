package com.trading.modules.user.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.trading.modules.user.model.User;
import com.trading.modules.user.service.UserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    /**
     * Synchronizes the user from Clerk to the local DB after a successful auth
     */
    @PostMapping("/sync")
    public ResponseEntity<User> sync(
            @AuthenticationPrincipal Jwt jwt,
            @RequestBody(required = false) com.trading.modules.user.dto.UserSyncRequest body) {
        String clerkId = jwt.getSubject(); // 'sub'

        // Extract from JWT (if configured in Clerk dashboard) or Fallback to Body (from
        // frontend)
        String email = jwt.getClaimAsString("email");
        if (email == null && body != null)
            email = body.getEmail();

        String username = jwt.getClaimAsString("username");
        if (username == null && body != null)
            username = body.getUsername();

        String profileImageUrl = jwt.getClaimAsString("profile_image_url");
        if (profileImageUrl == null && body != null)
            profileImageUrl = body.getProfileImageUrl();

        // Security check: If email is still null, it will fail due to DB constraints.
        // But we now accept it from the body passed by the frontend.
        User synced = userService.syncUser(clerkId, email, username, profileImageUrl);
        return ResponseEntity.ok(synced);
    }

    @GetMapping("/me")
    public ResponseEntity<User> getMe(@AuthenticationPrincipal Jwt jwt) {
        return userService.getUserByClerkId(jwt.getSubject())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
