import { ColorWrap, zDepth } from 'ngx-color';
export declare class CompactComponent extends ColorWrap {
    /** Color squares to display */
    colors: string[];
    zDepth: zDepth;
    radius: number;
    background: string;
    disableAlpha: boolean;
    constructor();
    handleBlockChange({ hex, $event }: {
        hex: any;
        $event: any;
    }): void;
    handleValueChange({ data, $event }: {
        data: any;
        $event: any;
    }): void;
}
export declare class ColorCompactModule {
}
