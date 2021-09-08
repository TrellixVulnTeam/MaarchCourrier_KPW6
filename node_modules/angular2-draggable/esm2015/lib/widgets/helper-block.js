/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
export class HelperBlock {
    /**
     * @param {?} parent
     * @param {?} renderer
     */
    constructor(parent, renderer) {
        this.parent = parent;
        this.renderer = renderer;
        this._added = false;
        // generate helper div
        /** @type {?} */
        let helper = renderer.createElement('div');
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
    add() {
        // append div to parent
        if (this.parent && !this._added) {
            this.parent.appendChild(this._helper);
            this._added = true;
        }
    }
    /**
     * @return {?}
     */
    remove() {
        if (this.parent && this._added) {
            this.parent.removeChild(this._helper);
            this._added = false;
        }
    }
    /**
     * @return {?}
     */
    dispose() {
        this._helper = null;
        this._added = false;
    }
    /**
     * @return {?}
     */
    get el() {
        return this._helper;
    }
}
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVscGVyLWJsb2NrLmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhcjItZHJhZ2dhYmxlLyIsInNvdXJjZXMiOlsibGliL3dpZGdldHMvaGVscGVyLWJsb2NrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFFQSxNQUFNLE9BQU8sV0FBVzs7Ozs7SUFJdEIsWUFDWSxNQUFlLEVBQ2YsUUFBbUI7UUFEbkIsV0FBTSxHQUFOLE1BQU0sQ0FBUztRQUNmLGFBQVEsR0FBUixRQUFRLENBQVc7UUFKdkIsV0FBTSxHQUFHLEtBQUssQ0FBQzs7O1lBT2pCLE1BQU0sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQztRQUMxQyxRQUFRLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxVQUFVLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFDbEQsUUFBUSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQzNDLFFBQVEsQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUM1QyxRQUFRLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxrQkFBa0IsRUFBRSxhQUFhLENBQUMsQ0FBQztRQUM3RCxRQUFRLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDdEMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBRXZDLE9BQU87UUFDUCxJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztJQUN4QixDQUFDOzs7O0lBRUQsR0FBRztRQUNELHVCQUF1QjtRQUN2QixJQUFJLElBQUksQ0FBQyxNQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQy9CLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUN0QyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztTQUNwQjtJQUNILENBQUM7Ozs7SUFFRCxNQUFNO1FBQ0osSUFBSSxJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7WUFDOUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ3RDLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO1NBQ3JCO0lBQ0gsQ0FBQzs7OztJQUVELE9BQU87UUFDTCxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQztRQUNwQixJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztJQUN0QixDQUFDOzs7O0lBRUQsSUFBSSxFQUFFO1FBQ0osT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDO0lBQ3RCLENBQUM7Q0FDRjs7Ozs7O0lBM0NDLDhCQUEyQjs7Ozs7SUFDM0IsNkJBQXVCOzs7OztJQUdyQiw2QkFBeUI7Ozs7O0lBQ3pCLCtCQUE2QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFJlbmRlcmVyMiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5leHBvcnQgY2xhc3MgSGVscGVyQmxvY2sge1xuICBwcm90ZWN0ZWQgX2hlbHBlcjogRWxlbWVudDtcbiAgcHJpdmF0ZSBfYWRkZWQgPSBmYWxzZTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcm90ZWN0ZWQgcGFyZW50OiBFbGVtZW50LFxuICAgIHByb3RlY3RlZCByZW5kZXJlcjogUmVuZGVyZXIyXG4gICkge1xuICAgIC8vIGdlbmVyYXRlIGhlbHBlciBkaXZcbiAgICBsZXQgaGVscGVyID0gcmVuZGVyZXIuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgcmVuZGVyZXIuc2V0U3R5bGUoaGVscGVyLCAncG9zaXRpb24nLCAnYWJzb2x1dGUnKTtcbiAgICByZW5kZXJlci5zZXRTdHlsZShoZWxwZXIsICd3aWR0aCcsICcxMDAlJyk7XG4gICAgcmVuZGVyZXIuc2V0U3R5bGUoaGVscGVyLCAnaGVpZ2h0JywgJzEwMCUnKTtcbiAgICByZW5kZXJlci5zZXRTdHlsZShoZWxwZXIsICdiYWNrZ3JvdW5kLWNvbG9yJywgJ3RyYW5zcGFyZW50Jyk7XG4gICAgcmVuZGVyZXIuc2V0U3R5bGUoaGVscGVyLCAndG9wJywgJzAnKTtcbiAgICByZW5kZXJlci5zZXRTdHlsZShoZWxwZXIsICdsZWZ0JywgJzAnKTtcblxuICAgIC8vIGRvbmVcbiAgICB0aGlzLl9oZWxwZXIgPSBoZWxwZXI7XG4gIH1cblxuICBhZGQoKSB7XG4gICAgLy8gYXBwZW5kIGRpdiB0byBwYXJlbnRcbiAgICBpZiAodGhpcy5wYXJlbnQgJiYgIXRoaXMuX2FkZGVkKSB7XG4gICAgICB0aGlzLnBhcmVudC5hcHBlbmRDaGlsZCh0aGlzLl9oZWxwZXIpO1xuICAgICAgdGhpcy5fYWRkZWQgPSB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIHJlbW92ZSgpIHtcbiAgICBpZiAodGhpcy5wYXJlbnQgJiYgdGhpcy5fYWRkZWQpIHtcbiAgICAgIHRoaXMucGFyZW50LnJlbW92ZUNoaWxkKHRoaXMuX2hlbHBlcik7XG4gICAgICB0aGlzLl9hZGRlZCA9IGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIGRpc3Bvc2UoKSB7XG4gICAgdGhpcy5faGVscGVyID0gbnVsbDtcbiAgICB0aGlzLl9hZGRlZCA9IGZhbHNlO1xuICB9XG5cbiAgZ2V0IGVsKCkge1xuICAgIHJldHVybiB0aGlzLl9oZWxwZXI7XG4gIH1cbn1cbiJdfQ==