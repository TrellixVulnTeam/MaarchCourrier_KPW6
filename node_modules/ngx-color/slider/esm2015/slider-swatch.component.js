import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, } from '@angular/core';
export class SliderSwatchComponent {
    constructor() {
        this.first = false;
        this.last = false;
        this.onClick = new EventEmitter();
    }
    ngOnChanges() {
        this.background = `hsl(${this.hsl.h}, 50%, ${this.offset * 100}%)`;
    }
    handleClick($event) {
        this.onClick.emit({
            data: {
                h: this.hsl.h,
                s: 0.5,
                l: this.offset,
                source: 'hsl',
            },
            $event,
        });
    }
}
SliderSwatchComponent.decorators = [
    { type: Component, args: [{
                selector: 'color-slider-swatch',
                template: `
  <div class="slider-swatch" [style.background]="background"
    [class.first]="first" [class.last]="last" [class.active]="active"
    (click)="handleClick($event)"
  ></div>
  `,
                changeDetection: ChangeDetectionStrategy.OnPush,
                preserveWhitespaces: false,
                styles: [`
    .slider-swatch {
      height: 12px;
      background: rgb(121, 211, 166);
      cursor: pointer;
    }
    .slider-swatch.active {
      transform: scaleY(1.8);
      border-top-right-radius: 3.6px 2px;
      border-top-left-radius: 3.6px 2px;
      border-bottom-right-radius: 3.6px 2px;
      border-bottom-left-radius: 3.6px 2px;
    }
    .slider-swatch.first {
      border-radius: 2px 0px 0px 2px;
    }
    .slider-swatch.last {
      border-radius: 0px 2px 2px 0px;
    }

  `]
            },] }
];
SliderSwatchComponent.propDecorators = {
    hsl: [{ type: Input }],
    active: [{ type: Input }],
    offset: [{ type: Input }],
    first: [{ type: Input }],
    last: [{ type: Input }],
    onClick: [{ type: Output }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2xpZGVyLXN3YXRjaC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiLi4vLi4vLi4vLi4vc3JjL2xpYi9jb21wb25lbnRzL3NsaWRlci8iLCJzb3VyY2VzIjpbInNsaWRlci1zd2F0Y2guY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFDTCx1QkFBdUIsRUFDdkIsU0FBUyxFQUNULFlBQVksRUFDWixLQUFLLEVBRUwsTUFBTSxHQUNQLE1BQU0sZUFBZSxDQUFDO0FBc0N2QixNQUFNLE9BQU8scUJBQXFCO0lBbENsQztRQXNDVyxVQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ2QsU0FBSSxHQUFHLEtBQUssQ0FBQztRQUNaLFlBQU8sR0FBRyxJQUFJLFlBQVksRUFBTyxDQUFDO0lBaUI5QyxDQUFDO0lBZEMsV0FBVztRQUNULElBQUksQ0FBQyxVQUFVLEdBQUcsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsVUFBVSxJQUFJLENBQUMsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDO0lBQ3JFLENBQUM7SUFDRCxXQUFXLENBQUMsTUFBTTtRQUNoQixJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQztZQUNoQixJQUFJLEVBQUU7Z0JBQ0osQ0FBQyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDYixDQUFDLEVBQUUsR0FBRztnQkFDTixDQUFDLEVBQUUsSUFBSSxDQUFDLE1BQU07Z0JBQ2QsTUFBTSxFQUFFLEtBQUs7YUFDZDtZQUNELE1BQU07U0FDUCxDQUFDLENBQUM7SUFDTCxDQUFDOzs7WUF4REYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxxQkFBcUI7Z0JBQy9CLFFBQVEsRUFBRTs7Ozs7R0FLVDtnQkF3QkQsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07Z0JBQy9DLG1CQUFtQixFQUFFLEtBQUs7eUJBdkJ4Qjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FvQkQ7YUFJRjs7O2tCQUVFLEtBQUs7cUJBQ0wsS0FBSztxQkFDTCxLQUFLO29CQUNMLEtBQUs7bUJBQ0wsS0FBSztzQkFDTCxNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENvbXBvbmVudCxcbiAgRXZlbnRFbWl0dGVyLFxuICBJbnB1dCxcbiAgT25DaGFuZ2VzLFxuICBPdXRwdXQsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBIU0wgfSBmcm9tICduZ3gtY29sb3InO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdjb2xvci1zbGlkZXItc3dhdGNoJyxcbiAgdGVtcGxhdGU6IGBcbiAgPGRpdiBjbGFzcz1cInNsaWRlci1zd2F0Y2hcIiBbc3R5bGUuYmFja2dyb3VuZF09XCJiYWNrZ3JvdW5kXCJcbiAgICBbY2xhc3MuZmlyc3RdPVwiZmlyc3RcIiBbY2xhc3MubGFzdF09XCJsYXN0XCIgW2NsYXNzLmFjdGl2ZV09XCJhY3RpdmVcIlxuICAgIChjbGljayk9XCJoYW5kbGVDbGljaygkZXZlbnQpXCJcbiAgPjwvZGl2PlxuICBgLFxuICBzdHlsZXM6IFtcbiAgICBgXG4gICAgLnNsaWRlci1zd2F0Y2gge1xuICAgICAgaGVpZ2h0OiAxMnB4O1xuICAgICAgYmFja2dyb3VuZDogcmdiKDEyMSwgMjExLCAxNjYpO1xuICAgICAgY3Vyc29yOiBwb2ludGVyO1xuICAgIH1cbiAgICAuc2xpZGVyLXN3YXRjaC5hY3RpdmUge1xuICAgICAgdHJhbnNmb3JtOiBzY2FsZVkoMS44KTtcbiAgICAgIGJvcmRlci10b3AtcmlnaHQtcmFkaXVzOiAzLjZweCAycHg7XG4gICAgICBib3JkZXItdG9wLWxlZnQtcmFkaXVzOiAzLjZweCAycHg7XG4gICAgICBib3JkZXItYm90dG9tLXJpZ2h0LXJhZGl1czogMy42cHggMnB4O1xuICAgICAgYm9yZGVyLWJvdHRvbS1sZWZ0LXJhZGl1czogMy42cHggMnB4O1xuICAgIH1cbiAgICAuc2xpZGVyLXN3YXRjaC5maXJzdCB7XG4gICAgICBib3JkZXItcmFkaXVzOiAycHggMHB4IDBweCAycHg7XG4gICAgfVxuICAgIC5zbGlkZXItc3dhdGNoLmxhc3Qge1xuICAgICAgYm9yZGVyLXJhZGl1czogMHB4IDJweCAycHggMHB4O1xuICAgIH1cblxuICBgLFxuICBdLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgcHJlc2VydmVXaGl0ZXNwYWNlczogZmFsc2UsXG59KVxuZXhwb3J0IGNsYXNzIFNsaWRlclN3YXRjaENvbXBvbmVudCBpbXBsZW1lbnRzIE9uQ2hhbmdlcyB7XG4gIEBJbnB1dCgpIGhzbCE6IEhTTDtcbiAgQElucHV0KCkgYWN0aXZlITogYm9vbGVhbjtcbiAgQElucHV0KCkgb2Zmc2V0ITogbnVtYmVyO1xuICBASW5wdXQoKSBmaXJzdCA9IGZhbHNlO1xuICBASW5wdXQoKSBsYXN0ID0gZmFsc2U7XG4gIEBPdXRwdXQoKSBvbkNsaWNrID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG4gIGJhY2tncm91bmQhOiBzdHJpbmc7XG5cbiAgbmdPbkNoYW5nZXMoKSB7XG4gICAgdGhpcy5iYWNrZ3JvdW5kID0gYGhzbCgke3RoaXMuaHNsLmh9LCA1MCUsICR7dGhpcy5vZmZzZXQgKiAxMDB9JSlgO1xuICB9XG4gIGhhbmRsZUNsaWNrKCRldmVudCkge1xuICAgIHRoaXMub25DbGljay5lbWl0KHtcbiAgICAgIGRhdGE6IHtcbiAgICAgICAgaDogdGhpcy5oc2wuaCxcbiAgICAgICAgczogMC41LFxuICAgICAgICBsOiB0aGlzLm9mZnNldCxcbiAgICAgICAgc291cmNlOiAnaHNsJyxcbiAgICAgIH0sXG4gICAgICAkZXZlbnQsXG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==