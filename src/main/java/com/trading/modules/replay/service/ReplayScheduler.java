package com.trading.modules.replay.service;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.trading.infrastructure.kafka.producer.EventPublisher;
import com.trading.modules.replay.dao.MarketTickRepository;
import com.trading.modules.replay.dao.ReplayRepository;
import com.trading.modules.replay.model.MarketTick;
import com.trading.modules.replay.model.ReplaySession;
import com.trading.shared.event.PriceTickEvent;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReplayScheduler {

    private final ReplayRepository sessionRepo;
    private final MarketTickRepository tickRepo;
    private final EventPublisher publisher;

    private static final long FIXED_DELAY_MS = 100;

    @Scheduled(fixedDelay = FIXED_DELAY_MS)
    @Transactional
    public void runReplay() {
        List<ReplaySession> activeSessions = sessionRepo.findByRunningTrue();
        if (activeSessions.isEmpty())
            return;

        for (ReplaySession session : activeSessions) {
            processSession(session);
        }
    }

    private void processSession(ReplaySession s) {
        long timeStepMs = (long) (FIXED_DELAY_MS * s.getSpeed());
        long windowStart = s.getCurrentTickTime();
        long windowEnd = windowStart + timeStepMs;

        List<MarketTick> ticks = tickRepo.findNextTicks(s.getSymbol(), windowStart, 50);

        for (MarketTick tick : ticks) {
            if (tick.getTimestamp() > windowEnd)
                break;

            PriceTickEvent event = new PriceTickEvent();
            event.setSymbol(tick.getSymbol());
            event.setPrice(BigDecimal.valueOf(tick.getPrice()));
            event.setTimestamp(tick.getTimestamp());
            event.setSessionId(s.getId().toString()); // isolation tag

            publisher.publish("price.tick", s.getSymbol(), event);

            s.setCurrentTickTime(tick.getTimestamp());
        }

        if (ticks.isEmpty()) {
            s.setCurrentTickTime(windowEnd);
        }

        sessionRepo.save(s);
    }
}
