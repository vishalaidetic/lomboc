package com.trading.modules.settlement.service;

import com.trading.shared.event.TradeExecutedEvent;

public interface SettlementService {
    void process(TradeExecutedEvent event);
}
