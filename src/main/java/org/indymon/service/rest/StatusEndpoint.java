package org.indymon.service.rest;

import org.indymon.common.statuses.PutStatusRequest;
import org.indymon.common.statuses.PutStatusResponse;
import org.indymon.common.model.CheckStatus;
import org.indymon.common.statuses.GetStatusesResponse;
import org.indymon.service.model.ObjectsStorage;
import org.indymon.service.object.Check;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class StatusEndpoint {

    @Autowired
    private ObjectsStorage objectsStorage;

    @RequestMapping(value="/status", method= RequestMethod.PUT)
    public PutStatusResponse status(@RequestBody PutStatusRequest statusesToSave) {
        int savedStatuses = 0;
        for (CheckStatus checkStatusToSave : statusesToSave.getChecksStatuses()) {
            Check check = objectsStorage.getChecks().get(checkStatusToSave.getSymbol());
            if (check != null && checkStatusToSave.getExpireTime() > 0) {
                savedStatuses++;
                check.setStatus(checkStatusToSave);
            }
        }

        return new PutStatusResponse(
                savedStatuses
        );
    }

    @RequestMapping(value="/status", method= RequestMethod.GET)
    public GetStatusesResponse status() {

        GetStatusesResponse response = new GetStatusesResponse();

        for (Map.Entry<String, Check> checkEntry : objectsStorage.getChecks().entrySet()) {
            CheckStatus status = checkEntry.getValue().getStatus();
            if (status != null) {
                response.getChecksStatuses().add(status);
            }
        }

        return response;
    }

}
