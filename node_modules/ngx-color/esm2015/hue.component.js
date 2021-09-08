import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, NgModule, Output, } from '@angular/core';
import { CoordinatesModule } from './coordinates.directive';
export class HueComponent {
    constructor() {
        this.hidePointer = false;
        this.direction = 'horizontal';
        this.onChange = new EventEmitter();
        this.left = '0px';
        this.top = '';
    }
    ngOnChanges() {
        if (this.direction === 'horizontal') {
            this.left = `${this.hsl.h * 100 / 360}%`;
        }
        else {
            this.top = `${-(this.hsl.h * 100 / 360) + 100}%`;
        }
    }
    handleChange({ top, left, containerHeight, containerWidth, $event }) {
        let data;
        if (this.direction === 'vertical') {
            let h;
            if (top < 0) {
                h = 359;
            }
            else if (top > containerHeight) {
                h = 0;
            }
            else {
                const percent = -(top * 100 / containerHeight) + 100;
                h = 360 * percent / 100;
            }
            if (this.hsl.h !== h) {
                data = {
                    h,
                    s: this.hsl.s,
                    l: this.hsl.l,
                    a: this.hsl.a,
                    source: 'rgb',
                };
            }
        }
        else {
            let h;
            if (left < 0) {
                h = 0;
            }
            else if (left > containerWidth) {
                h = 359;
            }
            else {
                const percent = left * 100 / containerWidth;
                h = 360 * percent / 100;
            }
            if (this.hsl.h !== h) {
                data = {
                    h,
                    s: this.hsl.s,
                    l: this.hsl.l,
                    a: this.hsl.a,
                    source: 'rgb',
                };
            }
        }
        if (!data) {
            return;
        }
        this.onChange.emit({ data, $event });
    }
}
HueComponent.decorators = [
    { type: Component, args: [{
                selector: 'color-hue',
                template: `
  <div class="color-hue color-hue-{{direction}}" [style.border-radius.px]="radius" [style.box-shadow]="shadow">
    <div ngx-color-coordinates (coordinatesChange)="handleChange($event)" class="color-hue-container">
      <div class="color-hue-pointer" [style.left]="left" [style.top]="top" *ngIf="!hidePointer">
        <div class="color-hue-slider" [ngStyle]="pointer"></div>
      </div>
    </div>
  </div>
  `,
                preserveWhitespaces: false,
                changeDetection: ChangeDetectionStrategy.OnPush,
                styles: [`
    .color-hue {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
    }
    .color-hue-container {
      margin: 0 2px;
      position: relative;
      height: 100%;
    }
    .color-hue-pointer {
      position: absolute;
    }
    .color-hue-slider {
      margin-top: 1px;
      width: 4px;
      border-radius: 1px;
      height: 8px;
      box-shadow: 0 0 2px rgba(0, 0, 0, .6);
      background: #fff;
      transform: translateX(-2px);
    }
    .color-hue-horizontal {
      background: linear-gradient(to right, #f00 0%, #ff0 17%, #0f0
        33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%);
    }
    .color-hue-vertical {
      background: linear-gradient(to top, #f00 0%, #ff0 17%, #0f0 33%,
        #0ff 50%, #00f 67%, #f0f 83%, #f00 100%);
    }
  `]
            },] }
];
HueComponent.propDecorators = {
    hsl: [{ type: Input }],
    pointer: [{ type: Input }],
    radius: [{ type: Input }],
    shadow: [{ type: Input }],
    hidePointer: [{ type: Input }],
    direction: [{ type: Input }],
    onChange: [{ type: Output }]
};
export class HueModule {
}
HueModule.decorators = [
    { type: NgModule, args: [{
                declarations: [HueComponent],
                exports: [HueComponent],
                imports: [CommonModule, CoordinatesModule],
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHVlLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIuLi8uLi8uLi9zcmMvbGliL2NvbW1vbi8iLCJzb3VyY2VzIjpbImh1ZS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFDTCx1QkFBdUIsRUFDdkIsU0FBUyxFQUNULFlBQVksRUFDWixLQUFLLEVBQ0wsUUFBUSxFQUVSLE1BQU0sR0FDUCxNQUFNLGVBQWUsQ0FBQztBQUV2QixPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQztBQXFENUQsTUFBTSxPQUFPLFlBQVk7SUFsRHpCO1FBdURXLGdCQUFXLEdBQUcsS0FBSyxDQUFDO1FBQ3BCLGNBQVMsR0FBOEIsWUFBWSxDQUFDO1FBQ25ELGFBQVEsR0FBRyxJQUFJLFlBQVksRUFBdUMsQ0FBQztRQUM3RSxTQUFJLEdBQUcsS0FBSyxDQUFDO1FBQ2IsUUFBRyxHQUFHLEVBQUUsQ0FBQztJQTJEWCxDQUFDO0lBekRDLFdBQVc7UUFDVCxJQUFJLElBQUksQ0FBQyxTQUFTLEtBQUssWUFBWSxFQUFFO1lBQ25DLElBQUksQ0FBQyxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUM7U0FDMUM7YUFBTTtZQUNMLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO1NBQ2xEO0lBQ0gsQ0FBQztJQUNELFlBQVksQ0FBQyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsZUFBZSxFQUFFLGNBQWMsRUFBRSxNQUFNLEVBQUU7UUFDakUsSUFBSSxJQUE0QixDQUFDO1FBQ2pDLElBQUksSUFBSSxDQUFDLFNBQVMsS0FBSyxVQUFVLEVBQUU7WUFDakMsSUFBSSxDQUFTLENBQUM7WUFDZCxJQUFJLEdBQUcsR0FBRyxDQUFDLEVBQUU7Z0JBQ1gsQ0FBQyxHQUFHLEdBQUcsQ0FBQzthQUNUO2lCQUFNLElBQUksR0FBRyxHQUFHLGVBQWUsRUFBRTtnQkFDaEMsQ0FBQyxHQUFHLENBQUMsQ0FBQzthQUNQO2lCQUFNO2dCQUNMLE1BQU0sT0FBTyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsR0FBRyxHQUFHLGVBQWUsQ0FBQyxHQUFHLEdBQUcsQ0FBQztnQkFDckQsQ0FBQyxHQUFHLEdBQUcsR0FBRyxPQUFPLEdBQUcsR0FBRyxDQUFDO2FBQ3pCO1lBRUQsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUU7Z0JBQ3BCLElBQUksR0FBRztvQkFDTCxDQUFDO29CQUNELENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBQ2IsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFDYixDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQUNiLE1BQU0sRUFBRSxLQUFLO2lCQUNkLENBQUM7YUFDSDtTQUNGO2FBQU07WUFDTCxJQUFJLENBQVMsQ0FBQztZQUNkLElBQUksSUFBSSxHQUFHLENBQUMsRUFBRTtnQkFDWixDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQ1A7aUJBQU0sSUFBSSxJQUFJLEdBQUcsY0FBYyxFQUFFO2dCQUNoQyxDQUFDLEdBQUcsR0FBRyxDQUFDO2FBQ1Q7aUJBQU07Z0JBQ0wsTUFBTSxPQUFPLEdBQUcsSUFBSSxHQUFHLEdBQUcsR0FBRyxjQUFjLENBQUM7Z0JBQzVDLENBQUMsR0FBRyxHQUFHLEdBQUcsT0FBTyxHQUFHLEdBQUcsQ0FBQzthQUN6QjtZQUVELElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxFQUFFO2dCQUNwQixJQUFJLEdBQUc7b0JBQ0wsQ0FBQztvQkFDRCxDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQUNiLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBQ2IsQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFDYixNQUFNLEVBQUUsS0FBSztpQkFDZCxDQUFDO2FBQ0g7U0FDRjtRQUVELElBQUksQ0FBQyxJQUFJLEVBQUU7WUFDVCxPQUFPO1NBQ1I7UUFFRCxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDO0lBQ3ZDLENBQUM7OztZQXJIRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLFdBQVc7Z0JBQ3JCLFFBQVEsRUFBRTs7Ozs7Ozs7R0FRVDtnQkFxQ0QsbUJBQW1CLEVBQUUsS0FBSztnQkFDMUIsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07eUJBcEM3Qzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBaUNEO2FBSUY7OztrQkFFRSxLQUFLO3NCQUNMLEtBQUs7cUJBQ0wsS0FBSztxQkFDTCxLQUFLOzBCQUNMLEtBQUs7d0JBQ0wsS0FBSzt1QkFDTCxNQUFNOztBQW9FVCxNQUFNLE9BQU8sU0FBUzs7O1lBTHJCLFFBQVEsU0FBQztnQkFDUixZQUFZLEVBQUUsQ0FBQyxZQUFZLENBQUM7Z0JBQzVCLE9BQU8sRUFBRSxDQUFDLFlBQVksQ0FBQztnQkFDdkIsT0FBTyxFQUFFLENBQUMsWUFBWSxFQUFFLGlCQUFpQixDQUFDO2FBQzNDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7XG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDb21wb25lbnQsXG4gIEV2ZW50RW1pdHRlcixcbiAgSW5wdXQsXG4gIE5nTW9kdWxlLFxuICBPbkNoYW5nZXMsXG4gIE91dHB1dCxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IENvb3JkaW5hdGVzTW9kdWxlIH0gZnJvbSAnLi9jb29yZGluYXRlcy5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgSFNMQSwgSFNMQXNvdXJjZSB9IGZyb20gJy4vaGVscGVycy9jb2xvci5pbnRlcmZhY2VzJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnY29sb3ItaHVlJyxcbiAgdGVtcGxhdGU6IGBcbiAgPGRpdiBjbGFzcz1cImNvbG9yLWh1ZSBjb2xvci1odWUte3tkaXJlY3Rpb259fVwiIFtzdHlsZS5ib3JkZXItcmFkaXVzLnB4XT1cInJhZGl1c1wiIFtzdHlsZS5ib3gtc2hhZG93XT1cInNoYWRvd1wiPlxuICAgIDxkaXYgbmd4LWNvbG9yLWNvb3JkaW5hdGVzIChjb29yZGluYXRlc0NoYW5nZSk9XCJoYW5kbGVDaGFuZ2UoJGV2ZW50KVwiIGNsYXNzPVwiY29sb3ItaHVlLWNvbnRhaW5lclwiPlxuICAgICAgPGRpdiBjbGFzcz1cImNvbG9yLWh1ZS1wb2ludGVyXCIgW3N0eWxlLmxlZnRdPVwibGVmdFwiIFtzdHlsZS50b3BdPVwidG9wXCIgKm5nSWY9XCIhaGlkZVBvaW50ZXJcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cImNvbG9yLWh1ZS1zbGlkZXJcIiBbbmdTdHlsZV09XCJwb2ludGVyXCI+PC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgPC9kaXY+XG4gIGAsXG4gIHN0eWxlczogW1xuICAgIGBcbiAgICAuY29sb3ItaHVlIHtcbiAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICAgIHRvcDogMDtcbiAgICAgIGJvdHRvbTogMDtcbiAgICAgIGxlZnQ6IDA7XG4gICAgICByaWdodDogMDtcbiAgICB9XG4gICAgLmNvbG9yLWh1ZS1jb250YWluZXIge1xuICAgICAgbWFyZ2luOiAwIDJweDtcbiAgICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgICAgIGhlaWdodDogMTAwJTtcbiAgICB9XG4gICAgLmNvbG9yLWh1ZS1wb2ludGVyIHtcbiAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICB9XG4gICAgLmNvbG9yLWh1ZS1zbGlkZXIge1xuICAgICAgbWFyZ2luLXRvcDogMXB4O1xuICAgICAgd2lkdGg6IDRweDtcbiAgICAgIGJvcmRlci1yYWRpdXM6IDFweDtcbiAgICAgIGhlaWdodDogOHB4O1xuICAgICAgYm94LXNoYWRvdzogMCAwIDJweCByZ2JhKDAsIDAsIDAsIC42KTtcbiAgICAgIGJhY2tncm91bmQ6ICNmZmY7XG4gICAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoLTJweCk7XG4gICAgfVxuICAgIC5jb2xvci1odWUtaG9yaXpvbnRhbCB7XG4gICAgICBiYWNrZ3JvdW5kOiBsaW5lYXItZ3JhZGllbnQodG8gcmlnaHQsICNmMDAgMCUsICNmZjAgMTclLCAjMGYwXG4gICAgICAgIDMzJSwgIzBmZiA1MCUsICMwMGYgNjclLCAjZjBmIDgzJSwgI2YwMCAxMDAlKTtcbiAgICB9XG4gICAgLmNvbG9yLWh1ZS12ZXJ0aWNhbCB7XG4gICAgICBiYWNrZ3JvdW5kOiBsaW5lYXItZ3JhZGllbnQodG8gdG9wLCAjZjAwIDAlLCAjZmYwIDE3JSwgIzBmMCAzMyUsXG4gICAgICAgICMwZmYgNTAlLCAjMDBmIDY3JSwgI2YwZiA4MyUsICNmMDAgMTAwJSk7XG4gICAgfVxuICBgLFxuICBdLFxuICBwcmVzZXJ2ZVdoaXRlc3BhY2VzOiBmYWxzZSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG59KVxuZXhwb3J0IGNsYXNzIEh1ZUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uQ2hhbmdlcyB7XG4gIEBJbnB1dCgpIGhzbCE6IEhTTEE7XG4gIEBJbnB1dCgpIHBvaW50ZXIhOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+O1xuICBASW5wdXQoKSByYWRpdXMhOiBudW1iZXI7XG4gIEBJbnB1dCgpIHNoYWRvdyE6IHN0cmluZztcbiAgQElucHV0KCkgaGlkZVBvaW50ZXIgPSBmYWxzZTtcbiAgQElucHV0KCkgZGlyZWN0aW9uOiAnaG9yaXpvbnRhbCcgfCAndmVydGljYWwnID0gJ2hvcml6b250YWwnO1xuICBAT3V0cHV0KCkgb25DaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPHsgZGF0YTogSFNMQXNvdXJjZTsgJGV2ZW50OiBFdmVudCB9PigpO1xuICBsZWZ0ID0gJzBweCc7XG4gIHRvcCA9ICcnO1xuXG4gIG5nT25DaGFuZ2VzKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLmRpcmVjdGlvbiA9PT0gJ2hvcml6b250YWwnKSB7XG4gICAgICB0aGlzLmxlZnQgPSBgJHt0aGlzLmhzbC5oICogMTAwIC8gMzYwfSVgO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnRvcCA9IGAkey0odGhpcy5oc2wuaCAqIDEwMCAvIDM2MCkgKyAxMDB9JWA7XG4gICAgfVxuICB9XG4gIGhhbmRsZUNoYW5nZSh7IHRvcCwgbGVmdCwgY29udGFpbmVySGVpZ2h0LCBjb250YWluZXJXaWR0aCwgJGV2ZW50IH0pOiB2b2lkIHtcbiAgICBsZXQgZGF0YTogSFNMQXNvdXJjZSB8IHVuZGVmaW5lZDtcbiAgICBpZiAodGhpcy5kaXJlY3Rpb24gPT09ICd2ZXJ0aWNhbCcpIHtcbiAgICAgIGxldCBoOiBudW1iZXI7XG4gICAgICBpZiAodG9wIDwgMCkge1xuICAgICAgICBoID0gMzU5O1xuICAgICAgfSBlbHNlIGlmICh0b3AgPiBjb250YWluZXJIZWlnaHQpIHtcbiAgICAgICAgaCA9IDA7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBwZXJjZW50ID0gLSh0b3AgKiAxMDAgLyBjb250YWluZXJIZWlnaHQpICsgMTAwO1xuICAgICAgICBoID0gMzYwICogcGVyY2VudCAvIDEwMDtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuaHNsLmggIT09IGgpIHtcbiAgICAgICAgZGF0YSA9IHtcbiAgICAgICAgICBoLFxuICAgICAgICAgIHM6IHRoaXMuaHNsLnMsXG4gICAgICAgICAgbDogdGhpcy5oc2wubCxcbiAgICAgICAgICBhOiB0aGlzLmhzbC5hLFxuICAgICAgICAgIHNvdXJjZTogJ3JnYicsXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGxldCBoOiBudW1iZXI7XG4gICAgICBpZiAobGVmdCA8IDApIHtcbiAgICAgICAgaCA9IDA7XG4gICAgICB9IGVsc2UgaWYgKGxlZnQgPiBjb250YWluZXJXaWR0aCkge1xuICAgICAgICBoID0gMzU5O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgcGVyY2VudCA9IGxlZnQgKiAxMDAgLyBjb250YWluZXJXaWR0aDtcbiAgICAgICAgaCA9IDM2MCAqIHBlcmNlbnQgLyAxMDA7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLmhzbC5oICE9PSBoKSB7XG4gICAgICAgIGRhdGEgPSB7XG4gICAgICAgICAgaCxcbiAgICAgICAgICBzOiB0aGlzLmhzbC5zLFxuICAgICAgICAgIGw6IHRoaXMuaHNsLmwsXG4gICAgICAgICAgYTogdGhpcy5oc2wuYSxcbiAgICAgICAgICBzb3VyY2U6ICdyZ2InLFxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICghZGF0YSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMub25DaGFuZ2UuZW1pdCh7IGRhdGEsICRldmVudCB9KTtcbiAgfVxufVxuXG5ATmdNb2R1bGUoe1xuICBkZWNsYXJhdGlvbnM6IFtIdWVDb21wb25lbnRdLFxuICBleHBvcnRzOiBbSHVlQ29tcG9uZW50XSxcbiAgaW1wb3J0czogW0NvbW1vbk1vZHVsZSwgQ29vcmRpbmF0ZXNNb2R1bGVdLFxufSlcbmV4cG9ydCBjbGFzcyBIdWVNb2R1bGUge31cbiJdfQ==