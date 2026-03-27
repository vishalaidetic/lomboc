package com.trading.modules.trade.mapper;

import com.trading.modules.trade.dto.TradeResponse;
import com.trading.modules.trade.model.Trade;
import org.springframework.stereotype.Component;

@Component
public class TradeMapper {

    public TradeResponse toResponse(Trade trade) {
        if (trade == null)
            return null;

        TradeResponse res = new TradeResponse();
        res.setId(trade.getId());
        res.setBuyOrderId(trade.getBuyOrderId());
        res.setBuyUserId(trade.getBuyUserId());
        res.setSellOrderId(trade.getSellOrderId());
        res.setSellUserId(trade.getSellUserId());
        res.setSymbol(trade.getSymbol());
        res.setPrice(trade.getPrice());
        res.setQuantity(trade.getQuantity());
        res.setTimestamp(trade.getTimestamp());
        return res;
    }
}
