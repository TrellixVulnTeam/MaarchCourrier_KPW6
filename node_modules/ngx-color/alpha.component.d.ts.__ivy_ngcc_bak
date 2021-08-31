import { EventEmitter, OnChanges } from '@angular/core';
import { HSLA, RGBA } from './helpers/color.interfaces';
export declare class AlphaComponent implements OnChanges {
    hsl: HSLA;
    rgb: RGBA;
    pointer: Record<string, string>;
    shadow: string;
    radius: number | string;
    direction: 'horizontal' | 'vertical';
    onChange: EventEmitter<any>;
    gradient: Record<string, string>;
    pointerLeft: number;
    pointerTop: number;
    ngOnChanges(): void;
    handleChange({ top, left, containerHeight, containerWidth, $event }: {
        top: any;
        left: any;
        containerHeight: any;
        containerWidth: any;
        $event: any;
    }): void;
}
export declare class AlphaModule {
}
