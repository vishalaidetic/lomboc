package com.trading.modules.portfolio.service.impl;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.trading.modules.market.cache.MarketCacheService;
import com.trading.modules.portfolio.dao.PortfolioRepository;
import com.trading.modules.portfolio.dto.PortfolioItemResponse;
import com.trading.modules.portfolio.dto.PortfolioSummaryResponse;
import com.trading.modules.portfolio.service.PortfolioService;
import com.trading.modules.trade.dao.TradeRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PortfolioServiceImpl implements PortfolioService {

    private final PortfolioRepository repository;
    private final TradeRepository tradeRepository;
    private final MarketCacheService marketCacheService;

    @Override
    public PortfolioSummaryResponse getUserPortfolio(UUID userId) {
        List<PortfolioItemResponse> items = repository.findByUserId(userId).stream()
                .map(p -> {
                    BigDecimal currentPrice = marketCacheService.getPrice(p.getSymbol());
                    if (currentPrice == null)
                        currentPrice = p.getAvgPrice();

                    BigDecimal unrealizedPnL = currentPrice.subtract(p.getAvgPrice())
                            .multiply(BigDecimal.valueOf(p.getQuantity()));

                    BigDecimal equityValue = currentPrice.multiply(BigDecimal.valueOf(p.getQuantity()));

                    return PortfolioItemResponse.builder()
                            .id(p.getId())
                            .symbol(p.getSymbol())
                            .quantity(p.getQuantity())
                            .avgPrice(p.getAvgPrice())
                            .currentPrice(currentPrice)
                            .realizedProfit(p.getRealizedProfit())
                            .unrealizedPnL(unrealizedPnL)
                            .equityValue(equityValue)
                            .build();
                })
                .collect(Collectors.toList());

        BigDecimal estimatedWealth = items.stream()
                .map(PortfolioItemResponse::getEquityValue)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalProfit = items.stream()
                .map(i -> i.getRealizedProfit().add(i.getUnrealizedPnL()))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        int tradeCount = (int) tradeRepository.countByBuyUserIdOrSellUserId(userId, userId);

        return PortfolioSummaryResponse.builder()
                .estimatedWealth(estimatedWealth)
                .totalProfit(totalProfit)
                .tradeCount(tradeCount)
                .holdings(items)
                .build();
    }
}
