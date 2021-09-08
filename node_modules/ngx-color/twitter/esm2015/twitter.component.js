import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, NgModule } from '@angular/core';
import { ColorWrap, EditableInputModule, SwatchModule, isValidHex } from 'ngx-color';
export class TwitterComponent extends ColorWrap {
    constructor() {
        super();
        /** Pixel value for picker width */
        this.width = 276;
        /** Color squares to display */
        this.colors = [
            '#FF6900',
            '#FCB900',
            '#7BDCB5',
            '#00D084',
            '#8ED1FC',
            '#0693E3',
            '#ABB8C3',
            '#EB144C',
            '#F78DA7',
            '#9900EF',
        ];
        this.triangle = 'top-left';
        this.swatchStyle = {
            width: '30px',
            height: '30px',
            borderRadius: '4px',
            fontSize: '0',
        };
        this.input = {
            borderRadius: '4px',
            borderBottomLeftRadius: '0',
            borderTopLeftRadius: '0',
            border: '1px solid #e6ecf0',
            boxSizing: 'border-box',
            display: 'inline',
            fontSize: '14px',
            height: '30px',
            padding: '0',
            paddingLeft: '6px',
            width: '100%',
            color: '#657786',
        };
        this.disableAlpha = true;
    }
    focus(color) {
        return { boxShadow: `0 0 4px ${color}` };
    }
    handleBlockChange({ hex, $event }) {
        if (isValidHex(hex)) {
            // this.hex = hex;
            this.handleChange({ hex, source: 'hex' }, $event);
        }
    }
    handleValueChange({ data, $event }) {
        this.handleBlockChange({ hex: data, $event });
    }
}
TwitterComponent.decorators = [
    { type: Component, args: [{
                selector: 'color-twitter',
                template: `
  <div class="twitter-picker {{ triangle }}-triangle {{ className }}" [style.width.px]="width">
    <div class="triangleShadow"></div>
    <div class="triangle"></div>
    <div class="twitter-body">
      <div class="twitter-swatch" *ngFor="let color of colors">
        <color-swatch
          [color]="color"
          [style]="swatchStyle"
          [focusStyle]="focus(color)"
          (onClick)="handleBlockChange($event)"
          (onHover)="onSwatchHover.emit($event)"
        ></color-swatch>
      </div>
      <div class="twitter-hash">
        <div>#</div>
      </div>
      <div class="twitter-input">
        <color-editable-input
          [style]="{ input: input }"
          [value]="hex.replace('#', '')"
          (onChange)="handleValueChange($event)"
        ></color-editable-input>
      </div>
    </div>
  </div>
  `,
                changeDetection: ChangeDetectionStrategy.OnPush,
                preserveWhitespaces: false,
                styles: [`
    .twitter-picker {
      background: rgb(255, 255, 255);
      border: 0px solid rgba(0, 0, 0, 0.25);
      box-shadow: rgba(0, 0, 0, 0.25) 0px 1px 4px;
      border-radius: 4px;
      position: relative;
      box-sizing: border-box;
    }
    .triangleShadow {
      width: 0px;
      height: 0px;
      border-style: solid;
      border-width: 0px 9px 10px;
      border-color: transparent transparent rgba(0, 0, 0, 0.1);
      position: absolute;
    }
    .triangle {
      width: 0px;
      height: 0px;
      border-style: solid;
      border-width: 0px 9px 10px;
      border-color: transparent transparent rgb(255, 255, 255);
      position: absolute;
    }
    .hide-triangle > .triangle {
      display: none;
    }
    .hide-triangle > .triangleShadow {
      display: none;
    }
    .top-left-triangle > .triangle {
      top: -10px;
      left: 12px;
    }
    .top-left-triangle > .triangleShadow {
      top: -11px;
      left: 12px;
    }
    .top-right-triangle > .triangle {
      top: -10px;
      right: 12px;
    }
    .top-right-triangle > .triangleShadow {
      top: -11px;
      right: 12px;
    }
    .twitter-body {
      padding: 15px 9px 9px 15px;
    }
    .twitter-swatch {
      width: 30px;
      height: 30px;
      display: inline-block;
      margin: 0 6px 0 0;
    }
    .twitter-hash {
      background: rgb(240, 240, 240);
      height: 30px;
      width: 30px;
      border-radius: 4px 0px 0px 4px;
      color: rgb(152, 161, 164);
      margin-left: -3px;
      display: inline-block;

    }
    .twitter-hash > div {
      position: absolute;
      align-items: center;
      justify-content: center;
      height: 30px;
      width: 30px;
      display: flex;
    }
    .twitter-input {
      position: relative;
      display: inline-block;
      margin-top: -6px;
      font-size: 10px;
      height: 27px;
      padding: 0;
      position: relative;
      top: 6px;
      vertical-align: top;
      width: 108px;
      margin-left: -4px;
    }
  `]
            },] }
];
TwitterComponent.ctorParameters = () => [];
TwitterComponent.propDecorators = {
    width: [{ type: Input }],
    colors: [{ type: Input }],
    triangle: [{ type: Input }]
};
export class ColorTwitterModule {
}
ColorTwitterModule.decorators = [
    { type: NgModule, args: [{
                declarations: [TwitterComponent],
                exports: [TwitterComponent],
                imports: [CommonModule, SwatchModule, EditableInputModule],
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHdpdHRlci5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiLi4vLi4vLi4vLi4vc3JjL2xpYi9jb21wb25lbnRzL3R3aXR0ZXIvIiwic291cmNlcyI6WyJ0d2l0dGVyLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDL0MsT0FBTyxFQUFFLHVCQUF1QixFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRXBGLE9BQU8sRUFBRSxTQUFTLEVBQUUsbUJBQW1CLEVBQUUsWUFBWSxFQUFFLFVBQVUsRUFBRSxNQUFNLFdBQVcsQ0FBQztBQTRIckYsTUFBTSxPQUFPLGdCQUFpQixTQUFRLFNBQVM7SUF3QzdDO1FBQ0UsS0FBSyxFQUFFLENBQUM7UUF4Q1YsbUNBQW1DO1FBQzFCLFVBQUssR0FBb0IsR0FBRyxDQUFDO1FBQ3RDLCtCQUErQjtRQUN0QixXQUFNLEdBQUc7WUFDaEIsU0FBUztZQUNULFNBQVM7WUFDVCxTQUFTO1lBQ1QsU0FBUztZQUNULFNBQVM7WUFDVCxTQUFTO1lBQ1QsU0FBUztZQUNULFNBQVM7WUFDVCxTQUFTO1lBQ1QsU0FBUztTQUNWLENBQUM7UUFDTyxhQUFRLEdBQXVELFVBQVUsQ0FBQztRQUVuRixnQkFBVyxHQUE0QjtZQUNyQyxLQUFLLEVBQUUsTUFBTTtZQUNiLE1BQU0sRUFBRSxNQUFNO1lBQ2QsWUFBWSxFQUFFLEtBQUs7WUFDbkIsUUFBUSxFQUFFLEdBQUc7U0FDZCxDQUFDO1FBQ0YsVUFBSyxHQUE0QjtZQUMvQixZQUFZLEVBQUUsS0FBSztZQUNuQixzQkFBc0IsRUFBRSxHQUFHO1lBQzNCLG1CQUFtQixFQUFFLEdBQUc7WUFDeEIsTUFBTSxFQUFFLG1CQUFtQjtZQUMzQixTQUFTLEVBQUUsWUFBWTtZQUN2QixPQUFPLEVBQUUsUUFBUTtZQUNqQixRQUFRLEVBQUUsTUFBTTtZQUNoQixNQUFNLEVBQUUsTUFBTTtZQUNkLE9BQU8sRUFBRSxHQUFHO1lBQ1osV0FBVyxFQUFFLEtBQUs7WUFDbEIsS0FBSyxFQUFFLE1BQU07WUFDYixLQUFLLEVBQUUsU0FBUztTQUNqQixDQUFDO1FBQ0YsaUJBQVksR0FBRyxJQUFJLENBQUM7SUFJcEIsQ0FBQztJQUVELEtBQUssQ0FBQyxLQUFhO1FBQ2pCLE9BQU8sRUFBRSxTQUFTLEVBQUUsV0FBVyxLQUFLLEVBQUUsRUFBRSxDQUFDO0lBQzNDLENBQUM7SUFFRCxpQkFBaUIsQ0FBQyxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQU87UUFDcEMsSUFBSSxVQUFVLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFDbkIsa0JBQWtCO1lBQ2xCLElBQUksQ0FBQyxZQUFZLENBQUMsRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1NBQ25EO0lBQ0gsQ0FBQztJQUVELGlCQUFpQixDQUFDLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBTztRQUNyQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUM7SUFDaEQsQ0FBQzs7O1lBbkxGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsZUFBZTtnQkFDekIsUUFBUSxFQUFFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQTBCVDtnQkEyRkQsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07Z0JBQy9DLG1CQUFtQixFQUFFLEtBQUs7eUJBMUZ4Qjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBdUZEO2FBSUY7Ozs7b0JBR0UsS0FBSztxQkFFTCxLQUFLO3VCQVlMLEtBQUs7O0FBaURSLE1BQU0sT0FBTyxrQkFBa0I7OztZQUw5QixRQUFRLFNBQUM7Z0JBQ1IsWUFBWSxFQUFFLENBQUMsZ0JBQWdCLENBQUM7Z0JBQ2hDLE9BQU8sRUFBRSxDQUFDLGdCQUFnQixDQUFDO2dCQUMzQixPQUFPLEVBQUUsQ0FBQyxZQUFZLEVBQUUsWUFBWSxFQUFFLG1CQUFtQixDQUFDO2FBQzNEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IENoYW5nZURldGVjdGlvblN0cmF0ZWd5LCBDb21wb25lbnQsIElucHV0LCBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBDb2xvcldyYXAsIEVkaXRhYmxlSW5wdXRNb2R1bGUsIFN3YXRjaE1vZHVsZSwgaXNWYWxpZEhleCB9IGZyb20gJ25neC1jb2xvcic7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2NvbG9yLXR3aXR0ZXInLFxuICB0ZW1wbGF0ZTogYFxuICA8ZGl2IGNsYXNzPVwidHdpdHRlci1waWNrZXIge3sgdHJpYW5nbGUgfX0tdHJpYW5nbGUge3sgY2xhc3NOYW1lIH19XCIgW3N0eWxlLndpZHRoLnB4XT1cIndpZHRoXCI+XG4gICAgPGRpdiBjbGFzcz1cInRyaWFuZ2xlU2hhZG93XCI+PC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cInRyaWFuZ2xlXCI+PC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cInR3aXR0ZXItYm9keVwiPlxuICAgICAgPGRpdiBjbGFzcz1cInR3aXR0ZXItc3dhdGNoXCIgKm5nRm9yPVwibGV0IGNvbG9yIG9mIGNvbG9yc1wiPlxuICAgICAgICA8Y29sb3Itc3dhdGNoXG4gICAgICAgICAgW2NvbG9yXT1cImNvbG9yXCJcbiAgICAgICAgICBbc3R5bGVdPVwic3dhdGNoU3R5bGVcIlxuICAgICAgICAgIFtmb2N1c1N0eWxlXT1cImZvY3VzKGNvbG9yKVwiXG4gICAgICAgICAgKG9uQ2xpY2spPVwiaGFuZGxlQmxvY2tDaGFuZ2UoJGV2ZW50KVwiXG4gICAgICAgICAgKG9uSG92ZXIpPVwib25Td2F0Y2hIb3Zlci5lbWl0KCRldmVudClcIlxuICAgICAgICA+PC9jb2xvci1zd2F0Y2g+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXYgY2xhc3M9XCJ0d2l0dGVyLWhhc2hcIj5cbiAgICAgICAgPGRpdj4jPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXYgY2xhc3M9XCJ0d2l0dGVyLWlucHV0XCI+XG4gICAgICAgIDxjb2xvci1lZGl0YWJsZS1pbnB1dFxuICAgICAgICAgIFtzdHlsZV09XCJ7IGlucHV0OiBpbnB1dCB9XCJcbiAgICAgICAgICBbdmFsdWVdPVwiaGV4LnJlcGxhY2UoJyMnLCAnJylcIlxuICAgICAgICAgIChvbkNoYW5nZSk9XCJoYW5kbGVWYWx1ZUNoYW5nZSgkZXZlbnQpXCJcbiAgICAgICAgPjwvY29sb3ItZWRpdGFibGUtaW5wdXQ+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgPC9kaXY+XG4gIGAsXG4gIHN0eWxlczogW1xuICAgIGBcbiAgICAudHdpdHRlci1waWNrZXIge1xuICAgICAgYmFja2dyb3VuZDogcmdiKDI1NSwgMjU1LCAyNTUpO1xuICAgICAgYm9yZGVyOiAwcHggc29saWQgcmdiYSgwLCAwLCAwLCAwLjI1KTtcbiAgICAgIGJveC1zaGFkb3c6IHJnYmEoMCwgMCwgMCwgMC4yNSkgMHB4IDFweCA0cHg7XG4gICAgICBib3JkZXItcmFkaXVzOiA0cHg7XG4gICAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gICAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xuICAgIH1cbiAgICAudHJpYW5nbGVTaGFkb3cge1xuICAgICAgd2lkdGg6IDBweDtcbiAgICAgIGhlaWdodDogMHB4O1xuICAgICAgYm9yZGVyLXN0eWxlOiBzb2xpZDtcbiAgICAgIGJvcmRlci13aWR0aDogMHB4IDlweCAxMHB4O1xuICAgICAgYm9yZGVyLWNvbG9yOiB0cmFuc3BhcmVudCB0cmFuc3BhcmVudCByZ2JhKDAsIDAsIDAsIDAuMSk7XG4gICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgfVxuICAgIC50cmlhbmdsZSB7XG4gICAgICB3aWR0aDogMHB4O1xuICAgICAgaGVpZ2h0OiAwcHg7XG4gICAgICBib3JkZXItc3R5bGU6IHNvbGlkO1xuICAgICAgYm9yZGVyLXdpZHRoOiAwcHggOXB4IDEwcHg7XG4gICAgICBib3JkZXItY29sb3I6IHRyYW5zcGFyZW50IHRyYW5zcGFyZW50IHJnYigyNTUsIDI1NSwgMjU1KTtcbiAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICB9XG4gICAgLmhpZGUtdHJpYW5nbGUgPiAudHJpYW5nbGUge1xuICAgICAgZGlzcGxheTogbm9uZTtcbiAgICB9XG4gICAgLmhpZGUtdHJpYW5nbGUgPiAudHJpYW5nbGVTaGFkb3cge1xuICAgICAgZGlzcGxheTogbm9uZTtcbiAgICB9XG4gICAgLnRvcC1sZWZ0LXRyaWFuZ2xlID4gLnRyaWFuZ2xlIHtcbiAgICAgIHRvcDogLTEwcHg7XG4gICAgICBsZWZ0OiAxMnB4O1xuICAgIH1cbiAgICAudG9wLWxlZnQtdHJpYW5nbGUgPiAudHJpYW5nbGVTaGFkb3cge1xuICAgICAgdG9wOiAtMTFweDtcbiAgICAgIGxlZnQ6IDEycHg7XG4gICAgfVxuICAgIC50b3AtcmlnaHQtdHJpYW5nbGUgPiAudHJpYW5nbGUge1xuICAgICAgdG9wOiAtMTBweDtcbiAgICAgIHJpZ2h0OiAxMnB4O1xuICAgIH1cbiAgICAudG9wLXJpZ2h0LXRyaWFuZ2xlID4gLnRyaWFuZ2xlU2hhZG93IHtcbiAgICAgIHRvcDogLTExcHg7XG4gICAgICByaWdodDogMTJweDtcbiAgICB9XG4gICAgLnR3aXR0ZXItYm9keSB7XG4gICAgICBwYWRkaW5nOiAxNXB4IDlweCA5cHggMTVweDtcbiAgICB9XG4gICAgLnR3aXR0ZXItc3dhdGNoIHtcbiAgICAgIHdpZHRoOiAzMHB4O1xuICAgICAgaGVpZ2h0OiAzMHB4O1xuICAgICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuICAgICAgbWFyZ2luOiAwIDZweCAwIDA7XG4gICAgfVxuICAgIC50d2l0dGVyLWhhc2gge1xuICAgICAgYmFja2dyb3VuZDogcmdiKDI0MCwgMjQwLCAyNDApO1xuICAgICAgaGVpZ2h0OiAzMHB4O1xuICAgICAgd2lkdGg6IDMwcHg7XG4gICAgICBib3JkZXItcmFkaXVzOiA0cHggMHB4IDBweCA0cHg7XG4gICAgICBjb2xvcjogcmdiKDE1MiwgMTYxLCAxNjQpO1xuICAgICAgbWFyZ2luLWxlZnQ6IC0zcHg7XG4gICAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG5cbiAgICB9XG4gICAgLnR3aXR0ZXItaGFzaCA+IGRpdiB7XG4gICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gICAgICBoZWlnaHQ6IDMwcHg7XG4gICAgICB3aWR0aDogMzBweDtcbiAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgfVxuICAgIC50d2l0dGVyLWlucHV0IHtcbiAgICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbiAgICAgIG1hcmdpbi10b3A6IC02cHg7XG4gICAgICBmb250LXNpemU6IDEwcHg7XG4gICAgICBoZWlnaHQ6IDI3cHg7XG4gICAgICBwYWRkaW5nOiAwO1xuICAgICAgcG9zaXRpb246IHJlbGF0aXZlO1xuICAgICAgdG9wOiA2cHg7XG4gICAgICB2ZXJ0aWNhbC1hbGlnbjogdG9wO1xuICAgICAgd2lkdGg6IDEwOHB4O1xuICAgICAgbWFyZ2luLWxlZnQ6IC00cHg7XG4gICAgfVxuICBgLFxuICBdLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgcHJlc2VydmVXaGl0ZXNwYWNlczogZmFsc2UsXG59KVxuZXhwb3J0IGNsYXNzIFR3aXR0ZXJDb21wb25lbnQgZXh0ZW5kcyBDb2xvcldyYXAge1xuICAvKiogUGl4ZWwgdmFsdWUgZm9yIHBpY2tlciB3aWR0aCAqL1xuICBASW5wdXQoKSB3aWR0aDogc3RyaW5nIHwgbnVtYmVyID0gMjc2O1xuICAvKiogQ29sb3Igc3F1YXJlcyB0byBkaXNwbGF5ICovXG4gIEBJbnB1dCgpIGNvbG9ycyA9IFtcbiAgICAnI0ZGNjkwMCcsXG4gICAgJyNGQ0I5MDAnLFxuICAgICcjN0JEQ0I1JyxcbiAgICAnIzAwRDA4NCcsXG4gICAgJyM4RUQxRkMnLFxuICAgICcjMDY5M0UzJyxcbiAgICAnI0FCQjhDMycsXG4gICAgJyNFQjE0NEMnLFxuICAgICcjRjc4REE3JyxcbiAgICAnIzk5MDBFRicsXG4gIF07XG4gIEBJbnB1dCgpIHRyaWFuZ2xlOiAnaGlkZScgfCAndG9wLWxlZnQnIHwgJ3RvcC1yaWdodCcgfCAnYm90dG9tLXJpZ2h0JyA9ICd0b3AtbGVmdCc7XG5cbiAgc3dhdGNoU3R5bGU6IHtba2V5OiBzdHJpbmddOiBzdHJpbmd9ID0ge1xuICAgIHdpZHRoOiAnMzBweCcsXG4gICAgaGVpZ2h0OiAnMzBweCcsXG4gICAgYm9yZGVyUmFkaXVzOiAnNHB4JyxcbiAgICBmb250U2l6ZTogJzAnLFxuICB9O1xuICBpbnB1dDoge1trZXk6IHN0cmluZ106IHN0cmluZ30gPSB7XG4gICAgYm9yZGVyUmFkaXVzOiAnNHB4JyxcbiAgICBib3JkZXJCb3R0b21MZWZ0UmFkaXVzOiAnMCcsXG4gICAgYm9yZGVyVG9wTGVmdFJhZGl1czogJzAnLFxuICAgIGJvcmRlcjogJzFweCBzb2xpZCAjZTZlY2YwJyxcbiAgICBib3hTaXppbmc6ICdib3JkZXItYm94JyxcbiAgICBkaXNwbGF5OiAnaW5saW5lJyxcbiAgICBmb250U2l6ZTogJzE0cHgnLFxuICAgIGhlaWdodDogJzMwcHgnLFxuICAgIHBhZGRpbmc6ICcwJyxcbiAgICBwYWRkaW5nTGVmdDogJzZweCcsXG4gICAgd2lkdGg6ICcxMDAlJyxcbiAgICBjb2xvcjogJyM2NTc3ODYnLFxuICB9O1xuICBkaXNhYmxlQWxwaGEgPSB0cnVlO1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG4gIH1cblxuICBmb2N1cyhjb2xvcjogc3RyaW5nKSB7XG4gICAgcmV0dXJuIHsgYm94U2hhZG93OiBgMCAwIDRweCAke2NvbG9yfWAgfTtcbiAgfVxuXG4gIGhhbmRsZUJsb2NrQ2hhbmdlKHsgaGV4LCAkZXZlbnQgfTogYW55KSB7XG4gICAgaWYgKGlzVmFsaWRIZXgoaGV4KSkge1xuICAgICAgLy8gdGhpcy5oZXggPSBoZXg7XG4gICAgICB0aGlzLmhhbmRsZUNoYW5nZSh7IGhleCwgc291cmNlOiAnaGV4JyB9LCAkZXZlbnQpO1xuICAgIH1cbiAgfVxuXG4gIGhhbmRsZVZhbHVlQ2hhbmdlKHsgZGF0YSwgJGV2ZW50IH06IGFueSkge1xuICAgIHRoaXMuaGFuZGxlQmxvY2tDaGFuZ2UoeyBoZXg6IGRhdGEsICRldmVudCB9KTtcbiAgfVxufVxuXG5ATmdNb2R1bGUoe1xuICBkZWNsYXJhdGlvbnM6IFtUd2l0dGVyQ29tcG9uZW50XSxcbiAgZXhwb3J0czogW1R3aXR0ZXJDb21wb25lbnRdLFxuICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlLCBTd2F0Y2hNb2R1bGUsIEVkaXRhYmxlSW5wdXRNb2R1bGVdLFxufSlcbmV4cG9ydCBjbGFzcyBDb2xvclR3aXR0ZXJNb2R1bGUge31cbiJdfQ==