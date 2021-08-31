import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, NgModule, } from '@angular/core';
import { AlphaModule, CheckboardModule, ColorWrap, EditableInputModule, HueModule, SaturationModule, } from 'ngx-color';
import { ChromeFieldsComponent } from './chrome-fields.component';
export class ChromeComponent extends ColorWrap {
    constructor() {
        super();
        /** Remove alpha slider and options from picker */
        this.disableAlpha = false;
        this.circle = {
            width: '12px',
            height: '12px',
            borderRadius: '6px',
            boxShadow: 'rgb(255, 255, 255) 0px 0px 0px 1px inset',
            transform: 'translate(-6px, -8px)',
        };
        this.pointer = {
            width: '12px',
            height: '12px',
            borderRadius: '6px',
            transform: 'translate(-6px, -2px)',
            backgroundColor: 'rgb(248, 248, 248)',
            boxShadow: '0 1px 4px 0 rgba(0, 0, 0, 0.37)',
        };
    }
    afterValidChange() {
        const alpha = this.disableAlpha ? 1 : this.rgb.a;
        this.activeBackground = `rgba(${this.rgb.r}, ${this.rgb.g}, ${this.rgb.b}, ${alpha})`;
    }
    handleValueChange({ data, $event }) {
        this.handleChange(data, $event);
    }
}
ChromeComponent.decorators = [
    { type: Component, args: [{
                selector: 'color-chrome',
                template: `
  <div class="chrome-picker {{ className }}">
    <div class="saturation">
      <color-saturation
        [hsl]="hsl"
        [hsv]="hsv"
        [circle]="circle"
        (onChange)="handleValueChange($event)"
      ></color-saturation>
    </div>
    <div class="chrome-body">
      <div class="chrome-controls">
        <div class="chrome-color">
          <div class="chrome-swatch">
            <div class="chrome-active"
              [style.background]="activeBackground"
            ></div>
            <color-checkboard></color-checkboard>
          </div>
        </div>
        <div class="chrome-toggles">
          <div class="chrome-hue">
            <color-hue
              [radius]="2"
              [hsl]="hsl"
              [pointer]="pointer"
              (onChange)="handleValueChange($event)"
            ></color-hue>
          </div>
          <div class="chrome-alpha" *ngIf="!disableAlpha">
            <color-alpha
              [radius]="2" [rgb]="rgb" [hsl]="hsl"
              [pointer]="pointer" (onChange)="handleValueChange($event)"
            ></color-alpha>
          </div>
        </div>
      </div>
      <color-chrome-fields
        [rgb]="rgb" [hsl]="hsl" [hex]="hex"
        [disableAlpha]="disableAlpha"
        (onChange)="handleValueChange($event)"
      ></color-chrome-fields>
    </div>
  </div>
  `,
                changeDetection: ChangeDetectionStrategy.OnPush,
                preserveWhitespaces: false,
                styles: [`
      .chrome-picker {
        background: #fff;
        border-radius: 2px;
        box-shadow: 0 0 2px rgba(0, 0, 0, 0.3), 0 4px 8px rgba(0, 0, 0, 0.3);
        box-sizing: initial;
        width: 225px;
        font-family: 'Menlo';
      }
      .chrome-controls {
        display: flex;
      }
      .chrome-color {
        width: 42px;
      }
      .chrome-body {
        padding: 14px 14px 12px;
      }
      .chrome-active {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        border-radius: 20px;
        box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.1);
        z-index: 2;
      }
      .chrome-swatch {
        width: 28px;
        height: 28px;
        border-radius: 15px;
        position: relative;
        overflow: hidden;
      }
      .saturation {
        width: 100%;
        padding-bottom: 55%;
        position: relative;
        border-radius: 2px 2px 0 0;
        overflow: hidden;
      }
      .chrome-toggles {
        flex: 1;
      }
      .chrome-hue {
        height: 10px;
        position: relative;
        margin-bottom: 8px;
      }
      .chrome-alpha {
        height: 10px;
        position: relative;
      }
    `]
            },] }
];
ChromeComponent.ctorParameters = () => [];
ChromeComponent.propDecorators = {
    disableAlpha: [{ type: Input }]
};
export class ColorChromeModule {
}
ColorChromeModule.decorators = [
    { type: NgModule, args: [{
                declarations: [ChromeComponent, ChromeFieldsComponent],
                exports: [ChromeComponent, ChromeFieldsComponent],
                imports: [
                    CommonModule,
                    AlphaModule,
                    CheckboardModule,
                    EditableInputModule,
                    HueModule,
                    SaturationModule,
                ],
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hyb21lLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIuLi8uLi8uLi8uLi9zcmMvbGliL2NvbXBvbmVudHMvY2hyb21lLyIsInNvdXJjZXMiOlsiY2hyb21lLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDL0MsT0FBTyxFQUNMLHVCQUF1QixFQUN2QixTQUFTLEVBQ1QsS0FBSyxFQUNMLFFBQVEsR0FDVCxNQUFNLGVBQWUsQ0FBQztBQUV2QixPQUFPLEVBQ0wsV0FBVyxFQUNYLGdCQUFnQixFQUNoQixTQUFTLEVBQ1QsbUJBQW1CLEVBQ25CLFNBQVMsRUFDVCxnQkFBZ0IsR0FDakIsTUFBTSxXQUFXLENBQUM7QUFDbkIsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUE2R2xFLE1BQU0sT0FBTyxlQUFnQixTQUFRLFNBQVM7SUFvQjVDO1FBQ0UsS0FBSyxFQUFFLENBQUM7UUFwQlYsa0RBQWtEO1FBQ3pDLGlCQUFZLEdBQUcsS0FBSyxDQUFDO1FBQzlCLFdBQU0sR0FBMkI7WUFDL0IsS0FBSyxFQUFFLE1BQU07WUFDYixNQUFNLEVBQUUsTUFBTTtZQUNkLFlBQVksRUFBRSxLQUFLO1lBQ25CLFNBQVMsRUFBRSwwQ0FBMEM7WUFDckQsU0FBUyxFQUFFLHVCQUF1QjtTQUNuQyxDQUFDO1FBQ0YsWUFBTyxHQUEyQjtZQUNoQyxLQUFLLEVBQUUsTUFBTTtZQUNiLE1BQU0sRUFBRSxNQUFNO1lBQ2QsWUFBWSxFQUFFLEtBQUs7WUFDbkIsU0FBUyxFQUFFLHVCQUF1QjtZQUNsQyxlQUFlLEVBQUUsb0JBQW9CO1lBQ3JDLFNBQVMsRUFBRSxpQ0FBaUM7U0FDN0MsQ0FBQztJQUtGLENBQUM7SUFFRCxnQkFBZ0I7UUFDZCxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ2pELElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxRQUFRLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLEtBQUssR0FBRyxDQUFDO0lBQ3hGLENBQUM7SUFDRCxpQkFBaUIsQ0FBQyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUU7UUFDaEMsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDbEMsQ0FBQzs7O1lBeklGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsY0FBYztnQkFDeEIsUUFBUSxFQUFFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQTRDVDtnQkEwREQsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07Z0JBQy9DLG1CQUFtQixFQUFFLEtBQUs7eUJBekR4Qjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0tBc0RDO2FBSUo7Ozs7MkJBR0UsS0FBSzs7QUEyQ1IsTUFBTSxPQUFPLGlCQUFpQjs7O1lBWjdCLFFBQVEsU0FBQztnQkFDUixZQUFZLEVBQUUsQ0FBQyxlQUFlLEVBQUUscUJBQXFCLENBQUM7Z0JBQ3RELE9BQU8sRUFBRSxDQUFDLGVBQWUsRUFBRSxxQkFBcUIsQ0FBQztnQkFDakQsT0FBTyxFQUFFO29CQUNQLFlBQVk7b0JBQ1osV0FBVztvQkFDWCxnQkFBZ0I7b0JBQ2hCLG1CQUFtQjtvQkFDbkIsU0FBUztvQkFDVCxnQkFBZ0I7aUJBQ2pCO2FBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENvbXBvbmVudCxcbiAgSW5wdXQsXG4gIE5nTW9kdWxlLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHtcbiAgQWxwaGFNb2R1bGUsXG4gIENoZWNrYm9hcmRNb2R1bGUsXG4gIENvbG9yV3JhcCxcbiAgRWRpdGFibGVJbnB1dE1vZHVsZSxcbiAgSHVlTW9kdWxlLFxuICBTYXR1cmF0aW9uTW9kdWxlLFxufSBmcm9tICduZ3gtY29sb3InO1xuaW1wb3J0IHsgQ2hyb21lRmllbGRzQ29tcG9uZW50IH0gZnJvbSAnLi9jaHJvbWUtZmllbGRzLmNvbXBvbmVudCc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2NvbG9yLWNocm9tZScsXG4gIHRlbXBsYXRlOiBgXG4gIDxkaXYgY2xhc3M9XCJjaHJvbWUtcGlja2VyIHt7IGNsYXNzTmFtZSB9fVwiPlxuICAgIDxkaXYgY2xhc3M9XCJzYXR1cmF0aW9uXCI+XG4gICAgICA8Y29sb3Itc2F0dXJhdGlvblxuICAgICAgICBbaHNsXT1cImhzbFwiXG4gICAgICAgIFtoc3ZdPVwiaHN2XCJcbiAgICAgICAgW2NpcmNsZV09XCJjaXJjbGVcIlxuICAgICAgICAob25DaGFuZ2UpPVwiaGFuZGxlVmFsdWVDaGFuZ2UoJGV2ZW50KVwiXG4gICAgICA+PC9jb2xvci1zYXR1cmF0aW9uPlxuICAgIDwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJjaHJvbWUtYm9keVwiPlxuICAgICAgPGRpdiBjbGFzcz1cImNocm9tZS1jb250cm9sc1wiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwiY2hyb21lLWNvbG9yXCI+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cImNocm9tZS1zd2F0Y2hcIj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjaHJvbWUtYWN0aXZlXCJcbiAgICAgICAgICAgICAgW3N0eWxlLmJhY2tncm91bmRdPVwiYWN0aXZlQmFja2dyb3VuZFwiXG4gICAgICAgICAgICA+PC9kaXY+XG4gICAgICAgICAgICA8Y29sb3ItY2hlY2tib2FyZD48L2NvbG9yLWNoZWNrYm9hcmQ+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzPVwiY2hyb21lLXRvZ2dsZXNcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwiY2hyb21lLWh1ZVwiPlxuICAgICAgICAgICAgPGNvbG9yLWh1ZVxuICAgICAgICAgICAgICBbcmFkaXVzXT1cIjJcIlxuICAgICAgICAgICAgICBbaHNsXT1cImhzbFwiXG4gICAgICAgICAgICAgIFtwb2ludGVyXT1cInBvaW50ZXJcIlxuICAgICAgICAgICAgICAob25DaGFuZ2UpPVwiaGFuZGxlVmFsdWVDaGFuZ2UoJGV2ZW50KVwiXG4gICAgICAgICAgICA+PC9jb2xvci1odWU+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cImNocm9tZS1hbHBoYVwiICpuZ0lmPVwiIWRpc2FibGVBbHBoYVwiPlxuICAgICAgICAgICAgPGNvbG9yLWFscGhhXG4gICAgICAgICAgICAgIFtyYWRpdXNdPVwiMlwiIFtyZ2JdPVwicmdiXCIgW2hzbF09XCJoc2xcIlxuICAgICAgICAgICAgICBbcG9pbnRlcl09XCJwb2ludGVyXCIgKG9uQ2hhbmdlKT1cImhhbmRsZVZhbHVlQ2hhbmdlKCRldmVudClcIlxuICAgICAgICAgICAgPjwvY29sb3ItYWxwaGE+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgICA8Y29sb3ItY2hyb21lLWZpZWxkc1xuICAgICAgICBbcmdiXT1cInJnYlwiIFtoc2xdPVwiaHNsXCIgW2hleF09XCJoZXhcIlxuICAgICAgICBbZGlzYWJsZUFscGhhXT1cImRpc2FibGVBbHBoYVwiXG4gICAgICAgIChvbkNoYW5nZSk9XCJoYW5kbGVWYWx1ZUNoYW5nZSgkZXZlbnQpXCJcbiAgICAgID48L2NvbG9yLWNocm9tZS1maWVsZHM+XG4gICAgPC9kaXY+XG4gIDwvZGl2PlxuICBgLFxuICBzdHlsZXM6IFtcbiAgICBgXG4gICAgICAuY2hyb21lLXBpY2tlciB7XG4gICAgICAgIGJhY2tncm91bmQ6ICNmZmY7XG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDJweDtcbiAgICAgICAgYm94LXNoYWRvdzogMCAwIDJweCByZ2JhKDAsIDAsIDAsIDAuMyksIDAgNHB4IDhweCByZ2JhKDAsIDAsIDAsIDAuMyk7XG4gICAgICAgIGJveC1zaXppbmc6IGluaXRpYWw7XG4gICAgICAgIHdpZHRoOiAyMjVweDtcbiAgICAgICAgZm9udC1mYW1pbHk6ICdNZW5sbyc7XG4gICAgICB9XG4gICAgICAuY2hyb21lLWNvbnRyb2xzIHtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgIH1cbiAgICAgIC5jaHJvbWUtY29sb3Ige1xuICAgICAgICB3aWR0aDogNDJweDtcbiAgICAgIH1cbiAgICAgIC5jaHJvbWUtYm9keSB7XG4gICAgICAgIHBhZGRpbmc6IDE0cHggMTRweCAxMnB4O1xuICAgICAgfVxuICAgICAgLmNocm9tZS1hY3RpdmUge1xuICAgICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgICAgIHRvcDogMDtcbiAgICAgICAgYm90dG9tOiAwO1xuICAgICAgICBsZWZ0OiAwO1xuICAgICAgICByaWdodDogMDtcbiAgICAgICAgYm9yZGVyLXJhZGl1czogMjBweDtcbiAgICAgICAgYm94LXNoYWRvdzogaW5zZXQgMCAwIDAgMXB4IHJnYmEoMCwgMCwgMCwgMC4xKTtcbiAgICAgICAgei1pbmRleDogMjtcbiAgICAgIH1cbiAgICAgIC5jaHJvbWUtc3dhdGNoIHtcbiAgICAgICAgd2lkdGg6IDI4cHg7XG4gICAgICAgIGhlaWdodDogMjhweDtcbiAgICAgICAgYm9yZGVyLXJhZGl1czogMTVweDtcbiAgICAgICAgcG9zaXRpb246IHJlbGF0aXZlO1xuICAgICAgICBvdmVyZmxvdzogaGlkZGVuO1xuICAgICAgfVxuICAgICAgLnNhdHVyYXRpb24ge1xuICAgICAgICB3aWR0aDogMTAwJTtcbiAgICAgICAgcGFkZGluZy1ib3R0b206IDU1JTtcbiAgICAgICAgcG9zaXRpb246IHJlbGF0aXZlO1xuICAgICAgICBib3JkZXItcmFkaXVzOiAycHggMnB4IDAgMDtcbiAgICAgICAgb3ZlcmZsb3c6IGhpZGRlbjtcbiAgICAgIH1cbiAgICAgIC5jaHJvbWUtdG9nZ2xlcyB7XG4gICAgICAgIGZsZXg6IDE7XG4gICAgICB9XG4gICAgICAuY2hyb21lLWh1ZSB7XG4gICAgICAgIGhlaWdodDogMTBweDtcbiAgICAgICAgcG9zaXRpb246IHJlbGF0aXZlO1xuICAgICAgICBtYXJnaW4tYm90dG9tOiA4cHg7XG4gICAgICB9XG4gICAgICAuY2hyb21lLWFscGhhIHtcbiAgICAgICAgaGVpZ2h0OiAxMHB4O1xuICAgICAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gICAgICB9XG4gICAgYCxcbiAgXSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIHByZXNlcnZlV2hpdGVzcGFjZXM6IGZhbHNlLFxufSlcbmV4cG9ydCBjbGFzcyBDaHJvbWVDb21wb25lbnQgZXh0ZW5kcyBDb2xvcldyYXAge1xuICAvKiogUmVtb3ZlIGFscGhhIHNsaWRlciBhbmQgb3B0aW9ucyBmcm9tIHBpY2tlciAqL1xuICBASW5wdXQoKSBkaXNhYmxlQWxwaGEgPSBmYWxzZTtcbiAgY2lyY2xlOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge1xuICAgIHdpZHRoOiAnMTJweCcsXG4gICAgaGVpZ2h0OiAnMTJweCcsXG4gICAgYm9yZGVyUmFkaXVzOiAnNnB4JyxcbiAgICBib3hTaGFkb3c6ICdyZ2IoMjU1LCAyNTUsIDI1NSkgMHB4IDBweCAwcHggMXB4IGluc2V0JyxcbiAgICB0cmFuc2Zvcm06ICd0cmFuc2xhdGUoLTZweCwgLThweCknLFxuICB9O1xuICBwb2ludGVyOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge1xuICAgIHdpZHRoOiAnMTJweCcsXG4gICAgaGVpZ2h0OiAnMTJweCcsXG4gICAgYm9yZGVyUmFkaXVzOiAnNnB4JyxcbiAgICB0cmFuc2Zvcm06ICd0cmFuc2xhdGUoLTZweCwgLTJweCknLFxuICAgIGJhY2tncm91bmRDb2xvcjogJ3JnYigyNDgsIDI0OCwgMjQ4KScsXG4gICAgYm94U2hhZG93OiAnMCAxcHggNHB4IDAgcmdiYSgwLCAwLCAwLCAwLjM3KScsXG4gIH07XG4gIGFjdGl2ZUJhY2tncm91bmQhOiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcbiAgfVxuXG4gIGFmdGVyVmFsaWRDaGFuZ2UoKSB7XG4gICAgY29uc3QgYWxwaGEgPSB0aGlzLmRpc2FibGVBbHBoYSA/IDEgOiB0aGlzLnJnYi5hO1xuICAgIHRoaXMuYWN0aXZlQmFja2dyb3VuZCA9IGByZ2JhKCR7dGhpcy5yZ2Iucn0sICR7dGhpcy5yZ2IuZ30sICR7dGhpcy5yZ2IuYn0sICR7YWxwaGF9KWA7XG4gIH1cbiAgaGFuZGxlVmFsdWVDaGFuZ2UoeyBkYXRhLCAkZXZlbnQgfSkge1xuICAgIHRoaXMuaGFuZGxlQ2hhbmdlKGRhdGEsICRldmVudCk7XG4gIH1cbn1cblxuQE5nTW9kdWxlKHtcbiAgZGVjbGFyYXRpb25zOiBbQ2hyb21lQ29tcG9uZW50LCBDaHJvbWVGaWVsZHNDb21wb25lbnRdLFxuICBleHBvcnRzOiBbQ2hyb21lQ29tcG9uZW50LCBDaHJvbWVGaWVsZHNDb21wb25lbnRdLFxuICBpbXBvcnRzOiBbXG4gICAgQ29tbW9uTW9kdWxlLFxuICAgIEFscGhhTW9kdWxlLFxuICAgIENoZWNrYm9hcmRNb2R1bGUsXG4gICAgRWRpdGFibGVJbnB1dE1vZHVsZSxcbiAgICBIdWVNb2R1bGUsXG4gICAgU2F0dXJhdGlvbk1vZHVsZSxcbiAgXSxcbn0pXG5leHBvcnQgY2xhc3MgQ29sb3JDaHJvbWVNb2R1bGUge31cbiJdfQ==