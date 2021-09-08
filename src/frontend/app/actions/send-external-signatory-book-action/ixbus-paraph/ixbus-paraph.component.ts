import { Component, OnInit, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { FormControl } from '@angular/forms';
import { LocalStorageService } from '@service/local-storage.service';
import { HeaderService } from '@service/header.service';

@Component({
    selector: 'app-ixbus-paraph',
    templateUrl: 'ixbus-paraph.component.html',
    styleUrls: ['ixbus-paraph.component.scss'],
})
export class IxbusParaphComponent implements OnInit {

    loading: boolean = true;

    currentAccount: any = null;
    usersWorkflowList: any[] = [];
    natures: any[] = [];
    messagesModel: any[] = [];
    users: any[] = [];
    ixbusDatas: any = {
        nature: '',
        messageModel: '',
        userId: '',
        signatureMode: 'manual'
    };

    injectDatasParam = {
        resId: 0,
        editable: true
    };

    selectNature = new FormControl();
    selectWorkflow = new FormControl();
    selectUser = new FormControl();

    @Input() additionalsInfos: any;
    @Input() externalSignatoryBookDatas: any;

    constructor(
        public translate: TranslateService,
        public http: HttpClient,
        public headerService: HeaderService,
        private localStorage: LocalStorageService
    ) { }

    ngOnInit(): void {
        this.additionalsInfos.ixbus.natures.forEach((element: any) => {
            this.natures.push({id: element.identifiant, label: element.nom});
        });

        if (this.localStorage.get(`ixBusSignatureMode_${this.headerService.user.id}`) !== null) {
            this.ixbusDatas.signatureMode = this.localStorage.get(`ixBusSignatureMode_${this.headerService.user.id}`);
        }

        this.loading = false;
    }

    changeModel(natureId: string) {
        this.messagesModel = [];
        this.additionalsInfos.ixbus.messagesModel[natureId].forEach((element: any) => {
            this.messagesModel.push({id: element.identifiant, label: element.nom});
        });

        this.users = [];
        this.additionalsInfos.ixbus.users[natureId].forEach((element: any) => {
            this.users.push({id: element.identifiant, label: element.prenom + ' ' + element.nom});
        });
    }

    isValidParaph() {
        if (this.additionalsInfos.attachments.length === 0 || this.natures.length === 0 || this.messagesModel.length === 0 || this.users.length === 0 || !this.ixbusDatas.nature
            || !this.ixbusDatas.messageModel || !this.ixbusDatas.userId) {
            return false;
        } else {
            return true;
        }
    }

    getRessources() {
        return this.additionalsInfos.attachments.map((e: any) => e.res_id);
    }

    getDatas() {
        this.localStorage.save(`ixBusSignatureMode_${this.headerService.user.id}`, this.ixbusDatas.signatureMode);
        this.externalSignatoryBookDatas = {
            'ixbus': this.ixbusDatas,
            'steps': []
        };
        return this.externalSignatoryBookDatas;
    }
}
