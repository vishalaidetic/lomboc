package com.trading.modules.matching.orderbook;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Service;

@Service
public class OrderBookManager {

    private final Map<String, OrderBook> books = new ConcurrentHashMap<>();
    private final Map<String, Object> locks = new ConcurrentHashMap<>();

    public OrderBook getBook(String symbol) {
        return books.computeIfAbsent(symbol, s -> new OrderBook());
    }

    public Object getLock(String symbol) {
        return locks.computeIfAbsent(symbol, s -> new Object());
    }

    public Map<String, OrderBook> getAllBooks() {
        return books;
    }
}
