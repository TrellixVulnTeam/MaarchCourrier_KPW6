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
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var layout_1 = require("@angular/cdk/layout");
var http_1 = require("@angular/common/http");
var translate_component_1 = require("../translate.component");
var notification_service_1 = require("../notification.service");
var autocomplete_plugin_1 = require("../../plugins/autocomplete.plugin");
var DoctypesAdministrationComponent = /** @class */ (function (_super) {
    __extends(DoctypesAdministrationComponent, _super);
    function DoctypesAdministrationComponent(changeDetectorRef, media, http, notify) {
        var _this = _super.call(this, http, 'usersAndEntities') || this;
        _this.http = http;
        _this.notify = notify;
        _this.lang = translate_component_1.LANG;
        _this.doctypes = [];
        _this.currentType = false;
        _this.currentSecondLevel = false;
        _this.currentFirstLevel = false;
        _this.firstLevels = false;
        _this.FolderTypes = false;
        _this.secondLevels = false;
        _this.processModes = false;
        _this.models = false;
        _this.indexes = false;
        _this.loading = false;
        _this.creationMode = false;
        $j("link[href='merged_css.php']").remove();
        _this.mobileQuery = media.matchMedia('(max-width: 768px)');
        _this._mobileQueryListener = function () { return changeDetectorRef.detectChanges(); };
        _this.mobileQuery.addListener(_this._mobileQueryListener);
        return _this;
    }
    DoctypesAdministrationComponent.prototype.updateBreadcrumb = function (applicationName) {
        if ($j('#ariane')[0]) {
            $j('#ariane')[0].innerHTML = "<a href='index.php?reinit=true'>" + applicationName + "</a> > <a onclick='location.hash = \"/administration\"' style='cursor: pointer'>Administration</a> > Typologie documentaire";
        }
    };
    DoctypesAdministrationComponent.prototype.ngOnDestroy = function () {
        this.mobileQuery.removeListener(this._mobileQueryListener);
    };
    DoctypesAdministrationComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.updateBreadcrumb(angularGlobals.applicationName);
        this.coreUrl = angularGlobals.coreUrl;
        this.loading = true;
        this.http.get(this.coreUrl + "rest/doctypes")
            .subscribe(function (data) {
            _this.doctypes = data['structure'];
            setTimeout(function () {
                $j('#jstree').jstree({
                    "checkbox": {
                        "three_state": false //no cascade selection
                    },
                    'core': {
                        'themes': {
                            'name': 'proton',
                            'responsive': true
                        },
                        'data': _this.doctypes,
                        "check_callback": true
                    },
                    "plugins": ["search", "dnd", "contextmenu"],
                });
                $j('#jstree')
                    .on('select_node.jstree', function (e, data) {
                    if (_this.creationMode == true) {
                        // this.currentDoctype.doctypes_second_level_id = data.node.doctypes_second_level_id;
                    }
                    else {
                        _this.loadDoctype(data.node);
                    }
                }).on('move_node.jstree', function (e, data) {
                    _this.loadDoctype(data.node.id);
                    // this.currentDoctype.parent_entity_id = data.parent;
                    // this.moveEntity();
                })
                    .jstree();
            }, 0);
            $j('#jstree').jstree('select_node', _this.doctypes[0]);
            var to = false;
            $j('#jstree_search').keyup(function () {
                if (to) {
                    clearTimeout(to);
                }
                to = setTimeout(function () {
                    var v = $j('#jstree_search').val();
                    $j('#jstree').jstree(true).search(v);
                }, 250);
            });
            _this.loading = false;
        }, function () {
            location.href = "index.php";
        });
    };
    DoctypesAdministrationComponent.prototype.loadDoctype = function (data) {
        var _this = this;
        // Doctype
        if (data.original.type_id) {
            this.http.get(this.coreUrl + "rest/doctypes/types/" + data.original.type_id)
                .subscribe(function (data) {
                _this.currentFirstLevel = false;
                _this.currentSecondLevel = false;
                _this.currentType = data['doctype'];
                _this.secondLevels = data['secondLevel'];
                _this.processModes = data['processModes'];
                _this.models = data['models'];
                _this.indexes = data['indexes'];
            }, function (err) {
                _this.notify.error(err.error.errors);
            });
            // Second level
        }
        else if (data.original.doctypes_second_level_id) {
            this.http.get(this.coreUrl + "rest/doctypes/secondLevel/" + data.original.doctypes_second_level_id)
                .subscribe(function (data) {
                _this.currentFirstLevel = false;
                _this.currentSecondLevel = data['secondLevel'];
                _this.firstLevels = data['firstLevel'];
                _this.currentType = false;
            }, function (err) {
                _this.notify.error(err.error.errors);
            });
            // First level
        }
        else {
            this.http.get(this.coreUrl + "rest/doctypes/firstLevel/" + data.original.doctypes_first_level_id)
                .subscribe(function (data) {
                _this.currentFirstLevel = data['firstLevel'];
                _this.FolderTypes = data['folderTypes'];
                _this.currentSecondLevel = false;
                _this.currentType = false;
            }, function (err) {
                _this.notify.error(err.error.errors);
            });
        }
    };
    // addElemListModel(element: any) {
    //     var inListModel = false;
    //     var newElemListModel = {
    //         "type": element.type,
    //         "id": element.id,
    //         "labelToDisplay": element.idToDisplay,
    //         "descriptionToDisplay": element.otherInfo,
    //     };
    //     this.currentDoctype.roles.forEach((role: any) => {
    //         if (role.available == true) {
    //             if (this.currentDoctype.listTemplate[role.id]) {
    //                 this.currentDoctype.listTemplate[role.id].forEach((listModel: any) => {
    //                     console.log(listModel);
    //                     if (listModel.id == element.id) {
    //                         inListModel = true;
    //                     }
    //                 });
    //             }
    //         }
    //     });
    //     if (!inListModel) {
    //         this.currentDoctype.listTemplate.cc.unshift(newElemListModel);
    //     }
    // }
    // saveEntity() {
    //     if (this.creationMode) {
    //         this.http.post(this.coreUrl + "rest/entities", this.currentDoctype)
    //             .subscribe((data: any) => {
    //                 this.creationMode = false;
    //                 this.doctypes.push(this.currentDoctype);
    //                 $j('#jstree').jstree("refresh");
    //                 this.notify.success(this.lang.entityAdded);
    //             }, (err) => {
    //                 this.notify.error(err.error.errors);
    //             });
    //     } else {
    //         this.http.put(this.coreUrl + "rest/entities/" + this.currentDoctype.entity_id, this.currentDoctype)
    //             .subscribe((data: any) => {
    //                 console.log(data);
    //                 this.doctypes = data['entities'];
    //                 $j('#jstree').jstree(true).settings.core.data = this.doctypes;
    //                 $j('#jstree').jstree("refresh");
    //                 this.notify.success(this.lang.entityUpdated);
    //             }, (err) => {
    //                 this.notify.error(err.error.errors);
    //             });
    //     }
    // }
    // moveEntity() {
    //     this.http.put(this.coreUrl + "rest/entities/" + this.currentDoctype.entity_id, this.currentDoctype)
    //             .subscribe((data: any) => {
    //                 this.notify.success(this.lang.entityUpdated);
    //             }, (err) => {
    //                 this.notify.error(err.error.errors);
    //             });
    // }
    DoctypesAdministrationComponent.prototype.readMode = function () {
        this.creationMode = false;
        $j('#jstree').jstree('deselect_all');
        $j('#jstree').jstree('select_node', this.doctypes[0]);
    };
    DoctypesAdministrationComponent = __decorate([
        core_1.Component({
            templateUrl: angularGlobals["doctypes-administrationView"],
            providers: [notification_service_1.NotificationService]
        }),
        __metadata("design:paramtypes", [core_1.ChangeDetectorRef, layout_1.MediaMatcher, http_1.HttpClient, notification_service_1.NotificationService])
    ], DoctypesAdministrationComponent);
    return DoctypesAdministrationComponent;
}(autocomplete_plugin_1.AutoCompletePlugin));
exports.DoctypesAdministrationComponent = DoctypesAdministrationComponent;
