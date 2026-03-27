package com.trading.modules.matching.dto;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Represents a single price level in the order book,
 * holding an aggregated price and the total quantity available at that level.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderBookLevel {

    /** The price at this order book level. */
    private BigDecimal price;

    /** The total quantity of orders sitting at this price level. */
    private int quantity;
}
