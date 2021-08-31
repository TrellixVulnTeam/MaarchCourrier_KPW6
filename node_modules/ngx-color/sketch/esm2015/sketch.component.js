import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, NgModule, } from '@angular/core';
import { AlphaModule, CheckboardModule, ColorWrap, EditableInputModule, HueModule, SaturationModule, SwatchModule, isValidHex, } from 'ngx-color';
import { SketchFieldsComponent } from './sketch-fields.component';
import { SketchPresetColorsComponent } from './sketch-preset-colors.component';
export class SketchComponent extends ColorWrap {
    constructor() {
        super();
        /** Remove alpha slider and options from picker */
        this.disableAlpha = false;
        /** Hex strings for default colors at bottom of picker */
        this.presetColors = [
            '#D0021B',
            '#F5A623',
            '#F8E71C',
            '#8B572A',
            '#7ED321',
            '#417505',
            '#BD10E0',
            '#9013FE',
            '#4A90E2',
            '#50E3C2',
            '#B8E986',
            '#000000',
            '#4A4A4A',
            '#9B9B9B',
            '#FFFFFF',
        ];
        /** Width of picker */
        this.width = 200;
    }
    afterValidChange() {
        const alpha = this.disableAlpha ? 1 : this.rgb.a;
        this.activeBackground = `rgba(${this.rgb.r}, ${this.rgb.g}, ${this.rgb.b}, ${alpha})`;
    }
    handleValueChange({ data, $event }) {
        this.handleChange(data, $event);
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
SketchComponent.decorators = [
    { type: Component, args: [{
                selector: 'color-sketch',
                template: `
  <div class="sketch-picker {{ className }}" [style.width]="width">
    <div class="sketch-saturation">
      <color-saturation [hsl]="hsl" [hsv]="hsv"
        (onChange)="handleValueChange($event)"
      >
      </color-saturation>
    </div>
    <div class="sketch-controls">
      <div class="sketch-sliders">
        <div class="sketch-hue">
          <color-hue [hsl]="hsl"
            (onChange)="handleValueChange($event)"
          ></color-hue>
        </div>
        <div class="sketch-alpha" *ngIf="disableAlpha === false">
          <color-alpha
            [radius]="2" [rgb]="rgb" [hsl]="hsl"
            (onChange)="handleValueChange($event)"
          ></color-alpha>
        </div>
      </div>
      <div class="sketch-color">
        <color-checkboard></color-checkboard>
        <div class="sketch-active" [style.background]="activeBackground"></div>
      </div>
    </div>
    <div class="sketch-fields-container">
      <color-sketch-fields
        [rgb]="rgb" [hsl]="hsl" [hex]="hex"
        [disableAlpha]="disableAlpha"
        (onChange)="handleValueChange($event)"
      ></color-sketch-fields>
    </div>
    <div class="sketch-swatches-container" *ngIf="presetColors && presetColors.length">
      <color-sketch-preset-colors
        [colors]="presetColors"
        (onClick)="handleBlockChange($event)"
        (onSwatchHover)="onSwatchHover.emit($event)"
      ></color-sketch-preset-colors>
    </div>
  </div>
  `,
                changeDetection: ChangeDetectionStrategy.OnPush,
                preserveWhitespaces: false,
                styles: [`
    .sketch-picker {
      padding: 10px 10px 3px;
      box-sizing: initial;
      background: #fff;
      border-radius: 4px;
      box-shadow: 0 0 0 1px rgba(0,0,0,.15), 0 8px 16px rgba(0,0,0,.15);
    }
    .sketch-saturation {
      width: 100%;
      padding-bottom: 75%;
      position: relative;
      overflow: hidden;
    }
    .sketch-fields-container {
      display: block;
    }
    .sketch-swatches-container {
      display: block;
    }
    .sketch-controls {
      display: flex;
    }
    .sketch-sliders {
      padding: 4px 0px;
      -webkit-box-flex: 1;
      flex: 1 1 0%;
    }
    .sketch-hue {
      position: relative;
      height: 10px;
      overflow: hidden;
    }
    .sketch-alpha {
      position: relative;
      height: 10px;
      margin-top: 4px;
      overflow: hidden;
    }
    .sketch-color {
      width: 24px;
      height: 24px;
      position: relative;
      margin-top: 4px;
      margin-left: 4px;
      border-radius: 3px;
    }
    .sketch-active {
      position: absolute;
      top: 0px;
      right: 0px;
      bottom: 0px;
      left: 0px;
      border-radius: 2px;
      box-shadow: rgba(0, 0, 0, 0.15) 0px 0px 0px 1px inset, rgba(0, 0, 0, 0.25) 0px 0px 4px inset;
    }
    :host-context([dir=rtl]) .sketch-color {
      margin-right: 4px;
      margin-left: 0;
    }
  `]
            },] }
];
SketchComponent.ctorParameters = () => [];
SketchComponent.propDecorators = {
    disableAlpha: [{ type: Input }],
    presetColors: [{ type: Input }],
    width: [{ type: Input }]
};
export class ColorSketchModule {
}
ColorSketchModule.decorators = [
    { type: NgModule, args: [{
                declarations: [
                    SketchComponent,
                    SketchFieldsComponent,
                    SketchPresetColorsComponent,
                ],
                exports: [
                    SketchComponent,
                    SketchFieldsComponent,
                    SketchPresetColorsComponent,
                ],
                imports: [
                    CommonModule,
                    AlphaModule,
                    CheckboardModule,
                    EditableInputModule,
                    HueModule,
                    SaturationModule,
                    SwatchModule,
                ],
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2tldGNoLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIuLi8uLi8uLi8uLi9zcmMvbGliL2NvbXBvbmVudHMvc2tldGNoLyIsInNvdXJjZXMiOlsic2tldGNoLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDL0MsT0FBTyxFQUNMLHVCQUF1QixFQUN2QixTQUFTLEVBQ1QsS0FBSyxFQUNMLFFBQVEsR0FDVCxNQUFNLGVBQWUsQ0FBQztBQUV2QixPQUFPLEVBQ0wsV0FBVyxFQUNYLGdCQUFnQixFQUNoQixTQUFTLEVBQ1QsbUJBQW1CLEVBQ25CLFNBQVMsRUFDVCxnQkFBZ0IsRUFDaEIsWUFBWSxFQUNaLFVBQVUsR0FDWCxNQUFNLFdBQVcsQ0FBQztBQUNuQixPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUNsRSxPQUFPLEVBQUUsMkJBQTJCLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQztBQWlIL0UsTUFBTSxPQUFPLGVBQWdCLFNBQVEsU0FBUztJQXdCNUM7UUFDRSxLQUFLLEVBQUUsQ0FBQztRQXhCVixrREFBa0Q7UUFDekMsaUJBQVksR0FBRyxLQUFLLENBQUM7UUFDOUIseURBQXlEO1FBQ2hELGlCQUFZLEdBQUc7WUFDdEIsU0FBUztZQUNULFNBQVM7WUFDVCxTQUFTO1lBQ1QsU0FBUztZQUNULFNBQVM7WUFDVCxTQUFTO1lBQ1QsU0FBUztZQUNULFNBQVM7WUFDVCxTQUFTO1lBQ1QsU0FBUztZQUNULFNBQVM7WUFDVCxTQUFTO1lBQ1QsU0FBUztZQUNULFNBQVM7WUFDVCxTQUFTO1NBQ1YsQ0FBQztRQUNGLHNCQUFzQjtRQUNiLFVBQUssR0FBRyxHQUFHLENBQUM7SUFJckIsQ0FBQztJQUNELGdCQUFnQjtRQUNkLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDakQsSUFBSSxDQUFDLGdCQUFnQixHQUFHLFFBQVEsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssS0FBSyxHQUFHLENBQUM7SUFDeEYsQ0FBQztJQUNELGlCQUFpQixDQUFDLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRTtRQUNoQyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztJQUNsQyxDQUFDO0lBQ0QsaUJBQWlCLENBQUMsRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFO1FBQy9CLElBQUksVUFBVSxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQ25CLGtCQUFrQjtZQUNsQixJQUFJLENBQUMsWUFBWSxDQUNmO2dCQUNFLEdBQUc7Z0JBQ0gsTUFBTSxFQUFFLEtBQUs7YUFDZCxFQUNELE1BQU0sQ0FDUCxDQUFDO1NBQ0g7SUFDSCxDQUFDOzs7WUE1SkYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxjQUFjO2dCQUN4QixRQUFRLEVBQUU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQTBDVDtnQkFnRUQsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07Z0JBQy9DLG1CQUFtQixFQUFFLEtBQUs7eUJBL0R4Qjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBNEREO2FBSUY7Ozs7MkJBR0UsS0FBSzsyQkFFTCxLQUFLO29CQWtCTCxLQUFLOztBQStDUixNQUFNLE9BQU8saUJBQWlCOzs7WUFyQjdCLFFBQVEsU0FBQztnQkFDUixZQUFZLEVBQUU7b0JBQ1osZUFBZTtvQkFDZixxQkFBcUI7b0JBQ3JCLDJCQUEyQjtpQkFDNUI7Z0JBQ0QsT0FBTyxFQUFFO29CQUNQLGVBQWU7b0JBQ2YscUJBQXFCO29CQUNyQiwyQkFBMkI7aUJBQzVCO2dCQUNELE9BQU8sRUFBRTtvQkFDUCxZQUFZO29CQUNaLFdBQVc7b0JBQ1gsZ0JBQWdCO29CQUNoQixtQkFBbUI7b0JBQ25CLFNBQVM7b0JBQ1QsZ0JBQWdCO29CQUNoQixZQUFZO2lCQUNiO2FBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENvbXBvbmVudCxcbiAgSW5wdXQsXG4gIE5nTW9kdWxlLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHtcbiAgQWxwaGFNb2R1bGUsXG4gIENoZWNrYm9hcmRNb2R1bGUsXG4gIENvbG9yV3JhcCxcbiAgRWRpdGFibGVJbnB1dE1vZHVsZSxcbiAgSHVlTW9kdWxlLFxuICBTYXR1cmF0aW9uTW9kdWxlLFxuICBTd2F0Y2hNb2R1bGUsXG4gIGlzVmFsaWRIZXgsXG59IGZyb20gJ25neC1jb2xvcic7XG5pbXBvcnQgeyBTa2V0Y2hGaWVsZHNDb21wb25lbnQgfSBmcm9tICcuL3NrZXRjaC1maWVsZHMuY29tcG9uZW50JztcbmltcG9ydCB7IFNrZXRjaFByZXNldENvbG9yc0NvbXBvbmVudCB9IGZyb20gJy4vc2tldGNoLXByZXNldC1jb2xvcnMuY29tcG9uZW50JztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnY29sb3Itc2tldGNoJyxcbiAgdGVtcGxhdGU6IGBcbiAgPGRpdiBjbGFzcz1cInNrZXRjaC1waWNrZXIge3sgY2xhc3NOYW1lIH19XCIgW3N0eWxlLndpZHRoXT1cIndpZHRoXCI+XG4gICAgPGRpdiBjbGFzcz1cInNrZXRjaC1zYXR1cmF0aW9uXCI+XG4gICAgICA8Y29sb3Itc2F0dXJhdGlvbiBbaHNsXT1cImhzbFwiIFtoc3ZdPVwiaHN2XCJcbiAgICAgICAgKG9uQ2hhbmdlKT1cImhhbmRsZVZhbHVlQ2hhbmdlKCRldmVudClcIlxuICAgICAgPlxuICAgICAgPC9jb2xvci1zYXR1cmF0aW9uPlxuICAgIDwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJza2V0Y2gtY29udHJvbHNcIj5cbiAgICAgIDxkaXYgY2xhc3M9XCJza2V0Y2gtc2xpZGVyc1wiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwic2tldGNoLWh1ZVwiPlxuICAgICAgICAgIDxjb2xvci1odWUgW2hzbF09XCJoc2xcIlxuICAgICAgICAgICAgKG9uQ2hhbmdlKT1cImhhbmRsZVZhbHVlQ2hhbmdlKCRldmVudClcIlxuICAgICAgICAgID48L2NvbG9yLWh1ZT5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJza2V0Y2gtYWxwaGFcIiAqbmdJZj1cImRpc2FibGVBbHBoYSA9PT0gZmFsc2VcIj5cbiAgICAgICAgICA8Y29sb3ItYWxwaGFcbiAgICAgICAgICAgIFtyYWRpdXNdPVwiMlwiIFtyZ2JdPVwicmdiXCIgW2hzbF09XCJoc2xcIlxuICAgICAgICAgICAgKG9uQ2hhbmdlKT1cImhhbmRsZVZhbHVlQ2hhbmdlKCRldmVudClcIlxuICAgICAgICAgID48L2NvbG9yLWFscGhhPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdiBjbGFzcz1cInNrZXRjaC1jb2xvclwiPlxuICAgICAgICA8Y29sb3ItY2hlY2tib2FyZD48L2NvbG9yLWNoZWNrYm9hcmQ+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJza2V0Y2gtYWN0aXZlXCIgW3N0eWxlLmJhY2tncm91bmRdPVwiYWN0aXZlQmFja2dyb3VuZFwiPjwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cInNrZXRjaC1maWVsZHMtY29udGFpbmVyXCI+XG4gICAgICA8Y29sb3Itc2tldGNoLWZpZWxkc1xuICAgICAgICBbcmdiXT1cInJnYlwiIFtoc2xdPVwiaHNsXCIgW2hleF09XCJoZXhcIlxuICAgICAgICBbZGlzYWJsZUFscGhhXT1cImRpc2FibGVBbHBoYVwiXG4gICAgICAgIChvbkNoYW5nZSk9XCJoYW5kbGVWYWx1ZUNoYW5nZSgkZXZlbnQpXCJcbiAgICAgID48L2NvbG9yLXNrZXRjaC1maWVsZHM+XG4gICAgPC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cInNrZXRjaC1zd2F0Y2hlcy1jb250YWluZXJcIiAqbmdJZj1cInByZXNldENvbG9ycyAmJiBwcmVzZXRDb2xvcnMubGVuZ3RoXCI+XG4gICAgICA8Y29sb3Itc2tldGNoLXByZXNldC1jb2xvcnNcbiAgICAgICAgW2NvbG9yc109XCJwcmVzZXRDb2xvcnNcIlxuICAgICAgICAob25DbGljayk9XCJoYW5kbGVCbG9ja0NoYW5nZSgkZXZlbnQpXCJcbiAgICAgICAgKG9uU3dhdGNoSG92ZXIpPVwib25Td2F0Y2hIb3Zlci5lbWl0KCRldmVudClcIlxuICAgICAgPjwvY29sb3Itc2tldGNoLXByZXNldC1jb2xvcnM+XG4gICAgPC9kaXY+XG4gIDwvZGl2PlxuICBgLFxuICBzdHlsZXM6IFtcbiAgICBgXG4gICAgLnNrZXRjaC1waWNrZXIge1xuICAgICAgcGFkZGluZzogMTBweCAxMHB4IDNweDtcbiAgICAgIGJveC1zaXppbmc6IGluaXRpYWw7XG4gICAgICBiYWNrZ3JvdW5kOiAjZmZmO1xuICAgICAgYm9yZGVyLXJhZGl1czogNHB4O1xuICAgICAgYm94LXNoYWRvdzogMCAwIDAgMXB4IHJnYmEoMCwwLDAsLjE1KSwgMCA4cHggMTZweCByZ2JhKDAsMCwwLC4xNSk7XG4gICAgfVxuICAgIC5za2V0Y2gtc2F0dXJhdGlvbiB7XG4gICAgICB3aWR0aDogMTAwJTtcbiAgICAgIHBhZGRpbmctYm90dG9tOiA3NSU7XG4gICAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gICAgICBvdmVyZmxvdzogaGlkZGVuO1xuICAgIH1cbiAgICAuc2tldGNoLWZpZWxkcy1jb250YWluZXIge1xuICAgICAgZGlzcGxheTogYmxvY2s7XG4gICAgfVxuICAgIC5za2V0Y2gtc3dhdGNoZXMtY29udGFpbmVyIHtcbiAgICAgIGRpc3BsYXk6IGJsb2NrO1xuICAgIH1cbiAgICAuc2tldGNoLWNvbnRyb2xzIHtcbiAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgfVxuICAgIC5za2V0Y2gtc2xpZGVycyB7XG4gICAgICBwYWRkaW5nOiA0cHggMHB4O1xuICAgICAgLXdlYmtpdC1ib3gtZmxleDogMTtcbiAgICAgIGZsZXg6IDEgMSAwJTtcbiAgICB9XG4gICAgLnNrZXRjaC1odWUge1xuICAgICAgcG9zaXRpb246IHJlbGF0aXZlO1xuICAgICAgaGVpZ2h0OiAxMHB4O1xuICAgICAgb3ZlcmZsb3c6IGhpZGRlbjtcbiAgICB9XG4gICAgLnNrZXRjaC1hbHBoYSB7XG4gICAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gICAgICBoZWlnaHQ6IDEwcHg7XG4gICAgICBtYXJnaW4tdG9wOiA0cHg7XG4gICAgICBvdmVyZmxvdzogaGlkZGVuO1xuICAgIH1cbiAgICAuc2tldGNoLWNvbG9yIHtcbiAgICAgIHdpZHRoOiAyNHB4O1xuICAgICAgaGVpZ2h0OiAyNHB4O1xuICAgICAgcG9zaXRpb246IHJlbGF0aXZlO1xuICAgICAgbWFyZ2luLXRvcDogNHB4O1xuICAgICAgbWFyZ2luLWxlZnQ6IDRweDtcbiAgICAgIGJvcmRlci1yYWRpdXM6IDNweDtcbiAgICB9XG4gICAgLnNrZXRjaC1hY3RpdmUge1xuICAgICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgICAgdG9wOiAwcHg7XG4gICAgICByaWdodDogMHB4O1xuICAgICAgYm90dG9tOiAwcHg7XG4gICAgICBsZWZ0OiAwcHg7XG4gICAgICBib3JkZXItcmFkaXVzOiAycHg7XG4gICAgICBib3gtc2hhZG93OiByZ2JhKDAsIDAsIDAsIDAuMTUpIDBweCAwcHggMHB4IDFweCBpbnNldCwgcmdiYSgwLCAwLCAwLCAwLjI1KSAwcHggMHB4IDRweCBpbnNldDtcbiAgICB9XG4gICAgOmhvc3QtY29udGV4dChbZGlyPXJ0bF0pIC5za2V0Y2gtY29sb3Ige1xuICAgICAgbWFyZ2luLXJpZ2h0OiA0cHg7XG4gICAgICBtYXJnaW4tbGVmdDogMDtcbiAgICB9XG4gIGAsXG4gIF0sXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBwcmVzZXJ2ZVdoaXRlc3BhY2VzOiBmYWxzZSxcbn0pXG5leHBvcnQgY2xhc3MgU2tldGNoQ29tcG9uZW50IGV4dGVuZHMgQ29sb3JXcmFwIHtcbiAgLyoqIFJlbW92ZSBhbHBoYSBzbGlkZXIgYW5kIG9wdGlvbnMgZnJvbSBwaWNrZXIgKi9cbiAgQElucHV0KCkgZGlzYWJsZUFscGhhID0gZmFsc2U7XG4gIC8qKiBIZXggc3RyaW5ncyBmb3IgZGVmYXVsdCBjb2xvcnMgYXQgYm90dG9tIG9mIHBpY2tlciAqL1xuICBASW5wdXQoKSBwcmVzZXRDb2xvcnMgPSBbXG4gICAgJyNEMDAyMUInLFxuICAgICcjRjVBNjIzJyxcbiAgICAnI0Y4RTcxQycsXG4gICAgJyM4QjU3MkEnLFxuICAgICcjN0VEMzIxJyxcbiAgICAnIzQxNzUwNScsXG4gICAgJyNCRDEwRTAnLFxuICAgICcjOTAxM0ZFJyxcbiAgICAnIzRBOTBFMicsXG4gICAgJyM1MEUzQzInLFxuICAgICcjQjhFOTg2JyxcbiAgICAnIzAwMDAwMCcsXG4gICAgJyM0QTRBNEEnLFxuICAgICcjOUI5QjlCJyxcbiAgICAnI0ZGRkZGRicsXG4gIF07XG4gIC8qKiBXaWR0aCBvZiBwaWNrZXIgKi9cbiAgQElucHV0KCkgd2lkdGggPSAyMDA7XG4gIGFjdGl2ZUJhY2tncm91bmQhOiBzdHJpbmc7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG4gIH1cbiAgYWZ0ZXJWYWxpZENoYW5nZSgpIHtcbiAgICBjb25zdCBhbHBoYSA9IHRoaXMuZGlzYWJsZUFscGhhID8gMSA6IHRoaXMucmdiLmE7XG4gICAgdGhpcy5hY3RpdmVCYWNrZ3JvdW5kID0gYHJnYmEoJHt0aGlzLnJnYi5yfSwgJHt0aGlzLnJnYi5nfSwgJHt0aGlzLnJnYi5ifSwgJHthbHBoYX0pYDtcbiAgfVxuICBoYW5kbGVWYWx1ZUNoYW5nZSh7IGRhdGEsICRldmVudCB9KSB7XG4gICAgdGhpcy5oYW5kbGVDaGFuZ2UoZGF0YSwgJGV2ZW50KTtcbiAgfVxuICBoYW5kbGVCbG9ja0NoYW5nZSh7IGhleCwgJGV2ZW50IH0pIHtcbiAgICBpZiAoaXNWYWxpZEhleChoZXgpKSB7XG4gICAgICAvLyB0aGlzLmhleCA9IGhleDtcbiAgICAgIHRoaXMuaGFuZGxlQ2hhbmdlKFxuICAgICAgICB7XG4gICAgICAgICAgaGV4LFxuICAgICAgICAgIHNvdXJjZTogJ2hleCcsXG4gICAgICAgIH0sXG4gICAgICAgICRldmVudCxcbiAgICAgICk7XG4gICAgfVxuICB9XG59XG5cbkBOZ01vZHVsZSh7XG4gIGRlY2xhcmF0aW9uczogW1xuICAgIFNrZXRjaENvbXBvbmVudCxcbiAgICBTa2V0Y2hGaWVsZHNDb21wb25lbnQsXG4gICAgU2tldGNoUHJlc2V0Q29sb3JzQ29tcG9uZW50LFxuICBdLFxuICBleHBvcnRzOiBbXG4gICAgU2tldGNoQ29tcG9uZW50LFxuICAgIFNrZXRjaEZpZWxkc0NvbXBvbmVudCxcbiAgICBTa2V0Y2hQcmVzZXRDb2xvcnNDb21wb25lbnQsXG4gIF0sXG4gIGltcG9ydHM6IFtcbiAgICBDb21tb25Nb2R1bGUsXG4gICAgQWxwaGFNb2R1bGUsXG4gICAgQ2hlY2tib2FyZE1vZHVsZSxcbiAgICBFZGl0YWJsZUlucHV0TW9kdWxlLFxuICAgIEh1ZU1vZHVsZSxcbiAgICBTYXR1cmF0aW9uTW9kdWxlLFxuICAgIFN3YXRjaE1vZHVsZSxcbiAgXSxcbn0pXG5leHBvcnQgY2xhc3MgQ29sb3JTa2V0Y2hNb2R1bGUge31cbiJdfQ==