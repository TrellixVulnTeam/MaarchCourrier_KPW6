import { EventEmitter, OnInit } from '@angular/core';
import { HSLA, RGBA } from 'ngx-color';
export declare class ChromeFieldsComponent implements OnInit {
    disableAlpha: boolean;
    hsl: HSLA;
    rgb: RGBA;
    hex: string;
    onChange: EventEmitter<any>;
    view: string;
    input: Record<string, string>;
    label: Record<string, string>;
    ngOnInit(): void;
    toggleViews(): void;
    round(value: any): number;
    handleChange({ data, $event }: {
        data: any;
        $event: any;
    }): void;
}
