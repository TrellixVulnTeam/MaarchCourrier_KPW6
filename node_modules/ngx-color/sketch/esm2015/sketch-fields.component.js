import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, } from '@angular/core';
import { isValidHex } from 'ngx-color';
import { TinyColor } from '@ctrl/tinycolor';
export class SketchFieldsComponent {
    constructor() {
        this.disableAlpha = false;
        this.onChange = new EventEmitter();
        this.input = {
            width: '100%',
            padding: '4px 10% 3px',
            border: 'none',
            boxSizing: 'border-box',
            boxShadow: 'inset 0 0 0 1px #ccc',
            fontSize: '11px',
        };
        this.label = {
            display: 'block',
            textAlign: 'center',
            fontSize: '11px',
            color: '#222',
            paddingTop: '3px',
            paddingBottom: '4px',
            textTransform: 'capitalize',
        };
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
                        hex: this.disableAlpha || data.hex.length <= 6 ? color.toHex() : color.toHex8(),
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
            else if (data.a > 100) {
                data.a = 100;
            }
            data.a /= 100;
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
            this.onChange.emit({
                data: {
                    h: data.h || this.hsl.h,
                    s: Number((data.s && data.s) || this.hsl.s),
                    l: Number((data.l && data.l) || this.hsl.l),
                    source: 'hsl',
                },
                $event,
            });
        }
    }
}
SketchFieldsComponent.decorators = [
    { type: Component, args: [{
                selector: 'color-sketch-fields',
                template: `
  <div class="sketch-fields">
    <div class="sketch-double">
      <color-editable-input
        [style]="{ input: input, label: label }"
        label="hex"
        [value]="hex.replace('#', '')"
        (onChange)="handleChange($event)"
      ></color-editable-input>
    </div>
    <div class="sketch-single">
      <color-editable-input
        [style]="{ input: input, label: label }"
        label="r"
        [value]="rgb.r"
        (onChange)="handleChange($event)"
        [dragLabel]="true"
        [dragMax]="255"
      ></color-editable-input>
    </div>
    <div class="sketch-single">
      <color-editable-input
        [style]="{ input: input, label: label }"
        label="g"
        [value]="rgb.g"
        (onChange)="handleChange($event)"
        [dragLabel]="true"
        [dragMax]="255"
      ></color-editable-input>
    </div>
    <div class="sketch-single">
      <color-editable-input
        [style]="{ input: input, label: label }"
        label="b"
        [value]="rgb.b"
        (onChange)="handleChange($event)"
        [dragLabel]="true"
        [dragMax]="255"
      ></color-editable-input>
    </div>
    <div class="sketch-alpha" *ngIf="disableAlpha === false">
      <color-editable-input
        [style]="{ input: input, label: label }"
        label="a"
        [value]="round(rgb.a * 100)"
        (onChange)="handleChange($event)"
        [dragLabel]="true"
        [dragMax]="100"
      ></color-editable-input>
    </div>
  </div>
  `,
                changeDetection: ChangeDetectionStrategy.OnPush,
                preserveWhitespaces: false,
                styles: [`
    .sketch-fields {
      display: flex;
      padding-top: 4px;
    }
    .sketch-double {
      -webkit-box-flex: 2;
      flex: 2 1 0%;
    }
    .sketch-single {
      flex: 1 1 0%;
      padding-left: 6px;
    }
    .sketch-alpha {
      -webkit-box-flex: 1;
      flex: 1 1 0%;
      padding-left: 6px;
    }
    :host-context([dir=rtl]) .sketch-single {
      padding-right: 6px;
      padding-left: 0;
    }
    :host-context([dir=rtl]) .sketch-alpha {
      padding-right: 6px;
      padding-left: 0;
    }
  `]
            },] }
];
SketchFieldsComponent.propDecorators = {
    hsl: [{ type: Input }],
    rgb: [{ type: Input }],
    hex: [{ type: Input }],
    disableAlpha: [{ type: Input }],
    onChange: [{ type: Output }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2tldGNoLWZpZWxkcy5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiLi4vLi4vLi4vLi4vc3JjL2xpYi9jb21wb25lbnRzL3NrZXRjaC8iLCJzb3VyY2VzIjpbInNrZXRjaC1maWVsZHMuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFDTCx1QkFBdUIsRUFDdkIsU0FBUyxFQUNULFlBQVksRUFDWixLQUFLLEVBQ0wsTUFBTSxHQUNQLE1BQU0sZUFBZSxDQUFDO0FBRXZCLE9BQU8sRUFBRSxVQUFVLEVBQWMsTUFBTSxXQUFXLENBQUM7QUFDbkQsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBd0Y1QyxNQUFNLE9BQU8scUJBQXFCO0lBdEZsQztRQTBGVyxpQkFBWSxHQUFHLEtBQUssQ0FBQztRQUNwQixhQUFRLEdBQUcsSUFBSSxZQUFZLEVBQU8sQ0FBQztRQUM3QyxVQUFLLEdBQTRCO1lBQy9CLEtBQUssRUFBRSxNQUFNO1lBQ2IsT0FBTyxFQUFFLGFBQWE7WUFDdEIsTUFBTSxFQUFFLE1BQU07WUFDZCxTQUFTLEVBQUUsWUFBWTtZQUN2QixTQUFTLEVBQUUsc0JBQXNCO1lBQ2pDLFFBQVEsRUFBRSxNQUFNO1NBQ2pCLENBQUM7UUFDRixVQUFLLEdBQTRCO1lBQy9CLE9BQU8sRUFBRSxPQUFPO1lBQ2hCLFNBQVMsRUFBRSxRQUFRO1lBQ25CLFFBQVEsRUFBRSxNQUFNO1lBQ2hCLEtBQUssRUFBRSxNQUFNO1lBQ2IsVUFBVSxFQUFFLEtBQUs7WUFDakIsYUFBYSxFQUFFLEtBQUs7WUFDcEIsYUFBYSxFQUFFLFlBQVk7U0FDNUIsQ0FBQztJQTZESixDQUFDO0lBM0RDLEtBQUssQ0FBQyxLQUFLO1FBQ1QsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzNCLENBQUM7SUFDRCxZQUFZLENBQUMsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFO1FBQzNCLElBQUksSUFBSSxD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UCxDQUFDLENBQUM7U0FDSjtJQUNILENBQUM7OztZQXhLRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLHFCQUFxQjtnQkFDL0IsUUFBUSxFQUFFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FtRFQ7Z0JBOEJELGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNO2dCQUMvQyxtQkFBbUIsRUFBRSxLQUFLO3lCQTdCeEI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBMEJEO2FBSUY7OztrQkFFRSxLQUFLO2tCQUNMLEtBQUs7a0JBQ0wsS0FBSzsyQkFDTCxLQUFLO3VCQUNMLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ29tcG9uZW50LFxuICBFdmVudEVtaXR0ZXIsXG4gIElucHV0LFxuICBPdXRwdXQsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBpc1ZhbGlkSGV4LCBIU0xBLCBSR0JBIH0gZnJvbSAnbmd4LWNvbG9yJztcbmltcG9ydCB7IFRpbnlDb2xvciB9IGZyb20gJ0BjdHJsL3Rpbnljb2xvcic7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2NvbG9yLXNrZXRjaC1maWVsZHMnLFxuICB0ZW1wbGF0ZTogYFxuICA8ZGl2IGNsYXNzPVwic2tldGNoLWZpZWxkc1wiPlxuICAgIDxkaXYgY2xhc3M9XCJza2V0Y2gtZG91YmxlXCI+XG4gICAgICA8Y29sb3ItZWRpdGFibGUtaW5wdXRcbiAgICAgICAgW3N0eWxlXT1cInsgaW5wdXQ6IGlucHV0LCBsYWJlbDogbGFiZWwgfVwiXG4gICAgICAgIGxhYmVsPVwiaGV4XCJcbiAgICAgICAgW3ZhbHVlXT1cImhleC5yZXBsYWNlKCcjJywgJycpXCJcbiAgICAgICAgKG9uQ2hhbmdlKT1cImhhbmRsZUNoYW5nZSgkZXZlbnQpXCJcbiAgICAgID48L2NvbG9yLWVkaXRhYmxlLWlucHV0PlxuICAgIDwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJza2V0Y2gtc2luZ2xlXCI+XG4gICAgICA8Y29sb3ItZWRpdGFibGUtaW5wdXRcbiAgICAgICAgW3N0eWxlXT1cInsgaW5wdXQ6IGlucHV0LCBsYWJlbDogbGFiZWwgfVwiXG4gICAgICAgIGxhYmVsPVwiclwiXG4gICAgICAgIFt2YWx1ZV09XCJyZ2IuclwiXG4gICAgICAgIChvbkNoYW5nZSk9XCJoYW5kbGVDaGFuZ2UoJGV2ZW50KVwiXG4gICAgICAgIFtkcmFnTGFiZWxdPVwidHJ1ZVwiXG4gICAgICAgIFtkcmFnTWF4XT1cIjI1NVwiXG4gICAgICA+PC9jb2xvci1lZGl0YWJsZS1pbnB1dD5cbiAgICA8L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwic2tldGNoLXNpbmdsZVwiPlxuICAgICAgPGNvbG9yLWVkaXRhYmxlLWlucHV0XG4gICAgICAgIFtzdHlsZV09XCJ7IGlucHV0OiBpbnB1dCwgbGFiZWw6IGxhYmVsIH1cIlxuICAgICAgICBsYWJlbD1cImdcIlxuICAgICAgICBbdmFsdWVdPVwicmdiLmdcIlxuICAgICAgICAob25DaGFuZ2UpPVwiaGFuZGxlQ2hhbmdlKCRldmVudClcIlxuICAgICAgICBbZHJhZ0xhYmVsXT1cInRydWVcIlxuICAgICAgICBbZHJhZ01heF09XCIyNTVcIlxuICAgICAgPjwvY29sb3ItZWRpdGFibGUtaW5wdXQ+XG4gICAgPC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cInNrZXRjaC1zaW5nbGVcIj5cbiAgICAgIDxjb2xvci1lZGl0YWJsZS1pbnB1dFxuICAgICAgICBbc3R5bGVdPVwieyBpbnB1dDogaW5wdXQsIGxhYmVsOiBsYWJlbCB9XCJcbiAgICAgICAgbGFiZWw9XCJiXCJcbiAgICAgICAgW3ZhbHVlXT1cInJnYi5iXCJcbiAgICAgICAgKG9uQ2hhbmdlKT1cImhhbmRsZUNoYW5nZSgkZXZlbnQpXCJcbiAgICAgICAgW2RyYWdMYWJlbF09XCJ0cnVlXCJcbiAgICAgICAgW2RyYWdNYXhdPVwiMjU1XCJcbiAgICAgID48L2NvbG9yLWVkaXRhYmxlLWlucHV0PlxuICAgIDwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJza2V0Y2gtYWxwaGFcIiAqbmdJZj1cImRpc2FibGVBbHBoYSA9PT0gZmFsc2VcIj5cbiAgICAgIDxjb2xvci1lZGl0YWJsZS1pbnB1dFxuICAgICAgICBbc3R5bGVdPVwieyBpbnB1dDogaW5wdXQsIGxhYmVsOiBsYWJlbCB9XCJcbiAgICAgICAgbGFiZWw9XCJhXCJcbiAgICAgICAgW3ZhbHVlXT1cInJvdW5kKHJnYi5hICogMTAwKVwiXG4gICAgICAgIChvbkNoYW5nZSk9XCJoYW5kbGVDaGFuZ2UoJGV2ZW50KVwiXG4gICAgICAgIFtkcmFnTGFiZWxdPVwidHJ1ZVwiXG4gICAgICAgIFtkcmFnTWF4XT1cIjEwMFwiXG4gICAgICA+PC9jb2xvci1lZGl0YWJsZS1pbnB1dD5cbiAgICA8L2Rpdj5cbiAgPC9kaXY+XG4gIGAsXG4gIHN0eWxlczogW1xuICAgIGBcbiAgICAuc2tldGNoLWZpZWxkcyB7XG4gICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgcGFkZGluZy10b3A6IDRweDtcbiAgICB9XG4gICAgLnNrZXRjaC1kb3VibGUge1xuICAgICAgLXdlYmtpdC1ib3gtZmxleDogMjtcbiAgICAgIGZsZXg6IDIgMSAwJTtcbiAgICB9XG4gICAgLnNrZXRjaC1zaW5nbGUge1xuICAgICAgZmxleDogMSAxIDAlO1xuICAgICAgcGFkZGluZy1sZWZ0OiA2cHg7XG4gICAgfVxuICAgIC5za2V0Y2gtYWxwaGEge1xuICAgICAgLXdlYmtpdC1ib3gtZmxleDogMTtcbiAgICAgIGZsZXg6IDEgMSAwJTtcbiAgICAgIHBhZGRpbmctbGVmdDogNnB4O1xuICAgIH1cbiAgICA6aG9zdC1jb250ZXh0KFtkaXI9cnRsXSkgLnNrZXRjaC1zaW5nbGUge1xuICAgICAgcGFkZGluZy1yaWdodDogNnB4O1xuICAgICAgcGFkZGluZy1sZWZ0OiAwO1xuICAgIH1cbiAgICA6aG9zdC1jb250ZXh0KFtkaXI9cnRsXSkgLnNrZXRjaC1hbHBoYSB7XG4gICAgICBwYWRkaW5nLXJpZ2h0OiA2cHg7XG4gICAgICBwYWRkaW5nLWxlZnQ6IDA7XG4gICAgfVxuICBgLFxuICBdLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgcHJlc2VydmVXaGl0ZXNwYWNlczogZmFsc2UsXG59KVxuZXhwb3J0IGNsYXNzIFNrZXRjaEZpZWxkc0NvbXBvbmVudCB7XG4gIEBJbnB1dCgpIGhzbCE6IEhTTEE7XG4gIEBJbnB1dCgpIHJnYiE6IFJHQkE7XG4gIEBJbnB1dCgpIGhleCE6IHN0cmluZztcbiAgQElucHV0KCkgZGlzYWJsZUFscGhhID0gZmFsc2U7XG4gIEBPdXRwdXQoKSBvbkNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICBpbnB1dDoge1trZXk6IHN0cmluZ106IHN0cmluZ30gPSB7XG4gICAgd2lkdGg6ICcxMDAlJyxcbiAgICBwYWRkaW5nOiAnNHB4IDEwJSAzcHgnLFxuICAgIGJvcmRlcjogJ25vbmUnLFxuICAgIGJveFNpemluZzogJ2JvcmRlci1ib3gnLFxuICAgIGJveFNoYWRvdzogJ2luc2V0IDAgMCAwIDFweCAjY2NjJyxcbiAgICBmb250U2l6ZTogJzExcHgnLFxuICB9O1xuICBsYWJlbDoge1trZXk6IHN0cmluZ106IHN0cmluZ30gPSB7XG4gICAgZGlzcGxheTogJ2Jsb2NrJyxcbiAgICB0ZXh0QWxpZ246ICdjZW50ZXInLFxuICAgIGZvbnRTaXplOiAnMTFweCcsXG4gICAgY29sb3I6ICcjMjIyJyxcbiAgICBwYWRkaW5nVG9wOiAnM3B4JyxcbiAgICBwYWRkaW5nQm90dG9tOiAnNHB4JyxcbiAgICB0ZXh0VHJhbnNmb3JtOiAnY2FwaXRhbGl6ZScsXG4gIH07XG5cbiAgcm91bmQodmFsdWUpIHtcbiAgICByZXR1cm4gTWF0aC5yb3VuZCh2YWx1ZSk7XG4gIH1cbiAgaGFuZGxlQ2hhbmdlKHsgZGF0YSwgJGV2ZW50IH0pIHtcbiAgICBpZiAoZGF0YS5oZXgpIHtcbiAgICAgIGlmIChpc1ZhbGlkSGV4KGRhdGEuaGV4KSkge1xuICAgICAgICBjb25zdCBjb2xvciA9IG5ldyBUaW55Q29sb3IoZGF0YS5oZXgpO1xuICAgICAgICB0aGlzLm9uQ2hhbmdlLmVtaXQoe1xuICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIGhleDogdGhpcy5kaXNhYmxlQWxwaGEgfHwgZGF0YS5oZXgubGVuZ3RoIDw9IDYgPyBjb2xvci50b0hleCgpIDogY29sb3IudG9IZXg4KCksXG4gICAgICAgICAgICBzb3VyY2U6ICdoZXgnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgJGV2ZW50LFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGRhdGEuciB8fCBkYXRhLmcgfHwgZGF0YS5iKSB7XG4gICAgICB0aGlzLm9uQ2hhbmdlLmVtaXQoe1xuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgcjogZGF0YS5yIHx8IHRoaXMucmdiLnIsXG4gICAgICAgICAgZzogZGF0YS5nIHx8IHRoaXMucmdiLmcsXG4gICAgICAgICAgYjogZGF0YS5iIHx8IHRoaXMucmdiLmIsXG4gICAgICAgICAgc291cmNlOiAncmdiJyxcbiAgICAgICAgfSxcbiAgICAgICAgJGV2ZW50LFxuICAgICAgfSk7XG4gICAgfSBlbHNlIGlmIChkYXRhLmEpIHtcbiAgICAgIGlmIChkYXRhLmEgPCAwKSB7XG4gICAgICAgIGRhdGEuYSA9IDA7XG4gICAgICB9IGVsc2UgaWYgKGRhdGEuYSA+IDEwMCkge1xuICAgICAgICBkYXRhLmEgPSAxMDA7XG4gICAgICB9XG4gICAgICBkYXRhLmEgLz0gMTAwO1xuXG4gICAgICBpZiAodGhpcy5kaXNhYmxlQWxwaGEpIHtcbiAgICAgICAgZGF0YS5hID0gMTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5vbkNoYW5nZS5lbWl0KHtcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIGg6IHRoaXMuaHNsLmgsXG4gICAgICAgICAgczogdGhpcy5oc2wucyxcbiAgICAgICAgICBsOiB0aGlzLmhzbC5sLFxuICAgICAgICAgIGE6IE1hdGgucm91bmQoZGF0YS5hICogMTAwKSAvIDEwMCxcbiAgICAgICAgICBzb3VyY2U6ICdyZ2InLFxuICAgICAgICB9LFxuICAgICAgICAkZXZlbnQsXG4gICAgICB9KTtcbiAgICB9IGVsc2UgaWYgKGRhdGEuaCB8fCBkYXRhLnMgfHwgZGF0YS5sKSB7XG4gICAgICB0aGlzLm9uQ2hhbmdlLmVtaXQoe1xuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgaDogZGF0YS5oIHx8IHRoaXMuaHNsLmgsXG4gICAgICAgICAgczogTnVtYmVyKChkYXRhLnMgJiYgZGF0YS5zKSB8fCB0aGlzLmhzbC5zKSxcbiAgICAgICAgICBsOiBOdW1iZXIoKGRhdGEubCAmJiBkYXRhLmwpIHx8IHRoaXMuaHNsLmwpLFxuICAgICAgICAgIHNvdXJjZTogJ2hzbCcsXG4gICAgICAgIH0sXG4gICAgICAgICRldmVudCxcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufVxuIl19