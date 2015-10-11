package org.indymon.service.model;

import org.indymon.common.model.CheckDefinition;
import org.indymon.common.model.PresenterAggregatorDefinition;
import org.indymon.common.model.PresenterCheckDefinition;
import org.indymon.service.object.Check;
import org.indymon.service.object.PresenterAggregator;
import org.indymon.service.object.PresenterCheck;
import org.springframework.stereotype.Component;

import java.util.concurrent.ConcurrentHashMap;

@Component
public class ObjectsStorage {

    private ConcurrentHashMap<String, Check> checks;
    private ConcurrentHashMap<String, PresenterAggregator> presentersAggregators;
    private ConcurrentHashMap<String, PresenterCheck> presentersChecks;

    public ObjectsStorage() {
        checks = new ConcurrentHashMap<>();
        presentersAggregators = new ConcurrentHashMap<>();
        presentersChecks = new ConcurrentHashMap<>();
    }

    public ConcurrentHashMap<String, Check> getChecks() {
        return checks;
    }

    public ConcurrentHashMap<String, PresenterAggregator> getPresentersAggregators() {
        return presentersAggregators;
    }

    public ConcurrentHashMap<String, PresenterCheck> getPresentersChecks() {
        return presentersChecks;
    }

    public void putCheck(CheckDefinition checkDefinition) {
        Check check = new Check(checkDefinition);
        checks.put(checkDefinition.getSymbol(), check);
    }

    public void putPresenterAggregator(PresenterAggregatorDefinition presenterDefinition) {
        PresenterAggregator presenter = new PresenterAggregator(presenterDefinition);
        presentersAggregators.put(presenterDefinition.getSymbol(), presenter);
    }

    public void putPresenterCheck(PresenterCheckDefinition presenterDefinition) {
        PresenterCheck presenter = new PresenterCheck(presenterDefinition);
        presentersChecks.put(presenterDefinition.getSymbol(), presenter);
    }
}
