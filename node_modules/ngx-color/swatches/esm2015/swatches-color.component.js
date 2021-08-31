import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, } from '@angular/core';
import { getContrastingColor } from 'ngx-color';
export class SwatchesColorComponent {
    constructor() {
        this.first = false;
        this.last = false;
        this.onClick = new EventEmitter();
        this.onSwatchHover = new EventEmitter();
        this.getContrastingColor = getContrastingColor;
        this.colorStyle = {
            width: '40px',
            height: '24px',
            cursor: 'pointer',
            marginBottom: '1px',
        };
        this.focusStyle = {};
    }
    ngOnInit() {
        this.colorStyle.background = this.color;
        this.focusStyle.boxShadow = `0 0 4px ${this.color}`;
        if (this.first) {
            this.colorStyle.borderRadius = '2px 2px 0 0';
        }
        if (this.last) {
            this.colorStyle.borderRadius = '0 0 2px 2px';
        }
        if (this.color === '#FFFFFF') {
            this.colorStyle.boxShadow = 'inset 0 0 0 1px #ddd';
        }
    }
    handleClick($event) {
        this.onClick.emit({
            data: {
                hex: this.color,
                source: 'hex',
            },
            $event,
        });
    }
}
SwatchesColorComponent.decorators = [
    { type: Component, args: [{
                selector: 'color-swatches-color',
                template: `
    <color-swatch
      [color]="color"
      [style]="colorStyle"
      [focusStyle]="focusStyle"
      [class.first]="first"
      [class.last]="last"
      (click)="handleClick($event)"
      (keydown.enter)="handleClick($event)"
      (onHover)="onSwatchHover.emit($event)"
    >
      <div class="swatch-check" *ngIf="active" [class.first]="first" [class.last]="last">
        <svg
          style="width: 24px; height: 24px;"
          viewBox="0 0 24 24"
          [style.fill]="getContrastingColor(color)"
        >
          <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" />
        </svg>
      </div>
    </color-swatch>
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
      .swatch-check {
        display: flex;
        margin-left: 8px;
      }
    `]
            },] }
];
SwatchesColorComponent.propDecorators = {
    color: [{ type: Input }],
    first: [{ type: Input }],
    last: [{ type: Input }],
    active: [{ type: Input }],
    onClick: [{ type: Output }],
    onSwatchHover: [{ type: Output }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3dhdGNoZXMtY29sb3IuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Ii4uLy4uLy4uLy4uL3NyYy9saWIvY29tcG9uZW50cy9zd2F0Y2hlcy8iLCJzb3VyY2VzIjpbInN3YXRjaGVzLWNvbG9yLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQ0wsdUJBQXVCLEVBQ3ZCLFNBQVMsRUFDVCxZQUFZLEVBQ1osS0FBSyxFQUVMLE1BQU0sR0FDUCxNQUFNLGVBQWUsQ0FBQztBQUV2QixPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxXQUFXLENBQUM7QUEyQ2hELE1BQU0sT0FBTyxzQkFBc0I7SUF6Q25DO1FBMkNXLFVBQUssR0FBRyxLQUFLLENBQUM7UUFDZCxTQUFJLEdBQUcsS0FBSyxDQUFDO1FBRVosWUFBTyxHQUFHLElBQUksWUFBWSxFQUFPLENBQUM7UUFDbEMsa0JBQWEsR0FBRyxJQUFJLFlBQVksRUFBTyxDQUFDO1FBQ2xELHdCQUFtQixHQUFHLG1CQUFtQixDQUFDO1FBQzFDLGVBQVUsR0FBMkI7WUFDbkMsS0FBSyxFQUFFLE1BQU07WUFDYixNQUFNLEVBQUUsTUFBTTtZQUNkLE1BQU0sRUFBRSxTQUFTO1lBQ2pCLFlBQVksRUFBRSxLQUFLO1NBQ3BCLENBQUM7UUFDRixlQUFVLEdBQTJCLEVBQUUsQ0FBQztJQXdCMUMsQ0FBQztJQXRCQyxRQUFRO1FBQ04sSUFBSSxDQUFDLFVBQVUsQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztRQUN4QyxJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsR0FBRyxXQUFXLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUNwRCxJQUFJLElBQUksQ0FBQyxLQUFLLEVBQUU7WUFDZCxJQUFJLENBQUMsVUFBVSxDQUFDLFlBQVksR0FBRyxhQUFhLENBQUM7U0FDOUM7UUFDRCxJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUU7WUFDYixJQUFJLENBQUMsVUFBVSxDQUFDLFlBQVksR0FBRyxhQUFhLENBQUM7U0FDOUM7UUFDRCxJQUFJLElBQUksQ0FBQyxLQUFLLEtBQUssU0FBUyxFQUFFO1lBQzVCLElBQUksQ0FBQyxVQUFVLENBQUMsU0FBUyxHQUFHLHNCQUFzQixDQUFDO1NBQ3BEO0lBQ0gsQ0FBQztJQUNELFdBQVcsQ0FBQyxNQUFNO1FBQ2hCLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDO1lBQ2hCLElBQUksRUFBRTtnQkFDSixHQUFHLEVBQUUsSUFBSSxDQUFDLEtBQUs7Z0JBQ2YsTUFBTSxFQUFFLEtBQUs7YUFDZDtZQUNELE1BQU07U0FDUCxDQUFDLENBQUM7SUFDTCxDQUFDOzs7WUE5RUYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxzQkFBc0I7Z0JBQ2hDLFFBQVEsRUFBRTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBcUJUO2dCQWVELGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNO2dCQUMvQyxtQkFBbUIsRUFBRSxLQUFLO3lCQWR4Qjs7Ozs7Ozs7Ozs7S0FXQzthQUlKOzs7b0JBRUUsS0FBSztvQkFDTCxLQUFLO21CQUNMLEtBQUs7cUJBQ0wsS0FBSztzQkFDTCxNQUFNOzRCQUNOLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ29tcG9uZW50LFxuICBFdmVudEVtaXR0ZXIsXG4gIElucHV0LFxuICBPbkluaXQsXG4gIE91dHB1dCxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IGdldENvbnRyYXN0aW5nQ29sb3IgfSBmcm9tICduZ3gtY29sb3InO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdjb2xvci1zd2F0Y2hlcy1jb2xvcicsXG4gIHRlbXBsYXRlOiBgXG4gICAgPGNvbG9yLXN3YXRjaFxuICAgICAgW2NvbG9yXT1cImNvbG9yXCJcbiAgICAgIFtzdHlsZV09XCJjb2xvclN0eWxlXCJcbiAgICAgIFtmb2N1c1N0eWxlXT1cImZvY3VzU3R5bGVcIlxuICAgICAgW2NsYXNzLmZpcnN0XT1cImZpcnN0XCJcbiAgICAgIFtjbGFzcy5sYXN0XT1cImxhc3RcIlxuICAgICAgKGNsaWNrKT1cImhhbmRsZUNsaWNrKCRldmVudClcIlxuICAgICAgKGtleWRvd24uZW50ZXIpPVwiaGFuZGxlQ2xpY2soJGV2ZW50KVwiXG4gICAgICAob25Ib3Zlcik9XCJvblN3YXRjaEhvdmVyLmVtaXQoJGV2ZW50KVwiXG4gICAgPlxuICAgICAgPGRpdiBjbGFzcz1cInN3YXRjaC1jaGVja1wiICpuZ0lmPVwiYWN0aXZlXCIgW2NsYXNzLmZpcnN0XT1cImZpcnN0XCIgW2NsYXNzLmxhc3RdPVwibGFzdFwiPlxuICAgICAgICA8c3ZnXG4gICAgICAgICAgc3R5bGU9XCJ3aWR0aDogMjRweDsgaGVpZ2h0OiAyNHB4O1wiXG4gICAgICAgICAgdmlld0JveD1cIjAgMCAyNCAyNFwiXG4gICAgICAgICAgW3N0eWxlLmZpbGxdPVwiZ2V0Q29udHJhc3RpbmdDb2xvcihjb2xvcilcIlxuICAgICAgICA+XG4gICAgICAgICAgPHBhdGggZD1cIk0yMSw3TDksMTlMMy41LDEzLjVMNC45MSwxMi4wOUw5LDE2LjE3TDE5LjU5LDUuNTlMMjEsN1pcIiAvPlxuICAgICAgICA8L3N2Zz5cbiAgICAgIDwvZGl2PlxuICAgIDwvY29sb3Itc3dhdGNoPlxuICBgLFxuICBzdHlsZXM6IFtcbiAgICBgXG4gICAgICAuc3dhdGNoZXMtZ3JvdXAge1xuICAgICAgICBwYWRkaW5nLWJvdHRvbTogMTBweDtcbiAgICAgICAgd2lkdGg6IDQwcHg7XG4gICAgICAgIGZsb2F0OiBsZWZ0O1xuICAgICAgICBtYXJnaW4tcmlnaHQ6IDEwcHg7XG4gICAgICB9XG4gICAgICAuc3dhdGNoLWNoZWNrIHtcbiAgICAgICAgZGlzcGxheTogZmxleDtcbiAgICAgICAgbWFyZ2luLWxlZnQ6IDhweDtcbiAgICAgIH1cbiAgICBgLFxuICBdLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgcHJlc2VydmVXaGl0ZXNwYWNlczogZmFsc2UsXG59KVxuZXhwb3J0IGNsYXNzIFN3YXRjaGVzQ29sb3JDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuICBASW5wdXQoKSBjb2xvciE6IHN0cmluZztcbiAgQElucHV0KCkgZmlyc3QgPSBmYWxzZTtcbiAgQElucHV0KCkgbGFzdCA9IGZhbHNlO1xuICBASW5wdXQoKSBhY3RpdmUhOiBib29sZWFuO1xuICBAT3V0cHV0KCkgb25DbGljayA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICBAT3V0cHV0KCkgb25Td2F0Y2hIb3ZlciA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICBnZXRDb250cmFzdGluZ0NvbG9yID0gZ2V0Q29udHJhc3RpbmdDb2xvcjtcbiAgY29sb3JTdHlsZTogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHtcbiAgICB3aWR0aDogJzQwcHgnLFxuICAgIGhlaWdodDogJzI0cHgnLFxuICAgIGN1cnNvcjogJ3BvaW50ZXInLFxuICAgIG1hcmdpbkJvdHRvbTogJzFweCcsXG4gIH07XG4gIGZvY3VzU3R5bGU6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7fTtcblxuICBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLmNvbG9yU3R5bGUuYmFja2dyb3VuZCA9IHRoaXMuY29sb3I7XG4gICAgdGhpcy5mb2N1c1N0eWxlLmJveFNoYWRvdyA9IGAwIDAgNHB4ICR7dGhpcy5jb2xvcn1gO1xuICAgIGlmICh0aGlzLmZpcnN0KSB7XG4gICAgICB0aGlzLmNvbG9yU3R5bGUuYm9yZGVyUmFkaXVzID0gJzJweCAycHggMCAwJztcbiAgICB9XG4gICAgaWYgKHRoaXMubGFzdCkge1xuICAgICAgdGhpcy5jb2xvclN0eWxlLmJvcmRlclJhZGl1cyA9ICcwIDAgMnB4IDJweCc7XG4gICAgfVxuICAgIGlmICh0aGlzLmNvbG9yID09PSAnI0ZGRkZGRicpIHtcbiAgICAgIHRoaXMuY29sb3JTdHlsZS5ib3hTaGFkb3cgPSAnaW5zZXQgMCAwIDAgMXB4ICNkZGQnO1xuICAgIH1cbiAgfVxuICBoYW5kbGVDbGljaygkZXZlbnQpIHtcbiAgICB0aGlzLm9uQ2xpY2suZW1pdCh7XG4gICAgICBkYXRhOiB7XG4gICAgICAgIGhleDogdGhpcy5jb2xvcixcbiAgICAgICAgc291cmNlOiAnaGV4JyxcbiAgICAgIH0sXG4gICAgICAkZXZlbnQsXG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==