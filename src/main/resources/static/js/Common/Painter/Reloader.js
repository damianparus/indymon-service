"use strict";

(function ($) {
    IndyMon.Common.Painter.Reloader = Backbone.Model.extend({

        shouldReload: null,

        initialize: function () {
            setInterval(
                _.bind(this.reloadTimer, this),
                5*60*1000
            );
            this.shouldReload = true;
        },

        reset: function () {
            this.shouldReload = false;
        },

        reloadTimer: function () {
            if (this.shouldReload) {
                this.reloadNow();
            } else {
                this.shouldReload = true;
            }
        },

        reloadNow: function () {
            location.reload();
        }

    });

})(jQuery);