package com.trading.modules.matching.engine.impl;

import java.math.BigDecimal;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.trading.infrastructure.kafka.producer.EventPublisher;
import com.trading.modules.matching.engine.MatchingEngine;
import com.trading.modules.matching.model.OrderNode;
import com.trading.modules.matching.orderbook.OrderBook;
import com.trading.modules.matching.orderbook.OrderBookManager;
import com.trading.modules.matching.orderbook.PriceLevel;
import com.trading.modules.order.model.OrderSide;
import com.trading.shared.event.OrderCreatedEvent;
import com.trading.shared.event.TradeExecutedEvent;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class MatchingEngineImpl implements MatchingEngine {

    private final OrderBookManager manager;
    private final EventPublisher publisher;

    @Override
    public void process(OrderCreatedEvent event) {
        synchronized (manager.getLock(event.getSymbol())) {
            log.info("Phase 4 Matching: Processing order {} | Side: {} | Symbol: {}",
                    event.getOrderId(), event.getSide(), event.getSymbol());

            OrderBook book = manager.getBook(event.getSymbol());

            OrderNode order = new OrderNode(
                    event.getOrderId(),
                    event.getUserId(),
                    event.getPrice(),
                    event.getQuantity(),
                    System.currentTimeMillis());

            if (OrderSide.BUY.equals(event.getSide())) {
                matchBuy(order, book, event.getSymbol());
            } else {
                matchSell(order, book, event.getSymbol());
            }
        }
    }

    private void matchBuy(OrderNode buy, OrderBook book, String symbol) {
        while (!book.getSellBook().isEmpty() && buy.getQuantity() > 0) {
            Map.Entry<BigDecimal, PriceLevel> bestSellEntry = book.getSellBook().firstEntry();
            BigDecimal sellPrice = bestSellEntry.getKey();

            if (sellPrice.compareTo(buy.getPrice()) > 0)
                break;

            PriceLevel level = bestSellEntry.getValue();
            while (!level.isEmpty() && buy.getQuantity() > 0) {
                OrderNode sell = level.peek();
                int tradedQty = Math.min(buy.getQuantity(), sell.getQuantity());

                buy.setQuantity(buy.getQuantity() - tradedQty);
                sell.setQuantity(sell.getQuantity() - tradedQty);

                emitTrade(buy, sell, tradedQty, sellPrice, symbol);

                if (sell.getQuantity() == 0) {
                    level.poll();
                }
            }

            if (level.isEmpty()) {
                book.getSellBook().remove(sellPrice);
            }
        }

        if (buy.getQuantity() > 0) {
            book.addBuy(buy);
            log.info("Order added to Buy Book: {}", buy.getOrderId());
        }
    }

    private void matchSell(OrderNode sell, OrderBook book, String symbol) {
        while (!book.getBuyBook().isEmpty() && sell.getQuantity() > 0) {
            Map.Entry<BigDecimal, PriceLevel> bestBuyEntry = book.getBuyBook().firstEntry();
            BigDecimal buyPrice = bestBuyEntry.getKey();

            if (buyPrice.compareTo(sell.getPrice()) < 0)
                break;

            PriceLevel level = bestBuyEntry.getValue();
            while (!level.isEmpty() && sell.getQuantity() > 0) {
                OrderNode buy = level.peek();
                int tradedQty = Math.min(sell.getQuantity(), buy.getQuantity());

                sell.setQuantity(sell.getQuantity() - tradedQty);
                buy.setQuantity(buy.getQuantity() - tradedQty);

                emitTrade(buy, sell, tradedQty, buyPrice, symbol);

                if (buy.getQuantity() == 0) {
                    level.poll();
                }
            }

            if (level.isEmpty()) {
                book.getBuyBook().remove(buyPrice);
            }
        }

        if (sell.getQuantity() > 0) {
            book.addSell(sell);
            log.info("Order added to Sell Book: {}", sell.getOrderId());
        }
    }

    private void emitTrade(OrderNode buy, OrderNode sell, int qty, BigDecimal price, String symbol) {
        TradeExecutedEvent event = new TradeExecutedEvent(
                buy.getOrderId(),
                buy.getUserId(),
                sell.getOrderId(),
                sell.getUserId(),
                symbol,
                price,
                qty);
        publisher.publish("trade.executed", symbol, event);
        log.info("Trade Emitted: {} units for {} @ {}", qty, symbol, price);
    }
}
