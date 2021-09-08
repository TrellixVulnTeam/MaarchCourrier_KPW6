import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
export class SwatchesGroupComponent {
    constructor() {
        this.onClick = new EventEmitter();
        this.onSwatchHover = new EventEmitter();
    }
}
SwatchesGroupComponent.decorators = [
    { type: Component, args: [{
                selector: 'color-swatches-group',
                template: `
    <div class="swatches-group">
      <color-swatches-color
        *ngFor="let color of group; let idx = index"
        [active]="color.toLowerCase() === active"
        [color]="color"
        [first]="idx === 0"
        [last]="idx === group.length - 1"
        (onClick)="onClick.emit($event)"
      >
      </color-swatches-color>
    </div>
  `,
                changeDetection: ChangeDetectionStrategy.OnPush,
                preserveWhitespaces: false,
                styles: [`
      .swatches-group {
        padding-bottom: 10px;
        width: 40px;
        float: left;
        margin-right: 10px;
      }
    `]
            },] }
];
SwatchesGroupComponent.propDecorators = {
    group: [{ type: Input }],
    active: [{ type: Input }],
    onClick: [{ type: Output }],
    onSwatchHover: [{ type: Output }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3dhdGNoZXMtZ3JvdXAuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Ii4uLy4uLy4uLy4uL3NyYy9saWIvY29tcG9uZW50cy9zd2F0Y2hlcy8iLCJzb3VyY2VzIjpbInN3YXRjaGVzLWdyb3VwLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBOEJoRyxNQUFNLE9BQU8sc0JBQXNCO0lBNUJuQztRQStCWSxZQUFPLEdBQUcsSUFBSSxZQUFZLEVBQU8sQ0FBQztRQUNsQyxrQkFBYSxHQUFHLElBQUksWUFBWSxFQUFPLENBQUM7SUFDcEQsQ0FBQzs7O1lBakNBLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsc0JBQXNCO2dCQUNoQyxRQUFRLEVBQUU7Ozs7Ozs7Ozs7OztHQVlUO2dCQVdELGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNO2dCQUMvQyxtQkFBbUIsRUFBRSxLQUFLO3lCQVZ4Qjs7Ozs7OztLQU9DO2FBSUo7OztvQkFFRSxLQUFLO3FCQUNMLEtBQUs7c0JBQ0wsTUFBTTs0QkFDTixNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksIENvbXBvbmVudCwgRXZlbnRFbWl0dGVyLCBJbnB1dCwgT3V0cHV0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2NvbG9yLXN3YXRjaGVzLWdyb3VwJyxcbiAgdGVtcGxhdGU6IGBcbiAgICA8ZGl2IGNsYXNzPVwic3dhdGNoZXMtZ3JvdXBcIj5cbiAgICAgIDxjb2xvci1zd2F0Y2hlcy1jb2xvclxuICAgICAgICAqbmdGb3I9XCJsZXQgY29sb3Igb2YgZ3JvdXA7IGxldCBpZHggPSBpbmRleFwiXG4gICAgICAgIFthY3RpdmVdPVwiY29sb3IudG9Mb3dlckNhc2UoKSA9PT0gYWN0aXZlXCJcbiAgICAgICAgW2NvbG9yXT1cImNvbG9yXCJcbiAgICAgICAgW2ZpcnN0XT1cImlkeCA9PT0gMFwiXG4gICAgICAgIFtsYXN0XT1cImlkeCA9PT0gZ3JvdXAubGVuZ3RoIC0gMVwiXG4gICAgICAgIChvbkNsaWNrKT1cIm9uQ2xpY2suZW1pdCgkZXZlbnQpXCJcbiAgICAgID5cbiAgICAgIDwvY29sb3Itc3dhdGNoZXMtY29sb3I+XG4gICAgPC9kaXY+XG4gIGAsXG4gIHN0eWxlczogW1xuICAgIGBcbiAgICAgIC5zd2F0Y2hlcy1ncm91cCB7XG4gICAgICAgIHBhZGRpbmctYm90dG9tOiAxMHB4O1xuICAgICAgICB3aWR0aDogNDBweDtcbiAgICAgICAgZmxvYXQ6IGxlZnQ7XG4gICAgICAgIG1hcmdpbi1yaWdodDogMTBweDtcbiAgICAgIH1cbiAgICBgLFxuICBdLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgcHJlc2VydmVXaGl0ZXNwYWNlczogZmFsc2UsXG59KVxuZXhwb3J0IGNsYXNzIFN3YXRjaGVzR3JvdXBDb21wb25lbnQge1xuICBASW5wdXQoKSBncm91cCE6IHN0cmluZ1tdO1xuICBASW5wdXQoKSBhY3RpdmUhOiBzdHJpbmc7XG4gIEBPdXRwdXQoKSBvbkNsaWNrID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG4gIEBPdXRwdXQoKSBvblN3YXRjaEhvdmVyID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG59XG4iXX0=