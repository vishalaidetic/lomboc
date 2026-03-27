package com.trading.modules.matching.orderbook;

import java.util.LinkedList;
import java.util.Queue;

import com.trading.modules.matching.model.OrderNode;

import lombok.Getter;

/**
 * Represents a single price level in the order book.
 * Maintains a FIFO queue of {@link OrderNode}s at a specific price point,
 * which ensures time-price priority matching (orders placed earlier fill
 * first).
 */
@Getter
public class PriceLevel {

    private final Queue<OrderNode> orders = new LinkedList<>();

    /**
     * Enqueues a new order at this price level.
     *
     * @param order the order node to add
     */
    public void add(OrderNode order) {
        orders.add(order);
    }

    /**
     * Returns the head order without removing it.
     *
     * @return the oldest order at this level, or {@code null} if empty
     */
    public OrderNode peek() {
        return orders.peek();
    }

    /**
     * Removes and discards the head order (after it has been matched or cancelled).
     */
    public void poll() {
        orders.poll();
    }

    /**
     * @return {@code true} if there are no orders at this price level
     */
    public boolean isEmpty() {
        return orders.isEmpty();
    }

    /**
     * Computes the total quantity of all orders sitting at this price level.
     *
     * @return aggregate quantity
     */
    public int getTotalQuantity() {
        return orders.stream().mapToInt(OrderNode::getQuantity).sum();
    }
}
