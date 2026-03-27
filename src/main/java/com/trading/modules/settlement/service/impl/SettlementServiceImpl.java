package com.trading.modules.settlement.service.impl;

import java.math.BigDecimal;
import java.math.RoundingMode;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.trading.modules.portfolio.dao.PortfolioRepository;
import com.trading.modules.portfolio.model.Portfolio;
import com.trading.modules.portfolio.service.PortfolioCacheService;
import com.trading.modules.settlement.service.SettlementService;
import com.trading.shared.event.TradeExecutedEvent;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class SettlementServiceImpl implements SettlementService {

    private final PortfolioRepository repo;
    private final PortfolioCacheService cacheService;

    @Override
    @Transactional
    public void process(TradeExecutedEvent event) {
        log.info("Processing Settlement for trade: {} between buyer {} and seller {}",
                event.getTradeId(), event.getBuyUserId(), event.getSellUserId());

        updateBuyer(event);
        updateSeller(event);
    }

    private void updateBuyer(TradeExecutedEvent event) {
        Portfolio p = repo.findByUserIdAndSymbol(event.getBuyUserId(), event.getSymbol())
                .orElse(new Portfolio());

        int oldQty = p.getQuantity();
        int tradeQty = event.getQuantity();
        int newQty = oldQty + tradeQty;

        // Update average price for new positions, increasing long positions, or flips
        // to long
        if (p.getAvgPrice() == null || (oldQty >= 0 && newQty > 0)) {
            BigDecimal currentWeight = p.getAvgPrice() != null
                    ? p.getAvgPrice().multiply(BigDecimal.valueOf(oldQty))
                    : BigDecimal.ZERO;
            BigDecimal tradeWeight = event.getPrice().multiply(BigDecimal.valueOf(tradeQty));
            BigDecimal totalWeight = currentWeight.add(tradeWeight);
            p.setAvgPrice(totalWeight.divide(BigDecimal.valueOf(newQty), 8, RoundingMode.HALF_UP));
        } else if (oldQty < 0 && newQty > 0) {
            // Flip from short to long: set to current trade price
            p.setAvgPrice(event.getPrice());
        }
        // If decreasing a position (covering short or selling long), avgPrice stays the
        // same

        p.setUserId(event.getBuyUserId());
        p.setSymbol(event.getSymbol());
        p.setQuantity(newQty);

        repo.save(p);
        cacheService.cachePortfolio(p.getUserId(), p);
    }

    private void updateSeller(TradeExecutedEvent event) {
        Portfolio p = repo.findByUserIdAndSymbol(event.getSellUserId(), event.getSymbol())
                .orElse(new Portfolio());

        int oldQty = p.getQuantity();
        int tradeQty = event.getQuantity();
        int newQty = oldQty - tradeQty;

        // Update average price for new positions, increasing short positions (short
        // selling), or flips to short
        if (p.getAvgPrice() == null || (oldQty <= 0 && newQty < 0)) {
            BigDecimal currentWeight = p.getAvgPrice() != null
                    ? p.getAvgPrice().multiply(BigDecimal.valueOf(Math.abs(oldQty)))
                    : BigDecimal.ZERO;
            BigDecimal tradeWeight = event.getPrice().multiply(BigDecimal.valueOf(tradeQty));
            BigDecimal totalWeight = currentWeight.add(tradeWeight);
            p.setAvgPrice(totalWeight.divide(BigDecimal.valueOf(Math.abs(newQty)), 8, RoundingMode.HALF_UP));
        } else if (oldQty > 0 && newQty < 0) {
            // Flip from long to short: set to current trade price
            p.setAvgPrice(event.getPrice());
        }

        p.setUserId(event.getSellUserId());
        p.setSymbol(event.getSymbol());
        p.setQuantity(newQty);

        repo.save(p);
        cacheService.cachePortfolio(p.getUserId(), p);
    }
}
