import { CommonModule } from '@angular/common';
import { EventEmitter, Component, ChangeDetectionStrategy, Input, Output, NgModule } from '@angular/core';
import { getContrastingColor, isValidHex, ColorWrap, EditableInputModule, SwatchModule, RaisedModule } from 'ngx-color';

class CompactColorComponent {
    constructor() {
        this.onClick = new EventEmitter();
        this.onSwatchHover = new EventEmitter();
        this.swatchStyle = {
            width: '15px',
            height: '15px',
            float: 'left',
            marginRight: '5px',
            marginBottom: '5px',
            position: 'relative',
            cursor: 'pointer',
        };
        this.swatchFocus = {};
        this.getContrastingColor = getContrastingColor;
    }
    ngOnChanges() {
        this.swatchStyle.background = this.color;
        this.swatchFocus.boxShadow = `0 0 4px ${this.color}`;
        if (this.color.toLowerCase() === '#ffffff') {
            this.swatchStyle.boxShadow = 'inset 0 0 0 1px #ddd';
        }
    }
    handleClick({ hex, $event }) {
        this.onClick.emit({ hex, $event });
    }
}
CompactColorComponent.decorators = [
    { type: Component, args: [{
                selector: 'color-compact-color',
                template: `
  <div class="compact-color">
    <color-swatch class="swatch"
      [color]="color" [style]="swatchStyle"
      [focusStyle]="swatchFocus"
      (onClick)="handleClick($event)" (onHover)="onSwatchHover.emit($event)"
      >
      <div class="compact-dot"
        [class.active]="active" [style.background]="getContrastingColor(color)"
      ></div>
    </color-swatch>
  </div>
  `,
                changeDetection: ChangeDetectionStrategy.OnPush,
                preserveWhitespaces: false,
                styles: [`
  .compact-dot {
    position: absolute;
    top: 5px;
    right: 5px;
    bottom: 5px;
    left: 5px;
    border-radius: 50%;
    opacity: 0;
  }
  .compact-dot.active {
    opacity: 1;
  }
  `]
            },] }
];
CompactColorComponent.propDecorators = {
    color: [{ type: Input }],
    active: [{ type: Input }],
    onClick: [{ type: Output }],
    onSwatchHover: [{ type: Output }]
};

class CompactFieldsComponent {
    constructor() {
        this.onChange = new EventEmitter();
        this.HEXWrap = {
            marginTop: '-3px',
            marginBottom: '-3px',
            // flex: '6 1 0%',
            position: 'relative',
        };
        this.HEXinput = {
            width: '80%',
            padding: '0px',
            paddingLeft: '20%',
            border: 'none',
            outline: 'none',
            background: 'none',
            fontSize: '12px',
            color: '#333',
            height: '16px',
        };
        this.HEXlabel = {
            display: 'none',
        };
        this.RGBwrap = {
            marginTop: '-3px',
            marginBottom: '-3px',
            // flex: '3 1 0%',
            position: 'relative',
        };
        this.RGBinput = {
            width: '80%',
            padding: '0px',
            paddingLeft: '30%',
            border: 'none',
            outline: 'none',
            background: 'none',
            fontSize: '12px',
            color: '#333',
            height: '16px',
        };
        this.RGBlabel = {
            position: 'absolute',
            top: '6px',
            left: '0px',
            'line-height': '16px',
            'text-transform': 'uppercase',
            fontSize: '12px',
            color: '#999',
        };
    }
    handleChange({ data, $event }) {
        if (data.hex) {
            if (isValidHex(data.hex)) {
                this.onChange.emit({
                    data: {
                        hex: data.hex,
                        source: 'hex',
                    },
                    $event,
                });
            }
        }
        else {
            this.onChange.emit({
                data: {
                    r: data.r || this.rgb.r,
                    g: data.g || this.rgb.g,
                    b: data.b || this.rgb.b,
                    source: 'rgb',
                },
                $event,
            });
        }
    }
}
CompactFieldsComponent.decorators = [
    { type: Component, args: [{
                selector: 'color-compact-fields',
                template: `
  <div class="compact-fields">
    <div class="compact-active" [style.background]="hex"></div>
    <div style="flex: 6 1 0%;">
      <color-editable-input
        [style]="{ wrap: HEXWrap, input: HEXinput, label: HEXlabel }"
        label="hex"
        [value]="hex"
        (onChange)="handleChange($event)"
      ></color-editable-input>
    </div>
    <div style="flex: 3 1 0%">
      <color-editable-input
        [style]="{ wrap: RGBwrap, input: RGBinput, label: RGBlabel }"
        label="r"
        [value]="rgb.r"
        (onChange)="handleChange($event)"
      ></color-editable-input>
    </div>
    <div style="flex: 3 1 0%">
      <color-editable-input
        [style]="{ wrap: RGBwrap, input: RGBinput, label: RGBlabel }"
        label="g"
        [value]="rgb.g"
        (onChange)="handleChange($event)"
      ></color-editable-input>
    </div>
    <div style="flex: 3 1 0%">
      <color-editable-input
        [style]="{ wrap: RGBwrap, input: RGBinput, label: RGBlabel }"
        label="b"
        [value]="rgb.b"
        (onChange)="handleChange($event)"
      ></color-editable-input>
    </div>
  </div>
  `,
                changeDetection: ChangeDetectionStrategy.OnPush,
                preserveWhitespaces: false,
                styles: [`
  .compact-fields {
    display: flex;
    padding-bottom: 6px;
    padding-right: 5px;
    position: relative;
  }
  .compact-active {
    position: absolute;
    top: 6px;
    left: 5px;
    height: 9px;
    width: 9px;
  }
  `]
            },] }
];
CompactFieldsComponent.propDecorators = {
    hex: [{ type: Input }],
    rgb: [{ type: Input }],
    onChange: [{ type: Output }]
};

class CompactComponent extends ColorWrap {
    constructor() {
        super();
        /** Color squares to display */
        this.colors = [
            '#4D4D4D',
            '#999999',
            '#FFFFFF',
            '#F44E3B',
            '#FE9200',
            '#FCDC00',
            '#DBDF00',
            '#A4DD00',
            '#68CCCA',
            '#73D8FF',
            '#AEA1FF',
            '#FDA1FF',
            '#333333',
            '#808080',
            '#cccccc',
            '#D33115',
            '#E27300',
            '#FCC400',
            '#B0BC00',
            '#68BC00',
            '#16A5A5',
            '#009CE0',
            '#7B64FF',
            '#FA28FF',
            '#000000',
            '#666666',
            '#B3B3B3',
            '#9F0500',
            '#C45100',
            '#FB9E00',
            '#808900',
            '#194D33',
            '#0C797D',
            '#0062B1',
            '#653294',
            '#AB149E',
        ];
        this.zDepth = 1;
        this.radius = 1;
        this.background = '#fff';
        this.disableAlpha = true;
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
CompactComponent.decorators = [
    { type: Component, args: [{
                selector: 'color-compact',
                template: `
  <color-raised class="color-compact" [zDepth]="zDepth" [background]="background" [radius]="radius">
    <div class="compact-picker {{ className }}">
      <div>
        <color-compact-color
          *ngFor="let color of colors" [color]="color"
          [active]="color.toLowerCase() === hex.toLowerCase()"
          (onClick)="handleBlockChange($event)"
        ></color-compact-color>
        <div class="compact-clear"></div>
      </div>
      <color-compact-fields
        [hex]="hex"
        [rgb]="rgb"
        (onChange)="handleValueChange($event)"
      ></color-compact-fields>
    </div>
  </color-raised>
  `,
                changeDetection: ChangeDetectionStrategy.OnPush,
                preserveWhitespaces: false,
                styles: [`
    .color-compact {
      background: #f6f6f6;
      radius: 4px;
    }
    .compact-picker {
      padding-top: 5px;
      padding-left: 5px;
      box-sizing: border-box;
      width: 245px;
    }
    .compact-clear {
      clear: both;
    }
  `]
            },] }
];
CompactComponent.ctorParameters = () => [];
CompactComponent.propDecorators = {
    colors: [{ type: Input }],
    zDepth: [{ type: Input }],
    radius: [{ type: Input }],
    background: [{ type: Input }]
};
class ColorCompactModule {
}
ColorCompactModule.decorators = [
    { type: NgModule, args: [{
                declarations: [
                    CompactComponent,
                    CompactColorComponent,
                    CompactFieldsComponent,
                ],
                exports: [CompactComponent, CompactColorComponent, CompactFieldsComponent],
                imports: [CommonModule, EditableInputModule, SwatchModule, RaisedModule],
            },] }
];

/**
 * Generated bundle index. Do not edit.
 */

export { ColorCompactModule, CompactComponent, CompactColorComponent as ɵa, CompactFieldsComponent as ɵb };
//# sourceMappingURL=ngx-color-compact.js.map
