import { ColorWrap, zDepth } from 'ngx-color';
export declare class MaterialComponent extends ColorWrap {
    HEXinput: {
        [key: string]: string;
    };
    HEXlabel: {
        [key: string]: string;
    };
    RGBinput: {
        [key: string]: string;
    };
    RGBlabel: {
        [key: string]: string;
    };
    zDepth: zDepth;
    radius: number;
    background: string;
    disableAlpha: boolean;
    constructor();
    handleValueChange({ data, $event }: {
        data: any;
        $event: any;
    }): void;
    handleInputChange({ data, $event }: {
        data: any;
        $event: any;
    }): void;
    afterValidChange(): void;
}
export declare class ColorMaterialModule {
}
