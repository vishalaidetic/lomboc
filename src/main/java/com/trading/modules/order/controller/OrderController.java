package com.trading.modules.order.controller;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.trading.modules.order.dto.CreateOrderRequest;
import com.trading.modules.order.dto.OrderResponse;
import com.trading.modules.order.service.OrderService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/orders")
public class OrderController {

    private final OrderService service;
    private final com.trading.shared.service.CurrentUserService currentUserService;

    // Per-user rate limiting buckets
    private final Map<java.util.UUID, io.github.bucket4j.Bucket> userBuckets = new ConcurrentHashMap<>();

    private io.github.bucket4j.Bucket createNewBucket() {
        io.github.bucket4j.Bandwidth limit = io.github.bucket4j.Bandwidth.classic(10,
                io.github.bucket4j.Refill.greedy(10, java.time.Duration.ofMinutes(1)));
        return io.github.bucket4j.Bucket.builder().addLimit(limit).build();
    }

    @PostMapping
    public ResponseEntity<OrderResponse> create(@Valid @RequestBody CreateOrderRequest req) {
        java.util.UUID userId = currentUserService.getCurrentUserId();

        // Enforce the verified userId from session
        req.setUserId(userId);

        io.github.bucket4j.Bucket bucket = userBuckets.computeIfAbsent(userId, k -> createNewBucket());

        if (bucket.tryConsume(1)) {
            return ResponseEntity.ok(service.createOrder(req));
        } else {
            return ResponseEntity.status(429).build();
        }
    }

    @GetMapping("/me")
    public ResponseEntity<List<OrderResponse>> getByUserId() {
        java.util.UUID userId = currentUserService.getCurrentUserId();
        return ResponseEntity.ok(service.getOrdersByUserId(userId));
    }
}
