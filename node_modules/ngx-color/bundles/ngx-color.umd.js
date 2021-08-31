(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/common'), require('@angular/core'), require('rxjs'), require('rxjs/operators'), require('@ctrl/tinycolor')) :
    typeof define === 'function' && define.amd ? define('ngx-color', ['exports', '@angular/common', '@angular/core', 'rxjs', 'rxjs/operators', '@ctrl/tinycolor'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global['ngx-color'] = {}, global.ng.common, global.ng.core, global.rxjs, global.rxjs.operators, global['@ctrl/tinycolor']));
}(this, (function (exports, common, core, rxjs, operators, tinycolor) { 'use strict';

    var checkboardCache = {};
    function render(c1, c2, size) {
        if (typeof document === 'undefined') {
            return null;
        }
        var canvas = document.createElement('canvas');
        canvas.width = size * 2;
        canvas.height = size * 2;
        var ctx = canvas.getContext('2d');
        if (!ctx) {
            return null;
        } // If no context can be found, return early.
        ctx.fillStyle = c1;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = c2;
        ctx.fillRect(0, 0, size, size);
        ctx.translate(size, size);
        ctx.fillRect(0, 0, size, size);
        return canvas.toDataURL();
    }
    function getCheckerboard(c1, c2, size) {
        var key = c1 + "-" + c2 + "-" + size;
        if (checkboardCache[key]) {
            return checkboardCache[key];
        }
        var checkboard = render(c1, c2, size);
        if (!checkboard) {
            return null;
        }
        checkboardCache[key] = checkboard;
        return checkboard;
    }

    var CheckboardComponent = /** @class */ (function () {
        function CheckboardComponent() {
            this.white = 'transparent';
            this.size = 8;
            this.grey = 'rgba(0,0,0,.08)';
        }
        CheckboardComponent.prototype.ngOnInit = function () {
            var background = getCheckerboard(this.white, this.grey, this.size);
            this.gridStyles = {
                borderRadius: this.borderRadius,
                boxShadow: this.boxShadow,
                background: "url(" + background + ") center left",
            };
        };
        return CheckboardComponent;
    }());
    CheckboardComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'color-checkboard',
                    template: "<div class=\"grid\" [ngStyle]=\"gridStyles\"></div>",
                    preserveWhitespaces: false,
                    changeDetection: core.ChangeDetectionStrategy.OnPush,
                    styles: ["\n  .grid {\n    top: 0px;\n    right: 0px;\n    bottom: 0px;\n    left: 0px;\n    position: absolute;\n  }\n  "]
                },] }
    ];
    CheckboardComponent.propDecorators = {
        white: [{ type: core.Input }],
        size: [{ type: core.Input }],
        grey: [{ type: core.Input }],
        boxShadow: [{ type: core.Input }],
        borderRadius: [{ type: core.Input }]
    };
    var CheckboardModule = /** @class */ (function () {
        function CheckboardModule() {
        }
        return CheckboardModule;
    }());
    CheckboardModule.decorators = [
        { type: core.NgModule, args: [{
                    declarations: [CheckboardComponent],
                    exports: [CheckboardComponent],
                    imports: [common.CommonModule],
                },] }
    ];

    var CoordinatesDirective = /** @class */ (function () {
        function CoordinatesDirective(el) {
            this.el = el;
            this.coordinatesChange = new rxjs.Subject();
            this.mousechange = new rxjs.Subject();
            this.mouseListening = false;
        }
        CoordinatesDirective.prototype.mousemove = function ($event, x, y, isTouch) {
            if (isTouch === void 0) { isTouch = false; }
            if (this.mouseListening) {
                $event.preventDefault();
                this.mousechange.next({ $event: $event, x: x, y: y, isTouch: isTouch });
            }
        };
        CoordinatesDirective.prototype.mouseup = function () {
            this.mouseListening = false;
        };
        CoordinatesDirective.prototype.mousedown = function ($event, x, y, isTouch) {
            if (isTouch === void 0) { isTouch = false; }
            $event.preventDefault();
            this.mouseListening = true;
            this.mousechange.next({ $event: $event, x: x, y: y, isTouch: isTouch });
        };
        CoordinatesDirective.prototype.ngOnInit = function () {
            var _this = this;
            this.sub = this.mousechange
                .pipe(
            // limit times it is updated for the same area
            operators.distinctUntilChanged(function (p, q) { return p.x === q.x && p.y === q.y; }))
                .subscribe(function (n) { return _this.handleChange(n.x, n.y, n.$event, n.isTouch); });
        };
        CoordinatesDirective.prototype.ngOnDestroy = function () {
            this.sub.unsubscribe();
        };
        CoordinatesDirective.prototype.handleChange = function (x, y, $event, isTouch) {
            var containerWidth = this.el.nativeElement.clientWidth;
            var containerHeight = this.el.nativeElement.clientHeight;
            var left = x -
                (this.el.nativeElement.getBoundingClientRect().left + window.pageXOffset);
            var top = y - this.el.nativeElement.getBoundingClientRect().top;
            if (!isTouch) {
                top = top - window.pageYOffset;
            }
            this.coordinatesChange.next({
                x: x,
                y: y,
                top: top,
                left: left,
                containerWidth: containerWidth,
                containerHeight: containerHeight,
                $event: $event,
            });
        };
        return CoordinatesDirective;
    }());
    CoordinatesDirective.decorators = [
        { type: core.Directive, args: [{ selector: '[ngx-color-coordinates]' },] }
    ];
    CoordinatesDirective.ctorParameters = function () { return [
        { type: core.ElementRef }
    ]; };
    CoordinatesDirective.propDecorators = {
        coordinatesChange: [{ type: core.Output }],
        mousemove: [{ type: core.HostListener, args: ['window:mousemove', ['$event', '$event.pageX', '$event.pageY'],] }, { type: core.HostListener, args: ['window:touchmove', [
                        '$event',
                        '$event.touches[0].clientX',
                        '$event.touches[0].clientY',
                        'true',
                    ],] }],
        mouseup: [{ type: core.HostListener, args: ['window:mouseup',] }, { type: core.HostListener, args: ['window:touchend',] }],
        mousedown: [{ type: core.HostListener, args: ['mousedown', ['$event', '$event.pageX', '$event.pageY'],] }, { type: core.HostListener, args: ['touchstart', [
                        '$event',
                        '$event.touches[0].clientX',
                        '$event.touches[0].clientY',
                        'true',
                    ],] }]
    };
    var CoordinatesModule = /** @class */ (function () {
        function CoordinatesModule() {
        }
        return CoordinatesModule;
    }());
    CoordinatesModule.decorators = [
        { type: core.NgModule, args: [{
                    declarations: [CoordinatesDirective],
                    exports: [CoordinatesDirective],
                },] }
    ];

    var AlphaComponent = /** @class */ (function () {
        function AlphaComponent() {
            this.direction = 'horizontal';
            this.onChange = new core.EventEmitter();
        }
        AlphaComponent.prototype.ngOnChanges = function () {
            if (this.direction === 'vertical') {
                this.pointerLeft = 0;
                this.pointerTop = this.rgb.a * 100;
                this.gradient = {
                    background: "linear-gradient(to bottom, rgba(" + this.rgb.r + "," + this.rgb.g + "," + this.rgb.b + ", 0) 0%,\n          rgba(" + this.rgb.r + "," + this.rgb.g + "," + this.rgb.b + ", 1) 100%)",
                };
            }
            else {
                this.gradient = {
                    background: "linear-gradient(to right, rgba(" + this.rgb.r + "," + this.rgb.g + "," + this.rgb.b + ", 0) 0%,\n          rgba(" + this.rgb.r + "," + this.rgb.g + "," + this.rgb.b + ", 1) 100%)",
                };
                this.pointerLeft = this.rgb.a * 100;
            }
        };
        AlphaComponent.prototype.handleChange = function (_a) {
            var top = _a.top, left = _a.left, containerHeight = _a.containerHeight, containerWidth = _a.containerWidth, $event = _a.$event;
            var data;
            if (this.direction === 'vertical') {
                var a = void 0;
                if (top < 0) {
                    a = 0;
                }
                else if (top > containerHeight) {
                    a = 1;
                }
                else {
                    a = Math.round(top * 100 / containerHeight) / 100;
                }
                if (this.hsl.a !== a) {
                    data = {
                        h: this.hsl.h,
                        s: this.hsl.s,
                        l: this.hsl.l,
                        a: a,
                        source: 'rgb',
                    };
                }
            }
            else {
                var a = void 0;
                if (left < 0) {
                    a = 0;
                }
                else if (left > containerWidth) {
                    a = 1;
                }
                else {
                    a = Math.round(left * 100 / containerWidth) / 100;
                }
                if (this.hsl.a !== a) {
                    data = {
                        h: this.hsl.h,
                        s: this.hsl.s,
                        l: this.hsl.l,
                        a: a,
                        source: 'rgb',
                    };
                }
            }
            if (!data) {
                return;
            }
            this.onChange.emit({ data: data, $event: $event });
        };
        return AlphaComponent;
    }());
    AlphaComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'color-alpha',
                    template: "\n  <div class=\"alpha\" [style.border-radius]=\"radius\">\n    <div class=\"alpha-checkboard\">\n      <color-checkboard></color-checkboard>\n    </div>\n    <div class=\"alpha-gradient\" [ngStyle]=\"gradient\" [style.box-shadow]=\"shadow\" [style.border-radius]=\"radius\"></div>\n    <div ngx-color-coordinates (coordinatesChange)=\"handleChange($event)\" class=\"alpha-container color-alpha-{{direction}}\">\n      <div class=\"alpha-pointer\" [style.left.%]=\"pointerLeft\" [style.top.%]=\"pointerTop\">\n        <div class=\"alpha-slider\" [ngStyle]=\"pointer\"></div>\n      </div>\n    </div>\n  </div>\n  ",
                    changeDetection: core.ChangeDetectionStrategy.OnPush,
                    preserveWhitespaces: false,
                    styles: ["\n    .alpha {\n      position: absolute;\n      top: 0;\n      bottom: 0;\n      left: 0;\n      right: 0;\n    }\n    .alpha-checkboard {\n      position: absolute;\n      top: 0;\n      bottom: 0;\n      left: 0;\n      right: 0;\n      overflow: hidden;\n    }\n    .alpha-gradient {\n      position: absolute;\n      top: 0;\n      bottom: 0;\n      left: 0;\n      right: 0;\n    }\n    .alpha-container {\n      position: relative;\n      height: 100%;\n      margin: 0 3px;\n    }\n    .alpha-pointer {\n      position: absolute;\n    }\n    .alpha-slider {\n      width: 4px;\n      border-radius: 1px;\n      height: 8px;\n      box-shadow: 0 0 2px rgba(0, 0, 0, .6);\n      background: #fff;\n      margin-top: 1px;\n      transform: translateX(-2px);\n    },\n  "]
                },] }
    ];
    AlphaComponent.propDecorators = {
        hsl: [{ type: core.Input }],
        rgb: [{ type: core.Input }],
        pointer: [{ type: core.Input }],
        shadow: [{ type: core.Input }],
        radius: [{ type: core.Input }],
        direction: [{ type: core.Input }],
        onChange: [{ type: core.Output }]
    };
    var AlphaModule = /** @class */ (function () {
        function AlphaModule() {
        }
        return AlphaModule;
    }());
    AlphaModule.decorators = [
        { type: core.NgModule, args: [{
                    declarations: [AlphaComponent],
                    exports: [AlphaComponent],
                    imports: [common.CommonModule, CheckboardModule, CoordinatesModule],
                },] }
    ];

    function simpleCheckForValidColor(data) {
        var keysToCheck = ['r', 'g', 'b', 'a', 'h', 's', 'l', 'v'];
        var checked = 0;
        var passed = 0;
        keysToCheck.forEach(function (letter) {
            if (!data[letter]) {
                return;
            }
            checked += 1;
            if (!isNaN(data[letter])) {
                passed += 1;
            }
            if (letter === 's' || letter === 'l') {
                var percentPatt = /^\d+%$/;
                if (percentPatt.test(data[letter])) {
                    passed += 1;
                }
            }
        });
        return checked === passed ? data : false;
    }
    function toState(data, oldHue, disableAlpha) {
        var color = data.hex ? new tinycolor.TinyColor(data.hex) : new tinycolor.TinyColor(data);
        if (disableAlpha) {
            color.setAlpha(1);
        }
        var hsl = color.toHsl();
        var hsv = color.toHsv();
        var rgb = color.toRgb();
        var hex = color.toHex();
        if (hsl.s === 0) {
            hsl.h = oldHue || 0;
            hsv.h = oldHue || 0;
        }
        var transparent = hex === '000000' && rgb.a === 0;
        return {
            hsl: hsl,
            hex: transparent ? 'transparent' : color.toHexString(),
            rgb: rgb,
            hsv: hsv,
            oldHue: data.h || oldHue || hsl.h,
            source: data.source,
        };
    }
    function isValidHex(hex) {
        return new tinycolor.TinyColor(hex).isValid;
    }
    function getContrastingColor(data) {
        if (!data) {
            return '#fff';
        }
        var col = toState(data);
        if (col.hex === 'transparent') {
            return 'rgba(0,0,0,0.4)';
        }
        var yiq = (col.rgb.r * 299 + col.rgb.g * 587 + col.rgb.b * 114) / 1000;
        return yiq >= 128 ? '#000' : '#fff';
    }

    var ColorWrap = /** @class */ (function () {
        function ColorWrap() {
            this.color = {
                h: 250,
                s: 0.5,
                l: 0.2,
                a: 1,
            };
            this.onChange = new core.EventEmitter();
            this.onChangeComplete = new core.EventEmitter();
            this.onSwatchHover = new core.EventEmitter();
        }
        ColorWrap.prototype.ngOnInit = function () {
            var _this = this;
            this.changes = this.onChange
                .pipe(operators.debounceTime(100))
                .subscribe(function (x) { return _this.onChangeComplete.emit(x); });
            this.setState(toState(this.color, 0));
            this.currentColor = this.hex;
        };
        ColorWrap.prototype.ngOnChanges = function () {
            this.setState(toState(this.color, this.oldHue));
        };
        ColorWrap.prototype.ngOnDestroy = function () {
            this.changes.unsubscribe();
        };
        ColorWrap.prototype.setState = function (data) {
            this.oldHue = data.oldHue;
            this.hsl = data.hsl;
            this.hsv = data.hsv;
            this.rgb = data.rgb;
            this.hex = data.hex;
            this.source = data.source;
            this.afterValidChange();
        };
        ColorWrap.prototype.handleChange = function (data, $event) {
            var isValidColor = simpleCheckForValidColor(data);
            if (isValidColor) {
                var color = toState(data, data.h || this.oldHue, this.disableAlpha);
                this.setState(color);
                this.onChange.emit({ color: color, $event: $event });
                this.afterValidChange();
            }
        };
        /** hook for components after a complete change */
        ColorWrap.prototype.afterValidChange = function () { };
        ColorWrap.prototype.handleSwatchHover = function (data, $event) {
            var isValidColor = simpleCheckForValidColor(data);
            if (isValidColor) {
                var color = toState(data, data.h || this.oldHue);
                this.setState(color);
                this.onSwatchHover.emit({ color: color, $event: $event });
            }
        };
        return ColorWrap;
    }());
    ColorWrap.decorators = [
        { type: core.Component, args: [{
                    // create seletor base for test override property
                    selector: 'color-wrap',
                    template: ""
                },] }
    ];
    ColorWrap.propDecorators = {
        className: [{ type: core.Input }],
        color: [{ type: core.Input }],
        onChange: [{ type: core.Output }],
        onChangeComplete: [{ type: core.Output }],
        onSwatchHover: [{ type: core.Output }]
    };
    var ColorWrapModule = /** @class */ (function () {
        function ColorWrapModule() {
        }
        return ColorWrapModule;
    }());
    ColorWrapModule.decorators = [
        { type: core.NgModule, args: [{
                    declarations: [ColorWrap],
                    exports: [ColorWrap],
                    imports: [common.CommonModule],
                },] }
    ];

    var EditableInputComponent = /** @class */ (function () {
        function EditableInputComponent() {
            this.placeholder = '';
            this.onChange = new core.EventEmitter();
            this.focus = false;
        }
        EditableInputComponent.prototype.ngOnInit = function () {
            this.wrapStyle = this.style && this.style.wrap ? this.style.wrap : {};
            this.inputStyle = this.style && this.style.input ? this.style.input : {};
            this.labelStyle = this.style && this.style.label ? this.style.label : {};
            if (this.dragLabel) {
                this.labelStyle.cursor = 'ew-resize';
            }
        };
        EditableInputComponent.prototype.handleFocus = function ($event) {
            this.focus = true;
        };
        EditableInputComponent.prototype.handleFocusOut = function ($event) {
            this.focus = false;
            this.currentValue = this.blurValue;
        };
        EditableInputComponent.prototype.handleKeydown = function ($event) {
            var _a, _b;
            // In case `e.target.value` is a percentage remove the `%` character
            // and update accordingly with a percentage
            // https://github.com/casesandberg/react-color/issues/383
            var stringValue = String($event.target.value);
            var isPercentage = stringValue.indexOf('%') > -1;
            var num = Number(stringValue.replace(/%/g, ''));
            if (isNaN(num)) {
                return;
            }
            var amount = this.arrowOffset || 1;
            // Up
            if ($event.keyCode === 38) {
                if (this.label) {
                    this.onChange.emit({
                        data: (_a = {}, _a[this.label] = num + amount, _a),
                        $event: $event,
                    });
                }
                else {
                    this.onChange.emit({ data: num + amount, $event: $event });
                }
                if (isPercentage) {
                    this.currentValue = num + amount + "%";
                }
                else {
                    this.currentValue = num + amount;
                }
            }
            // Down
            if ($event.keyCode === 40) {
                if (this.label) {
                    this.onChange.emit({
                        data: (_b = {}, _b[this.label] = num - amount, _b),
                        $event: $event,
                    });
                }
                else {
                    this.onChange.emit({ data: num - amount, $event: $event });
                }
                if (isPercentage) {
                    this.currentValue = num - amount + "%";
                }
                else {
                    this.currentValue = num - amount;
                }
            }
        };
        EditableInputComponent.prototype.handleKeyup = function ($event) {
            var _a;
            if ($event.keyCode === 40 || $event.keyCode === 38) {
                return;
            }
            if ("" + this.currentValue === $event.target.value) {
                return;
            }
            if (this.label) {
                this.onChange.emit({
                    data: (_a = {}, _a[this.label] = $event.target.value, _a),
                    $event: $event,
                });
            }
            else {
                this.onChange.emit({ data: $event.target.value, $event: $event });
            }
        };
        EditableInputComponent.prototype.ngOnChanges = function () {
            if (!this.focus) {
                this.currentValue = String(this.value).toUpperCase();
                this.blurValue = String(this.value).toUpperCase();
            }
            else {
                this.blurValue = String(this.value).toUpperCase();
            }
        };
        EditableInputComponent.prototype.ngOnDestroy = function () {
            this.unsubscribe();
        };
        EditableInputComponent.prototype.subscribe = function () {
            var _this = this;
            this.mousemove = rxjs.fromEvent(document, 'mousemove').subscribe(function (ev) { return _this.handleDrag(ev); });
            this.mouseup = rxjs.fromEvent(document, 'mouseup').subscribe(function () { return _this.unsubscribe(); });
        };
        EditableInputComponent.prototype.unsubscribe = function () {
            if (this.mousemove) {
                this.mousemove.unsubscribe();
            }
            if (this.mouseup) {
                this.mouseup.unsubscribe();
            }
        };
        EditableInputComponent.prototype.handleMousedown = function ($event) {
            if (this.dragLabel) {
                $event.preventDefault();
                this.handleDrag($event);
                this.subscribe();
            }
        };
        EditableInputComponent.prototype.handleDrag = function ($event) {
            var _a;
            if (this.dragLabel) {
                var newValue = Math.round(this.value + $event.movementX);
                if (newValue >= 0 && newValue <= this.dragMax) {
                    this.onChange.emit({ data: (_a = {}, _a[this.label] = newValue, _a), $event: $event });
                }
            }
        };
        return EditableInputComponent;
    }());
    EditableInputComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'color-editable-input',
                    template: "\n    <div class=\"wrap\" [ngStyle]=\"wrapStyle\">\n      <input\n        [ngStyle]=\"inputStyle\"\n        spellCheck=\"false\"\n        [value]=\"currentValue\"\n        [placeholder]=\"placeholder\"\n        (keydown)=\"handleKeydown($event)\"\n        (keyup)=\"handleKeyup($event)\"\n        (focus)=\"handleFocus($event)\"\n        (focusout)=\"handleFocusOut($event)\"\n      />\n      <span *ngIf=\"label\" [ngStyle]=\"labelStyle\" (mousedown)=\"handleMousedown($event)\">\n        {{ label }}\n      </span>\n    </div>\n  ",
                    changeDetection: core.ChangeDetectionStrategy.OnPush,
                    styles: ["\n      :host {\n        display: flex;\n      }\n      .wrap {\n        position: relative;\n      }\n    "]
                },] }
    ];
    EditableInputComponent.propDecorators = {
        style: [{ type: core.Input }],
        label: [{ type: core.Input }],
        value: [{ type: core.Input }],
        arrowOffset: [{ type: core.Input }],
        dragLabel: [{ type: core.Input }],
        dragMax: [{ type: core.Input }],
        placeholder: [{ type: core.Input }],
        onChange: [{ type: core.Output }]
    };
    var EditableInputModule = /** @class */ (function () {
        function EditableInputModule() {
        }
        return EditableInputModule;
    }());
    EditableInputModule.decorators = [
        { type: core.NgModule, args: [{
                    declarations: [EditableInputComponent],
                    exports: [EditableInputComponent],
                    imports: [common.CommonModule],
                },] }
    ];

    var HueComponent = /** @class */ (function () {
        function HueComponent() {
            this.hidePointer = false;
            this.direction = 'horizontal';
            this.onChange = new core.EventEmitter();
            this.left = '0px';
            this.top = '';
        }
        HueComponent.prototype.ngOnChanges = function () {
            if (this.direction === 'horizontal') {
                this.left = this.hsl.h * 100 / 360 + "%";
            }
            else {
                this.top = -(this.hsl.h * 100 / 360) + 100 + "%";
            }
        };
        HueComponent.prototype.handleChange = function (_a) {
            var top = _a.top, left = _a.left, containerHeight = _a.containerHeight, containerWidth = _a.containerWidth, $event = _a.$event;
            var data;
            if (this.direction === 'vertical') {
                var h = void 0;
                if (top < 0) {
                    h = 359;
                }
                else if (top > containerHeight) {
                    h = 0;
                }
                else {
                    var percent = -(top * 100 / containerHeight) + 100;
                    h = 360 * percent / 100;
                }
                if (this.hsl.h !== h) {
                    data = {
                        h: h,
                        s: this.hsl.s,
                        l: this.hsl.l,
                        a: this.hsl.a,
                        source: 'rgb',
                    };
                }
            }
            else {
                var h = void 0;
                if (left < 0) {
                    h = 0;
                }
                else if (left > containerWidth) {
                    h = 359;
                }
                else {
                    var percent = left * 100 / containerWidth;
                    h = 360 * percent / 100;
                }
                if (this.hsl.h !== h) {
                    data = {
                        h: h,
                        s: this.hsl.s,
                        l: this.hsl.l,
                        a: this.hsl.a,
                        source: 'rgb',
                    };
                }
            }
            if (!data) {
                return;
            }
            this.onChange.emit({ data: data, $event: $event });
        };
        return HueComponent;
    }());
    HueComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'color-hue',
                    template: "\n  <div class=\"color-hue color-hue-{{direction}}\" [style.border-radius.px]=\"radius\" [style.box-shadow]=\"shadow\">\n    <div ngx-color-coordinates (coordinatesChange)=\"handleChange($event)\" class=\"color-hue-container\">\n      <div class=\"color-hue-pointer\" [style.left]=\"left\" [style.top]=\"top\" *ngIf=\"!hidePointer\">\n        <div class=\"color-hue-slider\" [ngStyle]=\"pointer\"></div>\n      </div>\n    </div>\n  </div>\n  ",
                    preserveWhitespaces: false,
                    changeDetection: core.ChangeDetectionStrategy.OnPush,
                    styles: ["\n    .color-hue {\n      position: absolute;\n      top: 0;\n      bottom: 0;\n      left: 0;\n      right: 0;\n    }\n    .color-hue-container {\n      margin: 0 2px;\n      position: relative;\n      height: 100%;\n    }\n    .color-hue-pointer {\n      position: absolute;\n    }\n    .color-hue-slider {\n      margin-top: 1px;\n      width: 4px;\n      border-radius: 1px;\n      height: 8px;\n      box-shadow: 0 0 2px rgba(0, 0, 0, .6);\n      background: #fff;\n      transform: translateX(-2px);\n    }\n    .color-hue-horizontal {\n      background: linear-gradient(to right, #f00 0%, #ff0 17%, #0f0\n        33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%);\n    }\n    .color-hue-vertical {\n      background: linear-gradient(to top, #f00 0%, #ff0 17%, #0f0 33%,\n        #0ff 50%, #00f 67%, #f0f 83%, #f00 100%);\n    }\n  "]
                },] }
    ];
    HueComponent.propDecorators = {
        hsl: [{ type: core.Input }],
        pointer: [{ type: core.Input }],
        radius: [{ type: core.Input }],
        shadow: [{ type: core.Input }],
        hidePointer: [{ type: core.Input }],
        direction: [{ type: core.Input }],
        onChange: [{ type: core.Output }]
    };
    var HueModule = /** @class */ (function () {
        function HueModule() {
        }
        return HueModule;
    }());
    HueModule.decorators = [
        { type: core.NgModule, args: [{
                    declarations: [HueComponent],
                    exports: [HueComponent],
                    imports: [common.CommonModule, CoordinatesModule],
                },] }
    ];

    var RaisedComponent = /** @class */ (function () {
        function RaisedComponent() {
            this.zDepth = 1;
            this.radius = 1;
            this.background = '#fff';
        }
        return RaisedComponent;
    }());
    RaisedComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'color-raised',
                    template: "\n  <div class=\"raised-wrap\">\n    <div class=\"raised-bg zDepth-{{zDepth}}\" [style.background]=\"background\"></div>\n    <div class=\"raised-content\">\n      <ng-content></ng-content>\n    </div>\n  </div>\n  ",
                    preserveWhitespaces: false,
                    changeDetection: core.ChangeDetectionStrategy.OnPush,
                    styles: ["\n    .raised-wrap {\n      position: relative;\n      display: inline-block;\n    }\n    .raised-bg {\n      position: absolute;\n      top: 0px;\n      right: 0px;\n      bottom: 0px;\n      left: 0px;\n    }\n    .raised-content {\n      position: relative;\n    }\n    .zDepth-0 {\n      box-shadow: none;\n    }\n    .zDepth-1 {\n      box-shadow: 0 2px 10px rgba(0,0,0,.12), 0 2px 5px rgba(0,0,0,.16);\n    }\n    .zDepth-2 {\n      box-shadow: 0 6px 20px rgba(0,0,0,.19), 0 8px 17px rgba(0,0,0,.2);\n    }\n    .zDepth-3 {\n      box-shadow: 0 17px 50px rgba(0,0,0,.19), 0 12px 15px rgba(0,0,0,.24);\n    }\n    .zDepth-4 {\n      box-shadow: 0 25px 55px rgba(0,0,0,.21), 0 16px 28px rgba(0,0,0,.22);\n    }\n    .zDepth-5 {\n      box-shadow: 0 40px 77px rgba(0,0,0,.22), 0 27px 24px rgba(0,0,0,.2);\n    }\n  "]
                },] }
    ];
    RaisedComponent.propDecorators = {
        zDepth: [{ type: core.Input }],
        radius: [{ type: core.Input }],
        background: [{ type: core.Input }]
    };
    var RaisedModule = /** @class */ (function () {
        function RaisedModule() {
        }
        return RaisedModule;
    }());
    RaisedModule.decorators = [
        { type: core.NgModule, args: [{
                    declarations: [RaisedComponent],
                    exports: [RaisedComponent],
                    imports: [common.CommonModule],
                },] }
    ];

    var SaturationComponent = /** @class */ (function () {
        function SaturationComponent() {
            this.onChange = new core.EventEmitter();
        }
        SaturationComponent.prototype.ngOnChanges = function () {
            this.background = "hsl(" + this.hsl.h + ", 100%, 50%)";
            this.pointerTop = -(this.hsv.v * 100) + 1 + 100 + '%';
            this.pointerLeft = this.hsv.s * 100 + '%';
        };
        SaturationComponent.prototype.handleChange = function (_a) {
            var top = _a.top, left = _a.left, containerHeight = _a.containerHeight, containerWidth = _a.containerWidth, $event = _a.$event;
            if (left < 0) {
                left = 0;
            }
            else if (left > containerWidth) {
                left = containerWidth;
            }
            else if (top < 0) {
                top = 0;
            }
            else if (top > containerHeight) {
                top = containerHeight;
            }
            var saturation = left / containerWidth;
            var bright = -(top / containerHeight) + 1;
            bright = bright > 0 ? bright : 0;
            bright = bright > 1 ? 1 : bright;
            var data = {
                h: this.hsl.h,
                s: saturation,
                v: bright,
                a: this.hsl.a,
                source: 'hsva',
            };
            this.onChange.emit({ data: data, $event: $event });
        };
        return SaturationComponent;
    }());
    SaturationComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'color-saturation',
                    template: "\n  <div class=\"color-saturation\" ngx-color-coordinates (coordinatesChange)=\"handleChange($event)\" [style.background]=\"background\">\n    <div class=\"saturation-white\">\n      <div class=\"saturation-black\"></div>\n      <div class=\"saturation-pointer\" [ngStyle]=\"pointer\" [style.top]=\"pointerTop\" [style.left]=\"pointerLeft\">\n        <div class=\"saturation-circle\" [ngStyle]=\"circle\"></div>\n      </div>\n    </div>\n  </div>\n  ",
                    preserveWhitespaces: false,
                    changeDetection: core.ChangeDetectionStrategy.OnPush,
                    styles: ["\n    .saturation-white {\n      background: linear-gradient(to right, #fff, rgba(255,255,255,0));\n      position: absolute;\n      top: 0;\n      bottom: 0;\n      left: 0;\n      right: 0;\n    }\n    .saturation-black {\n      background: linear-gradient(to top, #000, rgba(0,0,0,0));\n      position: absolute;\n      top: 0;\n      bottom: 0;\n      left: 0;\n      right: 0;\n    }\n    .color-saturation {\n      position: absolute;\n      top: 0;\n      bottom: 0;\n      left: 0;\n      right: 0;\n    }\n    .saturation-pointer {\n      position: absolute;\n      cursor: default;\n    }\n    .saturation-circle {\n      width: 4px;\n      height: 4px;\n      box-shadow: 0 0 0 1.5px #fff, inset 0 0 1px 1px rgba(0,0,0,.3), 0 0 1px 2px rgba(0,0,0,.4);\n      border-radius: 50%;\n      cursor: hand;\n      transform: translate(-2px, -4px);\n    }\n  "]
                },] }
    ];
    SaturationComponent.propDecorators = {
        hsl: [{ type: core.Input }],
        hsv: [{ type: core.Input }],
        radius: [{ type: core.Input }],
        pointer: [{ type: core.Input }],
        circle: [{ type: core.Input }],
        onChange: [{ type: core.Output }]
    };
    var SaturationModule = /** @class */ (function () {
        function SaturationModule() {
        }
        return SaturationModule;
    }());
    SaturationModule.decorators = [
        { type: core.NgModule, args: [{
                    declarations: [SaturationComponent],
                    exports: [SaturationComponent],
                    imports: [common.CommonModule, CoordinatesModule],
                },] }
    ];

    var SwatchComponent = /** @class */ (function () {
        function SwatchComponent() {
            this.style = {};
            this.focusStyle = {};
            this.onClick = new core.EventEmitter();
            this.onHover = new core.EventEmitter();
            this.divStyles = {};
            this.focusStyles = {};
            this.inFocus = false;
        }
        SwatchComponent.prototype.ngOnInit = function () {
            this.divStyles = Object.assign({ background: this.color }, this.style);
        };
        SwatchComponent.prototype.currentStyles = function () {
            this.focusStyles = Object.assign(Object.assign({}, this.divStyles), this.focusStyle);
            return this.focus || this.inFocus ? this.focusStyles : this.divStyles;
        };
        SwatchComponent.prototype.handleFocusOut = function () {
            this.inFocus = false;
        };
        SwatchComponent.prototype.handleFocus = function () {
            this.inFocus = true;
        };
        SwatchComponent.prototype.handleHover = function (hex, $event) {
            this.onHover.emit({ hex: hex, $event: $event });
        };
        SwatchComponent.prototype.handleClick = function (hex, $event) {
            this.onClick.emit({ hex: hex, $event: $event });
        };
        return SwatchComponent;
    }());
    SwatchComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'color-swatch',
                    template: "\n    <div\n      class=\"swatch\"\n      [ngStyle]=\"currentStyles()\"\n      [attr.title]=\"color\"\n      (click)=\"handleClick(color, $event)\"\n      (keydown.enter)=\"handleClick(color, $event)\"\n      (focus)=\"handleFocus()\"\n      (blur)=\"handleFocusOut()\"\n      (mouseover)=\"handleHover(color, $event)\"\n      tabindex=\"0\"\n    >\n      <ng-content></ng-content>\n      <color-checkboard\n        *ngIf=\"color === 'transparent'\"\n        boxShadow=\"inset 0 0 0 1px rgba(0,0,0,0.1)\"\n      ></color-checkboard>\n    </div>\n  ",
                    changeDetection: core.ChangeDetectionStrategy.OnPush,
                    styles: ["\n      .swatch {\n        outline: none;\n        height: 100%;\n        width: 100%;\n        cursor: pointer;\n        position: relative;\n      }\n    "]
                },] }
    ];
    SwatchComponent.propDecorators = {
        color: [{ type: core.Input }],
        style: [{ type: core.Input }],
        focusStyle: [{ type: core.Input }],
        focus: [{ type: core.Input }],
        onClick: [{ type: core.Output }],
        onHover: [{ type: core.Output }]
    };
    var SwatchModule = /** @class */ (function () {
        function SwatchModule() {
        }
        return SwatchModule;
    }());
    SwatchModule.decorators = [
        { type: core.NgModule, args: [{
                    declarations: [SwatchComponent],
                    exports: [SwatchComponent],
                    imports: [common.CommonModule, CheckboardModule],
                },] }
    ];

    var ShadeComponent = /** @class */ (function () {
        function ShadeComponent() {
            this.onChange = new core.EventEmitter();
        }
        ShadeComponent.prototype.ngOnChanges = function () {
            this.gradient = {
                background: "linear-gradient(to right,\n          hsl(" + this.hsl.h + ", 90%, 55%),\n          #000)",
            };
            var hsv = new tinycolor.TinyColor(this.hsl).toHsv();
            this.pointerLeft = 100 - (hsv.v * 100);
        };
        ShadeComponent.prototype.handleChange = function (_a) {
            var left = _a.left, containerWidth = _a.containerWidth, $event = _a.$event;
            var data;
            var v;
            if (left < 0) {
                v = 0;
            }
            else if (left > containerWidth) {
                v = 1;
            }
            else {
                v = Math.round((left * 100) / containerWidth) / 100;
            }
            var hsv = new tinycolor.TinyColor(this.hsl).toHsv();
            if (hsv.v !== v) {
                data = {
                    h: this.hsl.h,
                    s: 100,
                    v: 1 - v,
                    l: this.hsl.l,
                    a: this.hsl.a,
                    source: 'rgb',
                };
            }
            if (!data) {
                return;
            }
            this.onChange.emit({ data: data, $event: $event });
        };
        return ShadeComponent;
    }());
    ShadeComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'color-shade',
                    template: "\n    <div class=\"shade\" [style.border-radius]=\"radius\">\n      <div\n        class=\"shade-gradient\"\n        [ngStyle]=\"gradient\"\n        [style.box-shadow]=\"shadow\"\n        [style.border-radius]=\"radius\"\n      ></div>\n      <div\n        ngx-color-coordinates\n        (coordinatesChange)=\"handleChange($event)\"\n        class=\"shade-container\"\n      >\n        <div\n          class=\"shade-pointer\"\n          [style.left.%]=\"pointerLeft\"\n          [style.top.%]=\"pointerTop\"\n        >\n          <div class=\"shade-slider\" [ngStyle]=\"pointer\"></div>\n        </div>\n      </div>\n    </div>\n  ",
                    changeDetection: core.ChangeDetectionStrategy.OnPush,
                    preserveWhitespaces: false,
                    styles: ["\n    .shade {\n      position: absolute;\n      top: 0;\n      bottom: 0;\n      left: 0;\n      right: 0;\n    }\n    .shade-gradient {\n      position: absolute;\n      top: 0;\n      bottom: 0;\n      left: 0;\n      right: 0;\n    }\n    .shade-container {\n      position: relative;\n      height: 100%;\n      margin: 0 3px;\n    }\n    .shade-pointer {\n      position: absolute;\n    }\n    .shade-slider {\n      width: 4px;\n      border-radius: 1px;\n      height: 8px;\n      box-shadow: 0 0 2px rgba(0, 0, 0, .6);\n      background: #fff;\n      margin-top: 1px;\n      transform: translateX(-2px);\n    },\n  "]
                },] }
    ];
    ShadeComponent.propDecorators = {
        hsl: [{ type: core.Input }],
        rgb: [{ type: core.Input }],
        pointer: [{ type: core.Input }],
        shadow: [{ type: core.Input }],
        radius: [{ type: core.Input }],
        onChange: [{ type: core.Output }]
    };
    var ShadeModule = /** @class */ (function () {
        function ShadeModule() {
        }
        return ShadeModule;
    }());
    ShadeModule.decorators = [
        { type: core.NgModule, args: [{
                    declarations: [ShadeComponent],
                    exports: [ShadeComponent],
                    imports: [common.CommonModule, CoordinatesModule],
                },] }
    ];

    /**
     * Generated bundle index. Do not edit.
     */

    exports.AlphaComponent = AlphaComponent;
    exports.AlphaModule = AlphaModule;
    exports.CheckboardComponent = CheckboardComponent;
    exports.CheckboardModule = CheckboardModule;
    exports.ColorWrap = ColorWrap;
    exports.ColorWrapModule = ColorWrapModule;
    exports.CoordinatesDirective = CoordinatesDirective;
    exports.CoordinatesModule = CoordinatesModule;
    exports.EditableInputComponent = EditableInputComponent;
    exports.EditableInputModule = EditableInputModule;
    exports.HueComponent = HueComponent;
    exports.HueModule = HueModule;
    exports.RaisedComponent = RaisedComponent;
    exports.RaisedModule = RaisedModule;
    exports.SaturationComponent = SaturationComponent;
    exports.SaturationModule = SaturationModule;
    exports.ShadeComponent = ShadeComponent;
    exports.ShadeModule = ShadeModule;
    exports.SwatchComponent = SwatchComponent;
    exports.SwatchModule = SwatchModule;
    exports.getCheckerboard = getCheckerboard;
    exports.getContrastingColor = getContrastingColor;
    exports.isValidHex = isValidHex;
    exports.render = render;
    exports.simpleCheckForValidColor = simpleCheckForValidColor;
    exports.toState = toState;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=ngx-color.umd.js.map
