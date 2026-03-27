package com.trading.modules.replay.dao;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.trading.modules.replay.model.ReplaySession;

@Repository
public interface ReplayRepository extends JpaRepository<ReplaySession, UUID> {
    List<ReplaySession> findByRunningTrue();
}
