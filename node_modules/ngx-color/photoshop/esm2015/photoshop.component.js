import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, NgModule, Output, } from '@angular/core';
import { ColorWrap, AlphaModule, EditableInputModule, HueModule, SaturationModule, SwatchModule, } from 'ngx-color';
import { PhotoshopButtonComponent } from './photoshop-button.component';
import { PhotoshopFieldsComponent } from './photoshop-fields.component';
import { PhotoshopPreviewsComponent } from './photoshop-previews.component';
export class PhotoshopComponent extends ColorWrap {
    constructor() {
        super();
        /** Title text */
        this.header = 'Color Picker';
        this.onAccept = new EventEmitter();
        this.onCancel = new EventEmitter();
        this.circle = {
            width: '12px',
            height: '12px',
            borderRadius: '6px',
            boxShadow: 'rgb(255, 255, 255) 0px 0px 0px 1px inset',
            transform: 'translate(-6px, -10px)',
        };
    }
    handleValueChange({ data, $event }) {
        this.handleChange(data, $event);
    }
}
PhotoshopComponent.decorators = [
    { type: Component, args: [{
                selector: 'color-photoshop',
                template: `
  <div class="photoshop-picker {{ className }}">
    <div class="photoshop-head">{{ header }}</div>
    <div class="photoshop-body">
      <div class="photoshop-saturation">
        <color-saturation
          [hsl]="hsl" [hsv]="hsv" [circle]="circle"
          (onChange)="handleValueChange($event)"
        ></color-saturation>
      </div>
      <div class="photoshop-hue">
        <color-hue direction="vertical"
          [hsl]="hsl" [hidePointer]="true"
          (onChange)="handleValueChange($event)"
        ></color-hue>
      </div>
      <div class="photoshop-controls">
        <div class="photoshop-top">
          <div class="photoshop-previews">
            <color-photoshop-previews
              [rgb]="rgb" [currentColor]="currentColor"
            ></color-photoshop-previews>
          </div>
          <div class="photoshop-actions">
            <color-photoshop-button label="OK"
              [active]="true" (onClick)="onAccept.emit($event)"
            ></color-photoshop-button>
            <color-photoshop-button label="Cancel"
              (onClick)="onCancel.emit($event)"
            >
            </color-photoshop-button>
            <color-photoshop-fields
              [rgb]="rgb" [hex]="hex" [hsv]="hsv"
              (onChange)="handleValueChange($event)"
            ></color-photoshop-fields>
          </div>
        </div>
      </div>
    </div>
  </div>
  `,
                changeDetection: ChangeDetectionStrategy.OnPush,
                preserveWhitespaces: false,
                styles: [`
    .photoshop-picker {
      background: rgb(220, 220, 220);
      border-radius: 4px;
      box-shadow: rgba(0, 0, 0, 0.25) 0px 0px 0px 1px, rgba(0, 0, 0, 0.15) 0px 8px 16px;
      box-sizing: initial; width: 513px;
    }
    .photoshop-head {
      background-image: linear-gradient(
        -180deg,
        rgb(240, 240, 240) 0%,
        rgb(212, 212, 212) 100%
      );
      border-bottom: 1px solid rgb(177, 177, 177);
      box-shadow: rgba(255, 255, 255, 0.2) 0px 1px 0px 0px inset,
        rgba(0, 0, 0, 0.02) 0px -1px 0px 0px inset;
      height: 23px;
      line-height: 24px;
      border-radius: 4px 4px 0px 0px;
      font-size: 13px;
      color: rgb(77, 77, 77);
      text-align: center;
    }
    .photoshop-body {
      padding: 15px 15px 0px;
      display: flex;
    }
    .photoshop-saturation {
      width: 256px;
      height: 256px;
      position: relative;
      border-width: 2px;
      border-style: solid;
      border-color: rgb(179, 179, 179) rgb(179, 179, 179) rgb(240, 240, 240);
      border-image: initial;
      overflow: hidden;
    }
    .photoshop-hue {
      position: relative;
      height: 256px;
      width: 23px;
      margin-left: 10px;
      border-width: 2px;
      border-style: solid;
      border-color: rgb(179, 179, 179) rgb(179, 179, 179) rgb(240, 240, 240);
      border-image: initial;
    }
    .photoshop-controls {
      width: 180px;
      margin-left: 10px;
    }
    .photoshop-top {
      display: flex;
    }
    .photoshop-previews {
      width: 60px;
    }
    .photoshop-actions {
      -webkit-box-flex: 1;
      flex: 1 1 0%;
      margin-left: 20px;
    }
  `]
            },] }
];
PhotoshopComponent.ctorParameters = () => [];
PhotoshopComponent.propDecorators = {
    header: [{ type: Input }],
    onAccept: [{ type: Output }],
    onCancel: [{ type: Output }]
};
export class ColorPhotoshopModule {
}
ColorPhotoshopModule.decorators = [
    { type: NgModule, args: [{
                declarations: [
                    PhotoshopComponent,
                    PhotoshopPreviewsComponent,
                    PhotoshopButtonComponent,
                    PhotoshopFieldsComponent,
                ],
                exports: [
                    PhotoshopComponent,
                    PhotoshopPreviewsComponent,
                    PhotoshopButtonComponent,
                    PhotoshopFieldsComponent,
                ],
                imports: [
                    CommonModule,
                    EditableInputModule,
                    HueModule,
                    AlphaModule,
                    SwatchModule,
                    SaturationModule,
                ],
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGhvdG9zaG9wLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIuLi8uLi8uLi8uLi9zcmMvbGliL2NvbXBvbmVudHMvcGhvdG9zaG9wLyIsInNvdXJjZXMiOlsicGhvdG9zaG9wLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDL0MsT0FBTyxFQUNMLHVCQUF1QixFQUN2QixTQUFTLEVBQ1QsWUFBWSxFQUNaLEtBQUssRUFDTCxRQUFRLEVBQ1IsTUFBTSxHQUNQLE1BQU0sZUFBZSxDQUFDO0FBRXZCLE9BQU8sRUFDTCxTQUFTLEVBQ1QsV0FBVyxFQUNYLG1CQUFtQixFQUNuQixTQUFTLEVBQ1QsZ0JBQWdCLEVBQ2hCLFlBQVksR0FDYixNQUFNLFdBQVcsQ0FBQztBQUNuQixPQUFPLEVBQUUsd0JBQXdCLEVBQUUsTUFBTSw4QkFBOEIsQ0FBQztBQUN4RSxPQUFPLEVBQUUsd0JBQXdCLEVBQUUsTUFBTSw4QkFBOEIsQ0FBQztBQUN4RSxPQUFPLEVBQUUsMEJBQTBCLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQztBQWlINUUsTUFBTSxPQUFPLGtCQUFtQixTQUFRLFNBQVM7SUFZL0M7UUFDRSxLQUFLLEVBQUUsQ0FBQztRQVpWLGlCQUFpQjtRQUNSLFdBQU0sR0FBRyxjQUFjLENBQUM7UUFDdkIsYUFBUSxHQUFHLElBQUksWUFBWSxFQUFTLENBQUM7UUFDckMsYUFBUSxHQUFHLElBQUksWUFBWSxFQUFTLENBQUM7UUFDL0MsV0FBTSxHQUFHO1lBQ1AsS0FBSyxFQUFFLE1BQU07WUFDYixNQUFNLEVBQUUsTUFBTTtZQUNkLFlBQVksRUFBRSxLQUFLO1lBQ25CLFNBQVMsRUFBRSwwQ0FBMEM7WUFDckQsU0FBUyxFQUFFLHdCQUF3QjtTQUNwQyxDQUFDO0lBR0YsQ0FBQztJQUNELGlCQUFpQixDQUFDLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRTtRQUNoQyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztJQUNsQyxDQUFDOzs7WUFoSUYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxpQkFBaUI7Z0JBQzNCLFFBQVEsRUFBRTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXdDVDtnQkFrRUQsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07Z0JBQy9DLG1CQUFtQixFQUFFLEtBQUs7eUJBakV4Qjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0E4REQ7YUFJRjs7OztxQkFHRSxLQUFLO3VCQUNMLE1BQU07dUJBQ04sTUFBTTs7QUFzQ1QsTUFBTSxPQUFPLG9CQUFvQjs7O1lBdEJoQyxRQUFRLFNBQUM7Z0JBQ1IsWUFBWSxFQUFFO29CQUNaLGtCQUFrQjtvQkFDbEIsMEJBQTBCO29CQUMxQix3QkFBd0I7b0JBQ3hCLHdCQUF3QjtpQkFDekI7Z0JBQ0QsT0FBTyxFQUFFO29CQUNQLGtCQUFrQjtvQkFDbEIsMEJBQTBCO29CQUMxQix3QkFBd0I7b0JBQ3hCLHdCQUF3QjtpQkFDekI7Z0JBQ0QsT0FBTyxFQUFFO29CQUNQLFlBQVk7b0JBQ1osbUJBQW1CO29CQUNuQixTQUFTO29CQUNULFdBQVc7b0JBQ1gsWUFBWTtvQkFDWixnQkFBZ0I7aUJBQ2pCO2FBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENvbXBvbmVudCxcbiAgRXZlbnRFbWl0dGVyLFxuICBJbnB1dCxcbiAgTmdNb2R1bGUsXG4gIE91dHB1dCxcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7XG4gIENvbG9yV3JhcCxcbiAgQWxwaGFNb2R1bGUsXG4gIEVkaXRhYmxlSW5wdXRNb2R1bGUsXG4gIEh1ZU1vZHVsZSxcbiAgU2F0dXJhdGlvbk1vZHVsZSxcbiAgU3dhdGNoTW9kdWxlLFxufSBmcm9tICduZ3gtY29sb3InO1xuaW1wb3J0IHsgUGhvdG9zaG9wQnV0dG9uQ29tcG9uZW50IH0gZnJvbSAnLi9waG90b3Nob3AtYnV0dG9uLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBQaG90b3Nob3BGaWVsZHNDb21wb25lbnQgfSBmcm9tICcuL3Bob3Rvc2hvcC1maWVsZHMuY29tcG9uZW50JztcbmltcG9ydCB7IFBob3Rvc2hvcFByZXZpZXdzQ29tcG9uZW50IH0gZnJvbSAnLi9waG90b3Nob3AtcHJldmlld3MuY29tcG9uZW50JztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnY29sb3ItcGhvdG9zaG9wJyxcbiAgdGVtcGxhdGU6IGBcbiAgPGRpdiBjbGFzcz1cInBob3Rvc2hvcC1waWNrZXIge3sgY2xhc3NOYW1lIH19XCI+XG4gICAgPGRpdiBjbGFzcz1cInBob3Rvc2hvcC1oZWFkXCI+e3sgaGVhZGVyIH19PC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cInBob3Rvc2hvcC1ib2R5XCI+XG4gICAgICA8ZGl2IGNsYXNzPVwicGhvdG9zaG9wLXNhdHVyYXRpb25cIj5cbiAgICAgICAgPGNvbG9yLXNhdHVyYXRpb25cbiAgICAgICAgICBbaHNsXT1cImhzbFwiIFtoc3ZdPVwiaHN2XCIgW2NpcmNsZV09XCJjaXJjbGVcIlxuICAgICAgICAgIChvbkNoYW5nZSk9XCJoYW5kbGVWYWx1ZUNoYW5nZSgkZXZlbnQpXCJcbiAgICAgICAgPjwvY29sb3Itc2F0dXJhdGlvbj5cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdiBjbGFzcz1cInBob3Rvc2hvcC1odWVcIj5cbiAgICAgICAgPGNvbG9yLWh1ZSBkaXJlY3Rpb249XCJ2ZXJ0aWNhbFwiXG4gICAgICAgICAgW2hzbF09XCJoc2xcIiBbaGlkZVBvaW50ZXJdPVwidHJ1ZVwiXG4gICAgICAgICAgKG9uQ2hhbmdlKT1cImhhbmRsZVZhbHVlQ2hhbmdlKCRldmVudClcIlxuICAgICAgICA+PC9jb2xvci1odWU+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXYgY2xhc3M9XCJwaG90b3Nob3AtY29udHJvbHNcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cInBob3Rvc2hvcC10b3BcIj5cbiAgICAgICAgICA8ZGl2IGNsYXNzPVwicGhvdG9zaG9wLXByZXZpZXdzXCI+XG4gICAgICAgICAgICA8Y29sb3ItcGhvdG9zaG9wLXByZXZpZXdzXG4gICAgICAgICAgICAgIFtyZ2JdPVwicmdiXCIgW2N1cnJlbnRDb2xvcl09XCJjdXJyZW50Q29sb3JcIlxuICAgICAgICAgICAgPjwvY29sb3ItcGhvdG9zaG9wLXByZXZpZXdzPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJwaG90b3Nob3AtYWN0aW9uc1wiPlxuICAgICAgICAgICAgPGNvbG9yLXBob3Rvc2hvcC1idXR0b24gbGFiZWw9XCJPS1wiXG4gICAgICAgICAgICAgIFthY3RpdmVdPVwidHJ1ZVwiIChvbkNsaWNrKT1cIm9uQWNjZXB0LmVtaXQoJGV2ZW50KVwiXG4gICAgICAgICAgICA+PC9jb2xvci1waG90b3Nob3AtYnV0dG9uPlxuICAgICAgICAgICAgPGNvbG9yLXBob3Rvc2hvcC1idXR0b24gbGFiZWw9XCJDYW5jZWxcIlxuICAgICAgICAgICAgICAob25DbGljayk9XCJvbkNhbmNlbC5lbWl0KCRldmVudClcIlxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgPC9jb2xvci1waG90b3Nob3AtYnV0dG9uPlxuICAgICAgICAgICAgPGNvbG9yLXBob3Rvc2hvcC1maWVsZHNcbiAgICAgICAgICAgICAgW3JnYl09XCJyZ2JcIiBbaGV4XT1cImhleFwiIFtoc3ZdPVwiaHN2XCJcbiAgICAgICAgICAgICAgKG9uQ2hhbmdlKT1cImhhbmRsZVZhbHVlQ2hhbmdlKCRldmVudClcIlxuICAgICAgICAgICAgPjwvY29sb3ItcGhvdG9zaG9wLWZpZWxkcz5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgPC9kaXY+XG4gIGAsXG4gIHN0eWxlczogW1xuICAgIGBcbiAgICAucGhvdG9zaG9wLXBpY2tlciB7XG4gICAgICBiYWNrZ3JvdW5kOiByZ2IoMjIwLCAyMjAsIDIyMCk7XG4gICAgICBib3JkZXItcmFkaXVzOiA0cHg7XG4gICAgICBib3gtc2hhZG93OiByZ2JhKDAsIDAsIDAsIDAuMjUpIDBweCAwcHggMHB4IDFweCwgcmdiYSgwLCAwLCAwLCAwLjE1KSAwcHggOHB4IDE2cHg7XG4gICAgICBib3gtc2l6aW5nOiBpbml0aWFsOyB3aWR0aDogNTEzcHg7XG4gICAgfVxuICAgIC5waG90b3Nob3AtaGVhZCB7XG4gICAgICBiYWNrZ3JvdW5kLWltYWdlOiBsaW5lYXItZ3JhZGllbnQoXG4gICAgICAgIC0xODBkZWcsXG4gICAgICAgIHJnYigyNDAsIDI0MCwgMjQwKSAwJSxcbiAgICAgICAgcmdiKDIxMiwgMjEyLCAyMTIpIDEwMCVcbiAgICAgICk7XG4gICAgICBib3JkZXItYm90dG9tOiAxcHggc29saWQgcmdiKDE3NywgMTc3LCAxNzcpO1xuICAgICAgYm94LXNoYWRvdzogcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjIpIDBweCAxcHggMHB4IDBweCBpbnNldCxcbiAgICAgICAgcmdiYSgwLCAwLCAwLCAwLjAyKSAwcHggLTFweCAwcHggMHB4IGluc2V0O1xuICAgICAgaGVpZ2h0OiAyM3B4O1xuICAgICAgbGluZS1oZWlnaHQ6IDI0cHg7XG4gICAgICBib3JkZXItcmFkaXVzOiA0cHggNHB4IDBweCAwcHg7XG4gICAgICBmb250LXNpemU6IDEzcHg7XG4gICAgICBjb2xvcjogcmdiKDc3LCA3NywgNzcpO1xuICAgICAgdGV4dC1hbGlnbjogY2VudGVyO1xuICAgIH1cbiAgICAucGhvdG9zaG9wLWJvZHkge1xuICAgICAgcGFkZGluZzogMTVweCAxNXB4IDBweDtcbiAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgfVxuICAgIC5waG90b3Nob3Atc2F0dXJhdGlvbiB7XG4gICAgICB3aWR0aDogMjU2cHg7XG4gICAgICBoZWlnaHQ6IDI1NnB4O1xuICAgICAgcG9zaXRpb246IHJlbGF0aXZlO1xuICAgICAgYm9yZGVyLXdpZHRoOiAycHg7XG4gICAgICBib3JkZXItc3R5bGU6IHNvbGlkO1xuICAgICAgYm9yZGVyLWNvbG9yOiByZ2IoMTc5LCAxNzksIDE3OSkgcmdiKDE3OSwgMTc5LCAxNzkpIHJnYigyNDAsIDI0MCwgMjQwKTtcbiAgICAgIGJvcmRlci1pbWFnZTogaW5pdGlhbDtcbiAgICAgIG92ZXJmbG93OiBoaWRkZW47XG4gICAgfVxuICAgIC5waG90b3Nob3AtaHVlIHtcbiAgICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgICAgIGhlaWdodDogMjU2cHg7XG4gICAgICB3aWR0aDogMjNweDtcbiAgICAgIG1hcmdpbi1sZWZ0OiAxMHB4O1xuICAgICAgYm9yZGVyLXdpZHRoOiAycHg7XG4gICAgICBib3JkZXItc3R5bGU6IHNvbGlkO1xuICAgICAgYm9yZGVyLWNvbG9yOiByZ2IoMTc5LCAxNzksIDE3OSkgcmdiKDE3OSwgMTc5LCAxNzkpIHJnYigyNDAsIDI0MCwgMjQwKTtcbiAgICAgIGJvcmRlci1pbWFnZTogaW5pdGlhbDtcbiAgICB9XG4gICAgLnBob3Rvc2hvcC1jb250cm9scyB7XG4gICAgICB3aWR0aDogMTgwcHg7XG4gICAgICBtYXJnaW4tbGVmdDogMTBweDtcbiAgICB9XG4gICAgLnBob3Rvc2hvcC10b3Age1xuICAgICAgZGlzcGxheTogZmxleDtcbiAgICB9XG4gICAgLnBob3Rvc2hvcC1wcmV2aWV3cyB7XG4gICAgICB3aWR0aDogNjBweDtcbiAgICB9XG4gICAgLnBob3Rvc2hvcC1hY3Rpb25zIHtcbiAgICAgIC13ZWJraXQtYm94LWZsZXg6IDE7XG4gICAgICBmbGV4OiAxIDEgMCU7XG4gICAgICBtYXJnaW4tbGVmdDogMjBweDtcbiAgICB9XG4gIGAsXG4gIF0sXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBwcmVzZXJ2ZVdoaXRlc3BhY2VzOiBmYWxzZSxcbn0pXG5leHBvcnQgY2xhc3MgUGhvdG9zaG9wQ29tcG9uZW50IGV4dGVuZHMgQ29sb3JXcmFwIHtcbiAgLyoqIFRpdGxlIHRleHQgKi9cbiAgQElucHV0KCkgaGVhZGVyID0gJ0NvbG9yIFBpY2tlcic7XG4gIEBPdXRwdXQoKSBvbkFjY2VwdCA9IG5ldyBFdmVudEVtaXR0ZXI8RXZlbnQ+KCk7XG4gIEBPdXRwdXQoKSBvbkNhbmNlbCA9IG5ldyBFdmVudEVtaXR0ZXI8RXZlbnQ+KCk7XG4gIGNpcmNsZSA9IHtcbiAgICB3aWR0aDogJzEycHgnLFxuICAgIGhlaWdodDogJzEycHgnLFxuICAgIGJvcmRlclJhZGl1czogJzZweCcsXG4gICAgYm94U2hhZG93OiAncmdiKDI1NSwgMjU1LCAyNTUpIDBweCAwcHggMHB4IDFweCBpbnNldCcsXG4gICAgdHJhbnNmb3JtOiAndHJhbnNsYXRlKC02cHgsIC0xMHB4KScsXG4gIH07XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG4gIH1cbiAgaGFuZGxlVmFsdWVDaGFuZ2UoeyBkYXRhLCAkZXZlbnQgfSkge1xuICAgIHRoaXMuaGFuZGxlQ2hhbmdlKGRhdGEsICRldmVudCk7XG4gIH1cbn1cblxuQE5nTW9kdWxlKHtcbiAgZGVjbGFyYXRpb25zOiBbXG4gICAgUGhvdG9zaG9wQ29tcG9uZW50LFxuICAgIFBob3Rvc2hvcFByZXZpZXdzQ29tcG9uZW50LFxuICAgIFBob3Rvc2hvcEJ1dHRvbkNvbXBvbmVudCxcbiAgICBQaG90b3Nob3BGaWVsZHNDb21wb25lbnQsXG4gIF0sXG4gIGV4cG9ydHM6IFtcbiAgICBQaG90b3Nob3BDb21wb25lbnQsXG4gICAgUGhvdG9zaG9wUHJldmlld3NDb21wb25lbnQsXG4gICAgUGhvdG9zaG9wQnV0dG9uQ29tcG9uZW50LFxuICAgIFBob3Rvc2hvcEZpZWxkc0NvbXBvbmVudCxcbiAgXSxcbiAgaW1wb3J0czogW1xuICAgIENvbW1vbk1vZHVsZSxcbiAgICBFZGl0YWJsZUlucHV0TW9kdWxlLFxuICAgIEh1ZU1vZHVsZSxcbiAgICBBbHBoYU1vZHVsZSxcbiAgICBTd2F0Y2hNb2R1bGUsXG4gICAgU2F0dXJhdGlvbk1vZHVsZSxcbiAgXSxcbn0pXG5leHBvcnQgY2xhc3MgQ29sb3JQaG90b3Nob3BNb2R1bGUge31cbiJdfQ==