import { Directive, ElementRef, HostListener, NgModule, Output, } from '@angular/core';
import { Subject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
export class CoordinatesDirective {
    constructor(el) {
        this.el = el;
        this.coordinatesChange = new Subject();
        this.mousechange = new Subject();
        this.mouseListening = false;
    }
    mousemove($event, x, y, isTouch = false) {
        if (this.mouseListening) {
            $event.preventDefault();
            this.mousechange.next({ $event, x, y, isTouch });
        }
    }
    mouseup() {
        this.mouseListening = false;
    }
    mousedown($event, x, y, isTouch = false) {
        $event.preventDefault();
        this.mouseListening = true;
        this.mousechange.next({ $event, x, y, isTouch });
    }
    ngOnInit() {
        this.sub = this.mousechange
            .pipe(
        // limit times it is updated for the same area
        distinctUntilChanged((p, q) => p.x === q.x && p.y === q.y))
            .subscribe(n => this.handleChange(n.x, n.y, n.$event, n.isTouch));
    }
    ngOnDestroy() {
        this.sub.unsubscribe();
    }
    handleChange(x, y, $event, isTouch) {
        const containerWidth = this.el.nativeElement.clientWidth;
        const containerHeight = this.el.nativeElement.clientHeight;
        const left = x -
            (this.el.nativeElement.getBoundingClientRect().left + window.pageXOffset);
        let top = y - this.el.nativeElement.getBoundingClientRect().top;
        if (!isTouch) {
            top = top - window.pageYOffset;
        }
        this.coordinatesChange.next({
            x,
            y,
            top,
            left,
            containerWidth,
            containerHeight,
            $event,
        });
    }
}
CoordinatesDirective.decorators = [
    { type: Directive, args: [{ selector: '[ngx-color-coordinates]' },] }
];
CoordinatesDirective.ctorParameters = () => [
    { type: ElementRef }
];
CoordinatesDirective.propDecorators = {
    coordinatesChange: [{ type: Output }],
    mousemove: [{ type: HostListener, args: ['window:mousemove', ['$event', '$event.pageX', '$event.pageY'],] }, { type: HostListener, args: ['window:touchmove', [
                    '$event',
                    '$event.touches[0].clientX',
                    '$event.touches[0].clientY',
                    'true',
                ],] }],
    mouseup: [{ type: HostListener, args: ['window:mouseup',] }, { type: HostListener, args: ['window:touchend',] }],
    mousedown: [{ type: HostListener, args: ['mousedown', ['$event', '$event.pageX', '$event.pageY'],] }, { type: HostListener, args: ['touchstart', [
                    '$event',
                    '$event.touches[0].clientX',
                    '$event.touches[0].clientY',
                    'true',
                ],] }]
};
export class CoordinatesModule {
}
CoordinatesModule.decorators = [
    { type: NgModule, args: [{
                declarations: [CoordinatesDirective],
                exports: [CoordinatesDirective],
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29vcmRpbmF0ZXMuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6Ii4uLy4uLy4uL3NyYy9saWIvY29tbW9uLyIsInNvdXJjZXMiOlsiY29vcmRpbmF0ZXMuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFDTCxTQUFTLEVBQ1QsVUFBVSxFQUNWLFlBQVksRUFDWixRQUFRLEVBR1IsTUFBTSxHQUNQLE1BQU0sZUFBZSxDQUFDO0FBRXZCLE9BQU8sRUFBRSxPQUFPLEVBQWdCLE1BQU0sTUFBTSxDQUFDO0FBQzdDLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBR3RELE1BQU0sT0FBTyxvQkFBb0I7SUFtRC9CLFlBQW9CLEVBQWM7UUFBZCxPQUFFLEdBQUYsRUFBRSxDQUFZO1FBakRsQyxzQkFBaUIsR0FBRyxJQUFJLE9BQU8sRUFRM0IsQ0FBQztRQUNHLGdCQUFXLEdBQUcsSUFBSSxPQUFPLEVBSzdCLENBQUM7UUFFRyxtQkFBYyxHQUFHLEtBQUssQ0FBQztJQWlDTSxDQUFDO0lBeEJ0QyxTQUFTLENBQUMsTUFBYSxFQUFFLENBQVMsRUFBRSxDQUFTLEVBQUUsT0FBTyxHQUFHLEtBQUs7UUFDNUQsSUFBSSxJQUFJLENBQUMsY0FBYyxFQUFFO1lBQ3ZCLE1BQU0sQ0FBQyxjQUFjLEVBQUUsQ0FBQztZQUN4QixJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUM7U0FDbEQ7SUFDSCxDQUFDO0lBR0QsT0FBTztRQUNMLElBQUksQ0FBQyxjQUFjLEdBQUcsS0FBSyxDQUFDO0lBQzlCLENBQUM7SUFRRCxTQUFTLENBQUMsTUFBYSxFQUFFLENBQVMsRUFBRSxDQUFTLEVBQUUsT0FBTyxHQUFHLEtBQUs7UUFDNUQsTUFBTSxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQ3hCLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDO1FBQzNCLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQztJQUNuRCxDQUFDO0lBSUQsUUFBUTtRQUNOLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLFdBQVc7YUFDeEIsSUFBSTtRQUNILDhDQUE4QztRQUM5QyxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FDM0Q7YUFDQSxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO0lBQ3RFLENBQUM7SUFFRCxXQUFXO1FBQ1QsSUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUN6QixDQUFDO0lBRUQsWUFBWSxDQUFDLENBQVMsRUFBRSxDQUFTLEVBQUUsTUFBYSxFQUFFLE9BQWdCO1FBQ2hFLE1BQU0sY0FBYyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQztRQUN6RCxNQUFNLGVBQWUsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUM7UUFDM0QsTUFBTSxJQUFJLEdBQ1IsQ0FBQztZQUNELENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLENBQUMscUJBQXFCLEVBQUUsQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQzVFLElBQUksR0FBRyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxxQkFBcUIsRUFBRSxDQUFDLEdBQUcsQ0FBQztRQUVoRSxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQ1osR0FBRyxHQUFHLEdBQUcsR0FBRyxNQUFNLENBQUMsV0FBVyxDQUFDO1NBQ2hDO1FBQ0QsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQztZQUMxQixDQUFDO1lBQ0QsQ0FBQztZQUNELEdBQUc7WUFDSCxJQUFJO1lBQ0osY0FBYztZQUNkLGVBQWU7WUFDZixNQUFNO1NBQ1AsQ0FBQyxDQUFDO0lBQ0wsQ0FBQzs7O1lBdkZGLFNBQVMsU0FBQyxFQUFFLFFBQVEsRUFBRSx5QkFBeUIsRUFBRTs7O1lBWGhELFVBQVU7OztnQ0FhVCxNQUFNO3dCQW1CTixZQUFZLFNBQUMsa0JBQWtCLEVBQUUsQ0FBQyxRQUFRLEVBQUUsY0FBYyxFQUFFLGNBQWMsQ0FBQyxjQUMzRSxZQUFZLFNBQUMsa0JBQWtCLEVBQUU7b0JBQ2hDLFFBQVE7b0JBQ1IsMkJBQTJCO29CQUMzQiwyQkFBMkI7b0JBQzNCLE1BQU07aUJBQ1A7c0JBT0EsWUFBWSxTQUFDLGdCQUFnQixjQUM3QixZQUFZLFNBQUMsaUJBQWlCO3dCQUk5QixZQUFZLFNBQUMsV0FBVyxFQUFFLENBQUMsUUFBUSxFQUFFLGNBQWMsRUFBRSxjQUFjLENBQUMsY0FDcEUsWUFBWSxTQUFDLFlBQVksRUFBRTtvQkFDMUIsUUFBUTtvQkFDUiwyQkFBMkI7b0JBQzNCLDJCQUEyQjtvQkFDM0IsTUFBTTtpQkFDUDs7QUFpREgsTUFBTSxPQUFPLGlCQUFpQjs7O1lBSjdCLFFBQVEsU0FBQztnQkFDUixZQUFZLEVBQUUsQ0FBQyxvQkFBb0IsQ0FBQztnQkFDcEMsT0FBTyxFQUFFLENBQUMsb0JBQW9CLENBQUM7YUFDaEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBEaXJlY3RpdmUsXG4gIEVsZW1lbnRSZWYsXG4gIEhvc3RMaXN0ZW5lcixcbiAgTmdNb2R1bGUsXG4gIE9uRGVzdHJveSxcbiAgT25Jbml0LFxuICBPdXRwdXQsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBTdWJqZWN0LCBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IGRpc3RpbmN0VW50aWxDaGFuZ2VkIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5ARGlyZWN0aXZlKHsgc2VsZWN0b3I6ICdbbmd4LWNvbG9yLWNvb3JkaW5hdGVzXScgfSlcbmV4cG9ydCBjbGFzcyBDb29yZGluYXRlc0RpcmVjdGl2ZSBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95IHtcbiAgQE91dHB1dCgpXG4gIGNvb3JkaW5hdGVzQ2hhbmdlID0gbmV3IFN1YmplY3Q8e1xuICAgIHg6IG51bWJlcjtcbiAgICB5OiBudW1iZXI7XG4gICAgdG9wOiBudW1iZXI7XG4gICAgbGVmdDogbnVtYmVyO1xuICAgIGNvbnRhaW5lcldpZHRoOiBudW1iZXI7XG4gICAgY29udGFpbmVySGVpZ2h0OiBudW1iZXI7XG4gICAgJGV2ZW50OiBhbnk7XG4gIH0+KCk7XG4gIHByaXZhdGUgbW91c2VjaGFuZ2UgPSBuZXcgU3ViamVjdDx7XG4gICAgeDogbnVtYmVyO1xuICAgIHk6IG51bWJlcjtcbiAgICAkZXZlbnQ6IGFueTtcbiAgICBpc1RvdWNoOiBib29sZWFuO1xuICB9PigpO1xuXG4gIHByaXZhdGUgbW91c2VMaXN0ZW5pbmcgPSBmYWxzZTtcbiAgcHJpdmF0ZSBzdWIhOiBTdWJzY3JpcHRpb247XG4gIEBIb3N0TGlzdGVuZXIoJ3dpbmRvdzptb3VzZW1vdmUnLCBbJyRldmVudCcsICckZXZlbnQucGFnZVgnLCAnJGV2ZW50LnBhZ2VZJ10pXG4gIEBIb3N0TGlzdGVuZXIoJ3dpbmRvdzp0b3VjaG1vdmUnLCBbXG4gICAgJyRldmVudCcsXG4gICAgJyRldmVudC50b3VjaGVzWzBdLmNsaWVudFgnLFxuICAgICckZXZlbnQudG91Y2hlc1swXS5jbGllbnRZJyxcbiAgICAndHJ1ZScsXG4gIF0pXG4gIG1vdXNlbW92ZSgkZXZlbnQ6IEV2ZW50LCB4OiBudW1iZXIsIHk6IG51bWJlciwgaXNUb3VjaCA9IGZhbHNlKSB7XG4gICAgaWYgKHRoaXMubW91c2VMaXN0ZW5pbmcpIHtcbiAgICAgICRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgdGhpcy5tb3VzZWNoYW5nZS5uZXh0KHsgJGV2ZW50LCB4LCB5LCBpc1RvdWNoIH0pO1xuICAgIH1cbiAgfVxuICBASG9zdExpc3RlbmVyKCd3aW5kb3c6bW91c2V1cCcpXG4gIEBIb3N0TGlzdGVuZXIoJ3dpbmRvdzp0b3VjaGVuZCcpXG4gIG1vdXNldXAoKSB7XG4gICAgdGhpcy5tb3VzZUxpc3RlbmluZyA9IGZhbHNlO1xuICB9XG4gIEBIb3N0TGlzdGVuZXIoJ21vdXNlZG93bicsIFsnJGV2ZW50JywgJyRldmVudC5wYWdlWCcsICckZXZlbnQucGFnZVknXSlcbiAgQEhvc3RMaXN0ZW5lcigndG91Y2hzdGFydCcsIFtcbiAgICAnJGV2ZW50JyxcbiAgICAnJGV2ZW50LnRvdWNoZXNbMF0uY2xpZW50WCcsXG4gICAgJyRldmVudC50b3VjaGVzWzBdLmNsaWVudFknLFxuICAgICd0cnVlJyxcbiAgXSlcbiAgbW91c2Vkb3duKCRldmVudDogRXZlbnQsIHg6IG51bWJlciwgeTogbnVtYmVyLCBpc1RvdWNoID0gZmFsc2UpIHtcbiAgICAkZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB0aGlzLm1vdXNlTGlzdGVuaW5nID0gdHJ1ZTtcbiAgICB0aGlzLm1vdXNlY2hhbmdlLm5leHQoeyAkZXZlbnQsIHgsIHksIGlzVG91Y2ggfSk7XG4gIH1cblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGVsOiBFbGVtZW50UmVmKSB7fVxuXG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMuc3ViID0gdGhpcy5tb3VzZWNoYW5nZVxuICAgICAgLnBpcGUoXG4gICAgICAgIC8vIGxpbWl0IHRpbWVzIGl0IGlzIHVwZGF0ZWQgZm9yIHRoZSBzYW1lIGFyZWFcbiAgICAgICAgZGlzdGluY3RVbnRpbENoYW5nZWQoKHAsIHEpID0+IHAueCA9PT0gcS54ICYmIHAueSA9PT0gcS55KSxcbiAgICAgIClcbiAgICAgIC5zdWJzY3JpYmUobiA9PiB0aGlzLmhhbmRsZUNoYW5nZShuLngsIG4ueSwgbi4kZXZlbnQsIG4uaXNUb3VjaCkpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKSB7XG4gICAgdGhpcy5zdWIudW5zdWJzY3JpYmUoKTtcbiAgfVxuXG4gIGhhbmRsZUNoYW5nZSh4OiBudW1iZXIsIHk6IG51bWJlciwgJGV2ZW50OiBFdmVudCwgaXNUb3VjaDogYm9vbGVhbikge1xuICAgIGNvbnN0IGNvbnRhaW5lcldpZHRoID0gdGhpcy5lbC5uYXRpdmVFbGVtZW50LmNsaWVudFdpZHRoO1xuICAgIGNvbnN0IGNvbnRhaW5lckhlaWdodCA9IHRoaXMuZWwubmF0aXZlRWxlbWVudC5jbGllbnRIZWlnaHQ7XG4gICAgY29uc3QgbGVmdCA9XG4gICAgICB4IC1cbiAgICAgICh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkubGVmdCArIHdpbmRvdy5wYWdlWE9mZnNldCk7XG4gICAgbGV0IHRvcCA9IHkgLSB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wO1xuXG4gICAgaWYgKCFpc1RvdWNoKSB7XG4gICAgICB0b3AgPSB0b3AgLSB3aW5kb3cucGFnZVlPZmZzZXQ7XG4gICAgfVxuICAgIHRoaXMuY29vcmRpbmF0ZXNDaGFuZ2UubmV4dCh7XG4gICAgICB4LFxuICAgICAgeSxcbiAgICAgIHRvcCxcbiAgICAgIGxlZnQsXG4gICAgICBjb250YWluZXJXaWR0aCxcbiAgICAgIGNvbnRhaW5lckhlaWdodCxcbiAgICAgICRldmVudCxcbiAgICB9KTtcbiAgfVxufVxuXG5ATmdNb2R1bGUoe1xuICBkZWNsYXJhdGlvbnM6IFtDb29yZGluYXRlc0RpcmVjdGl2ZV0sXG4gIGV4cG9ydHM6IFtDb29yZGluYXRlc0RpcmVjdGl2ZV0sXG59KVxuZXhwb3J0IGNsYXNzIENvb3JkaW5hdGVzTW9kdWxlIHt9XG4iXX0=