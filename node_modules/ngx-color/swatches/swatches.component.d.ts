import { ColorWrap, zDepth } from 'ngx-color';
export declare class SwatchesComponent extends ColorWrap {
    /** Pixel value for picker width */
    width: string | number;
    /** Color squares to display */
    height: string | number;
    /** An array of color groups, each with an array of colors */
    colors: string[][];
    zDepth: zDepth;
    radius: number;
    background: string;
    constructor();
    handlePickerChange({ data, $event }: {
        data: any;
        $event: any;
    }): void;
}
export declare class ColorSwatchesModule {
}
