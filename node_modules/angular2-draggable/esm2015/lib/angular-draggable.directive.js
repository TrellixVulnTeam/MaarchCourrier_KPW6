/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Directive, ElementRef, Renderer2, Input, Output, HostListener, EventEmitter } from '@angular/core';
import { fromEvent } from 'rxjs';
import { Position } from './models/position';
import { HelperBlock } from './widgets/helper-block';
export class AngularDraggableDirective {
    /**
     * @param {?} el
     * @param {?} renderer
     */
    constructor(el, renderer) {
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
    /**
     * Set z-index when not dragging
     * @param {?} setting
     * @return {?}
     */
    set zIndex(setting) {
        this.renderer.setStyle(this.el.nativeElement, 'z-index', setting);
        this._zIndex = setting;
    }
    /**
     * @param {?} setting
     * @return {?}
     */
    set ngDraggable(setting) {
        if (setting !== undefined && setting !== null && setting !== '') {
            this.allowDrag = !!setting;
            /** @type {?} */
            let element = this.getDragEl();
            if (this.allowDrag) {
                this.renderer.addClass(element, 'ng-draggable');
            }
            else {
                this.putBack();
                this.renderer.removeClass(element, 'ng-draggable');
            }
        }
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        if (this.allowDrag) {
            /** @type {?} */
            let element = this.getDragEl();
            this.renderer.addClass(element, 'ng-draggable');
        }
        this.resetPosition();
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
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
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        if (changes['position'] && !changes['position'].isFirstChange()) {
            /** @type {?} */
            let p = changes['position'].currentValue;
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
    }
    /**
     * @return {?}
     */
    ngAfterViewInit() {
        if (this.inBounds) {
            this.boundsCheck();
            this.oldTrans.add(this.tempTrans);
            this.tempTrans.reset();
        }
    }
    /**
     * @private
     * @return {?}
     */
    getDragEl() {
        return this.handle ? this.handle : this.el.nativeElement;
    }
    /**
     * @return {?}
     */
    resetPosition() {
        if (Position.isIPosition(this.position)) {
            this.oldTrans.set(this.position);
        }
        else {
            this.oldTrans.reset();
        }
        this.tempTrans.reset();
        this.transform();
    }
    /**
     * @private
     * @param {?} p
     * @return {?}
     */
    moveTo(p) {
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
    }
    /**
     * @private
     * @return {?}
     */
    transform() {
        /** @type {?} */
        let translateX = this.tempTrans.x + this.oldTrans.x;
        /** @type {?} */
        let translateY = this.tempTrans.y + this.oldTrans.y;
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
        let value = `translate(${Math.round(translateX)}px, ${Math.round(translateY)}px)`;
        this.renderer.setStyle(this.el.nativeElement, 'transform', value);
        this.renderer.setStyle(this.el.nativeElement, '-webkit-transform', value);
        this.renderer.setStyle(this.el.nativeElement, '-ms-transform', value);
        this.renderer.setStyle(this.el.nativeElement, '-moz-transform', value);
        this.renderer.setStyle(this.el.nativeElement, '-o-transform', value);
        // save current position
        this.currTrans.x = translateX;
        this.currTrans.y = translateY;
    }
    /**
     * @private
     * @return {?}
     */
    pickUp() {
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
            const element = this.getDragEl();
            this.renderer.addClass(element, 'ng-dragging');
            /**
             * Fix performance issue:
             * https://github.com/xieziyu/angular2-draggable/issues/112
             */
            this.subscribeEvents();
        }
    }
    /**
     * @private
     * @return {?}
     */
    subscribeEvents() {
        this.draggingSub = fromEvent(document, 'mousemove', { passive: false }).subscribe(event => this.onMouseMove((/** @type {?} */ (event))));
        this.draggingSub.add(fromEvent(document, 'touchmove', { passive: false }).subscribe(event => this.onMouseMove((/** @type {?} */ (event)))));
        this.draggingSub.add(fromEvent(document, 'mouseup', { passive: false }).subscribe(() => this.putBack()));
        // checking if browser is IE or Edge - https://github.com/xieziyu/angular2-draggable/issues/153
        /** @type {?} */
        let isIEOrEdge = /msie\s|trident\//i.test(window.navigator.userAgent);
        if (!isIEOrEdge) {
            this.draggingSub.add(fromEvent(document, 'mouseleave', { passive: false }).subscribe(() => this.putBack()));
        }
        this.draggingSub.add(fromEvent(document, 'touchend', { passive: false }).subscribe(() => this.putBack()));
        this.draggingSub.add(fromEvent(document, 'touchcancel', { passive: false }).subscribe(() => this.putBack()));
    }
    /**
     * @private
     * @return {?}
     */
    unsubscribeEvents() {
        this.draggingSub.unsubscribe();
        this.draggingSub = null;
    }
    /**
     * @return {?}
     */
    boundsCheck() {
        if (this.bounds) {
            /** @type {?} */
            let boundary = this.bounds.getBoundingClientRect();
            /** @type {?} */
            let elem = this.el.nativeElement.getBoundingClientRect();
            /** @type {?} */
            let result = {
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
    }
    /**
     * Get current offset
     * @return {?}
     */
    getCurrentOffset() {
        return this.currTrans.value;
    }
    /**
     * @private
     * @return {?}
     */
    putBack() {
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
            const element = this.getDragEl();
            this.renderer.removeClass(element, 'ng-dragging');
            /**
             * Fix performance issue:
             * https://github.com/xieziyu/angular2-draggable/issues/112
             */
            this.unsubscribeEvents();
        }
    }
    /**
     * @param {?} target
     * @param {?} element
     * @return {?}
     */
    checkHandleTarget(target, element) {
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
        for (let child in element.children) {
            if (element.children.hasOwnProperty(child)) {
                if (this.checkHandleTarget(target, element.children[child])) {
                    return true;
                }
            }
        }
        // Handle was not found in this lineage
        // Note: return false is ignore unless it is the parent element
        return false;
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onMouseDown(event) {
        // 1. skip right click;
        if (event instanceof MouseEvent && event.button === 2) {
            return;
        }
        // 2. if handle is set, the element can only be moved by handle
        /** @type {?} */
        let target = event.target || event.srcElement;
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
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onMouseMove(event) {
        if (this.moving && this.allowDrag) {
            if (this.preventDefaultEvent) {
                event.stopPropagation();
                event.preventDefault();
            }
            // Add a transparent helper div:
            this._helperBlock.add();
            this.moveTo(Position.fromEvent(event, this.getDragEl()));
        }
    }
}
AngularDraggableDirective.decorators = [
    { type: Directive, args: [{
                selector: '[ngDraggable]',
                exportAs: 'ngDraggable'
            },] }
];
/** @nocollapse */
AngularDraggableDirective.ctorParameters = () => [
    { type: ElementRef },
    { type: Renderer2 }
];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5ndWxhci1kcmFnZ2FibGUuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhcjItZHJhZ2dhYmxlLyIsInNvdXJjZXMiOlsibGliL2FuZ3VsYXItZHJhZ2dhYmxlLmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUNMLFNBQVMsRUFBRSxVQUFVLEVBQUUsU0FBUyxFQUNoQyxLQUFLLEVBQUUsTUFBTSxFQUFVLFlBQVksRUFDbkMsWUFBWSxFQUNiLE1BQU0sZUFBZSxDQUFDO0FBRXZCLE9BQU8sRUFBZ0IsU0FBUyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQy9DLE9BQU8sRUFBYSxRQUFRLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUN4RCxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFNckQsTUFBTSxPQUFPLHlCQUF5Qjs7Ozs7SUF3RnBDLFlBQW9CLEVBQWMsRUFBVSxRQUFtQjtRQUEzQyxPQUFFLEdBQUYsRUFBRSxDQUFZO1FBQVUsYUFBUSxHQUFSLFFBQVEsQ0FBVztRQXZGdkQsY0FBUyxHQUFHLElBQUksQ0FBQztRQUNqQixXQUFNLEdBQUcsS0FBSyxDQUFDO1FBQ2YsWUFBTyxHQUFhLElBQUksQ0FBQztRQUN6QixhQUFRLEdBQUcsSUFBSSxRQUFRLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQzlCLGNBQVMsR0FBRyxJQUFJLFFBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDL0IsY0FBUyxHQUFHLElBQUksUUFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUMvQixjQUFTLEdBQUcsRUFBRSxDQUFDO1FBQ2YsWUFBTyxHQUFHLEVBQUUsQ0FBQztRQUNiLGtCQUFhLEdBQUcsS0FBSyxDQUFDO1FBRXRCLGdCQUFXLEdBQWlCLElBQUksQ0FBQzs7Ozs7UUFNakMsaUJBQVksR0FBZ0IsSUFBSSxDQUFDO1FBRS9CLFlBQU8s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b250ZW50IjpbImltcG9ydCB7XG4gIERpcmVjdGl2ZSwgRWxlbWVudFJlZiwgUmVuZGVyZXIyLFxuICBJbnB1dCwgT3V0cHV0LCBPbkluaXQsIEhvc3RMaXN0ZW5lcixcbiAgRXZlbnRFbWl0dGVyLCBPbkNoYW5nZXMsIFNpbXBsZUNoYW5nZXMsIE9uRGVzdHJveSwgQWZ0ZXJWaWV3SW5pdFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgU3Vic2NyaXB0aW9uLCBmcm9tRXZlbnQgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IElQb3NpdGlvbiwgUG9zaXRpb24gfSBmcm9tICcuL21vZGVscy9wb3NpdGlvbic7XG5pbXBvcnQgeyBIZWxwZXJCbG9jayB9IGZyb20gJy4vd2lkZ2V0cy9oZWxwZXItYmxvY2snO1xuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbbmdEcmFnZ2FibGVdJyxcbiAgZXhwb3J0QXM6ICduZ0RyYWdnYWJsZSdcbn0pXG5leHBvcnQgY2xhc3MgQW5ndWxhckRyYWdnYWJsZURpcmVjdGl2ZSBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95LCBPbkNoYW5nZXMsIEFmdGVyVmlld0luaXQge1xuICBwcml2YXRlIGFsbG93RHJhZyA9IHRydWU7XG4gIHByaXZhdGUgbW92aW5nID0gZmFsc2U7XG4gIHByaXZhdGUgb3JpZ25hbDogUG9zaXRpb24gPSBudWxsO1xuICBwcml2YXRlIG9sZFRyYW5zID0gbmV3IFBvc2l0aW9uKDAsIDApO1xuICBwcml2YXRlIHRlbXBUcmFucyA9IG5ldyBQb3NpdGlvbigwLCAwKTtcbiAgcHJpdmF0ZSBjdXJyVHJhbnMgPSBuZXcgUG9zaXRpb24oMCwgMCk7XG4gIHByaXZhdGUgb2xkWkluZGV4ID0gJyc7XG4gIHByaXZhdGUgX3pJbmRleCA9ICcnO1xuICBwcml2YXRlIG5lZWRUcmFuc2Zvcm0gPSBmYWxzZTtcblxuICBwcml2YXRlIGRyYWdnaW5nU3ViOiBTdWJzY3JpcHRpb24gPSBudWxsO1xuXG4gIC8qKlxuICAgKiBCdWdmaXg6IGlGcmFtZXMsIGFuZCBjb250ZXh0IHVucmVsYXRlZCBlbGVtZW50cyBibG9jayBhbGwgZXZlbnRzLCBhbmQgYXJlIHVudXNhYmxlXG4gICAqIGh0dHBzOi8vZ2l0aHViLmNvbS94aWV6aXl1L2FuZ3VsYXIyLWRyYWdnYWJsZS9pc3N1ZXMvODRcbiAgICovXG4gIHByaXZhdGUgX2hlbHBlckJsb2NrOiBIZWxwZXJCbG9jayA9IG51bGw7XG5cbiAgQE91dHB1dCgpIHN0YXJ0ZWQgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcbiAgQE91dHB1dCgpIHN0b3BwZWQgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcbiAgQE91dHB1dCgpIGVkZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcblxuICAvKiogTWFrZSB0aGUgaGFuZGxlIEhUTUxFbGVtZW50IGRyYWdnYWJsZSAqL1xuICBASW5wdXQoKSBoYW5kbGU6IEhUTUxFbGVtZW50O1xuXG4gIC8qKiBTZXQgdGhlIGJvdW5kcyBIVE1MRWxlbWVudCAqL1xuICBASW5wdXQoKSBib3VuZHM6IEhUTUxFbGVtZW50O1xuXG4gIC8qKiBMaXN0IG9mIGFsbG93ZWQgb3V0IG9mIGJvdW5kcyBlZGdlcyAqKi9cbiAgQElucHV0KCkgb3V0T2ZCb3VuZHMgPSB7XG4gICAgdG9wOiBmYWxzZSxcbiAgICByaWdodDogZmFsc2UsXG4gICAgYm90dG9tOiBmYWxzZSxcbiAgICBsZWZ0OiBmYWxzZVxuICB9O1xuXG4gIC8qKiBSb3VuZCB0aGUgcG9zaXRpb24gdG8gbmVhcmVzdCBncmlkICovXG4gIEBJbnB1dCgpIGdyaWRTaXplID0gMTtcblxuICAvKiogU2V0IHotaW5kZXggd2hlbiBkcmFnZ2luZyAqL1xuICBASW5wdXQoKSB6SW5kZXhNb3Zpbmc6IHN0cmluZztcblxuICAvKiogU2V0IHotaW5kZXggd2hlbiBub3QgZHJhZ2dpbmcgKi9cbiAgQElucHV0KCkgc2V0IHpJbmRleChzZXR0aW5nOiBzdHJpbmcpIHtcbiAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKHRoaXMuZWwubmF0aXZlRWxlbWVudCwgJ3otaW5kZXgnLCBzZXR0aW5nKTtcbiAgICB0aGlzLl96SW5kZXggPSBzZXR0aW5nO1xuICB9XG4gIC8qKiBXaGV0aGVyIHRvIGxpbWl0IHRoZSBlbGVtZW50IHN0YXkgaW4gdGhlIGJvdW5kcyAqL1xuICBASW5wdXQoKSBpbkJvdW5kcyA9IGZhbHNlO1xuXG4gIC8qKiBXaGV0aGVyIHRoZSBlbGVtZW50IHNob3VsZCB1c2UgaXQncyBwcmV2aW91cyBkcmFnIHBvc2l0aW9uIG9uIGEgbmV3IGRyYWcgZXZlbnQuICovXG4gIEBJbnB1dCgpIHRyYWNrUG9zaXRpb24gPSB0cnVlO1xuXG4gIC8qKiBJbnB1dCBjc3Mgc2NhbGUgdHJhbnNmb3JtIG9mIGVsZW1lbnQgc28gdHJhbnNsYXRpb25zIGFyZSBjb3JyZWN0ICovXG4gIEBJbnB1dCgpIHNjYWxlID0gMTtcblxuICAvKiogV2hldGhlciB0byBwcmV2ZW50IGRlZmF1bHQgZXZlbnQgKi9cbiAgQElucHV0KCkgcHJldmVudERlZmF1bHRFdmVudCA9IGZhbHNlO1xuXG4gIC8qKiBTZXQgaW5pdGlhbCBwb3NpdGlvbiBieSBvZmZzZXRzICovXG4gIEBJbnB1dCgpIHBvc2l0aW9uOiBJUG9zaXRpb24gPSB7IHg6IDAsIHk6IDAgfTtcblxuICAvKiogTG9jayBheGlzOiAneCcgb3IgJ3knICovXG4gIEBJbnB1dCgpIGxvY2tBeGlzOiBzdHJpbmcgPSBudWxsO1xuXG4gIC8qKiBFbWl0IHBvc2l0aW9uIG9mZnNldHMgd2hlbiBtb3ZpbmcgKi9cbiAgQE91dHB1dCgpIG1vdmluZ09mZnNldCA9IG5ldyBFdmVudEVtaXR0ZXI8SVBvc2l0aW9uPigpO1xuXG4gIC8qKiBFbWl0IHBvc2l0aW9uIG9mZnNldHMgd2hlbiBwdXQgYmFjayAqL1xuICBAT3V0cHV0KCkgZW5kT2Zmc2V0ID0gbmV3IEV2ZW50RW1pdHRlcjxJUG9zaXRpb24+KCk7XG5cbiAgQElucHV0KClcbiAgc2V0IG5nRHJhZ2dhYmxlKHNldHRpbmc6IGFueSkge1xuICAgIGlmIChzZXR0aW5nICE9PSB1bmRlZmluZWQgJiYgc2V0dGluZyAhPT0gbnVsbCAmJiBzZXR0aW5nICE9PSAnJykge1xuICAgICAgdGhpcy5hbGxvd0RyYWcgPSAhIXNldHRpbmc7XG5cbiAgICAgIGxldCBlbGVtZW50ID0gdGhpcy5nZXREcmFnRWwoKTtcblxuICAgICAgaWYgKHRoaXMuYWxsb3dEcmFnKSB7XG4gICAgICAgIHRoaXMucmVuZGVyZXIuYWRkQ2xhc3MoZWxlbWVudCwgJ25nLWRyYWdnYWJsZScpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5wdXRCYWNrKCk7XG4gICAgICAgIHRoaXMucmVuZGVyZXIucmVtb3ZlQ2xhc3MoZWxlbWVudCwgJ25nLWRyYWdnYWJsZScpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgZWw6IEVsZW1lbnRSZWYsIHByaXZhdGUgcmVuZGVyZXI6IFJlbmRlcmVyMikge1xuICAgIHRoaXMuX2hlbHBlckJsb2NrID0gbmV3IEhlbHBlckJsb2NrKGVsLm5hdGl2ZUVsZW1lbnQsIHJlbmRlcmVyKTtcbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIGlmICh0aGlzLmFsbG93RHJhZykge1xuICAgICAgbGV0IGVsZW1lbnQgPSB0aGlzLmdldERyYWdFbCgpO1xuICAgICAgdGhpcy5yZW5kZXJlci5hZGRDbGFzcyhlbGVtZW50LCAnbmctZHJhZ2dhYmxlJyk7XG4gICAgfVxuICAgIHRoaXMucmVzZXRQb3NpdGlvbigpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5ib3VuZHMgPSBudWxsO1xuICAgIHRoaXMuaGFuZGxlID0gbnVsbDtcbiAgICB0aGlzLm9yaWduYWwgPSBudWxsO1xuICAgIHRoaXMub2xkVHJhbnMgPSBudWxsO1xuICAgIHRoaXMudGVtcFRyYW5zID0gbnVsbDtcbiAgICB0aGlzLmN1cnJUcmFucyA9IG51bGw7XG4gICAgdGhpcy5faGVscGVyQmxvY2suZGlzcG9zZSgpO1xuICAgIHRoaXMuX2hlbHBlckJsb2NrID0gbnVsbDtcblxuICAgIGlmICh0aGlzLmRyYWdnaW5nU3ViKSB7XG4gICAgICB0aGlzLmRyYWdnaW5nU3ViLnVuc3Vic2NyaWJlKCk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xuICAgIGlmIChjaGFuZ2VzWydwb3NpdGlvbiddICYmICFjaGFuZ2VzWydwb3NpdGlvbiddLmlzRmlyc3RDaGFuZ2UoKSkge1xuICAgICAgbGV0IHAgPSBjaGFuZ2VzWydwb3NpdGlvbiddLmN1cnJlbnRWYWx1ZTtcblxuICAgICAgaWYgKCF0aGlzLm1vdmluZykge1xuICAgICAgICBpZiAoUG9zaXRpb24uaXNJUG9zaXRpb24ocCkpIHtcbiAgICAgICAgICB0aGlzLm9sZFRyYW5zLnNldChwKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLm9sZFRyYW5zLnJlc2V0KCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnRyYW5zZm9ybSgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5uZWVkVHJhbnNmb3JtID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgaWYgKHRoaXMuaW5Cb3VuZHMpIHtcbiAgICAgIHRoaXMuYm91bmRzQ2hlY2soKTtcbiAgICAgIHRoaXMub2xkVHJhbnMuYWRkKHRoaXMudGVtcFRyYW5zKTtcbiAgICAgIHRoaXMudGVtcFRyYW5zLnJlc2V0KCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBnZXREcmFnRWwoKSB7XG4gICAgcmV0dXJuIHRoaXMuaGFuZGxlID8gdGhpcy5oYW5kbGUgOiB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQ7XG4gIH1cblxuICByZXNldFBvc2l0aW9uKCkge1xuICAgIGlmIChQb3NpdGlvbi5pc0lQb3NpdGlvbih0aGlzLnBvc2l0aW9uKSkge1xuICAgICAgdGhpcy5vbGRUcmFucy5zZXQodGhpcy5wb3NpdGlvbik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMub2xkVHJhbnMucmVzZXQoKTtcbiAgICB9XG4gICAgdGhpcy50ZW1wVHJhbnMucmVzZXQoKTtcbiAgICB0aGlzLnRyYW5zZm9ybSgpO1xuICB9XG5cbiAgcHJpdmF0ZSBtb3ZlVG8ocDogUG9zaXRpb24pIHtcbiAgICBpZiAodGhpcy5vcmlnbmFsKSB7XG4gICAgICBwLnN1YnRyYWN0KHRoaXMub3JpZ25hbCk7XG4gICAgICB0aGlzLnRlbXBUcmFucy5zZXQocCk7XG4gICAgICB0aGlzLnRlbXBUcmFucy5kaXZpZGUodGhpcy5zY2FsZSk7XG4gICAgICB0aGlzLnRyYW5zZm9ybSgpO1xuXG4gICAgICBpZiAodGhpcy5ib3VuZHMpIHtcbiAgICAgICAgdGhpcy5lZGdlLmVtaXQodGhpcy5ib3VuZHNDaGVjaygpKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5tb3ZpbmdPZmZzZXQuZW1pdCh0aGlzLmN1cnJUcmFucy52YWx1ZSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSB0cmFuc2Zvcm0oKSB7XG4gICAgbGV0IHRyYW5zbGF0ZVggPSB0aGlzLnRlbXBUcmFucy54ICsgdGhpcy5vbGRUcmFucy54O1xuICAgIGxldCB0cmFuc2xhdGVZID0gdGhpcy50ZW1wVHJhbnMueSArIHRoaXMub2xkVHJhbnMueTtcblxuICAgIGlmICh0aGlzLmxvY2tBeGlzID09PSAneCcpIHtcbiAgICAgIHRyYW5zbGF0ZVggPSB0aGlzLm9sZFRyYW5zLng7XG4gICAgICB0aGlzLnRlbXBUcmFucy54ID0gMDtcbiAgICB9IGVsc2UgaWYgKHRoaXMubG9ja0F4aXMgPT09ICd5Jykge1xuICAgICAgdHJhbnNsYXRlWSA9IHRoaXMub2xkVHJhbnMueTtcbiAgICAgIHRoaXMudGVtcFRyYW5zLnkgPSAwO1xuICAgIH1cblxuICAgIC8vIFNuYXAgdG8gZ3JpZDogYnkgZ3JpZCBzaXplXG4gICAgaWYgKHRoaXMuZ3JpZFNpemUgPiAxKSB7XG4gICAgICB0cmFuc2xhdGVYID0gTWF0aC5yb3VuZCh0cmFuc2xhdGVYIC8gdGhpcy5ncmlkU2l6ZSkgKiB0aGlzLmdyaWRTaXplO1xuICAgICAgdHJhbnNsYXRlWSA9IE1hdGgucm91bmQodHJhbnNsYXRlWSAvIHRoaXMuZ3JpZFNpemUpICogdGhpcy5ncmlkU2l6ZTtcbiAgICB9XG5cbiAgICBsZXQgdmFsdWUgPSBgdHJhbnNsYXRlKCR7IE1hdGgucm91bmQodHJhbnNsYXRlWCkgfXB4LCAkeyBNYXRoLnJvdW5kKHRyYW5zbGF0ZVkpIH1weClgO1xuXG4gICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsICd0cmFuc2Zvcm0nLCB2YWx1ZSk7XG4gICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsICctd2Via2l0LXRyYW5zZm9ybScsIHZhbHVlKTtcbiAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKHRoaXMuZWwubmF0aXZlRWxlbWVudCwgJy1tcy10cmFuc2Zvcm0nLCB2YWx1ZSk7XG4gICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsICctbW96LXRyYW5zZm9ybScsIHZhbHVlKTtcbiAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKHRoaXMuZWwubmF0aXZlRWxlbWVudCwgJy1vLXRyYW5zZm9ybScsIHZhbHVlKTtcblxuICAgIC8vIHNhdmUgY3VycmVudCBwb3NpdGlvblxuICAgIHRoaXMuY3VyclRyYW5zLnggPSB0cmFuc2xhdGVYO1xuICAgIHRoaXMuY3VyclRyYW5zLnkgPSB0cmFuc2xhdGVZO1xuICB9XG5cbiAgcHJpdmF0ZSBwaWNrVXAoKSB7XG4gICAgLy8gZ2V0IG9sZCB6LWluZGV4OlxuICAgIHRoaXMub2xkWkluZGV4ID0gdGhpcy5lbC5uYXRpdmVFbGVtZW50LnN0eWxlLnpJbmRleCA/IHRoaXMuZWwubmF0aXZlRWxlbWVudC5zdHlsZS56SW5kZXggOiAnJztcblxuICAgIGlmICh3aW5kb3cpIHtcbiAgICAgIHRoaXMub2xkWkluZGV4ID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUodGhpcy5lbC5uYXRpdmVFbGVtZW50LCBudWxsKS5nZXRQcm9wZXJ0eVZhbHVlKCd6LWluZGV4Jyk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuekluZGV4TW92aW5nKSB7XG4gICAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKHRoaXMuZWwubmF0aXZlRWxlbWVudCwgJ3otaW5kZXgnLCB0aGlzLnpJbmRleE1vdmluZyk7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLm1vdmluZykge1xuICAgICAgdGhpcy5zdGFydGVkLmVtaXQodGhpcy5lbC5uYXRpdmVFbGVtZW50KTtcbiAgICAgIHRoaXMubW92aW5nID0gdHJ1ZTtcblxuICAgICAgY29uc3QgZWxlbWVudCA9IHRoaXMuZ2V0RHJhZ0VsKCk7XG4gICAgICB0aGlzLnJlbmRlcmVyLmFkZENsYXNzKGVsZW1lbnQsICduZy1kcmFnZ2luZycpO1xuXG4gICAgICAvKipcbiAgICAgICAqIEZpeCBwZXJmb3JtYW5jZSBpc3N1ZTpcbiAgICAgICAqIGh0dHBzOi8vZ2l0aHViLmNvbS94aWV6aXl1L2FuZ3VsYXIyLWRyYWdnYWJsZS9pc3N1ZXMvMTEyXG4gICAgICAgKi9cbiAgICAgIHRoaXMuc3Vic2NyaWJlRXZlbnRzKCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBzdWJzY3JpYmVFdmVudHMoKSB7XG4gICAgdGhpcy5kcmFnZ2luZ1N1YiA9IGZyb21FdmVudChkb2N1bWVudCwgJ21vdXNlbW92ZScsIHsgcGFzc2l2ZTogZmFsc2UgfSkuc3Vic2NyaWJlKGV2ZW50ID0+IHRoaXMub25Nb3VzZU1vdmUoZXZlbnQgYXMgTW91c2VFdmVudCkpO1xuICAgIHRoaXMuZHJhZ2dpbmdTdWIuYWRkKGZyb21FdmVudChkb2N1bWVudCwgJ3RvdWNobW92ZScsIHsgcGFzc2l2ZTogZmFsc2UgfSkuc3Vic2NyaWJlKGV2ZW50ID0+IHRoaXMub25Nb3VzZU1vdmUoZXZlbnQgYXMgVG91Y2hFdmVudCkpKTtcbiAgICB0aGlzLmRyYWdnaW5nU3ViLmFkZChmcm9tRXZlbnQoZG9jdW1lbnQsICdtb3VzZXVwJywgeyBwYXNzaXZlOiBmYWxzZSB9KS5zdWJzY3JpYmUoKCkgPT4gdGhpcy5wdXRCYWNrKCkpKTtcbiAgICAvLyBjaGVja2luZyBpZiBicm93c2VyIGlzIElFIG9yIEVkZ2UgLSBodHRwczovL2dpdGh1Yi5jb20veGlleml5dS9hbmd1bGFyMi1kcmFnZ2FibGUvaXNzdWVzLzE1M1xuICAgIGxldCBpc0lFT3JFZGdlID0gL21zaWVcXHN8dHJpZGVudFxcLy9pLnRlc3Qod2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQpO1xuICAgIGlmICghaXNJRU9yRWRnZSkge1xuICAgICAgdGhpcy5kcmFnZ2luZ1N1Yi5hZGQoZnJvbUV2ZW50KGRvY3VtZW50LCAnbW91c2VsZWF2ZScsIHtwYXNzaXZlOiBmYWxzZX0pLnN1YnNjcmliZSgoKSA9PiB0aGlzLnB1dEJhY2soKSkpO1xuICAgIH1cbiAgICB0aGlzLmRyYWdnaW5nU3ViLmFkZChmcm9tRXZlbnQoZG9jdW1lbnQsICd0b3VjaGVuZCcsIHsgcGFzc2l2ZTogZmFsc2UgfSkuc3Vic2NyaWJlKCgpID0+IHRoaXMucHV0QmFjaygpKSk7XG4gICAgdGhpcy5kcmFnZ2luZ1N1Yi5hZGQoZnJvbUV2ZW50KGRvY3VtZW50LCAndG91Y2hjYW5jZWwnLCB7IHBhc3NpdmU6IGZhbHNlIH0pLnN1YnNjcmliZSgoKSA9PiB0aGlzLnB1dEJhY2soKSkpO1xuICB9XG5cbiAgcHJpdmF0ZSB1bnN1YnNjcmliZUV2ZW50cygpIHtcbiAgICB0aGlzLmRyYWdnaW5nU3ViLnVuc3Vic2NyaWJlKCk7XG4gICAgdGhpcy5kcmFnZ2luZ1N1YiA9IG51bGw7XG4gIH1cblxuICBib3VuZHNDaGVjaygpIHtcbiAgICBpZiAodGhpcy5ib3VuZHMpIHtcbiAgICAgIGxldCBib3VuZGFyeSA9IHRoaXMuYm91bmRzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgbGV0IGVsZW0gPSB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICBsZXQgcmVzdWx0ID0ge1xuICAgICAgICAndG9wJzogdGhpcy5vdXRPZkJvdW5kcy50b3AgPyB0cnVlIDogYm91bmRhcnkudG9wIDwgZWxlbS50b3AsXG4gICAgICAgICdyaWdodCc6IHRoaXMub3V0T2ZCb3VuZHMucmlnaHQgPyB0cnVlIDogYm91bmRhcnkucmlnaHQgPiBlbGVtLnJpZ2h0LFxuICAgICAgICAnYm90dG9tJzogdGhpcy5vdXRPZkJvdW5kcy5ib3R0b20gPyB0cnVlIDogYm91bmRhcnkuYm90dG9tID4gZWxlbS5ib3R0b20sXG4gICAgICAgICdsZWZ0JzogdGhpcy5vdXRPZkJvdW5kcy5sZWZ0ID8gdHJ1ZSA6IGJvdW5kYXJ5LmxlZnQgPCBlbGVtLmxlZnRcbiAgICAgIH07XG5cbiAgICAgIGlmICh0aGlzLmluQm91bmRzKSB7XG4gICAgICAgIGlmICghcmVzdWx0LnRvcCkge1xuICAgICAgICAgIHRoaXMudGVtcFRyYW5zLnkgLT0gKGVsZW0udG9wIC0gYm91bmRhcnkudG9wKSAvIHRoaXMuc2NhbGU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXJlc3VsdC5ib3R0b20pIHtcbiAgICAgICAgICB0aGlzLnRlbXBUcmFucy55IC09IChlbGVtLmJvdHRvbSAtIGJvdW5kYXJ5LmJvdHRvbSkgLyB0aGlzLnNjYWxlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFyZXN1bHQucmlnaHQpIHtcbiAgICAgICAgICB0aGlzLnRlbXBUcmFucy54IC09IChlbGVtLnJpZ2h0IC0gYm91bmRhcnkucmlnaHQpIC8gdGhpcy5zY2FsZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghcmVzdWx0LmxlZnQpIHtcbiAgICAgICAgICB0aGlzLnRlbXBUcmFucy54IC09IChlbGVtLmxlZnQgLSBib3VuZGFyeS5sZWZ0KSAvIHRoaXMuc2NhbGU7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnRyYW5zZm9ybSgpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbiAgfVxuXG4gIC8qKiBHZXQgY3VycmVudCBvZmZzZXQgKi9cbiAgZ2V0Q3VycmVudE9mZnNldCgpIHtcbiAgICByZXR1cm4gdGhpcy5jdXJyVHJhbnMudmFsdWU7XG4gIH1cblxuICBwcml2YXRlIHB1dEJhY2soKSB7XG4gICAgaWYgKHRoaXMuX3pJbmRleCkge1xuICAgICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsICd6LWluZGV4JywgdGhpcy5fekluZGV4KTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuekluZGV4TW92aW5nKSB7XG4gICAgICBpZiAodGhpcy5vbGRaSW5kZXgpIHtcbiAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQsICd6LWluZGV4JywgdGhpcy5vbGRaSW5kZXgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5lbC5uYXRpdmVFbGVtZW50LnN0eWxlLnJlbW92ZVByb3BlcnR5KCd6LWluZGV4Jyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHRoaXMubW92aW5nKSB7XG4gICAgICB0aGlzLnN0b3BwZWQuZW1pdCh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQpO1xuXG4gICAgICAvLyBSZW1vdmUgdGhlIGhlbHBlciBkaXY6XG4gICAgICB0aGlzLl9oZWxwZXJCbG9jay5yZW1vdmUoKTtcblxuICAgICAgaWYgKHRoaXMubmVlZFRyYW5zZm9ybSkge1xuICAgICAgICBpZiAoUG9zaXRpb24uaXNJUG9zaXRpb24odGhpcy5wb3NpdGlvbikpIHtcbiAgICAgICAgICB0aGlzLm9sZFRyYW5zLnNldCh0aGlzLnBvc2l0aW9uKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLm9sZFRyYW5zLnJlc2V0KCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnRyYW5zZm9ybSgpO1xuICAgICAgICB0aGlzLm5lZWRUcmFuc2Zvcm0gPSBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuYm91bmRzKSB7XG4gICAgICAgIHRoaXMuZWRnZS5lbWl0KHRoaXMuYm91bmRzQ2hlY2soKSk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMubW92aW5nID0gZmFsc2U7XG4gICAgICB0aGlzLmVuZE9mZnNldC5lbWl0KHRoaXMuY3VyclRyYW5zLnZhbHVlKTtcblxuICAgICAgaWYgKHRoaXMudHJhY2tQb3NpdGlvbikge1xuICAgICAgICB0aGlzLm9sZFRyYW5zLmFkZCh0aGlzLnRlbXBUcmFucyk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMudGVtcFRyYW5zLnJlc2V0KCk7XG5cbiAgICAgIGlmICghdGhpcy50cmFja1Bvc2l0aW9uKSB7XG4gICAgICAgIHRoaXMudHJhbnNmb3JtKCk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGVsZW1lbnQgPSB0aGlzLmdldERyYWdFbCgpO1xuICAgICAgdGhpcy5yZW5kZXJlci5yZW1vdmVDbGFzcyhlbGVtZW50LCAnbmctZHJhZ2dpbmcnKTtcblxuICAgICAgLyoqXG4gICAgICAgKiBGaXggcGVyZm9ybWFuY2UgaXNzdWU6XG4gICAgICAgKiBodHRwczovL2dpdGh1Yi5jb20veGlleml5dS9hbmd1bGFyMi1kcmFnZ2FibGUvaXNzdWVzLzExMlxuICAgICAgICovXG4gICAgICB0aGlzLnVuc3Vic2NyaWJlRXZlbnRzKCk7XG4gICAgfVxuICB9XG5cbiAgY2hlY2tIYW5kbGVUYXJnZXQodGFyZ2V0OiBFdmVudFRhcmdldCwgZWxlbWVudDogRWxlbWVudCkge1xuICAgIC8vIENoZWNrcyBpZiB0aGUgdGFyZ2V0IGlzIHRoZSBlbGVtZW50IGNsaWNrZWQsIHRoZW4gY2hlY2tzIGVhY2ggY2hpbGQgZWxlbWVudCBvZiBlbGVtZW50IGFzIHdlbGxcbiAgICAvLyBJZ25vcmVzIGJ1dHRvbiBjbGlja3NcblxuICAgIC8vIElnbm9yZSBlbGVtZW50cyBvZiB0eXBlIGJ1dHRvblxuICAgIGlmIChlbGVtZW50LnRhZ05hbWUgPT09ICdCVVRUT04nKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgLy8gSWYgdGhlIHRhcmdldCB3YXMgZm91bmQsIHJldHVybiB0cnVlIChoYW5kbGUgd2FzIGZvdW5kKVxuICAgIGlmIChlbGVtZW50ID09PSB0YXJnZXQpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIC8vIFJlY3Vyc2l2ZWx5IGl0ZXJhdGUgdGhpcyBlbGVtZW50cyBjaGlsZHJlblxuICAgIGZvciAobGV0IGNoaWxkIGluIGVsZW1lbnQuY2hpbGRyZW4pIHtcbiAgICAgIGlmIChlbGVtZW50LmNoaWxkcmVuLmhhc093blByb3BlcnR5KGNoaWxkKSkge1xuICAgICAgICBpZiAodGhpcy5jaGVja0hhbmRsZVRhcmdldCh0YXJnZXQsIGVsZW1lbnQuY2hpbGRyZW5bY2hpbGRdKSkge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gSGFuZGxlIHdhcyBub3QgZm91bmQgaW4gdGhpcyBsaW5lYWdlXG4gICAgLy8gTm90ZTogcmV0dXJuIGZhbHNlIGlzIGlnbm9yZSB1bmxlc3MgaXQgaXMgdGhlIHBhcmVudCBlbGVtZW50XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgQEhvc3RMaXN0ZW5lcignbW91c2Vkb3duJywgWyckZXZlbnQnXSlcbiAgQEhvc3RMaXN0ZW5lcigndG91Y2hzdGFydCcsIFsnJGV2ZW50J10pXG4gIG9uTW91c2VEb3duKGV2ZW50OiBNb3VzZUV2ZW50IHwgVG91Y2hFdmVudCkge1xuICAgIC8vIDEuIHNraXAgcmlnaHQgY2xpY2s7XG4gICAgaWYgKGV2ZW50IGluc3RhbmNlb2YgTW91c2VFdmVudCAmJiBldmVudC5idXR0b24gPT09IDIpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgLy8gMi4gaWYgaGFuZGxlIGlzIHNldCwgdGhlIGVsZW1lbnQgY2FuIG9ubHkgYmUgbW92ZWQgYnkgaGFuZGxlXG4gICAgbGV0IHRhcmdldCA9IGV2ZW50LnRhcmdldCB8fCBldmVudC5zcmNFbGVtZW50O1xuICAgIGlmICh0aGlzLmhhbmRsZSAhPT0gdW5kZWZpbmVkICYmICF0aGlzLmNoZWNrSGFuZGxlVGFyZ2V0KHRhcmdldCwgdGhpcy5oYW5kbGUpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gMy4gaWYgYWxsb3cgZHJhZyBpcyBzZXQgdG8gZmFsc2UsIGlnbm9yZSB0aGUgbW91c2Vkb3duXG4gICAgaWYgKHRoaXMuYWxsb3dEcmFnID09PSBmYWxzZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnByZXZlbnREZWZhdWx0RXZlbnQpIHtcbiAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB9XG5cbiAgICB0aGlzLm9yaWduYWwgPSBQb3NpdGlvbi5mcm9tRXZlbnQoZXZlbnQsIHRoaXMuZ2V0RHJhZ0VsKCkpO1xuICAgIHRoaXMucGlja1VwKCk7XG4gIH1cblxuICBvbk1vdXNlTW92ZShldmVudDogTW91c2VFdmVudCB8IFRvdWNoRXZlbnQpIHtcbiAgICBpZiAodGhpcy5tb3ZpbmcgJiYgdGhpcy5hbGxvd0RyYWcpIHtcbiAgICAgIGlmICh0aGlzLnByZXZlbnREZWZhdWx0RXZlbnQpIHtcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICB9XG5cbiAgICAgIC8vIEFkZCBhIHRyYW5zcGFyZW50IGhlbHBlciBkaXY6XG4gICAgICB0aGlzLl9oZWxwZXJCbG9jay5hZGQoKTtcbiAgICAgIHRoaXMubW92ZVRvKFBvc2l0aW9uLmZyb21FdmVudChldmVudCwgdGhpcy5nZXREcmFnRWwoKSkpO1xuICAgIH1cbiAgfVxufVxuIl19