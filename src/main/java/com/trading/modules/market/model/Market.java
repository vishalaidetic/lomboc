package com.trading.modules.market.model;

import java.math.BigDecimal;
import java.time.LocalTime;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "markets")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Market {

    @Id
    private String symbol;

    @Enumerated(EnumType.STRING)
    private MarketType type;

    private boolean active;

    private String baseCurrency;
    private String quoteCurrency;

    private LocalTime openTime;
    private LocalTime closeTime;

    @Builder.Default
    private int pricePrecision = 2;

    @Builder.Default
    private int quantityPrecision = 8;

    private BigDecimal lastPrice; // Permanent price persistence
}
