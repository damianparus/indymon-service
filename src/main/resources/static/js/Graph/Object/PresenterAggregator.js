"use strict";

(function ($) {

    IndyMon.Graph.Object.PresenterAggregator = IndyMon.Graph.Object.Presenter.extend({

        initialize: function (params) {
            IndyMon.Graph.Object.PresenterAggregator.__super__.initialize.apply(this, [params]);
        },

        paint: function () {
            IndyMon.Common.Painter.StatusRect.paint(
                this.workspace,
                this.getLeft(),
                this.getTop(),
                this.getWidth(),
                this.getHeight(),
                this.getMinScale(),
                this.getStatus(),
                this.searcher.isSearchMode(),
                this.searcher.isMarkedInSearch(),
                this.getTitleFontSize(),
                this.getTitle(),
                this.getDescriptionFontSize(),
                this.getDescription(),
                this.getMessage()
            );
        },

        getSubPresenters: function () {
            return this.definition.subPresenters;
        },

        getSubPresentersMessages: function () {
            return this.definition.subPresentersMessages;
        },

        getStatus: function () {
            var status = 1000;
            $.each(this.getSubPresenters(), function (index, currentSubPresenter) {
                status = Math.min(
                    this.objects.getPresenter(currentSubPresenter).getStatus(),
                    status
                );
            }.bind(this));

            return status;
        },

        getMessage: function () {
            var message = "";
            $.each(this.getSubPresentersMessages(), function (index, currentSubPresenter) {
                message += this.objects.getPresenter(currentSubPresenter).getMessage() + "\n";
            }.bind(this));

            return message;
        }

    });

})(jQuery);
