package com.trading.modules.matching.engine;

import com.trading.shared.event.OrderCreatedEvent;

public interface MatchingEngine {
    void process(OrderCreatedEvent event);
}
