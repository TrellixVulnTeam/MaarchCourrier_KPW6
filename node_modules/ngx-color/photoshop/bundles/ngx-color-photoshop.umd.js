(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/common'), require('@angular/core'), require('ngx-color')) :
    typeof define === 'function' && define.amd ? define('ngx-color/photoshop', ['exports', '@angular/common', '@angular/core', 'ngx-color'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory((global['ngx-color'] = global['ngx-color'] || {}, global['ngx-color'].photoshop = {}), global.ng.common, global.ng.core, global['ngx-color']));
}(this, (function (exports, common, core, ngxColor) { 'use strict';

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

    var PhotoshopButtonComponent = /** @class */ (function () {
        function PhotoshopButtonComponent() {
            this.label = '';
            this.active = false;
            this.onClick = new core.EventEmitter();
        }
        return PhotoshopButtonComponent;
    }());
    PhotoshopButtonComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'color-photoshop-button',
                    template: "\n    <div class=\"photoshop-button\"  [class.active]=\"active\"\n      (click)=\"onClick.emit($event)\"\n    >\n      {{ label }}\n    </div>\n  ",
                    changeDetection: core.ChangeDetectionStrategy.OnPush,
                    preserveWhitespaces: false,
                    styles: ["\n    .photoshop-button {\n      background-image: linear-gradient(\n        -180deg,\n        rgb(255, 255, 255) 0%,\n        rgb(230, 230, 230) 100%\n      );\n      border: 1px solid rgb(135, 135, 135);\n      border-radius: 2px;\n      height: 22px;\n      box-shadow: rgb(234, 234, 234) 0px 1px 0px 0px;\n      font-size: 14px;\n      color: rgb(0, 0, 0);\n      line-height: 20px;\n      text-align: center;\n      margin-bottom: 10px;\n      cursor: pointer;\n    }\n    .photoshop-button.active {\n      box-shadow: 0 0 0 1px #878787;\n    }\n  "]
                },] }
    ];
    PhotoshopButtonComponent.propDecorators = {
        label: [{ type: core.Input }],
        active: [{ type: core.Input }],
        onClick: [{ type: core.Output }]
    };

    var PhotoshopFieldsComponent = /** @class */ (function () {
        function PhotoshopFieldsComponent() {
            this.onChange = new core.EventEmitter();
            this.RGBinput = {
                marginLeft: '35%',
                width: '40%',
                height: '22px',
                border: '1px solid rgb(136, 136, 136)',
                boxShadow: 'rgba(0, 0, 0, 0.1) 0px 1px 1px inset, rgb(236, 236, 236) 0px 1px 0px 0px',
                marginBottom: '2px',
                fontSize: '13px',
                paddingLeft: '3px',
                marginRight: '10px',
            };
            this.RGBwrap = {
                position: 'relative',
            };
            this.RGBlabel = {
                left: '0px',
                width: '34px',
                textTransform: 'uppercase',
                fontSize: '13px',
                height: '24px',
                lineHeight: '24px',
                position: 'absolute',
            };
            this.HEXinput = {
                marginLeft: '20%',
                width: '80%',
                height: '22px',
                border: '1px solid #888888',
                boxShadow: 'inset 0 1px 1px rgba(0,0,0,.1), 0 1px 0 0 #ECECEC',
                marginBottom: '3px',
                fontSize: '13px',
                paddingLeft: '3px',
            };
            this.HEXwrap = {
                position: 'relative',
            };
            this.HEXlabel = {
                position: 'absolute',
                top: '0px',
                left: '0px',
                width: '14px',
                textTransform: 'uppercase',
                fontSize: '13px',
                height: '24px',
                lineHeight: '24px',
            };
        }
        PhotoshopFieldsComponent.prototype.round = function (v) {
            return Math.round(v);
        };
        PhotoshopFieldsComponent.prototype.handleValueChange = function (_a) {
            var data = _a.data, $event = _a.$event;
            if (data['#']) {
                if (ngxColor.isValidHex(data['#'])) {
                    this.onChange.emit({
                        data: {
                            hex: data['#'],
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
            else if (data.h || data.s || data.v) {
                this.onChange.emit({
                    data: {
                        h: data.h || this.hsv.h,
                        s: data.s || this.hsv.s,
                        v: data.v || this.hsv.v,
                        source: 'hsv',
                    },
                    $event: $event,
                });
            }
        };
        return PhotoshopFieldsComponent;
    }());
    PhotoshopFieldsComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'color-photoshop-fields',
                    template: "\n  <div class=\"photoshop-fields\">\n    <color-editable-input\n      [value]=\"round(hsv.h)\"\n      label=\"h\"\n      (onChange)=\"handleValueChange($event)\"\n      [style]=\"{input: RGBinput, wrap: RGBwrap, label: RGBlabel}\"\n    ></color-editable-input>\n    <color-editable-input\n      [value]=\"round(hsv.s * 100)\"\n      label=\"s\"\n      (onChange)=\"handleValueChange($event)\"\n      [style]=\"{input: RGBinput, wrap: RGBwrap, label: RGBlabel}\"\n    ></color-editable-input>\n    <color-editable-input\n      [value]=\"round(hsv.v * 100)\"\n      label=\"v\"\n      (onChange)=\"handleValueChange($event)\"\n      [style]=\"{input: RGBinput, wrap: RGBwrap, label: RGBlabel}\"\n    ></color-editable-input>\n    <div class=\"photoshop-divider\"></div>\n    <color-editable-input\n      [value]=\"rgb.r\"\n      label=\"r\"\n      (onChange)=\"handleValueChange($event)\"\n      [style]=\"{input: RGBinput, wrap: RGBwrap, label: RGBlabel}\"\n    ></color-editable-input>\n    <color-editable-input\n      [value]=\"rgb.g\"\n      label=\"g\"\n      (onChange)=\"handleValueChange($event)\"\n      [style]=\"{input: RGBinput, wrap: RGBwrap, label: RGBlabel}\"\n    ></color-editable-input>\n    <color-editable-input\n      [value]=\"rgb.b\"\n      label=\"b\"\n      (onChange)=\"handleValueChange($event)\"\n      [style]=\"{input: RGBinput, wrap: RGBwrap, label: RGBlabel}\"\n    ></color-editable-input>\n    <div class=\"photoshop-divider\"></div>\n    <color-editable-input\n      [value]=\"hex.replace('#', '')\"\n      label=\"#\"\n      (onChange)=\"handleValueChange($event)\"\n      [style]=\"{input: HEXinput, wrap: HEXwrap, label: HEXlabel}\"\n    ></color-editable-input>\n    <div class=\"photoshop-field-symbols\">\n      <div class=\"photoshop-symbol\">\u00B0</div>\n      <div class=\"photoshop-symbol\">%</div>\n      <div class=\"photoshop-symbol\">%</div>\n    </div>\n  </div>\n  ",
                    changeDetection: core.ChangeDetectionStrategy.OnPush,
                    preserveWhitespaces: false,
                    styles: ["\n    .photoshop-fields {\n      padding-top: 5px;\n      padding-bottom: 9px;\n      width: 85px;\n      position: relative;\n    }\n    .photoshop-field-symbols {\n      position: absolute;\n      top: 5px;\n      right: -7px;\n      font-size: 13px;\n    }\n    .photoshop-symbol {\n      height: 24px;\n      line-height: 24px;\n      padding-bottom: 7px;\n    }\n    .photoshop-divider {\n      height: 5px;\n    }\n  "]
                },] }
    ];
    PhotoshopFieldsComponent.propDecorators = {
        rgb: [{ type: core.Input }],
        hsv: [{ type: core.Input }],
        hex: [{ type: core.Input }],
        onChange: [{ type: core.Output }]
    };

    var PhotoshopPreviewsComponent = /** @class */ (function () {
        function PhotoshopPreviewsComponent() {
            this.currentColor = '';
            this.backgroundNew = '';
        }
        PhotoshopPreviewsComponent.prototype.ngOnChanges = function () {
            this.backgroundNew = "rgb(" + this.rgb.r + "," + this.rgb.g + ", " + this.rgb.b + ")";
        };
        return PhotoshopPreviewsComponent;
    }());
    PhotoshopPreviewsComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'color-photoshop-previews',
                    template: "\n  <div>\n    <div class=\"photoshop-label\">new</div>\n    <div class=\"photoshop-swatches\">\n      <div class=\"photoshop-new\" [style.background]=\"backgroundNew\"></div>\n      <div class=\"photoshop-current\" [style.background]=\"currentColor\"></div>\n    </div>\n    <div class=\"photoshop-label\">current</div>\n  </div>\n  ",
                    changeDetection: core.ChangeDetectionStrategy.OnPush,
                    preserveWhitespaces: false,
                    styles: ["\n  .photoshop-swatches {\n    border: 1px solid #B3B3B3;\n    border-bottom: 1px solid #F0F0F0;\n    margin-bottom: 2px;\n    margin-top: 1px;\n  }\n  .photoshop-new {\n    height: 34px;\n    box-shadow: inset 1px 0 0 #000, inset -1px 0 0 #000, inset 0 1px 0 #000;\n  }\n  .photoshop-current {\n    height: 34px;\n    box-shadow: inset 1px 0 0 #000, inset -1px 0 0 #000, inset 0 -1px 0 #000;\n  }\n  .photoshop-label {\n    font-size: 14px;\n    color: #000;\n    text-align: center;\n  }\n  "]
                },] }
    ];
    PhotoshopPreviewsComponent.propDecorators = {
        rgb: [{ type: core.Input }],
        currentColor: [{ type: core.Input }]
    };

    var PhotoshopComponent = /** @class */ (function (_super) {
        __extends(PhotoshopComponent, _super);
        function PhotoshopComponent() {
            var _this = _super.call(this) || this;
            /** Title text */
            _this.header = 'Color Picker';
            _this.onAccept = new core.EventEmitter();
            _this.onCancel = new core.EventEmitter();
            _this.circle = {
                width: '12px',
                height: '12px',
                borderRadius: '6px',
                boxShadow: 'rgb(255, 255, 255) 0px 0px 0px 1px inset',
                transform: 'translate(-6px, -10px)',
            };
            return _this;
        }
        PhotoshopComponent.prototype.handleValueChange = function (_a) {
            var data = _a.data, $event = _a.$event;
            this.handleChange(data, $event);
        };
        return PhotoshopComponent;
    }(ngxColor.ColorWrap));
    PhotoshopComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'color-photoshop',
                    template: "\n  <div class=\"photoshop-picker {{ className }}\">\n    <div class=\"photoshop-head\">{{ header }}</div>\n    <div class=\"photoshop-body\">\n      <div class=\"photoshop-saturation\">\n        <color-saturation\n          [hsl]=\"hsl\" [hsv]=\"hsv\" [circle]=\"circle\"\n          (onChange)=\"handleValueChange($event)\"\n        ></color-saturation>\n      </div>\n      <div class=\"photoshop-hue\">\n        <color-hue direction=\"vertical\"\n          [hsl]=\"hsl\" [hidePointer]=\"true\"\n          (onChange)=\"handleValueChange($event)\"\n        ></color-hue>\n      </div>\n      <div class=\"photoshop-controls\">\n        <div class=\"photoshop-top\">\n          <div class=\"photoshop-previews\">\n            <color-photoshop-previews\n              [rgb]=\"rgb\" [currentColor]=\"currentColor\"\n            ></color-photoshop-previews>\n          </div>\n          <div class=\"photoshop-actions\">\n            <color-photoshop-button label=\"OK\"\n              [active]=\"true\" (onClick)=\"onAccept.emit($event)\"\n            ></color-photoshop-button>\n            <color-photoshop-button label=\"Cancel\"\n              (onClick)=\"onCancel.emit($event)\"\n            >\n            </color-photoshop-button>\n            <color-photoshop-fields\n              [rgb]=\"rgb\" [hex]=\"hex\" [hsv]=\"hsv\"\n              (onChange)=\"handleValueChange($event)\"\n            ></color-photoshop-fields>\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n  ",
                    changeDetection: core.ChangeDetectionStrategy.OnPush,
                    preserveWhitespaces: false,
                    styles: ["\n    .photoshop-picker {\n      background: rgb(220, 220, 220);\n      border-radius: 4px;\n      box-shadow: rgba(0, 0, 0, 0.25) 0px 0px 0px 1px, rgba(0, 0, 0, 0.15) 0px 8px 16px;\n      box-sizing: initial; width: 513px;\n    }\n    .photoshop-head {\n      background-image: linear-gradient(\n        -180deg,\n        rgb(240, 240, 240) 0%,\n        rgb(212, 212, 212) 100%\n      );\n      border-bottom: 1px solid rgb(177, 177, 177);\n      box-shadow: rgba(255, 255, 255, 0.2) 0px 1px 0px 0px inset,\n        rgba(0, 0, 0, 0.02) 0px -1px 0px 0px inset;\n      height: 23px;\n      line-height: 24px;\n      border-radius: 4px 4px 0px 0px;\n      font-size: 13px;\n      color: rgb(77, 77, 77);\n      text-align: center;\n    }\n    .photoshop-body {\n      padding: 15px 15px 0px;\n      display: flex;\n    }\n    .photoshop-saturation {\n      width: 256px;\n      height: 256px;\n      position: relative;\n      border-width: 2px;\n      border-style: solid;\n      border-color: rgb(179, 179, 179) rgb(179, 179, 179) rgb(240, 240, 240);\n      border-image: initial;\n      overflow: hidden;\n    }\n    .photoshop-hue {\n      position: relative;\n      height: 256px;\n      width: 23px;\n      margin-left: 10px;\n      border-width: 2px;\n      border-style: solid;\n      border-color: rgb(179, 179, 179) rgb(179, 179, 179) rgb(240, 240, 240);\n      border-image: initial;\n    }\n    .photoshop-controls {\n      width: 180px;\n      margin-left: 10px;\n    }\n    .photoshop-top {\n      display: flex;\n    }\n    .photoshop-previews {\n      width: 60px;\n    }\n    .photoshop-actions {\n      -webkit-box-flex: 1;\n      flex: 1 1 0%;\n      margin-left: 20px;\n    }\n  "]
                },] }
    ];
    PhotoshopComponent.ctorParameters = function () { return []; };
    PhotoshopComponent.propDecorators = {
        header: [{ type: core.Input }],
        onAccept: [{ type: core.Output }],
        onCancel: [{ type: core.Output }]
    };
    var ColorPhotoshopModule = /** @class */ (function () {
        function ColorPhotoshopModule() {
        }
        return ColorPhotoshopModule;
    }());
    ColorPhotoshopModule.decorators = [
        { type: core.NgModule, args: [{
                    declarations: [
                        PhotoshopComponent,
                        PhotoshopPreviewsComponent,
                        PhotoshopButtonComponent,
                        PhotoshopFieldsComponent,
                    ],
                    exports: [
                        PhotoshopComponent,
                        PhotoshopPreviewsComponent,
                        PhotoshopButtonComponent,
                        PhotoshopFieldsComponent,
                    ],
                    imports: [
                        common.CommonModule,
                        ngxColor.EditableInputModule,
                        ngxColor.HueModule,
                        ngxColor.AlphaModule,
                        ngxColor.SwatchModule,
                        ngxColor.SaturationModule,
                    ],
                },] }
    ];

    /**
     * Generated bundle index. Do not edit.
     */

    exports.ColorPhotoshopModule = ColorPhotoshopModule;
    exports.PhotoshopComponent = PhotoshopComponent;
    exports.ɵa = PhotoshopPreviewsComponent;
    exports.ɵb = PhotoshopButtonComponent;
    exports.ɵc = PhotoshopFieldsComponent;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=ngx-color-photoshop.umd.js.map
