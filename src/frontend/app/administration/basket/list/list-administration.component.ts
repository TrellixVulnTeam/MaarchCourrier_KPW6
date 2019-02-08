import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LANG } from '../../../translate.component';
import { NotificationService } from '../../../notification.service';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { startWith, map } from 'rxjs/operators';

@Component({
    selector: 'list-administration',
    templateUrl: "list-administration.component.html",
    styleUrls: ['list-administration.component.scss'],
    providers: [NotificationService],
})
export class ListAdministrationComponent implements OnInit {

    lang: any = LANG;
    loading: boolean = false;

    displayedMainData: any = [
        {
            'value': 'status_chrono',
            'label': 'N°Chrono',
            'sample': 'MAARCH/2018A/1',
            'cssClasses': ['align_centerData', 'normalData'],
            'icon': ''
        },
        {
            'value': 'subject',
            'label': 'Objet',
            'sample': 'Plainte concernant des nuisances sonore nocturne (le 20/12/2018)',
            'cssClasses': ['longData'],
            'icon': ''
        },];

    availableData: any = [
        {
            'value': 'priority_label',
            'label': 'Priorité',
            'sample': 'normal',
            'cssClasses': [],
            'icon': 'fa-traffic-light '
        },
        {
            'value': 'category',
            'label': 'Catégorie',
            'sample': 'courrier arrivée',
            'cssClasses': [],
            'icon': 'fa-exchange-alt'
        },
        {
            'value': 'type',
            'label': 'Type de courrier',
            'sample': 'Réclamation',
            'cssClasses': [],
            'icon': 'fa-suitcase'
        },
        {
            'value': 'attribution',
            'label': 'Attributaire (entité destinatrice)',
            'sample': 'Barbara BAIN (Pôle Jeunesse et Sport)',
            'cssClasses': [],
            'icon': 'fa-sitemap'
        },
        {
            'value': 'senders',
            'label': 'Destinataire',
            'sample': 'Patricia PETIT',
            'cssClasses': [],
            'icon': 'fa-user'
        },
        {
            'value': 'recipients',
            'label': 'Expéditeur',
            'sample': 'Alain DUBOIS (MAARCH)',
            'cssClasses': [],
            'icon': 'fa-book'
        },
        {
            'value': 'creation_limit_date',
            'label': 'Date de création - Date limite',
            'sample': '1er mai - <i class="fa fa-stopwatch"></i>&nbsp;<b color="warn">3 jour(s)</b>',
            'cssClasses': [],
            'icon': 'fa-calendar'
        },
        {
            'value': 'workflow_visa',
            'label': 'Circuit de visa',
            'sample': '<i color="accent" class="fa fa-check"></i> Barbara BAIN -> <i class="fa fa-hourglass-half"></i> <b>Bruno BOULE</b> -> <i class="fa fa-hourglass-half"></i> Patricia PETIT',
            'cssClasses': [],
            'icon': 'fa-list-ol'
        },
        {
            'value': 'workflow_avis',
            'label': 'Nombre d\'avis donné',
            'sample': '<b>3</b> avis donné(s)',
            'cssClasses': [],
            'icon': 'fa-comment-alt'
        },
    ];
    availableDataClone: any = [];

    displayedSecondaryData: any = [];
    displayedSecondaryDataClone: any = [];

    displayMode: string = 'label';
    dataControl = new FormControl();
    filteredDataOptions: Observable<string[]>;

    @Input('currentBasketGroup') private basketGroup: any;

    constructor(public http: HttpClient, private notify: NotificationService) { }

    ngOnInit(): void {
        this.filteredDataOptions = this.dataControl.valueChanges
            .pipe(
                startWith(''),
                map(value => this._filterData(value))
            );

        this.availableDataClone = JSON.parse(JSON.stringify(this.availableData));
        this.displayedSecondaryData = [];
        let indexData: number = 0;
        this.basketGroup.list_display.forEach((element: any) => {
            indexData = this.availableData.map((e: any) => { return e.value; }).indexOf(element.value);
            this.availableData[indexData].cssClasses = element.cssClasses;
            this.displayedSecondaryData.push(this.availableData[indexData]);
            this.availableData.splice(indexData, 1);
        });
        this.displayedSecondaryDataClone = JSON.parse(JSON.stringify(this.displayedSecondaryData));
    }

    toggleData() {
        this.dataControl.disabled ? this.dataControl.enable() : this.dataControl.disable();

        if (this.displayMode == 'label') {
            this.displayMode = 'sample';
        } else {
            this.displayMode = 'label';
        }

    }

    setStyle(item: any, value: string) {
        let typeFont = value.split('_');

        if(typeFont.length == 2) {
            item.cssClasses.forEach((element: any, index: number) => {
                if (element.includes(typeFont[0]) && element != value) {
                    item.cssClasses.splice(index, 1);
                }
            });
        }
        
        const index = item.cssClasses.indexOf(value);

        if (index === -1) {
            item.cssClasses.push(value);
        } else {
            item.cssClasses.splice(index, 1);
        }
    }

    addData(event: any) {
        if (this.displayedSecondaryData.length >= 7) {
            this.dataControl.setValue('');
            alert("Le nombre maximal d'élements affichés a été atteint");
        } else {
            let i = this.availableData.map((e: any) => { return e.value; }).indexOf(event.option.value.value);
            this.displayedSecondaryData.push(event.option.value);
            this.availableData.splice(i, 1);
            this.dataControl.setValue('');
        }
    }

    removeData(data: any, i: number) {
        this.availableData.push(data);
        this.displayedSecondaryData.splice(i, 1);
        this.dataControl.setValue('');
    }

    removeAllData() {
        this.availableData = this.availableData.concat(this.displayedSecondaryData);
        this.displayedSecondaryData = [];
        this.dataControl.setValue('');
    }

    drop(event: CdkDragDrop<string[]>) {
        if (event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        }
    }

    saveTemplate() {
        let template: any = [];
        this.displayedSecondaryData.forEach((element: any) => {
            template.push(
                {
                    'value': element.value,
                    'cssClasses': element.cssClasses,
                }
            );
        });

        this.http.put("../../rest/baskets/" + this.basketGroup.basket_id + "/groups/" + this.basketGroup.group_id, { 'list_display': template })
            .subscribe(() => {
                this.displayedSecondaryDataClone = JSON.parse(JSON.stringify(this.displayedSecondaryData));
                this.notify.success(this.lang.actionsGroupBasketUpdated);
            }, (err) => {
                this.notify.error(err.error.errors);
            });
    }

    private _filterData(value: any): string[] {
        let filterValue = '';

        if (typeof value === 'string') {
            filterValue = value.toLowerCase();
        } else if (value !== null) {
            filterValue = value.label.toLowerCase();
        }
        return this.availableData.filter((option: any) => option.label.toLowerCase().includes(filterValue));
    }

    checkModif() { 
        if (JSON.stringify(this.displayedSecondaryData) === JSON.stringify(this.displayedSecondaryDataClone)) {
            return true 
        } else {
           return false;
        }
    }

    cancelModification() {
        this.displayedSecondaryData = JSON.parse(JSON.stringify(this.displayedSecondaryDataClone));
        this.availableData = JSON.parse(JSON.stringify(this.availableDataClone));
        
        let indexData: number = 0;
        this.displayedSecondaryData.forEach((element: any) => {
            indexData = this.availableData.map((e: any) => { return e.value; }).indexOf(element.value);
            this.availableData.splice(indexData, 1);
        });
        this.dataControl.setValue('');
    }
}
