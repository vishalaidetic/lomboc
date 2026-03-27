package com.trading.modules.matching.orderbook;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.TreeMap;

import com.trading.modules.matching.model.OrderNode;

import lombok.Getter;

/**
 * Thread-unsafe, symbol-scoped order book that maintains separate
 * {@link TreeMap}s
 * for the buy (bid) side and sell (ask) side.
 *
 * <ul>
 * <li>Buy book: descending by price — highest bid has priority.</li>
 * <li>Sell book: ascending by price — lowest ask has priority.</li>
 * </ul>
 *
 * Concurrency control is the responsibility of the {@link OrderBookManager}.
 */
@Getter
public class OrderBook {

    /** BUY side: highest price first (reverse natural order). */
    private final TreeMap<BigDecimal, PriceLevel> buyBook = new TreeMap<>(Collections.reverseOrder());

    /** SELL side: lowest price first (natural order). */
    private final TreeMap<BigDecimal, PriceLevel> sellBook = new TreeMap<>();

    /**
     * Inserts a buy order into the buy book at the order's price level.
     *
     * @param order the order node to insert
     */
    public void addBuy(OrderNode order) {
        buyBook.computeIfAbsent(order.getPrice(), price -> new PriceLevel())
                .add(order);
    }

    /**
     * Inserts a sell order into the sell book at the order's price level.
     *
     * @param order the order node to insert
     */
    public void addSell(OrderNode order) {
        sellBook.computeIfAbsent(order.getPrice(), price -> new PriceLevel())
                .add(order);
    }
}
