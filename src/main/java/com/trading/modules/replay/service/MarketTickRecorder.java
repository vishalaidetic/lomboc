package com.trading.modules.replay.service;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import com.trading.modules.replay.dao.MarketTickRepository;
import com.trading.modules.replay.model.MarketTick;
import com.trading.shared.event.PriceTickEvent;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class MarketTickRecorder {

    private final MarketTickRepository repository;

    /**
     * Listen to LIVE market ticks and record them for REPLAY later.
     */
    @KafkaListener(topics = "price.tick", groupId = "recorder-group")
    public void record(PriceTickEvent event) {
        MarketTick tick = new MarketTick();
        tick.setSymbol(event.getSymbol());
        tick.setPrice(event.getPrice().doubleValue());
        tick.setTimestamp(System.currentTimeMillis());

        repository.save(tick);
        log.debug("Recorded tick for {}: {}", event.getSymbol(), event.getPrice());
    }
}
