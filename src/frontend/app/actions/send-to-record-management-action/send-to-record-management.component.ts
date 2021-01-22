import { animate, state, style, transition, trigger } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { FunctionsService } from '@service/functions.service';
import { NotificationService } from '@service/notification/notification.service';
import { of } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';

@Component({
    selector: 'app-send-to-record-management',
    templateUrl: 'send-to-record-management.component.html',
    styleUrls: ['send-to-record-management.component.scss'],
    animations: [
        trigger('detailExpand', [
            state('collapsed', style({ height: '0px', minHeight: '0' })),
            state('expanded', style({ height: '*' })),
            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
    ],
})
export class SendToRecordManagementComponent implements OnInit {

    loading: boolean = false;
    checking: boolean = true;

    resources: any[] = [];
    resourcesErrors: any[] = [];
    critcalError: any = null;

    dataSource = new MatTableDataSource<any>(this.resources);

    senderArchiveEntity: string = '';

    recipientArchiveEntities = [];
    entityArchiveRecipient: string = null;

    archivalAgreements = [];
    archivalAgreement: string = null;

    columnsToDisplay = ['chrono', 'subject', 'slipId', 'producerService', 'retentionRule', 'retentionFinalDisposition', 'countArchives'];

    archives: any[] = [];
    folders: any = [];
    linkedResources: any = [];

    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(
        public translate: TranslateService,
        public http: HttpClient,
        private notify: NotificationService,
        public dialogRef: MatDialogRef<SendToRecordManagementComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public functions: FunctionsService
    ) {  }

    ngOnInit(): void {
        this.getData();
    }

    getData() {
        this.http.post(`../rest/resourcesList/users/${this.data.userId}/groups/${this.data.groupId}/baskets/${this.data.basketId}/actions/${this.data.action.id}/checkSendToRecordManagement`, { resources: this.data.resIds }).pipe(
            tap((data: any) => {
                this.resourcesErrors = data.errors;

                Object.keys(data.success).forEach((resId: any, index: number) => {
                    if (Object.keys(data.success).length === 1) {
                        this.linkedResources = data.success[resId].additionalData.linkedResources;
                        this.folders = data.success[resId].additionalData.folders;
                    }
                    this.resources.push({
                        resId: resId,
                        chrono: data.success[resId].data.metadata.alt_identifier,
                        subject: data.success[resId].data.metadata.subject,
                        slipId: data.success[resId].data.slipInfo.slipId,
                        archiveId: data.success[resId].data.slipInfo.archiveId,
                        retentionFinalDisposition: data.success[resId].data.doctype.retentionFinalDisposition,
                        archives: data.success[resId].archiveUnits,
                        doctype: data.success[resId].data.doctype.label,
                        retentionRule: data.success[resId].data.doctype.retentionRule,
                        producerService: data.success[resId].data.entity.producerService,
                        entity: data.success[resId].data.entity.label,
                        folder: data.success[resId].additionalData.folders.length > 0 ? data.success[resId].additionalData.folders[0] : null,
                        countArchives : data.success[resId].archiveUnits.length
                    });
                });
                this.archivalAgreements = data.archivalAgreements;
                this.recipientArchiveEntities = data.recipientArchiveEntities;
                this.senderArchiveEntity = data.senderArchiveEntity;

                setTimeout(() => {
                    this.dataSource.paginator = this.paginator;
                    this.checking = false;
                }, 0);
            }),
            catchError((err: any) => {
                if (!this.functions.empty(err.error.lang)) {
                    this.critcalError = this.translate.instant('lang.' + err.error.lang)
                } else {
                    this.critcalError = err.error.errors;
                }
                this.checking = false;
                return of(false);
            })
        ).subscribe();
    }

    onSubmit(mode: string) {
        this.loading = true;
        if (this.data.resIds.length > 0) {
            this.executeAction(mode);
        }
    }

    executeAction(mode: string) {
        const realResSelected: number[] = this.resources.map((item: any) => item.resId);

        this.http.put(this.data.processActionRoute, { resources: realResSelected, data: this.formatData(mode) }).pipe(
            tap((data: any) => {
                if (mode === 'download' && !this.functions.empty(data.data.encodedFile)) {
                    const downloadLink = document.createElement('a');
                    downloadLink.href = `data:application/zip;base64,${data.data.encodedFile}`;
                    let today: any;
                    let dd: any;
                    let mm: any;
                    let yyyy: any;

                    today = new Date();
                    dd = today.getDate();
                    mm = today.getMonth() + 1;
                    yyyy = today.getFullYear();

                    if (dd < 10) {
                        dd = '0' + dd;
                    }
                    if (mm < 10) {
                        mm = '0' + mm;
                    }
                    today = dd + '-' + mm + '-' + yyyy;
                    downloadLink.setAttribute('download', 'seda_package_' + today + '.zip');
                    document.body.appendChild(downloadLink);
                    downloadLink.click();
                    this.dialogRef.close('success');
                } else if (!data) {
                    this.dialogRef.close('success');
                }
                if (data && data.errors != null) {
                    this.notify.error(data.errors);
                }
            }),
            finalize(() => this.loading = false),
            catchError((err: any) => {
                this.notify.handleErrors(err);
                return of(false);
            })
        ).subscribe();
    }

    formatData(mode: string) {
        const dataToSend = {
            'archivalAgreement': this.archivalAgreement,
            'entityArchiveRecipient': this.entityArchiveRecipient,
            'folder': this.resources.length === 1  && this.folders.length > 0 ? this.resources[0].folder.id : null,
            'actionMode' : mode
        };
        return dataToSend;
    }

    getFolderLabel(folder: any) {
        if (this.resources.length === 1) {
            return this.folders.find((item: any) => item.id === folder);
        } else {
            return folder;
        }
    }

    isValid() {
        if (this.resources.length === 1 && this.folders.length > 0) {
            return !this.functions.empty(this.archivalAgreement) && !this.functions.empty(this.entityArchiveRecipient) && !this.functions.empty(this.resources[0].folder);
        } else {
            return !this.functions.empty(this.archivalAgreement) && !this.functions.empty(this.entityArchiveRecipient);
        }
    }
}
