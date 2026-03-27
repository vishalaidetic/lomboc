package com.trading.modules.settlement.service.impl;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.trading.infrastructure.kafka.producer.EventPublisher;
import com.trading.modules.portfolio.dao.PortfolioRepository;
import com.trading.modules.portfolio.model.Portfolio;
import com.trading.modules.portfolio.service.PortfolioCacheService;
import com.trading.modules.settlement.service.SettlementService;
import com.trading.shared.event.OrderSettledEvent;
import com.trading.shared.event.TradeExecutedEvent;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class SettlementServiceImpl implements SettlementService {

    private final PortfolioRepository repo;
    private final PortfolioCacheService cacheService;
    private final EventPublisher eventPublisher;

    @Override
    @Transactional
    public void process(TradeExecutedEvent event) {
        log.info("Processing Settlement: Trade {} | Buyer {} | Seller {}",
                event.getTradeId(), event.getBuyUserId(), event.getSellUserId());

        // Process both sides using unified logic
        settleSide(event.getBuyUserId(), event.getBuyOrderId(), event.getSymbol(), event.getQuantity(),
                event.getPrice());
        settleSide(event.getSellUserId(), event.getSellOrderId(), event.getSymbol(), -event.getQuantity(),
                event.getPrice());
    }

    private void settleSide(UUID userId, String orderId, String symbol, int qtyChange, BigDecimal price) {
        Portfolio p = repo.findByUserIdAndSymbol(userId, symbol).orElse(new Portfolio());

        int oldQty = p.getQuantity();
        int newQty = oldQty + qtyChange;

        updateAveragePrice(p, price, qtyChange, newQty);

        p.setUserId(userId);
        p.setSymbol(symbol);
        p.setQuantity(newQty);

        repo.saveAndFlush(p); // COMMITTED IMMEDIATELY
        cacheService.cachePortfolio(userId, p);

        // Notify Order Service
        eventPublisher.publish("order.settled", orderId,
                new OrderSettledEvent(orderId, userId, symbol, qtyChange));

        log.debug("Settled order side: {} for user: {} | New Qty: {}", orderId, userId, newQty);
    }

    private void updateAveragePrice(Portfolio p, BigDecimal tracePrice, int qtyChange, int newTotalQty) {
        if (newTotalQty == 0) {
            p.setAvgPrice(BigDecimal.ZERO);
            return;
        }

        int oldQty = p.getQuantity();

        // CASE A: Opening or Increasing a Position
        if ((oldQty >= 0 && newTotalQty > oldQty) || (oldQty <= 0 && newTotalQty < oldQty)) {
            BigDecimal oldAbsQty = BigDecimal.valueOf(Math.abs(oldQty));
            BigDecimal tradeAbsQty = BigDecimal.valueOf(Math.abs(qtyChange));
            BigDecimal newAbsQty = BigDecimal.valueOf(Math.abs(newTotalQty));

            BigDecimal currentVal = (p.getAvgPrice() != null) ? p.getAvgPrice().multiply(oldAbsQty) : BigDecimal.ZERO;
            BigDecimal newVal = tracePrice.multiply(tradeAbsQty);

            p.setAvgPrice(currentVal.add(newVal).divide(newAbsQty, 8, RoundingMode.HALF_UP));
        }
        // CASE B: Fully Flipped Position
        else if ((oldQty > 0 && newTotalQty < 0) || (oldQty < 0 && newTotalQty > 0)) {
            p.setAvgPrice(tracePrice);
        }
        // CASE C: Reducing Position (Basis doesn't change)
    }
}
