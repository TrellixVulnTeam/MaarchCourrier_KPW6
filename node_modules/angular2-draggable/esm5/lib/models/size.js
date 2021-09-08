/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/**
 * @record
 */
export function ISize() { }
if (false) {
    /** @type {?} */
    ISize.prototype.width;
    /** @type {?} */
    ISize.prototype.height;
}
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
        (/** @type {?} */ (this)).width = s.width;
        (/** @type {?} */ (this)).height = s.height;
        return (/** @type {?} */ (this));
    };
    return Size;
}());
export { Size };
if (false) {
    /** @type {?} */
    Size.prototype.width;
    /** @type {?} */
    Size.prototype.height;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2l6ZS5qcyIsInNvdXJjZVJvb3QiOiJuZzovL2FuZ3VsYXIyLWRyYWdnYWJsZS8iLCJzb3VyY2VzIjpbImxpYi9tb2RlbHMvc2l6ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUEsMkJBR0M7OztJQUZDLHNCQUFjOztJQUNkLHVCQUFlOztBQUdqQjtJQUNFLGNBQW1CLEtBQWEsRUFBUyxNQUFjO1FBQXBDLFVBQUssR0FBTCxLQUFLLENBQVE7UUFBUyxXQUFNLEdBQU4sTUFBTSxDQUFRO0lBQUksQ0FBQzs7Ozs7SUFFckQsZUFBVTs7OztJQUFqQixVQUFrQixFQUFXOztZQUN2QixJQUFJLEdBQUcsSUFBSSxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUV6QixJQUFJLE1BQU0sRUFBRTs7Z0JBQ0osUUFBUSxHQUFHLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFLENBQUM7WUFDNUMsSUFBSSxRQUFRLEVBQUU7Z0JBQ1osSUFBSSxDQUFDLEtBQUssR0FBRyxRQUFRLENBQUMsUUFBUSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO2dCQUM5RCxJQUFJLENBQUMsTUFBTSxHQUFHLFFBQVEsQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7YUFDakU7WUFDRCxPQUFPLElBQUksQ0FBQztTQUNiO2FBQU07WUFDTCxPQUFPLENBQUMsS0FBSyxDQUFDLGdCQUFnQixDQUFDLENBQUM7WUFDaEMsT0FBTyxJQUFJLENBQUM7U0FDYjtJQUNILENBQUM7Ozs7O0lBRU0sU0FBSTs7OztJQUFYLFVBQVksQ0FBTztRQUNqQixPQUFPLElBQUksSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDL0IsQ0FBQzs7Ozs7OztJQUVELGtCQUFHOzs7Ozs7SUFBSCxVQUFJLENBQVE7UUFDVixtQkFBQSxJQUFJLEVBQUEsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQztRQUNyQixtQkFBQSxJQUFJLEVBQUEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQztRQUN2QixPQUFPLG1CQUFBLElBQUksRUFBQSxDQUFDO0lBQ2QsQ0FBQztJQUNILFdBQUM7QUFBRCxDQUFDLEFBNUJELElBNEJDOzs7O0lBM0JhLHFCQUFvQjs7SUFBRSxzQkFBcUIiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgaW50ZXJmYWNlIElTaXplIHtcbiAgd2lkdGg6IG51bWJlcjtcbiAgaGVpZ2h0OiBudW1iZXI7XG59XG5cbmV4cG9ydCBjbGFzcyBTaXplIGltcGxlbWVudHMgSVNpemUge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgd2lkdGg6IG51bWJlciwgcHVibGljIGhlaWdodDogbnVtYmVyKSB7IH1cblxuICBzdGF0aWMgZ2V0Q3VycmVudChlbDogRWxlbWVudCkge1xuICAgIGxldCBzaXplID0gbmV3IFNpemUoMCwgMCk7XG5cbiAgICBpZiAod2luZG93KSB7XG4gICAgICBjb25zdCBjb21wdXRlZCA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsKTtcbiAgICAgIGlmIChjb21wdXRlZCkge1xuICAgICAgICBzaXplLndpZHRoID0gcGFyc2VJbnQoY29tcHV0ZWQuZ2V0UHJvcGVydHlWYWx1ZSgnd2lkdGgnKSwgMTApO1xuICAgICAgICBzaXplLmhlaWdodCA9IHBhcnNlSW50KGNvbXB1dGVkLmdldFByb3BlcnR5VmFsdWUoJ2hlaWdodCcpLCAxMCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gc2l6ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc29sZS5lcnJvcignTm90IFN1cHBvcnRlZCEnKTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyBjb3B5KHM6IFNpemUpIHtcbiAgICByZXR1cm4gbmV3IFNpemUoMCwgMCkuc2V0KHMpO1xuICB9XG5cbiAgc2V0KHM6IElTaXplKSB7XG4gICAgdGhpcy53aWR0aCA9IHMud2lkdGg7XG4gICAgdGhpcy5oZWlnaHQgPSBzLmhlaWdodDtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxufVxuIl19