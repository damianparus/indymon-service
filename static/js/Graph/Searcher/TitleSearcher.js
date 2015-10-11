"use strict";

(function ($) {

    IndyMon.Graph.Searcher.TitleSearcher = Backbone.Model.extend({

        initialize: function (params) {
            this.markedInSearch = false;
            this.searchMode = false;
            this.title = params.title;
        },

        searchEvent: function (searchText) {
            this.markedInSearch = false;
            this.searchMode = false;
            if (searchText !== null) {
                this.searchMode = true;
                if (this.title.indexOf(searchText) > -1) {
                    this.markedInSearch = true;
                }
            }

            return this.markedInSearch;
        },

        isMarkedInSearch: function () {
            return this.markedInSearch;
        },

        isSearchMode: function () {
            return this.searchMode;
        }

    });

})(jQuery);
