package com.trading.modules.portfolio.controller;

import com.trading.modules.portfolio.dto.PortfolioResponse;
import com.trading.modules.portfolio.service.PortfolioService;
import com.trading.modules.portfolio.service.PortfolioCacheService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/portfolio")
@RequiredArgsConstructor
public class PortfolioController {

    private final PortfolioService service;
    private final PortfolioCacheService cacheService;

    @GetMapping("/{userId}")
    public ResponseEntity<List<PortfolioResponse>> get(@PathVariable UUID userId) {
        return ResponseEntity.ok(service.getUserPortfolio(userId));
    }

    @GetMapping("/cache/{userId}")
    public ResponseEntity<Object> getFromCache(@PathVariable UUID userId) {
        return ResponseEntity.ok(cacheService.getPortfolio(userId));
    }
}
