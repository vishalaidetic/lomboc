package com.trading.modules.replay.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.trading.modules.replay.model.MarketTick;

@Repository
public interface MarketTickRepository extends JpaRepository<MarketTick, Long> {

    @Query(value = "SELECT * FROM market_ticks WHERE symbol = :symbol AND timestamp > :afterTime ORDER BY timestamp ASC LIMIT :limit", nativeQuery = true)
    List<MarketTick> findNextTicks(@Param("symbol") String symbol, @Param("afterTime") long afterTime,
            @Param("limit") int limit);
}
