import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, } from '@angular/core';
import { getContrastingColor } from 'ngx-color';
export class CompactColorComponent {
    constructor() {
        this.onClick = new EventEmitter();
        this.onSwatchHover = new EventEmitter();
        this.swatchStyle = {
            width: '15px',
            height: '15px',
            float: 'left',
            marginRight: '5px',
            marginBottom: '5px',
            position: 'relative',
            cursor: 'pointer',
        };
        this.swatchFocus = {};
        this.getContrastingColor = getContrastingColor;
    }
    ngOnChanges() {
        this.swatchStyle.background = this.color;
        this.swatchFocus.boxShadow = `0 0 4px ${this.color}`;
        if (this.color.toLowerCase() === '#ffffff') {
            this.swatchStyle.boxShadow = 'inset 0 0 0 1px #ddd';
        }
    }
    handleClick({ hex, $event }) {
        this.onClick.emit({ hex, $event });
    }
}
CompactColorComponent.decorators = [
    { type: Component, args: [{
                selector: 'color-compact-color',
                template: `
  <div class="compact-color">
    <color-swatch class="swatch"
      [color]="color" [style]="swatchStyle"
      [focusStyle]="swatchFocus"
      (onClick)="handleClick($event)" (onHover)="onSwatchHover.emit($event)"
      >
      <div class="compact-dot"
        [class.active]="active" [style.background]="getContrastingColor(color)"
      ></div>
    </color-swatch>
  </div>
  `,
                changeDetection: ChangeDetectionStrategy.OnPush,
                preserveWhitespaces: false,
                styles: [`
  .compact-dot {
    position: absolute;
    top: 5px;
    right: 5px;
    bottom: 5px;
    left: 5px;
    border-radius: 50%;
    opacity: 0;
  }
  .compact-dot.active {
    opacity: 1;
  }
  `]
            },] }
];
CompactColorComponent.propDecorators = {
    color: [{ type: Input }],
    active: [{ type: Input }],
    onClick: [{ type: Output }],
    onSwatchHover: [{ type: Output }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGFjdC1jb2xvci5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiLi4vLi4vLi4vLi4vc3JjL2xpYi9jb21wb25lbnRzL2NvbXBhY3QvIiwic291cmNlcyI6WyJjb21wYWN0LWNvbG9yLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQ0wsdUJBQXVCLEVBQ3ZCLFNBQVMsRUFDVCxZQUFZLEVBQ1osS0FBSyxFQUVMLE1BQU0sR0FDUCxNQUFNLGVBQWUsQ0FBQztBQUV2QixPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxXQUFXLENBQUM7QUFvQ2hELE1BQU0sT0FBTyxxQkFBcUI7SUFsQ2xDO1FBcUNZLFlBQU8sR0FBRyxJQUFJLFlBQVksRUFBTyxDQUFDO1FBQ2xDLGtCQUFhLEdBQUcsSUFBSSxZQUFZLEVBQU8sQ0FBQztRQUNsRCxnQkFBVyxHQUEyQjtZQUNwQyxLQUFLLEVBQUUsTUFBTTtZQUNiLE1BQU0sRUFBRSxNQUFNO1lBQ2QsS0FBSyxFQUFFLE1BQU07WUFDYixXQUFXLEVBQUUsS0FBSztZQUNsQixZQUFZLEVBQUUsS0FBSztZQUNuQixRQUFRLEVBQUUsVUFBVTtZQUNwQixNQUFNLEVBQUUsU0FBUztTQUNsQixDQUFDO1FBQ0YsZ0JBQVcsR0FBMkIsRUFBRSxDQUFDO1FBQ3pDLHdCQUFtQixHQUFHLG1CQUFtQixDQUFDO0lBWTVDLENBQUM7SUFWQyxXQUFXO1FBQ1QsSUFBSSxDQUFDLFdBQVcsQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztRQUN6QyxJQUFJLENBQUMsV0FBVyxDQUFDLFNBQVMsR0FBRyxXQUFXLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUNyRCxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxFQUFFLEtBQUssU0FBUyxFQUFFO1lBQzFDLElBQUksQ0FBQyxXQUFXLENBQUMsU0FBUyxHQUFHLHNCQUFzQixDQUFDO1NBQ3JEO0lBQ0gsQ0FBQztJQUNELFdBQVcsQ0FBQyxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUU7UUFDekIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQztJQUNyQyxDQUFDOzs7WUE1REYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxxQkFBcUI7Z0JBQy9CLFFBQVEsRUFBRTs7Ozs7Ozs7Ozs7O0dBWVQ7Z0JBaUJELGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNO2dCQUMvQyxtQkFBbUIsRUFBRSxLQUFLO3lCQWhCeEI7Ozs7Ozs7Ozs7Ozs7R0FhRDthQUlGOzs7b0JBRUUsS0FBSztxQkFDTCxLQUFLO3NCQUNMLE1BQU07NEJBQ04sTUFBTSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDb21wb25lbnQsXG4gIEV2ZW50RW1pdHRlcixcbiAgSW5wdXQsXG4gIE9uQ2hhbmdlcyxcbiAgT3V0cHV0LFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgZ2V0Q29udHJhc3RpbmdDb2xvciB9IGZyb20gJ25neC1jb2xvcic7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2NvbG9yLWNvbXBhY3QtY29sb3InLFxuICB0ZW1wbGF0ZTogYFxuICA8ZGl2IGNsYXNzPVwiY29tcGFjdC1jb2xvclwiPlxuICAgIDxjb2xvci1zd2F0Y2ggY2xhc3M9XCJzd2F0Y2hcIlxuICAgICAgW2NvbG9yXT1cImNvbG9yXCIgW3N0eWxlXT1cInN3YXRjaFN0eWxlXCJcbiAgICAgIFtmb2N1c1N0eWxlXT1cInN3YXRjaEZvY3VzXCJcbiAgICAgIChvbkNsaWNrKT1cImhhbmRsZUNsaWNrKCRldmVudClcIiAob25Ib3Zlcik9XCJvblN3YXRjaEhvdmVyLmVtaXQoJGV2ZW50KVwiXG4gICAgICA+XG4gICAgICA8ZGl2IGNsYXNzPVwiY29tcGFjdC1kb3RcIlxuICAgICAgICBbY2xhc3MuYWN0aXZlXT1cImFjdGl2ZVwiIFtzdHlsZS5iYWNrZ3JvdW5kXT1cImdldENvbnRyYXN0aW5nQ29sb3IoY29sb3IpXCJcbiAgICAgID48L2Rpdj5cbiAgICA8L2NvbG9yLXN3YXRjaD5cbiAgPC9kaXY+XG4gIGAsXG4gIHN0eWxlczogW1xuICAgIGBcbiAgLmNvbXBhY3QtZG90IHtcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgdG9wOiA1cHg7XG4gICAgcmlnaHQ6IDVweDtcbiAgICBib3R0b206IDVweDtcbiAgICBsZWZ0OiA1cHg7XG4gICAgYm9yZGVyLXJhZGl1czogNTAlO1xuICAgIG9wYWNpdHk6IDA7XG4gIH1cbiAgLmNvbXBhY3QtZG90LmFjdGl2ZSB7XG4gICAgb3BhY2l0eTogMTtcbiAgfVxuICBgLFxuICBdLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgcHJlc2VydmVXaGl0ZXNwYWNlczogZmFsc2UsXG59KVxuZXhwb3J0IGNsYXNzIENvbXBhY3RDb2xvckNvbXBvbmVudCBpbXBsZW1lbnRzIE9uQ2hhbmdlcyB7XG4gIEBJbnB1dCgpIGNvbG9yITogc3RyaW5nO1xuICBASW5wdXQoKSBhY3RpdmUhOiBib29sZWFuO1xuICBAT3V0cHV0KCkgb25DbGljayA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICBAT3V0cHV0KCkgb25Td2F0Y2hIb3ZlciA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICBzd2F0Y2hTdHlsZTogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHtcbiAgICB3aWR0aDogJzE1cHgnLFxuICAgIGhlaWdodDogJzE1cHgnLFxuICAgIGZsb2F0OiAnbGVmdCcsXG4gICAgbWFyZ2luUmlnaHQ6ICc1cHgnLFxuICAgIG1hcmdpbkJvdHRvbTogJzVweCcsXG4gICAgcG9zaXRpb246ICdyZWxhdGl2ZScsXG4gICAgY3Vyc29yOiAncG9pbnRlcicsXG4gIH07XG4gIHN3YXRjaEZvY3VzOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge307XG4gIGdldENvbnRyYXN0aW5nQ29sb3IgPSBnZXRDb250cmFzdGluZ0NvbG9yO1xuXG4gIG5nT25DaGFuZ2VzKCkge1xuICAgIHRoaXMuc3dhdGNoU3R5bGUuYmFja2dyb3VuZCA9IHRoaXMuY29sb3I7XG4gICAgdGhpcy5zd2F0Y2hGb2N1cy5ib3hTaGFkb3cgPSBgMCAwIDRweCAke3RoaXMuY29sb3J9YDtcbiAgICBpZiAodGhpcy5jb2xvci50b0xvd2VyQ2FzZSgpID09PSAnI2ZmZmZmZicpIHtcbiAgICAgIHRoaXMuc3dhdGNoU3R5bGUuYm94U2hhZG93ID0gJ2luc2V0IDAgMCAwIDFweCAjZGRkJztcbiAgICB9XG4gIH1cbiAgaGFuZGxlQ2xpY2soeyBoZXgsICRldmVudCB9KSB7XG4gICAgdGhpcy5vbkNsaWNrLmVtaXQoeyBoZXgsICRldmVudCB9KTtcbiAgfVxufVxuIl19