import { EventEmitter } from '@angular/core';
import { HSV, RGB } from 'ngx-color';
export declare class PhotoshopFieldsComponent {
    rgb: RGB;
    hsv: HSV;
    hex: string;
    onChange: EventEmitter<any>;
    RGBinput: Record<string, string>;
    RGBwrap: Record<string, string>;
    RGBlabel: Record<string, string>;
    HEXinput: Record<string, string>;
    HEXwrap: Record<string, string>;
    HEXlabel: Record<string, string>;
    round(v: any): number;
    handleValueChange({ data, $event }: {
        data: any;
        $event: any;
    }): void;
}
