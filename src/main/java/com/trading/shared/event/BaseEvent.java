package com.trading.shared.event;

import lombok.Data;
import java.util.UUID;

@Data
public abstract class BaseEvent {
    private String eventId = UUID.randomUUID().toString();
    private long timestamp = System.currentTimeMillis();
}
