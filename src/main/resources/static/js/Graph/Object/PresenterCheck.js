"use strict";

(function ($) {

    IndyMon.Graph.Object.PresenterCheck = IndyMon.Graph.Object.Presenter.extend({

        initialize: function (params) {
            IndyMon.Graph.Object.PresenterCheck.__super__.initialize.apply(this, [params]);
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
                this.getFontSize(),
                this.getTitle(),
                this.getMessage()
            );
        },

        getCheckSymbol: function () {
            return this.definition.checkSymbol;
        },

        getStatus: function () {
            var check = this.objects.getCheck(this.getCheckSymbol());
            if (typeof check === 'undefined') {
                alert("Cannot find check object: " + this.getCheckSymbol() + " (" + this.getTitle() + ")");
                return 0;
            }
            return check.getStatus();
        },

        getMessage: function () {
            var check = this.objects.getCheck(this.getCheckSymbol());
            if (typeof check === 'undefined') {
                alert("Cannot find check object: " + this.getCheckSymbol() + " (" + this.getTitle() + ")");
                return "";
            }
            return check.getMessage();
        }

    });

})(jQuery);
