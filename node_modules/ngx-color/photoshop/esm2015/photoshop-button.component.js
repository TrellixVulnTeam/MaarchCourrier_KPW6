import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, } from '@angular/core';
export class PhotoshopButtonComponent {
    constructor() {
        this.label = '';
        this.active = false;
        this.onClick = new EventEmitter();
    }
}
PhotoshopButtonComponent.decorators = [
    { type: Component, args: [{
                selector: 'color-photoshop-button',
                template: `
    <div class="photoshop-button"  [class.active]="active"
      (click)="onClick.emit($event)"
    >
      {{ label }}
    </div>
  `,
                changeDetection: ChangeDetectionStrategy.OnPush,
                preserveWhitespaces: false,
                styles: [`
    .photoshop-button {
      background-image: linear-gradient(
        -180deg,
        rgb(255, 255, 255) 0%,
        rgb(230, 230, 230) 100%
      );
      border: 1px solid rgb(135, 135, 135);
      border-radius: 2px;
      height: 22px;
      box-shadow: rgb(234, 234, 234) 0px 1px 0px 0px;
      font-size: 14px;
      color: rgb(0, 0, 0);
      line-height: 20px;
      text-align: center;
      margin-bottom: 10px;
      cursor: pointer;
    }
    .photoshop-button.active {
      box-shadow: 0 0 0 1px #878787;
    }
  `]
            },] }
];
PhotoshopButtonComponent.propDecorators = {
    label: [{ type: Input }],
    active: [{ type: Input }],
    onClick: [{ type: Output }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGhvdG9zaG9wLWJ1dHRvbi5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiLi4vLi4vLi4vLi4vc3JjL2xpYi9jb21wb25lbnRzL3Bob3Rvc2hvcC8iLCJzb3VyY2VzIjpbInBob3Rvc2hvcC1idXR0b24uY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFDTCx1QkFBdUIsRUFDdkIsU0FBUyxFQUNULFlBQVksRUFDWixLQUFLLEVBQ0wsTUFBTSxHQUNQLE1BQU0sZUFBZSxDQUFDO0FBc0N2QixNQUFNLE9BQU8sd0JBQXdCO0lBcENyQztRQXFDVyxVQUFLLEdBQUcsRUFBRSxDQUFDO1FBQ1gsV0FBTSxHQUFHLEtBQUssQ0FBQztRQUNkLFlBQU8sR0FBRyxJQUFJLFlBQVksRUFBUyxDQUFDO0lBQ2hELENBQUM7OztZQXhDQSxTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLHdCQUF3QjtnQkFDbEMsUUFBUSxFQUFFOzs7Ozs7R0FNVDtnQkF5QkQsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07Z0JBQy9DLG1CQUFtQixFQUFFLEtBQUs7eUJBeEJ4Qjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBcUJEO2FBSUY7OztvQkFFRSxLQUFLO3FCQUNMLEtBQUs7c0JBQ0wsTUFBTSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDb21wb25lbnQsXG4gIEV2ZW50RW1pdHRlcixcbiAgSW5wdXQsXG4gIE91dHB1dCxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2NvbG9yLXBob3Rvc2hvcC1idXR0b24nLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxkaXYgY2xhc3M9XCJwaG90b3Nob3AtYnV0dG9uXCIgIFtjbGFzcy5hY3RpdmVdPVwiYWN0aXZlXCJcbiAgICAgIChjbGljayk9XCJvbkNsaWNrLmVtaXQoJGV2ZW50KVwiXG4gICAgPlxuICAgICAge3sgbGFiZWwgfX1cbiAgICA8L2Rpdj5cbiAgYCxcbiAgc3R5bGVzOiBbXG4gICAgYFxuICAgIC5waG90b3Nob3AtYnV0dG9uIHtcbiAgICAgIGJhY2tncm91bmQtaW1hZ2U6IGxpbmVhci1ncmFkaWVudChcbiAgICAgICAgLTE4MGRlZyxcbiAgICAgICAgcmdiKDI1NSwgMjU1LCAyNTUpIDAlLFxuICAgICAgICByZ2IoMjMwLCAyMzAsIDIzMCkgMTAwJVxuICAgICAgKTtcbiAgICAgIGJvcmRlcjogMXB4IHNvbGlkIHJnYigxMzUsIDEzNSwgMTM1KTtcbiAgICAgIGJvcmRlci1yYWRpdXM6IDJweDtcbiAgICAgIGhlaWdodDogMjJweDtcbiAgICAgIGJveC1zaGFkb3c6IHJnYigyMzQsIDIzNCwgMjM0KSAwcHggMXB4IDBweCAwcHg7XG4gICAgICBmb250LXNpemU6IDE0cHg7XG4gICAgICBjb2xvcjogcmdiKDAsIDAsIDApO1xuICAgICAgbGluZS1oZWlnaHQ6IDIwcHg7XG4gICAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gICAgICBtYXJnaW4tYm90dG9tOiAxMHB4O1xuICAgICAgY3Vyc29yOiBwb2ludGVyO1xuICAgIH1cbiAgICAucGhvdG9zaG9wLWJ1dHRvbi5hY3RpdmUge1xuICAgICAgYm94LXNoYWRvdzogMCAwIDAgMXB4ICM4Nzg3ODc7XG4gICAgfVxuICBgLFxuICBdLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgcHJlc2VydmVXaGl0ZXNwYWNlczogZmFsc2UsXG59KVxuZXhwb3J0IGNsYXNzIFBob3Rvc2hvcEJ1dHRvbkNvbXBvbmVudCB7XG4gIEBJbnB1dCgpIGxhYmVsID0gJyc7XG4gIEBJbnB1dCgpIGFjdGl2ZSA9IGZhbHNlO1xuICBAT3V0cHV0KCkgb25DbGljayA9IG5ldyBFdmVudEVtaXR0ZXI8RXZlbnQ+KCk7XG59XG4iXX0=