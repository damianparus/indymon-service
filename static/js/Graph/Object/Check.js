"use strict";

(function ($) {

    IndyMon.Graph.Object.Check = Backbone.Model.extend({

        initialize: function (params) {
            this.definition = params.definition;
            this.reset();
        },

        reset: function () {
            this.status = 0;
            this.message = "?";
        },

        getSymbol: function () {
            return this.definition.symbol;
        },

        getStatus: function () {
            return this.status;
        },

        getMessage: function () {
            return this.message;
        },

        setNewStatus: function (newStatus) {
            this.status = newStatus.status;
            this.message = newStatus.message;
        }

    });

})(jQuery);
