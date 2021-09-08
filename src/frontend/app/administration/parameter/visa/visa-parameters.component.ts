import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { tap, catchError, debounceTime } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from '@service/notification/notification.service';
import {FunctionsService} from '@service/functions.service';

@Component({
    selector: 'app-visa-parameters',
    templateUrl: './visa-parameters.component.html',
})

export class VisaParametersComponent implements OnInit {
    visaParameters: FormGroup;

    constructor(
        public translate: TranslateService,
        public http: HttpClient,
        private _formBuilder: FormBuilder,
        private notify: NotificationService,
        private functions: FunctionsService
    ) {
        this.visaParameters = this._formBuilder.group({
            minimumVisaRole: ['', [Validators.required, Validators.max(50)]],
            maximumSignRole: ['', [Validators.required, Validators.max(50)]],
            workflowEndBySignatory: ['']
        });
    }

    async ngOnInit(): Promise<void> {
        await this.getFinalAction();
    }

    getFinalAction() {
        return new Promise((resolve) => {
            this.http.get('../rest/parameters').pipe(
                tap((data: any) => {
                    let parameter = data.parameters.filter((item: { id: any }) => item.id === 'minimumVisaRole')[0];
                    this.visaParameters.controls['minimumVisaRole'].setValue(this.functions.empty(parameter) ? 0 : parameter.param_value_int);

                    if (this.visaParameters.controls['minimumVisaRole'].value === 0) {
                        this.visaParameters.controls['minimumVisaRole'].disable();
                    } else {
                        this.visaParameters.controls['minimumVisaRole'].enable();
                    }

                    parameter = data.parameters.filter((item: { id: any }) => item.id === 'maximumSignRole')[0];
                    this.visaParameters.controls['maximumSignRole'].setValue(this.functions.empty(parameter) ? 0 : parameter.param_value_int);

                    if (this.visaParameters.controls['maximumSignRole'].value === 0) {
                        this.visaParameters.controls['maximumSignRole'].disable();
                    } else {
                        this.visaParameters.controls['maximumSignRole'].enable();
                    }

                    parameter = data.parameters.filter((item: { id: any }) => item.id === 'workflowEndBySignatory')[0];
                    this.visaParameters.controls['workflowEndBySignatory'].setValue(this.functions.empty(parameter) ? 0 : parameter.param_value_int);

                    setTimeout(() => {
                        this.visaParameters.controls['minimumVisaRole'].valueChanges.pipe(
                            debounceTime(200),
                            tap(() => this.saveParameter('minimumVisaRole'))
                        ).subscribe();

                        this.visaParameters.controls['maximumSignRole'].valueChanges.pipe(
                            debounceTime(200),
                            tap(() => this.saveParameter('maximumSignRole'))
                        ).subscribe();

                        this.visaParameters.controls['workflowEndBySignatory'].valueChanges.pipe(
                            debounceTime(200),
                            tap(() => this.saveParameter('workflowEndBySignatory'))
                        ).subscribe();
                    });
                    resolve(true);
                }),
                catchError((err: any) => {
                    this.notify.handleSoftErrors(err);
                    return of(false);
                })
            ).subscribe();
        });
    }

    saveParameter(id: string) {
        if (Number.isSafeInteger(this.visaParameters.controls[id].value)) {
            if (Math.sign(this.visaParameters.controls[id].value) !== -1) {
                if (!this.visaParameters.get(id).hasError('max')) {
                    this.http.put('../rest/parameters/' + id, {
                        param_value_int : Math.abs(this.visaParameters.controls[id].value)
                    })
                        .subscribe(() => {
                            this.notify.success(this.translate.instant('lang.parameterUpdated'));
                        }, (err) => {
                            this.notify.error(err.error.errors);
                        });
                }
            } else {
                this.visaParameters.controls[id].setValue(Math.abs(this.visaParameters.controls[id].value));
            }
        }
    }

    toggle(id: string) {
        const currentValue = this.visaParameters.controls[id].value;
        const newValue = currentValue === 0 ? 1 : 0;
        if (newValue === 0) {
            this.visaParameters.controls[id].disable();
        } else {
            this.visaParameters.controls[id].enable();
        }
        this.visaParameters.controls[id].setValue(newValue);
    }
}
