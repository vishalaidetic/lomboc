package com.trading.modules.portfolio.service;

import com.trading.modules.portfolio.dto.PortfolioResponse;
import java.util.List;
import java.util.UUID;

public interface PortfolioService {
    List<PortfolioResponse> getUserPortfolio(UUID userId);
}
