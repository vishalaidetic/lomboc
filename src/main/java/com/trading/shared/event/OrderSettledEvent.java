package com.trading.shared.event;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class OrderSettledEvent extends BaseEvent {
    private String orderId;
    private UUID userId;
    private String symbol;
    private int quantity;
}
