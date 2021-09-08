(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('rxjs'), require('@angular/core')) :
    typeof define === 'function' && define.amd ? define('angular2-draggable', ['exports', 'rxjs', '@angular/core'], factory) :
    (factory((global['angular2-draggable'] = {}),global.rxjs,global.ng.core));
}(this, (function (exports,rxjs,core) { 'use strict';

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    var Position = /** @class */ (function () {
        function Position(x, y) {
            this.x = x;
            this.y = y;
        }
        /**
         * @param {?} e
         * @param {?=} el
         * @return {?}
         */
        Position.fromEvent = /**
         * @param {?} e
         * @param {?=} el
         * @return {?}
         */
            function (e, el) {
                if (el === void 0) {
                    el = null;
                }
                /**
                 * Fix issue: Resize doesn't work on Windows10 IE11 (and on some windows 7 IE11)
                 * https://github.com/xieziyu/angular2-draggable/issues/164
                 * e instanceof MouseEvent check returns false on IE11
                 */
                if (this.isMouseEvent(e)) {
                    return new Position(e.clientX, e.clientY);
                }
                else {
                    if (el === null || e.changedTouches.length === 1) {
                        return new Position(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
                    }
                    /**
                     * Fix issue: Multiple phone draggables at the same time
                     * https://github.com/xieziyu/angular2-draggable/issues/128
                     */
                    for (var i = 0; i < e.changedTouches.length; i++) {
                        if (e.changedTouches[i].target === el) {
                            return new Position(e.changedTouches[i].clientX, e.changedTouches[i].clientY);
                        }
                    }
                }
            };
        /**
         * @param {?} e
         * @return {?}
         */
        Position.isMouseEvent = /**
         * @param {?} e
         * @return {?}
         */
            function (e) {
                return Object.prototype.toString.apply(e).indexOf('MouseEvent') === 8;
            };
        /**
         * @param {?} obj
         * @return {?}
         */
        Position.isIPosition = /**
         * @param {?} obj
         * @return {?}
         */
            function (obj) {
                return !!obj && ('x' in obj) && ('y' in obj);
            };
        /**
         * @param {?} el
         * @return {?}
         */
        Position.getCurrent = /**
         * @param {?} el
         * @return {?}
         */
            function (el) {
                /** @type {?} */
                var pos = new Position(0, 0);
                if (window) {
                    /** @type {?} */
                    var computed = window.getComputedStyle(el);
                    if (computed) {
                        /** @type {?} */
                        var x = parseInt(computed.getPropertyValue('left'), 10);
                        /** @type {?} */
                        var y = parseInt(computed.getPropertyValue('top'), 10);
                        pos.x = isNaN(x) ? 0 : x;
                        pos.y = isNaN(y) ? 0 : y;
                    }
                    return pos;
                }
                else {
                    console.error('Not Supported!');
                    return null;
                }
            };
        /**
         * @param {?} p
         * @return {?}
         */
        Position.copy = /**
         * @param {?} p
         * @return {?}
         */
            function (p) {
                return new Position(0, 0).set(p);
            };
        Object.defineProperty(Position.prototype, "value", {
            get: /**
             * @return {?}
             */ function () {
                return { x: this.x, y: this.y };
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @template THIS
         * @this {THIS}
         * @param {?} p
         * @return {THIS}
         */
        Position.prototype.add = /**
         * @template THIS
         * @this {THIS}
         * @param {?} p
         * @return {THIS}
         */
            function (p) {
                ( /** @type {?} */(this)).x += p.x;
                ( /** @type {?} */(this)).y += p.y;
                return ( /** @type {?} */(this));
            };
        /**
         * @template THIS
         * @this {THIS}
         * @param {?} p
         * @return {THIS}
         */
        Position.prototype.subtract = /**
         * @template THIS
         * @this {THIS}
         * @param {?} p
         * @return {THIS}
         */
            function (p) {
                ( /** @type {?} */(this)).x -= p.x;
                ( /** @type {?} */(this)).y -= p.y;
                return ( /** @type {?} */(this));
            };
        /**
         * @param {?} n
         * @return {?}
         */
        Position.prototype.multiply = /**
         * @param {?} n
         * @return {?}
         */
            function (n) {
                this.x *= n;
                this.y *= n;
            };
        /**
         * @param {?} n
         * @return {?}
         */
        Position.prototype.divide = /**
         * @param {?} n
         * @return {?}
         */
            function (n) {
                this.x /= n;
                this.y /= n;
            };
        /**
         * @template THIS
         * @this {THIS}
         * @return {THIS}
         */
        Position.prototype.reset = /**
         * @template THIS
         * @this {THIS}
         * @return {THIS}
         */
            function () {
                ( /** @type {?} */(this)).x = 0;
                ( /** @type {?} */(this)).y = 0;
                return ( /** @type {?} */(this));
            };
        /**
         * @template THIS
         * @this {THIS}
         * @param {?} p
         * @return {THIS}
         */
        Position.prototype.set = /**
         * @template THIS
         * @this {THIS}
         * @param {?} p
         * @return {THIS}
         */
            function (p) {
                ( /** @type {?} */(this)).x = p.x;
                ( /** @type {?} */(this)).y = p.y;
                return ( /** @type {?} */(this));
            };
        return Position;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    var HelperBlock = /** @class */ (function () {
        function HelperBlock(parent, renderer) {
            this.parent = parent;
            this.renderer = renderer;
            this._added = false;
            // generate helper div
            /** @type {?} */
            var helper = renderer.createElement('div');
            renderer.setStyle(helper, 'position', 'absolute');
            renderer.setStyle(helper, 'width', '100%');
            renderer.setStyle(helper, 'height', '100%');
            renderer.setStyle(helper, 'background-color', 'transparent');
            renderer.setStyle(helper, 'top', '0');
            renderer.setStyle(helper, 'left', '0');
            // done
            this._helper = helper;
        }
        /**
         * @return {?}
         */
        HelperBlock.prototype.add = /**
         * @return {?}
         */
            function () {
                // append div to parent
                if (this.parent && !this._added) {
                    this.parent.appendChild(this._helper);
                    this._added = true;
                }
            };
        /**
         * @return {?}
         */
        HelperBlock.prototype.remove = /**
         * @return {?}
         */
            function () {
                if (this.parent && this._added) {
                    this.parent.removeChild(this._helper);
                    this._added = false;
                }
            };
        /**
         * @return {?}
         */
        HelperBlock.prototype.dispose = /**
         * @return {?}
         */
            function () {
                this._helper = null;
                this._added = false;
            };
        Object.defineProperty(HelperBlock.prototype, "el", {
            get: /**
             * @return {?}
             */ function () {
                return this._helper;
            },
            enumerable: true,
            configurable: true
        });
        return HelperBlock;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    var AngularDraggableDirective = /** @class */ (function () {
        function AngularDraggableDirective(el, renderer) {
            this.el = el;
            this.renderer = renderer;
            this.allowDrag = true;
            this.moving = false;
            this.orignal = null;
            this.oldTrans = new Position(0, 0);
            this.tempTrans = new Position(0, 0);
            this.currTrans = new Position(0, 0);
            this.oldZIndex = '';
            this._zIndex = '';
            this.needTransform = false;
            this.draggingSub = null;
            /**
             * Bugfix: iFrames, and context unrelated elements block all events, and are unusable
             * https://github.com/xieziyu/angular2-draggable/issues/84
             */
            this._helperBlock = null;
            this.started = new core.EventEmitter();
            this.stopped = new core.EventEmitter();
            this.edge = new core.EventEmitter();
            /**
             * List of allowed out of bounds edges *
             */
            this.outOfBounds = {
                top: false,
                right: false,
                bottom: false,
                left: false
            };
            /**
             * Round the position to nearest grid
             */
            this.gridSize = 1;
            /**
             * Whether to limit the element stay in the bounds
             */
            this.inBounds = false;
            /**
             * Whether the element should use it's previous drag position on a new drag event.
             */
            this.trackPosition = true;
            /**
             * Input css scale transform of element so translations are correct
             */
            this.scale = 1;
            /**
             * Whether to prevent default event
             */
            this.preventDefaultEvent = false;
            /**
             * Set initial position by offsets
             */
            this.position = { x: 0, y: 0 };
            /**
             * Lock axis: 'x' or 'y'
             */
            this.lockAxis = null;
            /**
             * Emit position offsets when moving
             */
            this.movingOffset = new core.EventEmitter();
            /**
             * Emit position offsets when put back
             */
            this.endOffset = new core.EventEmitter();
            this._helperBlock = new HelperBlock(el.nativeElement, renderer);
        }
        Object.defineProperty(AngularDraggableDirective.prototype, "zIndex", {
            /** Set z-index when not dragging */
            set: /**
             * Set z-index when not dragging
             * @param {?} setting
             * @return {?}
             */ function (setting) {
                this.renderer.setStyle(this.el.nativeElement, 'z-index', setting);
                this._zIndex = setting;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(AngularDraggableDirective.prototype, "ngDraggable", {
            set: /**
             * @param {?} setting
             * @return {?}
             */ function (setting) {
                if (setting !== undefined && setting !== null && setting !== '') {
                    this.allowDrag = !!setting;
                    /** @type {?} */
                    var element = this.getDragEl();
                    if (this.allowDrag) {
                        this.renderer.addClass(element, 'ng-draggable');
                    }
                    else {
                        this.putBack();
                        this.renderer.removeClass(element, 'ng-draggable');
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @return {?}
         */
        AngularDraggableDirective.prototype.ngOnInit = /**
         * @return {?}
         */
            function () {
                if (this.allowDrag) {
                    /** @type {?} */
                    var element = this.getDragEl();
                    this.renderer.addClass(element, 'ng-draggable');
                }
                this.resetPosition();
            };
        /**
         * @return {?}
         */
        AngularDraggableDirective.prototype.ngOnDestroy = /**
         * @return {?}
         */
            function () {
                this.bounds = null;
                this.handle = null;
                this.orignal = null;
                this.oldTrans = null;
                this.tempTrans = null;
                this.currTrans = null;
                this._helperBlock.dispose();
                this._helperBlock = null;
                if (this.draggingSub) {
                    this.draggingSub.unsubscribe();
                }
            };
        /**
         * @param {?} changes
         * @return {?}
         */
        AngularDraggableDirective.prototype.ngOnChanges = /**
         * @param {?} changes
         * @return {?}
         */
            function (changes) {
                if (changes['position'] && !changes['position'].isFirstChange()) {
                    /** @type {?} */
                    var p = changes['position'].currentValue;
                    if (!this.moving) {
                        if (Position.isIPosition(p)) {
                            this.oldTrans.set(p);
                        }
                        else {
                            this.oldTrans.reset();
                        }
                        this.transform();
                    }
                    else {
                        this.needTransform = true;
                    }
                }
            };
        /**
         * @return {?}
         */
        AngularDraggableDirective.prototype.ngAfterViewInit = /**
         * @return {?}
         */
            function () {
                if (this.inBounds) {
                    this.boundsCheck();
                    this.oldTrans.add(this.tempTrans);
                    this.tempTrans.reset();
                }
            };
        /**
         * @private
         * @return {?}
         */
        AngularDraggableDirective.prototype.getDragEl = /**
         * @private
         * @return {?}
         */
            function () {
                return this.handle ? this.handle : this.el.nativeElement;
            };
        /**
         * @return {?}
         */
        AngularDraggableDirective.prototype.resetPosition = /**
         * @return {?}
         */
            function () {
                if (Position.isIPosition(this.position)) {
                    this.oldTrans.set(this.position);
                }
                else {
                    this.oldTrans.reset();
                }
                this.tempTrans.reset();
                this.transform();
            };
        /**
         * @private
         * @param {?} p
         * @return {?}
         */
        AngularDraggableDirective.prototype.moveTo = /**
         * @private
         * @param {?} p
         * @return {?}
         */
            function (p) {
                if (this.orignal) {
                    p.subtract(this.orignal);
                    this.tempTrans.set(p);
                    this.tempTrans.divide(this.scale);
                    this.transform();
                    if (this.bounds) {
                        this.edge.emit(this.boundsCheck());
                    }
                    this.movingOffset.emit(this.currTrans.value);
                }
            };
        /**
         * @private
         * @return {?}
         */
        AngularDraggableDirective.prototype.transform = /**
         * @private
         * @return {?}
         */
            function () {
                /** @type {?} */
                var translateX = this.tempTrans.x + this.oldTrans.x;
                /** @type {?} */
                var translateY = this.tempTrans.y + this.oldTrans.y;
                if (this.lockAxis === 'x') {
                    translateX = this.oldTrans.x;
                    this.tempTrans.x = 0;
                }
                else if (this.lockAxis === 'y') {
                    translateY = this.oldTrans.y;
                    this.tempTrans.y = 0;
                }
                // Snap to grid: by grid size
                if (this.gridSize > 1) {
                    translateX = Math.round(translateX / this.gridSize) * this.gridSize;
                    translateY = Math.round(translateY / this.gridSize) * this.gridSize;
                }
                /** @type {?} */
                var value = "translate(" + Math.round(translateX) + "px, " + Math.round(translateY) + "px)";
                this.renderer.setStyle(this.el.nativeElement, 'transform', value);
                this.renderer.setStyle(this.el.nativeElement, '-webkit-transform', value);
                this.renderer.setStyle(this.el.nativeElement, '-ms-transform', value);
                this.renderer.setStyle(this.el.nativeElement, '-moz-transform', value);
                this.renderer.setStyle(this.el.nativeElement, '-o-transform', value);
                // save current position
                this.currTrans.x = translateX;
                this.currTrans.y = translateY;
            };
        /**
         * @private
         * @return {?}
         */
        AngularDraggableDirective.prototype.pickUp = /**
         * @private
         * @return {?}
         */
            function () {
                // get old z-index:
                this.oldZIndex = this.el.nativeElement.style.zIndex ? this.el.nativeElement.style.zIndex : '';
                if (window) {
                    this.oldZIndex = window.getComputedStyle(this.el.nativeElement, null).getPropertyValue('z-index');
                }
                if (this.zIndexMoving) {
                    this.renderer.setStyle(this.el.nativeElement, 'z-index', this.zIndexMoving);
                }
                if (!this.moving) {
                    this.started.emit(this.el.nativeElement);
                    this.moving = true;
                    /** @type {?} */
                    var element = this.getDragEl();
                    this.renderer.addClass(element, 'ng-dragging');
                    /**
                     * Fix performance issue:
                     * https://github.com/xieziyu/angular2-draggable/issues/112
                     */
                    this.subscribeEvents();
                }
            };
        /**
         * @private
         * @return {?}
         */
        AngularDraggableDirective.prototype.subscribeEvents = /**
         * @private
         * @return {?}
         */
            function () {
                var _this = this;
                this.draggingSub = rxjs.fromEvent(document, 'mousemove', { passive: false }).subscribe(function (event) { return _this.onMouseMove(( /** @type {?} */(event))); });
                this.draggingSub.add(rxjs.fromEvent(document, 'touchmove', { passive: false }).subscribe(function (event) { return _this.onMouseMove(( /** @type {?} */(event))); }));
                this.draggingSub.add(rxjs.fromEvent(document, 'mouseup', { passive: false }).subscribe(function () { return _this.putBack(); }));
                // checking if browser is IE or Edge - https://github.com/xieziyu/angular2-draggable/issues/153
                /** @type {?} */
                var isIEOrEdge = /msie\s|trident\//i.test(window.navigator.userAgent);
                if (!isIEOrEdge) {
                    this.draggingSub.add(rxjs.fromEvent(document, 'mouseleave', { passive: false }).subscribe(function () { return _this.putBack(); }));
                }
                this.draggingSub.add(rxjs.fromEvent(document, 'touchend', { passive: false }).subscribe(function () { return _this.putBack(); }));
                this.draggingSub.add(rxjs.fromEvent(document, 'touchcancel', { passive: false }).subscribe(function () { return _this.putBack(); }));
            };
        /**
         * @private
         * @return {?}
         */
        AngularDraggableDirective.prototype.unsubscribeEvents = /**
         * @private
         * @return {?}
         */
            function () {
                this.draggingSub.unsubscribe();
                this.draggingSub = null;
            };
        /**
         * @return {?}
         */
        AngularDraggableDirective.prototype.boundsCheck = /**
         * @return {?}
         */
            function () {
                if (this.bounds) {
                    /** @type {?} */
                    var boundary = this.bounds.getBoundingClientRect();
                    /** @type {?} */
                    var elem = this.el.nativeElement.getBoundingClientRect();
                    /** @type {?} */
                    var result = {
                        'top': this.outOfBounds.top ? true : boundary.top < elem.top,
                        'right': this.outOfBounds.right ? true : boundary.right > elem.right,
                        'bottom': this.outOfBounds.bottom ? true : boundary.bottom > elem.bottom,
                        'left': this.outOfBounds.left ? true : boundary.left < elem.left
                    };
                    if (this.inBounds) {
                        if (!result.top) {
                            this.tempTrans.y -= (elem.top - boundary.top) / this.scale;
                        }
                        if (!result.bottom) {
                            this.tempTrans.y -= (elem.bottom - boundary.bottom) / this.scale;
                        }
                        if (!result.right) {
                            this.tempTrans.x -= (elem.right - boundary.right) / this.scale;
                        }
                        if (!result.left) {
                            this.tempTrans.x -= (elem.left - boundary.left) / this.scale;
                        }
                        this.transform();
                    }
                    return result;
                }
            };
        /** Get current offset */
        /**
         * Get current offset
         * @return {?}
         */
        AngularDraggableDirective.prototype.getCurrentOffset = /**
         * Get current offset
         * @return {?}
         */
            function () {
                return this.currTrans.value;
            };
        /**
         * @private
         * @return {?}
         */
        AngularDraggableDirective.prototype.putBack = /**
         * @private
         * @return {?}
         */
            function () {
                if (this._zIndex) {
                    this.renderer.setStyle(this.el.nativeElement, 'z-index', this._zIndex);
                }
                else if (this.zIndexMoving) {
                    if (this.oldZIndex) {
                        this.renderer.setStyle(this.el.nativeElement, 'z-index', this.oldZIndex);
                    }
                    else {
                        this.el.nativeElement.style.removeProperty('z-index');
                    }
                }
                if (this.moving) {
                    this.stopped.emit(this.el.nativeElement);
                    // Remove the helper div:
                    this._helperBlock.remove();
                    if (this.needTransform) {
                        if (Position.isIPosition(this.position)) {
                            this.oldTrans.set(this.position);
                        }
                        else {
                            this.oldTrans.reset();
                        }
                        this.transform();
                        this.needTransform = false;
                    }
                    if (this.bounds) {
                        this.edge.emit(this.boundsCheck());
                    }
                    this.moving = false;
                    this.endOffset.emit(this.currTrans.value);
                    if (this.trackPosition) {
                        this.oldTrans.add(this.tempTrans);
                    }
                    this.tempTrans.reset();
                    if (!this.trackPosition) {
                        this.transform();
                    }
                    /** @type {?} */
                    var element = this.getDragEl();
                    this.renderer.removeClass(element, 'ng-dragging');
                    /**
                     * Fix performance issue:
                     * https://github.com/xieziyu/angular2-draggable/issues/112
                     */
                    this.unsubscribeEvents();
                }
            };
        /**
         * @param {?} target
         * @param {?} element
         * @return {?}
         */
        AngularDraggableDirective.prototype.checkHandleTarget = /**
         * @param {?} target
         * @param {?} element
         * @return {?}
         */
            function (target, element) {
                // Checks if the target is the element clicked, then checks each child element of element as well
                // Ignores button clicks
                // Ignore elements of type button
                if (element.tagName === 'BUTTON') {
                    return false;
                }
                // If the target was found, return true (handle was found)
                if (element === target) {
                    return true;
                }
                // Recursively iterate this elements children
                for (var child in element.children) {
                    if (element.children.hasOwnProperty(child)) {
                        if (this.checkHandleTarget(target, element.children[child])) {
                            return true;
                        }
                    }
                }
                // Handle was not found in this lineage
                // Note: return false is ignore unless it is the parent element
                return false;
            };
        /**
         * @param {?} event
         * @return {?}
         */
        AngularDraggableDirective.prototype.onMouseDown = /**
         * @param {?} event
         * @return {?}
         */
            function (event) {
                // 1. skip right click;
                if (event instanceof MouseEvent && event.button === 2) {
                    return;
                }
                // 2. if handle is set, the element can only be moved by handle
                /** @type {?} */
                var target = event.target || event.srcElement;
                if (this.handle !== undefined && !this.checkHandleTarget(target, this.handle)) {
                    return;
                }
                // 3. if allow drag is set to false, ignore the mousedown
                if (this.allowDrag === false) {
                    return;
                }
                if (this.preventDefaultEvent) {
                    event.stopPropagation();
                    event.preventDefault();
                }
                this.orignal = Position.fromEvent(event, this.getDragEl());
                this.pickUp();
            };
        /**
         * @param {?} event
         * @return {?}
         */
        AngularDraggableDirective.prototype.onMouseMove = /**
         * @param {?} event
         * @return {?}
         */
            function (event) {
                if (this.moving && this.allowDrag) {
                    if (this.preventDefaultEvent) {
                        event.stopPropagation();
                        event.preventDefault();
                    }
                    // Add a transparent helper div:
                    this._helperBlock.add();
                    this.moveTo(Position.fromEvent(event, this.getDragEl()));
                }
            };
        AngularDraggableDirective.decorators = [
            { type: core.Directive, args: [{
                        selector: '[ngDraggable]',
                        exportAs: 'ngDraggable'
                    },] }
        ];
        /** @nocollapse */
        AngularDraggableDirective.ctorParameters = function () {
            return [
                { type: core.ElementRef },
                { type: core.Renderer2 }
            ];
        };
        AngularDraggableDirective.propDecorators = {
            started: [{ type: core.Output }],
            stopped: [{ type: core.Output }],
            edge: [{ type: core.Output }],
            handle: [{ type: core.Input }],
            bounds: [{ type: core.Input }],
            outOfBounds: [{ type: core.Input }],
            gridSize: [{ type: core.Input }],
            zIndexMoving: [{ type: core.Input }],
            zIndex: [{ type: core.Input }],
            inBounds: [{ type: core.Input }],
            trackPosition: [{ type: core.Input }],
            scale: [{ type: core.Input }],
            preventDefaultEvent: [{ type: core.Input }],
            position: [{ type: core.Input }],
            lockAxis: [{ type: core.Input }],
            movingOffset: [{ type: core.Output }],
            endOffset: [{ type: core.Output }],
            ngDraggable: [{ type: core.Input }],
            onMouseDown: [{ type: core.HostListener, args: ['mousedown', ['$event'],] }, { type: core.HostListener, args: ['touchstart', ['$event'],] }]
        };
        return AngularDraggableDirective;
    }());

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */
    var __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s)
                if (Object.prototype.hasOwnProperty.call(s, p))
                    t[p] = s[p];
        }
        return t;
    };
    function __values(o) {
        var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
        if (m)
            return m.call(o);
        return {
            next: function () {
                if (o && i >= o.length)
                    o = void 0;
                return { value: o && o[i++], done: !o };
            }
        };
    }

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    var ResizeHandle = /** @class */ (function () {
        function ResizeHandle(parent, renderer, type, css, onMouseDown) {
            var _this = this;
            this.parent = parent;
            this.renderer = renderer;
            this.type = type;
            this.css = css;
            this.onMouseDown = onMouseDown;
            // generate handle div
            /** @type {?} */
            var handle = renderer.createElement('div');
            renderer.addClass(handle, 'ng-resizable-handle');
            renderer.addClass(handle, css);
            // add default diagonal for se handle
            if (type === 'se') {
                renderer.addClass(handle, 'ng-resizable-diagonal');
            }
            // append div to parent
            if (this.parent) {
                parent.appendChild(handle);
            }
            // create and register event listener
            this._onResize = function (event) { onMouseDown(event, _this); };
            handle.addEventListener('mousedown', this._onResize, { passive: false });
            handle.addEventListener('touchstart', this._onResize, { passive: false });
            // done
            this._handle = handle;
        }
        /**
         * @return {?}
         */
        ResizeHandle.prototype.dispose = /**
         * @return {?}
         */
            function () {
                this._handle.removeEventListener('mousedown', this._onResize);
                this._handle.removeEventListener('touchstart', this._onResize);
                if (this.parent) {
                    this.parent.removeChild(this._handle);
                }
                this._handle = null;
                this._onResize = null;
            };
        Object.defineProperty(ResizeHandle.prototype, "el", {
            get: /**
             * @return {?}
             */ function () {
                return this._handle;
            },
            enumerable: true,
            configurable: true
        });
        return ResizeHandle;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    var Size = /** @class */ (function () {
        function Size(width, height) {
            this.width = width;
            this.height = height;
        }
        /**
         * @param {?} el
         * @return {?}
         */
        Size.getCurrent = /**
         * @param {?} el
         * @return {?}
         */
            function (el) {
                /** @type {?} */
                var size = new Size(0, 0);
                if (window) {
                    /** @type {?} */
                    var computed = window.getComputedStyle(el);
                    if (computed) {
                        size.width = parseInt(computed.getPropertyValue('width'), 10);
                        size.height = parseInt(computed.getPropertyValue('height'), 10);
                    }
                    return size;
                }
                else {
                    console.error('Not Supported!');
                    return null;
                }
            };
        /**
         * @param {?} s
         * @return {?}
         */
        Size.copy = /**
         * @param {?} s
         * @return {?}
         */
            function (s) {
                return new Size(0, 0).set(s);
            };
        /**
         * @template THIS
         * @this {THIS}
         * @param {?} s
         * @return {THIS}
         */
        Size.prototype.set = /**
         * @template THIS
         * @this {THIS}
         * @param {?} s
         * @return {THIS}
         */
            function (s) {
                ( /** @type {?} */(this)).width = s.width;
                ( /** @type {?} */(this)).height = s.height;
                return ( /** @type {?} */(this));
            };
        return Size;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    var AngularResizableDirective = /** @class */ (function () {
        function AngularResizableDirective(el, renderer) {
            this.el = el;
            this.renderer = renderer;
            this._resizable = true;
            this._handles = {};
            this._handleType = [];
            this._handleResizing = null;
            this._direction = null;
            this._directionChanged = null;
            this._aspectRatio = 0;
            this._containment = null;
            this._origMousePos = null;
            /**
             * Original Size and Position
             */
            this._origSize = null;
            this._origPos = null;
            /**
             * Current Size and Position
             */
            this._currSize = null;
            this._currPos = null;
            /**
             * Initial Size and Position
             */
            this._initSize = null;
            this._initPos = null;
            /**
             * Snap to gird
             */
            this._gridSize = null;
            this._bounding = null;
            /**
             * Bugfix: iFrames, and context unrelated elements block all events, and are unusable
             * https://github.com/xieziyu/angular2-draggable/issues/84
             */
            this._helperBlock = null;
            this.draggingSub = null;
            this._adjusted = false;
            /**
             * Which handles can be used for resizing.
             * \@example
             * [rzHandles] = "'n,e,s,w,se,ne,sw,nw'"
             * equals to: [rzHandles] = "'all'"
             *
             *
             */
            this.rzHandles = 'e,s,se';
            /**
             * Whether the element should be constrained to a specific aspect ratio.
             *  Multiple types supported:
             *  boolean: When set to true, the element will maintain its original aspect ratio.
             *  number: Force the element to maintain a specific aspect ratio during resizing.
             */
            this.rzAspectRatio = false;
            /**
             * Constrains resizing to within the bounds of the specified element or region.
             *  Multiple types supported:
             *  Selector: The resizable element will be contained to the bounding box of the first element found by the selector.
             *            If no element is found, no containment will be set.
             *  Element: The resizable element will be contained to the bounding box of this element.
             *  String: Possible values: "parent".
             */
            this.rzContainment = null;
            /**
             * Snaps the resizing element to a grid, every x and y pixels.
             * A number for both width and height or an array values like [ x, y ]
             */
            this.rzGrid = null;
            /**
             * The minimum width the resizable should be allowed to resize to.
             */
            this.rzMinWidth = null;
            /**
             * The minimum height the resizable should be allowed to resize to.
             */
            this.rzMinHeight = null;
            /**
             * The maximum width the resizable should be allowed to resize to.
             */
            this.rzMaxWidth = null;
            /**
             * The maximum height the resizable should be allowed to resize to.
             */
            this.rzMaxHeight = null;
            /**
             * Whether to prevent default event
             */
            this.preventDefaultEvent = true;
            /**
             * emitted when start resizing
             */
            this.rzStart = new core.EventEmitter();
            /**
             * emitted when start resizing
             */
            this.rzResizing = new core.EventEmitter();
            /**
             * emitted when stop resizing
             */
            this.rzStop = new core.EventEmitter();
            this._helperBlock = new HelperBlock(el.nativeElement, renderer);
        }
        Object.defineProperty(AngularResizableDirective.prototype, "ngResizable", {
            /** Disables the resizable if set to false. */
            set: /**
             * Disables the resizable if set to false.
             * @param {?} v
             * @return {?}
             */ function (v) {
                if (v !== undefined && v !== null && v !== '') {
                    this._resizable = !!v;
                    this.updateResizable();
                }
            },
            enumerable: true,
            configurable: true
        });
        /**
         * @param {?} changes
         * @return {?}
         */
        AngularResizableDirective.prototype.ngOnChanges = /**
         * @param {?} changes
         * @return {?}
         */
            function (changes) {
                if (changes['rzHandles'] && !changes['rzHandles'].isFirstChange()) {
                    this.updateResizable();
                }
                if (changes['rzAspectRatio'] && !changes['rzAspectRatio'].isFirstChange()) {
                    this.updateAspectRatio();
                }
                if (changes['rzContainment'] && !changes['rzContainment'].isFirstChange()) {
                    this.updateContainment();
                }
            };
        /**
         * @return {?}
         */
        AngularResizableDirective.prototype.ngOnInit = /**
         * @return {?}
         */
            function () {
                this.updateResizable();
            };
        /**
         * @return {?}
         */
        AngularResizableDirective.prototype.ngOnDestroy = /**
         * @return {?}
         */
            function () {
                this.removeHandles();
                this._containment = null;
                this._helperBlock.dispose();
                this._helperBlock = null;
            };
        /**
         * @return {?}
         */
        AngularResizableDirective.prototype.ngAfterViewInit = /**
         * @return {?}
         */
            function () {
                /** @type {?} */
                var elm = this.el.nativeElement;
                this._initSize = Size.getCurrent(elm);
                this._initPos = Position.getCurrent(elm);
                this._currSize = Size.copy(this._initSize);
                this._currPos = Position.copy(this._initPos);
                this.updateAspectRatio();
                this.updateContainment();
            };
        /** A method to reset size */
        /**
         * A method to reset size
         * @return {?}
         */
        AngularResizableDirective.prototype.resetSize = /**
         * A method to reset size
         * @return {?}
         */
            function () {
                this._currSize = Size.copy(this._initSize);
                this._currPos = Position.copy(this._initPos);
                this.doResize();
            };
        /** A method to get current status */
        /**
         * A method to get current status
         * @return {?}
         */
        AngularResizableDirective.prototype.getStatus = /**
         * A method to get current status
         * @return {?}
         */
            function () {
                if (!this._currPos || !this._currSize) {
                    return null;
                }
                return {
                    size: {
                        width: this._currSize.width,
                        height: this._currSize.height
                    },
                    position: {
                        top: this._currPos.y,
                        left: this._currPos.x
                    }
                };
            };
        /**
         * @private
         * @return {?}
         */
        AngularResizableDirective.prototype.updateResizable = /**
         * @private
         * @return {?}
         */
            function () {
                /** @type {?} */
                var element = this.el.nativeElement;
                // clear handles:
                this.renderer.removeClass(element, 'ng-resizable');
                this.removeHandles();
                // create new ones:
                if (this._resizable) {
                    this.renderer.addClass(element, 'ng-resizable');
                    this.createHandles();
                }
            };
        /** Use it to update aspect */
        /**
         * Use it to update aspect
         * @private
         * @return {?}
         */
        AngularResizableDirective.prototype.updateAspectRatio = /**
         * Use it to update aspect
         * @private
         * @return {?}
         */
            function () {
                if (typeof this.rzAspectRatio === 'boolean') {
                    if (this.rzAspectRatio && this._currSize.height) {
                        this._aspectRatio = (this._currSize.width / this._currSize.height);
                    }
                    else {
                        this._aspectRatio = 0;
                    }
                }
                else {
                    /** @type {?} */
                    var r = Number(this.rzAspectRatio);
                    this._aspectRatio = isNaN(r) ? 0 : r;
                }
            };
        /** Use it to update containment */
        /**
         * Use it to update containment
         * @private
         * @return {?}
         */
        AngularResizableDirective.prototype.updateContainment = /**
         * Use it to update containment
         * @private
         * @return {?}
         */
            function () {
                if (!this.rzContainment) {
                    this._containment = null;
                    return;
                }
                if (typeof this.rzContainment === 'string') {
                    if (this.rzContainment === 'parent') {
                        this._containment = this.el.nativeElement.parentElement;
                    }
                    else {
                        this._containment = document.querySelector(this.rzContainment);
                    }
                }
                else {
                    this._containment = this.rzContainment;
                }
            };
        /** Use it to create handle divs */
        /**
         * Use it to create handle divs
         * @private
         * @return {?}
         */
        AngularResizableDirective.prototype.createHandles = /**
         * Use it to create handle divs
         * @private
         * @return {?}
         */
            function () {
                var e_1, _a, e_2, _b;
                if (!this.rzHandles) {
                    return;
                }
                /** @type {?} */
                var tmpHandleTypes;
                if (typeof this.rzHandles === 'string') {
                    if (this.rzHandles === 'all') {
                        tmpHandleTypes = ['n', 'e', 's', 'w', 'ne', 'se', 'nw', 'sw'];
                    }
                    else {
                        tmpHandleTypes = this.rzHandles.replace(/ /g, '').toLowerCase().split(',');
                    }
                    try {
                        for (var tmpHandleTypes_1 = __values(tmpHandleTypes), tmpHandleTypes_1_1 = tmpHandleTypes_1.next(); !tmpHandleTypes_1_1.done; tmpHandleTypes_1_1 = tmpHandleTypes_1.next()) {
                            var type = tmpHandleTypes_1_1.value;
                            // default handle theme: ng-resizable-$type.
                            /** @type {?} */
                            var handle = this.createHandleByType(type, "ng-resizable-" + type);
                            if (handle) {
                                this._handleType.push(type);
                                this._handles[type] = handle;
                            }
                        }
                    }
                    catch (e_1_1) {
                        e_1 = { error: e_1_1 };
                    }
                    finally {
                        try {
                            if (tmpHandleTypes_1_1 && !tmpHandleTypes_1_1.done && (_a = tmpHandleTypes_1.return))
                                _a.call(tmpHandleTypes_1);
                        }
                        finally {
                            if (e_1)
                                throw e_1.error;
                        }
                    }
                }
                else {
                    tmpHandleTypes = Object.keys(this.rzHandles);
                    try {
                        for (var tmpHandleTypes_2 = __values(tmpHandleTypes), tmpHandleTypes_2_1 = tmpHandleTypes_2.next(); !tmpHandleTypes_2_1.done; tmpHandleTypes_2_1 = tmpHandleTypes_2.next()) {
                            var type = tmpHandleTypes_2_1.value;
                            // custom handle theme.
                            /** @type {?} */
                            var handle = this.createHandleByType(type, this.rzHandles[type]);
                            if (handle) {
                                this._handleType.push(type);
                                this._handles[type] = handle;
                            }
                        }
                    }
                    catch (e_2_1) {
                        e_2 = { error: e_2_1 };
                    }
                    finally {
                        try {
                            if (tmpHandleTypes_2_1 && !tmpHandleTypes_2_1.done && (_b = tmpHandleTypes_2.return))
                                _b.call(tmpHandleTypes_2);
                        }
                        finally {
                            if (e_2)
                                throw e_2.error;
                        }
                    }
                }
            };
        /** Use it to create a handle */
        /**
         * Use it to create a handle
         * @private
         * @param {?} type
         * @param {?} css
         * @return {?}
         */
        AngularResizableDirective.prototype.createHandleByType = /**
         * Use it to create a handle
         * @private
         * @param {?} type
         * @param {?} css
         * @return {?}
         */
            function (type, css) {
                /** @type {?} */
                var _el = this.el.nativeElement;
                if (!type.match(/^(se|sw|ne|nw|n|e|s|w)$/)) {
                    console.error('Invalid handle type:', type);
                    return null;
                }
                return new ResizeHandle(_el, this.renderer, type, css, this.onMouseDown.bind(this));
            };
        /**
         * @private
         * @return {?}
         */
        AngularResizableDirective.prototype.removeHandles = /**
         * @private
         * @return {?}
         */
            function () {
                var e_3, _a;
                try {
                    for (var _b = __values(this._handleType), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var type = _c.value;
                        this._handles[type].dispose();
                    }
                }
                catch (e_3_1) {
                    e_3 = { error: e_3_1 };
                }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return))
                            _a.call(_b);
                    }
                    finally {
                        if (e_3)
                            throw e_3.error;
                    }
                }
                this._handleType = [];
                this._handles = {};
            };
        /**
         * @param {?} event
         * @param {?} handle
         * @return {?}
         */
        AngularResizableDirective.prototype.onMouseDown = /**
         * @param {?} event
         * @param {?} handle
         * @return {?}
         */
            function (event, handle) {
                // skip right click;
                if (event instanceof MouseEvent && event.button === 2) {
                    return;
                }
                if (this.preventDefaultEvent) {
                    // prevent default events
                    event.stopPropagation();
                    event.preventDefault();
                }
                if (!this._handleResizing) {
                    this._origMousePos = Position.fromEvent(event);
                    this.startResize(handle);
                    this.subscribeEvents();
                }
            };
        /**
         * @private
         * @return {?}
         */
        AngularResizableDirective.prototype.subscribeEvents = /**
         * @private
         * @return {?}
         */
            function () {
                var _this = this;
                this.draggingSub = rxjs.fromEvent(document, 'mousemove', { passive: false }).subscribe(function (event) { return _this.onMouseMove(( /** @type {?} */(event))); });
                this.draggingSub.add(rxjs.fromEvent(document, 'touchmove', { passive: false }).subscribe(function (event) { return _this.onMouseMove(( /** @type {?} */(event))); }));
                this.draggingSub.add(rxjs.fromEvent(document, 'mouseup', { passive: false }).subscribe(function () { return _this.onMouseLeave(); }));
                // fix for issue #164
                /** @type {?} */
                var isIEOrEdge = /msie\s|trident\//i.test(window.navigator.userAgent);
                if (!isIEOrEdge) {
                    this.draggingSub.add(rxjs.fromEvent(document, 'mouseleave', { passive: false }).subscribe(function () { return _this.onMouseLeave(); }));
                }
                this.draggingSub.add(rxjs.fromEvent(document, 'touchend', { passive: false }).subscribe(function () { return _this.onMouseLeave(); }));
                this.draggingSub.add(rxjs.fromEvent(document, 'touchcancel', { passive: false }).subscribe(function () { return _this.onMouseLeave(); }));
            };
        /**
         * @private
         * @return {?}
         */
        AngularResizableDirective.prototype.unsubscribeEvents = /**
         * @private
         * @return {?}
         */
            function () {
                this.draggingSub.unsubscribe();
                this.draggingSub = null;
            };
        /**
         * @return {?}
         */
        AngularResizableDirective.prototype.onMouseLeave = /**
         * @return {?}
         */
            function () {
                if (this._handleResizing) {
                    this.stopResize();
                    this._origMousePos = null;
                    this.unsubscribeEvents();
                }
            };
        /**
         * @param {?} event
         * @return {?}
         */
        AngularResizableDirective.prototype.onMouseMove = /**
         * @param {?} event
         * @return {?}
         */
            function (event) {
                if (this._handleResizing && this._resizable && this._origMousePos && this._origPos && this._origSize) {
                    this.resizeTo(Position.fromEvent(event));
                    this.onResizing();
                }
            };
        /**
         * @private
         * @param {?} handle
         * @return {?}
         */
        AngularResizableDirective.prototype.startResize = /**
         * @private
         * @param {?} handle
         * @return {?}
         */
            function (handle) {
                /** @type {?} */
                var elm = this.el.nativeElement;
                this._origSize = Size.getCurrent(elm);
                this._origPos = Position.getCurrent(elm); // x: left, y: top
                this._currSize = Size.copy(this._origSize);
                this._currPos = Position.copy(this._origPos);
                if (this._containment) {
                    this.getBounding();
                }
                this.getGridSize();
                // Add a transparent helper div:
                this._helperBlock.add();
                this._handleResizing = handle;
                this.updateDirection();
                this.rzStart.emit(this.getResizingEvent());
            };
        /**
         * @private
         * @return {?}
         */
        AngularResizableDirective.prototype.stopResize = /**
         * @private
         * @return {?}
         */
            function () {
                // Remove the helper div:
                this._helperBlock.remove();
                this.rzStop.emit(this.getResizingEvent());
                this._handleResizing = null;
                this._direction = null;
                this._origSize = null;
                this._origPos = null;
                if (this._containment) {
                    this.resetBounding();
                }
            };
        /**
         * @private
         * @return {?}
         */
        AngularResizableDirective.prototype.onResizing = /**
         * @private
         * @return {?}
         */
            function () {
                this.rzResizing.emit(this.getResizingEvent());
            };
        /**
         * @private
         * @return {?}
         */
        AngularResizableDirective.prototype.getResizingEvent = /**
         * @private
         * @return {?}
         */
            function () {
                return {
                    host: this.el.nativeElement,
                    handle: this._handleResizing ? this._handleResizing.el : null,
                    size: {
                        width: this._currSize.width,
                        height: this._currSize.height
                    },
                    position: {
                        top: this._currPos.y,
                        left: this._currPos.x
                    },
                    direction: __assign({}, this._directionChanged),
                };
            };
        /**
         * @private
         * @return {?}
         */
        AngularResizableDirective.prototype.updateDirection = /**
         * @private
         * @return {?}
         */
            function () {
                this._direction = {
                    n: !!this._handleResizing.type.match(/n/),
                    s: !!this._handleResizing.type.match(/s/),
                    w: !!this._handleResizing.type.match(/w/),
                    e: !!this._handleResizing.type.match(/e/)
                };
                this._directionChanged = __assign({}, this._direction);
                // if aspect ration should be preserved:
                if (this.rzAspectRatio) {
                    // if north then west (unless ne)
                    if (this._directionChanged.n && !this._directionChanged.e) {
                        this._directionChanged.w = true;
                    }
                    // if south then east (unless sw)
                    if (this._directionChanged.s && !this._directionChanged.w) {
                        this._directionChanged.e = true;
                    }
                    // if east then south (unless ne)
                    if (this._directionChanged.e && !this._directionChanged.n) {
                        this._directionChanged.s = true;
                    }
                    // if west then south (unless nw)
                    if (this._directionChanged.w && !this._directionChanged.n) {
                        this._directionChanged.s = true;
                    }
                }
            };
        /**
         * @private
         * @param {?} p
         * @return {?}
         */
        AngularResizableDirective.prototype.resizeTo = /**
         * @private
         * @param {?} p
         * @return {?}
         */
            function (p) {
                p.subtract(this._origMousePos);
                /** @type {?} */
                var tmpX = Math.round(p.x / this._gridSize.x) * this._gridSize.x;
                /** @type {?} */
                var tmpY = Math.round(p.y / this._gridSize.y) * this._gridSize.y;
                if (this._direction.n) {
                    // n, ne, nw
                    this._currPos.y = this._origPos.y + tmpY;
                    this._currSize.height = this._origSize.height - tmpY;
                }
                else if (this._direction.s) {
                    // s, se, sw
                    this._currSize.height = this._origSize.height + tmpY;
                }
                if (this._direction.e) {
                    // e, ne, se
                    this._currSize.width = this._origSize.width + tmpX;
                }
                else if (this._direction.w) {
                    // w, nw, sw
                    this._currSize.width = this._origSize.width - tmpX;
                    this._currPos.x = this._origPos.x + tmpX;
                }
                this.checkBounds();
                this.checkSize();
                this.adjustByRatio();
                this.doResize();
            };
        /**
         * @private
         * @return {?}
         */
        AngularResizableDirective.prototype.doResize = /**
         * @private
         * @return {?}
         */
            function () {
                /** @type {?} */
                var container = this.el.nativeElement;
                if (!this._direction || this._direction.n || this._direction.s || this._aspectRatio) {
                    this.renderer.setStyle(container, 'height', this._currSize.height + 'px');
                }
                if (!this._direction || this._direction.w || this._direction.e || this._aspectRatio) {
                    this.renderer.setStyle(container, 'width', this._currSize.width + 'px');
                }
                this.renderer.setStyle(container, 'left', this._currPos.x + 'px');
                this.renderer.setStyle(container, 'top', this._currPos.y + 'px');
            };
        /**
         * @private
         * @return {?}
         */
        AngularResizableDirective.prototype.adjustByRatio = /**
         * @private
         * @return {?}
         */
            function () {
                if (this._aspectRatio && !this._adjusted) {
                    if (this._direction.e || this._direction.w) {
                        /** @type {?} */
                        var newHeight = Math.floor(this._currSize.width / this._aspectRatio);
                        if (this._direction.n) {
                            this._currPos.y += this._currSize.height - newHeight;
                        }
                        this._currSize.height = newHeight;
                    }
                    else {
                        /** @type {?} */
                        var newWidth = Math.floor(this._aspectRatio * this._currSize.height);
                        if (this._direction.n) {
                            this._currPos.x += this._currSize.width - newWidth;
                        }
                        this._currSize.width = newWidth;
                    }
                }
            };
        /**
         * @private
         * @return {?}
         */
        AngularResizableDirective.prototype.checkBounds = /**
         * @private
         * @return {?}
         */
            function () {
                if (this._containment) {
                    /** @type {?} */
                    var maxWidth = this._bounding.width - this._bounding.pr - this._bounding.deltaL - this._bounding.translateX - this._currPos.x;
                    /** @type {?} */
                    var maxHeight = this._bounding.height - this._bounding.pb - this._bounding.deltaT - this._bounding.translateY - this._currPos.y;
                    if (this._direction.n && (this._currPos.y + this._bounding.translateY < 0)) {
                        this._currPos.y = -this._bounding.translateY;
                        this._currSize.height = this._origSize.height + this._origPos.y + this._bounding.translateY;
                    }
                    if (this._direction.w && (this._currPos.x + this._bounding.translateX) < 0) {
                        this._currPos.x = -this._bounding.translateX;
                        this._currSize.width = this._origSize.width + this._origPos.x + this._bounding.translateX;
                    }
                    if (this._currSize.width > maxWidth) {
                        this._currSize.width = maxWidth;
                    }
                    if (this._currSize.height > maxHeight) {
                        this._currSize.height = maxHeight;
                    }
                    /**
                     * Fix Issue: Additional check for aspect ratio
                     * https://github.com/xieziyu/angular2-draggable/issues/132
                     */
                    if (this._aspectRatio) {
                        this._adjusted = false;
                        if ((this._direction.w || this._direction.e) &&
                            (this._currSize.width / this._aspectRatio) >= maxHeight) {
                            /** @type {?} */
                            var newWidth = Math.floor(maxHeight * this._aspectRatio);
                            if (this._direction.w) {
                                this._currPos.x += this._currSize.width - newWidth;
                            }
                            this._currSize.width = newWidth;
                            this._currSize.height = maxHeight;
                            this._adjusted = true;
                        }
                        if ((this._direction.n || this._direction.s) &&
                            (this._currSize.height * this._aspectRatio) >= maxWidth) {
                            /** @type {?} */
                            var newHeight = Math.floor(maxWidth / this._aspectRatio);
                            if (this._direction.n) {
                                this._currPos.y += this._currSize.height - newHeight;
                            }
                            this._currSize.width = maxWidth;
                            this._currSize.height = newHeight;
                            this._adjusted = true;
                        }
                    }
                }
            };
        /**
         * @private
         * @return {?}
         */
        AngularResizableDirective.prototype.checkSize = /**
         * @private
         * @return {?}
         */
            function () {
                /** @type {?} */
                var minHeight = !this.rzMinHeight ? 1 : this.rzMinHeight;
                /** @type {?} */
                var minWidth = !this.rzMinWidth ? 1 : this.rzMinWidth;
                if (this._currSize.height < minHeight) {
                    this._currSize.height = minHeight;
                    if (this._direction.n) {
                        this._currPos.y = this._origPos.y + (this._origSize.height - minHeight);
                    }
                }
                if (this._currSize.width < minWidth) {
                    this._currSize.width = minWidth;
                    if (this._direction.w) {
                        this._currPos.x = this._origPos.x + (this._origSize.width - minWidth);
                    }
                }
                if (this.rzMaxHeight && this._currSize.height > this.rzMaxHeight) {
                    this._currSize.height = this.rzMaxHeight;
                    if (this._direction.n) {
                        this._currPos.y = this._origPos.y + (this._origSize.height - this.rzMaxHeight);
                    }
                }
                if (this.rzMaxWidth && this._currSize.width > this.rzMaxWidth) {
                    this._currSize.width = this.rzMaxWidth;
                    if (this._direction.w) {
                        this._currPos.x = this._origPos.x + (this._origSize.width - this.rzMaxWidth);
                    }
                }
            };
        /**
         * @private
         * @return {?}
         */
        AngularResizableDirective.prototype.getBounding = /**
         * @private
         * @return {?}
         */
            function () {
                /** @type {?} */
                var el = this._containment;
                /** @type {?} */
                var computed = window.getComputedStyle(el);
                if (computed) {
                    /** @type {?} */
                    var p = computed.getPropertyValue('position');
                    /** @type {?} */
                    var nativeEl = window.getComputedStyle(this.el.nativeElement);
                    /** @type {?} */
                    var transforms = nativeEl.getPropertyValue('transform').replace(/[^-\d,]/g, '').split(',');
                    this._bounding = {};
                    this._bounding.width = el.clientWidth;
                    this._bounding.height = el.clientHeight;
                    this._bounding.pr = parseInt(computed.getPropertyValue('padding-right'), 10);
                    this._bounding.pb = parseInt(computed.getPropertyValue('padding-bottom'), 10);
                    this._bounding.deltaL = this.el.nativeElement.offsetLeft - this._currPos.x;
                    this._bounding.deltaT = this.el.nativeElement.offsetTop - this._currPos.y;
                    if (transforms.length >= 6) {
                        this._bounding.translateX = parseInt(transforms[4], 10);
                        this._bounding.translateY = parseInt(transforms[5], 10);
                    }
                    else {
                        this._bounding.translateX = 0;
                        this._bounding.translateY = 0;
                    }
                    this._bounding.position = computed.getPropertyValue('position');
                    if (p === 'static') {
                        this.renderer.setStyle(el, 'position', 'relative');
                    }
                }
            };
        /**
         * @private
         * @return {?}
         */
        AngularResizableDirective.prototype.resetBounding = /**
         * @private
         * @return {?}
         */
            function () {
                if (this._bounding && this._bounding.position === 'static') {
                    this.renderer.setStyle(this._containment, 'position', 'relative');
                }
                this._bounding = null;
            };
        /**
         * @private
         * @return {?}
         */
        AngularResizableDirective.prototype.getGridSize = /**
         * @private
         * @return {?}
         */
            function () {
                // set default value:
                this._gridSize = { x: 1, y: 1 };
                if (this.rzGrid) {
                    if (typeof this.rzGrid === 'number') {
                        this._gridSize = { x: this.rzGrid, y: this.rzGrid };
                    }
                    else if (Array.isArray(this.rzGrid)) {
                        this._gridSize = { x: this.rzGrid[0], y: this.rzGrid[1] };
                    }
                }
            };
        AngularResizableDirective.decorators = [
            { type: core.Directive, args: [{
                        selector: '[ngResizable]',
                        exportAs: 'ngResizable'
                    },] }
        ];
        /** @nocollapse */
        AngularResizableDirective.ctorParameters = function () {
            return [
                { type: core.ElementRef },
                { type: core.Renderer2 }
            ];
        };
        AngularResizableDirective.propDecorators = {
            ngResizable: [{ type: core.Input }],
            rzHandles: [{ type: core.Input }],
            rzAspectRatio: [{ type: core.Input }],
            rzContainment: [{ type: core.Input }],
            rzGrid: [{ type: core.Input }],
            rzMinWidth: [{ type: core.Input }],
            rzMinHeight: [{ type: core.Input }],
            rzMaxWidth: [{ type: core.Input }],
            rzMaxHeight: [{ type: core.Input }],
            preventDefaultEvent: [{ type: core.Input }],
            rzStart: [{ type: core.Output }],
            rzResizing: [{ type: core.Output }],
            rzStop: [{ type: core.Output }]
        };
        return AngularResizableDirective;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    var AngularDraggableModule = /** @class */ (function () {
        function AngularDraggableModule() {
        }
        AngularDraggableModule.decorators = [
            { type: core.NgModule, args: [{
                        imports: [],
                        declarations: [
                            AngularDraggableDirective,
                            AngularResizableDirective
                        ],
                        exports: [
                            AngularDraggableDirective,
                            AngularResizableDirective
                        ]
                    },] }
        ];
        return AngularDraggableModule;
    }());

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */

    exports.AngularDraggableDirective = AngularDraggableDirective;
    exports.AngularResizableDirective = AngularResizableDirective;
    exports.AngularDraggableModule = AngularDraggableModule;
    exports.Position = Position;

    Object.defineProperty(exports, '__esModule', { value: true });

})));

//# sourceMappingURL=angular2-draggable.umd.js.map