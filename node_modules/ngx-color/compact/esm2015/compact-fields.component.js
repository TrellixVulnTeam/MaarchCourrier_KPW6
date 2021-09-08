import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, } from '@angular/core';
import { isValidHex } from 'ngx-color';
export class CompactFieldsComponent {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGFjdC1maWVsZHMuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Ii4uLy4uLy4uLy4uL3NyYy9saWIvY29tcG9uZW50cy9jb21wYWN0LyIsInNvdXJjZXMiOlsiY29tcGFjdC1maWVsZHMuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFDTCx1QkFBdUIsRUFDdkIsU0FBUyxFQUNULFlBQVksRUFDWixLQUFLLEVBQ0wsTUFBTSxHQUNQLE1BQU0sZUFBZSxDQUFDO0FBRXZCLE9BQU8sRUFBRSxVQUFVLEVBQVEsTUFBTSxXQUFXLENBQUM7QUE2RDdDLE1BQU0sT0FBTyxzQkFBc0I7SUEzRG5DO1FBOERZLGFBQVEsR0FBRyxJQUFJLFlBQVksRUFBTyxDQUFDO1FBQzdDLFlBQU8sR0FBNEI7WUFDakMsU0FBUyxFQUFFLE1BQU07WUFDakIsWUFBWSxFQUFFLE1BQU07WUFDcEIsa0JBQWtCO1lBQ2xCLFFBQVEsRUFBRSxVQUFVO1NBQ3JCLENBQUM7UUFDRixhQUFRLEdBQTRCO1lBQ2xDLEtBQUssRUFBRSxLQUFLO1lBQ1osT0FBTyxFQUFFLEtBQUs7WUFDZCxXQUFXLEVBQUUsS0FBSztZQUNsQixNQUFNLEVBQUUsTUFBTTtZQUNkLE9BQU8sRUFBRSxNQUFNO1lBQ2YsVUFBVSxFQUFFLE1BQU07WUFDbEIsUUFBUSxFQUFFLE1BQU07WUFDaEIsS0FBSyxFQUFFLE1BQU07WUFDYixNQUFNLEVBQUUsTUFBTTtTQUNmLENBQUM7UUFDRixhQUFRLEdBQTRCO1lBQ2xDLE9BQU8sRUFBRSxNQUFNO1NBQ2hCLENBQUM7UUFDRixZQUFPLEdBQTRCO1lBQ2pDLFNBQVMsRUFBRSxNQUFNO1lBQ2pCLFlBQVksRUFBRSxNQUFNO1lBQ3BCLGtCQUFrQjtZQUNsQixRQUFRLEVBQUUsVUFBVTtTQUNyQixDQUFDO1FBQ0YsYUFBUSxHQUE0QjtZQUNsQyxLQUFLLEVBQUUsS0FBSztZQUNaLE9BQU8sRUFBRSxLQUFLO1lBQ2QsV0FBVyxFQUFFLEtBQUs7WUFDbEIsTUFBTSxFQUFFLE1BQU07WUFDZCxPQUFPLEVBQUUsTUFBTTtZQUNmLFVBQVUsRUFBRSxNQUFNO1lBQ2xCLFFBQVEsRUFBRSxNQUFNO1lBQ2hCLEtBQUssRUFBRSxNQUFNO1lBQ2IsTUFBTSxFQUFFLE1BQU07U0FDZixDQUFDO1FBQ0YsYUFBUSxHQUE0QjtZQUNsQyxRQUFRLEVBQUUsVUFBVTtZQUNwQixHQUFHLEVBQUUsS0FBSztZQUNWLElBQUksRUFBRSxLQUFLO1lBQ1gsYUFBYSxFQUFFLE1BQU07WUFDckIsZ0JBQWdCLEVBQUUsV0FBVztZQUM3QixRQUFRLEVBQUUsTUFBTTtZQUNoQixLQUFLLEVBQUUsTUFBTTtTQUNkLENBQUM7SUF5QkosQ0FBQztJQXZCQyxZQUFZLENBQUMsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFO1FBQzNCLElBQUksSUFBSSxDQUFDLEdBQUcsRUFBRTtZQUNaLElBQUksVUFBVSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRTtnQkFDeEIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUM7b0JBQ2pCLElBQUksRUFBRTt3QkFDSixHQUFHLEVBQUUsSUFBSSxDQUFDLEdBQUc7d0JBQ2IsTUFBTSxFQUFFLEtBQUs7cUJBQ2Q7b0JBQ0QsTUFBTTtpQkFDUCxDQUFDLENBQUM7YUFDSjtTQUNGO2FBQU07WUFDTCxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQztnQkFDakIsSUFBSSxFQUFFO29CQUNKLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFDdkIsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQUN2QixDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBQ3ZCLE1BQU0sRUFBRSxLQUFLO2lCQUNkO2dCQUNELE1BQU07YUFDUCxDQUFDLENBQUM7U0FDSjtJQUNILENBQUM7OztZQXBJRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLHNCQUFzQjtnQkFDaEMsUUFBUSxFQUFFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FvQ1Q7Z0JBa0JELGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNO2dCQUMvQyxtQkFBbUIsRUFBRSxLQUFLO3lCQWpCeEI7Ozs7Ozs7Ozs7Ozs7O0dBY0Q7YUFJRjs7O2tCQUVFLEtBQUs7a0JBQ0wsS0FBSzt1QkFDTCxNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENvbXBvbmVudCxcbiAgRXZlbnRFbWl0dGVyLFxuICBJbnB1dCxcbiAgT3V0cHV0LFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgaXNWYWxpZEhleCwgUkdCQSB9IGZyb20gJ25neC1jb2xvcic7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2NvbG9yLWNvbXBhY3QtZmllbGRzJyxcbiAgdGVtcGxhdGU6IGBcbiAgPGRpdiBjbGFzcz1cImNvbXBhY3QtZmllbGRzXCI+XG4gICAgPGRpdiBjbGFzcz1cImNvbXBhY3QtYWN0aXZlXCIgW3N0eWxlLmJhY2tncm91bmRdPVwiaGV4XCI+PC9kaXY+XG4gICAgPGRpdiBzdHlsZT1cImZsZXg6IDYgMSAwJTtcIj5cbiAgICAgIDxjb2xvci1lZGl0YWJsZS1pbnB1dFxuICAgICAgICBbc3R5bGVdPVwieyB3cmFwOiBIRVhXcmFwLCBpbnB1dDogSEVYaW5wdXQsIGxhYmVsOiBIRVhsYWJlbCB9XCJcbiAgICAgICAgbGFiZWw9XCJoZXhcIlxuICAgICAgICBbdmFsdWVdPVwiaGV4XCJcbiAgICAgICAgKG9uQ2hhbmdlKT1cImhhbmRsZUNoYW5nZSgkZXZlbnQpXCJcbiAgICAgID48L2NvbG9yLWVkaXRhYmxlLWlucHV0PlxuICAgIDwvZGl2PlxuICAgIDxkaXYgc3R5bGU9XCJmbGV4OiAzIDEgMCVcIj5cbiAgICAgIDxjb2xvci1lZGl0YWJsZS1pbnB1dFxuICAgICAgICBbc3R5bGVdPVwieyB3cmFwOiBSR0J3cmFwLCBpbnB1dDogUkdCaW5wdXQsIGxhYmVsOiBSR0JsYWJlbCB9XCJcbiAgICAgICAgbGFiZWw9XCJyXCJcbiAgICAgICAgW3ZhbHVlXT1cInJnYi5yXCJcbiAgICAgICAgKG9uQ2hhbmdlKT1cImhhbmRsZUNoYW5nZSgkZXZlbnQpXCJcbiAgICAgID48L2NvbG9yLWVkaXRhYmxlLWlucHV0PlxuICAgIDwvZGl2PlxuICAgIDxkaXYgc3R5bGU9XCJmbGV4OiAzIDEgMCVcIj5cbiAgICAgIDxjb2xvci1lZGl0YWJsZS1pbnB1dFxuICAgICAgICBbc3R5bGVdPVwieyB3cmFwOiBSR0J3cmFwLCBpbnB1dDogUkdCaW5wdXQsIGxhYmVsOiBSR0JsYWJlbCB9XCJcbiAgICAgICAgbGFiZWw9XCJnXCJcbiAgICAgICAgW3ZhbHVlXT1cInJnYi5nXCJcbiAgICAgICAgKG9uQ2hhbmdlKT1cImhhbmRsZUNoYW5nZSgkZXZlbnQpXCJcbiAgICAgID48L2NvbG9yLWVkaXRhYmxlLWlucHV0PlxuICAgIDwvZGl2PlxuICAgIDxkaXYgc3R5bGU9XCJmbGV4OiAzIDEgMCVcIj5cbiAgICAgIDxjb2xvci1lZGl0YWJsZS1pbnB1dFxuICAgICAgICBbc3R5bGVdPVwieyB3cmFwOiBSR0J3cmFwLCBpbnB1dDogUkdCaW5wdXQsIGxhYmVsOiBSR0JsYWJlbCB9XCJcbiAgICAgICAgbGFiZWw9XCJiXCJcbiAgICAgICAgW3ZhbHVlXT1cInJnYi5iXCJcbiAgICAgICAgKG9uQ2hhbmdlKT1cImhhbmRsZUNoYW5nZSgkZXZlbnQpXCJcbiAgICAgID48L2NvbG9yLWVkaXRhYmxlLWlucHV0PlxuICAgIDwvZGl2PlxuICA8L2Rpdj5cbiAgYCxcbiAgc3R5bGVzOiBbXG4gICAgYFxuICAuY29tcGFjdC1maWVsZHMge1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgcGFkZGluZy1ib3R0b206IDZweDtcbiAgICBwYWRkaW5nLXJpZ2h0OiA1cHg7XG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xuICB9XG4gIC5jb21wYWN0LWFjdGl2ZSB7XG4gICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgIHRvcDogNnB4O1xuICAgIGxlZnQ6IDVweDtcbiAgICBoZWlnaHQ6IDlweDtcbiAgICB3aWR0aDogOXB4O1xuICB9XG4gIGAsXG4gIF0sXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBwcmVzZXJ2ZVdoaXRlc3BhY2VzOiBmYWxzZSxcbn0pXG5leHBvcnQgY2xhc3MgQ29tcGFjdEZpZWxkc0NvbXBvbmVudCB7XG4gIEBJbnB1dCgpIGhleCE6IHN0cmluZztcbiAgQElucHV0KCkgcmdiITogUkdCQTtcbiAgQE91dHB1dCgpIG9uQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG4gIEhFWFdyYXA6IHtba2V5OiBzdHJpbmddOiBzdHJpbmd9ID0ge1xuICAgIG1hcmdpblRvcDogJy0zcHgnLFxuICAgIG1hcmdpbkJvdHRvbTogJy0zcHgnLFxuICAgIC8vIGZsZXg6ICc2IDEgMCUnLFxuICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnLFxuICB9O1xuICBIRVhpbnB1dDoge1trZXk6IHN0cmluZ106IHN0cmluZ30gPSB7XG4gICAgd2lkdGg6ICc4MCUnLFxuICAgIHBhZGRpbmc6ICcwcHgnLFxuICAgIHBhZGRpbmdMZWZ0OiAnMjAlJyxcbiAgICBib3JkZXI6ICdub25lJyxcbiAgICBvdXRsaW5lOiAnbm9uZScsXG4gICAgYmFja2dyb3VuZDogJ25vbmUnLFxuICAgIGZvbnRTaXplOiAnMTJweCcsXG4gICAgY29sb3I6ICcjMzMzJyxcbiAgICBoZWlnaHQ6ICcxNnB4JyxcbiAgfTtcbiAgSEVYbGFiZWw6IHtba2V5OiBzdHJpbmddOiBzdHJpbmd9ID0ge1xuICAgIGRpc3BsYXk6ICdub25lJyxcbiAgfTtcbiAgUkdCd3JhcDoge1trZXk6IHN0cmluZ106IHN0cmluZ30gPSB7XG4gICAgbWFyZ2luVG9wOiAnLTNweCcsXG4gICAgbWFyZ2luQm90dG9tOiAnLTNweCcsXG4gICAgLy8gZmxleDogJzMgMSAwJScsXG4gICAgcG9zaXRpb246ICdyZWxhdGl2ZScsXG4gIH07XG4gIFJHQmlucHV0OiB7W2tleTogc3RyaW5nXTogc3RyaW5nfSA9IHtcbiAgICB3aWR0aDogJzgwJScsXG4gICAgcGFkZGluZzogJzBweCcsXG4gICAgcGFkZGluZ0xlZnQ6ICczMCUnLFxuICAgIGJvcmRlcjogJ25vbmUnLFxuICAgIG91dGxpbmU6ICdub25lJyxcbiAgICBiYWNrZ3JvdW5kOiAnbm9uZScsXG4gICAgZm9udFNpemU6ICcxMnB4JyxcbiAgICBjb2xvcjogJyMzMzMnLFxuICAgIGhlaWdodDogJzE2cHgnLFxuICB9O1xuICBSR0JsYWJlbDoge1trZXk6IHN0cmluZ106IHN0cmluZ30gPSB7XG4gICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgdG9wOiAnNnB4JyxcbiAgICBsZWZ0OiAnMHB4JyxcbiAgICAnbGluZS1oZWlnaHQnOiAnMTZweCcsXG4gICAgJ3RleHQtdHJhbnNmb3JtJzogJ3VwcGVyY2FzZScsXG4gICAgZm9udFNpemU6ICcxMnB4JyxcbiAgICBjb2xvcjogJyM5OTknLFxuICB9O1xuXG4gIGhhbmRsZUNoYW5nZSh7IGRhdGEsICRldmVudCB9KSB7XG4gICAgaWYgKGRhdGEuaGV4KSB7XG4gICAgICBpZiAoaXNWYWxpZEhleChkYXRhLmhleCkpIHtcbiAgICAgICAgdGhpcy5vbkNoYW5nZS5lbWl0KHtcbiAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICBoZXg6IGRhdGEuaGV4LFxuICAgICAgICAgICAgc291cmNlOiAnaGV4JyxcbiAgICAgICAgICB9LFxuICAgICAgICAgICRldmVudCxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMub25DaGFuZ2UuZW1pdCh7XG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICByOiBkYXRhLnIgfHwgdGhpcy5yZ2IucixcbiAgICAgICAgICBnOiBkYXRhLmcgfHwgdGhpcy5yZ2IuZyxcbiAgICAgICAgICBiOiBkYXRhLmIgfHwgdGhpcy5yZ2IuYixcbiAgICAgICAgICBzb3VyY2U6ICdyZ2InLFxuICAgICAgICB9LFxuICAgICAgICAkZXZlbnQsXG4gICAgICB9KTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==