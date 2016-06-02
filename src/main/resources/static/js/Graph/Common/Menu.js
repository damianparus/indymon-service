"use strict";

(function ($) {

    IndyMon.Graph.Common.Menu = Backbone.View.extend({

        events: {},

        initialize: function (initData) {
            this.workspace = initData.workspace;
            this.menuClicked = false;
        },

        clickedButton: function (element) {
            this.removeIfVisibleAndNotClicked();
            eval(element.command);
        },

        show: function (x, y, menuData) {
            if ($("#objectTypeDiv").length == 0) {
                var template = _.template(
                    $("#MenuTemplate").html(), { elements: menuData.elements }
                );
                var coordinates = {
                    x: this.workspace.getX(x),
                    y: this.workspace.getY(y)
                };
                var div = this.workspace.getPainterDivSelector();
                div.append('<div id="objectTypeDiv" style="position: absolute; background-color: #ffffff; border: 1px solid black; border-radius: 5px;"></div>');
                this.$el = $("#objectTypeDiv");
                this.$el.mouseup(function(event) {
                    this.menuClicked = false;
                }.bind(this));
                this.$el.mousedown(function(event) {
                    this.menuClicked = true;
                }.bind(this));
                this.$el.html(template);
                this.$el.css({left: coordinates.x, top: coordinates.y });
                $.each(menuData.elements, function (index, element) {
                    $("#button-" + index).click(function () {
                        this.clickedButton(element);
                    }.bind(this));
                }.bind(this))
            }
        },

        removeIfVisibleAndNotClicked: function () {
            if (!this.menuClicked) {
                $("#objectTypeDiv").remove();
            }
            this.menuClicked = false;
        },

        copyToClipboard: function (stringToCopy) {
            var copyTextarea = document.querySelector('.copytextarea');
            copyTextarea.value = stringToCopy;
            copyTextarea.style.display='block';
            copyTextarea.select();
            document.execCommand('copy');
            copyTextarea.style.display='none';
        }

    });

})(jQuery);
