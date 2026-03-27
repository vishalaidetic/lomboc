package com.trading.modules.trade.dao;

import com.trading.modules.trade.model.Trade;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;

@Repository
public interface TradeRepository extends JpaRepository<Trade, UUID> {
    java.util.List<Trade> findByBuyUserIdOrSellUserIdOrderByTimestampDesc(java.util.UUID buyUserId,
            java.util.UUID sellUserId);
}
