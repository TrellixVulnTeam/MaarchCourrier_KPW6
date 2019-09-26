import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LANG } from '../translate.component';
import { NotificationService } from '../notification.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenav } from '@angular/material/sidenav';

import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderService } from '../../service/header.service';
import { FiltersListService } from '../../service/filtersList.service';

import { Overlay } from '@angular/cdk/overlay';
import { AppService } from '../../service/app.service';
import { IndexingFormComponent } from './indexing-form/indexing-form.component';
import { tap, finalize, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
    templateUrl: "indexation.component.html",
    styleUrls: [
        'indexation.component.scss',
        'indexing-form/indexing-form.component.scss'
    ],
    providers: [NotificationService, AppService],
})
export class IndexationComponent implements OnInit {

    lang: any = LANG;

    loading: boolean = false;


    @ViewChild('snav', { static: true }) sidenavLeft: MatSidenav;
    @ViewChild('snav2', { static: true }) sidenavRight: MatSidenav;

    @ViewChild('indexingForm', { static: false }) indexingForm: IndexingFormComponent;

    indexingModels: any[] = [];
    currentIndexingModel: any = {};
    currentGroupId: number;

    constructor(
        private route: ActivatedRoute,
        public http: HttpClient,
        public dialog: MatDialog,
        private headerService: HeaderService,
        public filtersListService: FiltersListService,
        private notify: NotificationService,
        public overlay: Overlay,
        public viewContainerRef: ViewContainerRef,
        public appService: AppService) { }

    ngOnInit(): void {
        this.loading = false;

        this.headerService.setHeader("Enregistrement d'un courrier");

        this.route.params.subscribe(params => {
            this.currentGroupId = params['groupId'];
            this.http.get("../../rest/indexingModels").pipe(
                tap((data: any) => {
                    this.indexingModels = data.indexingModels;
                    this.currentIndexingModel = this.indexingModels.filter(model => model.default === true)[0];
                }),
                finalize(() => this.loading = false),
                catchError((err: any) => {
                    this.notify.handleErrors(err);
                    return of(false);
                })
            ).subscribe();
        },
        (err: any) => {
            this.notify.handleErrors(err);
        });
    }

    onSubmit() {
        if (this.indexingForm.isValidForm()) {
            alert('Form OK !');
        }
        
    }

    loadIndexingModel(indexingModel: any) {
        this.currentIndexingModel = indexingModel;
        this.indexingForm.loadForm(indexingModel.id);
    }
}