/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @record
 */
export function IPosition() { }
if (false) {
    /** @type {?} */
    IPosition.prototype.x;
    /** @type {?} */
    IPosition.prototype.y;
}
export class Position {
    /**
     * @param {?} x
     * @param {?} y
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    /**
     * @param {?} e
     * @param {?=} el
     * @return {?}
     */
    static fromEvent(e, el = null) {
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
            for (let i = 0; i < e.changedTouches.length; i++) {
                if (e.changedTouches[i].target === el) {
                    return new Position(e.changedTouches[i].clientX, e.changedTouches[i].clientY);
                }
            }
        }
    }
    /**
     * @param {?} e
     * @return {?}
     */
    static isMouseEvent(e) {
        return Object.prototype.toString.apply(e).indexOf('MouseEvent') === 8;
    }
    /**
     * @param {?} obj
     * @return {?}
     */
    static isIPosition(obj) {
        return !!obj && ('x' in obj) && ('y' in obj);
    }
    /**
     * @param {?} el
     * @return {?}
     */
    static getCurrent(el) {
        /** @type {?} */
        let pos = new Position(0, 0);
        if (window) {
            /** @type {?} */
            const computed = window.getComputedStyle(el);
            if (computed) {
                /** @type {?} */
                let x = parseInt(computed.getPropertyValue('left'), 10);
                /** @type {?} */
                let y = parseInt(computed.getPropertyValue('top'), 10);
                pos.x = isNaN(x) ? 0 : x;
                pos.y = isNaN(y) ? 0 : y;
            }
            return pos;
        }
        else {
            console.error('Not Supported!');
            return null;
        }
    }
    /**
     * @param {?} p
     * @return {?}
     */
    static copy(p) {
        return new Position(0, 0).set(p);
    }
    /**
     * @return {?}
     */
    get value() {
        return { x: this.x, y: this.y };
    }
    /**
     * @template THIS
     * @this {THIS}
     * @param {?} p
     * @return {THIS}
     */
    add(p) {
        (/** @type {?} */ (this)).x += p.x;
        (/** @type {?} */ (this)).y += p.y;
        return (/** @type {?} */ (this));
    }
    /**
     * @template THIS
     * @this {THIS}
     * @param {?} p
     * @return {THIS}
     */
    subtract(p) {
        (/** @type {?} */ (this)).x -= p.x;
        (/** @type {?} */ (this)).y -= p.y;
        return (/** @type {?} */ (this));
    }
    /**
     * @param {?} n
     * @return {?}
     */
    multiply(n) {
        this.x *= n;
        this.y *= n;
    }
    /**
     * @param {?} n
     * @return {?}
     */
    divide(n) {
        this.x /= n;
        this.y /= n;
    }
    /**
     * @template THIS
     * @this {THIS}
     * @return {THIS}
     */
    reset() {
        (/** @type {?} */ (this)).x = 0;
        (/** @type {?} */ (this)).y = 0;
        return (/** @type {?} */ (this));
    }
    /**
     * @template THIS
     * @this {THIS}
     * @param {?} p
     * @return {THIS}
     */
    set(p) {
        (/** @type {?} */ (this)).x = p.x;
        (/** @type {?} */ (this)).y = p.y;
        return (/** @type {?} */ (this));
    }
}
if (false) {
    /** @type {?} */
    Position.prototype.x;
    /** @type {?} */
    Position.prototype.y;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9zaXRpb24uanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyMi1kcmFnZ2FibGUvIiwic291cmNlcyI6WyJsaWIvbW9kZWxzL3Bvc2l0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQSwrQkFHQzs7O0lBRkMsc0JBQVU7O0lBQ1Ysc0JBQVU7O0FBR1osTUFBTSxPQUFPLFFBQVE7Ozs7O0lBQ25CLFlBQW1CLENBQVMsRUFBUyxDQUFTO1FBQTNCLE1BQUMsR0FBRCxDQUFDLENBQVE7UUFBUyxNQUFDLEdBQUQsQ0FBQyxDQUFRO0lBQUksQ0FBQzs7Ozs7O0lBRW5ELE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBMEIsRUFBRSxLQUFVLElBQUk7UUFDekQ7Ozs7V0FJRztRQUNILElBQUksSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUN4QixPQUFPLElBQUksUUFBUSxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQzNDO2FBQU07WUFDTCxJQUFJLEVBQUUsS0FBSyxJQUFJLElBQUksQ0FBQyxDQUFDLGNBQWMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO2dCQUNoRCxPQUFPLElBQUksUUFBUSxDQUFDLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUM7YUFDL0U7WUFFRDs7O2VBR0c7WUFDSCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQ2hELElBQUksQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEtBQUssRUFBRSxFQUFFO29CQUNyQyxPQUFPLElBQUksUUFBUSxDQUFDLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FB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QUFDOzs7Ozs7SUFFRCxLQUFLO1FBQ0gsbUJBQUEsSUFBSSxFQUFBLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNYLG1CQUFBLElBQUksRUFBQSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDWCxPQUFPLG1CQUFBLElBQUksRUFBQSxDQUFDO0lBQ2QsQ0FBQzs7Ozs7OztJQUVELEdBQUcsQ0FBQyxDQUFZO1FBQ2QsbUJBQUEsSUFBSSxFQUFBLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDYixtQkFBQSxJQUFJLEVBQUEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNiLE9BQU8sbUJBQUEsSUFBSSxFQUFBLENBQUM7SUFDZCxDQUFDO0NBQ0Y7OztJQTlGYSxxQkFBZ0I7O0lBQUUscUJBQWdCIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGludGVyZmFjZSBJUG9zaXRpb24ge1xuICB4OiBudW1iZXI7XG4gIHk6IG51bWJlcjtcbn1cblxuZXhwb3J0IGNsYXNzIFBvc2l0aW9uIGltcGxlbWVudHMgSVBvc2l0aW9uIHtcbiAgY29uc3RydWN0b3IocHVibGljIHg6IG51bWJlciwgcHVibGljIHk6IG51bWJlcikgeyB9XG5cbiAgc3RhdGljIGZyb21FdmVudChlOiBNb3VzZUV2ZW50IHwgVG91Y2hFdmVudCwgZWw6IGFueSA9IG51bGwpIHtcbiAgICAvKipcbiAgICAgKiBGaXggaXNzdWU6IFJlc2l6ZSBkb2Vzbid0IHdvcmsgb24gV2luZG93czEwIElFMTEgKGFuZCBvbiBzb21lIHdpbmRvd3MgNyBJRTExKVxuICAgICAqIGh0dHBzOi8vZ2l0aHViLmNvbS94aWV6aXl1L2FuZ3VsYXIyLWRyYWdnYWJsZS9pc3N1ZXMvMTY0XG4gICAgICogZSBpbnN0YW5jZW9mIE1vdXNlRXZlbnQgY2hlY2sgcmV0dXJucyBmYWxzZSBvbiBJRTExXG4gICAgICovXG4gICAgaWYgKHRoaXMuaXNNb3VzZUV2ZW50KGUpKSB7XG4gICAgICByZXR1cm4gbmV3IFBvc2l0aW9uKGUuY2xpZW50WCwgZS5jbGllbnRZKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGVsID09PSBudWxsIHx8IGUuY2hhbmdlZFRvdWNoZXMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgIHJldHVybiBuZXcgUG9zaXRpb24oZS5jaGFuZ2VkVG91Y2hlc1swXS5jbGllbnRYLCBlLmNoYW5nZWRUb3VjaGVzWzBdLmNsaWVudFkpO1xuICAgICAgfVxuXG4gICAgICAvKipcbiAgICAgICAqIEZpeCBpc3N1ZTogTXVsdGlwbGUgcGhvbmUgZHJhZ2dhYmxlcyBhdCB0aGUgc2FtZSB0aW1lXG4gICAgICAgKiBodHRwczovL2dpdGh1Yi5jb20veGlleml5dS9hbmd1bGFyMi1kcmFnZ2FibGUvaXNzdWVzLzEyOFxuICAgICAgICovXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGUuY2hhbmdlZFRvdWNoZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKGUuY2hhbmdlZFRvdWNoZXNbaV0udGFyZ2V0ID09PSBlbCkge1xuICAgICAgICAgIHJldHVybiBuZXcgUG9zaXRpb24oZS5jaGFuZ2VkVG91Y2hlc1tpXS5jbGllbnRYLCBlLmNoYW5nZWRUb3VjaGVzW2ldLmNsaWVudFkpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgc3RhdGljIGlzTW91c2VFdmVudChlOiBNb3VzZUV2ZW50IHwgVG91Y2hFdmVudCk6IGUgaXMgTW91c2VFdmVudCB7XG4gICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuYXBwbHkoZSkuaW5kZXhPZignTW91c2VFdmVudCcpID09PSA4O1xuICB9XG5cbiAgc3RhdGljIGlzSVBvc2l0aW9uKG9iaik6IG9iaiBpcyBJUG9zaXRpb24ge1xuICAgIHJldHVybiAhIW9iaiAmJiAoJ3gnIGluIG9iaikgJiYgKCd5JyBpbiBvYmopO1xuICB9XG5cbiAgc3RhdGljIGdldEN1cnJlbnQoZWw6IEVsZW1lbnQpIHtcbiAgICBsZXQgcG9zID0gbmV3IFBvc2l0aW9uKDAsIDApO1xuXG4gICAgaWYgKHdpbmRvdykge1xuICAgICAgY29uc3QgY29tcHV0ZWQgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbCk7XG4gICAgICBpZiAoY29tcHV0ZWQpIHtcbiAgICAgICAgbGV0IHggPSBwYXJzZUludChjb21wdXRlZC5nZXRQcm9wZXJ0eVZhbHVlKCdsZWZ0JyksIDEwKTtcbiAgICAgICAgbGV0IHkgPSBwYXJzZUludChjb21wdXRlZC5nZXRQcm9wZXJ0eVZhbHVlKCd0b3AnKSwgMTApO1xuICAgICAgICBwb3MueCA9IGlzTmFOKHgpID8gMCA6IHg7XG4gICAgICAgIHBvcy55ID0gaXNOYU4oeSkgPyAwIDogeTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBwb3M7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ05vdCBTdXBwb3J0ZWQhJyk7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgY29weShwOiBJUG9zaXRpb24pIHtcbiAgICByZXR1cm4gbmV3IFBvc2l0aW9uKDAsIDApLnNldChwKTtcbiAgfVxuXG4gIGdldCB2YWx1ZSgpOiBJUG9zaXRpb24ge1xuICAgIHJldHVybiB7IHg6IHRoaXMueCwgeTogdGhpcy55IH07XG4gIH1cblxuICBhZGQocDogSVBvc2l0aW9uKSB7XG4gICAgdGhpcy54ICs9IHAueDtcbiAgICB0aGlzLnkgKz0gcC55O1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgc3VidHJhY3QocDogSVBvc2l0aW9uKSB7XG4gICAgdGhpcy54IC09IHAueDtcbiAgICB0aGlzLnkgLT0gcC55O1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgbXVsdGlwbHkobjogbnVtYmVyKSB7XG4gICAgdGhpcy54ICo9IG47XG4gICAgdGhpcy55ICo9IG47XG4gIH1cblxuICBkaXZpZGUobjogbnVtYmVyKSB7XG4gICAgdGhpcy54IC89IG47XG4gICAgdGhpcy55IC89IG47XG4gIH1cblxuICByZXNldCgpIHtcbiAgICB0aGlzLnggPSAwO1xuICAgIHRoaXMueSA9IDA7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBzZXQocDogSVBvc2l0aW9uKSB7XG4gICAgdGhpcy54ID0gcC54O1xuICAgIHRoaXMueSA9IHAueTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxufVxuIl19