package com.trading.modules.trade.consumer;

import com.trading.shared.event.TradeExecutedEvent;
import com.trading.modules.trade.service.TradeService;
import com.trading.modules.settlement.service.SettlementService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class TradeConsumer {

    private final TradeService tradeService;
    private final SettlementService settlementService;

    @KafkaListener(topics = "trade.executed", groupId = "portfolio-group")
    public void consume(TradeExecutedEvent event) {
        log.info("Trade Consumer received event for trade: {} | Symbol: {}",
                event.getTradeId(), event.getSymbol());

        try {
            tradeService.saveTrade(event);
            log.info("Trade saved successfully for trade: {}", event.getTradeId());

            settlementService.process(event);
            log.info("Settlement processed successfully for trade: {}", event.getTradeId());
        } catch (Exception e) {
            log.error("Error processing trade event: {}", e.getMessage(), e);
        }
    }
}
