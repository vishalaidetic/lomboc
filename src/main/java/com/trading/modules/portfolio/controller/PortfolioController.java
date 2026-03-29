package com.trading.modules.portfolio.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.trading.modules.portfolio.dto.PortfolioResponse;
import com.trading.modules.portfolio.service.PortfolioCacheService;
import com.trading.modules.portfolio.service.PortfolioService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/portfolio")
@RequiredArgsConstructor
public class PortfolioController {

    private final PortfolioService service;
    private final PortfolioCacheService cacheService;
    private final com.trading.shared.service.CurrentUserService currentUserService;

    @GetMapping("/me")
    public ResponseEntity<List<PortfolioResponse>> get() {
        java.util.UUID userId = currentUserService.getCurrentUserId();
        return ResponseEntity.ok(service.getUserPortfolio(userId));
    }

    @GetMapping("/cache/me")
    public ResponseEntity<Object> getFromCache() {
        java.util.UUID userId = currentUserService.getCurrentUserId();
        return ResponseEntity.ok(cacheService.getPortfolio(userId));
    }
}
