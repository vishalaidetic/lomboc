package com.trading.modules.portfolio.model;

import java.math.BigDecimal;
import java.util.UUID;

import com.trading.shared.model.BaseEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

@Entity
@Table(name = "trading_portfolios", indexes = {
        @Index(name = "idx_portfolio_user_symbol", columnList = "user_id, symbol", unique = true)
})
@Data
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
public class Portfolio extends BaseEntity {

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "symbol", nullable = false, length = 20)
    private String symbol;

    @Column(name = "quantity", nullable = false)
    private int quantity;

    @Column(name = "avg_price", precision = 19, scale = 8, nullable = false)
    private BigDecimal avgPrice;
}
