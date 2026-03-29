package com.trading.modules.portfolio.service;

import java.util.UUID;

import com.trading.modules.portfolio.dto.PortfolioSummaryResponse;

public interface PortfolioService {
    PortfolioSummaryResponse getUserPortfolio(UUID userId);
}
