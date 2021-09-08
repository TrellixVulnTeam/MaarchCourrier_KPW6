import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, NgModule, } from '@angular/core';
import { CheckboardModule, ColorWrap, EditableInputModule, SwatchModule, getContrastingColor, isValidHex, } from 'ngx-color';
import { BlockSwatchesComponent } from './block-swatches.component';
export class BlockComponent extends ColorWrap {
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
export class ColorBlockModule {
}
ColorBlockModule.decorators = [
    { type: NgModule, args: [{
                declarations: [BlockComponent, BlockSwatchesComponent],
                exports: [BlockComponent, BlockSwatchesComponent],
                imports: [CommonModule, CheckboardModule, SwatchModule, EditableInputModule],
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmxvY2suY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Ii4uLy4uLy4uLy4uL3NyYy9saWIvY29tcG9uZW50cy9ibG9jay8iLCJzb3VyY2VzIjpbImJsb2NrLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDL0MsT0FBTyxFQUNMLHVCQUF1QixFQUN2QixTQUFTLEVBQ1QsS0FBSyxFQUNMLFFBQVEsR0FDVCxNQUFNLGVBQWUsQ0FBQztBQUV2QixPQUFPLEVBQ0wsZ0JBQWdCLEVBQ2hCLFNBQVMsRUFDVCxtQkFBbUIsRUFDbkIsWUFBWSxFQUNaLG1CQUFtQixFQUNuQixVQUFVLEdBQ1gsTUFBTSxXQUFXLENBQUM7QUFDbkIsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFxRXBFLE1BQU0sT0FBTyxjQUFlLFNBQVEsU0FBUztJQWtDM0M7UUFDRSxLQUFLLEVBQUUsQ0FBQztRQWxDVixtQ0FBbUM7UUFDMUIsVUFBSyxHQUFvQixHQUFHLENBQUM7UUFDdEMsK0JBQStCO1FBQ3RCLFdBQU0sR0FBRztZQUNoQixTQUFTO1lBQ1QsU0FBUztZQUNULFNBQVM7WUFDVCxTQUFTO1lBQ1QsU0FBUztZQUNULFNBQVM7WUFDVCxTQUFTO1lBQ1QsU0FBUztZQUNULFNBQVM7U0FDVixDQUFDO1FBQ08sYUFBUSxHQUFtQixLQUFLLENBQUM7UUFDMUMsVUFBSyxHQUE0QjtZQUMvQixLQUFLLEVBQUUsTUFBTTtZQUNiLFFBQVEsRUFBRSxNQUFNO1lBQ2hCLEtBQUssRUFBRSxNQUFNO1lBQ2IsTUFBTSxFQUFFLEtBQUs7WUFDYixPQUFPLEVBQUUsTUFBTTtZQUNmLE1BQU0sRUFBRSxNQUFNO1lBQ2QsU0FBUyxFQUFFLHNCQUFzQjtZQUNqQyxZQUFZLEVBQUUsS0FBSztZQUNuQixPQUFPLEVBQUUsT0FBTztZQUNoQixTQUFTLEVBQUUsWUFBWTtTQUN4QixDQUFDO1FBQ0YsU0FBSSxHQUE0QjtZQUM5QixRQUFRLEVBQUUsVUFBVTtZQUNwQixLQUFLLEVBQUUsTUFBTTtTQUNkLENBQUM7UUFDRixpQkFBWSxHQUFHLElBQUksQ0FBQztJQUlwQixDQUFDO0lBRUQsaUJBQWlCLENBQUMsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFO1FBQ2hDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQztJQUNoRCxDQUFDO0lBQ0QsbUJBQW1CLENBQUMsR0FBRztRQUNyQixPQUFPLG1CQUFtQixDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ2xDLENBQUM7SUFDRCxpQkFBaUIsQ0FBQyxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUU7UUFDL0IsSUFBSSxVQUFVLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFDbkIsa0JBQWtCO1lBQ2xCLElBQUksQ0FBQyxZQUFZLENBQ2Y7Z0JBQ0UsR0FBRztnQkFDSCxNQUFNLEVBQUUsS0FBSzthQUNkLEVBQ0QsTUFBTSxDQUNQLENBQUM7U0FDSDtJQUNILENBQUM7OztZQTFIRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLGFBQWE7Z0JBQ3ZCLFFBQVEsRUFBRTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0EwQlQ7Z0JBb0NELG1CQUFtQixFQUFFLEtBQUs7Z0JBQzFCLGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNO3lCQW5DN0M7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBZ0NEO2FBSUY7Ozs7b0JBR0UsS0FBSztxQkFFTCxLQUFLO3VCQVdMLEtBQUs7O0FBZ0RSLE1BQU0sT0FBTyxnQkFBZ0I7OztZQUw1QixRQUFRLFNBQUM7Z0JBQ1IsWUFBWSxFQUFFLENBQUMsY0FBYyxFQUFFLHNCQUFzQixDQUFDO2dCQUN0RCxPQUFPLEVBQUUsQ0FBQyxjQUFjLEVBQUUsc0JBQXNCLENBQUM7Z0JBQ2pELE9BQU8sRUFBRSxDQUFDLFlBQVksRUFBRSxnQkFBZ0IsRUFBRSxZQUFZLEVBQUUsbUJBQW1CLENBQUM7YUFDN0UiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENvbXBvbmVudCxcbiAgSW5wdXQsXG4gIE5nTW9kdWxlLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHtcbiAgQ2hlY2tib2FyZE1vZHVsZSxcbiAgQ29sb3JXcmFwLFxuICBFZGl0YWJsZUlucHV0TW9kdWxlLFxuICBTd2F0Y2hNb2R1bGUsXG4gIGdldENvbnRyYXN0aW5nQ29sb3IsXG4gIGlzVmFsaWRIZXgsXG59IGZyb20gJ25neC1jb2xvcic7XG5pbXBvcnQgeyBCbG9ja1N3YXRjaGVzQ29tcG9uZW50IH0gZnJvbSAnLi9ibG9jay1zd2F0Y2hlcy5jb21wb25lbnQnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdjb2xvci1ibG9jaycsXG4gIHRlbXBsYXRlOiBgXG4gIDxkaXYgY2xhc3M9XCJibG9jay1jYXJkIGJsb2NrLXBpY2tlciB7eyBjbGFzc05hbWUgfX1cIj5cbiAgICA8ZGl2IGNsYXNzPVwiYmxvY2stdHJpYW5nbGVcIiAqbmdJZj1cInRyaWFuZ2xlICE9PSAnaGlkZSdcIlxuICAgICAgW3N0eWxlLmJvcmRlci1jb2xvcl09XCIndHJhbnNwYXJlbnQgdHJhbnNwYXJlbnQgJyArIHRoaXMuaGV4ICsgJyB0cmFuc3BhcmVudCdcIlxuICAgID48L2Rpdj5cblxuICAgIDxkaXYgY2xhc3M9XCJibG9jay1oZWFkXCIgW3N0eWxlLmJhY2tncm91bmRdPVwiaGV4XCI+XG4gICAgICA8Y29sb3ItY2hlY2tib2FyZCAqbmdJZj1cImhleCA9PT0gJ3RyYW5zcGFyZW50J1wiXG4gICAgICAgIGJvcmRlclJhZGl1cz1cIjZweCA2cHggMCAwXCJcbiAgICAgID48L2NvbG9yLWNoZWNrYm9hcmQ+XG4gICAgICA8ZGl2IGNsYXNzPVwiYmxvY2stbGFiZWxcIiBbc3R5bGUuY29sb3JdPVwiZ2V0Q29udHJhc3RpbmdDb2xvcihoZXgpXCI+XG4gICAgICAgIHt7IGhleCB9fVxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG5cbiAgICA8ZGl2IGNsYXNzPVwiYmxvY2stYm9keVwiPlxuICAgICAgPGNvbG9yLWJsb2NrLXN3YXRjaGVzIFtjb2xvcnNdPVwiY29sb3JzXCJcbiAgICAgICAgKG9uQ2xpY2spPVwiaGFuZGxlQmxvY2tDaGFuZ2UoJGV2ZW50KVwiXG4gICAgICAgIChvblN3YXRjaEhvdmVyKT1cIm9uU3dhdGNoSG92ZXIuZW1pdCgkZXZlbnQpXCJcbiAgICAgID48L2NvbG9yLWJsb2NrLXN3YXRjaGVzPlxuICAgICAgPGNvbG9yLWVkaXRhYmxlLWlucHV0IFt2YWx1ZV09XCJoZXhcIlxuICAgICAgICAob25DaGFuZ2UpPVwiaGFuZGxlVmFsdWVDaGFuZ2UoJGV2ZW50KVwiXG4gICAgICAgIFtzdHlsZV09XCJ7aW5wdXQ6IGlucHV0LCB3cmFwOiB3cmFwfVwiXG4gICAgICA+PC9jb2xvci1lZGl0YWJsZS1pbnB1dD5cbiAgICA8L2Rpdj5cbiAgPC9kaXY+XG4gIGAsXG4gIHN0eWxlczogW1xuICAgIGBcbiAgICAuYmxvY2stY2FyZCB7XG4gICAgICBiYWNrZ3JvdW5kOiAjZmZmO1xuICAgICAgYm9yZGVyLXJhZGl1czogNnB4O1xuICAgICAgYm94LXNoYWRvdzogMCAxcHggcmdiYSgwLCAwLCAwLCAuMSk7XG4gICAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gICAgfVxuICAgIC5ibG9jay1oZWFkIHtcbiAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgICBib3JkZXItcmFkaXVzOiA2cHggNnB4IDAgMDtcbiAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgICBoZWlnaHQ6IDExMHB4O1xuICAgICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gICAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gICAgfVxuICAgIC5ibG9jay1ib2R5IHtcbiAgICAgIHBhZGRpbmc6IDEwcHg7XG4gICAgfVxuICAgIC5ibG9jay1sYWJlbCB7XG4gICAgICBmb250LXNpemU6IDE4cHg7XG4gICAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gICAgfVxuICAgIC5ibG9jay10cmlhbmdsZSB7XG4gICAgICBib3JkZXItc3R5bGU6IHNvbGlkO1xuICAgICAgYm9yZGVyLXdpZHRoOiAwIDEwcHggMTBweCAxMHB4O1xuICAgICAgaGVpZ2h0OiAwO1xuICAgICAgbGVmdDogNTAlO1xuICAgICAgbWFyZ2luLWxlZnQ6IC0xMHB4O1xuICAgICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgICAgdG9wOiAtMTBweDtcbiAgICAgIHdpZHRoOiAwO1xuICAgIH1cbiAgYCxcbiAgXSxcbiAgcHJlc2VydmVXaGl0ZXNwYWNlczogZmFsc2UsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxufSlcbmV4cG9ydCBjbGFzcyBCbG9ja0NvbXBvbmVudCBleHRlbmRzIENvbG9yV3JhcCB7XG4gIC8qKiBQaXhlbCB2YWx1ZSBmb3IgcGlja2VyIHdpZHRoICovXG4gIEBJbnB1dCgpIHdpZHRoOiBzdHJpbmcgfCBudW1iZXIgPSAxNzA7XG4gIC8qKiBDb2xvciBzcXVhcmVzIHRvIGRpc3BsYXkgKi9cbiAgQElucHV0KCkgY29sb3JzID0gW1xuICAgICcjRDlFM0YwJyxcbiAgICAnI0Y0NzM3MycsXG4gICAgJyM2OTc2ODknLFxuICAgICcjMzdENjdBJyxcbiAgICAnIzJDQ0NFNCcsXG4gICAgJyM1NTU1NTUnLFxuICAgICcjZGNlNzc1JyxcbiAgICAnI2ZmOGE2NScsXG4gICAgJyNiYTY4YzgnLFxuICBdO1xuICBASW5wdXQoKSB0cmlhbmdsZTogJ3RvcCcgfCAnaGlkZScgPSAndG9wJztcbiAgaW5wdXQ6IHtba2V5OiBzdHJpbmddOiBzdHJpbmd9ID0ge1xuICAgIHdpZHRoOiAnMTAwJScsXG4gICAgZm9udFNpemU6ICcxMnB4JyxcbiAgICBjb2xvcjogJyM2NjYnLFxuICAgIGJvcmRlcjogJzBweCcsXG4gICAgb3V0bGluZTogJ25vbmUnLFxuICAgIGhlaWdodDogJzIycHgnLFxuICAgIGJveFNoYWRvdzogJ2luc2V0IDAgMCAwIDFweCAjZGRkJyxcbiAgICBib3JkZXJSYWRpdXM6ICc0cHgnLFxuICAgIHBhZGRpbmc6ICcwIDdweCcsXG4gICAgYm94U2l6aW5nOiAnYm9yZGVyLWJveCcsXG4gIH07XG4gIHdyYXA6IHtba2V5OiBzdHJpbmddOiBzdHJpbmd9ID0ge1xuICAgIHBvc2l0aW9uOiAncmVsYXRpdmUnLFxuICAgIHdpZHRoOiAnMTAwJScsXG4gIH07XG4gIGRpc2FibGVBbHBoYSA9IHRydWU7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcbiAgfVxuXG4gIGhhbmRsZVZhbHVlQ2hhbmdlKHsgZGF0YSwgJGV2ZW50IH0pIHtcbiAgICB0aGlzLmhhbmRsZUJsb2NrQ2hhbmdlKHsgaGV4OiBkYXRhLCAkZXZlbnQgfSk7XG4gIH1cbiAgZ2V0Q29udHJhc3RpbmdDb2xvcihoZXgpIHtcbiAgICByZXR1cm4gZ2V0Q29udHJhc3RpbmdDb2xvcihoZXgpO1xuICB9XG4gIGhhbmRsZUJsb2NrQ2hhbmdlKHsgaGV4LCAkZXZlbnQgfSkge1xuICAgIGlmIChpc1ZhbGlkSGV4KGhleCkpIHtcbiAgICAgIC8vIHRoaXMuaGV4ID0gaGV4O1xuICAgICAgdGhpcy5oYW5kbGVDaGFuZ2UoXG4gICAgICAgIHtcbiAgICAgICAgICBoZXgsXG4gICAgICAgICAgc291cmNlOiAnaGV4JyxcbiAgICAgICAgfSxcbiAgICAgICAgJGV2ZW50LFxuICAgICAgKTtcbiAgICB9XG4gIH1cbn1cblxuQE5nTW9kdWxlKHtcbiAgZGVjbGFyYXRpb25zOiBbQmxvY2tDb21wb25lbnQsIEJsb2NrU3dhdGNoZXNDb21wb25lbnRdLFxuICBleHBvcnRzOiBbQmxvY2tDb21wb25lbnQsIEJsb2NrU3dhdGNoZXNDb21wb25lbnRdLFxuICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlLCBDaGVja2JvYXJkTW9kdWxlLCBTd2F0Y2hNb2R1bGUsIEVkaXRhYmxlSW5wdXRNb2R1bGVdLFxufSlcbmV4cG9ydCBjbGFzcyBDb2xvckJsb2NrTW9kdWxlIHt9XG4iXX0=