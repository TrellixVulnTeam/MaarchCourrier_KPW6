/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Directive, ElementRef, Renderer2, Input, Output, EventEmitter } from '@angular/core';
import { fromEvent } from 'rxjs';
import { HelperBlock } from './widgets/helper-block';
import { ResizeHandle } from './widgets/resize-handle';
import { Position } from './models/position';
import { Size } from './models/size';
export class AngularResizableDirective {
    /**
     * @param {?} el
     * @param {?} renderer
     */
    constructor(el, renderer) {
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
        this.rzStart = new EventEmitter();
        /**
         * emitted when start resizing
         */
        this.rzResizing = new EventEmitter();
        /**
         * emitted when stop resizing
         */
        this.rzStop = new EventEmitter();
        this._helperBlock = new HelperBlock(el.nativeElement, renderer);
    }
    /**
     * Disables the resizable if set to false.
     * @param {?} v
     * @return {?}
     */
    set ngResizable(v) {
        if (v !== undefined && v !== null && v !== '') {
            this._resizable = !!v;
            this.updateResizable();
        }
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        if (changes['rzHandles'] && !changes['rzHandles'].isFirstChange()) {
            this.updateResizable();
        }
        if (changes['rzAspectRatio'] && !changes['rzAspectRatio'].isFirstChange()) {
            this.updateAspectRatio();
        }
        if (changes['rzContainment'] && !changes['rzContainment'].isFirstChange()) {
            this.updateContainment();
        }
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.updateResizable();
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this.removeHandles();
        this._containment = null;
        this._helperBlock.dispose();
        this._helperBlock = null;
    }
    /**
     * @return {?}
     */
    ngAfterViewInit() {
        /** @type {?} */
        const elm = this.el.nativeElement;
        this._initSize = Size.getCurrent(elm);
        this._initPos = Position.getCurrent(elm);
        this._currSize = Size.copy(this._initSize);
        this._currPos = Position.copy(this._initPos);
        this.updateAspectRatio();
        this.updateContainment();
    }
    /**
     * A method to reset size
     * @return {?}
     */
    resetSize() {
        this._currSize = Size.copy(this._initSize);
        this._currPos = Position.copy(this._initPos);
        this.doResize();
    }
    /**
     * A method to get current status
     * @return {?}
     */
    getStatus() {
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
    }
    /**
     * @private
     * @return {?}
     */
    updateResizable() {
        /** @type {?} */
        const element = this.el.nativeElement;
        // clear handles:
        this.renderer.removeClass(element, 'ng-resizable');
        this.removeHandles();
        // create new ones:
        if (this._resizable) {
            this.renderer.addClass(element, 'ng-resizable');
            this.createHandles();
        }
    }
    /**
     * Use it to update aspect
     * @private
     * @return {?}
     */
    updateAspectRatio() {
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
            let r = Number(this.rzAspectRatio);
            this._aspectRatio = isNaN(r) ? 0 : r;
        }
    }
    /**
     * Use it to update containment
     * @private
     * @return {?}
     */
    updateContainment() {
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
    }
    /**
     * Use it to create handle divs
     * @private
     * @return {?}
     */
    createHandles() {
        if (!this.rzHandles) {
            return;
        }
        /** @type {?} */
        let tmpHandleTypes;
        if (typeof this.rzHandles === 'string') {
            if (this.rzHandles === 'all') {
                tmpHandleTypes = ['n', 'e', 's', 'w', 'ne', 'se', 'nw', 'sw'];
            }
            else {
                tmpHandleTypes = this.rzHandles.replace(/ /g, '').toLowerCase().split(',');
            }
            for (let type of tmpHandleTypes) {
                // default handle theme: ng-resizable-$type.
                /** @type {?} */
                let handle = this.createHandleByType(type, `ng-resizable-${type}`);
                if (handle) {
                    this._handleType.push(type);
                    this._handles[type] = handle;
                }
            }
        }
        else {
            tmpHandleTypes = Object.keys(this.rzHandles);
            for (let type of tmpHandleTypes) {
                // custom handle theme.
                /** @type {?} */
                let handle = this.createHandleByType(type, this.rzHandles[type]);
                if (handle) {
                    this._handleType.push(type);
                    this._handles[type] = handle;
                }
            }
        }
    }
    /**
     * Use it to create a handle
     * @private
     * @param {?} type
     * @param {?} css
     * @return {?}
     */
    createHandleByType(type, css) {
        /** @type {?} */
        const _el = this.el.nativeElement;
        if (!type.match(/^(se|sw|ne|nw|n|e|s|w)$/)) {
            console.error('Invalid handle type:', type);
            return null;
        }
        return new ResizeHandle(_el, this.renderer, type, css, this.onMouseDown.bind(this));
    }
    /**
     * @private
     * @return {?}
     */
    removeHandles() {
        for (let type of this._handleType) {
            this._handles[type].dispose();
        }
        this._handleType = [];
        this._handles = {};
    }
    /**
     * @param {?} event
     * @param {?} handle
     * @return {?}
     */
    onMouseDown(event, handle) {
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
    }
    /**
     * @private
     * @return {?}
     */
    subscribeEvents() {
        this.draggingSub = fromEvent(document, 'mousemove', { passive: false }).subscribe(event => this.onMouseMove((/** @type {?} */ (event))));
        this.draggingSub.add(fromEvent(document, 'touchmove', { passive: false }).subscribe(event => this.onMouseMove((/** @type {?} */ (event)))));
        this.draggingSub.add(fromEvent(document, 'mouseup', { passive: false }).subscribe(() => this.onMouseLeave()));
        // fix for issue #164
        /** @type {?} */
        let isIEOrEdge = /msie\s|trident\//i.test(window.navigator.userAgent);
        if (!isIEOrEdge) {
            this.draggingSub.add(fromEvent(document, 'mouseleave', { passive: false }).subscribe(() => this.onMouseLeave()));
        }
        this.draggingSub.add(fromEvent(document, 'touchend', { passive: false }).subscribe(() => this.onMouseLeave()));
        this.draggingSub.add(fromEvent(document, 'touchcancel', { passive: false }).subscribe(() => this.onMouseLeave()));
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
    onMouseLeave() {
        if (this._handleResizing) {
            this.stopResize();
            this._origMousePos = null;
            this.unsubscribeEvents();
        }
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onMouseMove(event) {
        if (this._handleResizing && this._resizable && this._origMousePos && this._origPos && this._origSize) {
            this.resizeTo(Position.fromEvent(event));
            this.onResizing();
        }
    }
    /**
     * @private
     * @param {?} handle
     * @return {?}
     */
    startResize(handle) {
        /** @type {?} */
        const elm = this.el.nativeElement;
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
    }
    /**
     * @private
     * @return {?}
     */
    stopResize() {
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
    }
    /**
     * @private
     * @return {?}
     */
    onResizing() {
        this.rzResizing.emit(this.getResizingEvent());
    }
    /**
     * @private
     * @return {?}
     */
    getResizingEvent() {
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
            direction: Object.assign({}, this._directionChanged),
        };
    }
    /**
     * @private
     * @return {?}
     */
    updateDirection() {
        this._direction = {
            n: !!this._handleResizing.type.match(/n/),
            s: !!this._handleResizing.type.match(/s/),
            w: !!this._handleResizing.type.match(/w/),
            e: !!this._handleResizing.type.match(/e/)
        };
        this._directionChanged = Object.assign({}, this._direction);
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
    }
    /**
     * @private
     * @param {?} p
     * @return {?}
     */
    resizeTo(p) {
        p.subtract(this._origMousePos);
        /** @type {?} */
        const tmpX = Math.round(p.x / this._gridSize.x) * this._gridSize.x;
        /** @type {?} */
        const tmpY = Math.round(p.y / this._gridSize.y) * this._gridSize.y;
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
    }
    /**
     * @private
     * @return {?}
     */
    doResize() {
        /** @type {?} */
        const container = this.el.nativeElement;
        if (!this._direction || this._direction.n || this._direction.s || this._aspectRatio) {
            this.renderer.setStyle(container, 'height', this._currSize.height + 'px');
        }
        if (!this._direction || this._direction.w || this._direction.e || this._aspectRatio) {
            this.renderer.setStyle(container, 'width', this._currSize.width + 'px');
        }
        this.renderer.setStyle(container, 'left', this._currPos.x + 'px');
        this.renderer.setStyle(container, 'top', this._currPos.y + 'px');
    }
    /**
     * @private
     * @return {?}
     */
    adjustByRatio() {
        if (this._aspectRatio && !this._adjusted) {
            if (this._direction.e || this._direction.w) {
                /** @type {?} */
                const newHeight = Math.floor(this._currSize.width / this._aspectRatio);
                if (this._direction.n) {
                    this._currPos.y += this._currSize.height - newHeight;
                }
                this._currSize.height = newHeight;
            }
            else {
                /** @type {?} */
                const newWidth = Math.floor(this._aspectRatio * this._currSize.height);
                if (this._direction.n) {
                    this._currPos.x += this._currSize.width - newWidth;
                }
                this._currSize.width = newWidth;
            }
        }
    }
    /**
     * @private
     * @return {?}
     */
    checkBounds() {
        if (this._containment) {
            /** @type {?} */
            const maxWidth = this._bounding.width - this._bounding.pr - this._bounding.deltaL - this._bounding.translateX - this._currPos.x;
            /** @type {?} */
            const maxHeight = this._bounding.height - this._bounding.pb - this._bounding.deltaT - this._bounding.translateY - this._currPos.y;
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
                    const newWidth = Math.floor(maxHeight * this._aspectRatio);
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
                    const newHeight = Math.floor(maxWidth / this._aspectRatio);
                    if (this._direction.n) {
                        this._currPos.y += this._currSize.height - newHeight;
                    }
                    this._currSize.width = maxWidth;
                    this._currSize.height = newHeight;
                    this._adjusted = true;
                }
            }
        }
    }
    /**
     * @private
     * @return {?}
     */
    checkSize() {
        /** @type {?} */
        const minHeight = !this.rzMinHeight ? 1 : this.rzMinHeight;
        /** @type {?} */
        const minWidth = !this.rzMinWidth ? 1 : this.rzMinWidth;
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
    }
    /**
     * @private
     * @return {?}
     */
    getBounding() {
        /** @type {?} */
        const el = this._containment;
        /** @type {?} */
        const computed = window.getComputedStyle(el);
        if (computed) {
            /** @type {?} */
            let p = computed.getPropertyValue('position');
            /** @type {?} */
            const nativeEl = window.getComputedStyle(this.el.nativeElement);
            /** @type {?} */
            let transforms = nativeEl.getPropertyValue('transform').replace(/[^-\d,]/g, '').split(',');
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
    }
    /**
     * @private
     * @return {?}
     */
    resetBounding() {
        if (this._bounding && this._bounding.position === 'static') {
            this.renderer.setStyle(this._containment, 'position', 'relative');
        }
        this._bounding = null;
    }
    /**
     * @private
     * @return {?}
     */
    getGridSize() {
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
    }
}
AngularResizableDirective.decorators = [
    { type: Directive, args: [{
                selector: '[ngResizable]',
                exportAs: 'ngResizable'
            },] }
];
/** @nocollapse */
AngularResizableDirective.ctorParameters = () => [
    { type: ElementRef },
    { type: Renderer2 }
];
AngularResizableDirective.propDecorators = {
    ngResizable: [{ type: Input }],
    rzHandles: [{ type: Input }],
    rzAspectRatio: [{ type: Input }],
    rzContainment: [{ type: Input }],
    rzGrid: [{ type: Input }],
    rzMinWidth: [{ type: Input }],
    rzMinHeight: [{ type: Input }],
    rzMaxWidth: [{ type: Input }],
    rzMaxHeight: [{ type: Input }],
    preventDefaultEvent: [{ type: Input }],
    rzStart: [{ type: Output }],
    rzResizing: [{ type: Output }],
    rzStop: [{ type: Output }]
};
if (false) {
    /**
     * @type {?}
     * @private
     */
    AngularResizableDirective.prototype._resizable;
    /**
     * @type {?}
     * @private
     */
    AngularResizableDirective.prototype._handles;
    /**
     * @type {?}
     * @private
     */
    AngularResizableDirective.prototype._handleType;
    /**
     * @type {?}
     * @private
     */
    AngularResizableDirective.prototype._handleResizing;
    /**
     * @type {?}
     * @private
     */
    AngularResizableDirective.prototype._direction;
    /**
     * @type {?}
     * @private
     */
    AngularResizableDirective.prototype._directionChanged;
    /**
     * @type {?}
     * @private
     */
    AngularResizableDirective.prototype._aspectRatio;
    /**
     * @type {?}
     * @private
     */
    AngularResizableDirective.prototype._containment;
    /**
     * @type {?}
     * @private
     */
    AngularResizableDirective.prototype._origMousePos;
    /**
     * Original Size and Position
     * @type {?}
     * @private
     */
    AngularResizableDirective.prototype._origSize;
    /**
     * @type {?}
     * @private
     */
    AngularResizableDirective.prototype._origPos;
    /**
     * Current Size and Position
     * @type {?}
     * @private
     */
    AngularResizableDirective.prototype._currSize;
    /**
     * @type {?}
     * @private
     */
    AngularResizableDirective.prototype._currPos;
    /**
     * Initial Size and Position
     * @type {?}
     * @private
     */
    AngularResizableDirective.prototype._initSize;
    /**
     * @type {?}
     * @private
     */
    AngularResizableDirective.prototype._initPos;
    /**
     * Snap to gird
     * @type {?}
     * @private
     */
    AngularResizableDirective.prototype._gridSize;
    /**
     * @type {?}
     * @private
     */
    AngularResizableDirective.prototype._bounding;
    /**
     * Bugfix: iFrames, and context unrelated elements block all events, and are unusable
     * https://github.com/xieziyu/angular2-draggable/issues/84
     * @type {?}
     * @private
     */
    AngularResizableDirective.prototype._helperBlock;
    /**
     * @type {?}
     * @private
     */
    AngularResizableDirective.prototype.draggingSub;
    /**
     * @type {?}
     * @private
     */
    AngularResizableDirective.prototype._adjusted;
    /**
     * Which handles can be used for resizing.
     * \@example
     * [rzHandles] = "'n,e,s,w,se,ne,sw,nw'"
     * equals to: [rzHandles] = "'all'"
     *
     *
     * @type {?}
     */
    AngularResizableDirective.prototype.rzHandles;
    /**
     * Whether the element should be constrained to a specific aspect ratio.
     *  Multiple types supported:
     *  boolean: When set to true, the element will maintain its original aspect ratio.
     *  number: Force the element to maintain a specific aspect ratio during resizing.
     * @type {?}
     */
    AngularResizableDirective.prototype.rzAspectRatio;
    /**
     * Constrains resizing to within the bounds of the specified element or region.
     *  Multiple types supported:
     *  Selector: The resizable element will be contained to the bounding box of the first element found by the selector.
     *            If no element is found, no containment will be set.
     *  Element: The resizable element will be contained to the bounding box of this element.
     *  String: Possible values: "parent".
     * @type {?}
     */
    AngularResizableDirective.prototype.rzContainment;
    /**
     * Snaps the resizing element to a grid, every x and y pixels.
     * A number for both width and height or an array values like [ x, y ]
     * @type {?}
     */
    AngularResizableDirective.prototype.rzGrid;
    /**
     * The minimum width the resizable should be allowed to resize to.
     * @type {?}
     */
    AngularResizableDirective.prototype.rzMinWidth;
    /**
     * The minimum height the resizable should be allowed to resize to.
     * @type {?}
     */
    AngularResizableDirective.prototype.rzMinHeight;
    /**
     * The maximum width the resizable should be allowed to resize to.
     * @type {?}
     */
    AngularResizableDirective.prototype.rzMaxWidth;
    /**
     * The maximum height the resizable should be allowed to resize to.
     * @type {?}
     */
    AngularResizableDirective.prototype.rzMaxHeight;
    /**
     * Whether to prevent default event
     * @type {?}
     */
    AngularResizableDirective.prototype.preventDefaultEvent;
    /**
     * emitted when start resizing
     * @type {?}
     */
    AngularResizableDirective.prototype.rzStart;
    /**
     * emitted when start resizing
     * @type {?}
     */
    AngularResizableDirective.prototype.rzResizing;
    /**
     * emitted when stop resizing
     * @type {?}
     */
    AngularResizableDirective.prototype.rzStop;
    /**
     * @type {?}
     * @private
     */
    AngularResizableDirective.prototype.el;
    /**
     * @type {?}
     * @private
     */
    AngularResizableDirective.prototype.renderer;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5ndWxhci1yZXNpemFibGUuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhcjItZHJhZ2dhYmxlLyIsInNvdXJjZXMiOlsibGliL2FuZ3VsYXItcmVzaXphYmxlLmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUNMLFNBQVMsRUFBRSxVQUFVLEVBQUUsU0FBUyxFQUNoQyxLQUFLLEVBQUUsTUFBTSxFQUFVLFlBQVksRUFFcEMsTUFBTSxlQUFlLENBQUM7QUFFdkIsT0FBTyxFQUFnQixTQUFTLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDL0MsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQ3JELE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQztBQUV2RCxPQUFPLEVBQUUsUUFBUSxFQUFhLE1BQU0sbUJBQW1CLENBQUM7QUFDeEQsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLGVBQWUsQ0FBQztBQU9yQyxNQUFNLE9BQU8seUJBQXlCOzs7OztJQXNHcEMsWUFBb0IsRUFBMkIsRUFBVSxRQUFtQjtRQUF4RCxPQUFFLEdBQUYsRUFBRSxDQUF5QjtRQUFVLGFBQVEsR0FBUixRQUFRLENBQVc7UUFyR3BFLGVBQVUsR0FBRyxJQUFJLENBQUM7UUFDbEIsYUFBUSxHQUFvQyxFQUFFLENBQUM7UUFDL0MsZ0JBQVcsR0FBYSxFQUFFLENBQUM7UUFDM0Isb0JBQWUsR0FBaUIsSUFBSSxDQUFDO1FBQ3JDLGVBQVUsR0FBK0QsSUFBSSxDQUFDO1FBQzlFLHNCQUFpQixHQUErRCxJQUFJLENBQUM7UUFDckYsaUJBQVksR0FBRyxDQUFDLENBQUM7UUFDakIsaUJBQVksR0FBZ0IsSUFBSSxDQUFDO1FBQ2pDLGtCQUFhLEdBQWEsSUFBSSxDQUFDOzs7O1FBRy9CLGNBQVMsR0FBUyxJQUFJLENBQUM7UUFDdkIsYUFBUSxHQUFhLElBQUksQ0FBQzs7OztRQUcxQixjQUFTLEdB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QUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBRWpJLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUMsRUFBRTtnQkFDMUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQztnQkFDN0MsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUM7YUFDN0Y7WUFFRCxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLEVBQUU7Z0JBQzFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUM7Z0JBQzdDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDO2FBQzNGO1lBRUQsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssR0FBRyxRQUFRLEVBQUU7Z0JBQ25DLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxHQUFHLFFBQVEsQ0FBQzthQUNqQztZQUVELElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsU0FBUyxFQUFFO2dCQUNyQyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxTQUFTLENBQUM7YUFDbkM7WUFFRDs7O2VBR0c7WUFDSCxJQUFJLElBQUksQ0FBQyxZQUFZLEVBQUU7Z0JBQ3JCLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO2dCQUV2QixJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7b0JBQ3hDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLFNBQVMsRUFBRTs7MEJBQ3JELFFBQVEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDO29CQUUxRCxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUFFO3dCQUNyQixJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssR0FBRyxRQUFRLENBQUM7cUJBQ3BEO29CQUVELElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxHQUFHLFFBQVEsQ0FBQztvQkFDaEMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsU0FBUyxDQUFDO29CQUNsQyxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztpQkFDdkI7Z0JBRUQsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO29CQUN4QyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxRQUFRLEVBQUU7OzBCQUNyRCxTQUFTLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQztvQkFFMUQsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsRUFBRTt3QkFDckIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsU0FBUyxDQUFDO3FCQUN0RDtvQkFFRCxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssR0FBRyxRQUFRLENBQUM7b0JBQ2hDLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHLFNBQVMsQ0FBQztvQkFDbEMsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7aUJBQ3ZCO2FBQ0Y7U0FDRjtJQUNILENBQUM7Ozs7O0lBRU8sU0FBUzs7Y0FDVCxTQUFTLEdBQUcsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXOztjQUNwRCxRQUFRLEdBQUcsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVO1FBRXZELElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsU0FBUyxFQUFFO1lBQ3JDLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHLFNBQVMsQ0FBQztZQUVsQyxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUFFO2dCQUNyQixJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHLFNBQVMsQ0FBQyxDQUFDO2FBQ3pFO1NBQ0Y7UUFFRCxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxHQUFHLFFBQVEsRUFBRTtZQUNuQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssR0FBRyxRQUFRLENBQUM7WUFFaEMsSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsRUFBRTtnQkFDckIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssR0FBRyxRQUFRLENBQUMsQ0FBQzthQUN2RTtTQUNGO1FBRUQsSUFBSSxJQUFJLENBQUMsV0FBVyxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxXQUFXLEVBQUU7WUFDaEUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQztZQUV6QyxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUFFO2dCQUNyQixJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQzthQUNoRjtTQUNGO1FBRUQsSUFBSSxJQUFJLENBQUMsVUFBVSxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxVQUFVLEVBQUU7WUFDN0QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQztZQUV2QyxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUFFO2dCQUNyQixJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQzthQUM5RTtTQUNGO0lBQ0gsQ0FBQzs7Ozs7SUFFTyxXQUFXOztjQUNYLEVBQUUsR0FBRyxJQUFJLENBQUMsWUFBWTs7Y0FDdEIsUUFBUSxHQUFHLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFLENBQUM7UUFDNUMsSUFBSSxRQUFRLEVBQUU7O2dCQUNSLENBQUMsR0FBRyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsVUFBVSxDQUFDOztrQkFFdkMsUUFBUSxHQUFHLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQzs7Z0JBQzNELFVBQVUsR0FBRyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsV0FBVyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRSxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDO1lBRTFGLElBQUksQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDO1lBQ3BCLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQyxXQUFXLENBQUM7WUFDdEMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDLFlBQVksQ0FBQztZQUN4QyxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUUsR0FBRyxRQUFRLENBQUMsUUFBUSxDQUFDLGdCQUFnQixDQUFDLGVBQWUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQzdFLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRSxHQUFHLFFBQVEsQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsZ0JBQWdCLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUM5RSxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDM0UsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBRTFFLElBQUksVUFBVSxDQUFDLE1BQU0sSUFBSSxDQUFDLEVBQUU7Z0JBQzFCLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBVSxHQUFHLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7Z0JBQ3hELElBQUksQ0FBQyxTQUFTLENBQUMsVUFBVSxHQUFHLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEVB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Ozs7OztJQUdyRCwrQ0FBd0Q7Ozs7O0lBR3hELDJDQUFvRDs7Ozs7SUFFeEMsdUNBQW1DOzs7OztJQUFFLDZDQUEyQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIERpcmVjdGl2ZSwgRWxlbWVudFJlZiwgUmVuZGVyZXIyLFxuICBJbnB1dCwgT3V0cHV0LCBPbkluaXQsIEV2ZW50RW1pdHRlciwgT25DaGFuZ2VzLCBTaW1wbGVDaGFuZ2VzLFxuICBPbkRlc3Ryb3ksIEFmdGVyVmlld0luaXRcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IFN1YnNjcmlwdGlvbiwgZnJvbUV2ZW50IH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBIZWxwZXJCbG9jayB9IGZyb20gJy4vd2lkZ2V0cy9oZWxwZXItYmxvY2snO1xuaW1wb3J0IHsgUmVzaXplSGFuZGxlIH0gZnJvbSAnLi93aWRnZXRzL3Jlc2l6ZS1oYW5kbGUnO1xuaW1wb3J0IHsgUmVzaXplSGFuZGxlVHlwZSB9IGZyb20gJy4vbW9kZWxzL3Jlc2l6ZS1oYW5kbGUtdHlwZSc7XG5pbXBvcnQgeyBQb3NpdGlvbiwgSVBvc2l0aW9uIH0gZnJvbSAnLi9tb2RlbHMvcG9zaXRpb24nO1xuaW1wb3J0IHsgU2l6ZSB9IGZyb20gJy4vbW9kZWxzL3NpemUnO1xuaW1wb3J0IHsgSVJlc2l6ZUV2ZW50IH0gZnJvbSAnLi9tb2RlbHMvcmVzaXplLWV2ZW50JztcblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW25nUmVzaXphYmxlXScsXG4gIGV4cG9ydEFzOiAnbmdSZXNpemFibGUnXG59KVxuZXhwb3J0IGNsYXNzIEFuZ3VsYXJSZXNpemFibGVEaXJlY3RpdmUgaW1wbGVtZW50cyBPbkluaXQsIE9uQ2hhbmdlcywgT25EZXN0cm95LCBBZnRlclZpZXdJbml0IHtcbiAgcHJpdmF0ZSBfcmVzaXphYmxlID0gdHJ1ZTtcbiAgcHJpdmF0ZSBfaGFuZGxlczogeyBba2V5OiBzdHJpbmddOiBSZXNpemVIYW5kbGUgfSA9IHt9O1xuICBwcml2YXRlIF9oYW5kbGVUeXBlOiBzdHJpbmdbXSA9IFtdO1xuICBwcml2YXRlIF9oYW5kbGVSZXNpemluZzogUmVzaXplSGFuZGxlID0gbnVsbDtcbiAgcHJpdmF0ZSBfZGlyZWN0aW9uOiB7ICduJzogYm9vbGVhbiwgJ3MnOiBib29sZWFuLCAndyc6IGJvb2xlYW4sICdlJzogYm9vbGVhbiB9ID0gbnVsbDtcbiAgcHJpdmF0ZSBfZGlyZWN0aW9uQ2hhbmdlZDogeyAnbic6IGJvb2xlYW4sICdzJzogYm9vbGVhbiwgJ3cnOiBib29sZWFuLCAnZSc6IGJvb2xlYW4gfSA9IG51bGw7XG4gIHByaXZhdGUgX2FzcGVjdFJhdGlvID0gMDtcbiAgcHJpdmF0ZSBfY29udGFpbm1lbnQ6IEhUTUxFbGVtZW50ID0gbnVsbDtcbiAgcHJpdmF0ZSBfb3JpZ01vdXNlUG9zOiBQb3NpdGlvbiA9IG51bGw7XG5cbiAgLyoqIE9yaWdpbmFsIFNpemUgYW5kIFBvc2l0aW9uICovXG4gIHByaXZhdGUgX29yaWdTaXplOiBTaXplID0gbnVsbDtcbiAgcHJpdmF0ZSBfb3JpZ1BvczogUG9zaXRpb24gPSBudWxsO1xuXG4gIC8qKiBDdXJyZW50IFNpemUgYW5kIFBvc2l0aW9uICovXG4gIHByaXZhdGUgX2N1cnJTaXplOiBTaXplID0gbnVsbDtcbiAgcHJpdmF0ZSBfY3VyclBvczogUG9zaXRpb24gPSBudWxsO1xuXG4gIC8qKiBJbml0aWFsIFNpemUgYW5kIFBvc2l0aW9uICovXG4gIHByaXZhdGUgX2luaXRTaXplOiBTaXplID0gbnVsbDtcbiAgcHJpdmF0ZSBfaW5pdFBvczogUG9zaXRpb24gPSBudWxsO1xuXG4gIC8qKiBTbmFwIHRvIGdpcmQgKi9cbiAgcHJpdmF0ZSBfZ3JpZFNpemU6IElQb3NpdGlvbiA9IG51bGw7XG5cbiAgcHJpdmF0ZSBfYm91bmRpbmc6IGFueSA9IG51bGw7XG5cbiAgLyoqXG4gICAqIEJ1Z2ZpeDogaUZyYW1lcywgYW5kIGNvbnRleHQgdW5yZWxhdGVkIGVsZW1lbnRzIGJsb2NrIGFsbCBldmVudHMsIGFuZCBhcmUgdW51c2FibGVcbiAgICogaHR0cHM6Ly9naXRodWIuY29tL3hpZXppeXUvYW5ndWxhcjItZHJhZ2dhYmxlL2lzc3Vlcy84NFxuICAgKi9cbiAgcHJpdmF0ZSBfaGVscGVyQmxvY2s6IEhlbHBlckJsb2NrID0gbnVsbDtcblxuICBwcml2YXRlIGRyYWdnaW5nU3ViOiBTdWJzY3JpcHRpb24gPSBudWxsO1xuICBwcml2YXRlIF9hZGp1c3RlZCA9IGZhbHNlO1xuXG4gIC8qKiBEaXNhYmxlcyB0aGUgcmVzaXphYmxlIGlmIHNldCB0byBmYWxzZS4gKi9cbiAgQElucHV0KCkgc2V0IG5nUmVzaXphYmxlKHY6IGFueSkge1xuICAgIGlmICh2ICE9PSB1bmRlZmluZWQgJiYgdiAhPT0gbnVsbCAmJiB2ICE9PSAnJykge1xuICAgICAgdGhpcy5fcmVzaXphYmxlID0gISF2O1xuICAgICAgdGhpcy51cGRhdGVSZXNpemFibGUoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogV2hpY2ggaGFuZGxlcyBjYW4gYmUgdXNlZCBmb3IgcmVzaXppbmcuXG4gICAqIEBleGFtcGxlXG4gICAqIFtyekhhbmRsZXNdID0gXCInbixlLHMsdyxzZSxuZSxzdyxudydcIlxuICAgKiBlcXVhbHMgdG86IFtyekhhbmRsZXNdID0gXCInYWxsJ1wiXG4gICAqXG4gICAqICovXG4gIEBJbnB1dCgpIHJ6SGFuZGxlczogUmVzaXplSGFuZGxlVHlwZSA9ICdlLHMsc2UnO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSBlbGVtZW50IHNob3VsZCBiZSBjb25zdHJhaW5lZCB0byBhIHNwZWNpZmljIGFzcGVjdCByYXRpby5cbiAgICogIE11bHRpcGxlIHR5cGVzIHN1cHBvcnRlZDpcbiAgICogIGJvb2xlYW46IFdoZW4gc2V0IHRvIHRydWUsIHRoZSBlbGVtZW50IHdpbGwgbWFpbnRhaW4gaXRzIG9yaWdpbmFsIGFzcGVjdCByYXRpby5cbiAgICogIG51bWJlcjogRm9yY2UgdGhlIGVsZW1lbnQgdG8gbWFpbnRhaW4gYSBzcGVjaWZpYyBhc3BlY3QgcmF0aW8gZHVyaW5nIHJlc2l6aW5nLlxuICAgKi9cbiAgQElucHV0KCkgcnpBc3BlY3RSYXRpbzogYm9vbGVhbiB8IG51bWJlciA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBDb25zdHJhaW5zIHJlc2l6aW5nIHRvIHdpdGhpbiB0aGUgYm91bmRzIG9mIHRoZSBzcGVjaWZpZWQgZWxlbWVudCBvciByZWdpb24uXG4gICAqICBNdWx0aXBsZSB0eXBlcyBzdXBwb3J0ZWQ6XG4gICAqICBTZWxlY3RvcjogVGhlIHJlc2l6YWJsZSBlbGVtZW50IHdpbGwgYmUgY29udGFpbmVkIHRvIHRoZSBib3VuZGluZyBib3ggb2YgdGhlIGZpcnN0IGVsZW1lbnQgZm91bmQgYnkgdGhlIHNlbGVjdG9yLlxuICAgKiAgICAgICAgICAgIElmIG5vIGVsZW1lbnQgaXMgZm91bmQsIG5vIGNvbnRhaW5tZW50IHdpbGwgYmUgc2V0LlxuICAgKiAgRWxlbWVudDogVGhlIHJlc2l6YWJsZSBlbGVtZW50IHdpbGwgYmUgY29udGFpbmVkIHRvIHRoZSBib3VuZGluZyBib3ggb2YgdGhpcyBlbGVtZW50LlxuICAgKiAgU3RyaW5nOiBQb3NzaWJsZSB2YWx1ZXM6IFwicGFyZW50XCIuXG4gICAqL1xuICBASW5wdXQoKSByekNvbnRhaW5tZW50OiBzdHJpbmcgfCBIVE1MRWxlbWVudCA9IG51bGw7XG5cbiAgLyoqXG4gICAqIFNuYXBzIHRoZSByZXNpemluZyBlbGVtZW50IHRvIGEgZ3JpZCwgZXZlcnkgeCBhbmQgeSBwaXhlbHMuXG4gICAqIEEgbnVtYmVyIGZvciBib3RoIHdpZHRoIGFuZCBoZWlnaHQgb3IgYW4gYXJyYXkgdmFsdWVzIGxpa2UgWyB4LCB5IF1cbiAgICovXG4gIEBJbnB1dCgpIHJ6R3JpZDogbnVtYmVyIHwgbnVtYmVyW10gPSBudWxsO1xuXG4gIC8qKiBUaGUgbWluaW11bSB3aWR0aCB0aGUgcmVzaXphYmxlIHNob3VsZCBiZSBhbGxvd2VkIHRvIHJlc2l6ZSB0by4gKi9cbiAgQElucHV0KCkgcnpNaW5XaWR0aDogbnVtYmVyID0gbnVsbDtcblxuICAvKiogVGhlIG1pbmltdW0gaGVpZ2h0IHRoZSByZXNpemFibGUgc2hvdWxkIGJlIGFsbG93ZWQgdG8gcmVzaXplIHRvLiAqL1xuICBASW5wdXQoKSByek1pbkhlaWdodDogbnVtYmVyID0gbnVsbDtcblxuICAvKiogVGhlIG1heGltdW0gd2lkdGggdGhlIHJlc2l6YWJsZSBzaG91bGQgYmUgYWxsb3dlZCB0byByZXNpemUgdG8uICovXG4gIEBJbnB1dCgpIHJ6TWF4V2lkdGg6IG51bWJlciA9IG51bGw7XG5cbiAgLyoqIFRoZSBtYXhpbXVtIGhlaWdodCB0aGUgcmVzaXphYmxlIHNob3VsZCBiZSBhbGxvd2VkIHRvIHJlc2l6ZSB0by4gKi9cbiAgQElucHV0KCkgcnpNYXhIZWlnaHQ6IG51bWJlciA9IG51bGw7XG5cbiAgLyoqIFdoZXRoZXIgdG8gcHJldmVudCBkZWZhdWx0IGV2ZW50ICovXG4gIEBJbnB1dCgpIHByZXZlbnREZWZhdWx0RXZlbnQgPSB0cnVlO1xuXG4gIC8qKiBlbWl0dGVkIHdoZW4gc3RhcnQgcmVzaXppbmcgKi9cbiAgQE91dHB1dCgpIHJ6U3RhcnQgPSBuZXcgRXZlbnRFbWl0dGVyPElSZXNpemVFdmVudD4oKTtcblxuICAvKiogZW1pdHRlZCB3aGVuIHN0YXJ0IHJlc2l6aW5nICovXG4gIEBPdXRwdXQoKSByelJlc2l6aW5nID0gbmV3IEV2ZW50RW1pdHRlcjxJUmVzaXplRXZlbnQ+KCk7XG5cbiAgLyoqIGVtaXR0ZWQgd2hlbiBzdG9wIHJlc2l6aW5nICovXG4gIEBPdXRwdXQoKSByelN0b3AgPSBuZXcgRXZlbnRFbWl0dGVyPElSZXNpemVFdmVudD4oKTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGVsOiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PiwgcHJpdmF0ZSByZW5kZXJlcjogUmVuZGVyZXIyKSB7XG4gICAgdGhpcy5faGVscGVyQmxvY2sgPSBuZXcgSGVscGVyQmxvY2soZWwubmF0aXZlRWxlbWVudCwgcmVuZGVyZXIpO1xuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xuICAgIGlmIChjaGFuZ2VzWydyekhhbmRsZXMnXSAmJiAhY2hhbmdlc1sncnpIYW5kbGVzJ10uaXNGaXJzdENoYW5nZSgpKSB7XG4gICAgICB0aGlzLnVwZGF0ZVJlc2l6YWJsZSgpO1xuICAgIH1cblxuICAgIGlmIChjaGFuZ2VzWydyekFzcGVjdFJhdGlvJ10gJiYgIWNoYW5nZXNbJ3J6QXNwZWN0UmF0aW8nXS5pc0ZpcnN0Q2hhbmdlKCkpIHtcbiAgICAgIHRoaXMudXBkYXRlQXNwZWN0UmF0aW8oKTtcbiAgICB9XG5cbiAgICBpZiAoY2hhbmdlc1sncnpDb250YWlubWVudCddICYmICFjaGFuZ2VzWydyekNvbnRhaW5tZW50J10uaXNGaXJzdENoYW5nZSgpKSB7XG4gICAgICB0aGlzLnVwZGF0ZUNvbnRhaW5tZW50KCk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy51cGRhdGVSZXNpemFibGUoKTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCkge1xuICAgIHRoaXMucmVtb3ZlSGFuZGxlcygpO1xuICAgIHRoaXMuX2NvbnRhaW5tZW50ID0gbnVsbDtcbiAgICB0aGlzLl9oZWxwZXJCbG9jay5kaXNwb3NlKCk7XG4gICAgdGhpcy5faGVscGVyQmxvY2sgPSBudWxsO1xuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgIGNvbnN0IGVsbSA9IHRoaXMuZWwubmF0aXZlRWxlbWVudDtcbiAgICB0aGlzLl9pbml0U2l6ZSA9IFNpemUuZ2V0Q3VycmVudChlbG0pO1xuICAgIHRoaXMuX2luaXRQb3MgPSBQb3NpdGlvbi5nZXRDdXJyZW50KGVsbSk7XG4gICAgdGhpcy5fY3VyclNpemUgPSBTaXplLmNvcHkodGhpcy5faW5pdFNpemUpO1xuICAgIHRoaXMuX2N1cnJQb3MgPSBQb3NpdGlvbi5jb3B5KHRoaXMuX2luaXRQb3MpO1xuICAgIHRoaXMudXBkYXRlQXNwZWN0UmF0aW8oKTtcbiAgICB0aGlzLnVwZGF0ZUNvbnRhaW5tZW50KCk7XG4gIH1cblxuICAvKiogQSBtZXRob2QgdG8gcmVzZXQgc2l6ZSAqL1xuICBwdWJsaWMgcmVzZXRTaXplKCkge1xuICAgIHRoaXMuX2N1cnJTaXplID0gU2l6ZS5jb3B5KHRoaXMuX2luaXRTaXplKTtcbiAgICB0aGlzLl9jdXJyUG9zID0gUG9zaXRpb24uY29weSh0aGlzLl9pbml0UG9zKTtcbiAgICB0aGlzLmRvUmVzaXplKCk7XG4gIH1cblxuICAvKiogQSBtZXRob2QgdG8gZ2V0IGN1cnJlbnQgc3RhdHVzICovXG4gIHB1YmxpYyBnZXRTdGF0dXMoKSB7XG4gICAgaWYgKCF0aGlzLl9jdXJyUG9zIHx8ICF0aGlzLl9jdXJyU2l6ZSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIHNpemU6IHtcbiAgICAgICAgd2lkdGg6IHRoaXMuX2N1cnJTaXplLndpZHRoLFxuICAgICAgICBoZWlnaHQ6IHRoaXMuX2N1cnJTaXplLmhlaWdodFxuICAgICAgfSxcbiAgICAgIHBvc2l0aW9uOiB7XG4gICAgICAgIHRvcDogdGhpcy5fY3VyclBvcy55LFxuICAgICAgICBsZWZ0OiB0aGlzLl9jdXJyUG9zLnhcbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgcHJpdmF0ZSB1cGRhdGVSZXNpemFibGUoKSB7XG4gICAgY29uc3QgZWxlbWVudCA9IHRoaXMuZWwubmF0aXZlRWxlbWVudDtcblxuICAgIC8vIGNsZWFyIGhhbmRsZXM6XG4gICAgdGhpcy5yZW5kZXJlci5yZW1vdmVDbGFzcyhlbGVtZW50LCAnbmctcmVzaXphYmxlJyk7XG4gICAgdGhpcy5yZW1vdmVIYW5kbGVzKCk7XG5cbiAgICAvLyBjcmVhdGUgbmV3IG9uZXM6XG4gICAgaWYgKHRoaXMuX3Jlc2l6YWJsZSkge1xuICAgICAgdGhpcy5yZW5kZXJlci5hZGRDbGFzcyhlbGVtZW50LCAnbmctcmVzaXphYmxlJyk7XG4gICAgICB0aGlzLmNyZWF0ZUhhbmRsZXMoKTtcbiAgICB9XG4gIH1cblxuICAvKiogVXNlIGl0IHRvIHVwZGF0ZSBhc3BlY3QgKi9cbiAgcHJpdmF0ZSB1cGRhdGVBc3BlY3RSYXRpbygpIHtcbiAgICBpZiAodHlwZW9mIHRoaXMucnpBc3BlY3RSYXRpbyA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgICBpZiAodGhpcy5yekFzcGVjdFJhdGlvICYmIHRoaXMuX2N1cnJTaXplLmhlaWdodCkge1xuICAgICAgICB0aGlzLl9hc3BlY3RSYXRpbyA9ICh0aGlzLl9jdXJyU2l6ZS53aWR0aCAvIHRoaXMuX2N1cnJTaXplLmhlaWdodCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9hc3BlY3RSYXRpbyA9IDA7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGxldCByID0gTnVtYmVyKHRoaXMucnpBc3BlY3RSYXRpbyk7XG4gICAgICB0aGlzLl9hc3BlY3RSYXRpbyA9IGlzTmFOKHIpID8gMCA6IHI7XG4gICAgfVxuICB9XG5cbiAgLyoqIFVzZSBpdCB0byB1cGRhdGUgY29udGFpbm1lbnQgKi9cbiAgcHJpdmF0ZSB1cGRhdGVDb250YWlubWVudCgpIHtcbiAgICBpZiAoIXRoaXMucnpDb250YWlubWVudCkge1xuICAgICAgdGhpcy5fY29udGFpbm1lbnQgPSBudWxsO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgdGhpcy5yekNvbnRhaW5tZW50ID09PSAnc3RyaW5nJykge1xuICAgICAgaWYgKHRoaXMucnpDb250YWlubWVudCA9PT0gJ3BhcmVudCcpIHtcbiAgICAgICAgdGhpcy5fY29udGFpbm1lbnQgPSB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQucGFyZW50RWxlbWVudDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX2NvbnRhaW5tZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4odGhpcy5yekNvbnRhaW5tZW50KTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fY29udGFpbm1lbnQgPSB0aGlzLnJ6Q29udGFpbm1lbnQ7XG4gICAgfVxuICB9XG5cbiAgLyoqIFVzZSBpdCB0byBjcmVhdGUgaGFuZGxlIGRpdnMgKi9cbiAgcHJpdmF0ZSBjcmVhdGVIYW5kbGVzKCkge1xuICAgIGlmICghdGhpcy5yekhhbmRsZXMpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsZXQgdG1wSGFuZGxlVHlwZXM6IHN0cmluZ1tdO1xuICAgIGlmICh0eXBlb2YgdGhpcy5yekhhbmRsZXMgPT09ICdzdHJpbmcnKSB7XG4gICAgICBpZiAodGhpcy5yekhhbmRsZXMgPT09ICdhbGwnKSB7XG4gICAgICAgIHRtcEhhbmRsZVR5cGVzID0gWyduJywgJ2UnLCAncycsICd3JywgJ25lJywgJ3NlJywgJ253JywgJ3N3J107XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0bXBIYW5kbGVUeXBlcyA9IHRoaXMucnpIYW5kbGVzLnJlcGxhY2UoLyAvZywgJycpLnRvTG93ZXJDYXNlKCkuc3BsaXQoJywnKTtcbiAgICAgIH1cblxuICAgICAgZm9yIChsZXQgdHlwZSBvZiB0bXBIYW5kbGVUeXBlcykge1xuICAgICAgICAvLyBkZWZhdWx0IGhhbmRsZSB0aGVtZTogbmctcmVzaXphYmxlLSR0eXBlLlxuICAgICAgICBsZXQgaGFuZGxlID0gdGhpcy5jcmVhdGVIYW5kbGVCeVR5cGUodHlwZSwgYG5nLXJlc2l6YWJsZS0ke3R5cGV9YCk7XG4gICAgICAgIGlmIChoYW5kbGUpIHtcbiAgICAgICAgICB0aGlzLl9oYW5kbGVUeXBlLnB1c2godHlwZSk7XG4gICAgICAgICAgdGhpcy5faGFuZGxlc1t0eXBlXSA9IGhhbmRsZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0bXBIYW5kbGVUeXBlcyA9IE9iamVjdC5rZXlzKHRoaXMucnpIYW5kbGVzKTtcbiAgICAgIGZvciAobGV0IHR5cGUgb2YgdG1wSGFuZGxlVHlwZXMpIHtcbiAgICAgICAgLy8gY3VzdG9tIGhhbmRsZSB0aGVtZS5cbiAgICAgICAgbGV0IGhhbmRsZSA9IHRoaXMuY3JlYXRlSGFuZGxlQnlUeXBlKHR5cGUsIHRoaXMucnpIYW5kbGVzW3R5cGVdKTtcbiAgICAgICAgaWYgKGhhbmRsZSkge1xuICAgICAgICAgIHRoaXMuX2hhbmRsZVR5cGUucHVzaCh0eXBlKTtcbiAgICAgICAgICB0aGlzLl9oYW5kbGVzW3R5cGVdID0gaGFuZGxlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gIH1cblxuICAvKiogVXNlIGl0IHRvIGNyZWF0ZSBhIGhhbmRsZSAqL1xuICBwcml2YXRlIGNyZWF0ZUhhbmRsZUJ5VHlwZSh0eXBlOiBzdHJpbmcsIGNzczogc3RyaW5nKTogUmVzaXplSGFuZGxlIHtcbiAgICBjb25zdCBfZWwgPSB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQ7XG5cbiAgICBpZiAoIXR5cGUubWF0Y2goL14oc2V8c3d8bmV8bnd8bnxlfHN8dykkLykpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ0ludmFsaWQgaGFuZGxlIHR5cGU6JywgdHlwZSk7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IFJlc2l6ZUhhbmRsZShfZWwsIHRoaXMucmVuZGVyZXIsIHR5cGUsIGNzcywgdGhpcy5vbk1vdXNlRG93bi5iaW5kKHRoaXMpKTtcbiAgfVxuXG4gIHByaXZhdGUgcmVtb3ZlSGFuZGxlcygpIHtcbiAgICBmb3IgKGxldCB0eXBlIG9mIHRoaXMuX2hhbmRsZVR5cGUpIHtcbiAgICAgIHRoaXMuX2hhbmRsZXNbdHlwZV0uZGlzcG9zZSgpO1xuICAgIH1cblxuICAgIHRoaXMuX2hhbmRsZVR5cGUgPSBbXTtcbiAgICB0aGlzLl9oYW5kbGVzID0ge307XG4gIH1cblxuICBvbk1vdXNlRG93bihldmVudDogTW91c2VFdmVudCB8IFRvdWNoRXZlbnQsIGhhbmRsZTogUmVzaXplSGFuZGxlKSB7XG4gICAgLy8gc2tpcCByaWdodCBjbGljaztcbiAgICBpZiAoZXZlbnQgaW5zdGFuY2VvZiBNb3VzZUV2ZW50ICYmIGV2ZW50LmJ1dHRvbiA9PT0gMikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnByZXZlbnREZWZhdWx0RXZlbnQpIHtcbiAgICAgIC8vIHByZXZlbnQgZGVmYXVsdCBldmVudHNcbiAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuX2hhbmRsZVJlc2l6aW5nKSB7XG4gICAgICB0aGlzLl9vcmlnTW91c2VQb3MgPSBQb3NpdGlvbi5mcm9tRXZlbnQoZXZlbnQpO1xuICAgICAgdGhpcy5zdGFydFJlc2l6ZShoYW5kbGUpO1xuXG4gICAgICB0aGlzLnN1YnNjcmliZUV2ZW50cygpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgc3Vic2NyaWJlRXZlbnRzKCkge1xuICAgIHRoaXMuZHJhZ2dpbmdTdWIgPSBmcm9tRXZlbnQoZG9jdW1lbnQsICdtb3VzZW1vdmUnLCB7IHBhc3NpdmU6IGZhbHNlIH0pLnN1YnNjcmliZShldmVudCA9PiB0aGlzLm9uTW91c2VNb3ZlKGV2ZW50IGFzIE1vdXNlRXZlbnQpKTtcbiAgICB0aGlzLmRyYWdnaW5nU3ViLmFkZChmcm9tRXZlbnQoZG9jdW1lbnQsICd0b3VjaG1vdmUnLCB7IHBhc3NpdmU6IGZhbHNlIH0pLnN1YnNjcmliZShldmVudCA9PiB0aGlzLm9uTW91c2VNb3ZlKGV2ZW50IGFzIFRvdWNoRXZlbnQpKSk7XG4gICAgdGhpcy5kcmFnZ2luZ1N1Yi5hZGQoZnJvbUV2ZW50KGRvY3VtZW50LCAnbW91c2V1cCcsIHsgcGFzc2l2ZTogZmFsc2UgfSkuc3Vic2NyaWJlKCgpID0+IHRoaXMub25Nb3VzZUxlYXZlKCkpKTtcbiAgICAvLyBmaXggZm9yIGlzc3VlICMxNjRcbiAgICBsZXQgaXNJRU9yRWRnZSA9IC9tc2llXFxzfHRyaWRlbnRcXC8vaS50ZXN0KHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50KTtcbiAgICBpZiAoIWlzSUVPckVkZ2UpIHtcbiAgICAgIHRoaXMuZHJhZ2dpbmdTdWIuYWRkKGZyb21FdmVudChkb2N1bWVudCwgJ21vdXNlbGVhdmUnLCB7IHBhc3NpdmU6IGZhbHNlIH0pLnN1YnNjcmliZSgoKSA9PiB0aGlzLm9uTW91c2VMZWF2ZSgpKSk7XG4gICAgfVxuICAgIHRoaXMuZHJhZ2dpbmdTdWIuYWRkKGZyb21FdmVudChkb2N1bWVudCwgJ3RvdWNoZW5kJywgeyBwYXNzaXZlOiBmYWxzZSB9KS5zdWJzY3JpYmUoKCkgPT4gdGhpcy5vbk1vdXNlTGVhdmUoKSkpO1xuICAgIHRoaXMuZHJhZ2dpbmdTdWIuYWRkKGZyb21FdmVudChkb2N1bWVudCwgJ3RvdWNoY2FuY2VsJywgeyBwYXNzaXZlOiBmYWxzZSB9KS5zdWJzY3JpYmUoKCkgPT4gdGhpcy5vbk1vdXNlTGVhdmUoKSkpO1xuICB9XG5cbiAgcHJpdmF0ZSB1bnN1YnNjcmliZUV2ZW50cygpIHtcbiAgICB0aGlzLmRyYWdnaW5nU3ViLnVuc3Vic2NyaWJlKCk7XG4gICAgdGhpcy5kcmFnZ2luZ1N1YiA9IG51bGw7XG4gIH1cblxuICBvbk1vdXNlTGVhdmUoKSB7XG4gICAgaWYgKHRoaXMuX2hhbmRsZVJlc2l6aW5nKSB7XG4gICAgICB0aGlzLnN0b3BSZXNpemUoKTtcbiAgICAgIHRoaXMuX29yaWdNb3VzZVBvcyA9IG51bGw7XG4gICAgICB0aGlzLnVuc3Vic2NyaWJlRXZlbnRzKCk7XG4gICAgfVxuICB9XG5cbiAgb25Nb3VzZU1vdmUoZXZlbnQ6IE1vdXNlRXZlbnQgfCBUb3VjaEV2ZW50KSB7XG4gICAgaWYgKHRoaXMuX2hhbmRsZVJlc2l6aW5nICYmIHRoaXMuX3Jlc2l6YWJsZSAmJiB0aGlzLl9vcmlnTW91c2VQb3MgJiYgdGhpcy5fb3JpZ1BvcyAmJiB0aGlzLl9vcmlnU2l6ZSkge1xuICAgICAgdGhpcy5yZXNpemVUbyhQb3NpdGlvbi5mcm9tRXZlbnQoZXZlbnQpKTtcbiAgICAgIHRoaXMub25SZXNpemluZygpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgc3RhcnRSZXNpemUoaGFuZGxlOiBSZXNpemVIYW5kbGUpIHtcbiAgICBjb25zdCBlbG0gPSB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQ7XG4gICAgdGhpcy5fb3JpZ1NpemUgPSBTaXplLmdldEN1cnJlbnQoZWxtKTtcbiAgICB0aGlzLl9vcmlnUG9zID0gUG9zaXRpb24uZ2V0Q3VycmVudChlbG0pOyAvLyB4OiBsZWZ0LCB5OiB0b3BcbiAgICB0aGlzLl9jdXJyU2l6ZSA9IFNpemUuY29weSh0aGlzLl9vcmlnU2l6ZSk7XG4gICAgdGhpcy5fY3VyclBvcyA9IFBvc2l0aW9uLmNvcHkodGhpcy5fb3JpZ1Bvcyk7XG4gICAgaWYgKHRoaXMuX2NvbnRhaW5tZW50KSB7XG4gICAgICB0aGlzLmdldEJvdW5kaW5nKCk7XG4gICAgfVxuICAgIHRoaXMuZ2V0R3JpZFNpemUoKTtcblxuICAgIC8vIEFkZCBhIHRyYW5zcGFyZW50IGhlbHBlciBkaXY6XG4gICAgdGhpcy5faGVscGVyQmxvY2suYWRkKCk7XG4gICAgdGhpcy5faGFuZGxlUmVzaXppbmcgPSBoYW5kbGU7XG4gICAgdGhpcy51cGRhdGVEaXJlY3Rpb24oKTtcbiAgICB0aGlzLnJ6U3RhcnQuZW1pdCh0aGlzLmdldFJlc2l6aW5nRXZlbnQoKSk7XG4gIH1cblxuICBwcml2YXRlIHN0b3BSZXNpemUoKSB7XG4gICAgLy8gUmVtb3ZlIHRoZSBoZWxwZXIgZGl2OlxuICAgIHRoaXMuX2hlbHBlckJsb2NrLnJlbW92ZSgpO1xuICAgIHRoaXMucnpTdG9wLmVtaXQodGhpcy5nZXRSZXNpemluZ0V2ZW50KCkpO1xuICAgIHRoaXMuX2hhbmRsZVJlc2l6aW5nID0gbnVsbDtcbiAgICB0aGlzLl9kaXJlY3Rpb24gPSBudWxsO1xuICAgIHRoaXMuX29yaWdTaXplID0gbnVsbDtcbiAgICB0aGlzLl9vcmlnUG9zID0gbnVsbDtcbiAgICBpZiAodGhpcy5fY29udGFpbm1lbnQpIHtcbiAgICAgIHRoaXMucmVzZXRCb3VuZGluZygpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgb25SZXNpemluZygpIHtcbiAgICB0aGlzLnJ6UmVzaXppbmcuZW1pdCh0aGlzLmdldFJlc2l6aW5nRXZlbnQoKSk7XG4gIH1cblxuICBwcml2YXRlIGdldFJlc2l6aW5nRXZlbnQoKTogSVJlc2l6ZUV2ZW50IHtcbiAgICByZXR1cm4ge1xuICAgICAgaG9zdDogdGhpcy5lbC5uYXRpdmVFbGVtZW50LFxuICAgICAgaGFuZGxlOiB0aGlzLl9oYW5kbGVSZXNpemluZyA/IHRoaXMuX2hhbmRsZVJlc2l6aW5nLmVsIDogbnVsbCxcbiAgICAgIHNpemU6IHtcbiAgICAgICAgd2lkdGg6IHRoaXMuX2N1cnJTaXplLndpZHRoLFxuICAgICAgICBoZWlnaHQ6IHRoaXMuX2N1cnJTaXplLmhlaWdodFxuICAgICAgfSxcbiAgICAgIHBvc2l0aW9uOiB7XG4gICAgICAgIHRvcDogdGhpcy5fY3VyclBvcy55LFxuICAgICAgICBsZWZ0OiB0aGlzLl9jdXJyUG9zLnhcbiAgICAgIH0sXG4gICAgICBkaXJlY3Rpb246IHsgLi4udGhpcy5fZGlyZWN0aW9uQ2hhbmdlZCB9LFxuICAgIH07XG4gIH1cblxuICBwcml2YXRlIHVwZGF0ZURpcmVjdGlvbigpIHtcbiAgICB0aGlzLl9kaXJlY3Rpb24gPSB7XG4gICAgICBuOiAhIXRoaXMuX2hhbmRsZVJlc2l6aW5nLnR5cGUubWF0Y2goL24vKSxcbiAgICAgIHM6ICEhdGhpcy5faGFuZGxlUmVzaXppbmcudHlwZS5tYXRjaCgvcy8pLFxuICAgICAgdzogISF0aGlzLl9oYW5kbGVSZXNpemluZy50eXBlLm1hdGNoKC93LyksXG4gICAgICBlOiAhIXRoaXMuX2hhbmRsZVJlc2l6aW5nLnR5cGUubWF0Y2goL2UvKVxuICAgIH07XG5cbiAgICB0aGlzLl9kaXJlY3Rpb25DaGFuZ2VkID0geyAuLi50aGlzLl9kaXJlY3Rpb24gfTtcblxuICAgIC8vIGlmIGFzcGVjdCByYXRpb24gc2hvdWxkIGJlIHByZXNlcnZlZDpcbiAgICBpZiAodGhpcy5yekFzcGVjdFJhdGlvKSB7XG5cbiAgICAgIC8vIGlmIG5vcnRoIHRoZW4gd2VzdCAodW5sZXNzIG5lKVxuICAgICAgaWYgKHRoaXMuX2RpcmVjdGlvbkNoYW5nZWQubiAmJiAhdGhpcy5fZGlyZWN0aW9uQ2hhbmdlZC5lKSB7XG4gICAgICAgIHRoaXMuX2RpcmVjdGlvbkNoYW5nZWQudyA9IHRydWU7XG4gICAgICB9XG5cbiAgICAgIC8vIGlmIHNvdXRoIHRoZW4gZWFzdCAodW5sZXNzIHN3KVxuICAgICAgaWYgKHRoaXMuX2RpcmVjdGlvbkNoYW5nZWQucyAmJiAhdGhpcy5fZGlyZWN0aW9uQ2hhbmdlZC53KSB7XG4gICAgICAgIHRoaXMuX2RpcmVjdGlvbkNoYW5nZWQuZSA9IHRydWU7XG4gICAgICB9XG5cbiAgICAgIC8vIGlmIGVhc3QgdGhlbiBzb3V0aCAodW5sZXNzIG5lKVxuICAgICAgaWYgKHRoaXMuX2RpcmVjdGlvbkNoYW5nZWQuZSAmJiAhdGhpcy5fZGlyZWN0aW9uQ2hhbmdlZC5uKSB7XG4gICAgICAgIHRoaXMuX2RpcmVjdGlvbkNoYW5nZWQucyA9IHRydWU7XG4gICAgICB9XG5cbiAgICAgIC8vIGlmIHdlc3QgdGhlbiBzb3V0aCAodW5sZXNzIG53KVxuICAgICAgaWYgKHRoaXMuX2RpcmVjdGlvbkNoYW5nZWQudyAmJiAhdGhpcy5fZGlyZWN0aW9uQ2hhbmdlZC5uKSB7XG4gICAgICAgIHRoaXMuX2RpcmVjdGlvbkNoYW5nZWQucyA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSByZXNpemVUbyhwOiBQb3NpdGlvbikge1xuICAgIHAuc3VidHJhY3QodGhpcy5fb3JpZ01vdXNlUG9zKTtcblxuICAgIGNvbnN0IHRtcFggPSBNYXRoLnJvdW5kKHAueCAvIHRoaXMuX2dyaWRTaXplLngpICogdGhpcy5fZ3JpZFNpemUueDtcbiAgICBjb25zdCB0bXBZID0gTWF0aC5yb3VuZChwLnkgLyB0aGlzLl9ncmlkU2l6ZS55KSAqIHRoaXMuX2dyaWRTaXplLnk7XG5cbiAgICBpZiAodGhpcy5fZGlyZWN0aW9uLm4pIHtcbiAgICAgIC8vIG4sIG5lLCBud1xuICAgICAgdGhpcy5fY3VyclBvcy55ID0gdGhpcy5fb3JpZ1Bvcy55ICsgdG1wWTtcbiAgICAgIHRoaXMuX2N1cnJTaXplLmhlaWdodCA9IHRoaXMuX29yaWdTaXplLmhlaWdodCAtIHRtcFk7XG4gICAgfSBlbHNlIGlmICh0aGlzLl9kaXJlY3Rpb24ucykge1xuICAgICAgLy8gcywgc2UsIHN3XG4gICAgICB0aGlzLl9jdXJyU2l6ZS5oZWlnaHQgPSB0aGlzLl9vcmlnU2l6ZS5oZWlnaHQgKyB0bXBZO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9kaXJlY3Rpb24uZSkge1xuICAgICAgLy8gZSwgbmUsIHNlXG4gICAgICB0aGlzLl9jdXJyU2l6ZS53aWR0aCA9IHRoaXMuX29yaWdTaXplLndpZHRoICsgdG1wWDtcbiAgICB9IGVsc2UgaWYgKHRoaXMuX2RpcmVjdGlvbi53KSB7XG4gICAgICAvLyB3LCBudywgc3dcbiAgICAgIHRoaXMuX2N1cnJTaXplLndpZHRoID0gdGhpcy5fb3JpZ1NpemUud2lkdGggLSB0bXBYO1xuICAgICAgdGhpcy5fY3VyclBvcy54ID0gdGhpcy5fb3JpZ1Bvcy54ICsgdG1wWDtcbiAgICB9XG5cbiAgICB0aGlzLmNoZWNrQm91bmRzKCk7XG4gICAgdGhpcy5jaGVja1NpemUoKTtcbiAgICB0aGlzLmFkanVzdEJ5UmF0aW8oKTtcbiAgICB0aGlzLmRvUmVzaXplKCk7XG4gIH1cblxuICBwcml2YXRlIGRvUmVzaXplKCkge1xuICAgIGNvbnN0IGNvbnRhaW5lciA9IHRoaXMuZWwubmF0aXZlRWxlbWVudDtcbiAgICBpZiAoIXRoaXMuX2RpcmVjdGlvbiB8fCB0aGlzLl9kaXJlY3Rpb24ubiB8fCB0aGlzLl9kaXJlY3Rpb24ucyB8fCB0aGlzLl9hc3BlY3RSYXRpbykge1xuICAgICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZShjb250YWluZXIsICdoZWlnaHQnLCB0aGlzLl9jdXJyU2l6ZS5oZWlnaHQgKyAncHgnKTtcbiAgICB9XG4gICAgaWYgKCF0aGlzLl9kaXJlY3Rpb24gfHwgdGhpcy5fZGlyZWN0aW9uLncgfHwgdGhpcy5fZGlyZWN0aW9uLmUgfHwgdGhpcy5fYXNwZWN0UmF0aW8pIHtcbiAgICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUoY29udGFpbmVyLCAnd2lkdGgnLCB0aGlzLl9jdXJyU2l6ZS53aWR0aCArICdweCcpO1xuICAgIH1cbiAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKGNvbnRhaW5lciwgJ2xlZnQnLCB0aGlzLl9jdXJyUG9zLnggKyAncHgnKTtcbiAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKGNvbnRhaW5lciwgJ3RvcCcsIHRoaXMuX2N1cnJQb3MueSArICdweCcpO1xuICB9XG5cbiAgcHJpdmF0ZSBhZGp1c3RCeVJhdGlvKCkge1xuICAgIGlmICh0aGlzLl9hc3BlY3RSYXRpbyAmJiAhdGhpcy5fYWRqdXN0ZWQpIHtcbiAgICAgIGlmICh0aGlzLl9kaXJlY3Rpb24uZSB8fCB0aGlzLl9kaXJlY3Rpb24udykge1xuICAgICAgICBjb25zdCBuZXdIZWlnaHQgPSBNYXRoLmZsb29yKHRoaXMuX2N1cnJTaXplLndpZHRoIC8gdGhpcy5fYXNwZWN0UmF0aW8pO1xuXG4gICAgICAgIGlmICh0aGlzLl9kaXJlY3Rpb24ubikge1xuICAgICAgICAgIHRoaXMuX2N1cnJQb3MueSArPSB0aGlzLl9jdXJyU2l6ZS5oZWlnaHQgLSBuZXdIZWlnaHQ7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9jdXJyU2l6ZS5oZWlnaHQgPSBuZXdIZWlnaHQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBuZXdXaWR0aCA9IE1hdGguZmxvb3IodGhpcy5fYXNwZWN0UmF0aW8gKiB0aGlzLl9jdXJyU2l6ZS5oZWlnaHQpO1xuXG4gICAgICAgIGlmICh0aGlzLl9kaXJlY3Rpb24ubikge1xuICAgICAgICAgIHRoaXMuX2N1cnJQb3MueCArPSB0aGlzLl9jdXJyU2l6ZS53aWR0aCAtIG5ld1dpZHRoO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fY3VyclNpemUud2lkdGggPSBuZXdXaWR0aDtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGNoZWNrQm91bmRzKCkge1xuICAgIGlmICh0aGlzLl9jb250YWlubWVudCkge1xuICAgICAgY29uc3QgbWF4V2lkdGggPSB0aGlzLl9ib3VuZGluZy53aWR0aCAtIHRoaXMuX2JvdW5kaW5nLnByIC0gdGhpcy5fYm91bmRpbmcuZGVsdGFMIC0gdGhpcy5fYm91bmRpbmcudHJhbnNsYXRlWCAtIHRoaXMuX2N1cnJQb3MueDtcbiAgICAgIGNvbnN0IG1heEhlaWdodCA9IHRoaXMuX2JvdW5kaW5nLmhlaWdodCAtIHRoaXMuX2JvdW5kaW5nLnBiIC0gdGhpcy5fYm91bmRpbmcuZGVsdGFUIC0gdGhpcy5fYm91bmRpbmcudHJhbnNsYXRlWSAtIHRoaXMuX2N1cnJQb3MueTtcblxuICAgICAgaWYgKHRoaXMuX2RpcmVjdGlvbi5uICYmICh0aGlzLl9jdXJyUG9zLnkgKyB0aGlzLl9ib3VuZGluZy50cmFuc2xhdGVZIDwgMCkpIHtcbiAgICAgICAgdGhpcy5fY3VyclBvcy55ID0gLXRoaXMuX2JvdW5kaW5nLnRyYW5zbGF0ZVk7XG4gICAgICAgIHRoaXMuX2N1cnJTaXplLmhlaWdodCA9IHRoaXMuX29yaWdTaXplLmhlaWdodCArIHRoaXMuX29yaWdQb3MueSArIHRoaXMuX2JvdW5kaW5nLnRyYW5zbGF0ZVk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLl9kaXJlY3Rpb24udyAmJiAodGhpcy5fY3VyclBvcy54ICsgdGhpcy5fYm91bmRpbmcudHJhbnNsYXRlWCkgPCAwKSB7XG4gICAgICAgIHRoaXMuX2N1cnJQb3MueCA9IC10aGlzLl9ib3VuZGluZy50cmFuc2xhdGVYO1xuICAgICAgICB0aGlzLl9jdXJyU2l6ZS53aWR0aCA9IHRoaXMuX29yaWdTaXplLndpZHRoICsgdGhpcy5fb3JpZ1Bvcy54ICsgdGhpcy5fYm91bmRpbmcudHJhbnNsYXRlWDtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuX2N1cnJTaXplLndpZHRoID4gbWF4V2lkdGgpIHtcbiAgICAgICAgdGhpcy5fY3VyclNpemUud2lkdGggPSBtYXhXaWR0aDtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuX2N1cnJTaXplLmhlaWdodCA+IG1heEhlaWdodCkge1xuICAgICAgICB0aGlzLl9jdXJyU2l6ZS5oZWlnaHQgPSBtYXhIZWlnaHQ7XG4gICAgICB9XG5cbiAgICAgIC8qKlxuICAgICAgICogRml4IElzc3VlOiBBZGRpdGlvbmFsIGNoZWNrIGZvciBhc3BlY3QgcmF0aW9cbiAgICAgICAqIGh0dHBzOi8vZ2l0aHViLmNvbS94aWV6aXl1L2FuZ3VsYXIyLWRyYWdnYWJsZS9pc3N1ZXMvMTMyXG4gICAgICAgKi9cbiAgICAgIGlmICh0aGlzLl9hc3BlY3RSYXRpbykge1xuICAgICAgICB0aGlzLl9hZGp1c3RlZCA9IGZhbHNlO1xuXG4gICAgICAgIGlmICgodGhpcy5fZGlyZWN0aW9uLncgfHwgdGhpcy5fZGlyZWN0aW9uLmUpICYmXG4gICAgICAgICAgICAodGhpcy5fY3VyclNpemUud2lkdGggLyB0aGlzLl9hc3BlY3RSYXRpbykgPj0gbWF4SGVpZ2h0KSB7XG4gICAgICAgICAgY29uc3QgbmV3V2lkdGggPSBNYXRoLmZsb29yKG1heEhlaWdodCAqIHRoaXMuX2FzcGVjdFJhdGlvKTtcblxuICAgICAgICAgIGlmICh0aGlzLl9kaXJlY3Rpb24udykge1xuICAgICAgICAgICAgdGhpcy5fY3VyclBvcy54ICs9IHRoaXMuX2N1cnJTaXplLndpZHRoIC0gbmV3V2lkdGg7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdGhpcy5fY3VyclNpemUud2lkdGggPSBuZXdXaWR0aDtcbiAgICAgICAgICB0aGlzLl9jdXJyU2l6ZS5oZWlnaHQgPSBtYXhIZWlnaHQ7XG4gICAgICAgICAgdGhpcy5fYWRqdXN0ZWQgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCh0aGlzLl9kaXJlY3Rpb24ubiB8fCB0aGlzLl9kaXJlY3Rpb24ucykgJiZcbiAgICAgICAgICAgICh0aGlzLl9jdXJyU2l6ZS5oZWlnaHQgKiB0aGlzLl9hc3BlY3RSYXRpbykgPj0gbWF4V2lkdGgpIHtcbiAgICAgICAgICBjb25zdCBuZXdIZWlnaHQgPSBNYXRoLmZsb29yKG1heFdpZHRoIC8gdGhpcy5fYXNwZWN0UmF0aW8pO1xuXG4gICAgICAgICAgaWYgKHRoaXMuX2RpcmVjdGlvbi5uKSB7XG4gICAgICAgICAgICB0aGlzLl9jdXJyUG9zLnkgKz0gdGhpcy5fY3VyclNpemUuaGVpZ2h0IC0gbmV3SGVpZ2h0O1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHRoaXMuX2N1cnJTaXplLndpZHRoID0gbWF4V2lkdGg7XG4gICAgICAgICAgdGhpcy5fY3VyclNpemUuaGVpZ2h0ID0gbmV3SGVpZ2h0O1xuICAgICAgICAgIHRoaXMuX2FkanVzdGVkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgY2hlY2tTaXplKCkge1xuICAgIGNvbnN0IG1pbkhlaWdodCA9ICF0aGlzLnJ6TWluSGVpZ2h0ID8gMSA6IHRoaXMucnpNaW5IZWlnaHQ7XG4gICAgY29uc3QgbWluV2lkdGggPSAhdGhpcy5yek1pbldpZHRoID8gMSA6IHRoaXMucnpNaW5XaWR0aDtcblxuICAgIGlmICh0aGlzLl9jdXJyU2l6ZS5oZWlnaHQgPCBtaW5IZWlnaHQpIHtcbiAgICAgIHRoaXMuX2N1cnJTaXplLmhlaWdodCA9IG1pbkhlaWdodDtcblxuICAgICAgaWYgKHRoaXMuX2RpcmVjdGlvbi5uKSB7XG4gICAgICAgIHRoaXMuX2N1cnJQb3MueSA9IHRoaXMuX29yaWdQb3MueSArICh0aGlzLl9vcmlnU2l6ZS5oZWlnaHQgLSBtaW5IZWlnaHQpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0aGlzLl9jdXJyU2l6ZS53aWR0aCA8IG1pbldpZHRoKSB7XG4gICAgICB0aGlzLl9jdXJyU2l6ZS53aWR0aCA9IG1pbldpZHRoO1xuXG4gICAgICBpZiAodGhpcy5fZGlyZWN0aW9uLncpIHtcbiAgICAgICAgdGhpcy5fY3VyclBvcy54ID0gdGhpcy5fb3JpZ1Bvcy54ICsgKHRoaXMuX29yaWdTaXplLndpZHRoIC0gbWluV2lkdGgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0aGlzLnJ6TWF4SGVpZ2h0ICYmIHRoaXMuX2N1cnJTaXplLmhlaWdodCA+IHRoaXMucnpNYXhIZWlnaHQpIHtcbiAgICAgIHRoaXMuX2N1cnJTaXplLmhlaWdodCA9IHRoaXMucnpNYXhIZWlnaHQ7XG5cbiAgICAgIGlmICh0aGlzLl9kaXJlY3Rpb24ubikge1xuICAgICAgICB0aGlzLl9jdXJyUG9zLnkgPSB0aGlzLl9vcmlnUG9zLnkgKyAodGhpcy5fb3JpZ1NpemUuaGVpZ2h0IC0gdGhpcy5yek1heEhlaWdodCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucnpNYXhXaWR0aCAmJiB0aGlzLl9jdXJyU2l6ZS53aWR0aCA+IHRoaXMucnpNYXhXaWR0aCkge1xuICAgICAgdGhpcy5fY3VyclNpemUud2lkdGggPSB0aGlzLnJ6TWF4V2lkdGg7XG5cbiAgICAgIGlmICh0aGlzLl9kaXJlY3Rpb24udykge1xuICAgICAgICB0aGlzLl9jdXJyUG9zLnggPSB0aGlzLl9vcmlnUG9zLnggKyAodGhpcy5fb3JpZ1NpemUud2lkdGggLSB0aGlzLnJ6TWF4V2lkdGgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgZ2V0Qm91bmRpbmcoKSB7XG4gICAgY29uc3QgZWwgPSB0aGlzLl9jb250YWlubWVudDtcbiAgICBjb25zdCBjb21wdXRlZCA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsKTtcbiAgICBpZiAoY29tcHV0ZWQpIHtcbiAgICAgIGxldCBwID0gY29tcHV0ZWQuZ2V0UHJvcGVydHlWYWx1ZSgncG9zaXRpb24nKTtcblxuICAgICAgY29uc3QgbmF0aXZlRWwgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQpO1xuICAgICAgbGV0IHRyYW5zZm9ybXMgPSBuYXRpdmVFbC5nZXRQcm9wZXJ0eVZhbHVlKCd0cmFuc2Zvcm0nKS5yZXBsYWNlKC9bXi1cXGQsXS9nLCAnJykuc3BsaXQoJywnKTtcblxuICAgICAgdGhpcy5fYm91bmRpbmcgPSB7fTtcbiAgICAgIHRoaXMuX2JvdW5kaW5nLndpZHRoID0gZWwuY2xpZW50V2lkdGg7XG4gICAgICB0aGlzLl9ib3VuZGluZy5oZWlnaHQgPSBlbC5jbGllbnRIZWlnaHQ7XG4gICAgICB0aGlzLl9ib3VuZGluZy5wciA9IHBhcnNlSW50KGNvbXB1dGVkLmdldFByb3BlcnR5VmFsdWUoJ3BhZGRpbmctcmlnaHQnKSwgMTApO1xuICAgICAgdGhpcy5fYm91bmRpbmcucGIgPSBwYXJzZUludChjb21wdXRlZC5nZXRQcm9wZXJ0eVZhbHVlKCdwYWRkaW5nLWJvdHRvbScpLCAxMCk7XG4gICAgICB0aGlzLl9ib3VuZGluZy5kZWx0YUwgPSB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQub2Zmc2V0TGVmdCAtIHRoaXMuX2N1cnJQb3MueDtcbiAgICAgIHRoaXMuX2JvdW5kaW5nLmRlbHRhVCA9IHRoaXMuZWwubmF0aXZlRWxlbWVudC5vZmZzZXRUb3AgLSB0aGlzLl9jdXJyUG9zLnk7XG5cbiAgICAgIGlmICh0cmFuc2Zvcm1zLmxlbmd0aCA+PSA2KSB7XG4gICAgICAgIHRoaXMuX2JvdW5kaW5nLnRyYW5zbGF0ZVggPSBwYXJzZUludCh0cmFuc2Zvcm1zWzRdLCAxMCk7XG4gICAgICAgIHRoaXMuX2JvdW5kaW5nLnRyYW5zbGF0ZVkgPSBwYXJzZUludCh0cmFuc2Zvcm1zWzVdLCAxMCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9ib3VuZGluZy50cmFuc2xhdGVYID0gMDtcbiAgICAgICAgdGhpcy5fYm91bmRpbmcudHJhbnNsYXRlWSA9IDA7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX2JvdW5kaW5nLnBvc2l0aW9uID0gY29tcHV0ZWQuZ2V0UHJvcGVydHlWYWx1ZSgncG9zaXRpb24nKTtcblxuICAgICAgaWYgKHAgPT09ICdzdGF0aWMnKSB7XG4gICAgICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUoZWwsICdwb3NpdGlvbicsICdyZWxhdGl2ZScpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgcmVzZXRCb3VuZGluZygpIHtcbiAgICBpZiAodGhpcy5fYm91bmRpbmcgJiYgdGhpcy5fYm91bmRpbmcucG9zaXRpb24gPT09ICdzdGF0aWMnKSB7XG4gICAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKHRoaXMuX2NvbnRhaW5tZW50LCAncG9zaXRpb24nLCAncmVsYXRpdmUnKTtcbiAgICB9XG4gICAgdGhpcy5fYm91bmRpbmcgPSBudWxsO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRHcmlkU2l6ZSgpIHtcbiAgICAvLyBzZXQgZGVmYXVsdCB2YWx1ZTpcbiAgICB0aGlzLl9ncmlkU2l6ZSA9IHsgeDogMSwgeTogMSB9O1xuXG4gICAgaWYgKHRoaXMucnpHcmlkKSB7XG4gICAgICBpZiAodHlwZW9mIHRoaXMucnpHcmlkID09PSAnbnVtYmVyJykge1xuICAgICAgICB0aGlzLl9ncmlkU2l6ZSA9IHsgeDogdGhpcy5yekdyaWQsIHk6IHRoaXMucnpHcmlkIH07XG4gICAgICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkodGhpcy5yekdyaWQpKSB7XG4gICAgICAgIHRoaXMuX2dyaWRTaXplID0geyB4OiB0aGlzLnJ6R3JpZFswXSwgeTogdGhpcy5yekdyaWRbMV0gfTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiJdfQ==