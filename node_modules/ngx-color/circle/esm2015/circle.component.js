import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, NgModule, } from '@angular/core';
import { amber, blue, blueGrey, brown, cyan, deepOrange, deepPurple, green, indigo, lightBlue, lightGreen, lime, orange, pink, purple, red, teal, yellow, } from 'material-colors';
import { TinyColor } from '@ctrl/tinycolor';
import { ColorWrap, SwatchModule, isValidHex } from 'ngx-color';
import { CircleSwatchComponent } from './circle-swatch.component';
export class CircleComponent extends ColorWrap {
    constructor() {
        super();
        /** Pixel value for picker width */
        this.width = 252;
        /** Color squares to display */
        this.colors = [
            red['500'],
            pink['500'],
            purple['500'],
            deepPurple['500'],
            indigo['500'],
            blue['500'],
            lightBlue['500'],
            cyan['500'],
            teal['500'],
            green['500'],
            lightGreen['500'],
            lime['500'],
            yellow['500'],
            amber['500'],
            orange['500'],
            deepOrange['500'],
            brown['500'],
            blueGrey['500'],
        ];
        /** Value for circle size */
        this.circleSize = 28;
        /** Value for spacing between circles */
        this.circleSpacing = 14;
    }
    isActive(color) {
        return new TinyColor(this.hex).equals(color);
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
CircleComponent.decorators = [
    { type: Component, args: [{
                selector: 'color-circle',
                template: `
    <div
      class="circle-picker {{ className }}"
      [style.width.px]="width"
      [style.margin-right.px]="-circleSpacing"
      [style.margin-bottom.px]="-circleSpacing"
    >
      <color-circle-swatch
        *ngFor="let color of colors"
        [circleSize]="circleSize"
        [circleSpacing]="circleSpacing"
        [color]="color"
        [focus]="isActive(color)"
        (onClick)="handleBlockChange($event)"
        (onSwatchHover)="onSwatchHover.emit($event)"
      ></color-circle-swatch>
    </div>
  `,
                changeDetection: ChangeDetectionStrategy.OnPush,
                preserveWhitespaces: false,
                styles: [`
      .circle-picker {
        display: flex;
        flex-wrap: wrap;
      }
    `]
            },] }
];
CircleComponent.ctorParameters = () => [];
CircleComponent.propDecorators = {
    width: [{ type: Input }],
    colors: [{ type: Input }],
    circleSize: [{ type: Input }],
    circleSpacing: [{ type: Input }]
};
export class ColorCircleModule {
}
ColorCircleModule.decorators = [
    { type: NgModule, args: [{
                declarations: [CircleComponent, CircleSwatchComponent],
                exports: [CircleComponent, CircleSwatchComponent],
                imports: [CommonModule, SwatchModule],
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2lyY2xlLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIuLi8uLi8uLi8uLi9zcmMvbGliL2NvbXBvbmVudHMvY2lyY2xlLyIsInNvdXJjZXMiOlsiY2lyY2xlLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDL0MsT0FBTyxFQUNMLHVCQUF1QixFQUN2QixTQUFTLEVBQ1QsS0FBSyxFQUNMLFFBQVEsR0FDVCxNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQ0wsS0FBSyxFQUNMLElBQUksRUFDSixRQUFRLEVBQ1IsS0FBSyxFQUNMLElBQUksRUFDSixVQUFVLEVBQ1YsVUFBVSxFQUNWLEtBQUssRUFDTCxNQUFNLEVBQ04sU0FBUyxFQUNULFVBQVUsRUFDVixJQUFJLEVBQ0osTUFBTSxFQUNOLElBQUksRUFDSixNQUFNLEVBQ04sR0FBRyxFQUNILElBQUksRUFDSixNQUFNLEdBQ1AsTUFBTSxpQkFBaUIsQ0FBQztBQUN6QixPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFFNUMsT0FBTyxFQUFFLFNBQVMsRUFBRSxZQUFZLEVBQUUsVUFBVSxFQUFFLE1BQU0sV0FBVyxDQUFDO0FBQ2hFLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBaUNsRSxNQUFNLE9BQU8sZUFBZ0IsU0FBUSxTQUFTO0lBOEI1QztRQUNFLEtBQUssRUFBRSxDQUFDO1FBOUJWLG1DQUFtQztRQUMxQixVQUFLLEdBQW9CLEdBQUcsQ0FBQztRQUN0QywrQkFBK0I7UUFFL0IsV0FBTSxHQUFhO1lBQ2pCLEdBQUcsQ0FBQyxLQUFLLENBQUM7WUFDVixJQUFJLENBQUMsS0FBSyxDQUFDO1lBQ1gsTUFBTSxDQUFDLEtBQUssQ0FBQztZQUNiLFVBQVUsQ0FBQyxLQUFLLENBQUM7WUFDakIsTUFBTSxDQUFDLEtBQUssQ0FBQztZQUNiLElBQUksQ0FBQyxLQUFLLENBQUM7WUFDWCxTQUFTLENBQUMsS0FBSyxDQUFDO1lBQ2hCLElBQUksQ0FBQyxLQUFLLENBQUM7WUFDWCxJQUFJLENBQUMsS0FBSyxDQUFDO1lBQ1gsS0FBSyxDQUFDLEtBQUssQ0FBQztZQUNaLFVBQVUsQ0FBQyxLQUFLLENBQUM7WUFDakIsSUFBSSxDQUFDLEtBQUssQ0FBQztZQUNYLE1BQU0sQ0FBQyxLQUFLLENBQUM7WUFDYixLQUFLLENBQUMsS0FBSyxDQUFDO1lBQ1osTUFBTSxDQUFDLEtBQUssQ0FBQztZQUNiLFVBQVUsQ0FBQyxLQUFLLENBQUM7WUFDakIsS0FBSyxDQUFDLEtBQUssQ0FBQztZQUNaLFFBQVEsQ0FBQyxLQUFLLENBQUM7U0FDaEIsQ0FBQztRQUNGLDRCQUE0QjtRQUNuQixlQUFVLEdBQUcsRUFBRSxDQUFDO1FBQ3pCLHdDQUF3QztRQUMvQixrQkFBYSxHQUFHLEVBQUUsQ0FBQztJQUk1QixDQUFDO0lBQ0QsUUFBUSxDQUFDLEtBQWE7UUFDcEIsT0FBTyxJQUFJLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQy9DLENBQUM7SUFDRCxpQkFBaUIsQ0FBQyxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQWtDO1FBQy9ELElBQUksVUFBVSxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQ25CLElBQUksQ0FBQyxZQUFZLENBQUMsRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1NBQ25EO0lBQ0gsQ0FBQztJQUNELGlCQUFpQixDQUFDLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRTtRQUNoQyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztJQUNsQyxDQUFDOzs7WUExRUYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxjQUFjO2dCQUN4QixRQUFRLEVBQUU7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBaUJUO2dCQVNELGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNO2dCQUMvQyxtQkFBbUIsRUFBRSxLQUFLO3lCQVJ4Qjs7Ozs7S0FLQzthQUlKOzs7O29CQUdFLEtBQUs7cUJBRUwsS0FBSzt5QkFzQkwsS0FBSzs0QkFFTCxLQUFLOztBQXVCUixNQUFNLE9BQU8saUJBQWlCOzs7WUFMN0IsUUFBUSxTQUFDO2dCQUNSLFlBQVksRUFBRSxDQUFDLGVBQWUsRUFBRSxxQkFBcUIsQ0FBQztnQkFDdEQsT0FBTyxFQUFFLENBQUMsZUFBZSxFQUFFLHFCQUFxQixDQUFDO2dCQUNqRCxPQUFPLEVBQUUsQ0FBQyxZQUFZLEVBQUUsWUFBWSxDQUFDO2FBQ3RDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7XG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDb21wb25lbnQsXG4gIElucHV0LFxuICBOZ01vZHVsZSxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge1xuICBhbWJlcixcbiAgYmx1ZSxcbiAgYmx1ZUdyZXksXG4gIGJyb3duLFxuICBjeWFuLFxuICBkZWVwT3JhbmdlLFxuICBkZWVwUHVycGxlLFxuICBncmVlbixcbiAgaW5kaWdvLFxuICBsaWdodEJsdWUsXG4gIGxpZ2h0R3JlZW4sXG4gIGxpbWUsXG4gIG9yYW5nZSxcbiAgcGluayxcbiAgcHVycGxlLFxuICByZWQsXG4gIHRlYWwsXG4gIHllbGxvdyxcbn0gZnJvbSAnbWF0ZXJpYWwtY29sb3JzJztcbmltcG9ydCB7IFRpbnlDb2xvciB9IGZyb20gJ0BjdHJsL3Rpbnljb2xvcic7XG5cbmltcG9ydCB7IENvbG9yV3JhcCwgU3dhdGNoTW9kdWxlLCBpc1ZhbGlkSGV4IH0gZnJvbSAnbmd4LWNvbG9yJztcbmltcG9ydCB7IENpcmNsZVN3YXRjaENvbXBvbmVudCB9IGZyb20gJy4vY2lyY2xlLXN3YXRjaC5jb21wb25lbnQnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdjb2xvci1jaXJjbGUnLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxkaXZcbiAgICAgIGNsYXNzPVwiY2lyY2xlLXBpY2tlciB7eyBjbGFzc05hbWUgfX1cIlxuICAgICAgW3N0eWxlLndpZHRoLnB4XT1cIndpZHRoXCJcbiAgICAgIFtzdHlsZS5tYXJnaW4tcmlnaHQucHhdPVwiLWNpcmNsZVNwYWNpbmdcIlxuICAgICAgW3N0eWxlLm1hcmdpbi1ib3R0b20ucHhdPVwiLWNpcmNsZVNwYWNpbmdcIlxuICAgID5cbiAgICAgIDxjb2xvci1jaXJjbGUtc3dhdGNoXG4gICAgICAgICpuZ0Zvcj1cImxldCBjb2xvciBvZiBjb2xvcnNcIlxuICAgICAgICBbY2lyY2xlU2l6ZV09XCJjaXJjbGVTaXplXCJcbiAgICAgICAgW2NpcmNsZVNwYWNpbmddPVwiY2lyY2xlU3BhY2luZ1wiXG4gICAgICAgIFtjb2xvcl09XCJjb2xvclwiXG4gICAgICAgIFtmb2N1c109XCJpc0FjdGl2ZShjb2xvcilcIlxuICAgICAgICAob25DbGljayk9XCJoYW5kbGVCbG9ja0NoYW5nZSgkZXZlbnQpXCJcbiAgICAgICAgKG9uU3dhdGNoSG92ZXIpPVwib25Td2F0Y2hIb3Zlci5lbWl0KCRldmVudClcIlxuICAgICAgPjwvY29sb3ItY2lyY2xlLXN3YXRjaD5cbiAgICA8L2Rpdj5cbiAgYCxcbiAgc3R5bGVzOiBbXG4gICAgYFxuICAgICAgLmNpcmNsZS1waWNrZXIge1xuICAgICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgICBmbGV4LXdyYXA6IHdyYXA7XG4gICAgICB9XG4gICAgYCxcbiAgXSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIHByZXNlcnZlV2hpdGVzcGFjZXM6IGZhbHNlLFxufSlcbmV4cG9ydCBjbGFzcyBDaXJjbGVDb21wb25lbnQgZXh0ZW5kcyBDb2xvcldyYXAge1xuICAvKiogUGl4ZWwgdmFsdWUgZm9yIHBpY2tlciB3aWR0aCAqL1xuICBASW5wdXQoKSB3aWR0aDogc3RyaW5nIHwgbnVtYmVyID0gMjUyO1xuICAvKiogQ29sb3Igc3F1YXJlcyB0byBkaXNwbGF5ICovXG4gIEBJbnB1dCgpXG4gIGNvbG9yczogc3RyaW5nW10gPSBbXG4gICAgcmVkWyc1MDAnXSxcbiAgICBwaW5rWyc1MDAnXSxcbiAgICBwdXJwbGVbJzUwMCddLFxuICAgIGRlZXBQdXJwbGVbJzUwMCddLFxuICAgIGluZGlnb1snNTAwJ10sXG4gICAgYmx1ZVsnNTAwJ10sXG4gICAgbGlnaHRCbHVlWyc1MDAnXSxcbiAgICBjeWFuWyc1MDAnXSxcbiAgICB0ZWFsWyc1MDAnXSxcbiAgICBncmVlblsnNTAwJ10sXG4gICAgbGlnaHRHcmVlblsnNTAwJ10sXG4gICAgbGltZVsnNTAwJ10sXG4gICAgeWVsbG93Wyc1MDAnXSxcbiAgICBhbWJlclsnNTAwJ10sXG4gICAgb3JhbmdlWyc1MDAnXSxcbiAgICBkZWVwT3JhbmdlWyc1MDAnXSxcbiAgICBicm93blsnNTAwJ10sXG4gICAgYmx1ZUdyZXlbJzUwMCddLFxuICBdO1xuICAvKiogVmFsdWUgZm9yIGNpcmNsZSBzaXplICovXG4gIEBJbnB1dCgpIGNpcmNsZVNpemUgPSAyODtcbiAgLyoqIFZhbHVlIGZvciBzcGFjaW5nIGJldHdlZW4gY2lyY2xlcyAqL1xuICBASW5wdXQoKSBjaXJjbGVTcGFjaW5nID0gMTQ7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcbiAgfVxuICBpc0FjdGl2ZShjb2xvcjogc3RyaW5nKSB7XG4gICAgcmV0dXJuIG5ldyBUaW55Q29sb3IodGhpcy5oZXgpLmVxdWFscyhjb2xvcik7XG4gIH1cbiAgaGFuZGxlQmxvY2tDaGFuZ2UoeyBoZXgsICRldmVudCB9OiB7IGhleDogc3RyaW5nLCAkZXZlbnQ6IEV2ZW50IH0pIHtcbiAgICBpZiAoaXNWYWxpZEhleChoZXgpKSB7XG4gICAgICB0aGlzLmhhbmRsZUNoYW5nZSh7IGhleCwgc291cmNlOiAnaGV4JyB9LCAkZXZlbnQpO1xuICAgIH1cbiAgfVxuICBoYW5kbGVWYWx1ZUNoYW5nZSh7IGRhdGEsICRldmVudCB9KSB7XG4gICAgdGhpcy5oYW5kbGVDaGFuZ2UoZGF0YSwgJGV2ZW50KTtcbiAgfVxufVxuXG5ATmdNb2R1bGUoe1xuICBkZWNsYXJhdGlvbnM6IFtDaXJjbGVDb21wb25lbnQsIENpcmNsZVN3YXRjaENvbXBvbmVudF0sXG4gIGV4cG9ydHM6IFtDaXJjbGVDb21wb25lbnQsIENpcmNsZVN3YXRjaENvbXBvbmVudF0sXG4gIGltcG9ydHM6IFtDb21tb25Nb2R1bGUsIFN3YXRjaE1vZHVsZV0sXG59KVxuZXhwb3J0IGNsYXNzIENvbG9yQ2lyY2xlTW9kdWxlIHt9XG4iXX0=