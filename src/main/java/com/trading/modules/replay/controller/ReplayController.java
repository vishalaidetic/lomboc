package com.trading.modules.replay.controller;

import java.util.UUID;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.trading.modules.replay.model.ReplaySession;
import com.trading.modules.replay.service.ReplayService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/replay")
@RequiredArgsConstructor
public class ReplayController {

    private final ReplayService service;

    @PostMapping("/start")
    public ReplaySession start(
            @RequestParam String userId,
            @RequestParam String symbol,
            @RequestParam(defaultValue = "1640995200000") long startTime,
            @RequestParam(defaultValue = "1.0") double speed) {
        return service.start(userId, symbol, startTime, speed);
    }

    @PostMapping("/pause/{id}")
    public void pause(@PathVariable UUID id) {
        service.pause(id);
    }

    @PostMapping("/resume/{id}")
    public void resume(@PathVariable UUID id) {
        service.resume(id);
    }

    @DeleteMapping("/{id}")
    public void stop(@PathVariable UUID id) {
        service.stop(id);
    }

    @PostMapping("/seek/{id}")
    public void seek(@PathVariable UUID id, @RequestParam long timestamp) {
        service.seek(id, timestamp);
    }

    @PostMapping("/speed/{id}")
    public void setSpeed(@PathVariable UUID id, @RequestParam double speed) {
        service.setSpeed(id, speed);
    }
}
