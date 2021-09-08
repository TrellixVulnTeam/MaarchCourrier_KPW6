import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
export class GithubSwatchComponent {
    constructor() {
        this.onClick = new EventEmitter();
        this.onSwatchHover = new EventEmitter();
        this.focusStyle = {
            position: 'relative',
            'z-index': '2',
            outline: '2px solid #fff',
            'box-shadow': '0 0 5px 2px rgba(0,0,0,0.25)',
        };
    }
    handleClick({ hex, $event }) {
        this.onClick.emit({ hex, $event });
    }
}
GithubSwatchComponent.decorators = [
    { type: Component, args: [{
                selector: 'color-github-swatch',
                template: `
    <div class="github-swatch">
      <color-swatch
        [color]="color"
        [focusStyle]="focusStyle"
        (onClick)="handleClick($event)"
        (onHover)="onSwatchHover.emit($event)"
        class="swatch"
      ></color-swatch>
      <div class="clear"></div>
    </div>
  `,
                changeDetection: ChangeDetectionStrategy.OnPush,
                preserveWhitespaces: false,
                styles: [`
      .github-swatch {
        width: 25px;
        height: 25px;
        font-size: 0;
      }
    `]
            },] }
];
GithubSwatchComponent.propDecorators = {
    color: [{ type: Input }],
    onClick: [{ type: Output }],
    onSwatchHover: [{ type: Output }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2l0aHViLXN3YXRjaC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiLi4vLi4vLi4vLi4vc3JjL2xpYi9jb21wb25lbnRzL2dpdGh1Yi8iLCJzb3VyY2VzIjpbImdpdGh1Yi1zd2F0Y2guY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsTUFBTSxlQUFlLENBQUM7QUE0QmhHLE1BQU0sT0FBTyxxQkFBcUI7SUExQmxDO1FBNEJZLFlBQU8sR0FBRyxJQUFJLFlBQVksRUFBTyxDQUFDO1FBQ2xDLGtCQUFhLEdBQUcsSUFBSSxZQUFZLEVBQU8sQ0FBQztRQUNsRCxlQUFVLEdBQUc7WUFDWCxRQUFRLEVBQUUsVUFBVTtZQUNwQixTQUFTLEVBQUUsR0FBRztZQUNkLE9BQU8sRUFBRSxnQkFBZ0I7WUFDekIsWUFBWSxFQUFFLDhCQUE4QjtTQUM3QyxDQUFDO0lBS0osQ0FBQztJQUhDLFdBQVcsQ0FBQyxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUU7UUFDekIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQztJQUNyQyxDQUFDOzs7WUF2Q0YsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxxQkFBcUI7Z0JBQy9CLFFBQVEsRUFBRTs7Ozs7Ozs7Ozs7R0FXVDtnQkFVRCxlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTtnQkFDL0MsbUJBQW1CLEVBQUUsS0FBSzt5QkFUeEI7Ozs7OztLQU1DO2FBSUo7OztvQkFFRSxLQUFLO3NCQUNMLE1BQU07NEJBQ04sTUFBTSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENoYW5nZURldGVjdGlvblN0cmF0ZWd5LCBDb21wb25lbnQsIEV2ZW50RW1pdHRlciwgSW5wdXQsIE91dHB1dCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdjb2xvci1naXRodWItc3dhdGNoJyxcbiAgdGVtcGxhdGU6IGBcbiAgICA8ZGl2IGNsYXNzPVwiZ2l0aHViLXN3YXRjaFwiPlxuICAgICAgPGNvbG9yLXN3YXRjaFxuICAgICAgICBbY29sb3JdPVwiY29sb3JcIlxuICAgICAgICBbZm9jdXNTdHlsZV09XCJmb2N1c1N0eWxlXCJcbiAgICAgICAgKG9uQ2xpY2spPVwiaGFuZGxlQ2xpY2soJGV2ZW50KVwiXG4gICAgICAgIChvbkhvdmVyKT1cIm9uU3dhdGNoSG92ZXIuZW1pdCgkZXZlbnQpXCJcbiAgICAgICAgY2xhc3M9XCJzd2F0Y2hcIlxuICAgICAgPjwvY29sb3Itc3dhdGNoPlxuICAgICAgPGRpdiBjbGFzcz1cImNsZWFyXCI+PC9kaXY+XG4gICAgPC9kaXY+XG4gIGAsXG4gIHN0eWxlczogW1xuICAgIGBcbiAgICAgIC5naXRodWItc3dhdGNoIHtcbiAgICAgICAgd2lkdGg6IDI1cHg7XG4gICAgICAgIGhlaWdodDogMjVweDtcbiAgICAgICAgZm9udC1zaXplOiAwO1xuICAgICAgfVxuICAgIGAsXG4gIF0sXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBwcmVzZXJ2ZVdoaXRlc3BhY2VzOiBmYWxzZSxcbn0pXG5leHBvcnQgY2xhc3MgR2l0aHViU3dhdGNoQ29tcG9uZW50IHtcbiAgQElucHV0KCkgY29sb3IhOiBzdHJpbmc7XG4gIEBPdXRwdXQoKSBvbkNsaWNrID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG4gIEBPdXRwdXQoKSBvblN3YXRjaEhvdmVyID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG4gIGZvY3VzU3R5bGUgPSB7XG4gICAgcG9zaXRpb246ICdyZWxhdGl2ZScsXG4gICAgJ3otaW5kZXgnOiAnMicsXG4gICAgb3V0bGluZTogJzJweCBzb2xpZCAjZmZmJyxcbiAgICAnYm94LXNoYWRvdyc6ICcwIDAgNXB4IDJweCByZ2JhKDAsMCwwLDAuMjUpJyxcbiAgfTtcblxuICBoYW5kbGVDbGljayh7IGhleCwgJGV2ZW50IH0pIHtcbiAgICB0aGlzLm9uQ2xpY2suZW1pdCh7IGhleCwgJGV2ZW50IH0pO1xuICB9XG59XG4iXX0=