import { CommonModule } from '@angular/common';
import { EventEmitter, Component, ChangeDetectionStrategy, Input, Output, NgModule } from '@angular/core';
import { red, pink, purple, deepPurple, indigo, blue, lightBlue, cyan, teal, green, lightGreen, lime, yellow, amber, orange, deepOrange, brown, blueGrey } from 'material-colors';
import { TinyColor } from '@ctrl/tinycolor';
import { ColorWrap, isValidHex, SwatchModule } from 'ngx-color';

class CircleSwatchComponent {
    constructor() {
        this.circleSize = 28;
        this.circleSpacing = 14;
        this.focus = false;
        this.onClick = new EventEmitter();
        this.onSwatchHover = new EventEmitter();
        this.focusStyle = {};
        this.swatchStyle = {
            borderRadius: '50%',
            background: 'transparent',
            transition: '100ms box-shadow ease 0s',
        };
    }
    ngOnChanges() {
        this.swatchStyle.boxShadow = `inset 0 0 0 ${this.circleSize / 2}px ${this.color}`;
        this.focusStyle.boxShadow = `inset 0 0 0 ${this.circleSize / 2}px ${this.color}, 0 0 5px ${this.color}`;
        if (this.focus) {
            this.focusStyle.boxShadow = `inset 0 0 0 3px ${this.color}, 0 0 5px ${this.color}`;
        }
    }
    handleClick({ hex, $event }) {
        this.onClick.emit({ hex, $event });
    }
}
CircleSwatchComponent.decorators = [
    { type: Component, args: [{
                selector: 'color-circle-swatch',
                template: `
  <div class="circle-swatch"
    [style.width.px]="circleSize" [style.height.px]="circleSize"
    [style.margin-right.px]="circleSpacing" [style.margin-bottom.px]="circleSpacing"
    >
    <color-swatch
      [color]="color" [style]="swatchStyle" [focus]="focus" [focusStyle]="focusStyle"
      (onClick)="handleClick($event)" (onHover)="onSwatchHover.emit($event)">
    </color-swatch>
    <div class="clear"></div>
  </div>
  `,
                changeDetection: ChangeDetectionStrategy.OnPush,
                preserveWhitespaces: false,
                styles: [`
  .circle-swatch {
    transform: scale(1);
    transition: transform 100ms ease;
  }
  .circle-swatch:hover {
    transform: scale(1.2);
  }
  `]
            },] }
];
CircleSwatchComponent.propDecorators = {
    color: [{ type: Input }],
    circleSize: [{ type: Input }],
    circleSpacing: [{ type: Input }],
    focus: [{ type: Input }],
    onClick: [{ type: Output }],
    onSwatchHover: [{ type: Output }]
};

class CircleComponent extends ColorWrap {
    constructor() {
        super();
        /** Pixel value for picker width */
        this.width = 252;
        /** Color squares to display */
        this.colors = [
            red['500'],
            pink['500'],
            purple['500'],
            deepPurple['500'],
            indigo['500'],
            blue['500'],
            lightBlue['500'],
            cyan['500'],
            teal['500'],
            green['500'],
            lightGreen['500'],
            lime['500'],
            yellow['500'],
            amber['500'],
            orange['500'],
            deepOrange['500'],
            brown['500'],
            blueGrey['500'],
        ];
        /** Value for circle size */
        this.circleSize = 28;
        /** Value for spacing between circles */
        this.circleSpacing = 14;
    }
    isActive(color) {
        return new TinyColor(this.hex).equals(color);
    }
    handleBlockChange({ hex, $event }) {
        if (isValidHex(hex)) {
            this.handleChange({ hex, source: 'hex' }, $event);
        }
    }
    handleValueChange({ data, $event }) {
        this.handleChange(data, $event);
    }
}
CircleComponent.decorators = [
    { type: Component, args: [{
                selector: 'color-circle',
                template: `
    <div
      class="circle-picker {{ className }}"
      [style.width.px]="width"
      [style.margin-right.px]="-circleSpacing"
      [style.margin-bottom.px]="-circleSpacing"
    >
      <color-circle-swatch
        *ngFor="let color of colors"
        [circleSize]="circleSize"
        [circleSpacing]="circleSpacing"
        [color]="color"
        [focus]="isActive(color)"
        (onClick)="handleBlockChange($event)"
        (onSwatchHover)="onSwatchHover.emit($event)"
      ></color-circle-swatch>
    </div>
  `,
                changeDetection: ChangeDetectionStrategy.OnPush,
                preserveWhitespaces: false,
                styles: [`
      .circle-picker {
        display: flex;
        flex-wrap: wrap;
      }
    `]
            },] }
];
CircleComponent.ctorParameters = () => [];
CircleComponent.propDecorators = {
    width: [{ type: Input }],
    colors: [{ type: Input }],
    circleSize: [{ type: Input }],
    circleSpacing: [{ type: Input }]
};
class ColorCircleModule {
}
ColorCircleModule.decorators = [
    { type: NgModule, args: [{
                declarations: [CircleComponent, CircleSwatchComponent],
                exports: [CircleComponent, CircleSwatchComponent],
                imports: [CommonModule, SwatchModule],
            },] }
];

/**
 * Generated bundle index. Do not edit.
 */

export { CircleComponent, ColorCircleModule, CircleSwatchComponent as ɵa };
//# sourceMappingURL=ngx-color-circle.js.map
