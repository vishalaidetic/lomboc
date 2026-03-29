package com.trading.modules.portfolio.dto;

import java.math.BigDecimal;
import java.util.UUID;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PortfolioItemResponse {
    private UUID id;
    private String symbol;
    private int quantity;
    private BigDecimal avgPrice;
    private BigDecimal currentPrice;
    private BigDecimal realizedProfit;
    private BigDecimal unrealizedPnL;
    private BigDecimal equityValue;
}
