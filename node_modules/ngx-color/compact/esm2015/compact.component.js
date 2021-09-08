import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, NgModule, } from '@angular/core';
import { ColorWrap, EditableInputModule, RaisedModule, SwatchModule, isValidHex, } from 'ngx-color';
import { CompactColorComponent } from './compact-color.component';
import { CompactFieldsComponent } from './compact-fields.component';
export class CompactComponent extends ColorWrap {
    constructor() {
        super();
        /** Color squares to display */
        this.colors = [
            '#4D4D4D',
            '#999999',
            '#FFFFFF',
            '#F44E3B',
            '#FE9200',
            '#FCDC00',
            '#DBDF00',
            '#A4DD00',
            '#68CCCA',
            '#73D8FF',
            '#AEA1FF',
            '#FDA1FF',
            '#333333',
            '#808080',
            '#cccccc',
            '#D33115',
            '#E27300',
            '#FCC400',
            '#B0BC00',
            '#68BC00',
            '#16A5A5',
            '#009CE0',
            '#7B64FF',
            '#FA28FF',
            '#000000',
            '#666666',
            '#B3B3B3',
            '#9F0500',
            '#C45100',
            '#FB9E00',
            '#808900',
            '#194D33',
            '#0C797D',
            '#0062B1',
            '#653294',
            '#AB149E',
        ];
        this.zDepth = 1;
        this.radius = 1;
        this.background = '#fff';
        this.disableAlpha = true;
    }
    handleBlockChange({ hex, $event }) {
        if (isValidHex(hex)) {
            this.handleChange({ hex, source: 'hex' }, $event);
        }
    }
    handleValueChange({ data, $event }) {
        this.handleChange(data, $event);
    }
}
CompactComponent.decorators = [
    { type: Component, args: [{
                selector: 'color-compact',
                template: `
  <color-raised class="color-compact" [zDepth]="zDepth" [background]="background" [radius]="radius">
    <div class="compact-picker {{ className }}">
      <div>
        <color-compact-color
          *ngFor="let color of colors" [color]="color"
          [active]="color.toLowerCase() === hex.toLowerCase()"
          (onClick)="handleBlockChange($event)"
        ></color-compact-color>
        <div class="compact-clear"></div>
      </div>
      <color-compact-fields
        [hex]="hex"
        [rgb]="rgb"
        (onChange)="handleValueChange($event)"
      ></color-compact-fields>
    </div>
  </color-raised>
  `,
                changeDetection: ChangeDetectionStrategy.OnPush,
                preserveWhitespaces: false,
                styles: [`
    .color-compact {
      background: #f6f6f6;
      radius: 4px;
    }
    .compact-picker {
      padding-top: 5px;
      padding-left: 5px;
      box-sizing: border-box;
      width: 245px;
    }
    .compact-clear {
      clear: both;
    }
  `]
            },] }
];
CompactComponent.ctorParameters = () => [];
CompactComponent.propDecorators = {
    colors: [{ type: Input }],
    zDepth: [{ type: Input }],
    radius: [{ type: Input }],
    background: [{ type: Input }]
};
export class ColorCompactModule {
}
ColorCompactModule.decorators = [
    { type: NgModule, args: [{
                declarations: [
                    CompactComponent,
                    CompactColorComponent,
                    CompactFieldsComponent,
                ],
                exports: [CompactComponent, CompactColorComponent, CompactFieldsComponent],
                imports: [CommonModule, EditableInputModule, SwatchModule, RaisedModule],
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGFjdC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiLi4vLi4vLi4vLi4vc3JjL2xpYi9jb21wb25lbnRzL2NvbXBhY3QvIiwic291cmNlcyI6WyJjb21wYWN0LmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDL0MsT0FBTyxFQUNMLHVCQUF1QixFQUN2QixTQUFTLEVBQ1QsS0FBSyxFQUNMLFFBQVEsR0FDVCxNQUFNLGVBQWUsQ0FBQztBQUV2QixPQUFPLEVBQ0wsU0FBUyxFQUNULG1CQUFtQixFQUNuQixZQUFZLEVBQ1osWUFBWSxFQUNaLFVBQVUsR0FFWCxNQUFNLFdBQVcsQ0FBQztBQUNuQixPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUNsRSxPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQztBQTJDcEUsTUFBTSxPQUFPLGdCQUFpQixTQUFRLFNBQVM7SUE2QzdDO1FBQ0UsS0FBSyxFQUFFLENBQUM7UUE3Q1YsK0JBQStCO1FBQ3RCLFdBQU0sR0FBRztZQUNoQixTQUFTO1lBQ1QsU0FBUztZQUNULFNBQVM7WUFDVCxTQUFTO1lBQ1QsU0FBUztZQUNULFNBQVM7WUFDVCxTQUFTO1lBQ1QsU0FBUztZQUNULFNBQVM7WUFDVCxTQUFTO1lBQ1QsU0FBUztZQUNULFNBQVM7WUFDVCxTQUFTO1lBQ1QsU0FBUztZQUNULFNBQVM7WUFDVCxTQUFTO1lBQ1QsU0FBUztZQUNULFNBQVM7WUFDVCxTQUFTO1lBQ1QsU0FBUztZQUNULFNBQVM7WUFDVCxTQUFTO1lBQ1QsU0FBUztZQUNULFNBQVM7WUFDVCxTQUFTO1lBQ1QsU0FBUztZQUNULFNBQVM7WUFDVCxTQUFTO1lBQ1QsU0FBUztZQUNULFNBQVM7WUFDVCxTQUFTO1lBQ1QsU0FBUztZQUNULFNBQVM7WUFDVCxTQUFTO1lBQ1QsU0FBUztZQUNULFNBQVM7U0FDVixDQUFDO1FBQ08sV0FBTSxHQUFXLENBQUMsQ0FBQztRQUNuQixXQUFNLEdBQUcsQ0FBQyxDQUFDO1FBQ1gsZUFBVSxHQUFHLE1BQU0sQ0FBQztRQUM3QixpQkFBWSxHQUFHLElBQUksQ0FBQztJQUlwQixDQUFDO0lBQ0QsaUJBQWlCLENBQUMsRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFO1FBQy9CLElBQUksVUFBVSxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQ25CLElBQUksQ0FBQyxZQUFZLENBQUMsRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1NBQ25EO0lBQ0gsQ0FBQztJQUNELGlCQUFpQixDQUFDLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRTtRQUNoQyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztJQUNsQyxDQUFDOzs7WUFoR0YsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxlQUFlO2dCQUN6QixRQUFRLEVBQUU7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQWtCVDtnQkFrQkQsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07Z0JBQy9DLG1CQUFtQixFQUFFLEtBQUs7eUJBakJ4Qjs7Ozs7Ozs7Ozs7Ozs7R0FjRDthQUlGOzs7O3FCQUdFLEtBQUs7cUJBc0NMLEtBQUs7cUJBQ0wsS0FBSzt5QkFDTCxLQUFLOztBQXlCUixNQUFNLE9BQU8sa0JBQWtCOzs7WUFUOUIsUUFBUSxTQUFDO2dCQUNSLFlBQVksRUFBRTtvQkFDWixnQkFBZ0I7b0JBQ2hCLHFCQUFxQjtvQkFDckIsc0JBQXNCO2lCQUN2QjtnQkFDRCxPQUFPLEVBQUUsQ0FBQyxnQkFBZ0IsRUFBRSxxQkFBcUIsRUFBRSxzQkFBc0IsQ0FBQztnQkFDMUUsT0FBTyxFQUFFLENBQUMsWUFBWSxFQUFFLG1CQUFtQixFQUFFLFlBQVksRUFBRSxZQUFZLENBQUM7YUFDekUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENvbXBvbmVudCxcbiAgSW5wdXQsXG4gIE5nTW9kdWxlLFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHtcbiAgQ29sb3JXcmFwLFxuICBFZGl0YWJsZUlucHV0TW9kdWxlLFxuICBSYWlzZWRNb2R1bGUsXG4gIFN3YXRjaE1vZHVsZSxcbiAgaXNWYWxpZEhleCxcbiAgekRlcHRoLFxufSBmcm9tICduZ3gtY29sb3InO1xuaW1wb3J0IHsgQ29tcGFjdENvbG9yQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wYWN0LWNvbG9yLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBDb21wYWN0RmllbGRzQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wYWN0LWZpZWxkcy5jb21wb25lbnQnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdjb2xvci1jb21wYWN0JyxcbiAgdGVtcGxhdGU6IGBcbiAgPGNvbG9yLXJhaXNlZCBjbGFzcz1cImNvbG9yLWNvbXBhY3RcIiBbekRlcHRoXT1cInpEZXB0aFwiIFtiYWNrZ3JvdW5kXT1cImJhY2tncm91bmRcIiBbcmFkaXVzXT1cInJhZGl1c1wiPlxuICAgIDxkaXYgY2xhc3M9XCJjb21wYWN0LXBpY2tlciB7eyBjbGFzc05hbWUgfX1cIj5cbiAgICAgIDxkaXY+XG4gICAgICAgIDxjb2xvci1jb21wYWN0LWNvbG9yXG4gICAgICAgICAgKm5nRm9yPVwibGV0IGNvbG9yIG9mIGNvbG9yc1wiIFtjb2xvcl09XCJjb2xvclwiXG4gICAgICAgICAgW2FjdGl2ZV09XCJjb2xvci50b0xvd2VyQ2FzZSgpID09PSBoZXgudG9Mb3dlckNhc2UoKVwiXG4gICAgICAgICAgKG9uQ2xpY2spPVwiaGFuZGxlQmxvY2tDaGFuZ2UoJGV2ZW50KVwiXG4gICAgICAgID48L2NvbG9yLWNvbXBhY3QtY29sb3I+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJjb21wYWN0LWNsZWFyXCI+PC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxjb2xvci1jb21wYWN0LWZpZWxkc1xuICAgICAgICBbaGV4XT1cImhleFwiXG4gICAgICAgIFtyZ2JdPVwicmdiXCJcbiAgICAgICAgKG9uQ2hhbmdlKT1cImhhbmRsZVZhbHVlQ2hhbmdlKCRldmVudClcIlxuICAgICAgPjwvY29sb3ItY29tcGFjdC1maWVsZHM+XG4gICAgPC9kaXY+XG4gIDwvY29sb3ItcmFpc2VkPlxuICBgLFxuICBzdHlsZXM6IFtcbiAgICBgXG4gICAgLmNvbG9yLWNvbXBhY3Qge1xuICAgICAgYmFja2dyb3VuZDogI2Y2ZjZmNjtcbiAgICAgIHJhZGl1czogNHB4O1xuICAgIH1cbiAgICAuY29tcGFjdC1waWNrZXIge1xuICAgICAgcGFkZGluZy10b3A6IDVweDtcbiAgICAgIHBhZGRpbmctbGVmdDogNXB4O1xuICAgICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbiAgICAgIHdpZHRoOiAyNDVweDtcbiAgICB9XG4gICAgLmNvbXBhY3QtY2xlYXIge1xuICAgICAgY2xlYXI6IGJvdGg7XG4gICAgfVxuICBgLFxuICBdLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgcHJlc2VydmVXaGl0ZXNwYWNlczogZmFsc2UsXG59KVxuZXhwb3J0IGNsYXNzIENvbXBhY3RDb21wb25lbnQgZXh0ZW5kcyBDb2xvcldyYXAge1xuICAvKiogQ29sb3Igc3F1YXJlcyB0byBkaXNwbGF5ICovXG4gIEBJbnB1dCgpIGNvbG9ycyA9IFtcbiAgICAnIzRENEQ0RCcsXG4gICAgJyM5OTk5OTknLFxuICAgICcjRkZGRkZGJyxcbiAgICAnI0Y0NEUzQicsXG4gICAgJyNGRTkyMDAnLFxuICAgICcjRkNEQzAwJyxcbiAgICAnI0RCREYwMCcsXG4gICAgJyNBNEREMDAnLFxuICAgICcjNjhDQ0NBJyxcbiAgICAnIzczRDhGRicsXG4gICAgJyNBRUExRkYnLFxuICAgICcjRkRBMUZGJyxcbiAgICAnIzMzMzMzMycsXG4gICAgJyM4MDgwODAnLFxuICAgICcjY2NjY2NjJyxcbiAgICAnI0QzMzExNScsXG4gICAgJyNFMjczMDAnLFxuICAgICcjRkNDNDAwJyxcbiAgICAnI0IwQkMwMCcsXG4gICAgJyM2OEJDMDAnLFxuICAgICcjMTZBNUE1JyxcbiAgICAnIzAwOUNFMCcsXG4gICAgJyM3QjY0RkYnLFxuICAgICcjRkEyOEZGJyxcbiAgICAnIzAwMDAwMCcsXG4gICAgJyM2NjY2NjYnLFxuICAgICcjQjNCM0IzJyxcbiAgICAnIzlGMDUwMCcsXG4gICAgJyNDNDUxMDAnLFxuICAgICcjRkI5RTAwJyxcbiAgICAnIzgwODkwMCcsXG4gICAgJyMxOTREMzMnLFxuICAgICcjMEM3OTdEJyxcbiAgICAnIzAwNjJCMScsXG4gICAgJyM2NTMyOTQnLFxuICAgICcjQUIxNDlFJyxcbiAgXTtcbiAgQElucHV0KCkgekRlcHRoOiB6RGVwdGggPSAxO1xuICBASW5wdXQoKSByYWRpdXMgPSAxO1xuICBASW5wdXQoKSBiYWNrZ3JvdW5kID0gJyNmZmYnO1xuICBkaXNhYmxlQWxwaGEgPSB0cnVlO1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG4gIH1cbiAgaGFuZGxlQmxvY2tDaGFuZ2UoeyBoZXgsICRldmVudCB9KSB7XG4gICAgaWYgKGlzVmFsaWRIZXgoaGV4KSkge1xuICAgICAgdGhpcy5oYW5kbGVDaGFuZ2UoeyBoZXgsIHNvdXJjZTogJ2hleCcgfSwgJGV2ZW50KTtcbiAgICB9XG4gIH1cbiAgaGFuZGxlVmFsdWVDaGFuZ2UoeyBkYXRhLCAkZXZlbnQgfSkge1xuICAgIHRoaXMuaGFuZGxlQ2hhbmdlKGRhdGEsICRldmVudCk7XG4gIH1cbn1cblxuQE5nTW9kdWxlKHtcbiAgZGVjbGFyYXRpb25zOiBbXG4gICAgQ29tcGFjdENvbXBvbmVudCxcbiAgICBDb21wYWN0Q29sb3JDb21wb25lbnQsXG4gICAgQ29tcGFjdEZpZWxkc0NvbXBvbmVudCxcbiAgXSxcbiAgZXhwb3J0czogW0NvbXBhY3RDb21wb25lbnQsIENvbXBhY3RDb2xvckNvbXBvbmVudCwgQ29tcGFjdEZpZWxkc0NvbXBvbmVudF0sXG4gIGltcG9ydHM6IFtDb21tb25Nb2R1bGUsIEVkaXRhYmxlSW5wdXRNb2R1bGUsIFN3YXRjaE1vZHVsZSwgUmFpc2VkTW9kdWxlXSxcbn0pXG5leHBvcnQgY2xhc3MgQ29sb3JDb21wYWN0TW9kdWxlIHt9XG4iXX0=