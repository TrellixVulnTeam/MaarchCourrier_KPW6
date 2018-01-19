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
var translate_component_1 = require("../translate.component");
var notification_service_1 = require("../notification.service");
var NotificationsAdministrationComponent = /** @class */ (function () {
    function NotificationsAdministrationComponent(http, notify) {
        this.http = http;
        this.notify = notify;
        this.notifications = [];
        this.loading = false;
        this.lang = translate_component_1.LANG;
    }
    NotificationsAdministrationComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.updateBreadcrumb(angularGlobals.applicationName);
        this.coreUrl = angularGlobals.coreUrl;
        this.loading = true;
        this.http.get(this.coreUrl + 'rest/notifications')
            .subscribe(function (data) {
            _this.notifications = data.notifications;
            _this.loading = false;
        }, function (err) {
            _this.notify.error(err.error.errors);
        });
    };
    NotificationsAdministrationComponent.prototype.updateBreadcrumb = function (applicationName) {
        $j('#ariane')[0].innerHTML = "<a href='index.php?reinit=true'>" + applicationName + "</a> > " +
            "<a onclick='location.hash = \"/administration\"' style='cursor: pointer'>" + this.lang.administration + "</a> > " + this.lang.admin_notifications;
    };
    NotificationsAdministrationComponent.prototype.deleteNotification = function (notification) {
        var _this = this;
        var r = confirm(this.lang.deleteMsg);
        if (r) {
            this.http.delete(this.coreUrl + 'rest/notifications/' + notification.notification_sid)
                .subscribe(function (data) {
                _this.notifications = data.notifications;
                _this.notify.success(data.success);
            }, function (err) {
                _this.notify.error(err.error.errors);
            });
        }
    };
    NotificationsAdministrationComponent = __decorate([
        core_1.Component({
            templateUrl: angularGlobals["notifications-administrationView"],
            styleUrls: ['../../node_modules/bootstrap/dist/css/bootstrap.min.css'],
            providers: [notification_service_1.NotificationService]
        }),
        __metadata("design:paramtypes", [http_1.HttpClient, notification_service_1.NotificationService])
    ], NotificationsAdministrationComponent);
    return NotificationsAdministrationComponent;
}());
exports.NotificationsAdministrationComponent = NotificationsAdministrationComponent;
