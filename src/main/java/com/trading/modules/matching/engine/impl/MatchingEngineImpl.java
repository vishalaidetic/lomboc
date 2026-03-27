package com.trading.modules.matching.engine.impl;

import java.math.BigDecimal;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.data.redis.core.RedisTemplate;
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
    private final RedisTemplate<String, Object> redisTemplate;

    private final Set<String> processedOrders = ConcurrentHashMap.newKeySet();
    private static final String REDIS_TRADE_TOPIC = "trading:trades:broadcast";

    @Override
    public void process(OrderCreatedEvent event) {
        if (processedOrders.contains(event.getOrderId())) {
            return;
        }

        synchronized (manager.getLock(event.getSymbol())) {
            OrderBook book = manager.getBook(event.getSymbol());

            OrderNode order = new OrderNode(
                    event.getOrderId(),
                    event.getUserId(),
                    event.getPrice(),
                    event.getQuantity(),
                    System.currentTimeMillis(),
                    event.getSessionId());

            if (OrderSide.BUY.equals(event.getSide())) {
                matchBuy(order, book, event.getSymbol());
            } else {
                matchSell(order, book, event.getSymbol());
            }

            processedOrders.add(event.getOrderId());
            if (processedOrders.size() > 100000) {
                processedOrders.clear();
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

                if (sell.getQuantity() == 0)
                    level.poll();
            }
            if (level.isEmpty())
                book.getSellBook().remove(sellPrice);
        }
        if (buy.getQuantity() > 0)
            book.addBuy(buy);
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

                if (buy.getQuantity() == 0)
                    level.poll();
            }
            if (level.isEmpty())
                book.getBuyBook().remove(buyPrice);
        }
        if (sell.getQuantity() > 0)
            book.addSell(sell);
    }

    private void emitTrade(OrderNode buy, OrderNode sell, int qty, BigDecimal price, String symbol) {
        // Use sessionId from the participants (prefer buy side if different, though
        // they should match)
        String sid = buy.getSessionId() != null ? buy.getSessionId() : sell.getSessionId();

        TradeExecutedEvent event = new TradeExecutedEvent(
                java.util.UUID.randomUUID(),
                buy.getOrderId(),
                buy.getUserId(),
                sell.getOrderId(),
                sell.getUserId(),
                symbol,
                price,
                qty,
                sid,
                java.time.LocalDateTime.now());

        publisher.publish("trade.executed", symbol, event);
        redisTemplate.convertAndSend(REDIS_TRADE_TOPIC, event);
        log.info("Sim-Isolated Trade: {} units of {} @ {} (Session: {})", qty, symbol, price, sid);
    }
}
