package com.trading.modules.trade.service;

import com.trading.shared.event.TradeExecutedEvent;
import com.trading.modules.trade.dto.TradeResponse;
import java.util.List;
import java.util.UUID;

public interface TradeService {
    void saveTrade(TradeExecutedEvent event);

    List<TradeResponse> getRecentTrades();

    List<TradeResponse> getUserTrades(UUID userId);
}
