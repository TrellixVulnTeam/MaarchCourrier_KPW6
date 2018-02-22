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
var layout_1 = require("@angular/cdk/layout");
var http_1 = require("@angular/common/http");
var router_1 = require("@angular/router");
var translate_component_1 = require("../translate.component");
var notification_service_1 = require("../notification.service");
var PriorityAdministrationComponent = /** @class */ (function () {
    function PriorityAdministrationComponent(changeDetectorRef, media, http, route, router, notify) {
        this.http = http;
        this.route = route;
        this.router = router;
        this.notify = notify;
        this.lang = translate_component_1.LANG;
        this.loading = false;
        this.priority = {
            useDoctypeDelay: false,
            color: "#135f7f",
            delays: "0",
            working_days: "false"
        };
        $j("link[href='merged_css.php']").remove();
        this.mobileQuery = media.matchMedia('(max-width: 768px)');
        this._mobileQueryListener = function () { return changeDetectorRef.detectChanges(); };
        this.mobileQuery.addListener(this._mobileQueryListener);
    }
    PriorityAdministrationComponent.prototype.ngOnDestroy = function () {
        this.mobileQuery.removeListener(this._mobileQueryListener);
    };
    PriorityAdministrationComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.coreUrl = angularGlobals.coreUrl;
        this.loading = true;
        this.route.params.subscribe(function (params) {
            if (typeof params['id'] == "undefined") {
                _this.creationMode = true;
                _this.loading = false;
            }
            else {
                _this.creationMode = false;
                _this.id = params['id'];
                _this.http.get(_this.coreUrl + "rest/priorities/" + _this.id)
                    .subscribe(function (data) {
                    _this.priority = data.priority;
                    _this.priority.useDoctypeDelay = _this.priority.delays != null;
                    if (_this.priority.working_days === true) {
                        _this.priority.working_days = "true";
                    }
                    else {
                        _this.priority.working_days = "false";
                    }
                    _this.loading = false;
                }, function () {
                    location.href = "index.php";
                });
            }
        });
    };
    PriorityAdministrationComponent.prototype.onSubmit = function () {
        var _this = this;
        if (this.priority.useDoctypeDelay == false) {
            this.priority.delays = null;
        }
        this.priority.working_days = this.priority.working_days == "true";
        if (this.creationMode) {
            this.http.post(this.coreUrl + "rest/priorities", this.priority)
                .subscribe(function () {
                _this.notify.success(_this.lang.priorityAdded);
                _this.router.navigate(["/administration/priorities"]);
            }, function (err) {
                _this.notify.error(err.error.errors);
            });
        }
        else {
            this.http.put(this.coreUrl + "rest/priorities/" + this.id, this.priority)
                .subscribe(function () {
                _this.notify.success(_this.lang.priorityUpdated);
                _this.router.navigate(["/administration/priorities"]);
            }, function (err) {
                _this.notify.error(err.error.errors);
            });
        }
    };
    PriorityAdministrationComponent = __decorate([
        core_1.Component({
            templateUrl: angularGlobals["priority-administrationView"],
            providers: [notification_service_1.NotificationService]
        }),
        __metadata("design:paramtypes", [core_1.ChangeDetectorRef, layout_1.MediaMatcher, http_1.HttpClient, router_1.ActivatedRoute, router_1.Router, notification_service_1.NotificationService])
    ], PriorityAdministrationComponent);
    return PriorityAdministrationComponent;
}());
exports.PriorityAdministrationComponent = PriorityAdministrationComponent;
