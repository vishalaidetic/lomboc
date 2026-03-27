package com.trading.modules.portfolio.dao;

import com.trading.modules.portfolio.model.Portfolio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.UUID;
import java.util.List;

@Repository
public interface PortfolioRepository extends JpaRepository<Portfolio, UUID> {
    Optional<Portfolio> findByUserIdAndSymbol(UUID userId, String symbol);

    List<Portfolio> findByUserId(UUID userId);
}
