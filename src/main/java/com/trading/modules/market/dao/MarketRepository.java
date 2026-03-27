package com.trading.modules.market.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.trading.modules.market.model.Market;

@Repository
public interface MarketRepository extends JpaRepository<Market, String> {
    List<Market> findByActiveTrue();
}
