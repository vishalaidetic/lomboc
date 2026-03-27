package com.trading.modules.matching.persistence;

import java.util.Map;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.trading.modules.matching.orderbook.OrderBook;
import com.trading.modules.matching.orderbook.OrderBookManager;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Service responsible for periodically snapshotting the state of all order
 * books
 * to Redis. This prevents full state loss in case of a service crash.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class SnapshotService {

    private final OrderBookManager manager;
    private final RedisTemplate<String, Object> redisTemplate;
    private static final String SNAPSHOT_KEY_PREFIX = "orderbook:snapshot:";

    /**
     * Snapshots the internal state of all books every 5 minutes.
     * In a production system, this would use a high-performance serialization
     * library
     * like Protobuf or Kryo to minimize latency.
     */
    @Scheduled(fixedRate = 300000) // 5 minutes
    public void captureSnapshots() {
        log.info("Starting order book snapshot process...");
        Map<String, OrderBook> books = manager.getAllBooks();

        books.forEach((symbol, book) -> {
            synchronized (manager.getLock(symbol)) {
                try {
                    String snapshotKey = SNAPSHOT_KEY_PREFIX + symbol;
                    // Persist the full book object. Requires Jackson serialization support for
                    // TreeMap.
                    redisTemplate.opsForValue().set(snapshotKey, book);
                    log.debug("Snapshot captured for symbol: {}", symbol);
                } catch (Exception e) {
                    log.error("Failed to capture snapshot for symbol: {}", symbol, e);
                }
            }
        });
        log.info("Order book snapshot process completed.");
    }
}
