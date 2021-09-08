import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, NgModule, } from '@angular/core';
import { getCheckerboard } from './helpers/checkboard';
export class CheckboardComponent {
    constructor() {
        this.white = 'transparent';
        this.size = 8;
        this.grey = 'rgba(0,0,0,.08)';
    }
    ngOnInit() {
        const background = getCheckerboard(this.white, this.grey, this.size);
        this.gridStyles = {
            borderRadius: this.borderRadius,
            boxShadow: this.boxShadow,
            background: `url(${background}) center left`,
        };
    }
}
CheckboardComponent.decorators = [
    { type: Component, args: [{
                selector: 'color-checkboard',
                template: `<div class="grid" [ngStyle]="gridStyles"></div>`,
                preserveWhitespaces: false,
                changeDetection: ChangeDetectionStrategy.OnPush,
                styles: [`
  .grid {
    top: 0px;
    right: 0px;
    bottom: 0px;
    left: 0px;
    position: absolute;
  }
  `]
            },] }
];
CheckboardComponent.propDecorators = {
    white: [{ type: Input }],
    size: [{ type: Input }],
    grey: [{ type: Input }],
    boxShadow: [{ type: Input }],
    borderRadius: [{ type: Input }]
};
export class CheckboardModule {
}
CheckboardModule.decorators = [
    { type: NgModule, args: [{
                declarations: [CheckboardComponent],
                exports: [CheckboardComponent],
                imports: [CommonModule],
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hlY2tib2FyZC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiLi4vLi4vLi4vc3JjL2xpYi9jb21tb24vIiwic291cmNlcyI6WyJjaGVja2JvYXJkLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDL0MsT0FBTyxFQUNMLHVCQUF1QixFQUN2QixTQUFTLEVBQ1QsS0FBSyxFQUNMLFFBQVEsR0FFVCxNQUFNLGVBQWUsQ0FBQztBQUV2QixPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFtQnZELE1BQU0sT0FBTyxtQkFBbUI7SUFqQmhDO1FBa0JXLFVBQUssR0FBRyxhQUFhLENBQUM7UUFDdEIsU0FBSSxHQUFHLENBQUMsQ0FBQztRQUNULFNBQUksR0FBRyxpQkFBaUIsQ0FBQztJQWFwQyxDQUFDO0lBUkMsUUFBUTtRQUNOLE1BQU0sVUFBVSxHQUFHLGVBQWUsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3JFLElBQUksQ0FBQyxVQUFVLEdBQUc7WUFDaEIsWUFBWSxFQUFFLElBQUksQ0FBQyxZQUFZO1lBQy9CLFNBQVMsRUFBRSxJQUFJLENBQUMsU0FBUztZQUN6QixVQUFVLEVBQUUsT0FBTyxVQUFVLGVBQWU7U0FDN0MsQ0FBQztJQUNKLENBQUM7OztZQWhDRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLGtCQUFrQjtnQkFDNUIsUUFBUSxFQUFFLGlEQUFpRDtnQkFZM0QsbUJBQW1CLEVBQUUsS0FBSztnQkFDMUIsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07eUJBWDdDOzs7Ozs7OztHQVFEO2FBSUY7OztvQkFFRSxLQUFLO21CQUNMLEtBQUs7bUJBQ0wsS0FBSzt3QkFDTCxLQUFLOzJCQUNMLEtBQUs7O0FBa0JSLE1BQU0sT0FBTyxnQkFBZ0I7OztZQUw1QixRQUFRLFNBQUM7Z0JBQ1IsWUFBWSxFQUFFLENBQUMsbUJBQW1CLENBQUM7Z0JBQ25DLE9BQU8sRUFBRSxDQUFDLG1CQUFtQixDQUFDO2dCQUM5QixPQUFPLEVBQUUsQ0FBQyxZQUFZLENBQUM7YUFDeEIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENvbXBvbmVudCxcbiAgSW5wdXQsXG4gIE5nTW9kdWxlLFxuICBPbkluaXQsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBnZXRDaGVja2VyYm9hcmQgfSBmcm9tICcuL2hlbHBlcnMvY2hlY2tib2FyZCc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2NvbG9yLWNoZWNrYm9hcmQnLFxuICB0ZW1wbGF0ZTogYDxkaXYgY2xhc3M9XCJncmlkXCIgW25nU3R5bGVdPVwiZ3JpZFN0eWxlc1wiPjwvZGl2PmAsXG4gIHN0eWxlczogW1xuICAgIGBcbiAgLmdyaWQge1xuICAgIHRvcDogMHB4O1xuICAgIHJpZ2h0OiAwcHg7XG4gICAgYm90dG9tOiAwcHg7XG4gICAgbGVmdDogMHB4O1xuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgfVxuICBgLFxuICBdLFxuICBwcmVzZXJ2ZVdoaXRlc3BhY2VzOiBmYWxzZSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG59KVxuZXhwb3J0IGNsYXNzIENoZWNrYm9hcmRDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuICBASW5wdXQoKSB3aGl0ZSA9ICd0cmFuc3BhcmVudCc7XG4gIEBJbnB1dCgpIHNpemUgPSA4O1xuICBASW5wdXQoKSBncmV5ID0gJ3JnYmEoMCwwLDAsLjA4KSc7XG4gIEBJbnB1dCgpIGJveFNoYWRvdyE6IHN0cmluZztcbiAgQElucHV0KCkgYm9yZGVyUmFkaXVzITogc3RyaW5nO1xuICBncmlkU3R5bGVzITogUmVjb3JkPHN0cmluZywgc3RyaW5nPjtcblxuICBuZ09uSW5pdCgpIHtcbiAgICBjb25zdCBiYWNrZ3JvdW5kID0gZ2V0Q2hlY2tlcmJvYXJkKHRoaXMud2hpdGUsIHRoaXMuZ3JleSwgdGhpcy5zaXplKTtcbiAgICB0aGlzLmdyaWRTdHlsZXMgPSB7XG4gICAgICBib3JkZXJSYWRpdXM6IHRoaXMuYm9yZGVyUmFkaXVzLFxuICAgICAgYm94U2hhZG93OiB0aGlzLmJveFNoYWRvdyxcbiAgICAgIGJhY2tncm91bmQ6IGB1cmwoJHtiYWNrZ3JvdW5kfSkgY2VudGVyIGxlZnRgLFxuICAgIH07XG4gIH1cbn1cblxuQE5nTW9kdWxlKHtcbiAgZGVjbGFyYXRpb25zOiBbQ2hlY2tib2FyZENvbXBvbmVudF0sXG4gIGV4cG9ydHM6IFtDaGVja2JvYXJkQ29tcG9uZW50XSxcbiAgaW1wb3J0czogW0NvbW1vbk1vZHVsZV0sXG59KVxuZXhwb3J0IGNsYXNzIENoZWNrYm9hcmRNb2R1bGUge31cbiJdfQ==