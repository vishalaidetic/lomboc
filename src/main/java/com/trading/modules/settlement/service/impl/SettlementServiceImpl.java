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
    private final com.trading.infrastructure.kafka.producer.EventPublisher eventPublisher;

    @Override
    @Transactional
    public void process(TradeExecutedEvent event) {
        log.info("Processing Settlement for trade: {} between buyer {} and seller {}",
                event.getTradeId(), event.getBuyUserId(), event.getBuyOrderId());

        updateBuyer(event);
        updateSeller(event);

        // Notify Order Service to update to SETTLED
        eventPublisher.publish("order.settled", event.getBuyOrderId(),
                new com.trading.shared.event.OrderSettledEvent(event.getBuyOrderId(), event.getBuyUserId(),
                        event.getSymbol(), event.getQuantity()));

        eventPublisher.publish("order.settled", event.getSellOrderId(),
                new com.trading.shared.event.OrderSettledEvent(event.getSellOrderId(), event.getSellUserId(),
                        event.getSymbol(), -event.getQuantity()));
    }

    private void updateBuyer(TradeExecutedEvent event) {
        Portfolio p = repo.findByUserIdAndSymbol(event.getBuyUserId(), event.getSymbol())
                .orElse(new Portfolio());

        int oldQty = p.getQuantity();
        int tradeQty = event.getQuantity();
        int newQty = oldQty + tradeQty;

        updateAveragePrice(p, event.getPrice(), tradeQty, newQty);

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
        int tradeQty = -event.getQuantity(); // Selling is negative change
        int newQty = oldQty + tradeQty;

        updateAveragePrice(p, event.getPrice(), tradeQty, newQty);

        p.setUserId(event.getSellUserId());
        p.setSymbol(event.getSymbol());
        p.setQuantity(newQty);
        repo.save(p);
        cacheService.cachePortfolio(p.getUserId(), p);
    }

    /**
     * Correct Weighted-Average Cost Basis calculation.
     * Works for Long, Short, and Flat positions.
     */
    private void updateAveragePrice(Portfolio p, BigDecimal tracePrice, int qtyChange, int newTotalQty) {
        if (newTotalQty == 0) {
            p.setAvgPrice(BigDecimal.ZERO);
            return;
        }

        int oldQty = p.getQuantity();

        // CASE A: Opening or Increasing a Position (Longer long, or Shorter short)
        // Happens if old direction and side of trade are same
        if ((oldQty >= 0 && newTotalQty > oldQty) || (oldQty <= 0 && newTotalQty < oldQty)) {
            BigDecimal oldAbsQty = BigDecimal.valueOf(Math.abs(oldQty));
            BigDecimal tradeAbsQty = BigDecimal.valueOf(Math.abs(qtyChange));
            BigDecimal newAbsQty = BigDecimal.valueOf(Math.abs(newTotalQty));

            BigDecimal currentVal = (p.getAvgPrice() != null) ? p.getAvgPrice().multiply(oldAbsQty) : BigDecimal.ZERO;
            BigDecimal newVal = tracePrice.multiply(tradeAbsQty);

            p.setAvgPrice(currentVal.add(newVal).divide(newAbsQty, 8, RoundingMode.HALF_UP));
        }
        // CASE B: Fully Flipped Position (Long to Short, or Short to Long in one trade)
        else if ((oldQty > 0 && newTotalQty < 0) || (oldQty < 0 && newTotalQty > 0)) {
            p.setAvgPrice(tracePrice); // New basis is now the flip price
        }
        // CASE C: Reducing Position (Selling long, or Covering short)
        // Cost basis stays the same as before
    }
}
