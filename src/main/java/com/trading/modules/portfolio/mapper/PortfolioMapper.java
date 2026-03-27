package com.trading.modules.portfolio.mapper;

import com.trading.modules.portfolio.dto.PortfolioResponse;
import com.trading.modules.portfolio.model.Portfolio;
import org.springframework.stereotype.Component;

@Component
public class PortfolioMapper {

    public PortfolioResponse toResponse(Portfolio p) {
        if (p == null)
            return null;

        PortfolioResponse res = new PortfolioResponse();
        res.setId(p.getId());
        res.setUserId(p.getUserId());
        res.setSymbol(p.getSymbol());
        res.setQuantity(p.getQuantity());
        res.setAvgPrice(p.getAvgPrice());
        return res;
    }
}
