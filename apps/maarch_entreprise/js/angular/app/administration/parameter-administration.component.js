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
var router_1 = require("@angular/router");
var translate_component_1 = require("../translate.component");
var notification_service_1 = require("../notification.service");
var ParameterAdministrationComponent = /** @class */ (function () {
    function ParameterAdministrationComponent(http, route, router, notify) {
        this.http = http;
        this.route = route;
        this.router = router;
        this.notify = notify;
        this.lang = translate_component_1.LANG;
        this.parameter = {};
        this.loading = false;
    }
    ParameterAdministrationComponent.prototype.updateBreadcrumb = function (applicationName) {
        $j('#ariane')[0].innerHTML = "<a href='index.php?reinit=true'>" + applicationName + "</a> > <a onclick='location.hash = \"/administration\"' style='cursor: pointer'>" + this.lang.administration + "</a> > <a onclick='location.hash = \"/administration/parameters\"' style='cursor: pointer'>" + this.lang.parameters + "</a>";
    };
    ParameterAdministrationComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.coreUrl = angularGlobals.coreUrl;
        this.loading = true;
        this.route.params.subscribe(function (params) {
            if (typeof params['id'] == "undefined") {
                _this.creationMode = true;
                _this.updateBreadcrumb(angularGlobals.applicationName);
                _this.loading = false;
            }
            else {
                _this.creationMode = false;
                _this.http.get(_this.coreUrl + "rest/parameters/" + params['id'])
                    .subscribe(function (data) {
                    _this.parameter = data.parameter;
                    _this.updateBreadcrumb(angularGlobals.applicationName);
                    if (_this.parameter.param_value_int) {
                        _this.type = "int";
                    }
                    else if (_this.parameter.param_value_date) {
                        _this.type = "date";
                    }
                    else {
                        _this.type = "string";
                    }
                    _this.loading = false;
                }, function () {
                    location.href = "index.php";
                });
            }
        });
    };
    ParameterAdministrationComponent.prototype.onSubmit = function () {
        var _this = this;
        if (this.type == 'date') {
            this.parameter.param_value_int = null;
            this.parameter.param_value_string = null;
        }
        else if (this.type == 'int') {
            this.parameter.param_value_date = null;
            this.parameter.param_value_string = null;
        }
        else if (this.type == 'string') {
            this.parameter.param_value_date = null;
            this.parameter.param_value_int = null;
        }
        if (this.creationMode == true) {
            this.http.post(this.coreUrl + 'rest/parameters', this.parameter)
                .subscribe(function (data) {
                _this.router.navigate(['administration/parameters']);
                _this.notify.success(_this.lang.parameterAdded);
            }, function (err) {
                _this.notify.error(err.error.errors);
            });
        }
        else if (this.creationMode == false) {
            this.http.put(this.coreUrl + 'rest/parameters/' + this.parameter.id, this.parameter)
                .subscribe(function (data) {
                _this.router.navigate(['administration/parameters']);
                _this.notify.success(_this.lang.parameterUpdated);
            }, function (err) {
                _this.notify.error(err.error.errors);
            });
        }
    };
    ParameterAdministrationComponent = __decorate([
        core_1.Component({
            templateUrl: angularGlobals['parameter-administrationView'],
            providers: [notification_service_1.NotificationService]
        }),
        __metadata("design:paramtypes", [http_1.HttpClient, router_1.ActivatedRoute, router_1.Router, notification_service_1.NotificationService])
    ], ParameterAdministrationComponent);
    return ParameterAdministrationComponent;
}());
exports.ParameterAdministrationComponent = ParameterAdministrationComponent;
