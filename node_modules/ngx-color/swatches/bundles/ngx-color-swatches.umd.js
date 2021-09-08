(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/common'), require('@angular/core'), require('material-colors'), require('ngx-color')) :
    typeof define === 'function' && define.amd ? define('ngx-color/swatches', ['exports', '@angular/common', '@angular/core', 'material-colors', 'ngx-color'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory((global['ngx-color'] = global['ngx-color'] || {}, global['ngx-color'].swatches = {}), global.ng.common, global.ng.core, global['material-colors'], global['ngx-color']));
}(this, (function (exports, common, core, materialColors, ngxColor) { 'use strict';

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

    var SwatchesColorComponent = /** @class */ (function () {
        function SwatchesColorComponent() {
            this.first = false;
            this.last = false;
            this.onClick = new core.EventEmitter();
            this.onSwatchHover = new core.EventEmitter();
            this.getContrastingColor = ngxColor.getContrastingColor;
            this.colorStyle = {
                width: '40px',
                height: '24px',
                cursor: 'pointer',
                marginBottom: '1px',
            };
            this.focusStyle = {};
        }
        SwatchesColorComponent.prototype.ngOnInit = function () {
            this.colorStyle.background = this.color;
            this.focusStyle.boxShadow = "0 0 4px " + this.color;
            if (this.first) {
                this.colorStyle.borderRadius = '2px 2px 0 0';
            }
            if (this.last) {
                this.colorStyle.borderRadius = '0 0 2px 2px';
            }
            if (this.color === '#FFFFFF') {
                this.colorStyle.boxShadow = 'inset 0 0 0 1px #ddd';
            }
        };
        SwatchesColorComponent.prototype.handleClick = function ($event) {
            this.onClick.emit({
                data: {
                    hex: this.color,
                    source: 'hex',
                },
                $event: $event,
            });
        };
        return SwatchesColorComponent;
    }());
    SwatchesColorComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'color-swatches-color',
                    template: "\n    <color-swatch\n      [color]=\"color\"\n      [style]=\"colorStyle\"\n      [focusStyle]=\"focusStyle\"\n      [class.first]=\"first\"\n      [class.last]=\"last\"\n      (click)=\"handleClick($event)\"\n      (keydown.enter)=\"handleClick($event)\"\n      (onHover)=\"onSwatchHover.emit($event)\"\n    >\n      <div class=\"swatch-check\" *ngIf=\"active\" [class.first]=\"first\" [class.last]=\"last\">\n        <svg\n          style=\"width: 24px; height: 24px;\"\n          viewBox=\"0 0 24 24\"\n          [style.fill]=\"getContrastingColor(color)\"\n        >\n          <path d=\"M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z\" />\n        </svg>\n      </div>\n    </color-swatch>\n  ",
                    changeDetection: core.ChangeDetectionStrategy.OnPush,
                    preserveWhitespaces: false,
                    styles: ["\n      .swatches-group {\n        padding-bottom: 10px;\n        width: 40px;\n        float: left;\n        margin-right: 10px;\n      }\n      .swatch-check {\n        display: flex;\n        margin-left: 8px;\n      }\n    "]
                },] }
    ];
    SwatchesColorComponent.propDecorators = {
        color: [{ type: core.Input }],
        first: [{ type: core.Input }],
        last: [{ type: core.Input }],
        active: [{ type: core.Input }],
        onClick: [{ type: core.Output }],
        onSwatchHover: [{ type: core.Output }]
    };

    var SwatchesGroupComponent = /** @class */ (function () {
        function SwatchesGroupComponent() {
            this.onClick = new core.EventEmitter();
            this.onSwatchHover = new core.EventEmitter();
        }
        return SwatchesGroupComponent;
    }());
    SwatchesGroupComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'color-swatches-group',
                    template: "\n    <div class=\"swatches-group\">\n      <color-swatches-color\n        *ngFor=\"let color of group; let idx = index\"\n        [active]=\"color.toLowerCase() === active\"\n        [color]=\"color\"\n        [first]=\"idx === 0\"\n        [last]=\"idx === group.length - 1\"\n        (onClick)=\"onClick.emit($event)\"\n      >\n      </color-swatches-color>\n    </div>\n  ",
                    changeDetection: core.ChangeDetectionStrategy.OnPush,
                    preserveWhitespaces: false,
                    styles: ["\n      .swatches-group {\n        padding-bottom: 10px;\n        width: 40px;\n        float: left;\n        margin-right: 10px;\n      }\n    "]
                },] }
    ];
    SwatchesGroupComponent.propDecorators = {
        group: [{ type: core.Input }],
        active: [{ type: core.Input }],
        onClick: [{ type: core.Output }],
        onSwatchHover: [{ type: core.Output }]
    };

    var SwatchesComponent = /** @class */ (function (_super) {
        __extends(SwatchesComponent, _super);
        function SwatchesComponent() {
            var _this = _super.call(this) || this;
            /** Pixel value for picker width */
            _this.width = 320;
            /** Color squares to display */
            _this.height = 240;
            /** An array of color groups, each with an array of colors */
            _this.colors = [
                [
                    materialColors.red['900'],
                    materialColors.red['700'],
                    materialColors.red['500'],
                    materialColors.red['300'],
                    materialColors.red['100'],
                ],
                [
                    materialColors.pink['900'],
                    materialColors.pink['700'],
                    materialColors.pink['500'],
                    materialColors.pink['300'],
                    materialColors.pink['100'],
                ],
                [
                    materialColors.purple['900'],
                    materialColors.purple['700'],
                    materialColors.purple['500'],
                    materialColors.purple['300'],
                    materialColors.purple['100'],
                ],
                [
                    materialColors.deepPurple['900'],
                    materialColors.deepPurple['700'],
                    materialColors.deepPurple['500'],
                    materialColors.deepPurple['300'],
                    materialColors.deepPurple['100'],
                ],
                [
                    materialColors.indigo['900'],
                    materialColors.indigo['700'],
                    materialColors.indigo['500'],
                    materialColors.indigo['300'],
                    materialColors.indigo['100'],
                ],
                [
                    materialColors.blue['900'],
                    materialColors.blue['700'],
                    materialColors.blue['500'],
                    materialColors.blue['300'],
                    materialColors.blue['100'],
                ],
                [
                    materialColors.lightBlue['900'],
                    materialColors.lightBlue['700'],
                    materialColors.lightBlue['500'],
                    materialColors.lightBlue['300'],
                    materialColors.lightBlue['100'],
                ],
                [
                    materialColors.cyan['900'],
                    materialColors.cyan['700'],
                    materialColors.cyan['500'],
                    materialColors.cyan['300'],
                    materialColors.cyan['100'],
                ],
                [
                    materialColors.teal['900'],
                    materialColors.teal['700'],
                    materialColors.teal['500'],
                    materialColors.teal['300'],
                    materialColors.teal['100'],
                ],
                [
                    '#194D33',
                    materialColors.green['700'],
                    materialColors.green['500'],
                    materialColors.green['300'],
                    materialColors.green['100'],
                ],
                [
                    materialColors.lightGreen['900'],
                    materialColors.lightGreen['700'],
                    materialColors.lightGreen['500'],
                    materialColors.lightGreen['300'],
                    materialColors.lightGreen['100'],
                ],
                [
                    materialColors.lime['900'],
                    materialColors.lime['700'],
                    materialColors.lime['500'],
                    materialColors.lime['300'],
                    materialColors.lime['100'],
                ],
                [
                    materialColors.yellow['900'],
                    materialColors.yellow['700'],
                    materialColors.yellow['500'],
                    materialColors.yellow['300'],
                    materialColors.yellow['100'],
                ],
                [
                    materialColors.amber['900'],
                    materialColors.amber['700'],
                    materialColors.amber['500'],
                    materialColors.amber['300'],
                    materialColors.amber['100'],
                ],
                [
                    materialColors.orange['900'],
                    materialColors.orange['700'],
                    materialColors.orange['500'],
                    materialColors.orange['300'],
                    materialColors.orange['100'],
                ],
                [
                    materialColors.deepOrange['900'],
                    materialColors.deepOrange['700'],
                    materialColors.deepOrange['500'],
                    materialColors.deepOrange['300'],
                    materialColors.deepOrange['100'],
                ],
                [
                    materialColors.brown['900'],
                    materialColors.brown['700'],
                    materialColors.brown['500'],
                    materialColors.brown['300'],
                    materialColors.brown['100'],
                ],
                [
                    materialColors.blueGrey['900'],
                    materialColors.blueGrey['700'],
                    materialColors.blueGrey['500'],
                    materialColors.blueGrey['300'],
                    materialColors.blueGrey['100'],
                ],
                ['#000000', '#525252', '#969696', '#D9D9D9', '#FFFFFF'],
            ];
            _this.zDepth = 1;
            _this.radius = 1;
            _this.background = '#fff';
            return _this;
        }
        SwatchesComponent.prototype.handlePickerChange = function (_a) {
            var data = _a.data, $event = _a.$event;
            this.handleChange(data, $event);
        };
        return SwatchesComponent;
    }(ngxColor.ColorWrap));
    SwatchesComponent.decorators = [
        { type: core.Component, args: [{
                    selector: 'color-swatches',
                    template: "\n  <div class=\"swatches-picker {{ className }}\"\n    [style.width.px]=\"width\" [style.height.px]=\"height\">\n    <color-raised [zDepth]=\"zDepth\" [background]=\"background\" [radius]=\"radius\">\n      <div class=\"swatches-overflow\" [style.height.px]=\"height\">\n        <div class=\"swatches-body\">\n          <color-swatches-group\n            *ngFor=\"let group of colors\"\n            [group]=\"group\" [active]=\"hex\"\n            (onClick)=\"handlePickerChange($event)\"\n          ></color-swatches-group>\n        </div>\n      </div>\n    </color-raised>\n  </div>\n  ",
                    changeDetection: core.ChangeDetectionStrategy.OnPush,
                    preserveWhitespaces: false,
                    styles: ["\n      .swatches-overflow {\n        overflow-y: scroll;\n      }\n      .swatches-overflow {\n        padding: 16px 0 6px 16px;\n      }\n    "]
                },] }
    ];
    SwatchesComponent.ctorParameters = function () { return []; };
    SwatchesComponent.propDecorators = {
        width: [{ type: core.Input }],
        height: [{ type: core.Input }],
        colors: [{ type: core.Input }],
        zDepth: [{ type: core.Input }],
        radius: [{ type: core.Input }],
        background: [{ type: core.Input }]
    };
    var ColorSwatchesModule = /** @class */ (function () {
        function ColorSwatchesModule() {
        }
        return ColorSwatchesModule;
    }());
    ColorSwatchesModule.decorators = [
        { type: core.NgModule, args: [{
                    declarations: [
                        SwatchesComponent,
                        SwatchesGroupComponent,
                        SwatchesColorComponent,
                    ],
                    exports: [SwatchesComponent, SwatchesGroupComponent, SwatchesColorComponent],
                    imports: [common.CommonModule, ngxColor.SwatchModule, ngxColor.RaisedModule],
                },] }
    ];

    /**
     * Generated bundle index. Do not edit.
     */

    exports.ColorSwatchesModule = ColorSwatchesModule;
    exports.SwatchesComponent = SwatchesComponent;
    exports.ɵa = SwatchesGroupComponent;
    exports.ɵb = SwatchesColorComponent;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=ngx-color-swatches.umd.js.map
