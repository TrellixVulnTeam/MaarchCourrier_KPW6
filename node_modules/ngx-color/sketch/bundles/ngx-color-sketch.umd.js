(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/common'), require('@angular/core'), require('ngx-color'), require('@ctrl/tinycolor')) :
    typeof define === 'function' && define.amd ? define('ngx-color/sketch', ['exports', '@angular/common', '@angular/core', 'ngx-color', '@ctrl/tinycolor'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory((global['ngx-color'] = global['ngx-color'] || {}, global['ngx-color'].sketch = {}), global.ng.common, global.ng.core, global['ngx-color'], global['@ctrl/tinycolor']));
}(this, (function (exports, common, core, ngxColor, tinycolor) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise */
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b)
                if (Object.prototype.hasOwnProperty.call(b, p))
                    d[p] = b[p]; };
        return extendStatics(d, b);
    };
    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }
    var __assign = function () {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s)
                    if (Object.prototype.hasOwnProperty.call(s, p))
                        t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };
    function __rest(s, e) {
        var t = {};
        for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
                t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    }
    function __decorate(decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
            r = Reflect.decorate(decorators, target, key, desc);
        else
            for (var i = decorators.length - 1; i >= 0; i--)
                if (d = decorators[i])
                    r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    }
    function __param(paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); };
    }
    function __metadata(metadataKey, metadataValue) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
            return Reflect.metadata(metadataKey, metadataValue);
    }
    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try {
                step(generator.next(value));
            }
            catch (e) {
                reject(e);
            } }
            function rejected(value) { try {
                step(generator["throw"](value));
            }
            catch (e) {
                reject(e);
            } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }
    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function () { if (t[0] & 1)
                throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function () { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f)
                throw new TypeError("Generator is already executing.");
            while (_)
                try {
                    if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done)
                        return t;
                    if (y = 0, t)
                        op = [op[0] & 2, t.value];
                    switch (op[0]) {
                        case 0:
                        case 1:
                            t = op;
                            break;
                        case 4:
                            _.label++;
                            return { value: op[1], done: false };
                        case 5:
                            _.label++;
                            y = op[1];
                            op = [0];
                            continue;
                        case 7:
                            op = _.ops.pop();
                            _.trys.pop();
                            continue;
                        default:
                            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                                _ = 0;
                                continue;
                            }
                            if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                                _.label = op[1];
                                break;
                            }
                            if (op[0] === 6 && _.label < t[1]) {
                                _.label = t[1];
                                t = op;
                                break;
                            }
                            if (t && _.label < t[2]) {
                                _.label = t[2];
                                _.ops.push(op);
                                break;
                            }
                            if (t[2])
                                _.ops.pop();
                            _.trys.pop();
                            continue;
                    }
                    op = body.call(thisArg, _);
                }
                catch (e) {
                    op = [6, e];
                    y = 0;
                }
                finally {
                    f = t = 0;
                }
            if (op[0] & 5)
                throw op[1];
            return { value: op[0] ? op[1] : void 0, done: true };
        }
    }
    var __createBinding = Object.create ? (function (o, m, k, k2) {
        if (k2 === undefined)
            k2 = k;
        Object.defineProperty(o, k2, { enumerable: true, get: function () { return m[k]; } });
    }) : (function (o, m, k, k2) {
        if (k2 === undefined)
            k2 = k;
        o[k2] = m[k];
    });
    function __exportStar(m, o) {
        for (var p in m)
            if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p))
                __createBinding(o, m, p);
    }
    function __values(o) {
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m)
            return m.call(o);
        if (o && typeof o.length === "number")
            return {
                next: function () {
                    if (o && i >= o.length)
                        o = void 0;
                    return { value: o && o[i++], done: !o };
                }
            };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    }
    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m)
            return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
                ar.push(r.value);
        }
        catch (error) {
            e = { error: error };
        }
        finally {
            try {
                if (r && !r.done && (m = i["return"]))
                    m.call(i);
            }
            finally {
                if (e)
                    throw e.error;
            }
        }
        return ar;
    }
    function __spread() {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    }
    function __spreadArrays() {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++)
            s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    }
    ;
    function __await(v) {
        return this instanceof __await ? (this.v = v, this) : new __await(v);
    }
    function __asyncGenerator(thisArg, _arguments, generator) {
        if (!Symbol.asyncIterator)
            throw new TypeError("Symbol.asyncIterator is not defined.");
        var g = generator.apply(thisArg, _arguments || []), i, q = [];
        return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
        function verb(n) { if (g[n])
            i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
        function resume(n, v) { try {
            step(g[n](v));
        }
        catch (e) {
            settle(q[0][3], e);
        } }
        function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
        function fulfill(value) { resume("next", value); }
        function reject(value) { resume("throw", value); }
        function settle(f, v) { if (f(v), q.shift(), q.length)
            resume(q[0][0], q[0][1]); }
    }
    function __asyncDelegator(o) {
        var i, p;
        return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
        function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
    }
    function __asyncValues(o) {
        if (!Symbol.asyncIterator)
            throw new TypeError("Symbol.asyncIterator is not defined.");
        var m = o[Symbol.asyncIterator], i;
        return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
        function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
        function settle(resolve, reject, d, v) { Promise.resolve(v).then(function (v) { resolve({ value: v, done: d }); }, reject); }
    }
    function __makeTemplateObject(cooked, raw) {
        if (Object.defineProperty) {
            Object.defineProperty(cooked, "raw", { value: raw });
        }
        else {
            cooked.raw = raw;
        }
        return cooked;
    }
    ;
    var __setModuleDefault = Object.create ? (function (o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function (o, v) {
        o["default"] = v;
    };
    function __importStar(mod) {
        if (mod && mod.__esModule)
            return mod;
        var result = {};
        if (mod != null)
            for (var k in mod)
                if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
                    __createBinding(result, mod, k);
        __setModuleDefault(result, mod);
        return result;
    }
    function __importDefault(mod) {
        return (mod && mod.__esModule) ? mod : { default: mod };
    }
    function __classPrivateFieldGet(receiver, privateMap) {
        if (!privateMap.has(receiver)) {
            throw new TypeError("attempted to get private field on non-instance");
        }
        return privateMap.get(receiver);
    }
    function __classPrivateFieldSet(receiver, privateMap, value) {
        if (!privateMap.has(receiver)) {
            throw new TypeError("attempted to set private field on non-instance");
        }
        privateMap.set(receiver, value);
        return value;
    }

    var SketchFieldsComponent = /** @class */ (function () {
        function SketchFieldsComponent() {
            this.disableAlpha = false;
            this.onChange = new core.EventEmitter();
            this.input = {
                width: '100%',
                padding: '4px 10% 3px',
                border: 'none',
                boxSizing: 'border-box',
                boxShadow: 'inset 0 0 0 1px #ccc',
                fontSize: '11px',
            };
            this.label = {
                display: 'block',
                textAlign: 'center',
                fontSize: '11px',
                color: '#222',
                paddingTop: '3px',
                paddingBottom: '4px',
                textTransform: 'capitalize',
            };
        }
        SketchFieldsComponent.prototype.round = function (value) {
            return Math.round(value);
        };
        SketchFieldsComponent.prototype.handleChange = function (_a) {
            var data = _a.data, $event = _a.$event;
            if (data.hex) {
                if (ngxColor.isValidHex(data.hex)) {
                    var color = new tinycolor.TinyColor(data.hex);
                    this.onChange.emit({
                        data: {
                            hex: this.disableAlpha || data.hex.length <= 6 ? color.toHex() : color.toHex8(),
                            source: 'hex',
                        },
                        $event: $event,
                    });
                }
            }
            else if (data.r || data.g || data.b) {
                this.onChange.emit({
                    data: {
                        r: data.r || this.rgb.r,
                        g: data.g || this.rgb.g,
                        b: data.b || this.rgb.b,
                        source: 'rgb',
                    },
                    $event: $event,
                });
            }
            else if (data.a) {
                if (data.a < 0) {
                    data.a = 0;
                }
                else if (data.a > 100) {
                    data.a = 100;
                }
                data.a /= 100;
                if (this.disableAlpha) {
                    data.a = 1;
                }
                this.onChange.emit({
                    data: {
                        h: this.hsl.h,
                        s: this.hsl.s,
                        l: this.hsl.l,
                        a: Math.round(data.a * 100) / 100,
                        source: 'rgb',
                    },
                    $event: $event,
                });
            }
            else if (data.h || data.s || data.l) {
                this.onChange.emit({
                    data: {
                        h: data.h || this.hsl.h,
                        s: Number((data.s && data.s) || this.hsl.s),
                        l: Number((data.l && data.l) || this.hsl.l),
                        source: 'hsl',
                    },
                    $event: $event,
                });
            }
        };
        return SketchFieldsComponent;
    }());
    SketchFieldsComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'color-sketch-fields',
                    template: "\n  <div class=\"sketch-fields\">\n    <div class=\"sketch-double\">\n      <color-editable-input\n        [style]=\"{ input: input, label: label }\"\n        label=\"hex\"\n        [value]=\"hex.replace('#', '')\"\n        (onChange)=\"handleChange($event)\"\n      ></color-editable-input>\n    </div>\n    <div class=\"sketch-single\">\n      <color-editable-input\n        [style]=\"{ input: input, label: label }\"\n        label=\"r\"\n        [value]=\"rgb.r\"\n        (onChange)=\"handleChange($event)\"\n        [dragLabel]=\"true\"\n        [dragMax]=\"255\"\n      ></color-editable-input>\n    </div>\n    <div class=\"sketch-single\">\n      <color-editable-input\n        [style]=\"{ input: input, label: label }\"\n        label=\"g\"\n        [value]=\"rgb.g\"\n        (onChange)=\"handleChange($event)\"\n        [dragLabel]=\"true\"\n        [dragMax]=\"255\"\n      ></color-editable-input>\n    </div>\n    <div class=\"sketch-single\">\n      <color-editable-input\n        [style]=\"{ input: input, label: label }\"\n        label=\"b\"\n        [value]=\"rgb.b\"\n        (onChange)=\"handleChange($event)\"\n        [dragLabel]=\"true\"\n        [dragMax]=\"255\"\n      ></color-editable-input>\n    </div>\n    <div class=\"sketch-alpha\" *ngIf=\"disableAlpha === false\">\n      <color-editable-input\n        [style]=\"{ input: input, label: label }\"\n        label=\"a\"\n        [value]=\"round(rgb.a * 100)\"\n        (onChange)=\"handleChange($event)\"\n        [dragLabel]=\"true\"\n        [dragMax]=\"100\"\n      ></color-editable-input>\n    </div>\n  </div>\n  ",
                    changeDetection: core.ChangeDetectionStrategy.OnPush,
                    preserveWhitespaces: false,
                    styles: ["\n    .sketch-fields {\n      display: flex;\n      padding-top: 4px;\n    }\n    .sketch-double {\n      -webkit-box-flex: 2;\n      flex: 2 1 0%;\n    }\n    .sketch-single {\n      flex: 1 1 0%;\n      padding-left: 6px;\n    }\n    .sketch-alpha {\n      -webkit-box-flex: 1;\n      flex: 1 1 0%;\n      padding-left: 6px;\n    }\n    :host-context([dir=rtl]) .sketch-single {\n      padding-right: 6px;\n      padding-left: 0;\n    }\n    :host-context([dir=rtl]) .sketch-alpha {\n      padding-right: 6px;\n      padding-left: 0;\n    }\n  "]
                },] }
    ];
    SketchFieldsComponent.propDecorators = {
        hsl: [{ type: core.Input }],
        rgb: [{ type: core.Input }],
        hex: [{ type: core.Input }],
        disableAlpha: [{ type: core.Input }],
        onChange: [{ type: core.Output }]
    };

    var SketchPresetColorsComponent = /** @class */ (function () {
        function SketchPresetColorsComponent() {
            this.onClick = new core.EventEmitter();
            this.onSwatchHover = new core.EventEmitter();
            this.swatchStyle = {
                borderRadius: '3px',
                boxShadow: 'inset 0 0 0 1px rgba(0,0,0,.15)',
            };
        }
        SketchPresetColorsComponent.prototype.handleClick = function (_a) {
            var hex = _a.hex, $event = _a.$event;
            this.onClick.emit({ hex: hex, $event: $event });
        };
        SketchPresetColorsComponent.prototype.normalizeValue = function (val) {
            if (typeof val === 'string') {
                return { color: val };
            }
            return val;
        };
        SketchPresetColorsComponent.prototype.focusStyle = function (val) {
            var c = this.normalizeValue(val);
            return {
                boxShadow: "inset 0 0 0 1px rgba(0,0,0,.15), 0 0 4px " + c.color,
            };
        };
        return SketchPresetColorsComponent;
    }());
    SketchPresetColorsComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'color-sketch-preset-colors',
                    template: "\n  <div class=\"sketch-swatches\">\n    <div class=\"sketch-wrap\" *ngFor=\"let c of colors\">\n      <color-swatch\n        [color]=\"normalizeValue(c).color\"\n        [style]=\"swatchStyle\"\n        [focusStyle]=\"focusStyle(c)\"\n        (onClick)=\"handleClick($event)\"\n        (onHover)=\"onSwatchHover.emit($event)\"\n        class=\"swatch\"\n      ></color-swatch>\n    </div>\n  </div>\n  ",
                    changeDetection: core.ChangeDetectionStrategy.OnPush,
                    preserveWhitespaces: false,
                    styles: ["\n    .sketch-swatches {\n      position: relative;\n      display: flex;\n      flex-wrap: wrap;\n      margin: 0px -10px;\n      padding: 10px 0px 0px 10px;\n      border-top: 1px solid rgb(238, 238, 238);\n    }\n    .sketch-wrap {\n      width: 16px;\n      height: 16px;\n      margin: 0px 10px 10px 0px;\n    }\n    :host-context([dir=rtl]) .sketch-swatches {\n      padding-right: 10px;\n      padding-left: 0;\n    }\n    :host-context([dir=rtl]) .sketch-wrap {\n      margin-left: 10px;\n      margin-right: 0;\n    }\n  "]
                },] }
    ];
    SketchPresetColorsComponent.propDecorators = {
        colors: [{ type: core.Input }],
        onClick: [{ type: core.Output }],
        onSwatchHover: [{ type: core.Output }]
    };

    var SketchComponent = /** @class */ (function (_super) {
        __extends(SketchComponent, _super);
        function SketchComponent() {
            var _this = _super.call(this) || this;
            /** Remove alpha slider and options from picker */
            _this.disableAlpha = false;
            /** Hex strings for default colors at bottom of picker */
            _this.presetColors = [
                '#D0021B',
                '#F5A623',
                '#F8E71C',
                '#8B572A',
                '#7ED321',
                '#417505',
                '#BD10E0',
                '#9013FE',
                '#4A90E2',
                '#50E3C2',
                '#B8E986',
                '#000000',
                '#4A4A4A',
                '#9B9B9B',
                '#FFFFFF',
            ];
            /** Width of picker */
            _this.width = 200;
            return _this;
        }
        SketchComponent.prototype.afterValidChange = function () {
            var alpha = this.disableAlpha ? 1 : this.rgb.a;
            this.activeBackground = "rgba(" + this.rgb.r + ", " + this.rgb.g + ", " + this.rgb.b + ", " + alpha + ")";
        };
        SketchComponent.prototype.handleValueChange = function (_a) {
            var data = _a.data, $event = _a.$event;
            this.handleChange(data, $event);
        };
        SketchComponent.prototype.handleBlockChange = function (_a) {
            var hex = _a.hex, $event = _a.$event;
            if (ngxColor.isValidHex(hex)) {
                // this.hex = hex;
                this.handleChange({
                    hex: hex,
                    source: 'hex',
                }, $event);
            }
        };
        return SketchComponent;
    }(ngxColor.ColorWrap));
    SketchComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'color-sketch',
                    template: "\n  <div class=\"sketch-picker {{ className }}\" [style.width]=\"width\">\n    <div class=\"sketch-saturation\">\n      <color-saturation [hsl]=\"hsl\" [hsv]=\"hsv\"\n        (onChange)=\"handleValueChange($event)\"\n      >\n      </color-saturation>\n    </div>\n    <div class=\"sketch-controls\">\n      <div class=\"sketch-sliders\">\n        <div class=\"sketch-hue\">\n          <color-hue [hsl]=\"hsl\"\n            (onChange)=\"handleValueChange($event)\"\n          ></color-hue>\n        </div>\n        <div class=\"sketch-alpha\" *ngIf=\"disableAlpha === false\">\n          <color-alpha\n            [radius]=\"2\" [rgb]=\"rgb\" [hsl]=\"hsl\"\n            (onChange)=\"handleValueChange($event)\"\n          ></color-alpha>\n        </div>\n      </div>\n      <div class=\"sketch-color\">\n        <color-checkboard></color-checkboard>\n        <div class=\"sketch-active\" [style.background]=\"activeBackground\"></div>\n      </div>\n    </div>\n    <div class=\"sketch-fields-container\">\n      <color-sketch-fields\n        [rgb]=\"rgb\" [hsl]=\"hsl\" [hex]=\"hex\"\n        [disableAlpha]=\"disableAlpha\"\n        (onChange)=\"handleValueChange($event)\"\n      ></color-sketch-fields>\n    </div>\n    <div class=\"sketch-swatches-container\" *ngIf=\"presetColors && presetColors.length\">\n      <color-sketch-preset-colors\n        [colors]=\"presetColors\"\n        (onClick)=\"handleBlockChange($event)\"\n        (onSwatchHover)=\"onSwatchHover.emit($event)\"\n      ></color-sketch-preset-colors>\n    </div>\n  </div>\n  ",
                    changeDetection: core.ChangeDetectionStrategy.OnPush,
                    preserveWhitespaces: false,
                    styles: ["\n    .sketch-picker {\n      padding: 10px 10px 3px;\n      box-sizing: initial;\n      background: #fff;\n      border-radius: 4px;\n      box-shadow: 0 0 0 1px rgba(0,0,0,.15), 0 8px 16px rgba(0,0,0,.15);\n    }\n    .sketch-saturation {\n      width: 100%;\n      padding-bottom: 75%;\n      position: relative;\n      overflow: hidden;\n    }\n    .sketch-fields-container {\n      display: block;\n    }\n    .sketch-swatches-container {\n      display: block;\n    }\n    .sketch-controls {\n      display: flex;\n    }\n    .sketch-sliders {\n      padding: 4px 0px;\n      -webkit-box-flex: 1;\n      flex: 1 1 0%;\n    }\n    .sketch-hue {\n      position: relative;\n      height: 10px;\n      overflow: hidden;\n    }\n    .sketch-alpha {\n      position: relative;\n      height: 10px;\n      margin-top: 4px;\n      overflow: hidden;\n    }\n    .sketch-color {\n      width: 24px;\n      height: 24px;\n      position: relative;\n      margin-top: 4px;\n      margin-left: 4px;\n      border-radius: 3px;\n    }\n    .sketch-active {\n      position: absolute;\n      top: 0px;\n      right: 0px;\n      bottom: 0px;\n      left: 0px;\n      border-radius: 2px;\n      box-shadow: rgba(0, 0, 0, 0.15) 0px 0px 0px 1px inset, rgba(0, 0, 0, 0.25) 0px 0px 4px inset;\n    }\n    :host-context([dir=rtl]) .sketch-color {\n      margin-right: 4px;\n      margin-left: 0;\n    }\n  "]
                },] }
    ];
    SketchComponent.ctorParameters = function () { return []; };
    SketchComponent.propDecorators = {
        disableAlpha: [{ type: core.Input }],
        presetColors: [{ type: core.Input }],
        width: [{ type: core.Input }]
    };
    var ColorSketchModule = /** @class */ (function () {
        function ColorSketchModule() {
        }
        return ColorSketchModule;
    }());
    ColorSketchModule.decorators = [
        { type: core.NgModule, args: [{
                    declarations: [
                        SketchComponent,
                        SketchFieldsComponent,
                        SketchPresetColorsComponent,
                    ],
                    exports: [
                        SketchComponent,
                        SketchFieldsComponent,
                        SketchPresetColorsComponent,
                    ],
                    imports: [
                        common.CommonModule,
                        ngxColor.AlphaModule,
                        ngxColor.CheckboardModule,
                        ngxColor.EditableInputModule,
                        ngxColor.HueModule,
                        ngxColor.SaturationModule,
                        ngxColor.SwatchModule,
                    ],
                },] }
    ];

    /**
     * Generated bundle index. Do not edit.
     */

    exports.ColorSketchModule = ColorSketchModule;
    exports.SketchComponent = SketchComponent;
    exports.ɵa = SketchFieldsComponent;
    exports.ɵb = SketchPresetColorsComponent;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=ngx-color-sketch.umd.js.map
