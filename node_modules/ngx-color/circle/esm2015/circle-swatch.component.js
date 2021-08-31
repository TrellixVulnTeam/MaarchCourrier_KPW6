import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, } from '@angular/core';
export class CircleSwatchComponent {
    constructor() {
        this.circleSize = 28;
        this.circleSpacing = 14;
        this.focus = false;
        this.onClick = new EventEmitter();
        this.onSwatchHover = new EventEmitter();
        this.focusStyle = {};
        this.swatchStyle = {
            borderRadius: '50%',
            background: 'transparent',
            transition: '100ms box-shadow ease 0s',
        };
    }
    ngOnChanges() {
        this.swatchStyle.boxShadow = `inset 0 0 0 ${this.circleSize / 2}px ${this.color}`;
        this.focusStyle.boxShadow = `inset 0 0 0 ${this.circleSize / 2}px ${this.color}, 0 0 5px ${this.color}`;
        if (this.focus) {
            this.focusStyle.boxShadow = `inset 0 0 0 3px ${this.color}, 0 0 5px ${this.color}`;
        }
    }
    handleClick({ hex, $event }) {
        this.onClick.emit({ hex, $event });
    }
}
CircleSwatchComponent.decorators = [
    { type: Component, args: [{
                selector: 'color-circle-swatch',
                template: `
  <div class="circle-swatch"
    [style.width.px]="circleSize" [style.height.px]="circleSize"
    [style.margin-right.px]="circleSpacing" [style.margin-bottom.px]="circleSpacing"
    >
    <color-swatch
      [color]="color" [style]="swatchStyle" [focus]="focus" [focusStyle]="focusStyle"
      (onClick)="handleClick($event)" (onHover)="onSwatchHover.emit($event)">
    </color-swatch>
    <div class="clear"></div>
  </div>
  `,
                changeDetection: ChangeDetectionStrategy.OnPush,
                preserveWhitespaces: false,
                styles: [`
  .circle-swatch {
    transform: scale(1);
    transition: transform 100ms ease;
  }
  .circle-swatch:hover {
    transform: scale(1.2);
  }
  `]
            },] }
];
CircleSwatchComponent.propDecorators = {
    color: [{ type: Input }],
    circleSize: [{ type: Input }],
    circleSpacing: [{ type: Input }],
    focus: [{ type: Input }],
    onClick: [{ type: Output }],
    onSwatchHover: [{ type: Output }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2lyY2xlLXN3YXRjaC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiLi4vLi4vLi4vLi4vc3JjL2xpYi9jb21wb25lbnRzL2NpcmNsZS8iLCJzb3VyY2VzIjpbImNpcmNsZS1zd2F0Y2guY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFDTCx1QkFBdUIsRUFDdkIsU0FBUyxFQUNULFlBQVksRUFDWixLQUFLLEVBRUwsTUFBTSxHQUNQLE1BQU0sZUFBZSxDQUFDO0FBOEJ2QixNQUFNLE9BQU8scUJBQXFCO0lBNUJsQztRQThCVyxlQUFVLEdBQUcsRUFBRSxDQUFDO1FBQ2hCLGtCQUFhLEdBQUcsRUFBRSxDQUFDO1FBQ25CLFVBQUssR0FBRyxLQUFLLENBQUM7UUFDYixZQUFPLEdBQUcsSUFBSSxZQUFZLEVBQU8sQ0FBQztRQUNsQyxrQkFBYSxHQUFHLElBQUksWUFBWSxFQUFPLENBQUM7UUFDbEQsZUFBVSxHQUEyQixFQUFFLENBQUM7UUFDeEMsZ0JBQVcsR0FBMkI7WUFDcEMsWUFBWSxFQUFFLEtBQUs7WUFDbkIsVUFBVSxFQUFFLGFBQWE7WUFDekIsVUFBVSxFQUFFLDBCQUEwQjtTQUN2QyxDQUFDO0lBWUosQ0FBQztJQVZDLFdBQVc7UUFDVCxJQUFJLENBQUMsV0FBVyxDQUFDLFNBQVMsR0FBRyxlQUFlLElBQUksQ0FBQyxVQUFVLEdBQUcsQ0FBQyxNQUFNLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUNsRixJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsR0FBRyxlQUFnQixJQUFJLENBQUMsVUFBVSxHQUFHLENBQUUsTUFBTyxJQUFJLENBQUMsS0FBTSxhQUFjLElBQUksQ0FBQyxLQUFNLEVBQUUsQ0FBQztRQUM5RyxJQUFJLElBQUksQ0FBQyxLQUFLLEVBQUU7WUFDZCxJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsR0FBRyxtQkFBb0IsSUFBSSxDQUFDLEtBQU0sYUFBYyxJQUFJLENBQUMsS0FBTSxFQUFFLENBQUM7U0FDeEY7SUFDSCxDQUFDO0lBQ0QsV0FBVyxDQUFDLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRTtRQUN6QixJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDO0lBQ3JDLENBQUM7OztZQW5ERixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLHFCQUFxQjtnQkFDL0IsUUFBUSxFQUFFOzs7Ozs7Ozs7OztHQVdUO2dCQVlELGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNO2dCQUMvQyxtQkFBbUIsRUFBRSxLQUFLO3lCQVh4Qjs7Ozs7Ozs7R0FRRDthQUlGOzs7b0JBRUUsS0FBSzt5QkFDTCxLQUFLOzRCQUNMLEtBQUs7b0JBQ0wsS0FBSztzQkFDTCxNQUFNOzRCQUNOLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ29tcG9uZW50LFxuICBFdmVudEVtaXR0ZXIsXG4gIElucHV0LFxuICBPbkNoYW5nZXMsXG4gIE91dHB1dCxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2NvbG9yLWNpcmNsZS1zd2F0Y2gnLFxuICB0ZW1wbGF0ZTogYFxuICA8ZGl2IGNsYXNzPVwiY2lyY2xlLXN3YXRjaFwiXG4gICAgW3N0eWxlLndpZHRoLnB4XT1cImNpcmNsZVNpemVcIiBbc3R5bGUuaGVpZ2h0LnB4XT1cImNpcmNsZVNpemVcIlxuICAgIFtzdHlsZS5tYXJnaW4tcmlnaHQucHhdPVwiY2lyY2xlU3BhY2luZ1wiIFtzdHlsZS5tYXJnaW4tYm90dG9tLnB4XT1cImNpcmNsZVNwYWNpbmdcIlxuICAgID5cbiAgICA8Y29sb3Itc3dhdGNoXG4gICAgICBbY29sb3JdPVwiY29sb3JcIiBbc3R5bGVdPVwic3dhdGNoU3R5bGVcIiBbZm9jdXNdPVwiZm9jdXNcIiBbZm9jdXNTdHlsZV09XCJmb2N1c1N0eWxlXCJcbiAgICAgIChvbkNsaWNrKT1cImhhbmRsZUNsaWNrKCRldmVudClcIiAob25Ib3Zlcik9XCJvblN3YXRjaEhvdmVyLmVtaXQoJGV2ZW50KVwiPlxuICAgIDwvY29sb3Itc3dhdGNoPlxuICAgIDxkaXYgY2xhc3M9XCJjbGVhclwiPjwvZGl2PlxuICA8L2Rpdj5cbiAgYCxcbiAgc3R5bGVzOiBbXG4gICAgYFxuICAuY2lyY2xlLXN3YXRjaCB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgxKTtcbiAgICB0cmFuc2l0aW9uOiB0cmFuc2Zvcm0gMTAwbXMgZWFzZTtcbiAgfVxuICAuY2lyY2xlLXN3YXRjaDpob3ZlciB7XG4gICAgdHJhbnNmb3JtOiBzY2FsZSgxLjIpO1xuICB9XG4gIGAsXG4gIF0sXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBwcmVzZXJ2ZVdoaXRlc3BhY2VzOiBmYWxzZSxcbn0pXG5leHBvcnQgY2xhc3MgQ2lyY2xlU3dhdGNoQ29tcG9uZW50IGltcGxlbWVudHMgT25DaGFuZ2VzIHtcbiAgQElucHV0KCkgY29sb3IhOiBzdHJpbmc7XG4gIEBJbnB1dCgpIGNpcmNsZVNpemUgPSAyODtcbiAgQElucHV0KCkgY2lyY2xlU3BhY2luZyA9IDE0O1xuICBASW5wdXQoKSBmb2N1cyA9IGZhbHNlO1xuICBAT3V0cHV0KCkgb25DbGljayA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICBAT3V0cHV0KCkgb25Td2F0Y2hIb3ZlciA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICBmb2N1c1N0eWxlOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge307XG4gIHN3YXRjaFN0eWxlOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge1xuICAgIGJvcmRlclJhZGl1czogJzUwJScsXG4gICAgYmFja2dyb3VuZDogJ3RyYW5zcGFyZW50JyxcbiAgICB0cmFuc2l0aW9uOiAnMTAwbXMgYm94LXNoYWRvdyBlYXNlIDBzJyxcbiAgfTtcblxuICBuZ09uQ2hhbmdlcygpIHtcbiAgICB0aGlzLnN3YXRjaFN0eWxlLmJveFNoYWRvdyA9IGBpbnNldCAwIDAgMCAke3RoaXMuY2lyY2xlU2l6ZSAvIDJ9cHggJHt0aGlzLmNvbG9yfWA7XG4gICAgdGhpcy5mb2N1c1N0eWxlLmJveFNoYWRvdyA9IGBpbnNldCAwIDAgMCAkeyB0aGlzLmNpcmNsZVNpemUgLyAyIH1weCAkeyB0aGlzLmNvbG9yIH0sIDAgMCA1cHggJHsgdGhpcy5jb2xvciB9YDtcbiAgICBpZiAodGhpcy5mb2N1cykge1xuICAgICAgdGhpcy5mb2N1c1N0eWxlLmJveFNoYWRvdyA9IGBpbnNldCAwIDAgMCAzcHggJHsgdGhpcy5jb2xvciB9LCAwIDAgNXB4ICR7IHRoaXMuY29sb3IgfWA7XG4gICAgfVxuICB9XG4gIGhhbmRsZUNsaWNrKHsgaGV4LCAkZXZlbnQgfSkge1xuICAgIHRoaXMub25DbGljay5lbWl0KHsgaGV4LCAkZXZlbnQgfSk7XG4gIH1cbn1cbiJdfQ==