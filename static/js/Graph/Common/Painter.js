"use strict";

(function ($) {

    IndyMon.Graph.Common.Painter = IndyMon.Common.Painter.BasePainter.extend({

        initialize: function (initData) {
            IndyMon.Graph.Common.Painter.__super__.initialize.apply(this);
            this.objects = initData.objects;
            this.setWorkspace(initData.workspace);
            this.objects.loadDefinitions(
                this.definitionsCompleted.bind(this)
            );
        },

        definitionsCompleted: function () {
            var self = this;
            var presenters = this.objects.getPresenters();

            for (var currentPainterIndex in presenters) {
                if (presenters.hasOwnProperty(currentPainterIndex)) {
                    var currentPainter = presenters[currentPainterIndex];
                    currentPainter.setWorkspace(self.workspace);
                    self.addPainter(currentPainter);
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
        }

    });

})(jQuery);
