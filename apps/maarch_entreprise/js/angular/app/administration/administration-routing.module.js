"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var administration_component_1 = require("./administration.component");
var users_administration_component_1 = require("./users-administration.component");
var user_administration_component_1 = require("./user-administration.component");
var groups_administration_component_1 = require("./groups-administration.component");
var group_administration_component_1 = require("./group-administration.component");
var baskets_administration_component_1 = require("./baskets-administration.component");
var baskets_order_administration_component_1 = require("./baskets-order-administration.component");
var basket_administration_component_1 = require("./basket-administration.component");
var statuses_administration_component_1 = require("./statuses-administration.component");
var status_administration_component_1 = require("./status-administration.component");
var actions_administration_component_1 = require("./actions-administration.component");
var action_administration_component_1 = require("./action-administration.component");
var parameter_administration_component_1 = require("./parameter-administration.component");
var parameters_administration_component_1 = require("./parameters-administration.component");
var priorities_administration_component_1 = require("./priorities-administration.component");
var priority_administration_component_1 = require("./priority-administration.component");
var reports_administration_component_1 = require("./reports-administration.component");
var notifications_administration_component_1 = require("./notifications-administration.component");
var notification_administration_component_1 = require("./notification-administration.component");
var history_administration_component_1 = require("./history-administration.component");
var historyBatch_administration_component_1 = require("./historyBatch-administration.component");
var AdministrationRoutingModule = /** @class */ (function () {
    function AdministrationRoutingModule() {
    }
    AdministrationRoutingModule = __decorate([
        core_1.NgModule({
            imports: [
                router_1.RouterModule.forChild([
                    { path: 'administration', component: administration_component_1.AdministrationComponent },
                    { path: 'administration/users', component: users_administration_component_1.UsersAdministrationComponent },
                    { path: 'administration/users/new', component: user_administration_component_1.UserAdministrationComponent },
                    { path: 'administration/users/:id', component: user_administration_component_1.UserAdministrationComponent },
                    { path: 'administration/groups', component: groups_administration_component_1.GroupsAdministrationComponent },
                    { path: 'administration/groups/new', component: group_administration_component_1.GroupAdministrationComponent },
                    { path: 'administration/groups/:id', component: group_administration_component_1.GroupAdministrationComponent },
                    { path: 'administration/baskets', component: baskets_administration_component_1.BasketsAdministrationComponent },
                    { path: 'administration/baskets-sorted', component: baskets_order_administration_component_1.BasketsOrderAdministrationComponent },
                    { path: 'administration/baskets/new', component: basket_administration_component_1.BasketAdministrationComponent },
                    { path: 'administration/baskets/:id', component: basket_administration_component_1.BasketAdministrationComponent },
                    { path: 'administration/status', component: statuses_administration_component_1.StatusesAdministrationComponent },
                    { path: 'administration/status/new', component: status_administration_component_1.StatusAdministrationComponent },
                    { path: 'administration/status/:identifier', component: status_administration_component_1.StatusAdministrationComponent },
                    { path: 'administration/parameters', component: parameters_administration_component_1.ParametersAdministrationComponent },
                    { path: 'administration/parameters/new', component: parameter_administration_component_1.ParameterAdministrationComponent },
                    { path: 'administration/parameters/:id', component: parameter_administration_component_1.ParameterAdministrationComponent },
                    { path: 'administration/reports', component: reports_administration_component_1.ReportsAdministrationComponent },
                    { path: 'administration/priorities', component: priorities_administration_component_1.PrioritiesAdministrationComponent },
                    { path: 'administration/priorities/new', component: priority_administration_component_1.PriorityAdministrationComponent },
                    { path: 'administration/priorities/:id', component: priority_administration_component_1.PriorityAdministrationComponent },
                    { path: 'administration/actions', component: actions_administration_component_1.ActionsAdministrationComponent },
                    { path: 'administration/actions/new', component: action_administration_component_1.ActionAdministrationComponent },
                    { path: 'administration/actions/:id', component: action_administration_component_1.ActionAdministrationComponent },
                    { path: 'administration/notifications', component: notifications_administration_component_1.NotificationsAdministrationComponent },
                    { path: 'administration/notifications/new', component: notification_administration_component_1.NotificationAdministrationComponent },
                    { path: 'administration/notifications/:identifier', component: notification_administration_component_1.NotificationAdministrationComponent },
                    { path: 'administration/history', component: history_administration_component_1.HistoryAdministrationComponent },
                    { path: 'administration/historyBatch', component: historyBatch_administration_component_1.HistoryBatchAdministrationComponent },
                ]),
            ],
            exports: [
                router_1.RouterModule
            ]
        })
    ], AdministrationRoutingModule);
    return AdministrationRoutingModule;
}());
exports.AdministrationRoutingModule = AdministrationRoutingModule;
