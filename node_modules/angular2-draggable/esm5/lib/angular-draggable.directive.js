/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Directive, ElementRef, Renderer2, Input, Output, HostListener, EventEmitter } from '@angular/core';
import { fromEvent } from 'rxjs';
import { Position } from './models/position';
import { HelperBlock } from './widgets/helper-block';
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
        this.started = new EventEmitter();
        this.stopped = new EventEmitter();
        this.edge = new EventEmitter();
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
        this.movingOffset = new EventEmitter();
        /**
         * Emit position offsets when put back
         */
        this.endOffset = new EventEmitter();
        this._helperBlock = new HelperBlock(el.nativeElement, renderer);
    }
    Object.defineProperty(AngularDraggableDirective.prototype, "zIndex", {
        /** Set z-index when not dragging */
        set: /**
         * Set z-index when not dragging
         * @param {?} setting
         * @return {?}
         */
        function (setting) {
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
         */
        function (setting) {
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
        this.draggingSub = fromEvent(document, 'mousemove', { passive: false }).subscribe(function (event) { return _this.onMouseMove((/** @type {?} */ (event))); });
        this.draggingSub.add(fromEvent(document, 'touchmove', { passive: false }).subscribe(function (event) { return _this.onMouseMove((/** @type {?} */ (event))); }));
        this.draggingSub.add(fromEvent(document, 'mouseup', { passive: false }).subscribe(function () { return _this.putBack(); }));
        // checking if browser is IE or Edge - https://github.com/xieziyu/angular2-draggable/issues/153
        /** @type {?} */
        var isIEOrEdge = /msie\s|trident\//i.test(window.navigator.userAgent);
        if (!isIEOrEdge) {
            this.draggingSub.add(fromEvent(document, 'mouseleave', { passive: false }).subscribe(function () { return _this.putBack(); }));
        }
        this.draggingSub.add(fromEvent(document, 'touchend', { passive: false }).subscribe(function () { return _this.putBack(); }));
        this.draggingSub.add(fromEvent(document, 'touchcancel', { passive: false }).subscribe(function () { return _this.putBack(); }));
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
        { type: Directive, args: [{
                    selector: '[ngDraggable]',
                    exportAs: 'ngDraggable'
                },] }
    ];
    /** @nocollapse */
    AngularDraggableDirective.ctorParameters = function () { return [
        { type: ElementRef },
        { type: Renderer2 }
    ]; };
    AngularDraggableDirective.propDecorators = {
        started: [{ type: Output }],
        stopped: [{ type: Output }],
        edge: [{ type: Output }],
        handle: [{ type: Input }],
        bounds: [{ type: Input }],
        outOfBounds: [{ type: Input }],
        gridSize: [{ type: Input }],
        zIndexMoving: [{ type: Input }],
        zIndex: [{ type: Input }],
        inBounds: [{ type: Input }],
        trackPosition: [{ type: Input }],
        scale: [{ type: Input }],
        preventDefaultEvent: [{ type: Input }],
        position: [{ type: Input }],
        lockAxis: [{ type: Input }],
        movingOffset: [{ type: Output }],
        endOffset: [{ type: Output }],
        ngDraggable: [{ type: Input }],
        onMouseDown: [{ type: HostListener, args: ['mousedown', ['$event'],] }, { type: HostListener, args: ['touchstart', ['$event'],] }]
    };
    return AngularDraggableDirective;
}());
export { AngularDraggableDirective };
if (false) {
    /**
     * @type {?}
     * @private
     */
    AngularDraggableDirective.prototype.allowDrag;
    /**
     * @type {?}
     * @private
     */
    AngularDraggableDirective.prototype.moving;
    /**
     * @type {?}
     * @private
     */
    AngularDraggableDirective.prototype.orignal;
    /**
     * @type {?}
     * @private
     */
    AngularDraggableDirective.prototype.oldTrans;
    /**
     * @type {?}
     * @private
     */
    AngularDraggableDirective.prototype.tempTrans;
    /**
     * @type {?}
     * @private
     */
    AngularDraggableDirective.prototype.currTrans;
    /**
     * @type {?}
     * @private
     */
    AngularDraggableDirective.prototype.oldZIndex;
    /**
     * @type {?}
     * @private
     */
    AngularDraggableDirective.prototype._zIndex;
    /**
     * @type {?}
     * @private
     */
    AngularDraggableDirective.prototype.needTransform;
    /**
     * @type {?}
     * @private
     */
    AngularDraggableDirective.prototype.draggingSub;
    /**
     * Bugfix: iFrames, and context unrelated elements block all events, and are unusable
     * https://github.com/xieziyu/angular2-draggable/issues/84
     * @type {?}
     * @private
     */
    AngularDraggableDirective.prototype._helperBlock;
    /** @type {?} */
    AngularDraggableDirective.prototype.started;
    /** @type {?} */
    AngularDraggableDirective.prototype.stopped;
    /** @type {?} */
    AngularDraggableDirective.prototype.edge;
    /**
     * Make the handle HTMLElement draggable
     * @type {?}
     */
    AngularDraggableDirective.prototype.handle;
    /**
     * Set the bounds HTMLElement
     * @type {?}
     */
    AngularDraggableDirective.prototype.bounds;
    /**
     * List of allowed out of bounds edges *
     * @type {?}
     */
    AngularDraggableDirective.prototype.outOfBounds;
    /**
     * Round the position to nearest grid
     * @type {?}
     */
    AngularDraggableDirective.prototype.gridSize;
    /**
     * Set z-index when dragging
     * @type {?}
     */
    AngularDraggableDirective.prototype.zIndexMoving;
    /**
     * Whether to limit the element stay in the bounds
     * @type {?}
     */
    AngularDraggableDirective.prototype.inBounds;
    /**
     * Whether the element should use it's previous drag position on a new drag event.
     * @type {?}
     */
    AngularDraggableDirective.prototype.trackPosition;
    /**
     * Input css scale transform of element so translations are correct
     * @type {?}
     */
    AngularDraggableDirective.prototype.scale;
    /**
     * Whether to prevent default event
     * @type {?}
     */
    AngularDraggableDirective.prototype.preventDefaultEvent;
    /**
     * Set initial position by offsets
     * @type {?}
     */
    AngularDraggableDirective.prototype.position;
    /**
     * Lock axis: 'x' or 'y'
     * @type {?}
     */
    AngularDraggableDirective.prototype.lockAxis;
    /**
     * Emit position offsets when moving
     * @type {?}
     */
    AngularDraggableDirective.prototype.movingOffset;
    /**
     * Emit position offsets when put back
     * @type {?}
     */
    AngularDraggableDirective.prototype.endOffset;
    /**
     * @type {?}
     * @private
     */
    AngularDraggableDirective.prototype.el;
    /**
     * @type {?}
     * @private
     */
    AngularDraggableDirective.prototype.renderer;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5ndWxhci1kcmFnZ2FibGUuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhcjItZHJhZ2dhYmxlLyIsInNvdXJjZXMiOlsibGliL2FuZ3VsYXItZHJhZ2dhYmxlLmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUNMLFNBQVMsRUFBRSxVQUFVLEVBQUUsU0FBUyxFQUNoQyxLQUFLLEVBQUUsTUFBTSxFQUFVLFlBQVksRUFDbkMsWUFBWSxFQUNiLE1BQU0sZUFBZSxDQUFDO0FBRXZCLE9BQU8sRUFBZ0IsU0FBUyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQy9DLE9BQU8sRUFBYSxRQUFRLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUN4RCxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFFckQ7SUE0RkUsbUNBQW9CLEVBQWMsRUFBVSxRQUFtQjtRQUEzQyxPQUFFLEdBQUYsRUFBRSxDQUFZO1FBQVUsYUFBUSxHQUFSLFFBQVEsQ0FBVztRQXZGdkQsY0FBUyxHQUFHLElBQUksQ0FBQztRQUNqQixXQUFNLEdBQUcsS0FBSyxDQUFDO1FBQ2YsWUFBTyxHQUFhLElBQUksQ0FBQztRQUN6QixhQUFRLEdBQUcsSUFBSSxRQUFRLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQzlCLGNBQVMsR0FBRyxJQUFJLFFBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDL0IsY0FBUyxHQUFHLElBQUksUUFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUMvQixjQUFTLEdBQUcsRUFBRSxDQUFDO1FBQ2YsWUFBTyxHQUFHLEVBQUUsQ0FBQztRQUNiLGtCQUFhLEdBQUcsS0FBSyxDQUFDO1FBRXRCLGdCQUFXLEdBQWlCLElBQUksQ0FBQzs7Ozs7UUFNakMsaUJBQVksR0FBZ0IsSUFBSSxDQUFDO1FBRS9CLFlBQU8sR0FBRyxJQUFJLFlBQVksRUFBTyxD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OztJQUM1Qyw0Q0FBNEM7O0lBQzVDLHlDQUF5Qzs7Ozs7SUFHekMsMkNBQTZCOzs7OztJQUc3QiwyQ0FBNkI7Ozs7O0lBRzdCLGdEQUtFOzs7OztJQUdGLDZDQUFzQjs7Ozs7SUFHdEIsaURBQThCOzs7OztJQVE5Qiw2Q0FBMEI7Ozs7O0lBRzFCLGtEQUE4Qjs7Ozs7SUFHOUIsMENBQW1COzs7OztJQUduQix3REFBcUM7Ozs7O0lBR3JDLDZDQUE4Qzs7Ozs7SUFHOUMsNkNBQWlDOzs7OztJQUdqQyxpREFBdUQ7Ozs7O0lBR3ZELDhDQUFvRDs7Ozs7SUFrQnhDLHVDQUFzQjs7Ozs7SUFBRSw2Q0FBMkIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBEaXJlY3RpdmUsIEVsZW1lbnRSZWYsIFJlbmRlcmVyMixcbiAgSW5wdXQsIE91dHB1dCwgT25Jbml0LCBIb3N0TGlzdGVuZXIsXG4gIEV2ZW50RW1pdHRlciwgT25DaGFuZ2VzLCBTaW1wbGVDaGFuZ2VzLCBPbkRlc3Ryb3ksIEFmdGVyVmlld0luaXRcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IFN1YnNjcmlwdGlvbiwgZnJvbUV2ZW50IH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBJUG9zaXRpb24sIFBvc2l0aW9uIH0gZnJvbSAnLi9tb2RlbHMvcG9zaXRpb24nO1xuaW1wb3J0IHsgSGVscGVyQmxvY2sgfSBmcm9tICcuL3dpZGdldHMvaGVscGVyLWJsb2NrJztcblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW25nRHJhZ2dhYmxlXScsXG4gIGV4cG9ydEFzOiAnbmdEcmFnZ2FibGUnXG59KVxuZXhwb3J0IGNsYXNzIEFuZ3VsYXJEcmFnZ2FibGVEaXJlY3RpdmUgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSwgT25DaGFuZ2VzLCBBZnRlclZpZXdJbml0IHtcbiAgcHJpdmF0ZSBhbGxvd0RyYWcgPSB0cnVlO1xuICBwcml2YXRlIG1vdmluZyA9IGZhbHNlO1xuICBwcml2YXRlIG9yaWduYWw6IFBvc2l0aW9uID0gbnVsbDtcbiAgcHJpdmF0ZSBvbGRUcmFucyA9IG5ldyBQb3NpdGlvbigwLCAwKTtcbiAgcHJpdmF0ZSB0ZW1wVHJhbnMgPSBuZXcgUG9zaXRpb24oMCwgMCk7XG4gIHByaXZhdGUgY3VyclRyYW5zID0gbmV3IFBvc2l0aW9uKDAsIDApO1xuICBwcml2YXRlIG9sZFpJbmRleCA9ICcnO1xuICBwcml2YXRlIF96SW5kZXggPSAnJztcbiAgcHJpdmF0ZSBuZWVkVHJhbnNmb3JtID0gZmFsc2U7XG5cbiAgcHJpdmF0ZSBkcmFnZ2luZ1N1YjogU3Vic2NyaXB0aW9uID0gbnVsbDtcblxuICAvKipcbiAgICogQnVnZml4OiBpRnJhbWVzLCBhbmQgY29udGV4dCB1bnJlbGF0ZWQgZWxlbWVudHMgYmxvY2sgYWxsIGV2ZW50cywgYW5kIGFyZSB1bnVzYWJsZVxuICAgKiBodHRwczovL2dpdGh1Yi5jb20veGlleml5dS9hbmd1bGFyMi1kcmFnZ2FibGUvaXNzdWVzLzg0XG4gICAqL1xuICBwcml2YXRlIF9oZWxwZXJCbG9jazogSGVscGVyQmxvY2sgPSBudWxsO1xuXG4gIEBPdXRwdXQoKSBzdGFydGVkID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG4gIEBPdXRwdXQoKSBzdG9wcGVkID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG4gIEBPdXRwdXQoKSBlZGdlID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG5cbiAgLyoqIE1ha2UgdGhlIGhhbmRsZSBIVE1MRWxlbWVudCBkcmFnZ2FibGUgKi9cbiAgQElucHV0KCkgaGFuZGxlOiBIVE1MRWxlbWVudDtcblxuICAvKiogU2V0IHRoZSBib3VuZHMgSFRNTEVsZW1lbnQgKi9cbiAgQElucHV0KCkgYm91bmRzOiBIVE1MRWxlbWVudDtcblxuICAvKiogTGlzdCBvZiBhbGxvd2VkIG91dCBvZiBib3VuZHMgZWRnZXMgKiovXG4gIEBJbnB1dCgpIG91dE9mQm91bmRzID0ge1xuICAgIHRvcDogZmFsc2UsXG4gICAgcmlnaHQ6IGZhbHNlLFxuICAgIGJvdHRvbTogZmFsc2UsXG4gICAgbGVmdDogZmFsc2VcbiAgfTtcblxuICAvKiogUm91bmQgdGhlIHBvc2l0aW9uIHRvIG5lYXJlc3QgZ3JpZCAqL1xuICBASW5wdXQoKSBncmlkU2l6ZSA9IDE7XG5cbiAgLyoqIFNldCB6LWluZGV4IHdoZW4gZHJhZ2dpbmcgKi9cbiAgQElucHV0KCkgekluZGV4TW92aW5nOiBzdHJpbmc7XG5cbiAgLyoqIFNldCB6LWluZGV4IHdoZW4gbm90IGRyYWdnaW5nICovXG4gIEBJbnB1dCgpIHNldCB6SW5kZXgoc2V0dGluZzogc3RyaW5nKSB7XG4gICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsICd6LWluZGV4Jywgc2V0dGluZyk7XG4gICAgdGhpcy5fekluZGV4ID0gc2V0dGluZztcbiAgfVxuICAvKiogV2hldGhlciB0byBsaW1pdCB0aGUgZWxlbWVudCBzdGF5IGluIHRoZSBib3VuZHMgKi9cbiAgQElucHV0KCkgaW5Cb3VuZHMgPSBmYWxzZTtcblxuICAvKiogV2hldGhlciB0aGUgZWxlbWVudCBzaG91bGQgdXNlIGl0J3MgcHJldmlvdXMgZHJhZyBwb3NpdGlvbiBvbiBhIG5ldyBkcmFnIGV2ZW50LiAqL1xuICBASW5wdXQoKSB0cmFja1Bvc2l0aW9uID0gdHJ1ZTtcblxuICAvKiogSW5wdXQgY3NzIHNjYWxlIHRyYW5zZm9ybSBvZiBlbGVtZW50IHNvIHRyYW5zbGF0aW9ucyBhcmUgY29ycmVjdCAqL1xuICBASW5wdXQoKSBzY2FsZSA9IDE7XG5cbiAgLyoqIFdoZXRoZXIgdG8gcHJldmVudCBkZWZhdWx0IGV2ZW50ICovXG4gIEBJbnB1dCgpIHByZXZlbnREZWZhdWx0RXZlbnQgPSBmYWxzZTtcblxuICAvKiogU2V0IGluaXRpYWwgcG9zaXRpb24gYnkgb2Zmc2V0cyAqL1xuICBASW5wdXQoKSBwb3NpdGlvbjogSVBvc2l0aW9uID0geyB4OiAwLCB5OiAwIH07XG5cbiAgLyoqIExvY2sgYXhpczogJ3gnIG9yICd5JyAqL1xuICBASW5wdXQoKSBsb2NrQXhpczogc3RyaW5nID0gbnVsbDtcblxuICAvKiogRW1pdCBwb3NpdGlvbiBvZmZzZXRzIHdoZW4gbW92aW5nICovXG4gIEBPdXRwdXQoKSBtb3ZpbmdPZmZzZXQgPSBuZXcgRXZlbnRFbWl0dGVyPElQb3NpdGlvbj4oKTtcblxuICAvKiogRW1pdCBwb3NpdGlvbiBvZmZzZXRzIHdoZW4gcHV0IGJhY2sgKi9cbiAgQE91dHB1dCgpIGVuZE9mZnNldCA9IG5ldyBFdmVudEVtaXR0ZXI8SVBvc2l0aW9uPigpO1xuXG4gIEBJbnB1dCgpXG4gIHNldCBuZ0RyYWdnYWJsZShzZXR0aW5nOiBhbnkpIHtcbiAgICBpZiAoc2V0dGluZyAhPT0gdW5kZWZpbmVkICYmIHNldHRpbmcgIT09IG51bGwgJiYgc2V0dGluZyAhPT0gJycpIHtcbiAgICAgIHRoaXMuYWxsb3dEcmFnID0gISFzZXR0aW5nO1xuXG4gICAgICBsZXQgZWxlbWVudCA9IHRoaXMuZ2V0RHJhZ0VsKCk7XG5cbiAgICAgIGlmICh0aGlzLmFsbG93RHJhZykge1xuICAgICAgICB0aGlzLnJlbmRlcmVyLmFkZENsYXNzKGVsZW1lbnQsICduZy1kcmFnZ2FibGUnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMucHV0QmFjaygpO1xuICAgICAgICB0aGlzLnJlbmRlcmVyLnJlbW92ZUNsYXNzKGVsZW1lbnQsICduZy1kcmFnZ2FibGUnKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGVsOiBFbGVtZW50UmVmLCBwcml2YXRlIHJlbmRlcmVyOiBSZW5kZXJlcjIpIHtcbiAgICB0aGlzLl9oZWxwZXJCbG9jayA9IG5ldyBIZWxwZXJCbG9jayhlbC5uYXRpdmVFbGVtZW50LCByZW5kZXJlcik7XG4gIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICBpZiAodGhpcy5hbGxvd0RyYWcpIHtcbiAgICAgIGxldCBlbGVtZW50ID0gdGhpcy5nZXREcmFnRWwoKTtcbiAgICAgIHRoaXMucmVuZGVyZXIuYWRkQ2xhc3MoZWxlbWVudCwgJ25nLWRyYWdnYWJsZScpO1xuICAgIH1cbiAgICB0aGlzLnJlc2V0UG9zaXRpb24oKTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMuYm91bmRzID0gbnVsbDtcbiAgICB0aGlzLmhhbmRsZSA9IG51bGw7XG4gICAgdGhpcy5vcmlnbmFsID0gbnVsbDtcbiAgICB0aGlzLm9sZFRyYW5zID0gbnVsbDtcbiAgICB0aGlzLnRlbXBUcmFucyA9IG51bGw7XG4gICAgdGhpcy5jdXJyVHJhbnMgPSBudWxsO1xuICAgIHRoaXMuX2hlbHBlckJsb2NrLmRpc3Bvc2UoKTtcbiAgICB0aGlzLl9oZWxwZXJCbG9jayA9IG51bGw7XG5cbiAgICBpZiAodGhpcy5kcmFnZ2luZ1N1Yikge1xuICAgICAgdGhpcy5kcmFnZ2luZ1N1Yi51bnN1YnNjcmliZSgpO1xuICAgIH1cbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcbiAgICBpZiAoY2hhbmdlc1sncG9zaXRpb24nXSAmJiAhY2hhbmdlc1sncG9zaXRpb24nXS5pc0ZpcnN0Q2hhbmdlKCkpIHtcbiAgICAgIGxldCBwID0gY2hhbmdlc1sncG9zaXRpb24nXS5jdXJyZW50VmFsdWU7XG5cbiAgICAgIGlmICghdGhpcy5tb3ZpbmcpIHtcbiAgICAgICAgaWYgKFBvc2l0aW9uLmlzSVBvc2l0aW9uKHApKSB7XG4gICAgICAgICAgdGhpcy5vbGRUcmFucy5zZXQocCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5vbGRUcmFucy5yZXNldCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy50cmFuc2Zvcm0oKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMubmVlZFRyYW5zZm9ybSA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIGlmICh0aGlzLmluQm91bmRzKSB7XG4gICAgICB0aGlzLmJvdW5kc0NoZWNrKCk7XG4gICAgICB0aGlzLm9sZFRyYW5zLmFkZCh0aGlzLnRlbXBUcmFucyk7XG4gICAgICB0aGlzLnRlbXBUcmFucy5yZXNldCgpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgZ2V0RHJhZ0VsKCkge1xuICAgIHJldHVybiB0aGlzLmhhbmRsZSA/IHRoaXMuaGFuZGxlIDogdGhpcy5lbC5uYXRpdmVFbGVtZW50O1xuICB9XG5cbiAgcmVzZXRQb3NpdGlvbigpIHtcbiAgICBpZiAoUG9zaXRpb24uaXNJUG9zaXRpb24odGhpcy5wb3NpdGlvbikpIHtcbiAgICAgIHRoaXMub2xkVHJhbnMuc2V0KHRoaXMucG9zaXRpb24pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLm9sZFRyYW5zLnJlc2V0KCk7XG4gICAgfVxuICAgIHRoaXMudGVtcFRyYW5zLnJlc2V0KCk7XG4gICAgdGhpcy50cmFuc2Zvcm0oKTtcbiAgfVxuXG4gIHByaXZhdGUgbW92ZVRvKHA6IFBvc2l0aW9uKSB7XG4gICAgaWYgKHRoaXMub3JpZ25hbCkge1xuICAgICAgcC5zdWJ0cmFjdCh0aGlzLm9yaWduYWwpO1xuICAgICAgdGhpcy50ZW1wVHJhbnMuc2V0KHApO1xuICAgICAgdGhpcy50ZW1wVHJhbnMuZGl2aWRlKHRoaXMuc2NhbGUpO1xuICAgICAgdGhpcy50cmFuc2Zvcm0oKTtcblxuICAgICAgaWYgKHRoaXMuYm91bmRzKSB7XG4gICAgICAgIHRoaXMuZWRnZS5lbWl0KHRoaXMuYm91bmRzQ2hlY2soKSk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMubW92aW5nT2Zmc2V0LmVtaXQodGhpcy5jdXJyVHJhbnMudmFsdWUpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgdHJhbnNmb3JtKCkge1xuICAgIGxldCB0cmFuc2xhdGVYID0gdGhpcy50ZW1wVHJhbnMueCArIHRoaXMub2xkVHJhbnMueDtcbiAgICBsZXQgdHJhbnNsYXRlWSA9IHRoaXMudGVtcFRyYW5zLnkgKyB0aGlzLm9sZFRyYW5zLnk7XG5cbiAgICBpZiAodGhpcy5sb2NrQXhpcyA9PT0gJ3gnKSB7XG4gICAgICB0cmFuc2xhdGVYID0gdGhpcy5vbGRUcmFucy54O1xuICAgICAgdGhpcy50ZW1wVHJhbnMueCA9IDA7XG4gICAgfSBlbHNlIGlmICh0aGlzLmxvY2tBeGlzID09PSAneScpIHtcbiAgICAgIHRyYW5zbGF0ZVkgPSB0aGlzLm9sZFRyYW5zLnk7XG4gICAgICB0aGlzLnRlbXBUcmFucy55ID0gMDtcbiAgICB9XG5cbiAgICAvLyBTbmFwIHRvIGdyaWQ6IGJ5IGdyaWQgc2l6ZVxuICAgIGlmICh0aGlzLmdyaWRTaXplID4gMSkge1xuICAgICAgdHJhbnNsYXRlWCA9IE1hdGgucm91bmQodHJhbnNsYXRlWCAvIHRoaXMuZ3JpZFNpemUpICogdGhpcy5ncmlkU2l6ZTtcbiAgICAgIHRyYW5zbGF0ZVkgPSBNYXRoLnJvdW5kKHRyYW5zbGF0ZVkgLyB0aGlzLmdyaWRTaXplKSAqIHRoaXMuZ3JpZFNpemU7XG4gICAgfVxuXG4gICAgbGV0IHZhbHVlID0gYHRyYW5zbGF0ZSgkeyBNYXRoLnJvdW5kKHRyYW5zbGF0ZVgpIH1weCwgJHsgTWF0aC5yb3VuZCh0cmFuc2xhdGVZKSB9cHgpYDtcblxuICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUodGhpcy5lbC5uYXRpdmVFbGVtZW50LCAndHJhbnNmb3JtJywgdmFsdWUpO1xuICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUodGhpcy5lbC5uYXRpdmVFbGVtZW50LCAnLXdlYmtpdC10cmFuc2Zvcm0nLCB2YWx1ZSk7XG4gICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsICctbXMtdHJhbnNmb3JtJywgdmFsdWUpO1xuICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUodGhpcy5lbC5uYXRpdmVFbGVtZW50LCAnLW1vei10cmFuc2Zvcm0nLCB2YWx1ZSk7XG4gICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsICctby10cmFuc2Zvcm0nLCB2YWx1ZSk7XG5cbiAgICAvLyBzYXZlIGN1cnJlbnQgcG9zaXRpb25cbiAgICB0aGlzLmN1cnJUcmFucy54ID0gdHJhbnNsYXRlWDtcbiAgICB0aGlzLmN1cnJUcmFucy55ID0gdHJhbnNsYXRlWTtcbiAgfVxuXG4gIHByaXZhdGUgcGlja1VwKCkge1xuICAgIC8vIGdldCBvbGQgei1pbmRleDpcbiAgICB0aGlzLm9sZFpJbmRleCA9IHRoaXMuZWwubmF0aXZlRWxlbWVudC5zdHlsZS56SW5kZXggPyB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuc3R5bGUuekluZGV4IDogJyc7XG5cbiAgICBpZiAod2luZG93KSB7XG4gICAgICB0aGlzLm9sZFpJbmRleCA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKHRoaXMuZWwubmF0aXZlRWxlbWVudCwgbnVsbCkuZ2V0UHJvcGVydHlWYWx1ZSgnei1pbmRleCcpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnpJbmRleE1vdmluZykge1xuICAgICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsICd6LWluZGV4JywgdGhpcy56SW5kZXhNb3ZpbmcpO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5tb3ZpbmcpIHtcbiAgICAgIHRoaXMuc3RhcnRlZC5lbWl0KHRoaXMuZWwubmF0aXZlRWxlbWVudCk7XG4gICAgICB0aGlzLm1vdmluZyA9IHRydWU7XG5cbiAgICAgIGNvbnN0IGVsZW1lbnQgPSB0aGlzLmdldERyYWdFbCgpO1xuICAgICAgdGhpcy5yZW5kZXJlci5hZGRDbGFzcyhlbGVtZW50LCAnbmctZHJhZ2dpbmcnKTtcblxuICAgICAgLyoqXG4gICAgICAgKiBGaXggcGVyZm9ybWFuY2UgaXNzdWU6XG4gICAgICAgKiBodHRwczovL2dpdGh1Yi5jb20veGlleml5dS9hbmd1bGFyMi1kcmFnZ2FibGUvaXNzdWVzLzExMlxuICAgICAgICovXG4gICAgICB0aGlzLnN1YnNjcmliZUV2ZW50cygpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgc3Vic2NyaWJlRXZlbnRzKCkge1xuICAgIHRoaXMuZHJhZ2dpbmdTdWIgPSBmcm9tRXZlbnQoZG9jdW1lbnQsICdtb3VzZW1vdmUnLCB7IHBhc3NpdmU6IGZhbHNlIH0pLnN1YnNjcmliZShldmVudCA9PiB0aGlzLm9uTW91c2VNb3ZlKGV2ZW50IGFzIE1vdXNlRXZlbnQpKTtcbiAgICB0aGlzLmRyYWdnaW5nU3ViLmFkZChmcm9tRXZlbnQoZG9jdW1lbnQsICd0b3VjaG1vdmUnLCB7IHBhc3NpdmU6IGZhbHNlIH0pLnN1YnNjcmliZShldmVudCA9PiB0aGlzLm9uTW91c2VNb3ZlKGV2ZW50IGFzIFRvdWNoRXZlbnQpKSk7XG4gICAgdGhpcy5kcmFnZ2luZ1N1Yi5hZGQoZnJvbUV2ZW50KGRvY3VtZW50LCAnbW91c2V1cCcsIHsgcGFzc2l2ZTogZmFsc2UgfSkuc3Vic2NyaWJlKCgpID0+IHRoaXMucHV0QmFjaygpKSk7XG4gICAgLy8gY2hlY2tpbmcgaWYgYnJvd3NlciBpcyBJRSBvciBFZGdlIC0gaHR0cHM6Ly9naXRodWIuY29tL3hpZXppeXUvYW5ndWxhcjItZHJhZ2dhYmxlL2lzc3Vlcy8xNTNcbiAgICBsZXQgaXNJRU9yRWRnZSA9IC9tc2llXFxzfHRyaWRlbnRcXC8vaS50ZXN0KHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50KTtcbiAgICBpZiAoIWlzSUVPckVkZ2UpIHtcbiAgICAgIHRoaXMuZHJhZ2dpbmdTdWIuYWRkKGZyb21FdmVudChkb2N1bWVudCwgJ21vdXNlbGVhdmUnLCB7cGFzc2l2ZTogZmFsc2V9KS5zdWJzY3JpYmUoKCkgPT4gdGhpcy5wdXRCYWNrKCkpKTtcbiAgICB9XG4gICAgdGhpcy5kcmFnZ2luZ1N1Yi5hZGQoZnJvbUV2ZW50KGRvY3VtZW50LCAndG91Y2hlbmQnLCB7IHBhc3NpdmU6IGZhbHNlIH0pLnN1YnNjcmliZSgoKSA9PiB0aGlzLnB1dEJhY2soKSkpO1xuICAgIHRoaXMuZHJhZ2dpbmdTdWIuYWRkKGZyb21FdmVudChkb2N1bWVudCwgJ3RvdWNoY2FuY2VsJywgeyBwYXNzaXZlOiBmYWxzZSB9KS5zdWJzY3JpYmUoKCkgPT4gdGhpcy5wdXRCYWNrKCkpKTtcbiAgfVxuXG4gIHByaXZhdGUgdW5zdWJzY3JpYmVFdmVudHMoKSB7XG4gICAgdGhpcy5kcmFnZ2luZ1N1Yi51bnN1YnNjcmliZSgpO1xuICAgIHRoaXMuZHJhZ2dpbmdTdWIgPSBudWxsO1xuICB9XG5cbiAgYm91bmRzQ2hlY2soKSB7XG4gICAgaWYgKHRoaXMuYm91bmRzKSB7XG4gICAgICBsZXQgYm91bmRhcnkgPSB0aGlzLmJvdW5kcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgIGxldCBlbGVtID0gdGhpcy5lbC5uYXRpdmVFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgbGV0IHJlc3VsdCA9IHtcbiAgICAgICAgJ3RvcCc6IHRoaXMub3V0T2ZCb3VuZHMudG9wID8gdHJ1ZSA6IGJvdW5kYXJ5LnRvcCA8IGVsZW0udG9wLFxuICAgICAgICAncmlnaHQnOiB0aGlzLm91dE9mQm91bmRzLnJpZ2h0ID8gdHJ1ZSA6IGJvdW5kYXJ5LnJpZ2h0ID4gZWxlbS5yaWdodCxcbiAgICAgICAgJ2JvdHRvbSc6IHRoaXMub3V0T2ZCb3VuZHMuYm90dG9tID8gdHJ1ZSA6IGJvdW5kYXJ5LmJvdHRvbSA+IGVsZW0uYm90dG9tLFxuICAgICAgICAnbGVmdCc6IHRoaXMub3V0T2ZCb3VuZHMubGVmdCA/IHRydWUgOiBib3VuZGFyeS5sZWZ0IDwgZWxlbS5sZWZ0XG4gICAgICB9O1xuXG4gICAgICBpZiAodGhpcy5pbkJvdW5kcykge1xuICAgICAgICBpZiAoIXJlc3VsdC50b3ApIHtcbiAgICAgICAgICB0aGlzLnRlbXBUcmFucy55IC09IChlbGVtLnRvcCAtIGJvdW5kYXJ5LnRvcCkgLyB0aGlzLnNjYWxlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFyZXN1bHQuYm90dG9tKSB7XG4gICAgICAgICAgdGhpcy50ZW1wVHJhbnMueSAtPSAoZWxlbS5ib3R0b20gLSBib3VuZGFyeS5ib3R0b20pIC8gdGhpcy5zY2FsZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghcmVzdWx0LnJpZ2h0KSB7XG4gICAgICAgICAgdGhpcy50ZW1wVHJhbnMueCAtPSAoZWxlbS5yaWdodCAtIGJvdW5kYXJ5LnJpZ2h0KSAvIHRoaXMuc2NhbGU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXJlc3VsdC5sZWZ0KSB7XG4gICAgICAgICAgdGhpcy50ZW1wVHJhbnMueCAtPSAoZWxlbS5sZWZ0IC0gYm91bmRhcnkubGVmdCkgLyB0aGlzLnNjYWxlO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy50cmFuc2Zvcm0oKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG4gIH1cblxuICAvKiogR2V0IGN1cnJlbnQgb2Zmc2V0ICovXG4gIGdldEN1cnJlbnRPZmZzZXQoKSB7XG4gICAgcmV0dXJuIHRoaXMuY3VyclRyYW5zLnZhbHVlO1xuICB9XG5cbiAgcHJpdmF0ZSBwdXRCYWNrKCkge1xuICAgIGlmICh0aGlzLl96SW5kZXgpIHtcbiAgICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUodGhpcy5lbC5uYXRpdmVFbGVtZW50LCAnei1pbmRleCcsIHRoaXMuX3pJbmRleCk7XG4gICAgfSBlbHNlIGlmICh0aGlzLnpJbmRleE1vdmluZykge1xuICAgICAgaWYgKHRoaXMub2xkWkluZGV4KSB7XG4gICAgICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUodGhpcy5lbC5uYXRpdmVFbGVtZW50LCAnei1pbmRleCcsIHRoaXMub2xkWkluZGV4KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuZWwubmF0aXZlRWxlbWVudC5zdHlsZS5yZW1vdmVQcm9wZXJ0eSgnei1pbmRleCcpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0aGlzLm1vdmluZykge1xuICAgICAgdGhpcy5zdG9wcGVkLmVtaXQodGhpcy5lbC5uYXRpdmVFbGVtZW50KTtcblxuICAgICAgLy8gUmVtb3ZlIHRoZSBoZWxwZXIgZGl2OlxuICAgICAgdGhpcy5faGVscGVyQmxvY2sucmVtb3ZlKCk7XG5cbiAgICAgIGlmICh0aGlzLm5lZWRUcmFuc2Zvcm0pIHtcbiAgICAgICAgaWYgKFBvc2l0aW9uLmlzSVBvc2l0aW9uKHRoaXMucG9zaXRpb24pKSB7XG4gICAgICAgICAgdGhpcy5vbGRUcmFucy5zZXQodGhpcy5wb3NpdGlvbik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5vbGRUcmFucy5yZXNldCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy50cmFuc2Zvcm0oKTtcbiAgICAgICAgdGhpcy5uZWVkVHJhbnNmb3JtID0gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLmJvdW5kcykge1xuICAgICAgICB0aGlzLmVkZ2UuZW1pdCh0aGlzLmJvdW5kc0NoZWNrKCkpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLm1vdmluZyA9IGZhbHNlO1xuICAgICAgdGhpcy5lbmRPZmZzZXQuZW1pdCh0aGlzLmN1cnJUcmFucy52YWx1ZSk7XG5cbiAgICAgIGlmICh0aGlzLnRyYWNrUG9zaXRpb24pIHtcbiAgICAgICAgdGhpcy5vbGRUcmFucy5hZGQodGhpcy50ZW1wVHJhbnMpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnRlbXBUcmFucy5yZXNldCgpO1xuXG4gICAgICBpZiAoIXRoaXMudHJhY2tQb3NpdGlvbikge1xuICAgICAgICB0aGlzLnRyYW5zZm9ybSgpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBlbGVtZW50ID0gdGhpcy5nZXREcmFnRWwoKTtcbiAgICAgIHRoaXMucmVuZGVyZXIucmVtb3ZlQ2xhc3MoZWxlbWVudCwgJ25nLWRyYWdnaW5nJyk7XG5cbiAgICAgIC8qKlxuICAgICAgICogRml4IHBlcmZvcm1hbmNlIGlzc3VlOlxuICAgICAgICogaHR0cHM6Ly9naXRodWIuY29tL3hpZXppeXUvYW5ndWxhcjItZHJhZ2dhYmxlL2lzc3Vlcy8xMTJcbiAgICAgICAqL1xuICAgICAgdGhpcy51bnN1YnNjcmliZUV2ZW50cygpO1xuICAgIH1cbiAgfVxuXG4gIGNoZWNrSGFuZGxlVGFyZ2V0KHRhcmdldDogRXZlbnRUYXJnZXQsIGVsZW1lbnQ6IEVsZW1lbnQpIHtcbiAgICAvLyBDaGVja3MgaWYgdGhlIHRhcmdldCBpcyB0aGUgZWxlbWVudCBjbGlja2VkLCB0aGVuIGNoZWNrcyBlYWNoIGNoaWxkIGVsZW1lbnQgb2YgZWxlbWVudCBhcyB3ZWxsXG4gICAgLy8gSWdub3JlcyBidXR0b24gY2xpY2tzXG5cbiAgICAvLyBJZ25vcmUgZWxlbWVudHMgb2YgdHlwZSBidXR0b25cbiAgICBpZiAoZWxlbWVudC50YWdOYW1lID09PSAnQlVUVE9OJykge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIC8vIElmIHRoZSB0YXJnZXQgd2FzIGZvdW5kLCByZXR1cm4gdHJ1ZSAoaGFuZGxlIHdhcyBmb3VuZClcbiAgICBpZiAoZWxlbWVudCA9PT0gdGFyZ2V0KSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICAvLyBSZWN1cnNpdmVseSBpdGVyYXRlIHRoaXMgZWxlbWVudHMgY2hpbGRyZW5cbiAgICBmb3IgKGxldCBjaGlsZCBpbiBlbGVtZW50LmNoaWxkcmVuKSB7XG4gICAgICBpZiAoZWxlbWVudC5jaGlsZHJlbi5oYXNPd25Qcm9wZXJ0eShjaGlsZCkpIHtcbiAgICAgICAgaWYgKHRoaXMuY2hlY2tIYW5kbGVUYXJnZXQodGFyZ2V0LCBlbGVtZW50LmNoaWxkcmVuW2NoaWxkXSkpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIC8vIEhhbmRsZSB3YXMgbm90IGZvdW5kIGluIHRoaXMgbGluZWFnZVxuICAgIC8vIE5vdGU6IHJldHVybiBmYWxzZSBpcyBpZ25vcmUgdW5sZXNzIGl0IGlzIHRoZSBwYXJlbnQgZWxlbWVudFxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ21vdXNlZG93bicsIFsnJGV2ZW50J10pXG4gIEBIb3N0TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCBbJyRldmVudCddKVxuICBvbk1vdXNlRG93bihldmVudDogTW91c2VFdmVudCB8IFRvdWNoRXZlbnQpIHtcbiAgICAvLyAxLiBza2lwIHJpZ2h0IGNsaWNrO1xuICAgIGlmIChldmVudCBpbnN0YW5jZW9mIE1vdXNlRXZlbnQgJiYgZXZlbnQuYnV0dG9uID09PSAyKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIC8vIDIuIGlmIGhhbmRsZSBpcyBzZXQsIHRoZSBlbGVtZW50IGNhbiBvbmx5IGJlIG1vdmVkIGJ5IGhhbmRsZVxuICAgIGxldCB0YXJnZXQgPSBldmVudC50YXJnZXQgfHwgZXZlbnQuc3JjRWxlbWVudDtcbiAgICBpZiAodGhpcy5oYW5kbGUgIT09IHVuZGVmaW5lZCAmJiAhdGhpcy5jaGVja0hhbmRsZVRhcmdldCh0YXJnZXQsIHRoaXMuaGFuZGxlKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIDMuIGlmIGFsbG93IGRyYWcgaXMgc2V0IHRvIGZhbHNlLCBpZ25vcmUgdGhlIG1vdXNlZG93blxuICAgIGlmICh0aGlzLmFsbG93RHJhZyA9PT0gZmFsc2UpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5wcmV2ZW50RGVmYXVsdEV2ZW50KSB7XG4gICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgfVxuXG4gICAgdGhpcy5vcmlnbmFsID0gUG9zaXRpb24uZnJvbUV2ZW50KGV2ZW50LCB0aGlzLmdldERyYWdFbCgpKTtcbiAgICB0aGlzLnBpY2tVcCgpO1xuICB9XG5cbiAgb25Nb3VzZU1vdmUoZXZlbnQ6IE1vdXNlRXZlbnQgfCBUb3VjaEV2ZW50KSB7XG4gICAgaWYgKHRoaXMubW92aW5nICYmIHRoaXMuYWxsb3dEcmFnKSB7XG4gICAgICBpZiAodGhpcy5wcmV2ZW50RGVmYXVsdEV2ZW50KSB7XG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgfVxuXG4gICAgICAvLyBBZGQgYSB0cmFuc3BhcmVudCBoZWxwZXIgZGl2OlxuICAgICAgdGhpcy5faGVscGVyQmxvY2suYWRkKCk7XG4gICAgICB0aGlzLm1vdmVUbyhQb3NpdGlvbi5mcm9tRXZlbnQoZXZlbnQsIHRoaXMuZ2V0RHJhZ0VsKCkpKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==