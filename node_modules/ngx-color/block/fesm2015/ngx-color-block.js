import { CommonModule } from '@angular/common';
import { EventEmitter, Component, Input, Output, ChangeDetectionStrategy, NgModule } from '@angular/core';
import { ColorWrap, getContrastingColor, isValidHex, CheckboardModule, SwatchModule, EditableInputModule } from 'ngx-color';

class BlockSwatchesComponent {
    constructor() {
        this.onClick = new EventEmitter();
        this.onSwatchHover = new EventEmitter();
    }
    ngOnInit() {
        this.swatchStyle = {
            width: '22px',
            height: '22px',
            float: 'left',
            marginRight: '10px',
            marginBottom: '10px',
            borderRadius: '4px',
        };
    }
    handleClick({ hex, $event }) {
        this.onClick.emit({ hex, $event });
    }
    focusStyle(c) {
        return {
            boxShadow: `${c} 0 0 4px`,
        };
    }
}
BlockSwatchesComponent.decorators = [
    { type: Component, args: [{
                selector: 'color-block-swatches',
                template: `
    <div class="block-swatches">
      <color-swatch
        *ngFor="let c of colors"
        [color]="c"
        [style]="swatchStyle"
        [focusStyle]="focusStyle(c)"
        (onClick)="handleClick($event)"
        (onHover)="onSwatchHover.emit($event)"
      ></color-swatch>
      <div class="clear"></div>
    </div>
  `,
                styles: [`
    .block-swatches {
      margin-right: -10px;
    }
    .clear {
      clear: both;
    }
  `]
            },] }
];
BlockSwatchesComponent.ctorParameters = () => [];
BlockSwatchesComponent.propDecorators = {
    colors: [{ type: Input }],
    onClick: [{ type: Output }],
    onSwatchHover: [{ type: Output }]
};

class BlockComponent extends ColorWrap {
    constructor() {
        super();
        /** Pixel value for picker width */
        this.width = 170;
        /** Color squares to display */
        this.colors = [
            '#D9E3F0',
            '#F47373',
            '#697689',
            '#37D67A',
            '#2CCCE4',
            '#555555',
            '#dce775',
            '#ff8a65',
            '#ba68c8',
        ];
        this.triangle = 'top';
        this.input = {
            width: '100%',
            fontSize: '12px',
            color: '#666',
            border: '0px',
            outline: 'none',
            height: '22px',
            boxShadow: 'inset 0 0 0 1px #ddd',
            borderRadius: '4px',
            padding: '0 7px',
            boxSizing: 'border-box',
        };
        this.wrap = {
            position: 'relative',
            width: '100%',
        };
        this.disableAlpha = true;
    }
    handleValueChange({ data, $event }) {
        this.handleBlockChange({ hex: data, $event });
    }
    getContrastingColor(hex) {
        return getContrastingColor(hex);
    }
    handleBlockChange({ hex, $event }) {
        if (isValidHex(hex)) {
            // this.hex = hex;
            this.handleChange({
                hex,
                source: 'hex',
            }, $event);
        }
    }
}
BlockComponent.decorators = [
    { type: Component, args: [{
                selector: 'color-block',
                template: `
  <div class="block-card block-picker {{ className }}">
    <div class="block-triangle" *ngIf="triangle !== 'hide'"
      [style.border-color]="'transparent transparent ' + this.hex + ' transparent'"
    ></div>

    <div class="block-head" [style.background]="hex">
      <color-checkboard *ngIf="hex === 'transparent'"
        borderRadius="6px 6px 0 0"
      ></color-checkboard>
      <div class="block-label" [style.color]="getContrastingColor(hex)">
        {{ hex }}
      </div>
    </div>

    <div class="block-body">
      <color-block-swatches [colors]="colors"
        (onClick)="handleBlockChange($event)"
        (onSwatchHover)="onSwatchHover.emit($event)"
      ></color-block-swatches>
      <color-editable-input [value]="hex"
        (onChange)="handleValueChange($event)"
        [style]="{input: input, wrap: wrap}"
      ></color-editable-input>
    </div>
  </div>
  `,
                preserveWhitespaces: false,
                changeDetection: ChangeDetectionStrategy.OnPush,
                styles: [`
    .block-card {
      background: #fff;
      border-radius: 6px;
      box-shadow: 0 1px rgba(0, 0, 0, .1);
      position: relative;
    }
    .block-head {
      align-items: center;
      border-radius: 6px 6px 0 0;
      display: flex;
      height: 110px;
      justify-content: center;
      position: relative;
    }
    .block-body {
      padding: 10px;
    }
    .block-label {
      font-size: 18px;
      position: relative;
    }
    .block-triangle {
      border-style: solid;
      border-width: 0 10px 10px 10px;
      height: 0;
      left: 50%;
      margin-left: -10px;
      position: absolute;
      top: -10px;
      width: 0;
    }
  `]
            },] }
];
BlockComponent.ctorParameters = () => [];
BlockComponent.propDecorators = {
    width: [{ type: Input }],
    colors: [{ type: Input }],
    triangle: [{ type: Input }]
};
class ColorBlockModule {
}
ColorBlockModule.decorators = [
    { type: NgModule, args: [{
                declarations: [BlockComponent, BlockSwatchesComponent],
                exports: [BlockComponent, BlockSwatchesComponent],
                imports: [CommonModule, CheckboardModule, SwatchModule, EditableInputModule],
            },] }
];

/**
 * Generated bundle index. Do not edit.
 */

export { BlockComponent, ColorBlockModule, BlockSwatchesComponent as ɵa };
//# sourceMappingURL=ngx-color-block.js.map
