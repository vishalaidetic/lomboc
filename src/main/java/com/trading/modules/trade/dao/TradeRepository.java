package com.trading.modules.trade.dao;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.trading.modules.trade.model.Trade;

@Repository
public interface TradeRepository extends JpaRepository<Trade, UUID> {
    java.util.List<Trade> findByBuyUserIdOrSellUserIdOrderByTimestampDesc(java.util.UUID buyUserId,
            java.util.UUID sellUserId);

    long countByBuyUserIdOrSellUserId(java.util.UUID buyUserId, java.util.UUID sellUserId);
}
