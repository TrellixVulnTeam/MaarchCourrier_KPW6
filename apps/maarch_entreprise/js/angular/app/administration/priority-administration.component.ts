import { Component, OnInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { LANG } from '../translate.component';
import { NotificationService } from '../notification.service';

declare function $j(selector: any) : any;

declare var angularGlobals : any;


@Component({
    templateUrl : angularGlobals["priority-administrationView"],
    providers   : [NotificationService]
})
export class PriorityAdministrationComponent implements OnInit {

    coreUrl         : string;
    id              : string;
    creationMode    : boolean;
    lang            : any       = LANG;
    loading         : boolean   = false;

    priority        : any       = {
        working_days    : false
    };

    constructor(public http: HttpClient, private route: ActivatedRoute, private router: Router, private notify: NotificationService) {
    }

    updateBreadcrumb(applicationName: string) {
        if ($j('#ariane')[0]) {
            $j('#ariane')[0].innerHTML = "<a href='index.php?reinit=true'>" + applicationName + "</a> > <a onclick='location.hash = \"/administration\"' style='cursor: pointer'>Administration</a> > <a onclick='location.hash = \"/administration/priorities\"' style='cursor: pointer'>Priorités</a>";
        }
    }

    ngOnInit(): void {
        this.updateBreadcrumb(angularGlobals.applicationName);
        this.coreUrl = angularGlobals.coreUrl;

        this.loading = true;

        this.route.params.subscribe((params) => {
            if (typeof params['id'] == "undefined") {
                this.creationMode = true;
                this.loading = false;
            } else {
                this.creationMode = false;
                this.id = params['id'];
                this.http.get(this.coreUrl + "rest/priorities/" + this.id)
                    .subscribe((data : any) => {
                        this.priority = data.priority;

                        this.loading = false;
                    }, () => {
                        location.href = "index.php";
                    });
            }
        });
    }

    onSubmit(){
        if (this.creationMode) {
            this.http.post(this.coreUrl + "rest/priorities", this.priority)
                .subscribe(() => {
                    this.notify.success(this.lang.priorityAdded);
                    this.router.navigate(["/administration/priorities"]);
                }, (err) => {
                    this.notify.error(err.error.errors);
                });
        } else {
            this.http.put(this.coreUrl + "rest/priorities/" + this.id, this.priority)
                .subscribe(() => {
                    this.notify.success(this.lang.priorityUpdated);
                    this.router.navigate(["/administration/priorities"]);
                }, (err) => {
                    this.notify.error(err.error.errors);
                });
        }
    }

}