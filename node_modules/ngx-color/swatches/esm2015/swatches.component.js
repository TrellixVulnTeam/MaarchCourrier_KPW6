import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, NgModule, } from '@angular/core';
import { amber, blue, blueGrey, brown, cyan, deepOrange, deepPurple, green, indigo, lightBlue, lightGreen, lime, orange, pink, purple, red, teal, yellow, } from 'material-colors';
import { ColorWrap, RaisedModule, SwatchModule } from 'ngx-color';
import { SwatchesColorComponent } from './swatches-color.component';
import { SwatchesGroupComponent } from './swatches-group.component';
export class SwatchesComponent extends ColorWrap {
    constructor() {
        super();
        /** Pixel value for picker width */
        this.width = 320;
        /** Color squares to display */
        this.height = 240;
        /** An array of color groups, each with an array of colors */
        this.colors = [
            [
                red['900'],
                red['700'],
                red['500'],
                red['300'],
                red['100'],
            ],
            [
                pink['900'],
                pink['700'],
                pink['500'],
                pink['300'],
                pink['100'],
            ],
            [
                purple['900'],
                purple['700'],
                purple['500'],
                purple['300'],
                purple['100'],
            ],
            [
                deepPurple['900'],
                deepPurple['700'],
                deepPurple['500'],
                deepPurple['300'],
                deepPurple['100'],
            ],
            [
                indigo['900'],
                indigo['700'],
                indigo['500'],
                indigo['300'],
                indigo['100'],
            ],
            [
                blue['900'],
                blue['700'],
                blue['500'],
                blue['300'],
                blue['100'],
            ],
            [
                lightBlue['900'],
                lightBlue['700'],
                lightBlue['500'],
                lightBlue['300'],
                lightBlue['100'],
            ],
            [
                cyan['900'],
                cyan['700'],
                cyan['500'],
                cyan['300'],
                cyan['100'],
            ],
            [
                teal['900'],
                teal['700'],
                teal['500'],
                teal['300'],
                teal['100'],
            ],
            [
                '#194D33',
                green['700'],
                green['500'],
                green['300'],
                green['100'],
            ],
            [
                lightGreen['900'],
                lightGreen['700'],
                lightGreen['500'],
                lightGreen['300'],
                lightGreen['100'],
            ],
            [
                lime['900'],
                lime['700'],
                lime['500'],
                lime['300'],
                lime['100'],
            ],
            [
                yellow['900'],
                yellow['700'],
                yellow['500'],
                yellow['300'],
                yellow['100'],
            ],
            [
                amber['900'],
                amber['700'],
                amber['500'],
                amber['300'],
                amber['100'],
            ],
            [
                orange['900'],
                orange['700'],
                orange['500'],
                orange['300'],
                orange['100'],
            ],
            [
                deepOrange['900'],
                deepOrange['700'],
                deepOrange['500'],
                deepOrange['300'],
                deepOrange['100'],
            ],
            [
                brown['900'],
                brown['700'],
                brown['500'],
                brown['300'],
                brown['100'],
            ],
            [
                blueGrey['900'],
                blueGrey['700'],
                blueGrey['500'],
                blueGrey['300'],
                blueGrey['100'],
            ],
            ['#000000', '#525252', '#969696', '#D9D9D9', '#FFFFFF'],
        ];
        this.zDepth = 1;
        this.radius = 1;
        this.background = '#fff';
    }
    handlePickerChange({ data, $event }) {
        this.handleChange(data, $event);
    }
}
SwatchesComponent.decorators = [
    { type: Component, args: [{
                selector: 'color-swatches',
                template: `
  <div class="swatches-picker {{ className }}"
    [style.width.px]="width" [style.height.px]="height">
    <color-raised [zDepth]="zDepth" [background]="background" [radius]="radius">
      <div class="swatches-overflow" [style.height.px]="height">
        <div class="swatches-body">
          <color-swatches-group
            *ngFor="let group of colors"
            [group]="group" [active]="hex"
            (onClick)="handlePickerChange($event)"
          ></color-swatches-group>
        </div>
      </div>
    </color-raised>
  </div>
  `,
                changeDetection: ChangeDetectionStrategy.OnPush,
                preserveWhitespaces: false,
                styles: [`
      .swatches-overflow {
        overflow-y: scroll;
      }
      .swatches-overflow {
        padding: 16px 0 6px 16px;
      }
    `]
            },] }
];
SwatchesComponent.ctorParameters = () => [];
SwatchesComponent.propDecorators = {
    width: [{ type: Input }],
    height: [{ type: Input }],
    colors: [{ type: Input }],
    zDepth: [{ type: Input }],
    radius: [{ type: Input }],
    background: [{ type: Input }]
};
export class ColorSwatchesModule {
}
ColorSwatchesModule.decorators = [
    { type: NgModule, args: [{
                declarations: [
                    SwatchesComponent,
                    SwatchesGroupComponent,
                    SwatchesColorComponent,
                ],
                exports: [SwatchesComponent, SwatchesGroupComponent, SwatchesColorComponent],
                imports: [CommonModule, SwatchModule, RaisedModule],
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3dhdGNoZXMuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Ii4uLy4uLy4uLy4uL3NyYy9saWIvY29tcG9uZW50cy9zd2F0Y2hlcy8iLCJzb3VyY2VzIjpbInN3YXRjaGVzLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDL0MsT0FBTyxFQUNMLHVCQUF1QixFQUN2QixTQUFTLEVBQ1QsS0FBSyxFQUNMLFFBQVEsR0FDVCxNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQ0wsS0FBSyxFQUNMLElBQUksRUFDSixRQUFRLEVBQ1IsS0FBSyxFQUNMLElBQUksRUFDSixVQUFVLEVBQ1YsVUFBVSxFQUNWLEtBQUssRUFDTCxNQUFNLEVBQ04sU0FBUyxFQUNULFVBQVUsRUFDVixJQUFJLEVBQ0osTUFBTSxFQUNOLElBQUksRUFDSixNQUFNLEVBQ04sR0FBRyxFQUNILElBQUksRUFDSixNQUFNLEdBQ1AsTUFBTSxpQkFBaUIsQ0FBQztBQUV6QixPQUFPLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBRSxZQUFZLEVBQVUsTUFBTSxXQUFXLENBQUM7QUFDMUUsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFDcEUsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFpQ3BFLE1BQU0sT0FBTyxpQkFBa0IsU0FBUSxTQUFTO0lBNEk5QztRQUNFLEtBQUssRUFBRSxDQUFDO1FBNUlWLG1DQUFtQztRQUMxQixVQUFLLEdBQW9CLEdBQUcsQ0FBQztRQUN0QywrQkFBK0I7UUFDdEIsV0FBTSxHQUFvQixHQUFHLENBQUM7UUFDdkMsNkRBQTZEO1FBRTdELFdBQU0sR0FBZTtZQUNuQjtnQkFDRSxHQUFHLENBQUMsS0FBSyxDQUFDO2dCQUNWLEdBQUcsQ0FBQyxLQUFLLENBQUM7Z0JBQ1YsR0FBRyxDQUFDLEtBQUssQ0FBQztnQkFDVixHQUFHLENBQUMsS0FBSyxDQUFDO2dCQUNWLEdBQUcsQ0FBQyxLQUFLLENBQUM7YUFDWDtZQUNEO2dCQUNFLElBQUksQ0FBQyxLQUFLLENBQUM7Z0JBQ1gsSUFBSSxDQUFDLEtBQUssQ0FBQztnQkFDWCxJQUFJLENBQUMsS0FBSyxDQUFDO2dCQUNYLElBQUksQ0FBQyxLQUFLLENBQUM7Z0JBQ1gsSUFBSSxDQUFDLEtBQUssQ0FBQzthQUNaO1lBQ0Q7Z0JBQ0UsTUFBTSxDQUFDLEtBQUssQ0FBQztnQkFDYixNQUFNLENBQUMsS0FBSyxDQUFDO2dCQUNiLE1BQU0sQ0FBQyxLQUFLLENBQUM7Z0JBQ2IsTUFBTSxDQUFDLEtBQUssQ0FBQztnQkFDYixNQUFNLENBQUMsS0FBSyxDQUFDO2FBQ2Q7WUFDRDtnQkFDRSxVQUFVLENBQUMsS0FBSyxDQUFDO2dCQUNqQixVQUFVLENBQUMsS0FBSyxDQUFDO2dCQUNqQixVQUFVLENBQUMsS0FBSyxDQUFDO2dCQUNqQixVQUFVLENBQUMsS0FBSyxDQUFDO2dCQUNqQixVQUFVLENBQUMsS0FBSyxDQUFDO2FBQ2xCO1lBQ0Q7Z0JBQ0UsTUFBTSxDQUFDLEtBQUssQ0FBQztnQkFDYixNQUFNLENBQUMsS0FBSyxDQUFDO2dCQUNiLE1BQU0sQ0FBQyxLQUFLLENBQUM7Z0JBQ2IsTUFBTSxDQUFDLEtBQUssQ0FBQztnQkFDYixNQUFNLENBQUMsS0FBSyxDQUFDO2FBQ2Q7WUFDRDtnQkFDRSxJQUFJLENBQUMsS0FBSyxDQUFDO2dCQUNYLElBQUksQ0FBQyxLQUFLLENBQUM7Z0JBQ1gsSUFBSSxDQUFDLEtBQUssQ0FBQztnQkFDWCxJQUFJLENBQUMsS0FBSyxDQUFDO2dCQUNYLElBQUksQ0FBQyxLQUFLLENBQUM7YUFDWjtZQUNEO2dCQUNFLFNBQVMsQ0FBQyxLQUFLLENBQUM7Z0JBQ2hCLFNBQVMsQ0FBQyxLQUFLLENBQUM7Z0JBQ2hCLFNBQVMsQ0FBQyxLQUFLLENBQUM7Z0JBQ2hCLFNBQVMsQ0FBQyxLQUFLLENBQUM7Z0JBQ2hCLFNBQVMsQ0FBQyxLQUFLLENBQUM7YUFDakI7WUFDRDtnQkFDRSxJQUFJLENBQUMsS0FBSyxDQUFDO2dCQUNYLElBQUksQ0FBQyxLQUFLLENBQUM7Z0JBQ1gsSUFBSSxDQUFDLEtBQUssQ0FBQztnQkFDWCxJQUFJLENBQUMsS0FBSyxDQUFDO2dCQUNYLElBQUksQ0FBQyxLQUFLLENBQUM7YUFDWjtZQUNEO2dCQUNFLElBQUksQ0FBQyxLQUFLLENBQUM7Z0JBQ1gsSUFBSSxDQUFDLEtBQUssQ0FBQztnQkFDWCxJQUFJLENBQUMsS0FBSyxDQUFDO2dCQUNYLElBQUksQ0FBQyxLQUFLLENBQUM7Z0JBQ1gsSUFBSSxDQUFDLEtBQUssQ0FBQzthQUNaO1lBQ0Q7Z0JBQ0UsU0FBUztnQkFDVCxLQUFLLENBQUMsS0FBSyxDQUFDO2dCQUNaLEtBQUssQ0FBQyxLQUFLLENBQUM7Z0JBQ1osS0FBSyxDQUFDLEtBQUssQ0FBQztnQkFDWixLQUFLLENBQUMsS0FBSyxDQUFDO2FBQ2I7WUFDRDtnQkFDRSxVQUFVLENBQUMsS0FBSyxDQUFDO2dCQUNqQixVQUFVLENBQUMsS0FBSyxDQUFDO2dCQUNqQixVQUFVLENBQUMsS0FBSyxDQUFDO2dCQUNqQixVQUFVLENBQUMsS0FBSyxDQUFDO2dCQUNqQixVQUFVLENBQUMsS0FBSyxDQUFDO2FBQ2xCO1lBQ0Q7Z0JBQ0UsSUFBSSxDQUFDLEtBQUssQ0FBQztnQkFDWCxJQUFJLENBQUMsS0FBSyxDQUFDO2dCQUNYLElBQUksQ0FBQyxLQUFLLENBQUM7Z0JBQ1gsSUFBSSxDQUFDLEtBQUssQ0FBQztnQkFDWCxJQUFJLENBQUMsS0FBSyxDQUFDO2FBQ1o7WUFDRDtnQkFDRSxNQUFNLENBQUMsS0FBSyxDQUFDO2dCQUNiLE1BQU0sQ0FBQyxLQUFLLENBQUM7Z0JBQ2IsTUFBTSxDQUFDLEtBQUssQ0FBQztnQkFDYixNQUFNLENBQUMsS0FBSyxDQUFDO2dCQUNiLE1BQU0sQ0FBQyxLQUFLLENBQUM7YUFDZDtZQUNEO2dCQUNFLEtBQUssQ0FBQyxLQUFLLENBQUM7Z0JBQ1osS0FBSyxDQUFDLEtBQUssQ0FBQztnQkFDWixLQUFLLENBQUMsS0FBSyxDQUFDO2dCQUNaLEtBQUssQ0FBQyxLQUFLLENBQUM7Z0JBQ1osS0FBSyxDQUFDLEtBQUssQ0FBQzthQUNiO1lBQ0Q7Z0JBQ0UsTUFBTSxDQUFDLEtBQUssQ0FBQztnQkFDYixNQUFNLENBQUMsS0FBSyxDQUFDO2dCQUNiLE1BQU0sQ0FBQyxLQUFLLENBQUM7Z0JBQ2IsTUFBTSxDQUFDLEtBQUssQ0FBQztnQkFDYixNQUFNLENBQUMsS0FBSyxDQUFDO2FBQ2Q7WUFDRDtnQkFDRSxVQUFVLENBQUMsS0FBSyxDQUFDO2dCQUNqQixVQUFVLENBQUMsS0FBSyxDQUFDO2dCQUNqQixVQUFVLENBQUMsS0FBSyxDQUFDO2dCQUNqQixVQUFVLENBQUMsS0FBSyxDQUFDO2dCQUNqQixVQUFVLENBQUMsS0FBSyxDQUFDO2FBQ2xCO1lBQ0Q7Z0JBQ0UsS0FBSyxDQUFDLEtBQUssQ0FBQztnQkFDWixLQUFLLENBQUMsS0FBSyxDQUFDO2dCQUNaLEtBQUssQ0FBQyxLQUFLLENBQUM7Z0JBQ1osS0FBSyxDQUFDLEtBQUssQ0FBQztnQkFDWixLQUFLLENBQUMsS0FBSyxDQUFDO2FBQ2I7WUFDRDtnQkFDRSxRQUFRLENBQUMsS0FBSyxDQUFDO2dCQUNmLFFBQVEsQ0FBQyxLQUFLLENBQUM7Z0JBQ2YsUUFBUSxDQUFDLEtBQUssQ0FBQztnQkFDZixRQUFRLENBQUMsS0FBSyxDQUFDO2dCQUNmLFFBQVEsQ0FBQyxLQUFLLENBQUM7YUFDaEI7WUFDRCxDQUFDLFNBQVMsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxTQUFTLENBQUM7U0FDeEQsQ0FBQztRQUNPLFdBQU0sR0FBVyxDQUFDLENBQUM7UUFDbkIsV0FBTSxHQUFHLENBQUMsQ0FBQztRQUNYLGVBQVUsR0FBRyxNQUFNLENBQUM7SUFJN0IsQ0FBQztJQUVELGtCQUFrQixDQUFDLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRTtRQUNqQyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztJQUNsQyxDQUFDOzs7WUFqTEYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxnQkFBZ0I7Z0JBQzFCLFFBQVEsRUFBRTs7Ozs7Ozs7Ozs7Ozs7O0dBZVQ7Z0JBV0QsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07Z0JBQy9DLG1CQUFtQixFQUFFLEtBQUs7eUJBVnhCOzs7Ozs7O0tBT0M7YUFJSjs7OztvQkFHRSxLQUFLO3FCQUVMLEtBQUs7cUJBRUwsS0FBSztxQkFrSUwsS0FBSztxQkFDTCxLQUFLO3lCQUNMLEtBQUs7O0FBb0JSLE1BQU0sT0FBTyxtQkFBbUI7OztZQVQvQixRQUFRLFNBQUM7Z0JBQ1IsWUFBWSxFQUFFO29CQUNaLGlCQUFpQjtvQkFDakIsc0JBQXNCO29CQUN0QixzQkFBc0I7aUJBQ3ZCO2dCQUNELE9BQU8sRUFBRSxDQUFDLGlCQUFpQixFQUFFLHNCQUFzQixFQUFFLHNCQUFzQixDQUFDO2dCQUM1RSxPQUFPLEVBQUUsQ0FBQyxZQUFZLEVBQUUsWUFBWSxFQUFFLFlBQVksQ0FBQzthQUNwRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge1xuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ29tcG9uZW50LFxuICBJbnB1dCxcbiAgTmdNb2R1bGUsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHtcbiAgYW1iZXIsXG4gIGJsdWUsXG4gIGJsdWVHcmV5LFxuICBicm93bixcbiAgY3lhbixcbiAgZGVlcE9yYW5nZSxcbiAgZGVlcFB1cnBsZSxcbiAgZ3JlZW4sXG4gIGluZGlnbyxcbiAgbGlnaHRCbHVlLFxuICBsaWdodEdyZWVuLFxuICBsaW1lLFxuICBvcmFuZ2UsXG4gIHBpbmssXG4gIHB1cnBsZSxcbiAgcmVkLFxuICB0ZWFsLFxuICB5ZWxsb3csXG59IGZyb20gJ21hdGVyaWFsLWNvbG9ycyc7XG5cbmltcG9ydCB7IENvbG9yV3JhcCwgUmFpc2VkTW9kdWxlLCBTd2F0Y2hNb2R1bGUsIHpEZXB0aCB9IGZyb20gJ25neC1jb2xvcic7XG5pbXBvcnQgeyBTd2F0Y2hlc0NvbG9yQ29tcG9uZW50IH0gZnJvbSAnLi9zd2F0Y2hlcy1jb2xvci5jb21wb25lbnQnO1xuaW1wb3J0IHsgU3dhdGNoZXNHcm91cENvbXBvbmVudCB9IGZyb20gJy4vc3dhdGNoZXMtZ3JvdXAuY29tcG9uZW50JztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnY29sb3Itc3dhdGNoZXMnLFxuICB0ZW1wbGF0ZTogYFxuICA8ZGl2IGNsYXNzPVwic3dhdGNoZXMtcGlja2VyIHt7IGNsYXNzTmFtZSB9fVwiXG4gICAgW3N0eWxlLndpZHRoLnB4XT1cIndpZHRoXCIgW3N0eWxlLmhlaWdodC5weF09XCJoZWlnaHRcIj5cbiAgICA8Y29sb3ItcmFpc2VkIFt6RGVwdGhdPVwiekRlcHRoXCIgW2JhY2tncm91bmRdPVwiYmFja2dyb3VuZFwiIFtyYWRpdXNdPVwicmFkaXVzXCI+XG4gICAgICA8ZGl2IGNsYXNzPVwic3dhdGNoZXMtb3ZlcmZsb3dcIiBbc3R5bGUuaGVpZ2h0LnB4XT1cImhlaWdodFwiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwic3dhdGNoZXMtYm9keVwiPlxuICAgICAgICAgIDxjb2xvci1zd2F0Y2hlcy1ncm91cFxuICAgICAgICAgICAgKm5nRm9yPVwibGV0IGdyb3VwIG9mIGNvbG9yc1wiXG4gICAgICAgICAgICBbZ3JvdXBdPVwiZ3JvdXBcIiBbYWN0aXZlXT1cImhleFwiXG4gICAgICAgICAgICAob25DbGljayk9XCJoYW5kbGVQaWNrZXJDaGFuZ2UoJGV2ZW50KVwiXG4gICAgICAgICAgPjwvY29sb3Itc3dhdGNoZXMtZ3JvdXA+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgPC9jb2xvci1yYWlzZWQ+XG4gIDwvZGl2PlxuICBgLFxuICBzdHlsZXM6IFtcbiAgICBgXG4gICAgICAuc3dhdGNoZXMtb3ZlcmZsb3cge1xuICAgICAgICBvdmVyZmxvdy15OiBzY3JvbGw7XG4gICAgICB9XG4gICAgICAuc3dhdGNoZXMtb3ZlcmZsb3cge1xuICAgICAgICBwYWRkaW5nOiAxNnB4IDAgNnB4IDE2cHg7XG4gICAgICB9XG4gICAgYCxcbiAgXSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIHByZXNlcnZlV2hpdGVzcGFjZXM6IGZhbHNlLFxufSlcbmV4cG9ydCBjbGFzcyBTd2F0Y2hlc0NvbXBvbmVudCBleHRlbmRzIENvbG9yV3JhcCB7XG4gIC8qKiBQaXhlbCB2YWx1ZSBmb3IgcGlja2VyIHdpZHRoICovXG4gIEBJbnB1dCgpIHdpZHRoOiBzdHJpbmcgfCBudW1iZXIgPSAzMjA7XG4gIC8qKiBDb2xvciBzcXVhcmVzIHRvIGRpc3BsYXkgKi9cbiAgQElucHV0KCkgaGVpZ2h0OiBzdHJpbmcgfCBudW1iZXIgPSAyNDA7XG4gIC8qKiBBbiBhcnJheSBvZiBjb2xvciBncm91cHMsIGVhY2ggd2l0aCBhbiBhcnJheSBvZiBjb2xvcnMgKi9cbiAgQElucHV0KClcbiAgY29sb3JzOiBzdHJpbmdbXVtdID0gW1xuICAgIFtcbiAgICAgIHJlZFsnOTAwJ10sXG4gICAgICByZWRbJzcwMCddLFxuICAgICAgcmVkWyc1MDAnXSxcbiAgICAgIHJlZFsnMzAwJ10sXG4gICAgICByZWRbJzEwMCddLFxuICAgIF0sXG4gICAgW1xuICAgICAgcGlua1snOTAwJ10sXG4gICAgICBwaW5rWyc3MDAnXSxcbiAgICAgIHBpbmtbJzUwMCddLFxuICAgICAgcGlua1snMzAwJ10sXG4gICAgICBwaW5rWycxMDAnXSxcbiAgICBdLFxuICAgIFtcbiAgICAgIHB1cnBsZVsnOTAwJ10sXG4gICAgICBwdXJwbGVbJzcwMCddLFxuICAgICAgcHVycGxlWyc1MDAnXSxcbiAgICAgIHB1cnBsZVsnMzAwJ10sXG4gICAgICBwdXJwbGVbJzEwMCddLFxuICAgIF0sXG4gICAgW1xuICAgICAgZGVlcFB1cnBsZVsnOTAwJ10sXG4gICAgICBkZWVwUHVycGxlWyc3MDAnXSxcbiAgICAgIGRlZXBQdXJwbGVbJzUwMCddLFxuICAgICAgZGVlcFB1cnBsZVsnMzAwJ10sXG4gICAgICBkZWVwUHVycGxlWycxMDAnXSxcbiAgICBdLFxuICAgIFtcbiAgICAgIGluZGlnb1snOTAwJ10sXG4gICAgICBpbmRpZ29bJzcwMCddLFxuICAgICAgaW5kaWdvWyc1MDAnXSxcbiAgICAgIGluZGlnb1snMzAwJ10sXG4gICAgICBpbmRpZ29bJzEwMCddLFxuICAgIF0sXG4gICAgW1xuICAgICAgYmx1ZVsnOTAwJ10sXG4gICAgICBibHVlWyc3MDAnXSxcbiAgICAgIGJsdWVbJzUwMCddLFxuICAgICAgYmx1ZVsnMzAwJ10sXG4gICAgICBibHVlWycxMDAnXSxcbiAgICBdLFxuICAgIFtcbiAgICAgIGxpZ2h0Qmx1ZVsnOTAwJ10sXG4gICAgICBsaWdodEJsdWVbJzcwMCddLFxuICAgICAgbGlnaHRCbHVlWyc1MDAnXSxcbiAgICAgIGxpZ2h0Qmx1ZVsnMzAwJ10sXG4gICAgICBsaWdodEJsdWVbJzEwMCddLFxuICAgIF0sXG4gICAgW1xuICAgICAgY3lhblsnOTAwJ10sXG4gICAgICBjeWFuWyc3MDAnXSxcbiAgICAgIGN5YW5bJzUwMCddLFxuICAgICAgY3lhblsnMzAwJ10sXG4gICAgICBjeWFuWycxMDAnXSxcbiAgICBdLFxuICAgIFtcbiAgICAgIHRlYWxbJzkwMCddLFxuICAgICAgdGVhbFsnNzAwJ10sXG4gICAgICB0ZWFsWyc1MDAnXSxcbiAgICAgIHRlYWxbJzMwMCddLFxuICAgICAgdGVhbFsnMTAwJ10sXG4gICAgXSxcbiAgICBbXG4gICAgICAnIzE5NEQzMycsXG4gICAgICBncmVlblsnNzAwJ10sXG4gICAgICBncmVlblsnNTAwJ10sXG4gICAgICBncmVlblsnMzAwJ10sXG4gICAgICBncmVlblsnMTAwJ10sXG4gICAgXSxcbiAgICBbXG4gICAgICBsaWdodEdyZWVuWyc5MDAnXSxcbiAgICAgIGxpZ2h0R3JlZW5bJzcwMCddLFxuICAgICAgbGlnaHRHcmVlblsnNTAwJ10sXG4gICAgICBsaWdodEdyZWVuWyczMDAnXSxcbiAgICAgIGxpZ2h0R3JlZW5bJzEwMCddLFxuICAgIF0sXG4gICAgW1xuICAgICAgbGltZVsnOTAwJ10sXG4gICAgICBsaW1lWyc3MDAnXSxcbiAgICAgIGxpbWVbJzUwMCddLFxuICAgICAgbGltZVsnMzAwJ10sXG4gICAgICBsaW1lWycxMDAnXSxcbiAgICBdLFxuICAgIFtcbiAgICAgIHllbGxvd1snOTAwJ10sXG4gICAgICB5ZWxsb3dbJzcwMCddLFxuICAgICAgeWVsbG93Wyc1MDAnXSxcbiAgICAgIHllbGxvd1snMzAwJ10sXG4gICAgICB5ZWxsb3dbJzEwMCddLFxuICAgIF0sXG4gICAgW1xuICAgICAgYW1iZXJbJzkwMCddLFxuICAgICAgYW1iZXJbJzcwMCddLFxuICAgICAgYW1iZXJbJzUwMCddLFxuICAgICAgYW1iZXJbJzMwMCddLFxuICAgICAgYW1iZXJbJzEwMCddLFxuICAgIF0sXG4gICAgW1xuICAgICAgb3JhbmdlWyc5MDAnXSxcbiAgICAgIG9yYW5nZVsnNzAwJ10sXG4gICAgICBvcmFuZ2VbJzUwMCddLFxuICAgICAgb3JhbmdlWyczMDAnXSxcbiAgICAgIG9yYW5nZVsnMTAwJ10sXG4gICAgXSxcbiAgICBbXG4gICAgICBkZWVwT3JhbmdlWyc5MDAnXSxcbiAgICAgIGRlZXBPcmFuZ2VbJzcwMCddLFxuICAgICAgZGVlcE9yYW5nZVsnNTAwJ10sXG4gICAgICBkZWVwT3JhbmdlWyczMDAnXSxcbiAgICAgIGRlZXBPcmFuZ2VbJzEwMCddLFxuICAgIF0sXG4gICAgW1xuICAgICAgYnJvd25bJzkwMCddLFxuICAgICAgYnJvd25bJzcwMCddLFxuICAgICAgYnJvd25bJzUwMCddLFxuICAgICAgYnJvd25bJzMwMCddLFxuICAgICAgYnJvd25bJzEwMCddLFxuICAgIF0sXG4gICAgW1xuICAgICAgYmx1ZUdyZXlbJzkwMCddLFxuICAgICAgYmx1ZUdyZXlbJzcwMCddLFxuICAgICAgYmx1ZUdyZXlbJzUwMCddLFxuICAgICAgYmx1ZUdyZXlbJzMwMCddLFxuICAgICAgYmx1ZUdyZXlbJzEwMCddLFxuICAgIF0sXG4gICAgWycjMDAwMDAwJywgJyM1MjUyNTInLCAnIzk2OTY5NicsICcjRDlEOUQ5JywgJyNGRkZGRkYnXSxcbiAgXTtcbiAgQElucHV0KCkgekRlcHRoOiB6RGVwdGggPSAxO1xuICBASW5wdXQoKSByYWRpdXMgPSAxO1xuICBASW5wdXQoKSBiYWNrZ3JvdW5kID0gJyNmZmYnO1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG4gIH1cblxuICBoYW5kbGVQaWNrZXJDaGFuZ2UoeyBkYXRhLCAkZXZlbnQgfSkge1xuICAgIHRoaXMuaGFuZGxlQ2hhbmdlKGRhdGEsICRldmVudCk7XG4gIH1cbn1cblxuQE5nTW9kdWxlKHtcbiAgZGVjbGFyYXRpb25zOiBbXG4gICAgU3dhdGNoZXNDb21wb25lbnQsXG4gICAgU3dhdGNoZXNHcm91cENvbXBvbmVudCxcbiAgICBTd2F0Y2hlc0NvbG9yQ29tcG9uZW50LFxuICBdLFxuICBleHBvcnRzOiBbU3dhdGNoZXNDb21wb25lbnQsIFN3YXRjaGVzR3JvdXBDb21wb25lbnQsIFN3YXRjaGVzQ29sb3JDb21wb25lbnRdLFxuICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlLCBTd2F0Y2hNb2R1bGUsIFJhaXNlZE1vZHVsZV0sXG59KVxuZXhwb3J0IGNsYXNzIENvbG9yU3dhdGNoZXNNb2R1bGUge31cbiJdfQ==