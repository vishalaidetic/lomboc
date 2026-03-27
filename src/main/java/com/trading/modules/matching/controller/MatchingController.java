package com.trading.modules.matching.controller;

import com.trading.modules.matching.dto.OrderBookLevel;
import com.trading.modules.matching.dto.OrderBookResponse;
import com.trading.modules.matching.orderbook.OrderBook;
import com.trading.modules.matching.orderbook.OrderBookManager;
import com.trading.modules.matching.orderbook.PriceLevel;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

@RestController
@RequestMapping("/matching")
@RequiredArgsConstructor
public class MatchingController {

    private final OrderBookManager manager;

    @GetMapping("/orderbook/{symbol}")
    public ResponseEntity<OrderBookResponse> getOrderBook(@PathVariable String symbol) {
        OrderBook book = manager.getBook(symbol);

        List<OrderBookLevel> bids = mapToLevels(book.getBuyBook());
        List<OrderBookLevel> asks = mapToLevels(book.getSellBook());

        return ResponseEntity.ok(new OrderBookResponse(bids, asks));
    }

    private List<OrderBookLevel> mapToLevels(TreeMap<BigDecimal, PriceLevel> priceLevels) {
        List<OrderBookLevel> levels = new ArrayList<>();
        for (Map.Entry<BigDecimal, PriceLevel> entry : priceLevels.entrySet()) {
            levels.add(new OrderBookLevel(entry.getKey(), entry.getValue().getTotalQuantity()));
        }
        return levels;
    }
}
