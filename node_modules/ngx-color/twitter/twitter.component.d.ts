import { ColorWrap } from 'ngx-color';
export declare class TwitterComponent extends ColorWrap {
    /** Pixel value for picker width */
    width: string | number;
    /** Color squares to display */
    colors: string[];
    triangle: 'hide' | 'top-left' | 'top-right' | 'bottom-right';
    swatchStyle: {
        [key: string]: string;
    };
    input: {
        [key: string]: string;
    };
    disableAlpha: boolean;
    constructor();
    focus(color: string): {
        boxShadow: string;
    };
    handleBlockChange({ hex, $event }: any): void;
    handleValueChange({ data, $event }: any): void;
}
export declare class ColorTwitterModule {
}
