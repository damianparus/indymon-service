"use strict";

(function ($) {

    IndyMon.Graph.Common.Finder = Backbone.View.extend({

        objects: null,
        workspace: null,
        previewTimeout: null,

        events: {
            "keyup #finderSearchText": "changeFinderSearchText",
            "click #finderCloseButton": "closeButtonEvent",
            "click #finderSearchButton": "searchButtonEvent"
        },

        clearPreview: function () {
            if (this.previewTimeout !== null) {
                window.clearTimeout(this.previewTimeout);
            }
        },

        changeFinderSearchText: function () {
            var self = this;
            this.clearPreview();
            this.previewTimeout = window.setTimeout(function() {
                self.search(false);
                self.workspace.paint();
            }, 300);
        },

        initialize: function (initData) {
            this.objects = initData.objects;
            this.workspace = initData.workspace;
            this.bindKeys();
        },

        bindKeys: function () {
            var self = this;
            window.addEventListener("keydown",function (e) {
                if (e.keyCode === 114 || (e.ctrlKey && e.keyCode === 70)) {
                    e.preventDefault();
                    self.show();
                } else if (e.keyCode === 27) {
                    self.hide();
                } else if (e.keyCode === 13) {
                    self.search(true);
                }
            });
        },

        show: function () {
            this.$el.css({
                'display' : 'block'
            });
            this.$('#finderSearchText').focus();
            this.search(false);
        },

        hide: function () {
            this.$el.css({
                'display' : 'none'
            });
            this.markAllAsNotSearched();
            this.workspace.paint();
        },

        markAllAsNotSearched: function () {
            var presenters = this.objects.getPresenters();
            for (var key in presenters) {
                if (presenters.hasOwnProperty(key)) {
                    presenters[key].searchEvent(null);
                }
            }
        },

        search: function (moveToObjects) {
            this.clearPreview();
            var searchText = $("#finderSearchText").val();
            var locatedObjectsCoordinates = null;
            var presenters = this.objects.getPresenters();
            if (searchText.trim().length > 0) {
                for (var key in presenters) {
                    if (presenters.hasOwnProperty(key)) {
                        var currentPresenter = presenters[key];
                        currentPresenter.searchEvent(null);
                        if (currentPresenter.searchEvent(searchText)) {
                            if (locatedObjectsCoordinates === null) {
                                locatedObjectsCoordinates = {
                                    left: currentPresenter.getLeft(),
                                    top: currentPresenter.getTop(),
                                    right: currentPresenter.getLeft() + currentPresenter.getWidth(),
                                    bottom: currentPresenter.getTop() + currentPresenter.getHeight()
                                };
                            } else {
                                locatedObjectsCoordinates.left = Math.min(locatedObjectsCoordinates.left, currentPresenter.getLeft());
                                locatedObjectsCoordinates.top = Math.min(locatedObjectsCoordinates.top, currentPresenter.getTop());
                                locatedObjectsCoordinates.right = Math.max(locatedObjectsCoordinates.right, currentPresenter.getLeft() + currentPresenter.getWidth());
                                locatedObjectsCoordinates.bottom = Math.max(locatedObjectsCoordinates.bottom, currentPresenter.getTop() + currentPresenter.getHeight());
                            }
                        }
                    }
                }
                if (moveToObjects) {
                    if (locatedObjectsCoordinates !== null) {
                        var margin = {
                            x: Math.abs((locatedObjectsCoordinates.right - locatedObjectsCoordinates.left) * 0.02),
                            y: Math.abs((locatedObjectsCoordinates.bottom - locatedObjectsCoordinates.top) * 0.02)
                        };
                        this.workspace.setVisibleRect(
                            locatedObjectsCoordinates.left - margin.x,
                            locatedObjectsCoordinates.right + margin.x,
                            locatedObjectsCoordinates.top - margin.y,
                            locatedObjectsCoordinates.bottom + margin.y
                        );
                    }
                }
                this.workspace.paint();
            } else {
                this.markAllAsNotSearched();
            }
        },

        closeButtonEvent: function () {
            this.hide();
        },

        searchButtonEvent: function () {
            this.search(true);
        }

    });

})(jQuery);
