import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, NgModule, Output, } from '@angular/core';
import { CoordinatesModule } from './coordinates.directive';
export class SaturationComponent {
    constructor() {
        this.onChange = new EventEmitter();
    }
    ngOnChanges() {
        this.background = `hsl(${this.hsl.h}, 100%, 50%)`;
        this.pointerTop = -(this.hsv.v * 100) + 1 + 100 + '%';
        this.pointerLeft = this.hsv.s * 100 + '%';
    }
    handleChange({ top, left, containerHeight, containerWidth, $event }) {
        if (left < 0) {
            left = 0;
        }
        else if (left > containerWidth) {
            left = containerWidth;
        }
        else if (top < 0) {
            top = 0;
        }
        else if (top > containerHeight) {
            top = containerHeight;
        }
        const saturation = left / containerWidth;
        let bright = -(top / containerHeight) + 1;
        bright = bright > 0 ? bright : 0;
        bright = bright > 1 ? 1 : bright;
        const data = {
            h: this.hsl.h,
            s: saturation,
            v: bright,
            a: this.hsl.a,
            source: 'hsva',
        };
        this.onChange.emit({ data, $event });
    }
}
SaturationComponent.decorators = [
    { type: Component, args: [{
                selector: 'color-saturation',
                template: `
  <div class="color-saturation" ngx-color-coordinates (coordinatesChange)="handleChange($event)" [style.background]="background">
    <div class="saturation-white">
      <div class="saturation-black"></div>
      <div class="saturation-pointer" [ngStyle]="pointer" [style.top]="pointerTop" [style.left]="pointerLeft">
        <div class="saturation-circle" [ngStyle]="circle"></div>
      </div>
    </div>
  </div>
  `,
                preserveWhitespaces: false,
                changeDetection: ChangeDetectionStrategy.OnPush,
                styles: [`
    .saturation-white {
      background: linear-gradient(to right, #fff, rgba(255,255,255,0));
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
    }
    .saturation-black {
      background: linear-gradient(to top, #000, rgba(0,0,0,0));
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
    }
    .color-saturation {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
    }
    .saturation-pointer {
      position: absolute;
      cursor: default;
    }
    .saturation-circle {
      width: 4px;
      height: 4px;
      box-shadow: 0 0 0 1.5px #fff, inset 0 0 1px 1px rgba(0,0,0,.3), 0 0 1px 2px rgba(0,0,0,.4);
      border-radius: 50%;
      cursor: hand;
      transform: translate(-2px, -4px);
    }
  `]
            },] }
];
SaturationComponent.propDecorators = {
    hsl: [{ type: Input }],
    hsv: [{ type: Input }],
    radius: [{ type: Input }],
    pointer: [{ type: Input }],
    circle: [{ type: Input }],
    onChange: [{ type: Output }]
};
export class SaturationModule {
}
SaturationModule.decorators = [
    { type: NgModule, args: [{
                declarations: [SaturationComponent],
                exports: [SaturationComponent],
                imports: [CommonModule, CoordinatesModule],
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2F0dXJhdGlvbi5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiLi4vLi4vLi4vc3JjL2xpYi9jb21tb24vIiwic291cmNlcyI6WyJzYXR1cmF0aW9uLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDL0MsT0FBTyxFQUNMLHVCQUF1QixFQUN2QixTQUFTLEVBQ1QsWUFBWSxFQUNaLEtBQUssRUFDTCxRQUFRLEVBRVIsTUFBTSxHQUNQLE1BQU0sZUFBZSxDQUFDO0FBR3ZCLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBeUQ1RCxNQUFNLE9BQU8sbUJBQW1CO0lBdERoQztRQTREWSxhQUFRLEdBQUcsSUFBSSxZQUFZLEVBQXVDLENBQUM7SUFtQy9FLENBQUM7SUE5QkMsV0FBVztRQUNULElBQUksQ0FBQyxVQUFVLEdBQUcsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsY0FBYyxDQUFDO1FBQ2xELElBQUksQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFDO1FBQ3RELElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQztJQUM1QyxDQUFDO0lBQ0QsWUFBWSxDQUFDLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxlQUFlLEVBQUUsY0FBYyxFQUFFLE1BQU0sRUFBRTtRQUNqRSxJQUFJLElBQUksR0FBRyxDQUFDLEVBQUU7WUFDWixJQUFJLEdBQUcsQ0FBQyxDQUFDO1NBQ1Y7YUFBTSxJQUFJLElBQUksR0FBRyxjQUFjLEVBQUU7WUFDaEMsSUFBSSxHQUFHLGNBQWMsQ0FBQztTQUN2QjthQUFNLElBQUksR0FBRyxHQUFHLENBQUMsRUFBRTtZQUNsQixHQUFHLEdBQUcsQ0FBQyxDQUFDO1NBQ1Q7YUFBTSxJQUFJLEdBQUcsR0FBRyxlQUFlLEVBQUU7WUFDaEMsR0FBRyxHQUFHLGVBQWUsQ0FBQztTQUN2QjtRQUVELE1BQU0sVUFBVSxHQUFHLElBQUksR0FBRyxjQUFjLENBQUM7UUFDekMsSUFBSSxNQUFNLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxlQUFlLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDMUMsTUFBTSxHQUFHLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2pDLE1BQU0sR0FBRyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQztRQUVqQyxNQUFNLElBQUksR0FBZTtZQUN2QixDQUFDLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2IsQ0FBQyxFQUFFLFVBQVU7WUFDYixDQUFDLEVBQUUsTUFBTTtZQUNULENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDYixNQUFNLEVBQUUsTUFBTTtTQUNmLENBQUM7UUFDRixJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDO0lBQ3ZDLENBQUM7OztZQTlGRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLGtCQUFrQjtnQkFDNUIsUUFBUSxFQUFFOzs7Ozs7Ozs7R0FTVDtnQkF3Q0QsbUJBQW1CLEVBQUUsS0FBSztnQkFDMUIsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07eUJBdkM3Qzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBb0NEO2FBSUY7OztrQkFFRSxLQUFLO2tCQUNMLEtBQUs7cUJBQ0wsS0FBSztzQkFDTCxLQUFLO3FCQUNMLEtBQUs7dUJBQ0wsTUFBTTs7QUEwQ1QsTUFBTSxPQUFPLGdCQUFnQjs7O1lBTDVCLFFBQVEsU0FBQztnQkFDUixZQUFZLEVBQUUsQ0FBQyxtQkFBbUIsQ0FBQztnQkFDbkMsT0FBTyxFQUFFLENBQUMsbUJBQW1CLENBQUM7Z0JBQzlCLE9BQU8sRUFBRSxDQUFDLFlBQVksRUFBRSxpQkFBaUIsQ0FBQzthQUMzQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge1xuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ29tcG9uZW50LFxuICBFdmVudEVtaXR0ZXIsXG4gIElucHV0LFxuICBOZ01vZHVsZSxcbiAgT25DaGFuZ2VzLFxuICBPdXRwdXQsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5cbmltcG9ydCB7IENvb3JkaW5hdGVzTW9kdWxlIH0gZnJvbSAnLi9jb29yZGluYXRlcy5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgSFNMQSwgSFNWQSwgSFNWQXNvdXJjZSB9IGZyb20gJy4vaGVscGVycy9jb2xvci5pbnRlcmZhY2VzJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnY29sb3Itc2F0dXJhdGlvbicsXG4gIHRlbXBsYXRlOiBgXG4gIDxkaXYgY2xhc3M9XCJjb2xvci1zYXR1cmF0aW9uXCIgbmd4LWNvbG9yLWNvb3JkaW5hdGVzIChjb29yZGluYXRlc0NoYW5nZSk9XCJoYW5kbGVDaGFuZ2UoJGV2ZW50KVwiIFtzdHlsZS5iYWNrZ3JvdW5kXT1cImJhY2tncm91bmRcIj5cbiAgICA8ZGl2IGNsYXNzPVwic2F0dXJhdGlvbi13aGl0ZVwiPlxuICAgICAgPGRpdiBjbGFzcz1cInNhdHVyYXRpb24tYmxhY2tcIj48L2Rpdj5cbiAgICAgIDxkaXYgY2xhc3M9XCJzYXR1cmF0aW9uLXBvaW50ZXJcIiBbbmdTdHlsZV09XCJwb2ludGVyXCIgW3N0eWxlLnRvcF09XCJwb2ludGVyVG9wXCIgW3N0eWxlLmxlZnRdPVwicG9pbnRlckxlZnRcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cInNhdHVyYXRpb24tY2lyY2xlXCIgW25nU3R5bGVdPVwiY2lyY2xlXCI+PC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgPC9kaXY+XG4gIGAsXG4gIHN0eWxlczogW1xuICAgIGBcbiAgICAuc2F0dXJhdGlvbi13aGl0ZSB7XG4gICAgICBiYWNrZ3JvdW5kOiBsaW5lYXItZ3JhZGllbnQodG8gcmlnaHQsICNmZmYsIHJnYmEoMjU1LDI1NSwyNTUsMCkpO1xuICAgICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgICAgdG9wOiAwO1xuICAgICAgYm90dG9tOiAwO1xuICAgICAgbGVmdDogMDtcbiAgICAgIHJpZ2h0OiAwO1xuICAgIH1cbiAgICAuc2F0dXJhdGlvbi1ibGFjayB7XG4gICAgICBiYWNrZ3JvdW5kOiBsaW5lYXItZ3JhZGllbnQodG8gdG9wLCAjMDAwLCByZ2JhKDAsMCwwLDApKTtcbiAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICAgIHRvcDogMDtcbiAgICAgIGJvdHRvbTogMDtcbiAgICAgIGxlZnQ6IDA7XG4gICAgICByaWdodDogMDtcbiAgICB9XG4gICAgLmNvbG9yLXNhdHVyYXRpb24ge1xuICAgICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgICAgdG9wOiAwO1xuICAgICAgYm90dG9tOiAwO1xuICAgICAgbGVmdDogMDtcbiAgICAgIHJpZ2h0OiAwO1xuICAgIH1cbiAgICAuc2F0dXJhdGlvbi1wb2ludGVyIHtcbiAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICAgIGN1cnNvcjogZGVmYXVsdDtcbiAgICB9XG4gICAgLnNhdHVyYXRpb24tY2lyY2xlIHtcbiAgICAgIHdpZHRoOiA0cHg7XG4gICAgICBoZWlnaHQ6IDRweDtcbiAgICAgIGJveC1zaGFkb3c6IDAgMCAwIDEuNXB4ICNmZmYsIGluc2V0IDAgMCAxcHggMXB4IHJnYmEoMCwwLDAsLjMpLCAwIDAgMXB4IDJweCByZ2JhKDAsMCwwLC40KTtcbiAgICAgIGJvcmRlci1yYWRpdXM6IDUwJTtcbiAgICAgIGN1cnNvcjogaGFuZDtcbiAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlKC0ycHgsIC00cHgpO1xuICAgIH1cbiAgYCxcbiAgXSxcbiAgcHJlc2VydmVXaGl0ZXNwYWNlczogZmFsc2UsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxufSlcbmV4cG9ydCBjbGFzcyBTYXR1cmF0aW9uQ29tcG9uZW50IGltcGxlbWVudHMgT25DaGFuZ2VzIHtcbiAgQElucHV0KCkgaHNsITogSFNMQTtcbiAgQElucHV0KCkgaHN2ITogSFNWQTtcbiAgQElucHV0KCkgcmFkaXVzITogbnVtYmVyO1xuICBASW5wdXQoKSBwb2ludGVyITogUmVjb3JkPHN0cmluZywgc3RyaW5nPjtcbiAgQElucHV0KCkgY2lyY2xlITogUmVjb3JkPHN0cmluZywgc3RyaW5nPjtcbiAgQE91dHB1dCgpIG9uQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjx7IGRhdGE6IEhTVkFzb3VyY2U7ICRldmVudDogRXZlbnQgfT4oKTtcbiAgYmFja2dyb3VuZCE6IHN0cmluZztcbiAgcG9pbnRlclRvcCE6IHN0cmluZztcbiAgcG9pbnRlckxlZnQhOiBzdHJpbmc7XG5cbiAgbmdPbkNoYW5nZXMoKSB7XG4gICAgdGhpcy5iYWNrZ3JvdW5kID0gYGhzbCgke3RoaXMuaHNsLmh9LCAxMDAlLCA1MCUpYDtcbiAgICB0aGlzLnBvaW50ZXJUb3AgPSAtKHRoaXMuaHN2LnYgKiAxMDApICsgMSArIDEwMCArICclJztcbiAgICB0aGlzLnBvaW50ZXJMZWZ0ID0gdGhpcy5oc3YucyAqIDEwMCArICclJztcbiAgfVxuICBoYW5kbGVDaGFuZ2UoeyB0b3AsIGxlZnQsIGNvbnRhaW5lckhlaWdodCwgY29udGFpbmVyV2lkdGgsICRldmVudCB9KSB7XG4gICAgaWYgKGxlZnQgPCAwKSB7XG4gICAgICBsZWZ0ID0gMDtcbiAgICB9IGVsc2UgaWYgKGxlZnQgPiBjb250YWluZXJXaWR0aCkge1xuICAgICAgbGVmdCA9IGNvbnRhaW5lcldpZHRoO1xuICAgIH0gZWxzZSBpZiAodG9wIDwgMCkge1xuICAgICAgdG9wID0gMDtcbiAgICB9IGVsc2UgaWYgKHRvcCA+IGNvbnRhaW5lckhlaWdodCkge1xuICAgICAgdG9wID0gY29udGFpbmVySGVpZ2h0O1xuICAgIH1cblxuICAgIGNvbnN0IHNhdHVyYXRpb24gPSBsZWZ0IC8gY29udGFpbmVyV2lkdGg7XG4gICAgbGV0IGJyaWdodCA9IC0odG9wIC8gY29udGFpbmVySGVpZ2h0KSArIDE7XG4gICAgYnJpZ2h0ID0gYnJpZ2h0ID4gMCA/IGJyaWdodCA6IDA7XG4gICAgYnJpZ2h0ID0gYnJpZ2h0ID4gMSA/IDEgOiBicmlnaHQ7XG5cbiAgICBjb25zdCBkYXRhOiBIU1ZBc291cmNlID0ge1xuICAgICAgaDogdGhpcy5oc2wuaCxcbiAgICAgIHM6IHNhdHVyYXRpb24sXG4gICAgICB2OiBicmlnaHQsXG4gICAgICBhOiB0aGlzLmhzbC5hLFxuICAgICAgc291cmNlOiAnaHN2YScsXG4gICAgfTtcbiAgICB0aGlzLm9uQ2hhbmdlLmVtaXQoeyBkYXRhLCAkZXZlbnQgfSk7XG4gIH1cbn1cblxuQE5nTW9kdWxlKHtcbiAgZGVjbGFyYXRpb25zOiBbU2F0dXJhdGlvbkNvbXBvbmVudF0sXG4gIGV4cG9ydHM6IFtTYXR1cmF0aW9uQ29tcG9uZW50XSxcbiAgaW1wb3J0czogW0NvbW1vbk1vZHVsZSwgQ29vcmRpbmF0ZXNNb2R1bGVdLFxufSlcbmV4cG9ydCBjbGFzcyBTYXR1cmF0aW9uTW9kdWxlIHt9XG4iXX0=