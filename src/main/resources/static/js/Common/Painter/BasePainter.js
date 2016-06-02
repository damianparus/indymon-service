"use strict";

(function ($) {

    IndyMon.Common.Painter.BasePainter = Backbone.View.extend({

        paintersArray: null,
        workspace: null,

        initialize: function () {
            this.paintersArray = [];
        },

        setWorkspace: function (workspace) {
            this.workspace = workspace;
        },

        addPainter: function (painterToAdd) {
            this.paintersArray.push(painterToAdd);
        },

        paint: function () {
            $.each(this.paintersArray, function (index, currentPainter) {
                currentPainter.paint();
            });
        },

        render: function () {
            $.each(this.paintersArray, function (index, currentPainter) {
                currentPainter.render();
            });
        },

        processMouseUpEvent: function (eventData) {
            $.each(this.paintersArray, function (index, currentPainter) {
                currentPainter.processMouseUpEvent(eventData);
            });
        },

        processMouseDownEvent: function (eventData) {
            $.each(this.paintersArray, function (index, currentPainter) {
                currentPainter.processMouseDownEvent(eventData);
            });
        },

        processMouseMoveEvent: function (eventData) {
            var disableMainFunction = false;
            $.each(this.paintersArray, function (index, currentPainter) {
                disableMainFunction |= currentPainter.processMouseMoveEvent(eventData);
            });
            return disableMainFunction;
        }
    });

})(jQuery);
