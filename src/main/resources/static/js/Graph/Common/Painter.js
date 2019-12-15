"use strict";

(function ($) {

    IndyMon.Graph.Common.Painter = IndyMon.Common.Painter.BasePainter.extend({

        initialize: function (initData) {
            IndyMon.Graph.Common.Painter.__super__.initialize.apply(this);
            this.reloader = initData.reloader;
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
            var viewCoordinates = {
                xMin: null, yMin: null, xMax: null, yMax: null
            }
            for (var currentZIndexIndex in zIndexes) {
                var currentZIndex = zIndexes[currentZIndexIndex];
                for (var currentPainterIndex in presenters[currentZIndex]) {
                    if (presenters[currentZIndex].hasOwnProperty(currentPainterIndex)) {
                        var currentPainter = presenters[currentZIndex][currentPainterIndex];

                        if (viewCoordinates.xMin === null || currentPainter.getLeft() < viewCoordinates.xMin) {
                            viewCoordinates.xMin = currentPainter.getLeft();
                        }
                        if (viewCoordinates.yMin === null || currentPainter.getTop() < viewCoordinates.yMin) {
                            viewCoordinates.yMin = currentPainter.getTop();
                        }
                        if (viewCoordinates.xMax === null || currentPainter.getLeft() + currentPainter.getWidth() > viewCoordinates.xMax) {
                            viewCoordinates.xMax = currentPainter.getLeft() + currentPainter.getWidth();
                        }
                        if (viewCoordinates.yMax === null || currentPainter.getTop() + currentPainter.getHeight() > viewCoordinates.yMax) {
                            viewCoordinates.yMax = currentPainter.getTop() + currentPainter.getHeight();
                        }
                        currentPainter.setWorkspace(self.workspace);
                        self.addPainter(currentPainter);
                    }
                }
            }
            this.workspace.setVisibleRect(viewCoordinates.xMin, viewCoordinates.xMax, viewCoordinates.yMin, viewCoordinates.yMax);
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
            this.reloader.reset();
            IndyMon.Graph.Common.Painter.__super__.processMouseDownEvent.apply(this);
            this.menu.removeIfVisibleAndNotClicked();
        }

    });

})(jQuery);
