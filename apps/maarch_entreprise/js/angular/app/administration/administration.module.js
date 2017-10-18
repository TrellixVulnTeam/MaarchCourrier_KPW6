"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var forms_1 = require("@angular/forms");
var http_1 = require("@angular/common/http");
var md2_1 = require("md2");
var app_material_module_1 = require("../app-material.module");
var administration_routing_module_1 = require("./administration-routing.module");
var administration_component_1 = require("./administration.component");
var notifications_administration_component_1 = require("./notifications-administration.component");
var notification_administration_component_1 = require("./notification-administration.component");
var users_administration_component_1 = require("./users-administration.component");
var user_administration_component_1 = require("./user-administration.component");
var groups_administration_component_1 = require("./groups-administration.component");
var group_administration_component_1 = require("./group-administration.component");
var statuses_administration_component_1 = require("./statuses-administration.component");
var status_administration_component_1 = require("./status-administration.component");
var actions_administration_component_1 = require("./actions-administration.component");
var action_administration_component_1 = require("./action-administration.component");
var parameters_administration_component_1 = require("./parameters-administration.component");
var parameter_administration_component_1 = require("./parameter-administration.component");
var priorities_administration_component_1 = require("./priorities-administration.component");
var priority_administration_component_1 = require("./priority-administration.component");
var reports_administration_component_1 = require("./reports-administration.component");
var history_administration_component_1 = require("./history-administration.component");
var historyBatch_administration_component_1 = require("./historyBatch-administration.component");
var AdministrationModule = (function () {
    function AdministrationModule() {
    }
    return AdministrationModule;
}());
AdministrationModule = __decorate([
    core_1.NgModule({
        imports: [
            common_1.CommonModule,
            forms_1.FormsModule,
            http_1.HttpClientModule,
            app_material_module_1.AppMaterialModule,
            administration_routing_module_1.AdministrationRoutingModule,
            md2_1.Md2Module
        ],
        declarations: [
            administration_component_1.AdministrationComponent,
            notifications_administration_component_1.NotificationsAdministrationComponent,
            notification_administration_component_1.NotificationAdministrationComponent,
            users_administration_component_1.UsersAdministrationComponent,
            user_administration_component_1.UserAdministrationComponent,
            groups_administration_component_1.GroupsAdministrationComponent,
            group_administration_component_1.GroupAdministrationComponent,
            statuses_administration_component_1.StatusesAdministrationComponent,
            status_administration_component_1.StatusAdministrationComponent,
            actions_administration_component_1.ActionsAdministrationComponent,
            action_administration_component_1.ActionAdministrationComponent,
            parameters_administration_component_1.ParametersAdministrationComponent,
            parameter_administration_component_1.ParameterAdministrationComponent,
            priorities_administration_component_1.PrioritiesAdministrationComponent,
            priority_administration_component_1.PriorityAdministrationComponent,
            reports_administration_component_1.ReportsAdministrationComponent,
            history_administration_component_1.HistoryAdministrationComponent,
            historyBatch_administration_component_1.HistoryBatchAdministrationComponent,
            users_administration_component_1.DataTablePipe
        ]
    })
], AdministrationModule);
exports.AdministrationModule = AdministrationModule;
