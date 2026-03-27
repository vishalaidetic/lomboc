package com.trading.modules.trade.service.impl;

import com.trading.modules.trade.dao.TradeRepository;
import com.trading.modules.trade.dto.TradeResponse;
import com.trading.modules.trade.mapper.TradeMapper;
import com.trading.modules.trade.model.Trade;
import com.trading.modules.trade.service.TradeService;
import com.trading.shared.event.TradeExecutedEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TradeServiceImpl implements TradeService {

    private final TradeRepository repo;
    private final TradeMapper mapper;

    @Override
    public void saveTrade(TradeExecutedEvent event) {
        Trade trade = new Trade();
        trade.setBuyOrderId(event.getBuyOrderId());
        trade.setBuyUserId(event.getBuyUserId());
        trade.setSellOrderId(event.getSellOrderId());
        trade.setSellUserId(event.getSellUserId());
        trade.setSymbol(event.getSymbol());
        trade.setPrice(event.getPrice());
        trade.setQuantity(event.getQuantity());
        trade.setTimestamp(System.currentTimeMillis());

        repo.save(trade);
    }

    @Override
    public List<TradeResponse> getRecentTrades() {
        return repo.findAll(PageRequest.of(0, 50, Sort.by(Sort.Direction.DESC, "timestamp"))).stream()
                .map(mapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<TradeResponse> getUserTrades(java.util.UUID userId) {
        return repo.findByBuyUserIdOrSellUserIdOrderByTimestampDesc(userId, userId).stream()
                .limit(50)
                .map(mapper::toResponse)
                .collect(Collectors.toList());
    }
}
