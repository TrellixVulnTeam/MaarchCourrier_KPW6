import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, NgModule } from '@angular/core';
export class RaisedComponent {
    constructor() {
        this.zDepth = 1;
        this.radius = 1;
        this.background = '#fff';
    }
}
RaisedComponent.decorators = [
    { type: Component, args: [{
                selector: 'color-raised',
                template: `
  <div class="raised-wrap">
    <div class="raised-bg zDepth-{{zDepth}}" [style.background]="background"></div>
    <div class="raised-content">
      <ng-content></ng-content>
    </div>
  </div>
  `,
                preserveWhitespaces: false,
                changeDetection: ChangeDetectionStrategy.OnPush,
                styles: [`
    .raised-wrap {
      position: relative;
      display: inline-block;
    }
    .raised-bg {
      position: absolute;
      top: 0px;
      right: 0px;
      bottom: 0px;
      left: 0px;
    }
    .raised-content {
      position: relative;
    }
    .zDepth-0 {
      box-shadow: none;
    }
    .zDepth-1 {
      box-shadow: 0 2px 10px rgba(0,0,0,.12), 0 2px 5px rgba(0,0,0,.16);
    }
    .zDepth-2 {
      box-shadow: 0 6px 20px rgba(0,0,0,.19), 0 8px 17px rgba(0,0,0,.2);
    }
    .zDepth-3 {
      box-shadow: 0 17px 50px rgba(0,0,0,.19), 0 12px 15px rgba(0,0,0,.24);
    }
    .zDepth-4 {
      box-shadow: 0 25px 55px rgba(0,0,0,.21), 0 16px 28px rgba(0,0,0,.22);
    }
    .zDepth-5 {
      box-shadow: 0 40px 77px rgba(0,0,0,.22), 0 27px 24px rgba(0,0,0,.2);
    }
  `]
            },] }
];
RaisedComponent.propDecorators = {
    zDepth: [{ type: Input }],
    radius: [{ type: Input }],
    background: [{ type: Input }]
};
export class RaisedModule {
}
RaisedModule.decorators = [
    { type: NgModule, args: [{
                declarations: [RaisedComponent],
                exports: [RaisedComponent],
                imports: [CommonModule],
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmFpc2VkLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIuLi8uLi8uLi9zcmMvbGliL2NvbW1vbi8iLCJzb3VyY2VzIjpbInJhaXNlZC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQW1EcEYsTUFBTSxPQUFPLGVBQWU7SUEvQzVCO1FBZ0RXLFdBQU0sR0FBVyxDQUFDLENBQUM7UUFDbkIsV0FBTSxHQUFHLENBQUMsQ0FBQztRQUNYLGVBQVUsR0FBRyxNQUFNLENBQUM7SUFDL0IsQ0FBQzs7O1lBbkRBLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsY0FBYztnQkFDeEIsUUFBUSxFQUFFOzs7Ozs7O0dBT1Q7Z0JBbUNELG1CQUFtQixFQUFFLEtBQUs7Z0JBQzFCLGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNO3lCQW5DdEM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQWlDUjthQUdGOzs7cUJBRUUsS0FBSztxQkFDTCxLQUFLO3lCQUNMLEtBQUs7O0FBUVIsTUFBTSxPQUFPLFlBQVk7OztZQUx4QixRQUFRLFNBQUM7Z0JBQ1IsWUFBWSxFQUFFLENBQUMsZUFBZSxDQUFDO2dCQUMvQixPQUFPLEVBQUUsQ0FBQyxlQUFlLENBQUM7Z0JBQzFCLE9BQU8sRUFBRSxDQUFDLFlBQVksQ0FBQzthQUN4QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSwgQ29tcG9uZW50LCBJbnB1dCwgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuZXhwb3J0IHR5cGUgekRlcHRoID0gMCB8IDEgfCAyIHwgMyB8IDQgfCA1O1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdjb2xvci1yYWlzZWQnLFxuICB0ZW1wbGF0ZTogYFxuICA8ZGl2IGNsYXNzPVwicmFpc2VkLXdyYXBcIj5cbiAgICA8ZGl2IGNsYXNzPVwicmFpc2VkLWJnIHpEZXB0aC17e3pEZXB0aH19XCIgW3N0eWxlLmJhY2tncm91bmRdPVwiYmFja2dyb3VuZFwiPjwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJyYWlzZWQtY29udGVudFwiPlxuICAgICAgPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlxuICAgIDwvZGl2PlxuICA8L2Rpdj5cbiAgYCxcbiAgc3R5bGVzOiBbYFxuICAgIC5yYWlzZWQtd3JhcCB7XG4gICAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gICAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gICAgfVxuICAgIC5yYWlzZWQtYmcge1xuICAgICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgICAgdG9wOiAwcHg7XG4gICAgICByaWdodDogMHB4O1xuICAgICAgYm90dG9tOiAwcHg7XG4gICAgICBsZWZ0OiAwcHg7XG4gICAgfVxuICAgIC5yYWlzZWQtY29udGVudCB7XG4gICAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gICAgfVxuICAgIC56RGVwdGgtMCB7XG4gICAgICBib3gtc2hhZG93OiBub25lO1xuICAgIH1cbiAgICAuekRlcHRoLTEge1xuICAgICAgYm94LXNoYWRvdzogMCAycHggMTBweCByZ2JhKDAsMCwwLC4xMiksIDAgMnB4IDVweCByZ2JhKDAsMCwwLC4xNik7XG4gICAgfVxuICAgIC56RGVwdGgtMiB7XG4gICAgICBib3gtc2hhZG93OiAwIDZweCAyMHB4IHJnYmEoMCwwLDAsLjE5KSwgMCA4cHggMTdweCByZ2JhKDAsMCwwLC4yKTtcbiAgICB9XG4gICAgLnpEZXB0aC0zIHtcbiAgICAgIGJveC1zaGFkb3c6IDAgMTdweCA1MHB4IHJnYmEoMCwwLDAsLjE5KSwgMCAxMnB4IDE1cHggcmdiYSgwLDAsMCwuMjQpO1xuICAgIH1cbiAgICAuekRlcHRoLTQge1xuICAgICAgYm94LXNoYWRvdzogMCAyNXB4IDU1cHggcmdiYSgwLDAsMCwuMjEpLCAwIDE2cHggMjhweCByZ2JhKDAsMCwwLC4yMik7XG4gICAgfVxuICAgIC56RGVwdGgtNSB7XG4gICAgICBib3gtc2hhZG93OiAwIDQwcHggNzdweCByZ2JhKDAsMCwwLC4yMiksIDAgMjdweCAyNHB4IHJnYmEoMCwwLDAsLjIpO1xuICAgIH1cbiAgYF0sXG4gIHByZXNlcnZlV2hpdGVzcGFjZXM6IGZhbHNlLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbn0pXG5leHBvcnQgY2xhc3MgUmFpc2VkQ29tcG9uZW50IHtcbiAgQElucHV0KCkgekRlcHRoOiB6RGVwdGggPSAxO1xuICBASW5wdXQoKSByYWRpdXMgPSAxO1xuICBASW5wdXQoKSBiYWNrZ3JvdW5kID0gJyNmZmYnO1xufVxuXG5ATmdNb2R1bGUoe1xuICBkZWNsYXJhdGlvbnM6IFtSYWlzZWRDb21wb25lbnRdLFxuICBleHBvcnRzOiBbUmFpc2VkQ29tcG9uZW50XSxcbiAgaW1wb3J0czogW0NvbW1vbk1vZHVsZV0sXG59KVxuZXhwb3J0IGNsYXNzIFJhaXNlZE1vZHVsZSB7IH1cbiJdfQ==