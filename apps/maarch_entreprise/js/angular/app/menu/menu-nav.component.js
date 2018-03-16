"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/common/http");
var common_1 = require("@angular/common");
var translate_component_1 = require("../translate.component");
var MenuNavComponent = /** @class */ (function () {
    function MenuNavComponent(http, _location) {
        this.http = http;
        this._location = _location;
        this.lang = translate_component_1.LANG;
    }
    MenuNavComponent.prototype.ngOnInit = function () {
        this.coreUrl = angularGlobals.coreUrl;
    };
    MenuNavComponent.prototype.backClicked = function () {
        this._location.back();
    };
    MenuNavComponent = __decorate([
        core_1.Component({
            selector: 'menu-nav',
            templateUrl: "../../../../Views/menuNav.component.html",
        }),
        __metadata("design:paramtypes", [http_1.HttpClient, common_1.Location])
    ], MenuNavComponent);
    return MenuNavComponent;
}());
exports.MenuNavComponent = MenuNavComponent;
