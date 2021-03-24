import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { catchError, filter, finalize, map, tap } from 'rxjs/operators';
import { NotificationService } from '../service/notification/notification.service';
import { AuthService } from '../service/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { FunctionsService } from '../service/functions.service';

declare const Office: any;
@Component({
    selector: 'app-panel',
    templateUrl: './panel.component.html',
    styleUrls: ['./panel.component.scss']
})
export class PanelComponent implements OnInit {
    status: string = 'loading';

    inApp: boolean = false;
    resId: number = null;

    displayMailInfo: any = {};
    docFromMail: any = {};
    contactInfos: any = {};
    userInfos: any;
    mailBody: any;
    attachments: any = [];
    contactId: number;

    addinConfig: any = {}

    connectionTry: any = null;

    serviceRequest: any = {};

    constructor(
        public http: HttpClient,
        private notificationService: NotificationService,
        public authService: AuthService,
        public translate: TranslateService,
        public functions: FunctionsService
    ) {
        this.authService.catchEvent().subscribe(async (result: any) => {
            if (result === 'connected') {
                this.inApp = await this.checkMailInApp();

                if (!this.inApp) {
                    console.log(Office.context.mailbox.item);
                    this.initMailInfo();
                    this.status = 'end';
                }
            } else if (result === 'not connected') {
                this.status = 'end';
            }
        });
    }

    ngOnInit() {
        const res = this.authService.getConnection();
        if (!res) {
            this.authService.tryConnection();
        }
    }

    async sendToMaarch() {
        this.status = 'loading';
        await this.getMailBody();
        await this.createContact();
        await this.createDocFromMail();
        if (this.attachments.filter((attachment: any) => attachment.selected).length > 0) {
            this.createAttachments(this.resId);
        }
    }

    checkMailInApp(): Promise<boolean> {
        let emailId: string = '"' + Office.context.mailbox.item.itemId + '"';
        let infoEmail: any = {
            type: 'emailId',
            value: emailId
        };
        return new Promise((resolve) => {
            this.http.put('../rest/resources/external', infoEmail).pipe(
                tap((data: any) => {
                    this.status = 'end';
                    const result = data.resId !== undefined ? true : false;
                    resolve(result);
                }),
                catchError((err: any) => {
                    if (err.error.errors === 'Document not found') {
                        this.status = 'end';
                        this.initMailInfo();
                    } else {
                        this.notificationService.handleErrors(err);
                    }
                    resolve(false);
                    return of(false);
                })
            ).subscribe();
        });
    }

    async initMailInfo() {
        await this.getConfiguration();
        this.displayMailInfo = {
            modelId: this.addinConfig.indexingModel.label,
            doctype: this.addinConfig.doctype.label,
            subject: Office.context.mailbox.item.subject,
            typist: `${this.authService.user.firstname} ${this.authService.user.lastname}`,
            status: this.addinConfig.status.label,
            documentDate: this.functions.formatObjectToDateFullFormat(Office.context.mailbox.item.dateTimeCreated),
            arrivalDate: this.functions.formatObjectToDateFullFormat(Office.context.mailbox.item.dateTimeCreated),
            emailId: Office.context.mailbox.item.itemId,
            sender: Office.context.mailbox.item.from.displayName
        };
        this.attachments = Office.context.mailbox.item.attachments.filter((attachment: any) => !attachment.isInline).map((attachment: any) => {
            return {
                ...attachment,
                selected: true
            };
        });
    }

    getConfiguration() {
        return new Promise((resolve) => {
            this.http.get(`../rest/plugins/outlook/configuration`).pipe(
                filter((data: any) => !this.functions.empty(data.configuration)),
                map((data: any) => data.configuration),
                tap((data: any) => {
                    this.addinConfig = data;
                    resolve(true);
                })
            ).subscribe();
        });
    }

    createDocFromMail() {
        this.docFromMail = {
            modelId: this.addinConfig.indexingModel.id,
            doctype: this.addinConfig.doctype.id,
            subject: Office.context.mailbox.item.subject,
            chrono: true,
            typist: this.authService.user.id,
            status: this.addinConfig.status.id,
            documentDate: Office.context.mailbox.item.dateTimeCreated,
            arrivalDate: Office.context.mailbox.item.dateTimeCreated,
            format: 'html',
            encodedFile: btoa(unescape(encodeURIComponent(this.mailBody))),
            externalId: { emailId: Office.context.mailbox.item.itemId },
            senders: [{ id: this.contactId, type: 'contact' }]
        };
        return new Promise((resolve) => {
            this.http.post('../rest/resources', this.docFromMail).pipe(
                tap((data: any) => {
                    this.resId = data.resId;
                    this.notificationService.success(this.translate.instant('lang.emailSent'));
                    this.inApp = true;
                    resolve(true);
                }),
                finalize(() => this.status = 'end'),
                catchError((err: any) => {
                    this.notificationService.handleErrors(err);
                    return of(false);
                })
            ).subscribe();
        });
    }

    getMailBody() {
        return new Promise((resolve) => {
            Office.context.mailbox.item.body.getAsync(Office.CoercionType.Html, ((res: { value: any; }) => {
                this.mailBody = res.value;
                resolve(true);
            }));
        });

    }

    createContact() {
        const userName: string = Office.context.mailbox.item.from.displayName;
        const index = userName.lastIndexOf(' ');
        this.contactInfos = {
            firstname: userName.substring(0, index),
            lastname: userName.substring(index + 1),
            email: Office.context.mailbox.item.from.emailAddress,
        };
        return new Promise((resolve) => {
            this.http.post('../rest/contacts', this.contactInfos).pipe(
                tap((data: any) => {
                    // console.log(data.id);
                    this.contactId = data.id;
                    resolve(true);
                }),
                catchError((err: any) => {
                    this.notificationService.handleErrors(err);
                    return of(false);
                })
            ).subscribe();
        });
    }

    createAttachments(resId: number) {
        const objToSend = {
            ewsUrl: Office.context.mailbox.ewsUrl,
            emailId: Office.context.mailbox.item.itemId,
            userId: Office.context.mailbox.userProfile.emailAddress,
            attachments: this.attachments.map((attachment: any) => attachment.id)
        };
        return new Promise((resolve) => {
            // FOR TEST
            console.log(objToSend);
            resolve(true);

            /*this.http.post('../rest/???', objToSend).pipe(
                finalize(() => resolve(true)),
                catchError((err: any) => {
                    this.notificationService.handleErrors(err);
                    return of(false);
                })
            ).subscribe();*/
        });
    }
}
