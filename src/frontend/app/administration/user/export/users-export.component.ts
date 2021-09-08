import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from '@service/notification/notification.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { catchError, tap, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { LocalStorageService } from '@service/local-storage.service';
import { HeaderService } from '@service/header.service';
import { FunctionsService } from '@service/functions.service';

@Component({
    templateUrl: 'users-export.component.html',
    styleUrls: ['users-export.component.scss'],
})
export class UsersExportComponent implements OnInit {

    loading: boolean = false;
    loadingExport: boolean = false;

    delimiters = [';', ',', 'TAB'];
    formats = ['csv'];

    exportModel: any = {
        delimiter: ';',
        format: 'csv',
    };

    exportModelList: any;

    constructor(
        public translate: TranslateService,
        public http: HttpClient,
        private notify: NotificationService,
        public dialogRef: MatDialogRef<UsersExportComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private localStorage: LocalStorageService,
        private headerService: HeaderService,
        private functionsService: FunctionsService
    ) { }

    async ngOnInit(): Promise<void> {
        this.setConfiguration();
    }

    exportData() {
        this.localStorage.save(`exportUsersFields_${this.headerService.user.id}`, JSON.stringify(this.exportModel));
        this.loadingExport = true;
        this.http.put('../rest/users/export', this.exportModel, { responseType: 'blob' }).pipe(
            tap((data: any) => {
                if (data.type !== 'text/html') {
                    const downloadLink = document.createElement('a');
                    downloadLink.href = window.URL.createObjectURL(data);
                    downloadLink.setAttribute('download', this.functionsService.getFormatedFileName('export_users_maarch', this.exportModel.format.toLowerCase()));
                    document.body.appendChild(downloadLink);
                    downloadLink.click();
                    this.dialogRef.close();
                } else {
                    alert(this.translate.instant('lang.tooMuchDatas'));
                }
            }),
            finalize(() => this.loadingExport = false),
            catchError((err: any) => {
                this.notify.handleSoftErrors(err);
                return of(false);
            })
        ).subscribe();
    }

    setConfiguration() {
        if (this.localStorage.get(`exportUsersFields_${this.headerService.user.id}`) !== null) {
            this.exportModel.delimiter = JSON.parse(this.localStorage.get(`exportUsersFields_${this.headerService.user.id}`)).delimiter;
        }
    }
}
