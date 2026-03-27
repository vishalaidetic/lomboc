package com.trading.modules.trade.model;

import com.trading.shared.model.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import java.math.BigDecimal;

@Entity
@Table(name = "trading_trades", indexes = {
        @Index(name = "idx_trade_buy_order", columnList = "buy_order_id"),
        @Index(name = "idx_trade_sell_order", columnList = "sell_order_id"),
        @Index(name = "idx_trade_symbol", columnList = "symbol")
})
@Data
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
public class Trade extends BaseEntity {

    @Column(name = "buy_order_id", nullable = false)
    private String buyOrderId;

    @Column(name = "buy_user_id", nullable = false)
    private java.util.UUID buyUserId;

    @Column(name = "sell_order_id", nullable = false)
    private String sellOrderId;

    @Column(name = "sell_user_id", nullable = false)
    private java.util.UUID sellUserId;

    @Column(name = "symbol", nullable = false, length = 20)
    private String symbol;

    @Column(name = "price", precision = 19, scale = 8, nullable = false)
    private BigDecimal price;

    @Column(name = "quantity", nullable = false)
    private int quantity;

    @Column(name = "execution_timestamp", nullable = false)
    private long timestamp;
}
