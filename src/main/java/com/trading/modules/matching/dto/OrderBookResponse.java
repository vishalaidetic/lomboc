package com.trading.modules.matching.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO representing the full state of an order book for a given symbol,
 * containing sorted bid (buy) and ask (sell) price levels.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderBookResponse {

    /** Descending list of bid (buy) price levels. */
    private List<OrderBookLevel> bids;

    /** Ascending list of ask (sell) price levels. */
    private List<OrderBookLevel> asks;
}
