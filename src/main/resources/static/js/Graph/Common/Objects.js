"use strict";

(function ($) {

    IndyMon.Graph.Common.Objects = Backbone.Model.extend({

        initialize: function (initData) {
            this.menu = initData.menu;
            this.reloader = initData.reloader;
            this.checks = [];
            this.presenters = [];
            this.zIndexedPresenters = [];
            this.zIndexes = [];
        },

        loadStatuses: function (statusesLoadCompletedCallBack) {
            $.ajax({
                type: 'GET',
                url: 'status/',
                dataType: 'json',
                success: this.importStatuses.bind(this, statusesLoadCompletedCallBack),
                error: this.importStatusesError.bind(this, statusesLoadCompletedCallBack)
            });
        },

        loadDefinitions: function (definitionsLoadCompletedCallBack) {
            $.ajax({
                type: 'GET',
                url: 'definitions/',
                dataType: 'json',
                success: this.importDefinitions.bind(this, definitionsLoadCompletedCallBack),
                error: function() {
                    alert('Definitions error')
                }
            });
        },

        importStatuses: function (statusesLoadCompletedCallBack, newStatuses) {
            $.each(newStatuses.checksStatuses, function(key, currentStatus) {
                if (typeof this.checks[currentStatus.symbol] === 'undefined') {
                    this.reloader.reloadNow();
                    console.log("Error: unknown check symbol in status: " + currentStatus.symbol);
                    return;
                }
                this.checks[currentStatus.symbol].setNewStatus(currentStatus);
            }.bind(this));
            statusesLoadCompletedCallBack();
        },

        importDefinitions: function (definitionsLoadCompletedCallBack, dataToImport) {
            this.checks = [];
            this.importDefinitionsChecks(dataToImport.checks);
            this.importDefinitionsPresentersAggregates(dataToImport.presentersAggregators);
            this.importDefinitionsPresentersChecks(dataToImport.presentersChecks);
            this.zIndexes.sort();
            definitionsLoadCompletedCallBack();
        },

        importDefinitionsChecks: function (objectToImport) {
            $.each(objectToImport, function(key, currentObjectDefinition) {
                var newObject = new IndyMon.Graph.Object.Check({
                    definition: currentObjectDefinition
                });
                this.checks[newObject.getSymbol()] = newObject;
            }.bind(this));
        },

        importDefinitionsPresentersAggregates: function (objectsToImport) {
            $.each(objectsToImport, function(key, currentObjectDefinition) {
                var newPresenter = new IndyMon.Graph.Object.PresenterAggregator({
                    definition: currentObjectDefinition,
                    menu: this.menu,
                    objects: this
                });
                this.addPresenter(newPresenter);
            }.bind(this));
        },

        importDefinitionsPresentersChecks: function (objectsToImport) {
            $.each(objectsToImport, function(key, currentObjectDefinition) {
                var newPresenter = new IndyMon.Graph.Object.PresenterCheck({
                    definition: currentObjectDefinition,
                    menu: this.menu,
                    objects: this
                });
                this.addPresenter(newPresenter);
            }.bind(this));
        },

        addPresenter: function (newPresenter) {
            var newPresenterSymbol = newPresenter.getSymbol();
            var zIndex = newPresenter.getZIndex();
            if (typeof this.zIndexes[zIndex] === 'undefined') {
                this.zIndexes[zIndex] = zIndex;
                this.zIndexedPresenters[zIndex] = [];
            }
            this.zIndexedPresenters[zIndex].push(newPresenter);
            if (typeof this.presenters[newPresenterSymbol] === 'undefined') {
                this.presenters[newPresenterSymbol] = newPresenter;
            } else {
                alert("Duplicated presenter, skipping (" + newPresenterSymbol);
            }
        },

        getZIndexes: function () {
            return this.zIndexes;
        },

        getZIndexedPresenters: function () {
            return this.zIndexedPresenters;
        },

        getPresenters: function () {
            return this.presenters;
        },

        getCheck: function (objectSymbol) {
            if (typeof this.checks[objectSymbol] === 'undefined') {
                alert("Check does not exists: " + objectSymbol);
                return typeof this.checks[objectSymbol];
            }
            return this.checks[objectSymbol];
        },

        getPresenter: function (objectSymbol) {
            if (typeof this.presenters[objectSymbol] === 'undefined') {
                alert("Presenter does not exists: " + objectSymbol);
                return typeof this.presenters[objectSymbol];
            }
            return this.presenters[objectSymbol];
        },

        importStatusesError: function (statusesLoadCompletedCallBack) {
            this.resetAllChecks();
            statusesLoadCompletedCallBack();
        },

        resetAllChecks: function () {
            for (var key in this.checks) {
                if (this.checks.hasOwnProperty(key)) {
                    this.checks[key].reset();
                }
            }
        }
    });

})(jQuery);
