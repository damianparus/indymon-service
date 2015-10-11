package org.indymon.service.rest;

import org.indymon.common.definitions.PutDefinitionsRequest;
import org.indymon.common.definitions.PutDefinitionsResponse;
import org.indymon.common.model.CheckDefinition;
import org.indymon.common.model.PresenterAggregatorDefinition;
import org.indymon.common.model.PresenterCheckDefinition;
import org.indymon.common.definitions.GetDefinitionsResponse;
import org.indymon.service.model.ObjectsStorage;
import org.indymon.service.object.Check;
import org.indymon.service.object.PresenterAggregator;
import org.indymon.service.object.PresenterCheck;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class DefinitionsEndpoint {

    @Autowired
    private ObjectsStorage objectsStorage;

    @RequestMapping(value="/definitions", method= RequestMethod.PUT)
    public PutDefinitionsResponse putDefinitions(@RequestBody PutDefinitionsRequest definitionsToSave) {

        for (CheckDefinition checkToSave : definitionsToSave.getChecks()) {
            objectsStorage.putCheck(checkToSave);
        }

        for (PresenterAggregatorDefinition presenterToSave : definitionsToSave.getPresentersAggregators()) {
            objectsStorage.putPresenterAggregator(presenterToSave);
        }

        for (PresenterCheckDefinition presenterToSave : definitionsToSave.getPresentersChecks()) {
            objectsStorage.putPresenterCheck(presenterToSave);
        }

        return new PutDefinitionsResponse(
                definitionsToSave.getChecks().length,
                definitionsToSave.getPresentersChecks().length,
                definitionsToSave.getPresentersAggregators().length
        );
    }

    @RequestMapping(value="/definitions", method= RequestMethod.GET)
    public GetDefinitionsResponse getDefinitions() {
        GetDefinitionsResponse definitions = new GetDefinitionsResponse();
        for (Map.Entry<String, Check> checkEntry : objectsStorage.getChecks().entrySet()) {
            definitions.getChecks().add(checkEntry.getValue().getDefinition());
        }
        for (Map.Entry<String, PresenterAggregator> presenterAggregatorEntry : objectsStorage.getPresentersAggregators().entrySet()) {
            definitions.getPresentersAggregators().add(presenterAggregatorEntry.getValue().getDefinition());
        }
        for (Map.Entry<String, PresenterCheck> presenterCheckEntry : objectsStorage.getPresentersChecks().entrySet()) {
            definitions.getPresentersChecks().add(presenterCheckEntry.getValue().getDefinition());
        }

        return definitions;
    }

    @RequestMapping(value="/definitions", method= RequestMethod.DELETE)
    public void deleteDefinitions() {
        objectsStorage.getChecks().clear();
        objectsStorage.getPresentersChecks().clear();
        objectsStorage.getPresentersAggregators().clear();
    }

}
