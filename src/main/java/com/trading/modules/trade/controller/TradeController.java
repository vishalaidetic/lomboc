package com.trading.modules.trade.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.trading.modules.trade.dto.TradeResponse;
import com.trading.modules.trade.service.TradeService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/trades")
@RequiredArgsConstructor
public class TradeController {

    private final TradeService service;
    private final com.trading.shared.service.CurrentUserService currentUserService;

    @GetMapping("/recent")
    public ResponseEntity<List<TradeResponse>> getRecent() {
        return ResponseEntity.ok(service.getRecentTrades());
    }

    @GetMapping("/me")
    public ResponseEntity<List<TradeResponse>> getByUser() {
        java.util.UUID userId = currentUserService.getCurrentUserId();
        return ResponseEntity.ok(service.getUserTrades(userId));
    }
}
