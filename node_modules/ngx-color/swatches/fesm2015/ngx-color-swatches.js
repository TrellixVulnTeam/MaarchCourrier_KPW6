import { CommonModule } from '@angular/common';
import { EventEmitter, Component, ChangeDetectionStrategy, Input, Output, NgModule } from '@angular/core';
import { red, pink, purple, deepPurple, indigo, blue, lightBlue, cyan, teal, green, lightGreen, lime, yellow, amber, orange, deepOrange, brown, blueGrey } from 'material-colors';
import { getContrastingColor, ColorWrap, SwatchModule, RaisedModule } from 'ngx-color';

class SwatchesColorComponent {
    constructor() {
        this.first = false;
        this.last = false;
        this.onClick = new EventEmitter();
        this.onSwatchHover = new EventEmitter();
        this.getContrastingColor = getContrastingColor;
        this.colorStyle = {
            width: '40px',
            height: '24px',
            cursor: 'pointer',
            marginBottom: '1px',
        };
        this.focusStyle = {};
    }
    ngOnInit() {
        this.colorStyle.background = this.color;
        this.focusStyle.boxShadow = `0 0 4px ${this.color}`;
        if (this.first) {
            this.colorStyle.borderRadius = '2px 2px 0 0';
        }
        if (this.last) {
            this.colorStyle.borderRadius = '0 0 2px 2px';
        }
        if (this.color === '#FFFFFF') {
            this.colorStyle.boxShadow = 'inset 0 0 0 1px #ddd';
        }
    }
    handleClick($event) {
        this.onClick.emit({
            data: {
                hex: this.color,
                source: 'hex',
            },
            $event,
        });
    }
}
SwatchesColorComponent.decorators = [
    { type: Component, args: [{
                selector: 'color-swatches-color',
                template: `
    <color-swatch
      [color]="color"
      [style]="colorStyle"
      [focusStyle]="focusStyle"
      [class.first]="first"
      [class.last]="last"
      (click)="handleClick($event)"
      (keydown.enter)="handleClick($event)"
      (onHover)="onSwatchHover.emit($event)"
    >
      <div class="swatch-check" *ngIf="active" [class.first]="first" [class.last]="last">
        <svg
          style="width: 24px; height: 24px;"
          viewBox="0 0 24 24"
          [style.fill]="getContrastingColor(color)"
        >
          <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" />
        </svg>
      </div>
    </color-swatch>
  `,
                changeDetection: ChangeDetectionStrategy.OnPush,
                preserveWhitespaces: false,
                styles: [`
      .swatches-group {
        padding-bottom: 10px;
        width: 40px;
        float: left;
        margin-right: 10px;
      }
      .swatch-check {
        display: flex;
        margin-left: 8px;
      }
    `]
            },] }
];
SwatchesColorComponent.propDecorators = {
    color: [{ type: Input }],
    first: [{ type: Input }],
    last: [{ type: Input }],
    active: [{ type: Input }],
    onClick: [{ type: Output }],
    onSwatchHover: [{ type: Output }]
};

class SwatchesGroupComponent {
    constructor() {
        this.onClick = new EventEmitter();
        this.onSwatchHover = new EventEmitter();
    }
}
SwatchesGroupComponent.decorators = [
    { type: Component, args: [{
                selector: 'color-swatches-group',
                template: `
    <div class="swatches-group">
      <color-swatches-color
        *ngFor="let color of group; let idx = index"
        [active]="color.toLowerCase() === active"
        [color]="color"
        [first]="idx === 0"
        [last]="idx === group.length - 1"
        (onClick)="onClick.emit($event)"
      >
      </color-swatches-color>
    </div>
  `,
                changeDetection: ChangeDetectionStrategy.OnPush,
                preserveWhitespaces: false,
                styles: [`
      .swatches-group {
        padding-bottom: 10px;
        width: 40px;
        float: left;
        margin-right: 10px;
      }
    `]
            },] }
];
SwatchesGroupComponent.propDecorators = {
    group: [{ type: Input }],
    active: [{ type: Input }],
    onClick: [{ type: Output }],
    onSwatchHover: [{ type: Output }]
};

class SwatchesComponent extends ColorWrap {
    constructor() {
        super();
        /** Pixel value for picker width */
        this.width = 320;
        /** Color squares to display */
        this.height = 240;
        /** An array of color groups, each with an array of colors */
        this.colors = [
            [
                red['900'],
                red['700'],
                red['500'],
                red['300'],
                red['100'],
            ],
            [
                pink['900'],
                pink['700'],
                pink['500'],
                pink['300'],
                pink['100'],
            ],
            [
                purple['900'],
                purple['700'],
                purple['500'],
                purple['300'],
                purple['100'],
            ],
            [
                deepPurple['900'],
                deepPurple['700'],
                deepPurple['500'],
                deepPurple['300'],
                deepPurple['100'],
            ],
            [
                indigo['900'],
                indigo['700'],
                indigo['500'],
                indigo['300'],
                indigo['100'],
            ],
            [
                blue['900'],
                blue['700'],
                blue['500'],
                blue['300'],
                blue['100'],
            ],
            [
                lightBlue['900'],
                lightBlue['700'],
                lightBlue['500'],
                lightBlue['300'],
                lightBlue['100'],
            ],
            [
                cyan['900'],
                cyan['700'],
                cyan['500'],
                cyan['300'],
                cyan['100'],
            ],
            [
                teal['900'],
                teal['700'],
                teal['500'],
                teal['300'],
                teal['100'],
            ],
            [
                '#194D33',
                green['700'],
                green['500'],
                green['300'],
                green['100'],
            ],
            [
                lightGreen['900'],
                lightGreen['700'],
                lightGreen['500'],
                lightGreen['300'],
                lightGreen['100'],
            ],
            [
                lime['900'],
                lime['700'],
                lime['500'],
                lime['300'],
                lime['100'],
            ],
            [
                yellow['900'],
                yellow['700'],
                yellow['500'],
                yellow['300'],
                yellow['100'],
            ],
            [
                amber['900'],
                amber['700'],
                amber['500'],
                amber['300'],
                amber['100'],
            ],
            [
                orange['900'],
                orange['700'],
                orange['500'],
                orange['300'],
                orange['100'],
            ],
            [
                deepOrange['900'],
                deepOrange['700'],
                deepOrange['500'],
                deepOrange['300'],
                deepOrange['100'],
            ],
            [
                brown['900'],
                brown['700'],
                brown['500'],
                brown['300'],
                brown['100'],
            ],
            [
                blueGrey['900'],
                blueGrey['700'],
                blueGrey['500'],
                blueGrey['300'],
                blueGrey['100'],
            ],
            ['#000000', '#525252', '#969696', '#D9D9D9', '#FFFFFF'],
        ];
        this.zDepth = 1;
        this.radius = 1;
        this.background = '#fff';
    }
    handlePickerChange({ data, $event }) {
        this.handleChange(data, $event);
    }
}
SwatchesComponent.decorators = [
    { type: Component, args: [{
                selector: 'color-swatches',
                template: `
  <div class="swatches-picker {{ className }}"
    [style.width.px]="width" [style.height.px]="height">
    <color-raised [zDepth]="zDepth" [background]="background" [radius]="radius">
      <div class="swatches-overflow" [style.height.px]="height">
        <div class="swatches-body">
          <color-swatches-group
            *ngFor="let group of colors"
            [group]="group" [active]="hex"
            (onClick)="handlePickerChange($event)"
          ></color-swatches-group>
        </div>
      </div>
    </color-raised>
  </div>
  `,
                changeDetection: ChangeDetectionStrategy.OnPush,
                preserveWhitespaces: false,
                styles: [`
      .swatches-overflow {
        overflow-y: scroll;
      }
      .swatches-overflow {
        padding: 16px 0 6px 16px;
      }
    `]
            },] }
];
SwatchesComponent.ctorParameters = () => [];
SwatchesComponent.propDecorators = {
    width: [{ type: Input }],
    height: [{ type: Input }],
    colors: [{ type: Input }],
    zDepth: [{ type: Input }],
    radius: [{ type: Input }],
    background: [{ type: Input }]
};
class ColorSwatchesModule {
}
ColorSwatchesModule.decorators = [
    { type: NgModule, args: [{
                declarations: [
                    SwatchesComponent,
                    SwatchesGroupComponent,
                    SwatchesColorComponent,
                ],
                exports: [SwatchesComponent, SwatchesGroupComponent, SwatchesColorComponent],
                imports: [CommonModule, SwatchModule, RaisedModule],
            },] }
];

/**
 * Generated bundle index. Do not edit.
 */

export { ColorSwatchesModule, SwatchesComponent, SwatchesGroupComponent as ɵa, SwatchesColorComponent as ɵb };
//# sourceMappingURL=ngx-color-swatches.js.map
