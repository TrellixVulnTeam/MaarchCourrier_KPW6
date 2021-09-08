import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, NgModule, } from '@angular/core';
import { ColorWrap, SwatchModule, isValidHex } from 'ngx-color';
import { GithubSwatchComponent } from './github-swatch.component';
export class GithubComponent extends ColorWrap {
    constructor() {
        super();
        /** Pixel value for picker width */
        this.width = 212;
        /** Color squares to display */
        this.colors = [
            '#B80000',
            '#DB3E00',
            '#FCCB00',
            '#008B02',
            '#006B76',
            '#1273DE',
            '#004DCF',
            '#5300EB',
            '#EB9694',
            '#FAD0C3',
            '#FEF3BD',
            '#C1E1C5',
            '#BEDADC',
            '#C4DEF6',
            '#BED3F3',
            '#D4C4FB',
        ];
        this.triangle = 'top-left';
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
GithubComponent.decorators = [
    { type: Component, args: [{
                selector: 'color-github',
                template: `
  <div class="github-picker {{ triangle }}-triangle {{ className }}"
    [style.width.px]="width"
  >
    <div class="triangleShadow"></div>
    <div class="triangle"></div>
    <color-github-swatch *ngFor="let color of colors"
      [color]="color"
      (onClick)="handleBlockChange($event)"
      (onSwatchHover)="onSwatchHover.emit($event)"
    ></color-github-swatch>
  </div>
  `,
                changeDetection: ChangeDetectionStrategy.OnPush,
                preserveWhitespaces: false,
                styles: [`
  .github-picker {
    background: rgb(255, 255, 255);
    border: 1px solid rgba(0, 0, 0, 0.2);
    box-shadow: rgba(0, 0, 0, 0.15) 0px 3px 12px;
    border-radius: 4px;
    position: relative;
    padding: 5px;
    display: flex;
    flex-wrap: wrap;
    box-sizing: border-box;
  }
  .triangleShadow {
    position: absolute;
    border-width: 8px;
    border-style: solid;
    border-color: transparent transparent rgba(0, 0, 0, 0.15);
    border-image: initial;
  }
  .triangle {
    position: absolute;
    border-width: 7px;
    border-style: solid;
    border-color: transparent transparent rgb(255, 255, 255);
    border-image: initial;
  }
  .hide-triangle > .triangle {
    display: none;
  }
  .hide-triangle > .triangleShadow {
    display: none;
  }
  .top-left-triangle > .triangle {
    top: -14px;
    left: 10px;
  }
  .top-left-triangle > .triangleShadow {
    top: -16px;
    left: 9px;
  }
  .top-right-triangle > .triangle {
    top: -14px;
    right: 10px;
  }
  .top-right-triangle > .triangleShadow {
    top: -16px;
    right: 9px;
  }
  .bottom-right-triangle > .triangle {
    top: 35px;
    right: 10px;
    transform: rotate(180deg);
  }
  .bottom-right-triangle > .triangleShadow {
    top: 37px;
    right: 9px;
    transform: rotate(180deg);
  }
  `]
            },] }
];
GithubComponent.ctorParameters = () => [];
GithubComponent.propDecorators = {
    width: [{ type: Input }],
    colors: [{ type: Input }],
    triangle: [{ type: Input }]
};
export class ColorGithubModule {
}
ColorGithubModule.decorators = [
    { type: NgModule, args: [{
                declarations: [GithubComponent, GithubSwatchComponent],
                exports: [GithubComponent, GithubSwatchComponent],
                imports: [CommonModule, SwatchModule],
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2l0aHViLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIuLi8uLi8uLi8uLi9zcmMvbGliL2NvbXBvbmVudHMvZ2l0aHViLyIsInNvdXJjZXMiOlsiZ2l0aHViLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDL0MsT0FBTyxFQUNMLHVCQUF1QixFQUN2QixTQUFTLEVBQ1QsS0FBSyxFQUNMLFFBQVEsR0FDVCxNQUFNLGVBQWUsQ0FBQztBQUV2QixPQUFPLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBRSxVQUFVLEVBQUUsTUFBTSxXQUFXLENBQUM7QUFDaEUsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFpRmxFLE1BQU0sT0FBTyxlQUFnQixTQUFRLFNBQVM7SUF3QjVDO1FBQ0UsS0FBSyxFQUFFLENBQUM7UUF4QlYsbUNBQW1DO1FBQzFCLFVBQUssR0FBb0IsR0FBRyxDQUFDO1FBQ3RDLCtCQUErQjtRQUN0QixXQUFNLEdBQUc7WUFDaEIsU0FBUztZQUNULFNBQVM7WUFDVCxTQUFTO1lBQ1QsU0FBUztZQUNULFNBQVM7WUFDVCxTQUFTO1lBQ1QsU0FBUztZQUNULFNBQVM7WUFDVCxTQUFTO1lBQ1QsU0FBUztZQUNULFNBQVM7WUFDVCxTQUFTO1lBQ1QsU0FBUztZQUNULFNBQVM7WUFDVCxTQUFTO1lBQ1QsU0FBUztTQUNWLENBQUM7UUFDTyxhQUFRLEdBQXVELFVBQVUsQ0FBQztJQUluRixDQUFDO0lBRUQsaUJBQWlCLENBQUMsRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFrQztRQUMvRCxJQUFJLFVBQVUsQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUNuQixJQUFJLENBQUMsWUFBWSxDQUFDLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQztTQUNuRDtJQUNILENBQUM7SUFDRCxpQkFBaUIsQ0FBQyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUU7UUFDaEMsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDbEMsQ0FBQzs7O1lBbEhGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsY0FBYztnQkFDeEIsUUFBUSxFQUFFOzs7Ozs7Ozs7Ozs7R0FZVDtnQkE4REQsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07Z0JBQy9DLG1CQUFtQixFQUFFLEtBQUs7eUJBN0R4Qjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQTBERDthQUlGOzs7O29CQUdFLEtBQUs7cUJBRUwsS0FBSzt1QkFrQkwsS0FBSzs7QUFxQlIsTUFBTSxPQUFPLGlCQUFpQjs7O1lBTDdCLFFBQVEsU0FBQztnQkFDUixZQUFZLEVBQUUsQ0FBQyxlQUFlLEVBQUUscUJBQXFCLENBQUM7Z0JBQ3RELE9BQU8sRUFBRSxDQUFDLGVBQWUsRUFBRSxxQkFBcUIsQ0FBQztnQkFDakQsT0FBTyxFQUFFLENBQUMsWUFBWSxFQUFFLFlBQVksQ0FBQzthQUN0QyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge1xuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ29tcG9uZW50LFxuICBJbnB1dCxcbiAgTmdNb2R1bGUsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBDb2xvcldyYXAsIFN3YXRjaE1vZHVsZSwgaXNWYWxpZEhleCB9IGZyb20gJ25neC1jb2xvcic7XG5pbXBvcnQgeyBHaXRodWJTd2F0Y2hDb21wb25lbnQgfSBmcm9tICcuL2dpdGh1Yi1zd2F0Y2guY29tcG9uZW50JztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnY29sb3ItZ2l0aHViJyxcbiAgdGVtcGxhdGU6IGBcbiAgPGRpdiBjbGFzcz1cImdpdGh1Yi1waWNrZXIge3sgdHJpYW5nbGUgfX0tdHJpYW5nbGUge3sgY2xhc3NOYW1lIH19XCJcbiAgICBbc3R5bGUud2lkdGgucHhdPVwid2lkdGhcIlxuICA+XG4gICAgPGRpdiBjbGFzcz1cInRyaWFuZ2xlU2hhZG93XCI+PC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cInRyaWFuZ2xlXCI+PC9kaXY+XG4gICAgPGNvbG9yLWdpdGh1Yi1zd2F0Y2ggKm5nRm9yPVwibGV0IGNvbG9yIG9mIGNvbG9yc1wiXG4gICAgICBbY29sb3JdPVwiY29sb3JcIlxuICAgICAgKG9uQ2xpY2spPVwiaGFuZGxlQmxvY2tDaGFuZ2UoJGV2ZW50KVwiXG4gICAgICAob25Td2F0Y2hIb3Zlcik9XCJvblN3YXRjaEhvdmVyLmVtaXQoJGV2ZW50KVwiXG4gICAgPjwvY29sb3ItZ2l0aHViLXN3YXRjaD5cbiAgPC9kaXY+XG4gIGAsXG4gIHN0eWxlczogW1xuICAgIGBcbiAgLmdpdGh1Yi1waWNrZXIge1xuICAgIGJhY2tncm91bmQ6IHJnYigyNTUsIDI1NSwgMjU1KTtcbiAgICBib3JkZXI6IDFweCBzb2xpZCByZ2JhKDAsIDAsIDAsIDAuMik7XG4gICAgYm94LXNoYWRvdzogcmdiYSgwLCAwLCAwLCAwLjE1KSAwcHggM3B4IDEycHg7XG4gICAgYm9yZGVyLXJhZGl1czogNHB4O1xuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgICBwYWRkaW5nOiA1cHg7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBmbGV4LXdyYXA6IHdyYXA7XG4gICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbiAgfVxuICAudHJpYW5nbGVTaGFkb3cge1xuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICBib3JkZXItd2lkdGg6IDhweDtcbiAgICBib3JkZXItc3R5bGU6IHNvbGlkO1xuICAgIGJvcmRlci1jb2xvcjogdHJhbnNwYXJlbnQgdHJhbnNwYXJlbnQgcmdiYSgwLCAwLCAwLCAwLjE1KTtcbiAgICBib3JkZXItaW1hZ2U6IGluaXRpYWw7XG4gIH1cbiAgLnRyaWFuZ2xlIHtcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgYm9yZGVyLXdpZHRoOiA3cHg7XG4gICAgYm9yZGVyLXN0eWxlOiBzb2xpZDtcbiAgICBib3JkZXItY29sb3I6IHRyYW5zcGFyZW50IHRyYW5zcGFyZW50IHJnYigyNTUsIDI1NSwgMjU1KTtcbiAgICBib3JkZXItaW1hZ2U6IGluaXRpYWw7XG4gIH1cbiAgLmhpZGUtdHJpYW5nbGUgPiAudHJpYW5nbGUge1xuICAgIGRpc3BsYXk6IG5vbmU7XG4gIH1cbiAgLmhpZGUtdHJpYW5nbGUgPiAudHJpYW5nbGVTaGFkb3cge1xuICAgIGRpc3BsYXk6IG5vbmU7XG4gIH1cbiAgLnRvcC1sZWZ0LXRyaWFuZ2xlID4gLnRyaWFuZ2xlIHtcbiAgICB0b3A6IC0xNHB4O1xuICAgIGxlZnQ6IDEwcHg7XG4gIH1cbiAgLnRvcC1sZWZ0LXRyaWFuZ2xlID4gLnRyaWFuZ2xlU2hhZG93IHtcbiAgICB0b3A6IC0xNnB4O1xuICAgIGxlZnQ6IDlweDtcbiAgfVxuICAudG9wLXJpZ2h0LXRyaWFuZ2xlID4gLnRyaWFuZ2xlIHtcbiAgICB0b3A6IC0xNHB4O1xuICAgIHJpZ2h0OiAxMHB4O1xuICB9XG4gIC50b3AtcmlnaHQtdHJpYW5nbGUgPiAudHJpYW5nbGVTaGFkb3cge1xuICAgIHRvcDogLTE2cHg7XG4gICAgcmlnaHQ6IDlweDtcbiAgfVxuICAuYm90dG9tLXJpZ2h0LXRyaWFuZ2xlID4gLnRyaWFuZ2xlIHtcbiAgICB0b3A6IDM1cHg7XG4gICAgcmlnaHQ6IDEwcHg7XG4gICAgdHJhbnNmb3JtOiByb3RhdGUoMTgwZGVnKTtcbiAgfVxuICAuYm90dG9tLXJpZ2h0LXRyaWFuZ2xlID4gLnRyaWFuZ2xlU2hhZG93IHtcbiAgICB0b3A6IDM3cHg7XG4gICAgcmlnaHQ6IDlweDtcbiAgICB0cmFuc2Zvcm06IHJvdGF0ZSgxODBkZWcpO1xuICB9XG4gIGAsXG4gIF0sXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBwcmVzZXJ2ZVdoaXRlc3BhY2VzOiBmYWxzZSxcbn0pXG5leHBvcnQgY2xhc3MgR2l0aHViQ29tcG9uZW50IGV4dGVuZHMgQ29sb3JXcmFwIHtcbiAgLyoqIFBpeGVsIHZhbHVlIGZvciBwaWNrZXIgd2lkdGggKi9cbiAgQElucHV0KCkgd2lkdGg6IHN0cmluZyB8IG51bWJlciA9IDIxMjtcbiAgLyoqIENvbG9yIHNxdWFyZXMgdG8gZGlzcGxheSAqL1xuICBASW5wdXQoKSBjb2xvcnMgPSBbXG4gICAgJyNCODAwMDAnLFxuICAgICcjREIzRTAwJyxcbiAgICAnI0ZDQ0IwMCcsXG4gICAgJyMwMDhCMDInLFxuICAgICcjMDA2Qjc2JyxcbiAgICAnIzEyNzNERScsXG4gICAgJyMwMDREQ0YnLFxuICAgICcjNTMwMEVCJyxcbiAgICAnI0VCOTY5NCcsXG4gICAgJyNGQUQwQzMnLFxuICAgICcjRkVGM0JEJyxcbiAgICAnI0MxRTFDNScsXG4gICAgJyNCRURBREMnLFxuICAgICcjQzRERUY2JyxcbiAgICAnI0JFRDNGMycsXG4gICAgJyNENEM0RkInLFxuICBdO1xuICBASW5wdXQoKSB0cmlhbmdsZTogJ2hpZGUnIHwgJ3RvcC1sZWZ0JyB8ICd0b3AtcmlnaHQnIHwgJ2JvdHRvbS1yaWdodCcgPSAndG9wLWxlZnQnO1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG4gIH1cblxuICBoYW5kbGVCbG9ja0NoYW5nZSh7IGhleCwgJGV2ZW50IH06IHsgaGV4OiBzdHJpbmcsICRldmVudDogRXZlbnQgfSkge1xuICAgIGlmIChpc1ZhbGlkSGV4KGhleCkpIHtcbiAgICAgIHRoaXMuaGFuZGxlQ2hhbmdlKHsgaGV4LCBzb3VyY2U6ICdoZXgnIH0sICRldmVudCk7XG4gICAgfVxuICB9XG4gIGhhbmRsZVZhbHVlQ2hhbmdlKHsgZGF0YSwgJGV2ZW50IH0pIHtcbiAgICB0aGlzLmhhbmRsZUNoYW5nZShkYXRhLCAkZXZlbnQpO1xuICB9XG59XG5cbkBOZ01vZHVsZSh7XG4gIGRlY2xhcmF0aW9uczogW0dpdGh1YkNvbXBvbmVudCwgR2l0aHViU3dhdGNoQ29tcG9uZW50XSxcbiAgZXhwb3J0czogW0dpdGh1YkNvbXBvbmVudCwgR2l0aHViU3dhdGNoQ29tcG9uZW50XSxcbiAgaW1wb3J0czogW0NvbW1vbk1vZHVsZSwgU3dhdGNoTW9kdWxlXSxcbn0pXG5leHBvcnQgY2xhc3MgQ29sb3JHaXRodWJNb2R1bGUge31cbiJdfQ==