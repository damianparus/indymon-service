"use strict";

(function ($) {

    IndyMon.Graph.Object.Presenter = IndyMon.Common.Painter.BasePainter.extend({

        initialize: function (params) {
            IndyMon.Graph.Object.Presenter.__super__.initialize.apply(this, [params]);
            this.menu = params.menu;
            this.definition = params.definition;
            this.objects = params.objects;
            this.searcher = new IndyMon.Graph.Searcher.TitleSearcher({
                title: this.getTitle()
            });
        },

        getSymbol: function () {
            return this.definition.symbol;
        },

        getTitle: function () {
            return this.definition.title;
        },

        getMinScale: function () {
            return this.definition.minScale;
        },

        getWidth: function () {
            return this.definition.width;
        },

        getHeight: function () {
            return this.definition.height;
        },

        getLeft: function () {
            return this.definition.left;
        },

        getTop: function () {
            return this.definition.top;
        },

        getClickAction: function () {
            return this.definition.clickAction;
        },

        getFontSize: function () {
            return this.definition.fontSize;
        },

        getZIndex: function () {
            return this.definition.zIndex;
        },

        searchEvent: function (searchText) {
            return this.searcher.searchEvent(searchText);
        },

        processMouseUpEvent: function (eventData) {
            IndyMon.Graph.Object.Presenter.__super__.processMouseUpEvent.apply(this, [eventData]);
            if (
                !eventData.wasMoved &&
                eventData.x >= this.getLeft() &&
                eventData.x <= this.getLeft() + this.getWidth() &&
                eventData.y >= this.getTop() &&
                eventData.y <= this.getTop() + this.getHeight()
            ) {
                if (this.getClickAction() !== null) {
                    var clickAction = this.getClickAction();
                    clickAction = clickAction.replace(/^menu\.show\(/, "this.menu.show(" + eventData.x + ", " + eventData.y + ", ");
                    eval(clickAction);
                    return true;
                }
            }
            return false;
        }

    });

})(jQuery);
