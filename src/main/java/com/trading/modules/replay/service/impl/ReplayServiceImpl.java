package com.trading.modules.replay.service.impl;

import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.trading.modules.replay.dao.ReplayRepository;
import com.trading.modules.replay.model.ReplaySession;
import com.trading.modules.replay.service.ReplayService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReplayServiceImpl implements ReplayService {

    private final ReplayRepository repo;

    @Override
    @Transactional
    public ReplaySession start(String userId, String symbol, long startTime, double speed) {
        log.info("Starting Replay Session: User {} | Symbol {} | StartTime {} | Speed {}x", userId, symbol, startTime,
                speed);

        ReplaySession session = new ReplaySession();
        session.setUserId(userId);
        session.setSymbol(symbol);
        session.setStartTime(startTime);
        session.setCurrentTickTime(startTime); // Renamed from currentTime
        session.setSpeed(speed);
        session.setRunning(true);

        return repo.save(session);
    }

    @Override
    @Transactional
    public void pause(UUID sessionId) {
        repo.findById(sessionId).ifPresent(s -> {
            s.setRunning(false);
            repo.save(s);
            log.info("Paused Replay Session: {}", sessionId);
        });
    }

    @Override
    @Transactional
    public void resume(UUID sessionId) {
        repo.findById(sessionId).ifPresent(s -> {
            s.setRunning(true);
            repo.save(s);
            log.info("Resumed Replay Session: {}", sessionId);
        });
    }

    @Override
    @Transactional
    public void stop(UUID sessionId) {
        repo.deleteById(sessionId);
        log.info("Stopped Replay Session: {}", sessionId);
    }

    @Override
    @Transactional
    public void seek(UUID sessionId, long timestamp) {
        repo.findById(sessionId).ifPresent(s -> {
            s.setCurrentTickTime(timestamp); // Renamed from currentTime
            repo.save(s);
            log.info("Seeked Replay Session: {} to {}", sessionId, timestamp);
        });
    }

    @Override
    @Transactional
    public void setSpeed(UUID sessionId, double speed) {
        repo.findById(sessionId).ifPresent(s -> {
            s.setSpeed(speed);
            repo.save(s);
            log.info("Set Speed for Replay Session: {} to {}x", sessionId, speed);
        });
    }
}
