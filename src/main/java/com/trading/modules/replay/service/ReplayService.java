package com.trading.modules.replay.service;

import java.util.UUID;

import com.trading.modules.replay.model.ReplaySession;

public interface ReplayService {
    ReplaySession start(String userId, String symbol, long startTime, double speed);

    void pause(UUID sessionId);

    void resume(UUID sessionId);

    void stop(UUID sessionId);

    void seek(UUID sessionId, long timestamp);

    void setSpeed(UUID sessionId, double speed);
}
