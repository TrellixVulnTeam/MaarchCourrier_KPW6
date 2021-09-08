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
        if (el === void 0) { el = null; }
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
         */
        function () {
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
        (/** @type {?} */ (this)).x += p.x;
        (/** @type {?} */ (this)).y += p.y;
        return (/** @type {?} */ (this));
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
        (/** @type {?} */ (this)).x -= p.x;
        (/** @type {?} */ (this)).y -= p.y;
        return (/** @type {?} */ (this));
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
        (/** @type {?} */ (this)).x = 0;
        (/** @type {?} */ (this)).y = 0;
        return (/** @type {?} */ (this));
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
        (/** @type {?} */ (this)).x = p.x;
        (/** @type {?} */ (this)).y = p.y;
        return (/** @type {?} */ (this));
    };
    return Position;
}());
export { Position };
if (false) {
    /** @type {?} */
    Position.prototype.x;
    /** @type {?} */
    Position.prototype.y;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9zaXRpb24uanMiLCJzb3VyY2VSb290Ijoibmc6Ly9hbmd1bGFyMi1kcmFnZ2FibGUvIiwic291cmNlcyI6WyJsaWIvbW9kZWxzL3Bvc2l0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQSwrQkFHQzs7O0lBRkMsc0JBQVU7O0lBQ1Ysc0JBQVU7O0FBR1o7SUFDRSxrQkFBbUIsQ0FBUyxFQUFTLENBQVM7UUFBM0IsTUFBQyxHQUFELENBQUMsQ0FBUTtRQUFTLE1BQUMsR0FBRCxDQUFDLENBQVE7SUFBSSxDQUFDOzs7Ozs7SUFFNUMsa0JBQVM7Ozs7O0lBQWhCLFVBQWlCLENBQTBCLEVBQUUsRUFBYztRQUFkLG1CQUFBLEVBQUEsU0FBYztRQUN6RDs7OztXQUlHO1FBQ0gsSUFBSSxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQ3hCLE9BQU8sSUFBSSxRQUFRLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDM0M7YUFBTTtZQUNMLElBQUksRUFBRSxLQUFLLElBQUksSUFBSSxDQUFDLENBQUMsY0FBYyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7Z0JBQ2hELE9BQU8sSUFBSSxRQUFRLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQzthQUMvRTtZQUVEOzs7ZUFHRztZQUNILEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsY0FBYyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDaEQsSUFBSSxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sS0FBSyxFQUFFLEVBQUU7b0JBQ3JDLE9BQU8sSUFBSSxRQUFRLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFD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QUksQ0FBQyxDQUFDO1FBQ1osSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDZCxDQUFDOzs7Ozs7SUFFRCx3QkFBSzs7Ozs7SUFBTDtRQUNFLG1CQUFBLElBQUksRUFBQSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDWCxtQkFBQSxJQUFJLEVBQUEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ1gsT0FBTyxtQkFBQSxJQUFJLEVBQUEsQ0FBQztJQUNkLENBQUM7Ozs7Ozs7SUFFRCxzQkFBRzs7Ozs7O0lBQUgsVUFBSSxDQUFZO1FBQ2QsbUJBQUEsSUFBSSxFQUFBLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDYixtQkFBQSxJQUFJLEVBQUEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNiLE9BQU8sbUJBQUEsSUFBSSxFQUFBLENBQUM7SUFDZCxDQUFDO0lBQ0gsZUFBQztBQUFELENBQUMsQUEvRkQsSUErRkM7Ozs7SUE5RmEscUJBQWdCOztJQUFFLHFCQUFnQiIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBpbnRlcmZhY2UgSVBvc2l0aW9uIHtcbiAgeDogbnVtYmVyO1xuICB5OiBudW1iZXI7XG59XG5cbmV4cG9ydCBjbGFzcyBQb3NpdGlvbiBpbXBsZW1lbnRzIElQb3NpdGlvbiB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyB4OiBudW1iZXIsIHB1YmxpYyB5OiBudW1iZXIpIHsgfVxuXG4gIHN0YXRpYyBmcm9tRXZlbnQoZTogTW91c2VFdmVudCB8IFRvdWNoRXZlbnQsIGVsOiBhbnkgPSBudWxsKSB7XG4gICAgLyoqXG4gICAgICogRml4IGlzc3VlOiBSZXNpemUgZG9lc24ndCB3b3JrIG9uIFdpbmRvd3MxMCBJRTExIChhbmQgb24gc29tZSB3aW5kb3dzIDcgSUUxMSlcbiAgICAgKiBodHRwczovL2dpdGh1Yi5jb20veGlleml5dS9hbmd1bGFyMi1kcmFnZ2FibGUvaXNzdWVzLzE2NFxuICAgICAqIGUgaW5zdGFuY2VvZiBNb3VzZUV2ZW50IGNoZWNrIHJldHVybnMgZmFsc2Ugb24gSUUxMVxuICAgICAqL1xuICAgIGlmICh0aGlzLmlzTW91c2VFdmVudChlKSkge1xuICAgICAgcmV0dXJuIG5ldyBQb3NpdGlvbihlLmNsaWVudFgsIGUuY2xpZW50WSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChlbCA9PT0gbnVsbCB8fCBlLmNoYW5nZWRUb3VjaGVzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICByZXR1cm4gbmV3IFBvc2l0aW9uKGUuY2hhbmdlZFRvdWNoZXNbMF0uY2xpZW50WCwgZS5jaGFuZ2VkVG91Y2hlc1swXS5jbGllbnRZKTtcbiAgICAgIH1cblxuICAgICAgLyoqXG4gICAgICAgKiBGaXggaXNzdWU6IE11bHRpcGxlIHBob25lIGRyYWdnYWJsZXMgYXQgdGhlIHNhbWUgdGltZVxuICAgICAgICogaHR0cHM6Ly9naXRodWIuY29tL3hpZXppeXUvYW5ndWxhcjItZHJhZ2dhYmxlL2lzc3Vlcy8xMjhcbiAgICAgICAqL1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBlLmNoYW5nZWRUb3VjaGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChlLmNoYW5nZWRUb3VjaGVzW2ldLnRhcmdldCA9PT0gZWwpIHtcbiAgICAgICAgICByZXR1cm4gbmV3IFBvc2l0aW9uKGUuY2hhbmdlZFRvdWNoZXNbaV0uY2xpZW50WCwgZS5jaGFuZ2VkVG91Y2hlc1tpXS5jbGllbnRZKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyBpc01vdXNlRXZlbnQoZTogTW91c2VFdmVudCB8IFRvdWNoRXZlbnQpOiBlIGlzIE1vdXNlRXZlbnQge1xuICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmFwcGx5KGUpLmluZGV4T2YoJ01vdXNlRXZlbnQnKSA9PT0gODtcbiAgfVxuXG4gIHN0YXRpYyBpc0lQb3NpdGlvbihvYmopOiBvYmogaXMgSVBvc2l0aW9uIHtcbiAgICByZXR1cm4gISFvYmogJiYgKCd4JyBpbiBvYmopICYmICgneScgaW4gb2JqKTtcbiAgfVxuXG4gIHN0YXRpYyBnZXRDdXJyZW50KGVsOiBFbGVtZW50KSB7XG4gICAgbGV0IHBvcyA9IG5ldyBQb3NpdGlvbigwLCAwKTtcblxuICAgIGlmICh3aW5kb3cpIHtcbiAgICAgIGNvbnN0IGNvbXB1dGVkID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUoZWwpO1xuICAgICAgaWYgKGNvbXB1dGVkKSB7XG4gICAgICAgIGxldCB4ID0gcGFyc2VJbnQoY29tcHV0ZWQuZ2V0UHJvcGVydHlWYWx1ZSgnbGVmdCcpLCAxMCk7XG4gICAgICAgIGxldCB5ID0gcGFyc2VJbnQoY29tcHV0ZWQuZ2V0UHJvcGVydHlWYWx1ZSgndG9wJyksIDEwKTtcbiAgICAgICAgcG9zLnggPSBpc05hTih4KSA/IDAgOiB4O1xuICAgICAgICBwb3MueSA9IGlzTmFOKHkpID8gMCA6IHk7XG4gICAgICB9XG4gICAgICByZXR1cm4gcG9zO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdOb3QgU3VwcG9ydGVkIScpO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9XG5cbiAgc3RhdGljIGNvcHkocDogSVBvc2l0aW9uKSB7XG4gICAgcmV0dXJuIG5ldyBQb3NpdGlvbigwLCAwKS5zZXQocCk7XG4gIH1cblxuICBnZXQgdmFsdWUoKTogSVBvc2l0aW9uIHtcbiAgICByZXR1cm4geyB4OiB0aGlzLngsIHk6IHRoaXMueSB9O1xuICB9XG5cbiAgYWRkKHA6IElQb3NpdGlvbikge1xuICAgIHRoaXMueCArPSBwLng7XG4gICAgdGhpcy55ICs9IHAueTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHN1YnRyYWN0KHA6IElQb3NpdGlvbikge1xuICAgIHRoaXMueCAtPSBwLng7XG4gICAgdGhpcy55IC09IHAueTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIG11bHRpcGx5KG46IG51bWJlcikge1xuICAgIHRoaXMueCAqPSBuO1xuICAgIHRoaXMueSAqPSBuO1xuICB9XG5cbiAgZGl2aWRlKG46IG51bWJlcikge1xuICAgIHRoaXMueCAvPSBuO1xuICAgIHRoaXMueSAvPSBuO1xuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy54ID0gMDtcbiAgICB0aGlzLnkgPSAwO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgc2V0KHA6IElQb3NpdGlvbikge1xuICAgIHRoaXMueCA9IHAueDtcbiAgICB0aGlzLnkgPSBwLnk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbn1cbiJdfQ==