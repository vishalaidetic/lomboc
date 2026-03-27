package com.trading.modules.portfolio.dto;

import java.math.BigDecimal;
import java.util.UUID;

import lombok.Data;

@Data
public class PortfolioResponse {
    private UUID id;
    private UUID userId;
    private String symbol;
    private int quantity;
    private BigDecimal avgPrice;
}
