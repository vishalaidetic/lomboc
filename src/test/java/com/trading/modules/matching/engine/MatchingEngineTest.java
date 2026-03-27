package com.trading.modules.matching.engine;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import java.math.BigDecimal;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import com.trading.infrastructure.kafka.producer.EventPublisher;
import com.trading.modules.matching.engine.impl.MatchingEngineImpl;
import com.trading.modules.matching.orderbook.OrderBook;
import com.trading.modules.matching.orderbook.OrderBookManager;
import com.trading.modules.order.model.OrderSide;
import com.trading.shared.event.OrderCreatedEvent;
import com.trading.shared.event.TradeExecutedEvent;

public class MatchingEngineTest {

    private MatchingEngine engine;
    private OrderBookManager manager;
    private EventPublisher publisher;

    @BeforeEach
    void setUp() {
        manager = new OrderBookManager();
        publisher = mock(EventPublisher.class);
        engine = new MatchingEngineImpl(manager, publisher);
    }

    @Test
    void testFIFOPriority() {
        String symbol = "BTCUSD";
        BigDecimal price = new BigDecimal("50000.00");

        // 1. BUY 100 @ 50000 (t1)
        OrderCreatedEvent buy1 = createOrder(symbol, OrderSide.BUY, price, 100);
        engine.process(buy1);

        // 2. BUY 100 @ 50000 (t2)
        OrderCreatedEvent buy2 = createOrder(symbol, OrderSide.BUY, price, 100);
        engine.process(buy2);

        // 3. SELL 100 @ 50000
        OrderCreatedEvent sell = createOrder(symbol, OrderSide.SELL, price, 100);
        engine.process(sell);

        // Verify that buy1 was matched (FIFO)
        ArgumentCaptor<TradeExecutedEvent> tradeCaptor = ArgumentCaptor.forClass(TradeExecutedEvent.class);
        verify(publisher, times(1)).publish(eq("trade.executed"), eq(symbol), tradeCaptor.capture());

        TradeExecutedEvent trade = tradeCaptor.getValue();
        assertEquals(buy1.getOrderId(), trade.getBuyOrderId(), "Should match first buy order (FIFO)");
        assertEquals(sell.getOrderId(), trade.getSellOrderId());
        assertEquals(100, trade.getQuantity());

        // Verify buy2 remains in order book
        OrderBook book = manager.getBook(symbol);
        assertEquals(1, book.getBuyBook().get(price).getOrders().size());
        assertEquals(buy2.getOrderId(), book.getBuyBook().get(price).peek().getOrderId());
    }

    @Test
    void testMultiSymbolSupport() {
        // BTC Orders
        OrderCreatedEvent btcBuy = createOrder("BTCUSD", OrderSide.BUY, new BigDecimal("50000"), 1);
        engine.process(btcBuy);

        // ETH Orders
        OrderCreatedEvent ethBuy = createOrder("ETHUSD", OrderSide.BUY, new BigDecimal("3000"), 10);
        engine.process(ethBuy);

        // Verify separate books
        OrderBook btcBook = manager.getBook("BTCUSD");
        OrderBook ethBook = manager.getBook("ETHUSD");

        assertEquals(1, btcBook.getBuyBook().size());
        assertEquals(1, ethBook.getBuyBook().size());

        assertEquals(btcBuy.getOrderId(), btcBook.getBuyBook().firstEntry().getValue().peek().getOrderId());
        assertEquals(ethBuy.getOrderId(), ethBook.getBuyBook().firstEntry().getValue().peek().getOrderId());
    }

    private OrderCreatedEvent createOrder(String symbol, OrderSide side, BigDecimal price, int qty) {
        OrderCreatedEvent event = new OrderCreatedEvent();
        event.setOrderId(UUID.randomUUID().toString());
        event.setUserId(UUID.randomUUID());
        event.setSymbol(symbol);
        event.setSide(side);
        event.setPrice(price);
        event.setQuantity(qty);
        return event;
    }
}
