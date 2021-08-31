import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, } from '@angular/core';
export class SketchPresetColorsComponent {
    constructor() {
        this.onClick = new EventEmitter();
        this.onSwatchHover = new EventEmitter();
        this.swatchStyle = {
            borderRadius: '3px',
            boxShadow: 'inset 0 0 0 1px rgba(0,0,0,.15)',
        };
    }
    handleClick({ hex, $event }) {
        this.onClick.emit({ hex, $event });
    }
    normalizeValue(val) {
        if (typeof val === 'string') {
            return { color: val };
        }
        return val;
    }
    focusStyle(val) {
        const c = this.normalizeValue(val);
        return {
            boxShadow: `inset 0 0 0 1px rgba(0,0,0,.15), 0 0 4px ${c.color}`,
        };
    }
}
SketchPresetColorsComponent.decorators = [
    { type: Component, args: [{
                selector: 'color-sketch-preset-colors',
                template: `
  <div class="sketch-swatches">
    <div class="sketch-wrap" *ngFor="let c of colors">
      <color-swatch
        [color]="normalizeValue(c).color"
        [style]="swatchStyle"
        [focusStyle]="focusStyle(c)"
        (onClick)="handleClick($event)"
        (onHover)="onSwatchHover.emit($event)"
        class="swatch"
      ></color-swatch>
    </div>
  </div>
  `,
                changeDetection: ChangeDetectionStrategy.OnPush,
                preserveWhitespaces: false,
                styles: [`
    .sketch-swatches {
      position: relative;
      display: flex;
      flex-wrap: wrap;
      margin: 0px -10px;
      padding: 10px 0px 0px 10px;
      border-top: 1px solid rgb(238, 238, 238);
    }
    .sketch-wrap {
      width: 16px;
      height: 16px;
      margin: 0px 10px 10px 0px;
    }
    :host-context([dir=rtl]) .sketch-swatches {
      padding-right: 10px;
      padding-left: 0;
    }
    :host-context([dir=rtl]) .sketch-wrap {
      margin-left: 10px;
      margin-right: 0;
    }
  `]
            },] }
];
SketchPresetColorsComponent.propDecorators = {
    colors: [{ type: Input }],
    onClick: [{ type: Output }],
    onSwatchHover: [{ type: Output }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2tldGNoLXByZXNldC1jb2xvcnMuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Ii4uLy4uLy4uLy4uL3NyYy9saWIvY29tcG9uZW50cy9za2V0Y2gvIiwic291cmNlcyI6WyJza2V0Y2gtcHJlc2V0LWNvbG9ycy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNMLHVCQUF1QixFQUN2QixTQUFTLEVBQ1QsWUFBWSxFQUNaLEtBQUssRUFDTCxNQUFNLEdBQ1AsTUFBTSxlQUFlLENBQUM7QUFnRHZCLE1BQU0sT0FBTywyQkFBMkI7SUE1Q3hDO1FBOENZLFlBQU8sR0FBRyxJQUFJLFlBQVksRUFBTyxDQUFDO1FBQ2xDLGtCQUFhLEdBQUcsSUFBSSxZQUFZLEVBQU8sQ0FBQztRQUNsRCxnQkFBVyxHQUFHO1lBQ1osWUFBWSxFQUFFLEtBQUs7WUFDbkIsU0FBUyxFQUFFLGlDQUFpQztTQUM3QyxDQUFDO0lBaUJKLENBQUM7SUFmQyxXQUFXLENBQUMsRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFO1FBQ3pCLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUM7SUFDckMsQ0FBQztJQUNELGNBQWMsQ0FBQyxHQUFtQjtRQUNoQyxJQUFJLE9BQU8sR0FBRyxLQUFLLFFBQVEsRUFBRTtZQUMzQixPQUFPLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxDQUFDO1NBQ3ZCO1FBQ0QsT0FBTyxHQUFHLENBQUM7SUFDYixDQUFDO0lBQ0QsVUFBVSxDQUFDLEdBQW1CO1FBQzVCLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDbkMsT0FBTztZQUNMLFNBQVMsRUFBRSw0Q0FBNEMsQ0FBQyxDQUFDLEtBQUssRUFBRTtTQUNqRSxDQUFDO0lBQ0osQ0FBQzs7O1lBbkVGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsNEJBQTRCO2dCQUN0QyxRQUFRLEVBQUU7Ozs7Ozs7Ozs7Ozs7R0FhVDtnQkEwQkQsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07Z0JBQy9DLG1CQUFtQixFQUFFLEtBQUs7eUJBekJ4Qjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXNCRDthQUlGOzs7cUJBRUUsS0FBSztzQkFDTCxNQUFNOzRCQUNOLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ29tcG9uZW50LFxuICBFdmVudEVtaXR0ZXIsXG4gIElucHV0LFxuICBPdXRwdXQsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBTaGFwZSB9IGZyb20gJ25neC1jb2xvcic7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2NvbG9yLXNrZXRjaC1wcmVzZXQtY29sb3JzJyxcbiAgdGVtcGxhdGU6IGBcbiAgPGRpdiBjbGFzcz1cInNrZXRjaC1zd2F0Y2hlc1wiPlxuICAgIDxkaXYgY2xhc3M9XCJza2V0Y2gtd3JhcFwiICpuZ0Zvcj1cImxldCBjIG9mIGNvbG9yc1wiPlxuICAgICAgPGNvbG9yLXN3YXRjaFxuICAgICAgICBbY29sb3JdPVwibm9ybWFsaXplVmFsdWUoYykuY29sb3JcIlxuICAgICAgICBbc3R5bGVdPVwic3dhdGNoU3R5bGVcIlxuICAgICAgICBbZm9jdXNTdHlsZV09XCJmb2N1c1N0eWxlKGMpXCJcbiAgICAgICAgKG9uQ2xpY2spPVwiaGFuZGxlQ2xpY2soJGV2ZW50KVwiXG4gICAgICAgIChvbkhvdmVyKT1cIm9uU3dhdGNoSG92ZXIuZW1pdCgkZXZlbnQpXCJcbiAgICAgICAgY2xhc3M9XCJzd2F0Y2hcIlxuICAgICAgPjwvY29sb3Itc3dhdGNoPlxuICAgIDwvZGl2PlxuICA8L2Rpdj5cbiAgYCxcbiAgc3R5bGVzOiBbXG4gICAgYFxuICAgIC5za2V0Y2gtc3dhdGNoZXMge1xuICAgICAgcG9zaXRpb246IHJlbGF0aXZlO1xuICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgIGZsZXgtd3JhcDogd3JhcDtcbiAgICAgIG1hcmdpbjogMHB4IC0xMHB4O1xuICAgICAgcGFkZGluZzogMTBweCAwcHggMHB4IDEwcHg7XG4gICAgICBib3JkZXItdG9wOiAxcHggc29saWQgcmdiKDIzOCwgMjM4LCAyMzgpO1xuICAgIH1cbiAgICAuc2tldGNoLXdyYXAge1xuICAgICAgd2lkdGg6IDE2cHg7XG4gICAgICBoZWlnaHQ6IDE2cHg7XG4gICAgICBtYXJnaW46IDBweCAxMHB4IDEwcHggMHB4O1xuICAgIH1cbiAgICA6aG9zdC1jb250ZXh0KFtkaXI9cnRsXSkgLnNrZXRjaC1zd2F0Y2hlcyB7XG4gICAgICBwYWRkaW5nLXJpZ2h0OiAxMHB4O1xuICAgICAgcGFkZGluZy1sZWZ0OiAwO1xuICAgIH1cbiAgICA6aG9zdC1jb250ZXh0KFtkaXI9cnRsXSkgLnNrZXRjaC13cmFwIHtcbiAgICAgIG1hcmdpbi1sZWZ0OiAxMHB4O1xuICAgICAgbWFyZ2luLXJpZ2h0OiAwO1xuICAgIH1cbiAgYCxcbiAgXSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIHByZXNlcnZlV2hpdGVzcGFjZXM6IGZhbHNlLFxufSlcbmV4cG9ydCBjbGFzcyBTa2V0Y2hQcmVzZXRDb2xvcnNDb21wb25lbnQge1xuICBASW5wdXQoKSBjb2xvcnMhOiBzdHJpbmdbXTtcbiAgQE91dHB1dCgpIG9uQ2xpY2sgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcbiAgQE91dHB1dCgpIG9uU3dhdGNoSG92ZXIgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcbiAgc3dhdGNoU3R5bGUgPSB7XG4gICAgYm9yZGVyUmFkaXVzOiAnM3B4JyxcbiAgICBib3hTaGFkb3c6ICdpbnNldCAwIDAgMCAxcHggcmdiYSgwLDAsMCwuMTUpJyxcbiAgfTtcblxuICBoYW5kbGVDbGljayh7IGhleCwgJGV2ZW50IH0pIHtcbiAgICB0aGlzLm9uQ2xpY2suZW1pdCh7IGhleCwgJGV2ZW50IH0pO1xuICB9XG4gIG5vcm1hbGl6ZVZhbHVlKHZhbDogc3RyaW5nIHwgU2hhcGUpIHtcbiAgICBpZiAodHlwZW9mIHZhbCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHJldHVybiB7IGNvbG9yOiB2YWwgfTtcbiAgICB9XG4gICAgcmV0dXJuIHZhbDtcbiAgfVxuICBmb2N1c1N0eWxlKHZhbDogc3RyaW5nIHwgU2hhcGUpIHtcbiAgICBjb25zdCBjID0gdGhpcy5ub3JtYWxpemVWYWx1ZSh2YWwpO1xuICAgIHJldHVybiB7XG4gICAgICBib3hTaGFkb3c6IGBpbnNldCAwIDAgMCAxcHggcmdiYSgwLDAsMCwuMTUpLCAwIDAgNHB4ICR7Yy5jb2xvcn1gLFxuICAgIH07XG4gIH1cbn1cbiJdfQ==