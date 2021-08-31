import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, NgModule, } from '@angular/core';
import { AlphaModule, CheckboardModule, ColorWrap, toState } from 'ngx-color';
export class AlphaPickerComponent extends ColorWrap {
    constructor() {
        super();
        /** Pixel value for picker width */
        this.width = 316;
        /** Pixel value for picker height */
        this.height = 16;
        this.direction = 'horizontal';
        this.pointer = {
            width: '18px',
            height: '18px',
            borderRadius: '50%',
            transform: 'translate(-9px, -2px)',
            boxShadow: '0 1px 4px 0 rgba(0, 0, 0, 0.37)',
        };
    }
    ngOnChanges() {
        if (this.direction === 'vertical') {
            this.pointer.transform = 'translate(-3px, -9px)';
        }
        this.setState(toState(this.color, this.oldHue));
    }
    handlePickerChange({ data, $event }) {
        this.handleChange(data, $event);
    }
}
AlphaPickerComponent.decorators = [
    { type: Component, args: [{
                selector: 'color-alpha-picker',
                template: `
    <div class="alpha-picker {{ className }}"
      [style.width.px]="width" [style.height.px]="height">
      <color-alpha
        [hsl]="hsl"
        [rgb]="rgb"
        [pointer]="pointer"
        [direction]="direction"
        (onChange)="handlePickerChange($event)"
      ></color-alpha>
    </div>
  `,
                changeDetection: ChangeDetectionStrategy.OnPush,
                preserveWhitespaces: false,
                styles: [`
    .alpha-picker {
      position: relative;
    }
    .color-alpha {
      radius: 2px;
    }
  `]
            },] }
];
AlphaPickerComponent.ctorParameters = () => [];
AlphaPickerComponent.propDecorators = {
    width: [{ type: Input }],
    height: [{ type: Input }],
    direction: [{ type: Input }]
};
export class ColorAlphaModule {
}
ColorAlphaModule.decorators = [
    { type: NgModule, args: [{
                declarations: [AlphaPickerComponent],
                exports: [AlphaPickerComponent],
                imports: [CommonModule, AlphaModule, CheckboardModule],
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWxwaGEtcGlja2VyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIuLi8uLi8uLi8uLi9zcmMvbGliL2NvbXBvbmVudHMvYWxwaGEvIiwic291cmNlcyI6WyJhbHBoYS1waWNrZXIuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQ0wsdUJBQXVCLEVBQ3ZCLFNBQVMsRUFDVCxLQUFLLEVBQ0wsUUFBUSxHQUVULE1BQU0sZUFBZSxDQUFDO0FBRXZCLE9BQU8sRUFBRSxXQUFXLEVBQUUsZ0JBQWdCLEVBQUUsU0FBUyxFQUFFLE9BQU8sRUFBRSxNQUFNLFdBQVcsQ0FBQztBQTZCOUUsTUFBTSxPQUFPLG9CQUFxQixTQUFRLFNBQVM7SUFjakQ7UUFDRSxLQUFLLEVBQUUsQ0FBQztRQWRWLG1DQUFtQztRQUMxQixVQUFLLEdBQW9CLEdBQUcsQ0FBQztRQUN0QyxvQ0FBb0M7UUFDM0IsV0FBTSxHQUFvQixFQUFFLENBQUM7UUFDN0IsY0FBUyxHQUE4QixZQUFZLENBQUM7UUFDN0QsWUFBTyxHQUE0QjtZQUNqQyxLQUFLLEVBQUUsTUFBTTtZQUNiLE1BQU0sRUFBRSxNQUFNO1lBQ2QsWUFBWSxFQUFFLEtBQUs7WUFDbkIsU0FBUyxFQUFFLHVCQUF1QjtZQUNsQyxTQUFTLEVBQUUsaUNBQWlDO1NBQzdDLENBQUM7SUFJRixDQUFDO0lBQ0QsV0FBVztRQUNULElBQUksSUFBSSxDQUFDLFNBQVMsS0FBSyxVQUFVLEVBQUU7WUFDakMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEdBQUcsdUJBQXVCLENBQUM7U0FDbEQ7UUFDRCxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0lBQ2xELENBQUM7SUFDRCxrQkFBa0IsQ0FBQyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUU7UUFDakMsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDbEMsQ0FBQzs7O1lBcERGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsb0JBQW9CO2dCQUM5QixRQUFRLEVBQUU7Ozs7Ozs7Ozs7O0dBV1Q7Z0JBV0QsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07Z0JBQy9DLG1CQUFtQixFQUFFLEtBQUs7eUJBVnhCOzs7Ozs7O0dBT0Q7YUFJRjs7OztvQkFHRSxLQUFLO3FCQUVMLEtBQUs7d0JBQ0wsS0FBSzs7QUE0QlIsTUFBTSxPQUFPLGdCQUFnQjs7O1lBTDVCLFFBQVEsU0FBQztnQkFDUixZQUFZLEVBQUUsQ0FBQyxvQkFBb0IsQ0FBQztnQkFDcEMsT0FBTyxFQUFFLENBQUMsb0JBQW9CLENBQUM7Z0JBQy9CLE9BQU8sRUFBRSxDQUFDLFlBQVksRUFBRSxXQUFXLEVBQUUsZ0JBQWdCLENBQUM7YUFDdkQiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENvbXBvbmVudCxcbiAgSW5wdXQsXG4gIE5nTW9kdWxlLFxuICBPbkNoYW5nZXMsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBBbHBoYU1vZHVsZSwgQ2hlY2tib2FyZE1vZHVsZSwgQ29sb3JXcmFwLCB0b1N0YXRlIH0gZnJvbSAnbmd4LWNvbG9yJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnY29sb3ItYWxwaGEtcGlja2VyJyxcbiAgdGVtcGxhdGU6IGBcbiAgICA8ZGl2IGNsYXNzPVwiYWxwaGEtcGlja2VyIHt7IGNsYXNzTmFtZSB9fVwiXG4gICAgICBbc3R5bGUud2lkdGgucHhdPVwid2lkdGhcIiBbc3R5bGUuaGVpZ2h0LnB4XT1cImhlaWdodFwiPlxuICAgICAgPGNvbG9yLWFscGhhXG4gICAgICAgIFtoc2xdPVwiaHNsXCJcbiAgICAgICAgW3JnYl09XCJyZ2JcIlxuICAgICAgICBbcG9pbnRlcl09XCJwb2ludGVyXCJcbiAgICAgICAgW2RpcmVjdGlvbl09XCJkaXJlY3Rpb25cIlxuICAgICAgICAob25DaGFuZ2UpPVwiaGFuZGxlUGlja2VyQ2hhbmdlKCRldmVudClcIlxuICAgICAgPjwvY29sb3ItYWxwaGE+XG4gICAgPC9kaXY+XG4gIGAsXG4gIHN0eWxlczogW1xuICAgIGBcbiAgICAuYWxwaGEtcGlja2VyIHtcbiAgICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgICB9XG4gICAgLmNvbG9yLWFscGhhIHtcbiAgICAgIHJhZGl1czogMnB4O1xuICAgIH1cbiAgYCxcbiAgXSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIHByZXNlcnZlV2hpdGVzcGFjZXM6IGZhbHNlLFxufSlcbmV4cG9ydCBjbGFzcyBBbHBoYVBpY2tlckNvbXBvbmVudCBleHRlbmRzIENvbG9yV3JhcCBpbXBsZW1lbnRzIE9uQ2hhbmdlcyB7XG4gIC8qKiBQaXhlbCB2YWx1ZSBmb3IgcGlja2VyIHdpZHRoICovXG4gIEBJbnB1dCgpIHdpZHRoOiBzdHJpbmcgfCBudW1iZXIgPSAzMTY7XG4gIC8qKiBQaXhlbCB2YWx1ZSBmb3IgcGlja2VyIGhlaWdodCAqL1xuICBASW5wdXQoKSBoZWlnaHQ6IHN0cmluZyB8IG51bWJlciA9IDE2O1xuICBASW5wdXQoKSBkaXJlY3Rpb246ICdob3Jpem9udGFsJyB8ICd2ZXJ0aWNhbCcgPSAnaG9yaXpvbnRhbCc7XG4gIHBvaW50ZXI6IHtba2V5OiBzdHJpbmddOiBzdHJpbmd9ID0ge1xuICAgIHdpZHRoOiAnMThweCcsXG4gICAgaGVpZ2h0OiAnMThweCcsXG4gICAgYm9yZGVyUmFkaXVzOiAnNTAlJyxcbiAgICB0cmFuc2Zvcm06ICd0cmFuc2xhdGUoLTlweCwgLTJweCknLFxuICAgIGJveFNoYWRvdzogJzAgMXB4IDRweCAwIHJnYmEoMCwgMCwgMCwgMC4zNyknLFxuICB9O1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG4gIH1cbiAgbmdPbkNoYW5nZXMoKSB7XG4gICAgaWYgKHRoaXMuZGlyZWN0aW9uID09PSAndmVydGljYWwnKSB7XG4gICAgICB0aGlzLnBvaW50ZXIudHJhbnNmb3JtID0gJ3RyYW5zbGF0ZSgtM3B4LCAtOXB4KSc7XG4gICAgfVxuICAgIHRoaXMuc2V0U3RhdGUodG9TdGF0ZSh0aGlzLmNvbG9yLCB0aGlzLm9sZEh1ZSkpO1xuICB9XG4gIGhhbmRsZVBpY2tlckNoYW5nZSh7IGRhdGEsICRldmVudCB9KSB7XG4gICAgdGhpcy5oYW5kbGVDaGFuZ2UoZGF0YSwgJGV2ZW50KTtcbiAgfVxufVxuXG5ATmdNb2R1bGUoe1xuICBkZWNsYXJhdGlvbnM6IFtBbHBoYVBpY2tlckNvbXBvbmVudF0sXG4gIGV4cG9ydHM6IFtBbHBoYVBpY2tlckNvbXBvbmVudF0sXG4gIGltcG9ydHM6IFtDb21tb25Nb2R1bGUsIEFscGhhTW9kdWxlLCBDaGVja2JvYXJkTW9kdWxlXSxcbn0pXG5leHBvcnQgY2xhc3MgQ29sb3JBbHBoYU1vZHVsZSB7fVxuIl19