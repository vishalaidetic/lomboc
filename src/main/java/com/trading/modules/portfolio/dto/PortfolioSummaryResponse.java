package com.trading.modules.portfolio.dto;

import java.math.BigDecimal;
import java.util.List;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PortfolioSummaryResponse {
    private BigDecimal estimatedWealth;
    private BigDecimal totalProfit;
    private int tradeCount;
    private List<PortfolioItemResponse> holdings;
}
