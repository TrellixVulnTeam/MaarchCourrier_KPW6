import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, NgModule, Output, } from '@angular/core';
import { CheckboardModule } from './checkboard.component';
import { CoordinatesModule } from './coordinates.directive';
export class AlphaComponent {
    constructor() {
        this.direction = 'horizontal';
        this.onChange = new EventEmitter();
    }
    ngOnChanges() {
        if (this.direction === 'vertical') {
            this.pointerLeft = 0;
            this.pointerTop = this.rgb.a * 100;
            this.gradient = {
                background: `linear-gradient(to bottom, rgba(${this.rgb.r},${this.rgb.g},${this.rgb.b}, 0) 0%,
          rgba(${this.rgb.r},${this.rgb.g},${this.rgb.b}, 1) 100%)`,
            };
        }
        else {
            this.gradient = {
                background: `linear-gradient(to right, rgba(${this.rgb.r},${this.rgb.g},${this.rgb.b}, 0) 0%,
          rgba(${this.rgb.r},${this.rgb.g},${this.rgb.b}, 1) 100%)`,
            };
            this.pointerLeft = this.rgb.a * 100;
        }
    }
    handleChange({ top, left, containerHeight, containerWidth, $event }) {
        let data;
        if (this.direction === 'vertical') {
            let a;
            if (top < 0) {
                a = 0;
            }
            else if (top > containerHeight) {
                a = 1;
            }
            else {
                a = Math.round(top * 100 / containerHeight) / 100;
            }
            if (this.hsl.a !== a) {
                data = {
                    h: this.hsl.h,
                    s: this.hsl.s,
                    l: this.hsl.l,
                    a,
                    source: 'rgb',
                };
            }
        }
        else {
            let a;
            if (left < 0) {
                a = 0;
            }
            else if (left > containerWidth) {
                a = 1;
            }
            else {
                a = Math.round(left * 100 / containerWidth) / 100;
            }
            if (this.hsl.a !== a) {
                data = {
                    h: this.hsl.h,
                    s: this.hsl.s,
                    l: this.hsl.l,
                    a,
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
AlphaComponent.decorators = [
    { type: Component, args: [{
                selector: 'color-alpha',
                template: `
  <div class="alpha" [style.border-radius]="radius">
    <div class="alpha-checkboard">
      <color-checkboard></color-checkboard>
    </div>
    <div class="alpha-gradient" [ngStyle]="gradient" [style.box-shadow]="shadow" [style.border-radius]="radius"></div>
    <div ngx-color-coordinates (coordinatesChange)="handleChange($event)" class="alpha-container color-alpha-{{direction}}">
      <div class="alpha-pointer" [style.left.%]="pointerLeft" [style.top.%]="pointerTop">
        <div class="alpha-slider" [ngStyle]="pointer"></div>
      </div>
    </div>
  </div>
  `,
                changeDetection: ChangeDetectionStrategy.OnPush,
                preserveWhitespaces: false,
                styles: [`
    .alpha {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
    }
    .alpha-checkboard {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      overflow: hidden;
    }
    .alpha-gradient {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
    }
    .alpha-container {
      position: relative;
      height: 100%;
      margin: 0 3px;
    }
    .alpha-pointer {
      position: absolute;
    }
    .alpha-slider {
      width: 4px;
      border-radius: 1px;
      height: 8px;
      box-shadow: 0 0 2px rgba(0, 0, 0, .6);
      background: #fff;
      margin-top: 1px;
      transform: translateX(-2px);
    },
  `]
            },] }
];
AlphaComponent.propDecorators = {
    hsl: [{ type: Input }],
    rgb: [{ type: Input }],
    pointer: [{ type: Input }],
    shadow: [{ type: Input }],
    radius: [{ type: Input }],
    direction: [{ type: Input }],
    onChange: [{ type: Output }]
};
export class AlphaModule {
}
AlphaModule.decorators = [
    { type: NgModule, args: [{
                declarations: [AlphaComponent],
                exports: [AlphaComponent],
                imports: [CommonModule, CheckboardModule, CoordinatesModule],
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWxwaGEuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Ii4uLy4uLy4uL3NyYy9saWIvY29tbW9uLyIsInNvdXJjZXMiOlsiYWxwaGEuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQ0wsdUJBQXVCLEVBQ3ZCLFNBQVMsRUFDVCxZQUFZLEVBQ1osS0FBSyxFQUNMLFFBQVEsRUFFUixNQUFNLEdBQ1AsTUFBTSxlQUFlLENBQUM7QUFFdkIsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFDMUQsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFpRTVELE1BQU0sT0FBTyxjQUFjO0lBN0QzQjtRQW1FVyxjQUFTLEdBQThCLFlBQVksQ0FBQztRQUNuRCxhQUFRLEdBQUcsSUFBSSxZQUFZLEVBQU8sQ0FBQztJQXlFL0MsQ0FBQztJQXBFQyxXQUFXO1FBQ1QsSUFBSSxJQUFJLENBQUMsU0FBUyxLQUFLLFVBQVUsRUFBRTtZQUNqQyxJQUFJLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQztZQUNyQixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQztZQUNuQyxJQUFJLENBQUMsUUFBUSxHQUFHO2dCQUNkLFVBQVUsRUFBRSxtQ0FBbUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQ3ZELElBQUksQ0FBQyxHQUFHLENBQUMsQ0FDWCxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztpQkFDTCxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsWUFBWTthQUM1RCxDQUFDO1NBQ0g7YUFBTTtZQUNMLElBQUksQ0FBQyxRQUFRLEdBQUc7Z0JB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Ozs7WUFMdkIsUUFBUSxTQUFDO2dCQUNSLFlBQVksRUFBRSxDQUFDLGNBQWMsQ0FBQztnQkFDOUIsT0FBTyxFQUFFLENBQUMsY0FBYyxDQUFDO2dCQUN6QixPQUFPLEVBQUUsQ0FBQyxZQUFZLEVBQUUsZ0JBQWdCLEVBQUUsaUJBQWlCLENBQUM7YUFDN0QiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENvbXBvbmVudCxcbiAgRXZlbnRFbWl0dGVyLFxuICBJbnB1dCxcbiAgTmdNb2R1bGUsXG4gIE9uQ2hhbmdlcyxcbiAgT3V0cHV0LFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgQ2hlY2tib2FyZE1vZHVsZSB9IGZyb20gJy4vY2hlY2tib2FyZC5jb21wb25lbnQnO1xuaW1wb3J0IHsgQ29vcmRpbmF0ZXNNb2R1bGUgfSBmcm9tICcuL2Nvb3JkaW5hdGVzLmRpcmVjdGl2ZSc7XG5pbXBvcnQgeyBIU0xBLCBSR0JBIH0gZnJvbSAnLi9oZWxwZXJzL2NvbG9yLmludGVyZmFjZXMnO1xuXG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2NvbG9yLWFscGhhJyxcbiAgdGVtcGxhdGU6IGBcbiAgPGRpdiBjbGFzcz1cImFscGhhXCIgW3N0eWxlLmJvcmRlci1yYWRpdXNdPVwicmFkaXVzXCI+XG4gICAgPGRpdiBjbGFzcz1cImFscGhhLWNoZWNrYm9hcmRcIj5cbiAgICAgIDxjb2xvci1jaGVja2JvYXJkPjwvY29sb3ItY2hlY2tib2FyZD5cbiAgICA8L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwiYWxwaGEtZ3JhZGllbnRcIiBbbmdTdHlsZV09XCJncmFkaWVudFwiIFtzdHlsZS5ib3gtc2hhZG93XT1cInNoYWRvd1wiIFtzdHlsZS5ib3JkZXItcmFkaXVzXT1cInJhZGl1c1wiPjwvZGl2PlxuICAgIDxkaXYgbmd4LWNvbG9yLWNvb3JkaW5hdGVzIChjb29yZGluYXRlc0NoYW5nZSk9XCJoYW5kbGVDaGFuZ2UoJGV2ZW50KVwiIGNsYXNzPVwiYWxwaGEtY29udGFpbmVyIGNvbG9yLWFscGhhLXt7ZGlyZWN0aW9ufX1cIj5cbiAgICAgIDxkaXYgY2xhc3M9XCJhbHBoYS1wb2ludGVyXCIgW3N0eWxlLmxlZnQuJV09XCJwb2ludGVyTGVmdFwiIFtzdHlsZS50b3AuJV09XCJwb2ludGVyVG9wXCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJhbHBoYS1zbGlkZXJcIiBbbmdTdHlsZV09XCJwb2ludGVyXCI+PC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgPC9kaXY+XG4gIGAsXG4gIHN0eWxlczogW1xuICAgIGBcbiAgICAuYWxwaGEge1xuICAgICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgICAgdG9wOiAwO1xuICAgICAgYm90dG9tOiAwO1xuICAgICAgbGVmdDogMDtcbiAgICAgIHJpZ2h0OiAwO1xuICAgIH1cbiAgICAuYWxwaGEtY2hlY2tib2FyZCB7XG4gICAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgICB0b3A6IDA7XG4gICAgICBib3R0b206IDA7XG4gICAgICBsZWZ0OiAwO1xuICAgICAgcmlnaHQ6IDA7XG4gICAgICBvdmVyZmxvdzogaGlkZGVuO1xuICAgIH1cbiAgICAuYWxwaGEtZ3JhZGllbnQge1xuICAgICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgICAgdG9wOiAwO1xuICAgICAgYm90dG9tOiAwO1xuICAgICAgbGVmdDogMDtcbiAgICAgIHJpZ2h0OiAwO1xuICAgIH1cbiAgICAuYWxwaGEtY29udGFpbmVyIHtcbiAgICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgICAgIGhlaWdodDogMTAwJTtcbiAgICAgIG1hcmdpbjogMCAzcHg7XG4gICAgfVxuICAgIC5hbHBoYS1wb2ludGVyIHtcbiAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICB9XG4gICAgLmFscGhhLXNsaWRlciB7XG4gICAgICB3aWR0aDogNHB4O1xuICAgICAgYm9yZGVyLXJhZGl1czogMXB4O1xuICAgICAgaGVpZ2h0OiA4cHg7XG4gICAgICBib3gtc2hhZG93OiAwIDAgMnB4IHJnYmEoMCwgMCwgMCwgLjYpO1xuICAgICAgYmFja2dyb3VuZDogI2ZmZjtcbiAgICAgIG1hcmdpbi10b3A6IDFweDtcbiAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWCgtMnB4KTtcbiAgICB9LFxuICBgLFxuICBdLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgcHJlc2VydmVXaGl0ZXNwYWNlczogZmFsc2UsXG59KVxuZXhwb3J0IGNsYXNzIEFscGhhQ29tcG9uZW50IGltcGxlbWVudHMgT25DaGFuZ2VzIHtcbiAgQElucHV0KCkgaHNsITogSFNMQTtcbiAgQElucHV0KCkgcmdiITogUkdCQTtcbiAgQElucHV0KCkgcG9pbnRlciE6IFJlY29yZDxzdHJpbmcsIHN0cmluZz47XG4gIEBJbnB1dCgpIHNoYWRvdyE6IHN0cmluZztcbiAgQElucHV0KCkgcmFkaXVzITogbnVtYmVyIHwgc3RyaW5nO1xuICBASW5wdXQoKSBkaXJlY3Rpb246ICdob3Jpem9udGFsJyB8ICd2ZXJ0aWNhbCcgPSAnaG9yaXpvbnRhbCc7XG4gIEBPdXRwdXQoKSBvbkNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICBncmFkaWVudCE6IFJlY29yZDxzdHJpbmcsIHN0cmluZz47XG4gIHBvaW50ZXJMZWZ0ITogbnVtYmVyO1xuICBwb2ludGVyVG9wITogbnVtYmVyO1xuXG4gIG5nT25DaGFuZ2VzKCkge1xuICAgIGlmICh0aGlzLmRpcmVjdGlvbiA9PT0gJ3ZlcnRpY2FsJykge1xuICAgICAgdGhpcy5wb2ludGVyTGVmdCA9IDA7XG4gICAgICB0aGlzLnBvaW50ZXJUb3AgPSB0aGlzLnJnYi5hICogMTAwO1xuICAgICAgdGhpcy5ncmFkaWVudCA9IHtcbiAgICAgICAgYmFja2dyb3VuZDogYGxpbmVhci1ncmFkaWVudCh0byBib3R0b20sIHJnYmEoJHt0aGlzLnJnYi5yfSwke1xuICAgICAgICAgIHRoaXMucmdiLmdcbiAgICAgICAgfSwke3RoaXMucmdiLmJ9LCAwKSAwJSxcbiAgICAgICAgICByZ2JhKCR7dGhpcy5yZ2Iucn0sJHt0aGlzLnJnYi5nfSwke3RoaXMucmdiLmJ9LCAxKSAxMDAlKWAsXG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmdyYWRpZW50ID0ge1xuICAgICAgICBiYWNrZ3JvdW5kOiBgbGluZWFyLWdyYWRpZW50KHRvIHJpZ2h0LCByZ2JhKCR7dGhpcy5yZ2Iucn0sJHtcbiAgICAgICAgICB0aGlzLnJnYi5nXG4gICAgICAgIH0sJHt0aGlzLnJnYi5ifSwgMCkgMCUsXG4gICAgICAgICAgcmdiYSgke3RoaXMucmdiLnJ9LCR7dGhpcy5yZ2IuZ30sJHt0aGlzLnJnYi5ifSwgMSkgMTAwJSlgLFxuICAgICAgfTtcbiAgICAgIHRoaXMucG9pbnRlckxlZnQgPSB0aGlzLnJnYi5hICogMTAwO1xuICAgIH1cbiAgfVxuICBoYW5kbGVDaGFuZ2UoeyB0b3AsIGxlZnQsIGNvbnRhaW5lckhlaWdodCwgY29udGFpbmVyV2lkdGgsICRldmVudCB9KTogdm9pZCB7XG4gICAgbGV0IGRhdGE6IGFueTtcbiAgICBpZiAodGhpcy5kaXJlY3Rpb24gPT09ICd2ZXJ0aWNhbCcpIHtcbiAgICAgIGxldCBhOiBudW1iZXI7XG4gICAgICBpZiAodG9wIDwgMCkge1xuICAgICAgICBhID0gMDtcbiAgICAgIH0gZWxzZSBpZiAodG9wID4gY29udGFpbmVySGVpZ2h0KSB7XG4gICAgICAgIGEgPSAxO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYSA9IE1hdGgucm91bmQodG9wICogMTAwIC8gY29udGFpbmVySGVpZ2h0KSAvIDEwMDtcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuaHNsLmEgIT09IGEpIHtcbiAgICAgICAgZGF0YSA9IHtcbiAgICAgICAgICBoOiB0aGlzLmhzbC5oLFxuICAgICAgICAgIHM6IHRoaXMuaHNsLnMsXG4gICAgICAgICAgbDogdGhpcy5oc2wubCxcbiAgICAgICAgICBhLFxuICAgICAgICAgIHNvdXJjZTogJ3JnYicsXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGxldCBhOiBudW1iZXI7XG4gICAgICBpZiAobGVmdCA8IDApIHtcbiAgICAgICAgYSA9IDA7XG4gICAgICB9IGVsc2UgaWYgKGxlZnQgPiBjb250YWluZXJXaWR0aCkge1xuICAgICAgICBhID0gMTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGEgPSBNYXRoLnJvdW5kKGxlZnQgKiAxMDAgLyBjb250YWluZXJXaWR0aCkgLyAxMDA7XG4gICAgICB9XG5cbiAgICAgIGlmICh0aGlzLmhzbC5hICE9PSBhKSB7XG4gICAgICAgIGRhdGEgPSB7XG4gICAgICAgICAgaDogdGhpcy5oc2wuaCxcbiAgICAgICAgICBzOiB0aGlzLmhzbC5zLFxuICAgICAgICAgIGw6IHRoaXMuaHNsLmwsXG4gICAgICAgICAgYSxcbiAgICAgICAgICBzb3VyY2U6ICdyZ2InLFxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICghZGF0YSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMub25DaGFuZ2UuZW1pdCh7IGRhdGEsICRldmVudCB9KTtcbiAgfVxufVxuXG5ATmdNb2R1bGUoe1xuICBkZWNsYXJhdGlvbnM6IFtBbHBoYUNvbXBvbmVudF0sXG4gIGV4cG9ydHM6IFtBbHBoYUNvbXBvbmVudF0sXG4gIGltcG9ydHM6IFtDb21tb25Nb2R1bGUsIENoZWNrYm9hcmRNb2R1bGUsIENvb3JkaW5hdGVzTW9kdWxlXSxcbn0pXG5leHBvcnQgY2xhc3MgQWxwaGFNb2R1bGUge31cbiJdfQ==