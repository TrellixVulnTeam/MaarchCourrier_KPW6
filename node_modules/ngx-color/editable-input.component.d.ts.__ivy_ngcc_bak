import { EventEmitter, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
export declare class EditableInputComponent implements OnInit, OnChanges, OnDestroy {
    style: {
        wrap?: Record<string, any>;
        input?: Record<string, any>;
        label?: Record<string, any>;
    };
    label: string;
    value: string | number;
    arrowOffset: number;
    dragLabel: boolean;
    dragMax: number;
    placeholder: string;
    onChange: EventEmitter<any>;
    currentValue: string | number;
    blurValue: string;
    wrapStyle: Record<string, string>;
    inputStyle: Record<string, string>;
    labelStyle: Record<string, string>;
    focus: boolean;
    mousemove: Subscription;
    mouseup: Subscription;
    ngOnInit(): void;
    handleFocus($event: any): void;
    handleFocusOut($event: any): void;
    handleKeydown($event: any): void;
    handleKeyup($event: any): void;
    ngOnChanges(): void;
    ngOnDestroy(): void;
    subscribe(): void;
    unsubscribe(): void;
    handleMousedown($event: Event): void;
    handleDrag($event: any): void;
}
export declare class EditableInputModule {
}
