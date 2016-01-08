"use strict";

(function ($) {

    IndyMon.Graph.Common.Painter = IndyMon.Common.Painter.BasePainter.extend({

        initialize: function (initData) {
            IndyMon.Graph.Common.Painter.__super__.initialize.apply(this);
            this.objects = initData.objects;
            this.menu = initData.menu;
            this.setWorkspace(initData.workspace);
            this.objects.loadDefinitions(
                this.definitionsCompleted.bind(this)
            );
        },

        definitionsCompleted: function () {
            var self = this;
            var zIndexes = this.objects.getZIndexes();
            var presenters = this.objects.getZIndexedPresenters();
            for (var currentZIndexIndex in zIndexes) {
                var currentZIndex = zIndexes[currentZIndexIndex];
                for (var currentPainterIndex in presenters[currentZIndex]) {
                    if (presenters[currentZIndex].hasOwnProperty(currentPainterIndex)) {
                        var currentPainter = presenters[currentZIndex][currentPainterIndex];
                        currentPainter.setWorkspace(self.workspace);
                        self.addPainter(currentPainter);
                    }
                }
            }
            this.workspace.paint();
            this.loadStatuses();
        },

        loadStatuses: function () {
            this.objects.loadStatuses(
                this.statusesCompleted.bind(this)
            );
        },

        statusesCompleted: function () {
            this.workspace.paint();
            setTimeout(
                this.loadStatuses.bind(this),
                1000
            );
        },

        processMouseDownEvent: function () {
            IndyMon.Graph.Common.Painter.__super__.processMouseDownEvent.apply(this);
            this.menu.removeIfVisibleAndNotClicked();
        }

    });

})(jQuery);
