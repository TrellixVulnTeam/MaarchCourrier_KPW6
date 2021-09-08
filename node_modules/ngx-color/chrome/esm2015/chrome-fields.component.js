import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, } from '@angular/core';
import { isValidHex } from 'ngx-color';
import { TinyColor } from '@ctrl/tinycolor';
export class ChromeFieldsComponent {
    constructor() {
        this.onChange = new EventEmitter();
        this.view = '';
        this.input = {
            fontSize: '11px',
            color: '#333',
            width: '100%',
            borderRadius: '2px',
            border: 'none',
            boxShadow: 'inset 0 0 0 1px #dadada',
            height: '21px',
            'text-align': 'center',
        };
        this.label = {
            'text-transform': 'uppercase',
            fontSize: '11px',
            'line-height': '11px',
            color: '#969696',
            'text-align': 'center',
            display: 'block',
            marginTop: '12px',
        };
    }
    ngOnInit() {
        if (this.hsl.a === 1 && this.view !== 'hex') {
            this.view = 'hex';
        }
        else if (this.view !== 'rgb' && this.view !== 'hsl') {
            this.view = 'rgb';
        }
    }
    toggleViews() {
        if (this.view === 'hex') {
            this.view = 'rgb';
        }
        else if (this.view === 'rgb') {
            this.view = 'hsl';
        }
        else if (this.view === 'hsl') {
            if (this.hsl.a === 1) {
                this.view = 'hex';
            }
            else {
                this.view = 'rgb';
            }
        }
    }
    round(value) {
        return Math.round(value);
    }
    handleChange({ data, $event }) {
        if (data.hex) {
            if (isValidHex(data.hex)) {
                const color = new TinyColor(data.hex);
                this.onChange.emit({
                    data: {
                        hex: this.disableAlpha ? color.toHex() : color.toHex8(),
                        source: 'hex',
                    },
                    $event,
                });
            }
        }
        else if (data.r || data.g || data.b) {
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
        else if (data.a) {
            if (data.a < 0) {
                data.a = 0;
            }
            else if (data.a > 1) {
                data.a = 1;
            }
            if (this.disableAlpha) {
                data.a = 1;
            }
            this.onChange.emit({
                data: {
                    h: this.hsl.h,
                    s: this.hsl.s,
                    l: this.hsl.l,
                    a: Math.round(data.a * 100) / 100,
                    source: 'rgb',
                },
                $event,
            });
        }
        else if (data.h || data.s || data.l) {
            const s = data.s && data.s.replace('%', '');
            const l = data.l && data.l.replace('%', '');
            this.onChange.emit({
                data: {
                    h: data.h || this.hsl.h,
                    s: Number(s || this.hsl.s),
                    l: Number(l || this.hsl.l),
                    source: 'hsl',
                },
                $event,
            });
        }
    }
}
ChromeFieldsComponent.decorators = [
    { type: Component, args: [{
                selector: 'color-chrome-fields',
                template: `
    <div class="chrome-wrap">
      <div class="chrome-fields">
        <ng-template [ngIf]="view === 'hex'">
          <div class="chrome-field">
            <color-editable-input
              [style]="{ input: input, label: label }"
              label="hex" [value]="hex"
              (onChange)="handleChange($event)"
            ></color-editable-input>
          </div>
        </ng-template>
        <ng-template [ngIf]="view === 'rgb'">
          <div class="chrome-field">
            <color-editable-input
              [style]="{ input: input, label: label }"
              label="r" [value]="rgb.r"
              (onChange)="handleChange($event)"
            ></color-editable-input>
          </div>
          <div class="chrome-field">
            <color-editable-input
              [style]="{ input: input, label: label }"
              label="g" [value]="rgb.g"
              (onChange)="handleChange($event)"
            ></color-editable-input>
          </div>
          <div class="chrome-field">
            <color-editable-input
              [style]="{ input: input, label: label }"
              label="b" [value]="rgb.b"
              (onChange)="handleChange($event)"
            ></color-editable-input>
          </div>
          <div class="chrome-field">
            <color-editable-input *ngIf="!disableAlpha"
              [style]="{ input: input, label: label }"
              label="a" [value]="rgb.a"
              [arrowOffset]="0.01"
              (onChange)="handleChange($event)"
            ></color-editable-input>
          </div>
        </ng-template>
        <ng-template [ngIf]="view === 'hsl'">
          <div class="chrome-field">
            <color-editable-input
              [style]="{ input: input, label: label }"
              label="h"
              [value]="round(hsl.h)"
              (onChange)="handleChange($event)"
            ></color-editable-input>
          </div>
          <div class="chrome-field">
            <color-editable-input
              [style]="{ input: input, label: label }"
              label="s" [value]="round(hsl.s * 100) + '%'"
              (onChange)="handleChange($event)"
            ></color-editable-input>
          </div>
          <div class="chrome-field">
            <color-editable-input
              [style]="{ input: input, label: label }"
              label="l" [value]="round(hsl.l * 100) + '%'"
              (onChange)="handleChange($event)"
            ></color-editable-input>
          </div>
          <div class="chrome-field">
            <color-editable-input *ngIf="!disableAlpha"
              [style]="{ input: input, label: label }"
              label="a" [value]="hsl.a"
              [arrowOffset]="0.01"
              (onChange)="handleChange($event)"
            ></color-editable-input>
          </div>
        </ng-template>
      </div>

      <div class="chrome-toggle">
        <div class="chrome-icon" (click)="toggleViews()" #icon>
          <svg class="chrome-toggle-svg" viewBox="0 0 24 24">
            <path #iconUp fill="#333"
              d="M12,5.83L15.17,9L16.58,7.59L12,3L7.41,7.59L8.83,9L12,5.83Z"
            />
            <path #iconDown fill="#333"
              d="M12,18.17L8.83,15L7.42,16.41L12,21L16.59,16.41L15.17,15Z"
            />
          </svg>
        </div>
      </div>
    </div>
  `,
                changeDetection: ChangeDetectionStrategy.OnPush,
                preserveWhitespaces: false,
                styles: [`
      .chrome-wrap {
        padding-top: 16px;
        display: flex;
      }
      .chrome-fields {
        flex: 1;
        display: flex;
        margin-left: -6px;
      }
      .chrome-field {
        padding-left: 6px;
        width: 100%;
      }
      .chrome-toggle {
        width: 32px;
        text-align: right;
        position: relative;
      }
      .chrome-icon {
        margin-right: -4px;
        margin-top: 12px;
        cursor: pointer;
        position: relative;
      }
      .chrome-toggle-svg {
        width: 24px;
        height: 24px;
        border: 1px transparent solid;
        border-radius: 5px;
      }
      .chrome-toggle-svg:hover {
        background: #eee;
      }
    `]
            },] }
];
ChromeFieldsComponent.propDecorators = {
    disableAlpha: [{ type: Input }],
    hsl: [{ type: Input }],
    rgb: [{ type: Input }],
    hex: [{ type: Input }],
    onChange: [{ type: Output }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hyb21lLWZpZWxkcy5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiLi4vLi4vLi4vLi4vc3JjL2xpYi9jb21wb25lbnRzL2Nocm9tZS8iLCJzb3VyY2VzIjpbImNocm9tZS1maWVsZHMuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFDTCx1QkFBdUIsRUFDdkIsU0FBUyxFQUNULFlBQVksRUFDWixLQUFLLEVBRUwsTUFBTSxHQUNQLE1BQU0sZUFBZSxDQUFDO0FBRXZCLE9BQU8sRUFBRSxVQUFVLEVBQWMsTUFBTSxXQUFXLENBQUM7QUFDbkQsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBdUk1QyxNQUFNLE9BQU8scUJBQXFCO0lBcklsQztRQTBJWSxhQUFRLEdBQUcsSUFBSSxZQUFZLEVBQU8sQ0FBQztRQUM3QyxTQUFJLEdBQUcsRUFBRSxDQUFDO1FBQ1YsVUFBSyxHQUEyQjtZQUM5QixRQUFRLEVBQUUsTUFBTTtZQUNoQixLQUFLLEVBQUUsTUFBTTtZQUNiLEtBQUssRUFBRSxNQUFNO1lBQ2IsWUFBWSxFQUFFLEtBQUs7WUFDbkIsTUFBTSxFQUFFLE1BQU07WUFDZCxTQUFTLEVBQUUseUJBQXlCO1lBQ3BDLE1BQU0sRUFBRSxNQUFNO1lBQ2QsWUFBWSxFQUFFLFFBQVE7U0FDdkIsQ0FBQztRQUNGLFVBQUssR0FBMkI7WUFDOUIsZ0JBQWdCLEVBQUUsV0FBVztZQUM3QixRQUFRLEVBQUUsTUFBTTtZQUNoQixhQUFhLEVBQUUsTUFBTTtZQUNyQixLQUFLLEVBQUUsU0FBUztZQUNoQixZQUFZLEVBQUUsUUFBUTtZQUN0QixPQUFPLEVBQUUsT0FBTztZQUNoQixTQUFTLEVBQUUsTUFBTTtTQUNsQixDQUFDO0lBa0ZKLENBQUM7SUFoRkMsUUFBUTtRQUNOLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssS0FBSyxFQUFFO1lB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dUJBQXVCLENBQUMsTUFBTTtnQkFDL0MsbUJBQW1CLEVBQUUsS0FBSzt5QkFyQ3hCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0tBa0NDO2FBSUo7OzsyQkFFRSxLQUFLO2tCQUNMLEtBQUs7a0JBQ0wsS0FBSztrQkFDTCxLQUFLO3VCQUNMLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ29tcG9uZW50LFxuICBFdmVudEVtaXR0ZXIsXG4gIElucHV0LFxuICBPbkluaXQsXG4gIE91dHB1dCxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IGlzVmFsaWRIZXgsIEhTTEEsIFJHQkEgfSBmcm9tICduZ3gtY29sb3InO1xuaW1wb3J0IHsgVGlueUNvbG9yIH0gZnJvbSAnQGN0cmwvdGlueWNvbG9yJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnY29sb3ItY2hyb21lLWZpZWxkcycsXG4gIHRlbXBsYXRlOiBgXG4gICAgPGRpdiBjbGFzcz1cImNocm9tZS13cmFwXCI+XG4gICAgICA8ZGl2IGNsYXNzPVwiY2hyb21lLWZpZWxkc1wiPlxuICAgICAgICA8bmctdGVtcGxhdGUgW25nSWZdPVwidmlldyA9PT0gJ2hleCdcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwiY2hyb21lLWZpZWxkXCI+XG4gICAgICAgICAgICA8Y29sb3ItZWRpdGFibGUtaW5wdXRcbiAgICAgICAgICAgICAgW3N0eWxlXT1cInsgaW5wdXQ6IGlucHV0LCBsYWJlbDogbGFiZWwgfVwiXG4gICAgICAgICAgICAgIGxhYmVsPVwiaGV4XCIgW3ZhbHVlXT1cImhleFwiXG4gICAgICAgICAgICAgIChvbkNoYW5nZSk9XCJoYW5kbGVDaGFuZ2UoJGV2ZW50KVwiXG4gICAgICAgICAgICA+PC9jb2xvci1lZGl0YWJsZS1pbnB1dD5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9uZy10ZW1wbGF0ZT5cbiAgICAgICAgPG5nLXRlbXBsYXRlIFtuZ0lmXT1cInZpZXcgPT09ICdyZ2InXCI+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cImNocm9tZS1maWVsZFwiPlxuICAgICAgICAgICAgPGNvbG9yLWVkaXRhYmxlLWlucHV0XG4gICAgICAgICAgICAgIFtzdHlsZV09XCJ7IGlucHV0OiBpbnB1dCwgbGFiZWw6IGxhYmVsIH1cIlxuICAgICAgICAgICAgICBsYWJlbD1cInJcIiBbdmFsdWVdPVwicmdiLnJcIlxuICAgICAgICAgICAgICAob25DaGFuZ2UpPVwiaGFuZGxlQ2hhbmdlKCRldmVudClcIlxuICAgICAgICAgICAgPjwvY29sb3ItZWRpdGFibGUtaW5wdXQ+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cImNocm9tZS1maWVsZFwiPlxuICAgICAgICAgICAgPGNvbG9yLWVkaXRhYmxlLWlucHV0XG4gICAgICAgICAgICAgIFtzdHlsZV09XCJ7IGlucHV0OiBpbnB1dCwgbGFiZWw6IGxhYmVsIH1cIlxuICAgICAgICAgICAgICBsYWJlbD1cImdcIiBbdmFsdWVdPVwicmdiLmdcIlxuICAgICAgICAgICAgICAob25DaGFuZ2UpPVwiaGFuZGxlQ2hhbmdlKCRldmVudClcIlxuICAgICAgICAgICAgPjwvY29sb3ItZWRpdGFibGUtaW5wdXQ+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cImNocm9tZS1maWVsZFwiPlxuICAgICAgICAgICAgPGNvbG9yLWVkaXRhYmxlLWlucHV0XG4gICAgICAgICAgICAgIFtzdHlsZV09XCJ7IGlucHV0OiBpbnB1dCwgbGFiZWw6IGxhYmVsIH1cIlxuICAgICAgICAgICAgICBsYWJlbD1cImJcIiBbdmFsdWVdPVwicmdiLmJcIlxuICAgICAgICAgICAgICAob25DaGFuZ2UpPVwiaGFuZGxlQ2hhbmdlKCRldmVudClcIlxuICAgICAgICAgICAgPjwvY29sb3ItZWRpdGFibGUtaW5wdXQ+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cImNocm9tZS1maWVsZFwiPlxuICAgICAgICAgICAgPGNvbG9yLWVkaXRhYmxlLWlucHV0ICpuZ0lmPVwiIWRpc2FibGVBbHBoYVwiXG4gICAgICAgICAgICAgIFtzdHlsZV09XCJ7IGlucHV0OiBpbnB1dCwgbGFiZWw6IGxhYmVsIH1cIlxuICAgICAgICAgICAgICBsYWJlbD1cImFcIiBbdmFsdWVdPVwicmdiLmFcIlxuICAgICAgICAgICAgICBbYXJyb3dPZmZzZXRdPVwiMC4wMVwiXG4gICAgICAgICAgICAgIChvbkNoYW5nZSk9XCJoYW5kbGVDaGFuZ2UoJGV2ZW50KVwiXG4gICAgICAgICAgICA+PC9jb2xvci1lZGl0YWJsZS1pbnB1dD5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9uZy10ZW1wbGF0ZT5cbiAgICAgICAgPG5nLXRlbXBsYXRlIFtuZ0lmXT1cInZpZXcgPT09ICdoc2wnXCI+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cImNocm9tZS1maWVsZFwiPlxuICAgICAgICAgICAgPGNvbG9yLWVkaXRhYmxlLWlucHV0XG4gICAgICAgICAgICAgIFtzdHlsZV09XCJ7IGlucHV0OiBpbnB1dCwgbGFiZWw6IGxhYmVsIH1cIlxuICAgICAgICAgICAgICBsYWJlbD1cImhcIlxuICAgICAgICAgICAgICBbdmFsdWVdPVwicm91bmQoaHNsLmgpXCJcbiAgICAgICAgICAgICAgKG9uQ2hhbmdlKT1cImhhbmRsZUNoYW5nZSgkZXZlbnQpXCJcbiAgICAgICAgICAgID48L2NvbG9yLWVkaXRhYmxlLWlucHV0PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJjaHJvbWUtZmllbGRcIj5cbiAgICAgICAgICAgIDxjb2xvci1lZGl0YWJsZS1pbnB1dFxuICAgICAgICAgICAgICBbc3R5bGVdPVwieyBpbnB1dDogaW5wdXQsIGxhYmVsOiBsYWJlbCB9XCJcbiAgICAgICAgICAgICAgbGFiZWw9XCJzXCIgW3ZhbHVlXT1cInJvdW5kKGhzbC5zICogMTAwKSArICclJ1wiXG4gICAgICAgICAgICAgIChvbkNoYW5nZSk9XCJoYW5kbGVDaGFuZ2UoJGV2ZW50KVwiXG4gICAgICAgICAgICA+PC9jb2xvci1lZGl0YWJsZS1pbnB1dD5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwiY2hyb21lLWZpZWxkXCI+XG4gICAgICAgICAgICA8Y29sb3ItZWRpdGFibGUtaW5wdXRcbiAgICAgICAgICAgICAgW3N0eWxlXT1cInsgaW5wdXQ6IGlucHV0LCBsYWJlbDogbGFiZWwgfVwiXG4gICAgICAgICAgICAgIGxhYmVsPVwibFwiIFt2YWx1ZV09XCJyb3VuZChoc2wubCAqIDEwMCkgKyAnJSdcIlxuICAgICAgICAgICAgICAob25DaGFuZ2UpPVwiaGFuZGxlQ2hhbmdlKCRldmVudClcIlxuICAgICAgICAgICAgPjwvY29sb3ItZWRpdGFibGUtaW5wdXQ+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cImNocm9tZS1maWVsZFwiPlxuICAgICAgICAgICAgPGNvbG9yLWVkaXRhYmxlLWlucHV0ICpuZ0lmPVwiIWRpc2FibGVBbHBoYVwiXG4gICAgICAgICAgICAgIFtzdHlsZV09XCJ7IGlucHV0OiBpbnB1dCwgbGFiZWw6IGxhYmVsIH1cIlxuICAgICAgICAgICAgICBsYWJlbD1cImFcIiBbdmFsdWVdPVwiaHNsLmFcIlxuICAgICAgICAgICAgICBbYXJyb3dPZmZzZXRdPVwiMC4wMVwiXG4gICAgICAgICAgICAgIChvbkNoYW5nZSk9XCJoYW5kbGVDaGFuZ2UoJGV2ZW50KVwiXG4gICAgICAgICAgICA+PC9jb2xvci1lZGl0YWJsZS1pbnB1dD5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9uZy10ZW1wbGF0ZT5cbiAgICAgIDwvZGl2PlxuXG4gICAgICA8ZGl2IGNsYXNzPVwiY2hyb21lLXRvZ2dsZVwiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwiY2hyb21lLWljb25cIiAoY2xpY2spPVwidG9nZ2xlVmlld3MoKVwiICNpY29uPlxuICAgICAgICAgIDxzdmcgY2xhc3M9XCJjaHJvbWUtdG9nZ2xlLXN2Z1wiIHZpZXdCb3g9XCIwIDAgMjQgMjRcIj5cbiAgICAgICAgICAgIDxwYXRoICNpY29uVXAgZmlsbD1cIiMzMzNcIlxuICAgICAgICAgICAgICBkPVwiTTEyLDUuODNMMTUuMTcsOUwxNi41OCw3LjU5TDEyLDNMNy40MSw3LjU5TDguODMsOUwxMiw1LjgzWlwiXG4gICAgICAgICAgICAvPlxuICAgICAgICAgICAgPHBhdGggI2ljb25Eb3duIGZpbGw9XCIjMzMzXCJcbiAgICAgICAgICAgICAgZD1cIk0xMiwxOC4xN0w4LjgzLDE1TDcuNDIsMTYuNDFMMTIsMjFMMTYuNTksMTYuNDFMMTUuMTcsMTVaXCJcbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9zdmc+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gIGAsXG4gIHN0eWxlczogW1xuICAgIGBcbiAgICAgIC5jaHJvbWUtd3JhcCB7XG4gICAgICAgIHBhZGRpbmctdG9wOiAxNnB4O1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgfVxuICAgICAgLmNocm9tZS1maWVsZHMge1xuICAgICAgICBmbGV4OiAxO1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBtYXJnaW4tbGVmdDogLTZweDtcbiAgICAgIH1cbiAgICAgIC5jaHJvbWUtZmllbGQge1xuICAgICAgICBwYWRkaW5nLWxlZnQ6IDZweDtcbiAgICAgICAgd2lkdGg6IDEwMCU7XG4gICAgICB9XG4gICAgICAuY2hyb21lLXRvZ2dsZSB7XG4gICAgICAgIHdpZHRoOiAzMnB4O1xuICAgICAgICB0ZXh0LWFsaWduOiByaWdodDtcbiAgICAgICAgcG9zaXRpb246IHJlbGF0aXZlO1xuICAgICAgfVxuICAgICAgLmNocm9tZS1pY29uIHtcbiAgICAgICAgbWFyZ2luLXJpZ2h0OiAtNHB4O1xuICAgICAgICBtYXJnaW4tdG9wOiAxMnB4O1xuICAgICAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgICAgIH1cbiAgICAgIC5jaHJvbWUtdG9nZ2xlLXN2ZyB7XG4gICAgICAgIHdpZHRoOiAyNHB4O1xuICAgICAgICBoZWlnaHQ6IDI0cHg7XG4gICAgICAgIGJvcmRlcjogMXB4IHRyYW5zcGFyZW50IHNvbGlkO1xuICAgICAgICBib3JkZXItcmFkaXVzOiA1cHg7XG4gICAgICB9XG4gICAgICAuY2hyb21lLXRvZ2dsZS1zdmc6aG92ZXIge1xuICAgICAgICBiYWNrZ3JvdW5kOiAjZWVlO1xuICAgICAgfVxuICAgIGAsXG4gIF0sXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBwcmVzZXJ2ZVdoaXRlc3BhY2VzOiBmYWxzZSxcbn0pXG5leHBvcnQgY2xhc3MgQ2hyb21lRmllbGRzQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcbiAgQElucHV0KCkgZGlzYWJsZUFscGhhITogYm9vbGVhbjtcbiAgQElucHV0KCkgaHNsITogSFNMQTtcbiAgQElucHV0KCkgcmdiITogUkdCQTtcbiAgQElucHV0KCkgaGV4ITogc3RyaW5nO1xuICBAT3V0cHV0KCkgb25DaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcbiAgdmlldyA9ICcnO1xuICBpbnB1dDogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHtcbiAgICBmb250U2l6ZTogJzExcHgnLFxuICAgIGNvbG9yOiAnIzMzMycsXG4gICAgd2lkdGg6ICcxMDAlJyxcbiAgICBib3JkZXJSYWRpdXM6ICcycHgnLFxuICAgIGJvcmRlcjogJ25vbmUnLFxuICAgIGJveFNoYWRvdzogJ2luc2V0IDAgMCAwIDFweCAjZGFkYWRhJyxcbiAgICBoZWlnaHQ6ICcyMXB4JyxcbiAgICAndGV4dC1hbGlnbic6ICdjZW50ZXInLFxuICB9O1xuICBsYWJlbDogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHtcbiAgICAndGV4dC10cmFuc2Zvcm0nOiAndXBwZXJjYXNlJyxcbiAgICBmb250U2l6ZTogJzExcHgnLFxuICAgICdsaW5lLWhlaWdodCc6ICcxMXB4JyxcbiAgICBjb2xvcjogJyM5Njk2OTYnLFxuICAgICd0ZXh0LWFsaWduJzogJ2NlbnRlcicsXG4gICAgZGlzcGxheTogJ2Jsb2NrJyxcbiAgICBtYXJnaW5Ub3A6ICcxMnB4JyxcbiAgfTtcblxuICBuZ09uSW5pdCgpIHtcbiAgICBpZiAodGhpcy5oc2wuYSA9PT0gMSAmJiB0aGlzLnZpZXcgIT09ICdoZXgnKSB7XG4gICAgICB0aGlzLnZpZXcgPSAnaGV4JztcbiAgICB9IGVsc2UgaWYgKHRoaXMudmlldyAhPT0gJ3JnYicgJiYgdGhpcy52aWV3ICE9PSAnaHNsJykge1xuICAgICAgdGhpcy52aWV3ID0gJ3JnYic7XG4gICAgfVxuICB9XG4gIHRvZ2dsZVZpZXdzKCkge1xuICAgIGlmICh0aGlzLnZpZXcgPT09ICdoZXgnKSB7XG4gICAgICB0aGlzLnZpZXcgPSAncmdiJztcbiAgICB9IGVsc2UgaWYgKHRoaXMudmlldyA9PT0gJ3JnYicpIHtcbiAgICAgIHRoaXMudmlldyA9ICdoc2wnO1xuICAgIH0gZWxzZSBpZiAodGhpcy52aWV3ID09PSAnaHNsJykge1xuICAgICAgaWYgKHRoaXMuaHNsLmEgPT09IDEpIHtcbiAgICAgICAgdGhpcy52aWV3ID0gJ2hleCc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnZpZXcgPSAncmdiJztcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcm91bmQodmFsdWUpIHtcbiAgICByZXR1cm4gTWF0aC5yb3VuZCh2YWx1ZSk7XG4gIH1cbiAgaGFuZGxlQ2hhbmdlKHsgZGF0YSwgJGV2ZW50IH0pIHtcbiAgICBpZiAoZGF0YS5oZXgpIHtcbiAgICAgIGlmIChpc1ZhbGlkSGV4KGRhdGEuaGV4KSkge1xuICAgICAgICBjb25zdCBjb2xvciA9IG5ldyBUaW55Q29sb3IoZGF0YS5oZXgpO1xuICAgICAgICB0aGlzLm9uQ2hhbmdlLmVtaXQoe1xuICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIGhleDogdGhpcy5kaXNhYmxlQWxwaGEgPyBjb2xvci50b0hleCgpIDogY29sb3IudG9IZXg4KCksXG4gICAgICAgICAgICBzb3VyY2U6ICdoZXgnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgJGV2ZW50LFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGRhdGEuciB8fCBkYXRhLmcgfHwgZGF0YS5iKSB7XG4gICAgICB0aGlzLm9uQ2hhbmdlLmVtaXQoe1xuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgcjogZGF0YS5yIHx8IHRoaXMucmdiLnIsXG4gICAgICAgICAgZzogZGF0YS5nIHx8IHRoaXMucmdiLmcsXG4gICAgICAgICAgYjogZGF0YS5iIHx8IHRoaXMucmdiLmIsXG4gICAgICAgICAgc291cmNlOiAncmdiJyxcbiAgICAgICAgfSxcbiAgICAgICAgJGV2ZW50LFxuICAgICAgfSk7XG4gICAgfSBlbHNlIGlmIChkYXRhLmEpIHtcbiAgICAgIGlmIChkYXRhLmEgPCAwKSB7XG4gICAgICAgIGRhdGEuYSA9IDA7XG4gICAgICB9IGVsc2UgaWYgKGRhdGEuYSA+IDEpIHtcbiAgICAgICAgZGF0YS5hID0gMTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuZGlzYWJsZUFscGhhKSB7XG4gICAgICAgIGRhdGEuYSA9IDE7XG4gICAgICB9XG5cbiAgICAgIHRoaXMub25DaGFuZ2UuZW1pdCh7XG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBoOiB0aGlzLmhzbC5oLFxuICAgICAgICAgIHM6IHRoaXMuaHNsLnMsXG4gICAgICAgICAgbDogdGhpcy5oc2wubCxcbiAgICAgICAgICBhOiBNYXRoLnJvdW5kKGRhdGEuYSAqIDEwMCkgLyAxMDAsXG4gICAgICAgICAgc291cmNlOiAncmdiJyxcbiAgICAgICAgfSxcbiAgICAgICAgJGV2ZW50LFxuICAgICAgfSk7XG4gICAgfSBlbHNlIGlmIChkYXRhLmggfHwgZGF0YS5zIHx8IGRhdGEubCkge1xuICAgICAgY29uc3QgcyA9IGRhdGEucyAmJiBkYXRhLnMucmVwbGFjZSgnJScsICcnKTtcbiAgICAgIGNvbnN0IGwgPSBkYXRhLmwgJiYgZGF0YS5sLnJlcGxhY2UoJyUnLCAnJyk7XG4gICAgICB0aGlzLm9uQ2hhbmdlLmVtaXQoe1xuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgaDogZGF0YS5oIHx8IHRoaXMuaHNsLmgsXG4gICAgICAgICAgczogTnVtYmVyKHMgfHwgdGhpcy5oc2wucyksXG4gICAgICAgICAgbDogTnVtYmVyKGwgfHwgdGhpcy5oc2wubCksXG4gICAgICAgICAgc291cmNlOiAnaHNsJyxcbiAgICAgICAgfSxcbiAgICAgICAgJGV2ZW50LFxuICAgICAgfSk7XG4gICAgfVxuICB9XG59XG4iXX0=