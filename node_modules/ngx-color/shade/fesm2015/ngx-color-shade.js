import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, Input, NgModule } from '@angular/core';
import { ColorWrap, toState, ShadeModule } from 'ngx-color';

class ShadeSliderComponent extends ColorWrap {
    constructor() {
        super();
        /** Pixel value for picker width */
        this.width = 316;
        /** Pixel value for picker height */
        this.height = 16;
        this.pointer = {
            width: '18px',
            height: '18px',
            borderRadius: '50%',
            transform: 'translate(-9px, -2px)',
            boxShadow: '0 1px 4px 0 rgba(0, 0, 0, 0.37)',
        };
    }
    ngOnChanges() {
        this.setState(toState(this.color, this.oldHue));
    }
    handlePickerChange({ data, $event }) {
        this.handleChange(data, $event);
    }
}
ShadeSliderComponent.decorators = [
    { type: Component, args: [{
                selector: 'color-shade-picker',
                template: `
    <div class="shade-slider {{ className || '' }}"
      [style.width.px]="width" [style.height.px]="height">
      <color-shade
        [hsl]="hsl"
        [rgb]="rgb"
        [pointer]="pointer"
        (onChange)="handlePickerChange($event)"
      ></color-shade>
    </div>
  `,
                changeDetection: ChangeDetectionStrategy.OnPush,
                preserveWhitespaces: false,
                styles: [`
    .shade-slider {
      position: relative;
    }
  `]
            },] }
];
ShadeSliderComponent.ctorParameters = () => [];
ShadeSliderComponent.propDecorators = {
    width: [{ type: Input }],
    height: [{ type: Input }]
};
class ColorShadeModule {
}
ColorShadeModule.decorators = [
    { type: NgModule, args: [{
                declarations: [ShadeSliderComponent],
                exports: [ShadeSliderComponent],
                imports: [CommonModule, ShadeModule],
            },] }
];

/**
 * Generated bundle index. Do not edit.
 */

export { ColorShadeModule, ShadeSliderComponent };
//# sourceMappingURL=ngx-color-shade.js.map
