package com.trading.modules.replay.model;

import com.trading.shared.model.BaseEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "replay_sessions")
@Data
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class ReplaySession extends BaseEntity {

    private String userId;
    private String symbol;

    @Column(name = "start_time_offset")
    private long startTime;

    @Column(name = "current_tick_time")
    private long currentTickTime;

    private double speed; // 1x, 10x, 100x
    private boolean running;
}
