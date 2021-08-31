import { EventEmitter, OnChanges } from '@angular/core';
export declare class CircleSwatchComponent implements OnChanges {
    color: string;
    circleSize: number;
    circleSpacing: number;
    focus: boolean;
    onClick: EventEmitter<any>;
    onSwatchHover: EventEmitter<any>;
    focusStyle: Record<string, string>;
    swatchStyle: Record<string, string>;
    ngOnChanges(): void;
    handleClick({ hex, $event }: {
        hex: any;
        $event: any;
    }): void;
}
