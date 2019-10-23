import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LANG } from '../../app/translate.component';
import { tap, catchError, filter, finalize } from 'rxjs/operators';
import { of, Subject, Observable } from 'rxjs';
import { NotificationService } from '../notification.service';
import { ConfirmActionComponent } from './confirm-action/confirm-action.component';
import { MatDialog } from '@angular/material';
import { CloseMailActionComponent } from './close-mail-action/close-mail-action.component';
import { CloseAndIndexActionComponent } from './close-and-index-action/close-and-index-action.component';
import { UpdateAcknowledgementSendDateActionComponent } from './update-acknowledgement-send-date-action/update-acknowledgement-send-date-action.component';
import { CreateAcknowledgementReceiptActionComponent } from './create-acknowledgement-receipt-action/create-acknowledgement-receipt-action.component';
import { UpdateDepartureDateActionComponent } from './update-departure-date-action/update-departure-date-action.component';
import { DisabledBasketPersistenceActionComponent } from './disabled-basket-persistence-action/disabled-basket-persistence-action.component';
import { EnabledBasketPersistenceActionComponent } from './enabled-basket-persistence-action/enabled-basket-persistence-action.component';
import { ResMarkAsReadActionComponent } from './res-mark-as-read-action/res-mark-as-read-action.component';
import { ViewDocActionComponent } from './view-doc-action/view-doc-action.component';
import { SendExternalSignatoryBookActionComponent } from './send-external-signatory-book-action/send-external-signatory-book-action.component';
import { SendExternalNoteBookActionComponent } from './send-external-note-book-action/send-external-note-book-action.component';
import { RedirectActionComponent } from './redirect-action/redirect-action.component';
import { SendShippingActionComponent } from './send-shipping-action/send-shipping-action.component';

@Injectable()
export class ActionsService {

    lang: any = LANG;

    mode: string = 'indexing';

    currentResourceLock: any = null;

    currentAction: any = null;
    currentUserId: number = null;
    currentGroupId: number = null;
    currentBasketId: number = null;
    currentResIds: number[] = [];
    currentResourceInformations: any = null;

    loading: boolean = false;

    indexActionRoute: string;
    processActionRoute: string;

    private eventAction = new Subject<any>();

    constructor(
        public http: HttpClient,
        public dialog: MatDialog,
        private notify: NotificationService
    ) {
    }

    catchAction(): Observable<any> {
        return this.eventAction.asObservable();
    }

    setLoading(state: boolean) {
        this.loading = state;
    }

    setActionInformations(action: any, userId: number, groupId: number, basketId: number, resIds: number[]) {

        if (action !== null && userId > 0 && groupId > 0) {
            this.mode = basketId === null ? 'indexing' : 'process';
            this.currentAction = action;
            this.currentUserId = userId;
            this.currentGroupId = groupId;
            this.currentBasketId = basketId;
            this.currentResIds = resIds === null ? [] : resIds;

            this.indexActionRoute = `../../rest/indexing/groups/${this.currentGroupId}/actions/${this.currentAction.id}`;
            this.processActionRoute = `../../rest/resourcesList/users/${this.currentUserId}/groups/${this.currentGroupId}/baskets/${this.currentBasketId}/actions/${this.currentAction.id}`;

            return true;
        } else {
            let arrErr = [];

            console.log('Bad informations: ');
            console.log({ 'action': action }, { 'userId': userId }, { 'groupId': groupId }, { 'basketId': basketId }, { 'resIds': resIds });

            this.notify.error('Une erreur est survenue');
            return false;
        }
    }

    saveDocument(datas: any) {
        this.loading = true;
        this.setResourceInformations(datas);
        return this.http.post('../../rest/resources', this.currentResourceInformations);
    }

    setResourceInformations(datas: any) {
        this.currentResourceInformations = datas;
    }

    setResourceIds(resId: number[]) {
        this.currentResourceInformations['resId'] = resId;
        this.currentResIds = resId;
    }

    launchIndexingAction(action: any, userId: number, groupId: number, datas: any) {

        if (this.setActionInformations(action, userId, groupId, null, null)) {
            this.setResourceInformations(datas);
            this.loading = true;
            try {
                this[action.component]();
            }
            catch (error) {
                console.log(error);
                console.log(action.component);
                alert(this.lang.actionNotExist);
            }
        }
    }


    launchAction(action: any, userId: number, groupId: number, basketId: number, resIds: number[], datas: any) {
        if (this.setActionInformations(action, userId, groupId, basketId, resIds)) {
            this.loading = true;
            this.setResourceInformations(datas);
            this.http.put(`../../rest/resourcesList/users/${userId}/groups/${groupId}/baskets/${basketId}/lock`, { resources: resIds }).pipe(
                tap((data: any) => {
                    if (this.canExecuteAction(data.lockedResources, data.lockers, resIds)) {
                        try {
                            this.lockResource();
                            this[action.component]();
                        }
                        catch (error) {
                            console.log(error);
                            console.log(action.component);
                            alert(this.lang.actionNotExist);
                        }
                    }
                }),
                catchError((err: any) => {
                    this.notify.handleErrors(err);
                    return of(false);
                })
            ).subscribe();
        }
    }

    canExecuteAction(numberOflockedResIds: number, usersWholocked: any[], resIds: number[]) {
        let msgWarn = this.lang.warnLockRes + ' : ' + usersWholocked.join(', ');

        if (numberOflockedResIds != resIds.length) {
            msgWarn += this.lang.warnLockRes2 + '.';
        }

        if (numberOflockedResIds > 0) {
            alert(numberOflockedResIds + ' ' + msgWarn);
        }

        if (numberOflockedResIds != resIds.length) {
            return true;
        } else {
            return false;
        }
    }


    lockResource() {
        this.currentResourceLock = setInterval(() => {
            this.http.put(`../../rest/resourcesList/users/${this.currentUserId}/groups/${this.currentGroupId}/baskets/${this.currentBasketId}/lock`, { resources: this.currentResIds }).pipe(
                catchError((err: any) => {
                    this.notify.handleErrors(err);
                    return of(false);
                })
            ).subscribe();
        }, 50000);
    }

    unlockResource() {
        if (this.currentResIds.length > 0) {
            this.http.put(`../../rest/resourcesList/users/${this.currentUserId}/groups/${this.currentGroupId}/baskets/${this.currentBasketId}/unlock`, { resources: this.currentResIds }).pipe(
                catchError((err: any) => {
                    this.notify.handleErrors(err);
                    return of(false);
                })
            ).subscribe();
        }
    }

    stopRefreshResourceLock() {
        if (this.currentResourceLock !== null) {
            clearInterval(this.currentResourceLock);
        }
    }

    setDatasActionToSend() {
        return {
            resIds: this.currentResIds,
            resource: this.currentResourceInformations,
            action: this.currentAction,
            userId: this.currentUserId,
            groupId: this.currentGroupId,
            basketId: this.currentBasketId,
            indexActionRoute: this.indexActionRoute,
            processActionRoute: this.processActionRoute
        }
    }


    endAction(status: any) {
        this.unlockResource();

        this.notify.success(this.lang.action + ' : "' + this.currentAction.label + '" ' + this.lang.done);

        this.eventAction.next();
    }

    /* OPEN SPECIFIC ACTION */
    confirmAction() {

        const dialogRef = this.dialog.open(ConfirmActionComponent, {
            disableClose: true,
            width: '500px',
            data: this.setDatasActionToSend()
        });

        dialogRef.afterClosed().pipe(
            tap(() => {
                this.stopRefreshResourceLock();
                this.unlockResource();
            }),
            filter((data: string) => data === 'success'),
            tap((result: any) => {
                this.endAction(result);
            }),
            finalize(() => this.loading = false),
            catchError((err: any) => {
                this.notify.handleErrors(err);
                return of(false);
            })
        ).subscribe();
    }

    closeMailAction() {
        const dialogRef = this.dialog.open(CloseMailActionComponent, {
            disableClose: true,
            width: '500px',
            data: this.setDatasActionToSend()
        });
        dialogRef.afterClosed().pipe(
            tap(() => {
                this.stopRefreshResourceLock();
                this.unlockResource();
            }),
            filter((data: string) => data === 'success'),
            tap((result: any) => {
                this.endAction(result);
            }),
            finalize(() => this.loading = false),
            catchError((err: any) => {
                this.notify.handleErrors(err);
                return of(false);
            })
        ).subscribe();
    }

    closeAndIndexAction() {
        const dialogRef = this.dialog.open(CloseAndIndexActionComponent, {
            disableClose: true,
            width: '500px',
            data: this.setDatasActionToSend()
        });
        dialogRef.afterClosed().pipe(
            tap(() => {
                this.stopRefreshResourceLock();
                this.unlockResource();
            }),
            filter((data: string) => data === 'success'),
            tap((result: any) => {
                this.endAction(result);
            }),
            finalize(() => this.loading = false),
            catchError((err: any) => {
                this.notify.handleErrors(err);
                return of(false);
            })
        ).subscribe();
    }

    updateAcknowledgementSendDateAction() {
        const dialogRef = this.dialog.open(UpdateAcknowledgementSendDateActionComponent, {
            disableClose: true,
            width: '500px',
            data: this.setDatasActionToSend()
        });
        dialogRef.afterClosed().pipe(
            tap(() => {
                this.stopRefreshResourceLock();
                this.unlockResource();
            }),
            filter((data: string) => data === 'success'),
            tap((result: any) => {
                this.endAction(result);
            }),
            finalize(() => this.loading = false),
            catchError((err: any) => {
                this.notify.handleErrors(err);
                return of(false);
            })
        ).subscribe();
    }

    createAcknowledgementReceiptsAction() {
        const dialogRef = this.dialog.open(CreateAcknowledgementReceiptActionComponent, {
            disableClose: true,
            width: '600px',
            data: this.setDatasActionToSend()
        });
        dialogRef.afterClosed().pipe(
            tap(() => {
                this.stopRefreshResourceLock();
                this.unlockResource();
            }),
            filter((data: string) => data === 'success'),
            tap((result: any) => {
                this.endAction(result);
            }),
            finalize(() => this.loading = false),
            catchError((err: any) => {
                this.notify.handleErrors(err);
                return of(false);
            })
        ).subscribe();
    }

    updateDepartureDateAction() {
        const dialogRef = this.dialog.open(UpdateDepartureDateActionComponent, {
            disableClose: true,
            width: '500px',
            data: this.setDatasActionToSend()
        });
        dialogRef.afterClosed().pipe(
            tap(() => {
                this.stopRefreshResourceLock();
                this.unlockResource();
            }),
            filter((data: string) => data === 'success'),
            tap((result: any) => {
                this.endAction(result);
            }),
            finalize(() => this.loading = false),
            catchError((err: any) => {
                this.notify.handleErrors(err);
                return of(false);
            })
        ).subscribe();
    }

    disabledBasketPersistenceAction() {
        const dialogRef = this.dialog.open(DisabledBasketPersistenceActionComponent, {
            disableClose: true,
            width: '500px',
            data: this.setDatasActionToSend()
        });
        dialogRef.afterClosed().pipe(
            tap(() => {
                this.stopRefreshResourceLock();
                this.unlockResource();
            }),
            filter((data: string) => data === 'success'),
            tap((result: any) => {
                this.endAction(result);
            }),
            finalize(() => this.loading = false),
            catchError((err: any) => {
                this.notify.handleErrors(err);
                return of(false);
            })
        ).subscribe();
    }

    enabledBasketPersistenceAction() {
        const dialogRef = this.dialog.open(EnabledBasketPersistenceActionComponent, {
            disableClose: true,
            width: '500px',
            data: this.setDatasActionToSend()
        });
        dialogRef.afterClosed().pipe(
            tap(() => {
                this.stopRefreshResourceLock();
                this.unlockResource();
            }),
            filter((data: string) => data === 'success'),
            tap((result: any) => {
                this.endAction(result);
            }),
            finalize(() => this.loading = false),
            catchError((err: any) => {
                this.notify.handleErrors(err);
                return of(false);
            })
        ).subscribe();
    }

    resMarkAsReadAction() {
        const dialogRef = this.dialog.open(ResMarkAsReadActionComponent, {
            disableClose: true,
            width: '500px',
            data: this.setDatasActionToSend()
        });
        dialogRef.afterClosed().pipe(
            tap(() => {
                this.stopRefreshResourceLock();
                this.unlockResource();
            }),
            filter((data: string) => data === 'success'),
            tap((result: any) => {
                this.endAction(result);
            }),
            finalize(() => this.loading = false),
            catchError((err: any) => {
                this.notify.handleErrors(err);
                return of(false);
            })
        ).subscribe();
    }

    viewDoc() {
        this.dialog.open(ViewDocActionComponent, {
            panelClass: 'no-padding-full-dialog',
            data: this.setDatasActionToSend()
        });
    }

    sendExternalSignatoryBookAction() {
        const dialogRef = this.dialog.open(SendExternalSignatoryBookActionComponent, {
            disableClose: true,
            width: '500px',
            data: this.setDatasActionToSend()
        });
        dialogRef.afterClosed().pipe(
            tap(() => {
                this.stopRefreshResourceLock();
                this.unlockResource();
            }),
            filter((data: string) => data === 'success'),
            tap((result: any) => {
                this.endAction(result);
            }),
            finalize(() => this.loading = false),
            catchError((err: any) => {
                this.notify.handleErrors(err);
                return of(false);
            })
        ).subscribe();
    }

    sendExternalNoteBookAction() {
        const dialogRef = this.dialog.open(SendExternalNoteBookActionComponent, {
            disableClose: true,
            width: '500px',
            data: this.setDatasActionToSend()
        });
        dialogRef.afterClosed().pipe(
            tap(() => {
                this.stopRefreshResourceLock();
                this.unlockResource();
            }),
            filter((data: string) => data === 'success'),
            tap((result: any) => {
                this.endAction(result);
            }),
            finalize(() => this.loading = false),
            catchError((err: any) => {
                this.notify.handleErrors(err);
                return of(false);
            })
        ).subscribe();
    }

    redirectAction() {
        const dialogRef = this.dialog.open(RedirectActionComponent, {
            disableClose: true,
            data: this.setDatasActionToSend()
        });
        dialogRef.afterClosed().pipe(
            tap(() => {
                this.stopRefreshResourceLock();
                this.unlockResource();
            }),
            filter((data: string) => data === 'success'),
            tap((result: any) => {
                this.endAction(result);
            }),
            finalize(() => this.loading = false),
            catchError((err: any) => {
                this.notify.handleErrors(err);
                return of(false);
            })
        ).subscribe();
    }

    sendShippingAction() {
        const dialogRef = this.dialog.open(SendShippingActionComponent, {
            disableClose: true,
            width: '500px',
            data: this.setDatasActionToSend()
        });
        dialogRef.afterClosed().pipe(
            tap(() => {
                this.stopRefreshResourceLock();
                this.unlockResource();
            }),
            filter((data: string) => data === 'success'),
            tap((result: any) => {
                this.endAction(result);
            }),
            finalize(() => this.loading = false),
            catchError((err: any) => {
                this.notify.handleErrors(err);
                return of(false);
            })
        ).subscribe();
    }
}
