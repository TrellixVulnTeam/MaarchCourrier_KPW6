import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, Input, NgModule } from '@angular/core';
import { ColorWrap, toState, AlphaModule, CheckboardModule } from 'ngx-color';

class AlphaPickerComponent extends ColorWrap {
    constructor() {
        super();
        /** Pixel value for picker width */
        this.width = 316;
        /** Pixel value for picker height */
        this.height = 16;
        this.direction = 'horizontal';
        this.pointer = {
            width: '18px',
            height: '18px',
            borderRadius: '50%',
            transform: 'translate(-9px, -2px)',
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
        this.handleChange(data, $event);
    }
}
AlphaPickerComponent.decorators = [
    { type: Component, args: [{
                selector: 'color-alpha-picker',
                template: `
    <div class="alpha-picker {{ className }}"
      [style.width.px]="width" [style.height.px]="height">
      <color-alpha
        [hsl]="hsl"
        [rgb]="rgb"
        [pointer]="pointer"
        [direction]="direction"
        (onChange)="handlePickerChange($event)"
      ></color-alpha>
    </div>
  `,
                changeDetection: ChangeDetectionStrategy.OnPush,
                preserveWhitespaces: false,
                styles: [`
    .alpha-picker {
      position: relative;
    }
    .color-alpha {
      radius: 2px;
    }
  `]
            },] }
];
AlphaPickerComponent.ctorParameters = () => [];
AlphaPickerComponent.propDecorators = {
    width: [{ type: Input }],
    height: [{ type: Input }],
    direction: [{ type: Input }]
};
class ColorAlphaModule {
}
ColorAlphaModule.decorators = [
    { type: NgModule, args: [{
                declarations: [AlphaPickerComponent],
                exports: [AlphaPickerComponent],
                imports: [CommonModule, AlphaModule, CheckboardModule],
            },] }
];

/**
 * Generated bundle index. Do not edit.
 */

export { AlphaPickerComponent, ColorAlphaModule };
//# sourceMappingURL=ngx-color-alpha.js.map
