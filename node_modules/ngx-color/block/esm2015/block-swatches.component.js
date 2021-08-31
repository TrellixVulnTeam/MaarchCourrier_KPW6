import { Component, EventEmitter, Input, Output } from '@angular/core';
export class BlockSwatchesComponent {
    constructor() {
        this.onClick = new EventEmitter();
        this.onSwatchHover = new EventEmitter();
    }
    ngOnInit() {
        this.swatchStyle = {
            width: '22px',
            height: '22px',
            float: 'left',
            marginRight: '10px',
            marginBottom: '10px',
            borderRadius: '4px',
        };
    }
    handleClick({ hex, $event }) {
        this.onClick.emit({ hex, $event });
    }
    focusStyle(c) {
        return {
            boxShadow: `${c} 0 0 4px`,
        };
    }
}
BlockSwatchesComponent.decorators = [
    { type: Component, args: [{
                selector: 'color-block-swatches',
                template: `
    <div class="block-swatches">
      <color-swatch
        *ngFor="let c of colors"
        [color]="c"
        [style]="swatchStyle"
        [focusStyle]="focusStyle(c)"
        (onClick)="handleClick($event)"
        (onHover)="onSwatchHover.emit($event)"
      ></color-swatch>
      <div class="clear"></div>
    </div>
  `,
                styles: [`
    .block-swatches {
      margin-right: -10px;
    }
    .clear {
      clear: both;
    }
  `]
            },] }
];
BlockSwatchesComponent.ctorParameters = () => [];
BlockSwatchesComponent.propDecorators = {
    colors: [{ type: Input }],
    onClick: [{ type: Output }],
    onSwatchHover: [{ type: Output }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmxvY2stc3dhdGNoZXMuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Ii4uLy4uLy4uLy4uL3NyYy9saWIvY29tcG9uZW50cy9ibG9jay8iLCJzb3VyY2VzIjpbImJsb2NrLXN3YXRjaGVzLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQVUsTUFBTSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBNEIvRSxNQUFNLE9BQU8sc0JBQXNCO0lBTWpDO1FBSlUsWUFBTyxHQUFHLElBQUksWUFBWSxFQUFPLENBQUM7UUFDbEMsa0JBQWEsR0FBRyxJQUFJLFlBQVksRUFBTyxDQUFDO0lBR2xDLENBQUM7SUFFakIsUUFBUTtRQUNOLElBQUksQ0FBQyxXQUFXLEdBQUc7WUFDakIsS0FBSyxFQUFFLE1BQU07WUFDYixNQUFNLEVBQUUsTUFBTTtZQUNkLEtBQUssRUFBRSxNQUFNO1lBQ2IsV0FBVyxFQUFFLE1BQU07WUFDbkIsWUFBWSxFQUFFLE1BQU07WUFDcEIsWUFBWSxFQUFFLEtBQUs7U0FDcEIsQ0FBQztJQUNKLENBQUM7SUFDRCxXQUFXLENBQUMsRUFBQyxHQUFHLEVBQUUsTUFBTSxFQUFDO1FBQ3ZCLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUMsR0FBRyxFQUFFLE1BQU0sRUFBQyxDQUFDLENBQUM7SUFDbkMsQ0FBQztJQUNELFVBQVUsQ0FBQyxDQUFDO1FBQ1YsT0FBTztZQUNMLFNBQVMsRUFBRSxHQUFJLENBQUUsVUFBVTtTQUM1QixDQUFDO0lBQ0osQ0FBQzs7O1lBakRGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsc0JBQXNCO2dCQUNoQyxRQUFRLEVBQUU7Ozs7Ozs7Ozs7OztHQVlUO3lCQUNROzs7Ozs7O0dBT1I7YUFDRjs7OztxQkFFRSxLQUFLO3NCQUNMLE1BQU07NEJBQ04sTUFBTSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgRXZlbnRFbWl0dGVyLCBJbnB1dCwgT25Jbml0LCBPdXRwdXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgU2hhcGUgfSBmcm9tICduZ3gtY29sb3InO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdjb2xvci1ibG9jay1zd2F0Y2hlcycsXG4gIHRlbXBsYXRlOiBgXG4gICAgPGRpdiBjbGFzcz1cImJsb2NrLXN3YXRjaGVzXCI+XG4gICAgICA8Y29sb3Itc3dhdGNoXG4gICAgICAgICpuZ0Zvcj1cImxldCBjIG9mIGNvbG9yc1wiXG4gICAgICAgIFtjb2xvcl09XCJjXCJcbiAgICAgICAgW3N0eWxlXT1cInN3YXRjaFN0eWxlXCJcbiAgICAgICAgW2ZvY3VzU3R5bGVdPVwiZm9jdXNTdHlsZShjKVwiXG4gICAgICAgIChvbkNsaWNrKT1cImhhbmRsZUNsaWNrKCRldmVudClcIlxuICAgICAgICAob25Ib3Zlcik9XCJvblN3YXRjaEhvdmVyLmVtaXQoJGV2ZW50KVwiXG4gICAgICA+PC9jb2xvci1zd2F0Y2g+XG4gICAgICA8ZGl2IGNsYXNzPVwiY2xlYXJcIj48L2Rpdj5cbiAgICA8L2Rpdj5cbiAgYCxcbiAgc3R5bGVzOiBbYFxuICAgIC5ibG9jay1zd2F0Y2hlcyB7XG4gICAgICBtYXJnaW4tcmlnaHQ6IC0xMHB4O1xuICAgIH1cbiAgICAuY2xlYXIge1xuICAgICAgY2xlYXI6IGJvdGg7XG4gICAgfVxuICBgXSxcbn0pXG5leHBvcnQgY2xhc3MgQmxvY2tTd2F0Y2hlc0NvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG4gIEBJbnB1dCgpIGNvbG9ycyE6IHN0cmluZ1tdIHwgU2hhcGVbXTtcbiAgQE91dHB1dCgpIG9uQ2xpY2sgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcbiAgQE91dHB1dCgpIG9uU3dhdGNoSG92ZXIgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcbiAgc3dhdGNoU3R5bGU/OiB7W2tleTogc3RyaW5nXTogc3RyaW5nfTtcblxuICBjb25zdHJ1Y3RvcigpIHsgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMuc3dhdGNoU3R5bGUgPSB7XG4gICAgICB3aWR0aDogJzIycHgnLFxuICAgICAgaGVpZ2h0OiAnMjJweCcsXG4gICAgICBmbG9hdDogJ2xlZnQnLFxuICAgICAgbWFyZ2luUmlnaHQ6ICcxMHB4JyxcbiAgICAgIG1hcmdpbkJvdHRvbTogJzEwcHgnLFxuICAgICAgYm9yZGVyUmFkaXVzOiAnNHB4JyxcbiAgICB9O1xuICB9XG4gIGhhbmRsZUNsaWNrKHtoZXgsICRldmVudH0pIHtcbiAgICB0aGlzLm9uQ2xpY2suZW1pdCh7aGV4LCAkZXZlbnR9KTtcbiAgfVxuICBmb2N1c1N0eWxlKGMpIHtcbiAgICByZXR1cm4ge1xuICAgICAgYm94U2hhZG93OiBgJHsgYyB9IDAgMCA0cHhgLFxuICAgIH07XG4gIH1cblxufVxuIl19