package org.indymon.service.scheduler;

import org.indymon.common.model.CheckStatus;
import org.indymon.service.model.ObjectsStorage;
import org.indymon.service.object.Check;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class StatusExpire {

    @Autowired
    private ObjectsStorage objectsStorage;

    @Scheduled(fixedDelay = 5000)
    public void checkForExpiredStatuses()
    {
        long currentTime = System.currentTimeMillis() / 1000L;
        for (Map.Entry<String, Check> checkEntry : objectsStorage.getChecks().entrySet()) {
            CheckStatus status = checkEntry.getValue().getStatus();
            if (status != null) {
                if (status.getExpireTime() > 0 && status.getExpireTime() < currentTime) {
                    status.setExpireTime(0);
                    status.setStatus(1);
                }
            }
        }
    }
}
