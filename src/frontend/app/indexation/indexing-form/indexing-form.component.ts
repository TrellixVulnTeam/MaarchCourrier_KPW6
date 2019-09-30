import { Component, OnInit, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LANG } from '../../translate.component';
import { NotificationService } from '../../notification.service';
import { HeaderService } from '../../../service/header.service';
import { MatDialog } from '@angular/material/dialog';
import { AppService } from '../../../service/app.service';
import { tap, catchError, finalize, exhaustMap, map } from 'rxjs/operators';
import { of, forkJoin } from 'rxjs';
import { SortPipe } from '../../../plugins/sorting.pipe';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { FormControl, Validators, FormGroup, ValidationErrors, ValidatorFn, AbstractControl } from '@angular/forms';

@Component({
    selector: 'app-indexing-form',
    templateUrl: "indexing-form.component.html",
    styleUrls: ['indexing-form.component.scss'],
    providers: [NotificationService, AppService, SortPipe]
})

export class IndexingFormComponent implements OnInit {

    lang: any = LANG;

    loading: boolean = true;

    @Input('indexingFormId') indexingFormId: number;
    @Input('groupId') groupId: number;
    @Input('admin') adminMode: boolean;

    fieldCategories: any[] = ['mail', 'contact', 'process', 'classement'];

    indexingModelsCore: any[] = [
        {
            identifier: 'doctype',
            label: this.lang.doctype,
            unit: 'mail',
            type: 'select',
            system: true,
            mandatory: true,
            default_value: '',
            values: []
        },
        {
            identifier: 'subject',
            label: this.lang.subject,
            unit: 'mail',
            type: 'string',
            system: true,
            mandatory: true,
            default_value: '',
            values: []
        },
    ];

    indexingModels_mail: any[] = [];
    indexingModels_contact: any[] = [];
    indexingModels_process: any[] = [];
    indexingModels_classement: any[] = [];

    indexingModels_mailClone: any[] = [];
    indexingModels_contactClone: any[] = [];
    indexingModels_processClone: any[] = [];
    indexingModels_classementClone: any[] = [];

    indexingModelsCustomFields: any[] = [];

    availableFields: any[] = [
        {
            identifier: 'getRecipients',
            label: this.lang.getRecipients,
            type: 'autocomplete',
            default_value: '',
            values: []
        },
        {
            identifier: 'priority',
            label: this.lang.priority,
            type: 'select',
            default_value: '',
            values: []
        },
        {
            identifier: 'confidential',
            label: this.lang.confidential,
            type: 'radio',
            default_value: '',
            values: ['Oui', 'Non']
        },
        {
            identifier: 'initiator',
            label: this.lang.initiatorEntityAlt,
            type: 'select',
            default_value: '',
            values: []
        },
        {
            identifier: 'processLimitDate',
            label: this.lang.processLimitDate,
            type: 'date',
            default_value: '',
            values: []
        },
        {
            identifier: 'tags',
            label: this.lang.tags,
            type: 'autocomplete',
            default_value: '',
            values: ['/rest/autocomplete/tags', '/rest/tags']
        },
        {
            identifier: 'senders',
            label: this.lang.getSenders,
            type: 'autocomplete',
            default_value: '',
            values: ['/rest/autocomplete/contacts']
        },
        {
            identifier: 'destination',
            label: this.lang.destination,
            type: 'select',
            default_value: '',
            values: []
        },
        {
            identifier: 'folder',
            label: this.lang.folder,
            type: 'autocomplete',
            default_value: '',
            values: ['/rest/autocomplete/folders', '/rest/folders']
        },
        {
            identifier: 'docDate',
            label: this.lang.docDate,
            unit: 'mail',
            type: 'date',
            default_value: '',
            values: []
        },
        {
            identifier: 'arrivalDate',
            label: this.lang.arrivalDate,
            unit: 'mail',
            type: 'date',
            default_value: '',
            values: []
        },
    ];
    availableFieldsClone: any[] = [];

    availableCustomFields: any[] = [];
    availableCustomFieldsClone: any[] = []

    indexingFormGroup: FormGroup;

    arrFormControl: any = {};

    currentCategory: string = '';
    currentPriorityColor: string = '';

    constructor(
        public http: HttpClient,
        private notify: NotificationService,
        public dialog: MatDialog,
        private headerService: HeaderService,
        public appService: AppService,
    ) {

    }

    ngOnInit(): void {
        this.adminMode === undefined ? this.adminMode = false : this.adminMode = true;

        this.availableFieldsClone = JSON.parse(JSON.stringify(this.availableFields));

        this.fieldCategories.forEach(category => {
            this['indexingModels_' + category] = [];
        });

        if (this.indexingFormId <= 0 || this.indexingFormId === undefined) {
            this.http.get("../../rest/customFields").pipe(
                tap((data: any) => {
                    this.availableCustomFields = data.customFields.map((info: any) => {
                        info.identifier = 'indexingCustomField_' + info.id;
                        info.system = false;
                        info.values = info.values.length > 0 ? info.values.map((custVal: any) => {
                            return {
                                id: custVal,
                                label: custVal
                            }
                        }) : info.values;
                        return info;
                    });
                    this.fieldCategories.forEach(element => {
                        this['indexingModels_' + element] = this.indexingModelsCore.filter((x: any, i: any, a: any) => x.unit === element);
                        this['indexingModels_' + element].forEach((field: any) => {
                            this.initValidator(field);
                        });
                    });
                    this.initElemForm();
                }),
                catchError((err: any) => {
                    this.notify.handleErrors(err);
                    return of(false);
                })
            ).subscribe();
        } else {
            this.loadForm(this.indexingFormId);
        }
    }

    drop(event: CdkDragDrop<string[]>) {
        event.item.data.unit = event.container.id.split('_')[1];

        if (event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        } else {
            this.initValidator(event.item.data);
            transferArrayItem(event.previousContainer.data,
                event.container.data,
                event.previousIndex,
                event.currentIndex);
            this.initElemForm();
        }
    }

    onSubmit() {
        let arrIndexingModels: any[] = [];
        this.fieldCategories.forEach(category => {
            arrIndexingModels = arrIndexingModels.concat(this['indexingModels_' + category]);
        });
    }

    removeItem(arrTarget: string, item: any, index: number) {
        item.mandatory = false;
        if (item.identifier.indexOf('indexingCustomField') > -1) {
            this.availableCustomFields.push(item);
            this[arrTarget].splice(index, 1);
        } else {
            this.availableFields.push(item);
            this[arrTarget].splice(index, 1);
        }
    }

    getDatas() {
        let arrIndexingModels: any[] = [];
        this.fieldCategories.forEach(category => {
            arrIndexingModels = arrIndexingModels.concat(this['indexingModels_' + category]);
        });
        arrIndexingModels.forEach(element => {
            if (element.today === true) {
                element.default_value = '_TODAY';
            } else {
                element.default_value = this.arrFormControl[element.identifier].value;
            }
        });
        return arrIndexingModels;
    }

    getAvailableFields() {
        return this.availableFields;
    }

    getAvailableCustomFields() {
        return this.availableCustomFields;
    }

    isModified() {
        let state = false;
        let compare: string = '';
        let compareClone: string = '';

        this.fieldCategories.forEach(category => {

            compare = JSON.stringify((this['indexingModels_' + category]));
            compareClone = JSON.stringify((this['indexingModels_' + category + 'Clone']));

            if (compare !== compareClone) {
                state = true;
            }
        });
        return state;
    }

    setModification() {
        this.fieldCategories.forEach(element => {
            this['indexingModels_' + element + 'Clone'] = JSON.parse(JSON.stringify(this['indexingModels_' + element]));
        });
    }

    cancelModification() {
        this.fieldCategories.forEach(element => {
            this['indexingModels_' + element] = JSON.parse(JSON.stringify(this['indexingModels_' + element + 'Clone']));
        });
    }

    initElemForm() {
        this.loading = true;

        const myObservable = of(42);

        myObservable.pipe(
            exhaustMap(() => this.initializeRoutes()),
            tap((data) => {
                this.arrFormControl['mail­tracking'].setValue(false);
                this.currentPriorityColor = '';

                this.fieldCategories.forEach(element => {
                    this['indexingModels_' + element].forEach((elem: any) => {
                        if (elem.identifier === 'docDate') {
                            elem.startDate = '';
                            elem.endDate = '_TODAY';

                        } else if (elem.identifier === 'destination') {
                            if (this.adminMode) {
                                let title = '';
                                elem.values = data.entities.map((entity: any) => {
                                    title = entity.entity_label;

                                    for (let index = 0; index < entity.level; index++) {
                                        entity.entity_label = '&nbsp;&nbsp;&nbsp;&nbsp;' + entity.entity_label;
                                    }
                                    return {
                                        id: entity.id,
                                        title: title,
                                        label: entity.entity_label,
                                        disabled: false
                                    }
                                });

                            } else {
                                let title = '';

                                let defaultVal = data.entities.filter((entity: any) => entity.enabled === true && entity.id === elem.default_value);
                                elem.default_value = defaultVal.length > 0 ? defaultVal[0].id : '';
                                this.arrFormControl[elem.identifier].setValue(defaultVal.length > 0 ? defaultVal[0].id : '');

                                elem.values = data.entities.map((entity: any) => {
                                    title = entity.entity_label;

                                    for (let index = 0; index < entity.level; index++) {
                                        entity.entity_label = '&nbsp;&nbsp;&nbsp;&nbsp;' + entity.entity_label;
                                    }
                                    return {
                                        id: entity.id,
                                        title: title,
                                        label: entity.entity_label,
                                        disabled: !entity.enabled
                                    }
                                });
                            }
                        } else if (elem.identifier === 'arrivalDate') {
                            elem.startDate = 'docDate';
                            elem.endDate = '_TODAY';

                        } else if (elem.identifier === 'initiator' && !this.adminMode) {
                            elem.values = this.headerService.user.entities.map((entity: any) => {
                                return {
                                    id: entity.id,
                                    label: entity.entity_label
                                }
                            });

                        } else if (elem.identifier === 'processLimitDate') {
                            elem.startDate = '_TODAY';
                            elem.endDate = '';

                        } else if (elem.identifier === 'category_id') {
                            elem.values = data.categories;

                        } else if (elem.identifier === 'priority') {
                            elem.event = 'setPriorityColor';
                            elem.values = data.priorities;
                        } else if (elem.identifier === 'doctype') {
                            let title = '';
                            let arrValues: any[] = [];
                            data.structure.forEach((doctype: any) => {
                                if (doctype['doctypes_second_level_id'] === undefined) {
                                    arrValues.push({
                                        id: doctype.doctypes_first_level_id,
                                        label: doctype.doctypes_first_level_label,
                                        title: doctype.doctypes_first_level_label,
                                        disabled: true,
                                        isTitle: true,
                                        color: doctype.css_style
                                    });
                                } else if (doctype['description'] === undefined) {
                                    arrValues.push({
                                        id: doctype.doctypes_second_level_id,
                                        label: '&nbsp;&nbsp;&nbsp;&nbsp;' + doctype.doctypes_second_level_label,
                                        title: doctype.doctypes_second_level_label,
                                        disabled: true,
                                        isTitle: true,
                                        color: doctype.css_style
                                    });

                                    arrValues = arrValues.concat(data.structure.filter((info: any) => info.doctypes_second_level_id === doctype.doctypes_second_level_id && info.description !== undefined).map((info: any) => {
                                        return {
                                            id: info.type_id,
                                            label: '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + info.description,
                                            title: info.description,
                                            disabled: false,
                                            isTitle: false,
                                        }
                                    }));
                                }
                            });
                            elem.values = arrValues;
                            elem.event = 'calcLimitDate';
                        }
                    });
                });
            }),
            finalize(() => this.loading = false)
        ).subscribe();

    }

    initializeRoutes() {
        let arrayRoutes: any = [];
        let mergedRoutesDatas: any = {};

        this.fieldCategories.forEach(element => {
            this['indexingModels_' + element].forEach((elem: any) => {
                if (elem.identifier === 'destination') {
                    if (this.adminMode) {
                        arrayRoutes.push(this.http.get('../../rest/indexingModels/entities'));

                    } else {
                        arrayRoutes.push(this.http.get('../../rest/indexing/' + this.groupId + '/entities'));
                    }
                } else if (elem.identifier === 'category_id') {
                    arrayRoutes.push(this.http.get('../../rest/categories'));

                } else if (elem.identifier === 'priority') {
                    arrayRoutes.push(this.http.get('../../rest/priorities'));

                } else if (elem.identifier === 'doctype') {
                    arrayRoutes.push(this.http.get('../../rest/doctypes'));
                }
            });
        });
        return forkJoin(arrayRoutes).pipe(
            map(data => {
                let objectId = '';
                let index = '';
                for (var key in data) {

                    index = key;

                    objectId = Object.keys(data[key])[0];

                    mergedRoutesDatas[Object.keys(data[key])[0]] = data[index][objectId]
                }
                return mergedRoutesDatas;
            })
        )
    }



    createForm() {
        this.indexingFormGroup = new FormGroup(this.arrFormControl);
    }

    loadForm(indexModelId: number) {

        Object.keys(this.arrFormControl).forEach(element => {
            delete this.arrFormControl[element];
        });

        this.loading = true;

        this.availableFields = JSON.parse(JSON.stringify(this.availableFieldsClone));

        this.arrFormControl['mail­tracking'] = new FormControl({ value: '', disabled: this.adminMode ? true : false });

        this.fieldCategories.forEach(category => {
            this['indexingModels_' + category] = [];
        });

        this.http.get("../../rest/customFields").pipe(
            tap((data: any) => {
                this.availableCustomFields = data.customFields.map((info: any) => {
                    info.identifier = 'indexingCustomField_' + info.id;
                    info.system = false;
                    info.values = info.values.length > 0 ? info.values.map((custVal: any) => {
                        return {
                            id: custVal,
                            label: custVal
                        }
                    }) : info.values;
                    return info;
                });
            }),
            exhaustMap((data) => this.http.get("../../rest/indexingModels/" + indexModelId)),
            tap((data: any) => {

                this.currentCategory = data.indexingModel.category;
                let fieldExist: boolean;
                if (data.indexingModel.fields.length === 0) {
                    this.fieldCategories.forEach(element => {
                        this['indexingModels_' + element] = this.indexingModelsCore.filter((x: any, i: any, a: any) => x.unit === element);
                        this.indexingModelsCore.forEach(field => {
                            this.initValidator(field);
                        });
                    });
                    this.notify.error(this.lang.noFieldInModelMsg);
                } else {
                    data.indexingModel.fields.forEach((field: any) => {
                        fieldExist = false;
                        field.system = false;
                        field.values = [];

                        let indexFound = this.availableFields.map(avField => avField.identifier).indexOf(field.identifier);

                        if (indexFound > -1) {
                            field.label = this.availableFields[indexFound].label;
                            field.values = this.availableFields[indexFound].values;
                            field.type = this.availableFields[indexFound].type;
                            this.availableFields.splice(indexFound, 1);
                            fieldExist = true;
                        }

                        indexFound = this.availableCustomFields.map(avField => avField.identifier).indexOf(field.identifier);

                        if (indexFound > -1) {
                            field.label = this.availableCustomFields[indexFound].label;
                            field.values = this.availableCustomFields[indexFound].values;
                            field.type = this.availableCustomFields[indexFound].type;
                            this.availableCustomFields.splice(indexFound, 1);
                            fieldExist = true;
                        }

                        indexFound = this.indexingModelsCore.map(info => info.identifier).indexOf(field.identifier);

                        if (indexFound > -1) {
                            field.label = this.indexingModelsCore[indexFound].label;
                            field.values = this.indexingModelsCore[indexFound].values;
                            field.type = this.indexingModelsCore[indexFound].type;
                            fieldExist = true;
                            field.system = true;
                        }

                        if (field.type === 'date' && field.default_value === '_TODAY') {
                            field.today = true;
                            field.default_value = new Date();
                        }

                        if (fieldExist) {
                            this['indexingModels_' + field.unit].push(field);
                            this.initValidator(field);
                        } else {
                            this.notify.error(this.lang.fieldNotExist + ': ' + field.identifier);
                        }

                    });
                }

                this.initElemForm();
                this.createForm();
            }),
            catchError((err: any) => {
                this.notify.handleErrors(err);
                return of(false);
            })
        ).subscribe();
    }

    initValidator(field: any) {
        let valArr: ValidatorFn[] = [];

        this.arrFormControl[field.identifier] = new FormControl({ value: field.default_value, disabled: (field.today && this.adminMode) ? true : false });

        if (field.type === 'integer') {
            valArr.push(this.regexValidator(new RegExp('[+-]?([0-9]*[.])?[0-9]+'), { 'floatNumber': '' }));
        }

        if (field.mandatory && !this.adminMode) {
            valArr.push(Validators.required);
        }

        this.arrFormControl[field.identifier].setValidators(valArr);
    }

    regexValidator(regex: RegExp, error: ValidationErrors): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } => {
            if (!control.value) {
                return null;
            }
            const valid = regex.test(control.value);
            return valid ? null : error;
        };
    }

    isValidForm() {
        if (!this.indexingFormGroup.valid) {
            Object.keys(this.indexingFormGroup.controls).forEach(key => {

                const controlErrors: ValidationErrors = this.indexingFormGroup.get(key).errors;
                if (controlErrors != null) {
                    this.indexingFormGroup.controls[key].markAsTouched();
                    /*Object.keys(controlErrors).forEach(keyError => {
                        console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
                    });*/
                }
            });
        }
        return this.indexingFormGroup.valid;
    }

    getMinDate(id: string) {
        if (this.arrFormControl[id] !== undefined) {
            return this.arrFormControl[id].value;
        } else if (id === '_TODAY') {
            return new Date();
        } else {
            return '';
        }
    }

    getMaxDate(id: string) {
        if (this.arrFormControl[id] !== undefined) {
            return this.arrFormControl[id].value;
        } else if (id === '_TODAY') {
            return new Date();
        } else {
            return '';
        }
    }

    toggleTodayDate(field: any) {
        field.today = !field.today;
        if (field.today) {
            this.arrFormControl[field.identifier].disable();
            this.arrFormControl[field.identifier].setValue(new Date());
        } else {
            this.arrFormControl[field.identifier].setValue('');
            this.arrFormControl[field.identifier].enable();
        }
    }

    launchEvent(value: any, field: any) {
        this[field.event](field, value);
    }

    calcLimitDate(field: any, value: any) {

        if (this.arrFormControl['processLimitDate'] !== undefined) {
            this.http.get("../../rest/indexing/processLimitDate", { params: { "doctype": value } }).pipe(
                tap((data: any) => {
                    const limitDate = new Date(data.processLimitDate);
                    this.arrFormControl['processLimitDate'].setValue(limitDate);
                }),
                catchError((err: any) => {
                    this.notify.handleErrors(err);
                    return of(false);
                })
            ).subscribe();
        }
    }

    toggleMailTracking() {
        this.arrFormControl['mail­tracking'].setValue(!this.arrFormControl['mail­tracking'].value);
    }

    setPriorityColor(field: any, value: any) {
        this.currentPriorityColor = field.values.filter((fieldVal: any) => fieldVal.id === value).map((fieldVal: any) => fieldVal.color)[0];
    }

    changeCategory(categoryId: string) {
        this.currentCategory = categoryId;
    }
}