import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, NgModule, Output, } from '@angular/core';
import { CheckboardModule } from './checkboard.component';
export class SwatchComponent {
    constructor() {
        this.style = {};
        this.focusStyle = {};
        this.onClick = new EventEmitter();
        this.onHover = new EventEmitter();
        this.divStyles = {};
        this.focusStyles = {};
        this.inFocus = false;
    }
    ngOnInit() {
        this.divStyles = Object.assign({ background: this.color }, this.style);
    }
    currentStyles() {
        this.focusStyles = Object.assign(Object.assign({}, this.divStyles), this.focusStyle);
        return this.focus || this.inFocus ? this.focusStyles : this.divStyles;
    }
    handleFocusOut() {
        this.inFocus = false;
    }
    handleFocus() {
        this.inFocus = true;
    }
    handleHover(hex, $event) {
        this.onHover.emit({ hex, $event });
    }
    handleClick(hex, $event) {
        this.onClick.emit({ hex, $event });
    }
}
SwatchComponent.decorators = [
    { type: Component, args: [{
                selector: 'color-swatch',
                template: `
    <div
      class="swatch"
      [ngStyle]="currentStyles()"
      [attr.title]="color"
      (click)="handleClick(color, $event)"
      (keydown.enter)="handleClick(color, $event)"
      (focus)="handleFocus()"
      (blur)="handleFocusOut()"
      (mouseover)="handleHover(color, $event)"
      tabindex="0"
    >
      <ng-content></ng-content>
      <color-checkboard
        *ngIf="color === 'transparent'"
        boxShadow="inset 0 0 0 1px rgba(0,0,0,0.1)"
      ></color-checkboard>
    </div>
  `,
                changeDetection: ChangeDetectionStrategy.OnPush,
                styles: [`
      .swatch {
        outline: none;
        height: 100%;
        width: 100%;
        cursor: pointer;
        position: relative;
      }
    `]
            },] }
];
SwatchComponent.propDecorators = {
    color: [{ type: Input }],
    style: [{ type: Input }],
    focusStyle: [{ type: Input }],
    focus: [{ type: Input }],
    onClick: [{ type: Output }],
    onHover: [{ type: Output }]
};
export class SwatchModule {
}
SwatchModule.decorators = [
    { type: NgModule, args: [{
                declarations: [SwatchComponent],
                exports: [SwatchComponent],
                imports: [CommonModule, CheckboardModule],
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3dhdGNoLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIuLi8uLi8uLi9zcmMvbGliL2NvbW1vbi8iLCJzb3VyY2VzIjpbInN3YXRjaC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFDTCx1QkFBdUIsRUFDdkIsU0FBUyxFQUNULFlBQVksRUFDWixLQUFLLEVBQ0wsUUFBUSxFQUVSLE1BQU0sR0FDUCxNQUFNLGVBQWUsQ0FBQztBQUV2QixPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQW9DMUQsTUFBTSxPQUFPLGVBQWU7SUFsQzVCO1FBb0NXLFVBQUssR0FBMkIsRUFBRSxDQUFDO1FBQ25DLGVBQVUsR0FBMkIsRUFBRSxDQUFDO1FBRXZDLFlBQU8sR0FBRyxJQUFJLFlBQVksRUFBTyxDQUFDO1FBQ2xDLFlBQU8sR0FBRyxJQUFJLFlBQVksRUFBTyxDQUFDO1FBQzVDLGNBQVMsR0FBMkIsRUFBRSxDQUFDO1FBQ3ZDLGdCQUFXLEdBQTJCLEVBQUUsQ0FBQztRQUN6QyxZQUFPLEdBQUcsS0FBSyxDQUFDO0lBMkJsQixDQUFDO0lBekJDLFFBQVE7UUFDTixJQUFJLENBQUMsU0FBUyxtQkFDWixVQUFVLEVBQUUsSUFBSSxDQUFDLEtBQWUsSUFDN0IsSUFBSSxDQUFDLEtBQUssQ0FDZCxDQUFDO0lBQ0osQ0FBQztJQUNELGFBQWE7UUFDWCxJQUFJLENBQUMsV0FBVyxtQ0FDWCxJQUFJLENBQUMsU0FBUyxHQUNkLElBQUksQ0FBQyxVQUFVLENBQ25CLENBQUM7UUFDRixPQUFPLElBQUksQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQztJQUN4RSxDQUFDO0lBQ0QsY0FBYztRQUNaLElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDO0lBQ3ZCLENBQUM7SUFDRCxXQUFXO1FBQ1QsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7SUFDdEIsQ0FBQztJQUNELFdBQVcsQ0FBQyxHQUFXLEVBQUUsTUFBTTtRQUM3QixJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDO0lBQ3JDLENBQUM7SUFDRCxXQUFXLENBQUMsR0FBVyxFQUFFLE1BQU07UUFDN0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQztJQUNyQyxDQUFDOzs7WUFyRUYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxjQUFjO2dCQUN4QixRQUFRLEVBQUU7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQWtCVDtnQkFZRCxlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTt5QkFWN0M7Ozs7Ozs7O0tBUUM7YUFHSjs7O29CQUVFLEtBQUs7b0JBQ0wsS0FBSzt5QkFDTCxLQUFLO29CQUNMLEtBQUs7c0JBQ0wsTUFBTTtzQkFDTixNQUFNOztBQXFDVCxNQUFNLE9BQU8sWUFBWTs7O1lBTHhCLFFBQVEsU0FBQztnQkFDUixZQUFZLEVBQUUsQ0FBQyxlQUFlLENBQUM7Z0JBQy9CLE9BQU8sRUFBRSxDQUFDLGVBQWUsQ0FBQztnQkFDMUIsT0FBTyxFQUFFLENBQUMsWUFBWSxFQUFFLGdCQUFnQixDQUFDO2FBQzFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7XG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDb21wb25lbnQsXG4gIEV2ZW50RW1pdHRlcixcbiAgSW5wdXQsXG4gIE5nTW9kdWxlLFxuICBPbkluaXQsXG4gIE91dHB1dCxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IENoZWNrYm9hcmRNb2R1bGUgfSBmcm9tICcuL2NoZWNrYm9hcmQuY29tcG9uZW50JztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnY29sb3Itc3dhdGNoJyxcbiAgdGVtcGxhdGU6IGBcbiAgICA8ZGl2XG4gICAgICBjbGFzcz1cInN3YXRjaFwiXG4gICAgICBbbmdTdHlsZV09XCJjdXJyZW50U3R5bGVzKClcIlxuICAgICAgW2F0dHIudGl0bGVdPVwiY29sb3JcIlxuICAgICAgKGNsaWNrKT1cImhhbmRsZUNsaWNrKGNvbG9yLCAkZXZlbnQpXCJcbiAgICAgIChrZXlkb3duLmVudGVyKT1cImhhbmRsZUNsaWNrKGNvbG9yLCAkZXZlbnQpXCJcbiAgICAgIChmb2N1cyk9XCJoYW5kbGVGb2N1cygpXCJcbiAgICAgIChibHVyKT1cImhhbmRsZUZvY3VzT3V0KClcIlxuICAgICAgKG1vdXNlb3Zlcik9XCJoYW5kbGVIb3Zlcihjb2xvciwgJGV2ZW50KVwiXG4gICAgICB0YWJpbmRleD1cIjBcIlxuICAgID5cbiAgICAgIDxuZy1jb250ZW50PjwvbmctY29udGVudD5cbiAgICAgIDxjb2xvci1jaGVja2JvYXJkXG4gICAgICAgICpuZ0lmPVwiY29sb3IgPT09ICd0cmFuc3BhcmVudCdcIlxuICAgICAgICBib3hTaGFkb3c9XCJpbnNldCAwIDAgMCAxcHggcmdiYSgwLDAsMCwwLjEpXCJcbiAgICAgID48L2NvbG9yLWNoZWNrYm9hcmQ+XG4gICAgPC9kaXY+XG4gIGAsXG4gIHN0eWxlczogW1xuICAgIGBcbiAgICAgIC5zd2F0Y2gge1xuICAgICAgICBvdXRsaW5lOiBub25lO1xuICAgICAgICBoZWlnaHQ6IDEwMCU7XG4gICAgICAgIHdpZHRoOiAxMDAlO1xuICAgICAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgICAgIH1cbiAgICBgLFxuICBdLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbn0pXG5leHBvcnQgY2xhc3MgU3dhdGNoQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcbiAgQElucHV0KCkgY29sb3IhOiBzdHJpbmc7XG4gIEBJbnB1dCgpIHN0eWxlOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge307XG4gIEBJbnB1dCgpIGZvY3VzU3R5bGU6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7fTtcbiAgQElucHV0KCkgZm9jdXMhOiBib29sZWFuO1xuICBAT3V0cHV0KCkgb25DbGljayA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICBAT3V0cHV0KCkgb25Ib3ZlciA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICBkaXZTdHlsZXM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7fTtcbiAgZm9jdXNTdHlsZXM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7fTtcbiAgaW5Gb2N1cyA9IGZhbHNlO1xuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMuZGl2U3R5bGVzID0ge1xuICAgICAgYmFja2dyb3VuZDogdGhpcy5jb2xvciBhcyBzdHJpbmcsXG4gICAgICAuLi50aGlzLnN0eWxlLFxuICAgIH07XG4gIH1cbiAgY3VycmVudFN0eWxlcygpIHtcbiAgICB0aGlzLmZvY3VzU3R5bGVzID0ge1xuICAgICAgLi4udGhpcy5kaXZTdHlsZXMsXG4gICAgICAuLi50aGlzLmZvY3VzU3R5bGUsXG4gICAgfTtcbiAgICByZXR1cm4gdGhpcy5mb2N1cyB8fCB0aGlzLmluRm9jdXMgPyB0aGlzLmZvY3VzU3R5bGVzIDogdGhpcy5kaXZTdHlsZXM7XG4gIH1cbiAgaGFuZGxlRm9jdXNPdXQoKSB7XG4gICAgdGhpcy5pbkZvY3VzID0gZmFsc2U7XG4gIH1cbiAgaGFuZGxlRm9jdXMoKSB7XG4gICAgdGhpcy5pbkZvY3VzID0gdHJ1ZTtcbiAgfVxuICBoYW5kbGVIb3ZlcihoZXg6IHN0cmluZywgJGV2ZW50KSB7XG4gICAgdGhpcy5vbkhvdmVyLmVtaXQoeyBoZXgsICRldmVudCB9KTtcbiAgfVxuICBoYW5kbGVDbGljayhoZXg6IHN0cmluZywgJGV2ZW50KSB7XG4gICAgdGhpcy5vbkNsaWNrLmVtaXQoeyBoZXgsICRldmVudCB9KTtcbiAgfVxufVxuXG5ATmdNb2R1bGUoe1xuICBkZWNsYXJhdGlvbnM6IFtTd2F0Y2hDb21wb25lbnRdLFxuICBleHBvcnRzOiBbU3dhdGNoQ29tcG9uZW50XSxcbiAgaW1wb3J0czogW0NvbW1vbk1vZHVsZSwgQ2hlY2tib2FyZE1vZHVsZV0sXG59KVxuZXhwb3J0IGNsYXNzIFN3YXRjaE1vZHVsZSB7fVxuIl19