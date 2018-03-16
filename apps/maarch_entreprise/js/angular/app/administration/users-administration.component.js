"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var layout_1 = require("@angular/cdk/layout");
var http_1 = require("@angular/common/http");
var translate_component_1 = require("../translate.component");
var notification_service_1 = require("../notification.service");
var material_1 = require("@angular/material");
var autocomplete_plugin_1 = require("../../plugins/autocomplete.plugin");
var UsersAdministrationComponent = /** @class */ (function (_super) {
    __extends(UsersAdministrationComponent, _super);
    function UsersAdministrationComponent(changeDetectorRef, media, http, notify, dialog) {
        var _this = _super.call(this, http, ['users']) || this;
        _this.http = http;
        _this.notify = notify;
        _this.dialog = dialog;
        _this.lang = translate_component_1.LANG;
        _this.loading = false;
        _this.data = [];
        _this.config = {};
        _this.userDestRedirect = {};
        _this.userDestRedirectModels = [];
        _this.quota = {};
        _this.dataSource = new material_1.MatTableDataSource(_this.data);
        _this.displayedColumns = ['user_id', 'lastname', 'firstname', 'status', 'mail', 'actions'];
        $j("link[href='merged_css.php']").remove();
        _this.mobileQuery = media.matchMedia('(max-width: 768px)');
        _this._mobileQueryListener = function () { return changeDetectorRef.detectChanges(); };
        _this.mobileQuery.addListener(_this._mobileQueryListener);
        return _this;
    }
    UsersAdministrationComponent.prototype.applyFilter = function (filterValue) {
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
        this.dataSource.filter = filterValue;
    };
    UsersAdministrationComponent.prototype.ngOnDestroy = function () {
        this.mobileQuery.removeListener(this._mobileQueryListener);
    };
    UsersAdministrationComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.coreUrl = angularGlobals.coreUrl;
        this.loading = true;
        this.http.get(this.coreUrl + 'rest/users')
            .subscribe(function (data) {
            _this.data = data['users'];
            _this.quota = data['quota'];
            if (_this.quota.actives > _this.quota.userQuota) {
                _this.notify.error(_this.lang.quotaExceeded);
            }
            _this.loading = false;
            setTimeout(function () {
                _this.dataSource = new material_1.MatTableDataSource(_this.data);
                _this.dataSource.paginator = _this.paginator;
                _this.dataSource.sort = _this.sort;
            }, 0);
        }, function () {
            location.href = "index.php";
        });
    };
    UsersAdministrationComponent.prototype.suspendUser = function (user) {
        var _this = this;
        if (user.inDiffListDest == 'Y') {
            this.userDestRedirect = user;
            this.http.get(this.coreUrl + 'rest/listTemplates/entityDest/itemId/' + user.user_id)
                .subscribe(function (data) {
                _this.userDestRedirectModels = data.listTemplates;
                _this.config = { data: { userDestRedirect: _this.userDestRedirect, userDestRedirectModels: _this.userDestRedirectModels } };
                _this.dialogRef = _this.dialog.open(UsersAdministrationRedirectModalComponent, _this.config);
                _this.dialogRef.afterClosed().subscribe(function (result) {
                    if (result) {
                        user.enabled = 'N';
                        user.redirectListModels = result;
                        //first, update listModels
                        _this.http.put(_this.coreUrl + 'rest/listTemplates/entityDest/itemId/' + user.user_id, user)
                            .subscribe(function (data) {
                            if (data.errors) {
                                user.enabled = 'Y';
                                _this.notify.error(data.errors);
                            }
                            else {
                                //then suspend user
                                _this.http.put(_this.coreUrl + 'rest/users/' + user.id, user)
                                    .subscribe(function () {
                                    user.inDiffListDest = 'N';
                                    _this.notify.success(_this.lang.userSuspended);
                                    if (_this.quota.userQuota) {
                                        _this.quota.inactives++;
                                        _this.quota.actives--;
                                    }
                                }, function (err) {
                                    user.enabled = 'Y';
                                    _this.notify.error(err.error.errors);
                                });
                            }
                        }, function (err) {
                            _this.notify.error(err.error.errors);
                        });
                    }
                    _this.dialogRef = null;
                });
            }, function (err) {
                console.log(err);
                location.href = "index.php";
            });
        }
        else {
            var r = confirm(this.lang.confirmAction + ' ' + this.lang.suspend + ' « ' + user.user_id + ' »');
            if (r) {
                user.enabled = 'N';
                this.http.put(this.coreUrl + 'rest/users/' + user.id, user)
                    .subscribe(function () {
                    _this.notify.success(_this.lang.userSuspended);
                    if (_this.quota.userQuota) {
                        _this.quota.inactives++;
                        _this.quota.actives--;
                    }
                }, function (err) {
                    user.enabled = 'Y';
                    _this.notify.error(err.error.errors);
                });
            }
        }
    };
    UsersAdministrationComponent.prototype.activateUser = function (user) {
        var _this = this;
        var r = confirm(this.lang.confirmAction + ' ' + this.lang.authorize + ' « ' + user.user_id + ' »');
        if (r) {
            user.enabled = 'Y';
            this.http.put(this.coreUrl + 'rest/users/' + user.id, user)
                .subscribe(function () {
                _this.notify.success(_this.lang.userAuthorized);
                if (_this.quota.userQuota) {
                    _this.quota.inactives--;
                    _this.quota.actives++;
                    if (_this.quota.actives > _this.quota.userQuota) {
                        _this.notify.error(_this.lang.quotaExceeded);
                    }
                }
            }, function (err) {
                user.enabled = 'N';
                _this.notify.error(err.error.errors);
            });
        }
    };
    UsersAdministrationComponent.prototype.deleteUser = function (user) {
        var _this = this;
        if (user.inDiffListDest == 'Y') {
            this.userDestRedirect = user;
            this.http.get(this.coreUrl + 'rest/listTemplates/entityDest/itemId/' + user.user_id)
                .subscribe(function (data) {
                _this.userDestRedirectModels = data.listTemplates;
                _this.config = { data: { userDestRedirect: _this.userDestRedirect, userDestRedirectModels: _this.userDestRedirectModels } };
                _this.dialogRef = _this.dialog.open(UsersAdministrationRedirectModalComponent, _this.config);
                _this.dialogRef.afterClosed().subscribe(function (result) {
                    if (result) {
                        user.redirectListModels = result;
                        //first, update listModels
                        _this.http.put(_this.coreUrl + 'rest/listTemplates/entityDest/itemId/' + user.user_id, user)
                            .subscribe(function (data) {
                            if (data.errors) {
                                _this.notify.error(data.errors);
                            }
                            else {
                                //then delete user
                                _this.http.delete(_this.coreUrl + 'rest/users/' + user.id)
                                    .subscribe(function () {
                                    for (var i in _this.data) {
                                        if (_this.data[i].id == user.id) {
                                            _this.data.splice(Number(i), 1);
                                        }
                                    }
                                    _this.dataSource = new material_1.MatTableDataSource(_this.data);
                                    _this.dataSource.paginator = _this.paginator;
                                    _this.dataSource.sort = _this.sort;
                                    if (_this.quota.userQuota && user.enabled == 'Y') {
                                        _this.quota.actives--;
                                    }
                                    else if (_this.quota.userQuota && user.enabled == 'N') {
                                        _this.quota.inactives--;
                                    }
                                    _this.notify.success(_this.lang.userDeleted + ' « ' + user.user_id + ' »');
                                }, function (err) {
                                    _this.notify.error(err.error.errors);
                                });
                            }
                        }, function (err) {
                            _this.notify.error(err.error.errors);
                        });
                    }
                });
            }, function (err) {
                _this.notify.error(err.error.errors);
            });
        }
        else {
            var r = confirm(this.lang.confirmAction + ' ' + this.lang.delete + ' « ' + user.user_id + ' »');
            if (r) {
                this.http.delete(this.coreUrl + 'rest/users/' + user.id, user)
                    .subscribe(function () {
                    for (var i in _this.data) {
                        if (_this.data[i].id == user.id) {
                            _this.data.splice(Number(i), 1);
                        }
                    }
                    _this.dataSource = new material_1.MatTableDataSource(_this.data);
                    _this.dataSource.paginator = _this.paginator;
                    _this.dataSource.sort = _this.sort;
                    _this.notify.success(_this.lang.userDeleted);
                    if (_this.quota.userQuota && user.enabled == 'Y') {
                        _this.quota.actives--;
                    }
                    else if (_this.quota.userQuota && user.enabled == 'N') {
                        _this.quota.inactives--;
                    }
                }, function (err) {
                    _this.notify.error(err.error.errors);
                });
            }
        }
    };
    __decorate([
        core_1.ViewChild(material_1.MatPaginator),
        __metadata("design:type", material_1.MatPaginator)
    ], UsersAdministrationComponent.prototype, "paginator", void 0);
    __decorate([
        core_1.ViewChild(material_1.MatSort),
        __metadata("design:type", material_1.MatSort)
    ], UsersAdministrationComponent.prototype, "sort", void 0);
    UsersAdministrationComponent = __decorate([
        core_1.Component({
            templateUrl: angularGlobals["users-administrationView"],
            styleUrls: ['css/users-administration.component.css'],
            providers: [notification_service_1.NotificationService]
        }),
        __metadata("design:paramtypes", [core_1.ChangeDetectorRef, layout_1.MediaMatcher, http_1.HttpClient, notification_service_1.NotificationService, material_1.MatDialog])
    ], UsersAdministrationComponent);
    return UsersAdministrationComponent;
}(autocomplete_plugin_1.AutoCompletePlugin));
exports.UsersAdministrationComponent = UsersAdministrationComponent;
var UsersAdministrationRedirectModalComponent = /** @class */ (function (_super) {
    __extends(UsersAdministrationRedirectModalComponent, _super);
    function UsersAdministrationRedirectModalComponent(http, data, dialogRef) {
        var _this = _super.call(this, http, ['users']) || this;
        _this.http = http;
        _this.data = data;
        _this.dialogRef = dialogRef;
        _this.lang = translate_component_1.LANG;
        return _this;
    }
    UsersAdministrationRedirectModalComponent.prototype.sendFunction = function () {
        var valid = true;
        this.data.userDestRedirectModels.each(function (element) {
            if (!element.redirectUserId) {
                valid = false;
            }
        });
        return valid;
    };
    UsersAdministrationRedirectModalComponent = __decorate([
        core_1.Component({
            templateUrl: angularGlobals["users-administration-redirect-modalView"],
        }),
        __param(1, core_1.Inject(material_1.MAT_DIALOG_DATA)),
        __metadata("design:paramtypes", [http_1.HttpClient, Object, material_1.MatDialogRef])
    ], UsersAdministrationRedirectModalComponent);
    return UsersAdministrationRedirectModalComponent;
}(autocomplete_plugin_1.AutoCompletePlugin));
exports.UsersAdministrationRedirectModalComponent = UsersAdministrationRedirectModalComponent;
