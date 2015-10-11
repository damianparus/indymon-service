"use strict";

(function ($) {

    IndyMon.Common.Painter.StatusRect = Backbone.View.extend({}, {

        paint: function (workspace, left, right, width, height, minScale, status, searchMode, markedInSearch, fontSize, title, message) {
            var box = {
                width: workspace.getAbsolute(width),
                height: workspace.getAbsolute(height),
                left: workspace.getX(left, true),
                right: workspace.getY(right, true)
            };

            if (!IndyMon.Common.Painter.StatusRect.shouldPaint(workspace, box, minScale)) {
                return false;
            }

            var unit = fontSize/8;

            var boxFillColor;
            var textFillColor;
            switch (status) {
                case 0:
                    if (markedInSearch || !searchMode) {
                        boxFillColor = '#999999';
                    } else {
                        boxFillColor = '#555555';
                    }
                    textFillColor = '#000000';
                    break;
                case 1:
                    if (markedInSearch || !searchMode) {
                        boxFillColor = '#ffffff';
                    } else {
                        boxFillColor = '#888888';
                    }
                    textFillColor = '#000000';
                    break;
                case 2:
                    if (markedInSearch || !searchMode) {
                        boxFillColor = '#ffff00';
                    } else {
                        boxFillColor = '#888800';
                    }
                    textFillColor = '#000000';
                    break;
                case 3:
                    if (markedInSearch || !searchMode) {
                        boxFillColor = '#ff0000';
                        textFillColor = '#ffffff';
                    } else {
                        boxFillColor = '#880000';
                        textFillColor = '#888888';
                    }
                    break;
                case 4:
                    if (markedInSearch || !searchMode) {
                        boxFillColor = '#5A1E1E';
                        textFillColor = '#ffffff';
                    } else {
                        boxFillColor = '#665959';
                        textFillColor = '#888888';
                    }
                    break;
                default:
                    alert("Unknown status: " + status + " ("+ title +")");
            }
            var ctx = workspace.getContext();
            ctx.lineWidth = 1;
            ctx.fillStyle = boxFillColor;
            ctx.beginPath();

            ctx.rect(box.left, box.right, box.width, box.height);
            ctx.fillRect(
                workspace.getX(left),
                workspace.getY(right),
                box.width,
                box.height
            );
            ctx.stroke();

            ctx.font = 'bold ' + workspace.getAbsolute(fontSize) + 'px sans-serif';
            ctx.textBaseline = 'top';
            ctx.textAlign = 'left';
            ctx.textFillStyle = textFillColor;
            ctx.fillStyle = textFillColor;
            ctx.fillText(
                title,
                workspace.getX(left + 5*unit),
                workspace.getY(right + 2*unit)
            );

            if (message !== null) {
                var lines = message.split("\n");
                ctx.font = 'normal ' + workspace.getAbsolute(fontSize+1) + 'px sans-serif';
                ctx.textBaseline = 'top';
                ctx.textAlign = 'left';
                ctx.textFillStyle = textFillColor;
                ctx.fillStyle = textFillColor;
                var currentY = right + 15*unit;
                for (var line in lines) {
                    ctx.fillText(
                        lines[line],
                        workspace.getX(left + 5*unit),
                        workspace.getY(currentY)
                    );
                    currentY += 12*unit;
                }
            }

            return true;
        },

        shouldPaint: function (workspace, box, minScale) {

            if (minScale !== null && workspace.getScale() < minScale) {
                return false;
            }

            var canvasSize = workspace.getCanvasSize();

            if ((box.right > canvasSize.height) || (box.right + box.height < 0)) {
                return false;
            }

            if ((box.left > canvasSize.width) || (box.left + box.width < 0)) {
                return false;
            }

            return true;
        },


    });

})(jQuery);
