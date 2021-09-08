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
         */
        function () {
            return this._helper;
        },
        enumerable: true,
        configurable: true
    });
    return HelperBlock;
}());
export { HelperBlock };
if (false) {
    /**
     * @type {?}
     * @protected
     */
    HelperBlock.prototype._helper;
    /**
     * @type {?}
     * @private
     */
    HelperBlock.prototype._added;
    /**
     * @type {?}
     * @protected
     */
    HelperBlock.prototype.parent;
    /**
     * @type {?}
     * @protected
     */
    HelperBlock.prototype.renderer;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVscGVyLWJsb2NrLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhcjItZHJhZ2dhYmxlLyIsInNvdXJjZXMiOlsibGliL3dpZGdldHMvaGVscGVyLWJsb2NrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFFQTtJQUlFLHFCQUNZLE1BQWUsRUFDZixRQUFtQjtRQURuQixXQUFNLEdBQU4sTUFBTSxDQUFTO1FBQ2YsYUFBUSxHQUFSLFFBQVEsQ0FBVztRQUp2QixXQUFNLEdBQUcsS0FBSyxDQUFDOzs7WUFPakIsTUFBTSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDO1FBQzFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRSxVQUFVLENBQUMsQ0FBQztRQUNsRCxRQUFRLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDM0MsUUFBUSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQzVDLFFBQVEsQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLGtCQUFrQixFQUFFLGFBQWEsQ0FBQyxDQUFDO1FBQzdELFFBQVEsQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQztRQUN0QyxRQUFRLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFFdkMsT0FBTztRQUNQLElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO0lBQ3hCLENBQUM7Ozs7SUFFRCx5QkFBRzs7O0lBQUg7UUFDRSx1QkFBdUI7UUFDdkIsSUFBSSxJQUFJLENBQUMsTUFBTSxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUMvQixJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDdEMsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7U0FDcEI7SUFDSCxDQUFDOzs7O0lBRUQsNEJBQU07OztJQUFOO1FBQ0UsSUFBSSxJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7WUFDOUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ3RDLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO1NBQ3JCO0lBQ0gsQ0FBQzs7OztJQUVELDZCQUFPOzs7SUFBUDtRQUNFLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO1FBQ3BCLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO0lBQ3RCLENBQUM7SUFFRCxzQkFBSSwyQkFBRTs7OztRQUFOO1lBQ0UsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDO1FBQ3RCLENBQUM7OztPQUFBO0lBQ0gsa0JBQUM7QUFBRCxDQUFDLEFBNUNELElBNENDOzs7Ozs7O0lBM0NDLDhCQUEyQjs7Ozs7SUFDM0IsNkJBQXVCOzs7OztJQUdyQiw2QkFBeUI7Ozs7O0lBQ3pCLCtCQUE2QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFJlbmRlcmVyMiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5leHBvcnQgY2xhc3MgSGVscGVyQmxvY2sge1xuICBwcm90ZWN0ZWQgX2hlbHBlcjogRWxlbWVudDtcbiAgcHJpdmF0ZSBfYWRkZWQgPSBmYWxzZTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcm90ZWN0ZWQgcGFyZW50OiBFbGVtZW50LFxuICAgIHByb3RlY3RlZCByZW5kZXJlcjogUmVuZGVyZXIyXG4gICkge1xuICAgIC8vIGdlbmVyYXRlIGhlbHBlciBkaXZcbiAgICBsZXQgaGVscGVyID0gcmVuZGVyZXIuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgcmVuZGVyZXIuc2V0U3R5bGUoaGVscGVyLCAncG9zaXRpb24nLCAnYWJzb2x1dGUnKTtcbiAgICByZW5kZXJlci5zZXRTdHlsZShoZWxwZXIsICd3aWR0aCcsICcxMDAlJyk7XG4gICAgcmVuZGVyZXIuc2V0U3R5bGUoaGVscGVyLCAnaGVpZ2h0JywgJzEwMCUnKTtcbiAgICByZW5kZXJlci5zZXRTdHlsZShoZWxwZXIsICdiYWNrZ3JvdW5kLWNvbG9yJywgJ3RyYW5zcGFyZW50Jyk7XG4gICAgcmVuZGVyZXIuc2V0U3R5bGUoaGVscGVyLCAndG9wJywgJzAnKTtcbiAgICByZW5kZXJlci5zZXRTdHlsZShoZWxwZXIsICdsZWZ0JywgJzAnKTtcblxuICAgIC8vIGRvbmVcbiAgICB0aGlzLl9oZWxwZXIgPSBoZWxwZXI7XG4gIH1cblxuICBhZGQoKSB7XG4gICAgLy8gYXBwZW5kIGRpdiB0byBwYXJlbnRcbiAgICBpZiAodGhpcy5wYXJlbnQgJiYgIXRoaXMuX2FkZGVkKSB7XG4gICAgICB0aGlzLnBhcmVudC5hcHBlbmRDaGlsZCh0aGlzLl9oZWxwZXIpO1xuICAgICAgdGhpcy5fYWRkZWQgPSB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIHJlbW92ZSgpIHtcbiAgICBpZiAodGhpcy5wYXJlbnQgJiYgdGhpcy5fYWRkZWQpIHtcbiAgICAgIHRoaXMucGFyZW50LnJlbW92ZUNoaWxkKHRoaXMuX2hlbHBlcik7XG4gICAgICB0aGlzLl9hZGRlZCA9IGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIGRpc3Bvc2UoKSB7XG4gICAgdGhpcy5faGVscGVyID0gbnVsbDtcbiAgICB0aGlzLl9hZGRlZCA9IGZhbHNlO1xuICB9XG5cbiAgZ2V0IGVsKCkge1xuICAgIHJldHVybiB0aGlzLl9oZWxwZXI7XG4gIH1cbn1cbiJdfQ==