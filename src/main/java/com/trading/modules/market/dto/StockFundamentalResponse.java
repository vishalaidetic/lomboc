package com.trading.modules.market.dto;

import java.math.BigDecimal;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class StockFundamentalResponse {
    private String symbol;
    private BigDecimal marketCap;
    private BigDecimal peRatio;
    private BigDecimal dividendYield;
    private BigDecimal volume24h;
    private BigDecimal high52w;
    private BigDecimal low52w;
    private String companyDescription;
}
