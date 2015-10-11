package org.indymon.service.object;

import org.indymon.common.model.PresenterAggregatorDefinition;

public class PresenterAggregator extends Presenter {

    PresenterAggregatorDefinition definition;

    public PresenterAggregator(PresenterAggregatorDefinition definition) {
        this.definition = definition;
    }

    public PresenterAggregatorDefinition getDefinition() {
        return definition;
    }
}
