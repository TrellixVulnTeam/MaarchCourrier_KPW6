import { NgModule }         from '@angular/core';
import { CommonModule }     from '@angular/common';
import { FormsModule }      from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Md2Module }        from 'md2';

import { AppMaterialModule }                    from '../app-material.module';
import { AdministrationRoutingModule }          from './administration-routing.module';

import { AdministrationComponent }                      from './administration.component';
import { UsersAdministrationComponent, DataTablePipe }  from './users-administration.component';
import { UserAdministrationComponent }                  from './user-administration.component';
import { GroupsAdministrationComponent }                from './groups-administration.component';
import { GroupAdministrationComponent }                 from './group-administration.component';
import { BasketsAdministrationComponent }               from './baskets-administration.component';
import { BasketsOrderAdministrationComponent }          from './baskets-order-administration.component';
import { BasketAdministrationComponent }                from './basket-administration.component';
import { StatusesAdministrationComponent }              from './statuses-administration.component';
import { StatusAdministrationComponent }                from './status-administration.component';
import { ActionsAdministrationComponent }               from './actions-administration.component';
import { ActionAdministrationComponent }                from './action-administration.component';
import { ParametersAdministrationComponent }            from './parameters-administration.component';
import { ParameterAdministrationComponent }             from './parameter-administration.component';
import { PrioritiesAdministrationComponent }            from './priorities-administration.component';
import { PriorityAdministrationComponent }              from './priority-administration.component';
import { ReportsAdministrationComponent }               from './reports-administration.component';
import { HistoryAdministrationComponent }               from './history-administration.component';
import { HistoryBatchAdministrationComponent }          from './historyBatch-administration.component';
import { NotificationsAdministrationComponent }         from './notifications-administration.component';
import { NotificationAdministrationComponent }          from './notification-administration.component';


@NgModule({
    imports:      [
        CommonModule,
        FormsModule,
        HttpClientModule,
        AppMaterialModule,
        AdministrationRoutingModule,
        Md2Module
    ],
    declarations: [
        AdministrationComponent,
        UsersAdministrationComponent,
        UserAdministrationComponent,
        GroupsAdministrationComponent,
        GroupAdministrationComponent,
        BasketsAdministrationComponent,
        BasketsOrderAdministrationComponent,
        BasketAdministrationComponent,
        StatusesAdministrationComponent,
        StatusAdministrationComponent,
        ActionsAdministrationComponent,
        ActionAdministrationComponent,
        ParametersAdministrationComponent,
        ParameterAdministrationComponent,
        PrioritiesAdministrationComponent,
        PriorityAdministrationComponent,
        ReportsAdministrationComponent,
        HistoryAdministrationComponent,
        HistoryBatchAdministrationComponent,
        NotificationsAdministrationComponent,
        NotificationAdministrationComponent,
        DataTablePipe
    ]
})
export class AdministrationModule { }