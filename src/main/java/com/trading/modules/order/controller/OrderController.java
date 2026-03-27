package com.trading.modules.order.controller;

import java.time.Duration;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.trading.modules.order.dto.CreateOrderRequest;
import com.trading.modules.order.dto.OrderResponse;
import com.trading.modules.order.service.OrderService;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/orders")
public class OrderController {

    private final OrderService service;

    // Per-user rate limiting buckets
    private final Map<UUID, Bucket> userBuckets = new ConcurrentHashMap<>();

    private Bucket createNewBucket() {
        Bandwidth limit = Bandwidth.classic(10, Refill.greedy(10, Duration.ofMinutes(1)));
        return Bucket.builder().addLimit(limit).build();
    }

    @PostMapping
    public ResponseEntity<OrderResponse> create(@Valid @RequestBody CreateOrderRequest req) {
        // Simple User-based Rate Limiting
        Bucket bucket = userBuckets.computeIfAbsent(req.getUserId(), k -> createNewBucket());

        if (bucket.tryConsume(1)) {
            return ResponseEntity.ok(service.createOrder(req));
        } else {
            return ResponseEntity.status(429).build(); // Too Many Requests
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<OrderResponse>> getByUserId(@PathVariable UUID userId) {
        return ResponseEntity.ok(service.getOrdersByUserId(userId));
    }
}
