package com.trading.modules.portfolio.service.impl;

import com.trading.modules.portfolio.dao.PortfolioRepository;
import com.trading.modules.portfolio.dto.PortfolioResponse;
import com.trading.modules.portfolio.mapper.PortfolioMapper;
import com.trading.modules.portfolio.service.PortfolioService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PortfolioServiceImpl implements PortfolioService {

    private final PortfolioRepository repository;
    private final PortfolioMapper mapper;

    @Override
    public List<PortfolioResponse> getUserPortfolio(UUID userId) {
        return repository.findByUserId(userId).stream()
                .map(mapper::toResponse)
                .collect(Collectors.toList());
    }
}
