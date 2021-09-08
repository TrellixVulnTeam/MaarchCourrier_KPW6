import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule, Input } from '@angular/core';
import { ColorWrap, EditableInputModule, RaisedModule, isValidHex } from 'ngx-color';
export class MaterialComponent extends ColorWrap {
    constructor() {
        super();
        this.HEXinput = {
            width: '100%',
            marginTop: '12px',
            fontSize: '15px',
            color: 'rgb(51, 51, 51)',
            padding: '0px',
            'border-width': '0px 0px 2px',
            outline: 'none',
            height: '30px',
        };
        this.HEXlabel = {
            position: 'absolute',
            top: '0px',
            left: '0px',
            fontSize: '11px',
            color: 'rgb(153, 153, 153)',
            'text-transform': 'capitalize',
        };
        this.RGBinput = {
            width: '100%',
            marginTop: '12px',
            fontSize: '15px',
            color: '#333',
            padding: '0px',
            border: '0px',
            'border-bottom': '1px solid #eee',
            outline: 'none',
            height: '30px',
        };
        this.RGBlabel = {
            position: 'absolute',
            top: '0px',
            left: '0px',
            fontSize: '11px',
            color: '#999999',
            'text-transform': 'capitalize',
        };
        this.zDepth = 1;
        this.radius = 1;
        this.background = '#fff';
        this.disableAlpha = true;
    }
    handleValueChange({ data, $event }) {
        this.handleChange(data, $event);
    }
    handleInputChange({ data, $event }) {
        if (data.hex) {
            if (isValidHex(data.hex)) {
                this.handleValueChange({
                    data: {
                        hex: data.hex,
                        source: 'hex',
                    },
                    $event,
                });
            }
        }
        else if (data.r || data.g || data.b) {
            this.handleValueChange({
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
    afterValidChange() {
        this.HEXinput['border-bottom-color'] = this.hex;
    }
}
MaterialComponent.decorators = [
    { type: Component, args: [{
                selector: 'color-material',
                template: `
  <color-raised [zDepth]="zDepth" [background]="background" [radius]="radius">
    <div class="material-picker {{ className }}">
      <color-editable-input label="hex" [value]="hex"
        (onChange)="handleValueChange($event)"
        [style]="{input: HEXinput, label: HEXlabel}"
      ></color-editable-input>
      <div class="material-split">
        <div class="material-third">
          <color-editable-input label="r" [value]="rgb.r"
            [style]="{ input: RGBinput, label: RGBlabel }"
            (onChange)="handleInputChange($event)"
          ></color-editable-input>
        </div>
        <div class="material-third">
          <color-editable-input label="g" [value]="rgb.g"
            [style]="{ input: RGBinput, label: RGBlabel }"
            (onChange)="handleInputChange($event)"
          ></color-editable-input>
        </div>
        <div class="material-third">
          <color-editable-input label="b" [value]="rgb.b"
            [style]="{ input: RGBinput, label: RGBlabel }"
            (onChange)="handleInputChange($event)"
          ></color-editable-input>
        </div>
      </div>
    </div>
  </color-raised>
  `,
                changeDetection: ChangeDetectionStrategy.OnPush,
                preserveWhitespaces: false,
                styles: [`
  .material-picker {
    width: 130px;
    height: 130px;
    padding: 16px;
    font-family: Roboto;
  }
  .material-split {
    display: flex;
    margin-right: -10px;
    padding-top: 11px;
  }
  .material-third {
    flex: 1 1 0%;
    padding-right: 10px;
  }
  `]
            },] }
];
MaterialComponent.ctorParameters = () => [];
MaterialComponent.propDecorators = {
    zDepth: [{ type: Input }],
    radius: [{ type: Input }],
    background: [{ type: Input }]
};
export class ColorMaterialModule {
}
ColorMaterialModule.decorators = [
    { type: NgModule, args: [{
                exports: [MaterialComponent],
                declarations: [MaterialComponent],
                imports: [CommonModule, EditableInputModule, RaisedModule],
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWF0ZXJpYWwuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Ii4uLy4uLy4uLy4uL3NyYy9saWIvY29tcG9uZW50cy9tYXRlcmlhbC8iLCJzb3VyY2VzIjpbIm1hdGVyaWFsLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDL0MsT0FBTyxFQUFFLHVCQUF1QixFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRXBGLE9BQU8sRUFBRSxTQUFTLEVBQUUsbUJBQW1CLEVBQUUsWUFBWSxFQUFFLFVBQVUsRUFBVSxNQUFNLFdBQVcsQ0FBQztBQXdEN0YsTUFBTSxPQUFPLGlCQUFrQixTQUFRLFNBQVM7SUEyQzlDO1FBQ0UsS0FBSyxFQUFFLENBQUM7UUEzQ1YsYUFBUSxHQUE0QjtZQUNsQyxLQUFLLEVBQUUsTUFBTTtZQUNiLFNBQVMsRUFBRSxNQUFNO1lBQ2pCLFFBQVEsRUFBRSxNQUFNO1lBQ2hCLEtBQUssRUFBRSxpQkFBaUI7WUFDeEIsT0FBTyxFQUFFLEtBQUs7WUFDZCxjQUFjLEVBQUUsYUFBYTtZQUM3QixPQUFPLEVBQUUsTUFBTTtZQUNmLE1BQU0sRUFBRSxNQUFNO1NBQ2YsQ0FBQztRQUNGLGFBQVEsR0FBNEI7WUFDbEMsUUFBUSxFQUFFLFVBQVU7WUFDcEIsR0FBRyxFQUFFLEtBQUs7WUFDVixJQUFJLEVBQUUsS0FBSztZQUNYLFFBQVEsRUFBRSxNQUFNO1lBQ2hCLEtBQUssRUFBRSxvQkFBb0I7WUFDM0IsZ0JBQWdCLEVBQUUsWUFBWTtTQUMvQixDQUFDO1FBQ0YsYUFBUSxHQUE0QjtZQUNsQyxLQUFLLEVBQUUsTUFBTTtZQUNiLFNBQVMsRUFBRSxNQUFNO1lBQ2pCLFFBQVEsRUFBRSxNQUFNO1lBQ2hCLEtBQUssRUFBRSxNQUFNO1lBQ2IsT0FBTyxFQUFFLEtBQUs7WUFDZCxNQUFNLEVBQUUsS0FBSztZQUNiLGVBQWUsRUFBRSxnQkFBZ0I7WUFDakMsT0FBTyxFQUFFLE1BQU07WUFDZixNQUFNLEVBQUUsTUFBTTtTQUNmLENBQUM7UUFDRixhQUFRLEdBQTRCO1lBQ2xDLFFBQVEsRUFBRSxVQUFVO1lBQ3BCLEdBQUcsRUFBRSxLQUFLO1lBQ1YsSUFBSSxFQUFFLEtBQUs7WUFDWCxRQUFRLEVBQUUsTUFBTTtZQUNoQixLQUFLLEVBQUUsU0FBUztZQUNoQixnQkFBZ0IsRUFBRSxZQUFZO1NBQy9CLENBQUM7UUFDTyxXQUFNLEdBQVcsQ0FBQyxDQUFDO1FBQ25CLFdBQU0sR0FBRyxDQUFDLENBQUM7UUFDWCxlQUFVLEdBQUcsTUFBTSxDQUFDO1FBQzdCLGlCQUFZLEdBQUcsSUFBSSxDQUFDO0lBSXBCLENBQUM7SUFFRCxpQkFBaUIsQ0FBQyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUU7UUFDaEMsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDbEMsQ0FBQztJQUVELGlCQUFpQixDQUFDLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRTtRQUNoQyxJQUFJLElBQUksQ0FBQyxHQUFHLEVBQUU7WUFDWixJQUFJLFVBQVUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUU7Z0JBQ3hCLElBQUksQ0FBQyxpQkFBaUIsQ0FBQztvQkFDckIsSUFBSSxFQUFFO3dCQUNKLEdBQUcsRUFBRSxJQUFJLENBQUMsR0FBRzt3QkFDYixNQUFNLEVBQUUsS0FBSztxQkFDZDtvQkFDRCxNQUFNO2lCQUNQLENBQUMsQ0FBQzthQUNKO1NBQ0Y7YUFBTSxJQUFJLElBQUksQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxFQUFFO1lBQ3JDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQztnQkFDckIsSUFBSSxFQUFFO29CQUNKLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFDdkIsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQUN2QixDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBQ3ZCLE1BQU0sRUFBRSxLQUFLO2lCQUNkO2dCQUNELE1BQU07YUFDUCxDQUFDLENBQUM7U0FDSjtJQUNILENBQUM7SUFFRCxnQkFBZ0I7UUFDZCxJQUFJLENBQUMsUUFBUSxDQUFDLHFCQUFxQixDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQztJQUNsRCxDQUFDOzs7WUFuSUYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxnQkFBZ0I7Z0JBQzFCLFFBQVEsRUFBRTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0E2QlQ7Z0JBb0JELGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNO2dCQUMvQyxtQkFBbUIsRUFBRSxLQUFLO3lCQW5CeEI7Ozs7Ozs7Ozs7Ozs7Ozs7R0FnQkQ7YUFJRjs7OztxQkF1Q0UsS0FBSztxQkFDTCxLQUFLO3lCQUNMLEtBQUs7O0FBNkNSLE1BQU0sT0FBTyxtQkFBbUI7OztZQUwvQixRQUFRLFNBQUM7Z0JBQ1IsT0FBTyxFQUFFLENBQUMsaUJBQWlCLENBQUM7Z0JBQzVCLFlBQVksRUFBRSxDQUFDLGlCQUFpQixDQUFDO2dCQUNqQyxPQUFPLEVBQUUsQ0FBQyxZQUFZLEVBQUUsbUJBQW1CLEVBQUUsWUFBWSxDQUFDO2FBQzNEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IENoYW5nZURldGVjdGlvblN0cmF0ZWd5LCBDb21wb25lbnQsIE5nTW9kdWxlLCBJbnB1dCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBDb2xvcldyYXAsIEVkaXRhYmxlSW5wdXRNb2R1bGUsIFJhaXNlZE1vZHVsZSwgaXNWYWxpZEhleCwgekRlcHRoIH0gZnJvbSAnbmd4LWNvbG9yJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnY29sb3ItbWF0ZXJpYWwnLFxuICB0ZW1wbGF0ZTogYFxuICA8Y29sb3ItcmFpc2VkIFt6RGVwdGhdPVwiekRlcHRoXCIgW2JhY2tncm91bmRdPVwiYmFja2dyb3VuZFwiIFtyYWRpdXNdPVwicmFkaXVzXCI+XG4gICAgPGRpdiBjbGFzcz1cIm1hdGVyaWFsLXBpY2tlciB7eyBjbGFzc05hbWUgfX1cIj5cbiAgICAgIDxjb2xvci1lZGl0YWJsZS1pbnB1dCBsYWJlbD1cImhleFwiIFt2YWx1ZV09XCJoZXhcIlxuICAgICAgICAob25DaGFuZ2UpPVwiaGFuZGxlVmFsdWVDaGFuZ2UoJGV2ZW50KVwiXG4gICAgICAgIFtzdHlsZV09XCJ7aW5wdXQ6IEhFWGlucHV0LCBsYWJlbDogSEVYbGFiZWx9XCJcbiAgICAgID48L2NvbG9yLWVkaXRhYmxlLWlucHV0PlxuICAgICAgPGRpdiBjbGFzcz1cIm1hdGVyaWFsLXNwbGl0XCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJtYXRlcmlhbC10aGlyZFwiPlxuICAgICAgICAgIDxjb2xvci1lZGl0YWJsZS1pbnB1dCBsYWJlbD1cInJcIiBbdmFsdWVdPVwicmdiLnJcIlxuICAgICAgICAgICAgW3N0eWxlXT1cInsgaW5wdXQ6IFJHQmlucHV0LCBsYWJlbDogUkdCbGFiZWwgfVwiXG4gICAgICAgICAgICAob25DaGFuZ2UpPVwiaGFuZGxlSW5wdXRDaGFuZ2UoJGV2ZW50KVwiXG4gICAgICAgICAgPjwvY29sb3ItZWRpdGFibGUtaW5wdXQ+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzPVwibWF0ZXJpYWwtdGhpcmRcIj5cbiAgICAgICAgICA8Y29sb3ItZWRpdGFibGUtaW5wdXQgbGFiZWw9XCJnXCIgW3ZhbHVlXT1cInJnYi5nXCJcbiAgICAgICAgICAgIFtzdHlsZV09XCJ7IGlucHV0OiBSR0JpbnB1dCwgbGFiZWw6IFJHQmxhYmVsIH1cIlxuICAgICAgICAgICAgKG9uQ2hhbmdlKT1cImhhbmRsZUlucHV0Q2hhbmdlKCRldmVudClcIlxuICAgICAgICAgID48L2NvbG9yLWVkaXRhYmxlLWlucHV0PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdiBjbGFzcz1cIm1hdGVyaWFsLXRoaXJkXCI+XG4gICAgICAgICAgPGNvbG9yLWVkaXRhYmxlLWlucHV0IGxhYmVsPVwiYlwiIFt2YWx1ZV09XCJyZ2IuYlwiXG4gICAgICAgICAgICBbc3R5bGVdPVwieyBpbnB1dDogUkdCaW5wdXQsIGxhYmVsOiBSR0JsYWJlbCB9XCJcbiAgICAgICAgICAgIChvbkNoYW5nZSk9XCJoYW5kbGVJbnB1dENoYW5nZSgkZXZlbnQpXCJcbiAgICAgICAgICA+PC9jb2xvci1lZGl0YWJsZS1pbnB1dD5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgPC9jb2xvci1yYWlzZWQ+XG4gIGAsXG4gIHN0eWxlczogW1xuICAgIGBcbiAgLm1hdGVyaWFsLXBpY2tlciB7XG4gICAgd2lkdGg6IDEzMHB4O1xuICAgIGhlaWdodDogMTMwcHg7XG4gICAgcGFkZGluZzogMTZweDtcbiAgICBmb250LWZhbWlseTogUm9ib3RvO1xuICB9XG4gIC5tYXRlcmlhbC1zcGxpdCB7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBtYXJnaW4tcmlnaHQ6IC0xMHB4O1xuICAgIHBhZGRpbmctdG9wOiAxMXB4O1xuICB9XG4gIC5tYXRlcmlhbC10aGlyZCB7XG4gICAgZmxleDogMSAxIDAlO1xuICAgIHBhZGRpbmctcmlnaHQ6IDEwcHg7XG4gIH1cbiAgYCxcbiAgXSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIHByZXNlcnZlV2hpdGVzcGFjZXM6IGZhbHNlLFxufSlcbmV4cG9ydCBjbGFzcyBNYXRlcmlhbENvbXBvbmVudCBleHRlbmRzIENvbG9yV3JhcCB7XG4gIEhFWGlucHV0OiB7W2tleTogc3RyaW5nXTogc3RyaW5nfSA9IHtcbiAgICB3aWR0aDogJzEwMCUnLFxuICAgIG1hcmdpblRvcDogJzEycHgnLFxuICAgIGZvbnRTaXplOiAnMTVweCcsXG4gICAgY29sb3I6ICdyZ2IoNTEsIDUxLCA1MSknLFxuICAgIHBhZGRpbmc6ICcwcHgnLFxuICAgICdib3JkZXItd2lkdGgnOiAnMHB4IDBweCAycHgnLFxuICAgIG91dGxpbmU6ICdub25lJyxcbiAgICBoZWlnaHQ6ICczMHB4JyxcbiAgfTtcbiAgSEVYbGFiZWw6IHtba2V5OiBzdHJpbmddOiBzdHJpbmd9ID0ge1xuICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgIHRvcDogJzBweCcsXG4gICAgbGVmdDogJzBweCcsXG4gICAgZm9udFNpemU6ICcxMXB4JyxcbiAgICBjb2xvcjogJ3JnYigxNTMsIDE1MywgMTUzKScsXG4gICAgJ3RleHQtdHJhbnNmb3JtJzogJ2NhcGl0YWxpemUnLFxuICB9O1xuICBSR0JpbnB1dDoge1trZXk6IHN0cmluZ106IHN0cmluZ30gPSB7XG4gICAgd2lkdGg6ICcxMDAlJyxcbiAgICBtYXJnaW5Ub3A6ICcxMnB4JyxcbiAgICBmb250U2l6ZTogJzE1cHgnLFxuICAgIGNvbG9yOiAnIzMzMycsXG4gICAgcGFkZGluZzogJzBweCcsXG4gICAgYm9yZGVyOiAnMHB4JyxcbiAgICAnYm9yZGVyLWJvdHRvbSc6ICcxcHggc29saWQgI2VlZScsXG4gICAgb3V0bGluZTogJ25vbmUnLFxuICAgIGhlaWdodDogJzMwcHgnLFxuICB9O1xuICBSR0JsYWJlbDoge1trZXk6IHN0cmluZ106IHN0cmluZ30gPSB7XG4gICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgdG9wOiAnMHB4JyxcbiAgICBsZWZ0OiAnMHB4JyxcbiAgICBmb250U2l6ZTogJzExcHgnLFxuICAgIGNvbG9yOiAnIzk5OTk5OScsXG4gICAgJ3RleHQtdHJhbnNmb3JtJzogJ2NhcGl0YWxpemUnLFxuICB9O1xuICBASW5wdXQoKSB6RGVwdGg6IHpEZXB0aCA9IDE7XG4gIEBJbnB1dCgpIHJhZGl1cyA9IDE7XG4gIEBJbnB1dCgpIGJhY2tncm91bmQgPSAnI2ZmZic7XG4gIGRpc2FibGVBbHBoYSA9IHRydWU7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcbiAgfVxuXG4gIGhhbmRsZVZhbHVlQ2hhbmdlKHsgZGF0YSwgJGV2ZW50IH0pIHtcbiAgICB0aGlzLmhhbmRsZUNoYW5nZShkYXRhLCAkZXZlbnQpO1xuICB9XG5cbiAgaGFuZGxlSW5wdXRDaGFuZ2UoeyBkYXRhLCAkZXZlbnQgfSkge1xuICAgIGlmIChkYXRhLmhleCkge1xuICAgICAgaWYgKGlzVmFsaWRIZXgoZGF0YS5oZXgpKSB7XG4gICAgICAgIHRoaXMuaGFuZGxlVmFsdWVDaGFuZ2Uoe1xuICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIGhleDogZGF0YS5oZXgsXG4gICAgICAgICAgICBzb3VyY2U6ICdoZXgnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgJGV2ZW50LFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGRhdGEuciB8fCBkYXRhLmcgfHwgZGF0YS5iKSB7XG4gICAgICB0aGlzLmhhbmRsZVZhbHVlQ2hhbmdlKHtcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIHI6IGRhdGEuciB8fCB0aGlzLnJnYi5yLFxuICAgICAgICAgIGc6IGRhdGEuZyB8fCB0aGlzLnJnYi5nLFxuICAgICAgICAgIGI6IGRhdGEuYiB8fCB0aGlzLnJnYi5iLFxuICAgICAgICAgIHNvdXJjZTogJ3JnYicsXG4gICAgICAgIH0sXG4gICAgICAgICRldmVudCxcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIGFmdGVyVmFsaWRDaGFuZ2UoKSB7XG4gICAgdGhpcy5IRVhpbnB1dFsnYm9yZGVyLWJvdHRvbS1jb2xvciddID0gdGhpcy5oZXg7XG4gIH1cbn1cblxuQE5nTW9kdWxlKHtcbiAgZXhwb3J0czogW01hdGVyaWFsQ29tcG9uZW50XSxcbiAgZGVjbGFyYXRpb25zOiBbTWF0ZXJpYWxDb21wb25lbnRdLFxuICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlLCBFZGl0YWJsZUlucHV0TW9kdWxlLCBSYWlzZWRNb2R1bGVdLFxufSlcbmV4cG9ydCBjbGFzcyBDb2xvck1hdGVyaWFsTW9kdWxlIHsgfVxuIl19