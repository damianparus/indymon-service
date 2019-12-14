"use strict";

(function ($) {

    IndyMon.Common.Painter.Workspace = IndyMon.Common.Painter.BasePainter.extend({

        drawingContext: null,
        canvas: null,
        painterDivSelector: null,
        mouseCoordinates: null,
        paintPosition: null,
        wasMoved: null,
        wasZoomed : null,
        scale : null,
        scaleDistance: null,
        mouseButtonIsPressed: null,
        touchStartPosition: null,
        mouseWheelTimeout: null,

        initialize: function (initData) {
            this.setWorkspace(this);
            this.wasMoved = false;
            this.wasZoomed = false;
            this.scale = 1;
            this.mouseButtonIsPressed = false;
            this.scaleDistance = 0;
            this.mouseCoordinates = {
                x: 0,
                y: 0
            };
            this.paintPosition = {
                x: 0,
                y: 0
            };
            IndyMon.Common.Painter.Workspace.__super__.initialize.apply(this);
            this.bindKeys();
        },

        bindKeys: function () {
            var self = this;
            window.addEventListener("keydown",function (e) {
                if (document.activeElement === document.body) {
                    switch (e.keyCode) {
                        case 38:
                            self.paintPosition.y -= 20/self.scale;
                            self.paint();
                            break;
                        case 40:
                            self.paintPosition.y += 20/self.scale;
                            self.paint();
                            break;
                        case 37:
                            self.paintPosition.x -= 20/self.scale;
                            self.paint();
                            break;
                        case 39:
                            self.paintPosition.x += 20/self.scale;
                            self.paint();
                            break;
                        case 187:
                            self.changeZoom(IndyMon.Common.Painter.Workspace.DEFAULT_ZOOM_IN, self.canvas.width/2, self.canvas.height/2);
                            break;
                        case 189:
                            self.changeZoom(IndyMon.Common.Painter.Workspace.DEFAULT_ZOOM_OUT, self.canvas.width/2, self.canvas.height/2);
                            break;
                    }
                }
            });
        },

        render: function () {
            this.$el.html('<div id="painterDiv" class="content-frame"></div>');
            this.painterDivSelector = $('#painterDiv');
            this.painterDivSelector.append('<canvas id="painterDivCanvas" style="position: absolute; left:0px; top:0px;" />');
            this.canvasSelector = $('#painterDivCanvas');
            this.canvas = this.canvasSelector[0];
            this.drawingContext = this.canvas.getContext('2d');
            this.attachResizeEvent();
            this.attachMouseEvents();
            this.attachTouchEvents();
            this.setCanvasSize();
            IndyMon.Common.Painter.Workspace.__super__.render.apply(this);
        },

        getPainterDivSelector: function () {
            return this.painterDivSelector;
        },

        getOffsetX: function () {
            return this.canvasSelector.parent().offset().left;
        },

        getOffsetY: function () {
            return this.canvasSelector.parent().offset().top;
        },

        eventMouseUp: function () {
            this.mouseButtonIsPressed = false;
            var eventData = {};
            eventData.x = this.mouseCoordinates.x/this.scale + this.paintPosition.x;
            eventData.y = this.mouseCoordinates.y/this.scale + this.paintPosition.y;
            eventData.wasMoved = this.wasMoved;
            this.processMouseUpEvent(eventData)
        },

        updateMouseCoordinates: function (event) {
            this.mouseCoordinates.x = event.clientX - this.getOffsetX();
            this.mouseCoordinates.y = event.clientY - this.getOffsetY();
        },

        eventMouseDown: function (event) {
            this.wasMoved = false;
            this.wasZoomed = false;
            this.updateMouseCoordinates(event);
            this.mouseButtonIsPressed = true;
            var eventData = {};
            eventData.x = (event.clientX-this.getOffsetX())/this.scale + this.paintPosition.x;
            eventData.y = (event.clientY-this.getOffsetY())/this.scale + this.paintPosition.y;
            this.processMouseDownEvent(eventData);
            this.paint();
        },

        eventMouseMove: function (event) {
            if (!this.wasZoomed) {
                var eventData = {};
                eventData.diffX = event.clientX - this.mouseCoordinates.x - this.getOffsetX();
                eventData.diffY = event.clientY - this.mouseCoordinates.y - this.getOffsetY();
                eventData.mouseButtonIsPressed = this.mouseButtonIsPressed;
                var block = this.processMouseMoveEvent(eventData);
                if (eventData.mouseButtonIsPressed) {
                    this.wasMoved = true;
                    if (!block) {
                        this.paintPosition.x -= eventData.diffX/this.scale;
                        this.paintPosition.y -= eventData.diffY/this.scale;
                    }
                    this.paint();
                }
                this.mouseCoordinates.x = event.clientX - this.getOffsetX();
                this.mouseCoordinates.y = event.clientY - this.getOffsetY();
            }
        },

        attachMouseEvents: function () {
            $(document).mouseup(function(event) {
                this.eventMouseUp();
            }.bind(this));
            this.painterDivSelector.mousemove(function (event) {
                this.eventMouseMove(event);
            }.bind(this));
            this.painterDivSelector.mousedown(function (event) {
                this.eventMouseDown(event);
            }.bind(this));
            this.canvasSelector.bind('mousewheel', function(event, deltaX, deltaY, deltaFactor) {
                this.mouseWheelRegulator(event, deltaFactor);
                event.preventDefault();
            }.bind(this));
        },

        mouseWheelRegulator: function (event, deltaFactor) {
            if (this.mouseWheelTimeout === null) {
                this.mouseWheelTimeout = setTimeout(
                    function() {
                        this.mouseWheel(event, deltaFactor);
                    }.bind(this),
                    10
                );
            }
        },

        convertTouchEventToNormal : function (genericEvent) {
            var touches = genericEvent.touches;
            var convertedEvent = {
                clientX: touches[0].clientX,
                clientY: touches[0].clientY
            };
            return convertedEvent;
        },

        attachTouchEvents: function () {
            var self = this;
            document.getElementById('painterDivCanvas').addEventListener('touchend', function(event) {
                event.preventDefault();
                self.eventMouseUp();
            }, false);
            document.getElementById('painterDivCanvas').addEventListener('touchstart', function(event) {
                event.preventDefault();
                var convertedEvent = self.convertTouchEventToNormal(event);
                self.touchStartPosition = convertedEvent;
                switch (event.touches.length) {
                    case 1:
                        self.eventMouseDown(convertedEvent);
                        break;
                    case 2:
                        self.updateMouseCoordinates(convertedEvent);
                        self.scaleDistance = self.calculateDistanceFromTouches(event.touches);
                        break;
                }
            }, false);
            document.getElementById('painterDivCanvas').addEventListener('touchmove', function(event) {
                event.preventDefault();
                self.wasMoved = true;
                switch (event.touches.length) {
                    case 1:
                        var convertedEvent = self.convertTouchEventToNormal(event);
                        var diff = Math.max(
                            Math.abs(self.touchStartPosition.clientX-convertedEvent.clientX),
                            Math.abs(self.touchStartPosition.clientY-convertedEvent.clientY)
                        );
                        if (diff <= 5) {
                            self.wasMoved = false;
                            return false;
                        }
                        convertedEvent.buttons = 1;
                        self.eventMouseMove(convertedEvent);
                        break;
                    case 2:
                        if (self.scaleDistance > 0) {
                            self.wasZoomed = true;
                            var newDistance = self.calculateDistanceFromTouches(event.touches);
                            var zoomCenterX = event.touches[0].clientX - (event.touches[0].clientX-event.touches[1].clientX)/2;
                            var zoomCenterY = event.touches[0].clientY - (event.touches[0].clientY-event.touches[1].clientY)/2;
                            var scaleModifier = newDistance/self.scaleDistance;
                            self.scaleDistance = newDistance;
                            self.changeZoom(scaleModifier, zoomCenterX, zoomCenterY);
                        }
                        break;
                }
            }, false);
        },

        calculateDistanceFromTouches: function (touches) {
            return Math.abs(touches[0].clientX-touches[1].clientX) + Math.abs(touches[0].clientY-touches[1].clientY);
        },

        changeZoom: function (scaleModifier, zoomX, zoomY) {
            this.paintPosition.x = zoomX/this.scale+this.paintPosition.x-zoomX/(this.scale*scaleModifier);
            this.paintPosition.y = zoomY/this.scale+this.paintPosition.y-zoomY/(this.scale*scaleModifier);
            this.scale *= scaleModifier;
            this.paint();
        },

        mouseWheel : function(event, delta) {
            this.mouseWheelTimeout = null;
            if (delta > 10) {
                delta = 10;
            } else if (delta < -10) {
                delta = -10;
            }
            var scaleModifier;
            if (delta > 0) {
                scaleModifier = IndyMon.Common.Painter.Workspace.DEFAULT_ZOOM_IN;
            } else {
                scaleModifier = IndyMon.Common.Painter.Workspace.DEFAULT_ZOOM_OUT;
            }
            this.changeZoom(
                scaleModifier,
                event.clientX - this.getOffsetX(),
                event.clientY - this.getOffsetY()
            );
        },

        getContext: function () {
            return this.drawingContext;
        },

        paint: function () {
            this.drawingContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
            IndyMon.Common.Painter.Workspace.__super__.paint.apply(this);
        },

        getX: function (coordinate, toHalf) {
            var position = (coordinate - this.paintPosition.x)*this.scale;
            if (toHalf) {
                return Math.floor(position)+0.5;
            }
            return position;
        },

        getY: function (coordinate, toHalf) {
            var position = (coordinate - this.paintPosition.y)*this.scale;
            if (toHalf) {
                return Math.floor(position)+0.5;
            }
            return position;
        },

        getAbsolute: function (value) {
            return value*this.scale;
        },

        getAbsoluteMaxMin: function (value, max, min) {
            var calculatedValue = Math.round(value*this.scale);
            if (min !== null && calculatedValue < min) {
                calculatedValue = min;
            }
            if (max !== null && calculatedValue > max) {
                calculatedValue = max;
            }
            return calculatedValue;
        },

        getAbsoluteFactor: function (value) {
            return value/this.scale;
        },

        attachResizeEvent : function() {
            var self = this;
            $(window).resize(function() {
                self.resize();
            });
        },

        getCanvasSize: function () {
            return {
                width: this.canvas.width,
                height: this.canvas.height
            }
        },

        setCanvasSize: function () {
            this.canvas.width = this.painterDivSelector.width();
            this.canvas.height = this.painterDivSelector.height();
        },

        resize: function () {
            this.setCanvasSize();
            this.paint();
        },

        getScale: function () {
            return this.scale;
        },

        setVisibleRect: function (minX, maxX, minY, maxY) {
            var rectWidth = maxX - minX,
                rectHeight = maxY - minY;

            var ratioY = this.canvas.height/rectHeight;
            var ratioX = this.canvas.width/rectWidth;
            var minimalRatio = Math.min(ratioX, ratioY);

            this.scale = minimalRatio;
            this.paintPosition.x = Math.round(minX + rectWidth/2 - (this.canvas.width)/this.scale/2);
            this.paintPosition.y = Math.round(minY + rectHeight/2 - (this.canvas.height)/this.scale/2);
        }

    }, {
        DEFAULT_ZOOM_IN: 1.07,
        DEFAULT_ZOOM_OUT: 1/1.07
    });

})(jQuery);
