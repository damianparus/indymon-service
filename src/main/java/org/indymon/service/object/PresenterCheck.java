package org.indymon.service.object;

import org.indymon.common.model.PresenterCheckDefinition;

public class PresenterCheck extends Presenter {

    PresenterCheckDefinition definition;

    public PresenterCheck(PresenterCheckDefinition definition) {
        this.definition = definition;
    }

    public PresenterCheckDefinition getDefinition() {
        return definition;
    }

}
