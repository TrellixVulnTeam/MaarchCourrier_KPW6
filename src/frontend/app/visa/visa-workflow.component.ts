import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LANG } from '../translate.component';
import { NotificationService } from '../notification.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

declare function $j(selector: any): any;

@Component({
    selector: 'app-visa-workflow',
    templateUrl: 'visa-workflow.component.html',
    styleUrls: ['visa-workflow.component.scss'],
    providers: [NotificationService]
})
export class VisaWorkflowComponent implements OnInit {

    lang: any = LANG;
    visaWorkflow: any = {
        roles: ['sign', 'visa'],
        items: []
    };
    loading: boolean = false;
    data: any;

    @Input('injectDatas') injectDatas: any;

    @Input('linkedToMaarchParapheur') linkedToMaarchParapheur: boolean;

    constructor(public http: HttpClient, private notify: NotificationService) { }

    ngOnInit(): void { 
        this.linkedToMaarchParapheur = this.linkedToMaarchParapheur === undefined ? false: this.linkedToMaarchParapheur;
    }

    drop(event: CdkDragDrop<string[]>) {
        if (event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        }
    }

    loadListModel(entityId: number) {
        this.loading = true;

        this.visaWorkflow.items = [];

        let route = this.linkedToMaarchParapheur === true ? `../../rest/listTemplates/entities/${entityId}/maarchParapheur` : `../../rest/listTemplates/entities/${entityId}`;
        
        this.http.get(route)
            .subscribe((data: any) => {
                data.listTemplate.forEach((element: any) => {
                    if (element.object_type === 'VISA_CIRCUIT') {
                        element.requested_signature = (element.item_mode === 'visa' ? false : true);
                        this.visaWorkflow.items.push(element);
                    }
                });
                this.visaWorkflow.items.forEach((element: any) => {
                    if (element.externalId.maarchParapheur !== undefined) {
                        this.http.get("../../rest/maarchParapheur/user/" + element.externalId.maarchParapheur + "/picture")
                            .subscribe((data: any) => {
                                element.picture = data.picture;
                            }, (err: any) => {
                                this.notify.handleErrors(err);
                            });
                    }
                });
                this.loading = false;
            });
    }

    loadWorkflow(resId: number) {
        this.loading = true;
        this.visaWorkflow.items = [];
        this.http.get("../../rest/res/" + resId + "/visaCircuit")
            .subscribe((data: any) => {
                data.forEach((element: any) => {
                    this.visaWorkflow.items.push(element);
                });
                this.loading = false;
            }, (err: any) => {
                this.notify.handleErrors(err);
            });
    }

    deleteItem(index: number) {
        this.visaWorkflow.items.splice(index, 1);
    }

    getVisaCount() {
        return this.visaWorkflow.items.length;
    }

    changeRole(i: number) {
        this.visaWorkflow.items[i].requested_signature = !this.visaWorkflow.items[i].requested_signature;
    }

    getWorkflow() {
        return this.visaWorkflow.items;
    }

    checkExternalSignatoryBook() {
        let usersMissing: string[] = [];
        this.visaWorkflow.items.forEach((element: any) => {
            if (Object.keys(element.externalId).indexOf('maarchParapheur') === -1) {
                usersMissing.push(element.labelToDisplay);
            }
        });

        return usersMissing;
    }

    addItem(userRest: any) {
        const user = {
            'externalId': userRest.externalId,
            'labelToDisplay': userRest.idToDisplay,
            'requested_signature': false,
            'picture': ''
        }
        this.visaWorkflow.items.push(user);
        this.http.get("../../rest/maarchParapheur/user/" + user.externalId.maarchParapheur + "/picture")
            .subscribe((data: any) => {
                this.visaWorkflow.items[this.visaWorkflow.items.length - 1].picture = data.picture;
            }, (err: any) => {
                this.notify.handleErrors(err);
            });
    }
}