package org.indymon.service.object;

import org.indymon.common.model.CheckDefinition;
import org.indymon.common.model.CheckStatus;

public class Check {

    private CheckDefinition definition;
    private CheckStatus status;

    public Check(CheckDefinition definition) {
        this.definition = definition;
    }

    public CheckDefinition getDefinition() {
        return definition;
    }

    public void setDefinition(CheckDefinition definition) {
        this.definition = definition;
    }

    public CheckStatus getStatus() {
        return status;
    }

    public void setStatus(CheckStatus status) {
        this.status = status;
    }
}
