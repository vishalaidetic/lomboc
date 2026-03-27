package com.trading.modules.trade.controller;

import com.trading.modules.trade.dto.TradeResponse;
import com.trading.modules.trade.service.TradeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/trades")
@RequiredArgsConstructor
public class TradeController {

    private final TradeService service;

    @GetMapping("/recent")
    public ResponseEntity<List<TradeResponse>> getRecent() {
        return ResponseEntity.ok(service.getRecentTrades());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<TradeResponse>> getByUser(@PathVariable java.util.UUID userId) {
        return ResponseEntity.ok(service.getUserTrades(userId));
    }
}
