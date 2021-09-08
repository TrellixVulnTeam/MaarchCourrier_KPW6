import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, } from '@angular/core';
export class SliderSwatchesComponent {
    constructor() {
        this.onClick = new EventEmitter();
        this.onSwatchHover = new EventEmitter();
    }
    active(l, s) {
        return (Math.round(this.hsl.l * 100) / 100 === l &&
            Math.round(this.hsl.s * 100) / 100 === s);
    }
    handleClick({ data, $event }) {
        this.onClick.emit({ data, $event });
    }
}
SliderSwatchesComponent.decorators = [
    { type: Component, args: [{
                selector: 'color-slider-swatches',
                template: `
  <div class="slider-swatches">
    <div class="slider-swatch-wrap">
      <color-slider-swatch
        [hsl]="hsl"
        [offset]=".80"
        [active]="active(0.80, 0.50)"
        (onClick)="handleClick($event)"
        [first]="true"
      ></color-slider-swatch>
    </div>
    <div class="slider-swatch-wrap">
      <color-slider-swatch
        [hsl]="hsl"
        [offset]=".65"
        [active]="active(0.65, 0.50)"
        (onClick)="handleClick($event)"
      ></color-slider-swatch>
    </div>
    <div class="slider-swatch-wrap">
      <color-slider-swatch
        [hsl]="hsl"
        [offset]=".50"
        [active]="active(0.50, 0.50)"
        (onClick)="handleClick($event)"
      ></color-slider-swatch>
    </div>
    <div class="slider-swatch-wrap">
      <color-slider-swatch
        [hsl]="hsl"
        [offset]=".35"
        [active]="active(0.35, 0.50)"
        (onClick)="handleClick($event)"
      ></color-slider-swatch>
    </div>
    <div class="slider-swatch-wrap">
      <color-slider-swatch
        [hsl]="hsl"
        [offset]=".20"
        [active]="active(0.20, 0.50)"
        (onClick)="handleClick($event)"
        [last]="true"
      ></color-slider-swatch>
    </div>
  </div>
  `,
                changeDetection: ChangeDetectionStrategy.OnPush,
                preserveWhitespaces: false,
                styles: [`
    .slider-swatches {
      margin-top: 20px;
    }
    .slider-swatch-wrap {
      box-sizing: border-box;
      width: 20%;
      padding-right: 1px;
      float: left;
    }
  `]
            },] }
];
SliderSwatchesComponent.propDecorators = {
    hsl: [{ type: Input }],
    onClick: [{ type: Output }],
    onSwatchHover: [{ type: Output }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2xpZGVyLXN3YXRjaGVzLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIuLi8uLi8uLi8uLi9zcmMvbGliL2NvbXBvbmVudHMvc2xpZGVyLyIsInNvdXJjZXMiOlsic2xpZGVyLXN3YXRjaGVzLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQ0wsdUJBQXVCLEVBQ3ZCLFNBQVMsRUFDVCxZQUFZLEVBQ1osS0FBSyxFQUNMLE1BQU0sR0FDUCxNQUFNLGVBQWUsQ0FBQztBQWtFdkIsTUFBTSxPQUFPLHVCQUF1QjtJQTlEcEM7UUFnRVksWUFBTyxHQUFHLElBQUksWUFBWSxFQUFPLENBQUM7UUFDbEMsa0JBQWEsR0FBRyxJQUFJLFlBQVksRUFBTyxDQUFDO0lBV3BELENBQUM7SUFUQyxNQUFNLENBQUMsQ0FBUyxFQUFFLENBQVM7UUFDekIsT0FBTyxDQUNMLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLEdBQUcsR0FBRyxLQUFLLENBQUM7WUFDeEMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsR0FBRyxHQUFHLEtBQUssQ0FBQyxDQUN6QyxDQUFDO0lBQ0osQ0FBQztJQUNELFdBQVcsQ0FBQyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUU7UUFDMUIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQztJQUN0QyxDQUFDOzs7WUEzRUYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSx1QkFBdUI7Z0JBQ2pDLFFBQVEsRUFBRTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBNkNUO2dCQVlELGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNO2dCQUMvQyxtQkFBbUIsRUFBRSxLQUFLO3lCQVpqQjs7Ozs7Ozs7OztHQVVSO2FBR0Y7OztrQkFFRSxLQUFLO3NCQUNMLE1BQU07NEJBQ04sTUFBTSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDb21wb25lbnQsXG4gIEV2ZW50RW1pdHRlcixcbiAgSW5wdXQsXG4gIE91dHB1dCxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IEhTTCB9IGZyb20gJ25neC1jb2xvcic7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2NvbG9yLXNsaWRlci1zd2F0Y2hlcycsXG4gIHRlbXBsYXRlOiBgXG4gIDxkaXYgY2xhc3M9XCJzbGlkZXItc3dhdGNoZXNcIj5cbiAgICA8ZGl2IGNsYXNzPVwic2xpZGVyLXN3YXRjaC13cmFwXCI+XG4gICAgICA8Y29sb3Itc2xpZGVyLXN3YXRjaFxuICAgICAgICBbaHNsXT1cImhzbFwiXG4gICAgICAgIFtvZmZzZXRdPVwiLjgwXCJcbiAgICAgICAgW2FjdGl2ZV09XCJhY3RpdmUoMC44MCwgMC41MClcIlxuICAgICAgICAob25DbGljayk9XCJoYW5kbGVDbGljaygkZXZlbnQpXCJcbiAgICAgICAgW2ZpcnN0XT1cInRydWVcIlxuICAgICAgPjwvY29sb3Itc2xpZGVyLXN3YXRjaD5cbiAgICA8L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwic2xpZGVyLXN3YXRjaC13cmFwXCI+XG4gICAgICA8Y29sb3Itc2xpZGVyLXN3YXRjaFxuICAgICAgICBbaHNsXT1cImhzbFwiXG4gICAgICAgIFtvZmZzZXRdPVwiLjY1XCJcbiAgICAgICAgW2FjdGl2ZV09XCJhY3RpdmUoMC42NSwgMC41MClcIlxuICAgICAgICAob25DbGljayk9XCJoYW5kbGVDbGljaygkZXZlbnQpXCJcbiAgICAgID48L2NvbG9yLXNsaWRlci1zd2F0Y2g+XG4gICAgPC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cInNsaWRlci1zd2F0Y2gtd3JhcFwiPlxuICAgICAgPGNvbG9yLXNsaWRlci1zd2F0Y2hcbiAgICAgICAgW2hzbF09XCJoc2xcIlxuICAgICAgICBbb2Zmc2V0XT1cIi41MFwiXG4gICAgICAgIFthY3RpdmVdPVwiYWN0aXZlKDAuNTAsIDAuNTApXCJcbiAgICAgICAgKG9uQ2xpY2spPVwiaGFuZGxlQ2xpY2soJGV2ZW50KVwiXG4gICAgICA+PC9jb2xvci1zbGlkZXItc3dhdGNoPlxuICAgIDwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJzbGlkZXItc3dhdGNoLXdyYXBcIj5cbiAgICAgIDxjb2xvci1zbGlkZXItc3dhdGNoXG4gICAgICAgIFtoc2xdPVwiaHNsXCJcbiAgICAgICAgW29mZnNldF09XCIuMzVcIlxuICAgICAgICBbYWN0aXZlXT1cImFjdGl2ZSgwLjM1LCAwLjUwKVwiXG4gICAgICAgIChvbkNsaWNrKT1cImhhbmRsZUNsaWNrKCRldmVudClcIlxuICAgICAgPjwvY29sb3Itc2xpZGVyLXN3YXRjaD5cbiAgICA8L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwic2xpZGVyLXN3YXRjaC13cmFwXCI+XG4gICAgICA8Y29sb3Itc2xpZGVyLXN3YXRjaFxuICAgICAgICBbaHNsXT1cImhzbFwiXG4gICAgICAgIFtvZmZzZXRdPVwiLjIwXCJcbiAgICAgICAgW2FjdGl2ZV09XCJhY3RpdmUoMC4yMCwgMC41MClcIlxuICAgICAgICAob25DbGljayk9XCJoYW5kbGVDbGljaygkZXZlbnQpXCJcbiAgICAgICAgW2xhc3RdPVwidHJ1ZVwiXG4gICAgICA+PC9jb2xvci1zbGlkZXItc3dhdGNoPlxuICAgIDwvZGl2PlxuICA8L2Rpdj5cbiAgYCxcbiAgc3R5bGVzOiBbYFxuICAgIC5zbGlkZXItc3dhdGNoZXMge1xuICAgICAgbWFyZ2luLXRvcDogMjBweDtcbiAgICB9XG4gICAgLnNsaWRlci1zd2F0Y2gtd3JhcCB7XG4gICAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xuICAgICAgd2lkdGg6IDIwJTtcbiAgICAgIHBhZGRpbmctcmlnaHQ6IDFweDtcbiAgICAgIGZsb2F0OiBsZWZ0O1xuICAgIH1cbiAgYF0sXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBwcmVzZXJ2ZVdoaXRlc3BhY2VzOiBmYWxzZSxcbn0pXG5leHBvcnQgY2xhc3MgU2xpZGVyU3dhdGNoZXNDb21wb25lbnQge1xuICBASW5wdXQoKSBoc2whOiBIU0w7XG4gIEBPdXRwdXQoKSBvbkNsaWNrID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG4gIEBPdXRwdXQoKSBvblN3YXRjaEhvdmVyID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG5cbiAgYWN0aXZlKGw6IG51bWJlciwgczogbnVtYmVyKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIE1hdGgucm91bmQodGhpcy5oc2wubCAqIDEwMCkgLyAxMDAgPT09IGwgJiZcbiAgICAgIE1hdGgucm91bmQodGhpcy5oc2wucyAqIDEwMCkgLyAxMDAgPT09IHNcbiAgICApO1xuICB9XG4gIGhhbmRsZUNsaWNrKHsgZGF0YSwgJGV2ZW50IH0pIHtcbiAgICB0aGlzLm9uQ2xpY2suZW1pdCh7IGRhdGEsICRldmVudCB9KTtcbiAgfVxufVxuIl19