import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, Input, NgModule } from '@angular/core';
import { ColorWrap, toState, HueModule } from 'ngx-color';

class HuePickerComponent extends ColorWrap {
    constructor() {
        super();
        /** Pixel value for picker width */
        this.width = 316;
        /** Pixel value for picker height */
        this.height = 16;
        this.radius = 2;
        this.direction = 'horizontal';
        this.pointer = {
            width: '18px',
            height: '18px',
            borderRadius: '50%',
            transform: 'translate(-9px, -2px)',
            backgroundColor: 'rgb(248, 248, 248)',
            boxShadow: '0 1px 4px 0 rgba(0, 0, 0, 0.37)',
        };
    }
    ngOnChanges() {
        if (this.direction === 'vertical') {
            this.pointer.transform = 'translate(-3px, -9px)';
        }
        this.setState(toState(this.color, this.oldHue));
    }
    handlePickerChange({ data, $event }) {
        this.handleChange({ a: 1, h: data.h, l: 0.5, s: 1 }, $event);
    }
}
HuePickerComponent.decorators = [
    { type: Component, args: [{
                selector: 'color-hue-picker',
                template: `
  <div class="hue-picker {{ className }}"
    [style.width.px]="width" [style.height.px]="height"
  >
    <color-hue [hsl]="hsl" [pointer]="pointer"
      [direction]="direction" [radius]="radius"
      (onChange)="handlePickerChange($event)"
    ></color-hue>
  </div>
  `,
                changeDetection: ChangeDetectionStrategy.OnPush,
                preserveWhitespaces: false,
                styles: [`
    .hue-picker {
      position: relative;
    }
  `]
            },] }
];
HuePickerComponent.ctorParameters = () => [];
HuePickerComponent.propDecorators = {
    width: [{ type: Input }],
    height: [{ type: Input }],
    radius: [{ type: Input }],
    direction: [{ type: Input }]
};
class ColorHueModule {
}
ColorHueModule.decorators = [
    { type: NgModule, args: [{
                declarations: [HuePickerComponent],
                exports: [HuePickerComponent],
                imports: [CommonModule, HueModule],
            },] }
];

/**
 * Generated bundle index. Do not edit.
 */

export { ColorHueModule, HuePickerComponent };
//# sourceMappingURL=ngx-color-hue.js.map
