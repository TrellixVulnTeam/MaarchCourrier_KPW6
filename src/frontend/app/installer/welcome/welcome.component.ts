import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from '@service/notification/notification.service';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { AuthService } from '@service/auth.service';


@Component({
    selector: 'app-welcome',
    templateUrl: './welcome.component.html',
    styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {

    stepFormGroup: FormGroup;

    langs: string[] = [];

    appVersion: string = environment.VERSION.split('.')[0] + '.' + environment.VERSION.split('.')[1];

    steps: any[] = [
        {
            icon: 'fas fa-check-square',
            desc: this.translate.instant('lang.prerequisiteCheck')
        },
        {
            icon: 'fa fa-database',
            desc: this.translate.instant('lang.databaseCreation')
        },
        {
            icon: 'fa fa-database',
            desc: this.translate.instant('lang.dataSampleCreation')
        },
        {
            icon: 'fa fa-hdd',
            desc: this.translate.instant('lang.docserverCreation')
        },
        {
            icon: 'fas fa-tools',
            desc: this.translate.instant('lang.stepCustomizationActionDesc')
        },
        {
            icon: 'fa fa-user',
            desc: this.translate.instant('lang.adminUserCreation')
        },
    ];

    customs: any = [];

    constructor(
        public translate: TranslateService,
        public http: HttpClient,
        private notify: NotificationService,
        private _formBuilder: FormBuilder,
        private authService: AuthService
    ) { }

    ngOnInit(): void {
        this.stepFormGroup = this._formBuilder.group({
            lang: ['fr', Validators.required]
        });

        this.getLang();
        if (!this.authService.noInstall) {
            this.getCustoms();
        }
    }

    getLang() {
        this.langs = [
            'fr',
            'en',
        ];
        /*this.http.get('../rest/dev/lang').pipe(
            tap((data: any) => {
            }),
            catchError((err: any) => {
                this.notify.handleSoftErrors(err);
                return of(false);
            })
        ).subscribe();*/
    }

    getCustoms() {
        this.http.get('../rest/installer/customs').pipe(
            tap((data: any) => {
                this.customs = data.customs;
            }),
            catchError((err: any) => {
                this.notify.handleSoftErrors(err);
                return of(false);
            })
        ).subscribe();
    }

    initStep() {
        return false;
    }

    getInfoToInstall(): any[] {
        return [];
        /*return [{
            idStep : 'lang',
            body: {
                lang: this.stepFormGroup.controls['lang'].value,
            },
            route : {
                method : 'POST',
                url : '../rest/installer/lang'
            },
            description: this.translate.instant('lang.langSetting'),
            installPriority: 3
        }];*/
    }

}
