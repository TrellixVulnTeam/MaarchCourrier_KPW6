import { Component, OnInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { LANG } from '../translate.component';
import { NotificationService } from '../notification.service';

declare function $j(selector: any) : any;

declare var angularGlobals : any;

@Component({
    templateUrl : angularGlobals['parameter-administrationView'],
    styleUrls   : [],
    providers   : [NotificationService]
})
export class ParameterAdministrationComponent implements OnInit {
    coreUrl                 : string;

    lang                    : any       = LANG;
    _search                 : string    = '';
    creationMode            : boolean;

    type                    : string;
    parameter               : any           = {};
    paramDateTemp           : string;

    loading                 : boolean       = false;

    constructor(public http: HttpClient, private route: ActivatedRoute, private router: Router, private notify: NotificationService) {
    }

    prepareParameter() {
        $j('#inner_content').remove();
    }

    updateBreadcrumb(applicationName: string) {
        var breadCrumb = "<a href='index.php?reinit=true'>" + applicationName + "</a> > <a onclick='location.hash = \"/administration\"' style='cursor: pointer'>"+this.lang.administration+"</a> > <a onclick='location.hash = \"/administration/parameters\"' style='cursor: pointer'>"+this.lang.parameters+"</a> > ";

        if(this.creationMode == true){
            breadCrumb += this.lang.parameterCreation;
        } else {
            breadCrumb += this.lang.parameterModification;
        }
        $j('#ariane')[0].innerHTML = breadCrumb;
    }
    ngOnInit(): void {
        this.loading = true;
        this.coreUrl = angularGlobals.coreUrl;

        this.route.params.subscribe((params) => {
            if (typeof params['id'] == "undefined"){
                this.creationMode = true;

                this.http.get(this.coreUrl + 'rest/administration/parameters/new')
                    .subscribe((data : any) => {
                        this.type = 'string';
                        this.updateBreadcrumb(angularGlobals.applicationName);
                        this.loading = false;

                    }, () => {
                        location.href = "index.php";
                    });
            } else {
                this.creationMode = false;
                this.http.get(this.coreUrl + 'rest/administration/parameters/'+params['id'])
                    .subscribe((data : any) => {
                        this.parameter = data.parameter;
                        this.type = data.type;
                        this.updateBreadcrumb(angularGlobals.applicationName);
                        this.loading = false;

                    }, () => {
                        location.href = "index.php";
                    }); 
            }
        });
               
    }

    onSubmit() {
        if(this.type=='date'){
            this.parameter.param_value_int=null;
            this.parameter.param_value_string=null;
        }
        else if(this.type == 'int'){
            this.parameter.param_value_date=null;
            this.parameter.param_value_string=null;
        }
        else if (this.type == 'string'){
            this.parameter.param_value_date=null;
            this.parameter.param_value_int=null;
        }

        if(this.creationMode == true){
            this.http.post(this.coreUrl + 'rest/parameters', this.parameter)
            .subscribe((data : any) => {
                this.router.navigate(['administration/parameters']);
                this.notify.success(this.lang.parameterAdded+' « '+this.parameter.id+' »');
                
            },(err) => {
                this.notify.error(err.error.errors);
            });
        } else if(this.creationMode == false){
            this.http.put(this.coreUrl+'rest/parameters/'+this.parameter.id,this.parameter)
            .subscribe((data : any) => {
                this.router.navigate(['administration/parameters']);
                this.notify.success(this.lang.parameterUpdated+' « '+this.parameter.id+' »');                     
            },(err) => {
                this.notify.error(err.error.errors);
            });
        }
    }
}
