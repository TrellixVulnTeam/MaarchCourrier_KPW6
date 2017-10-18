import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LANG } from '../translate.component';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '../notification.service';

declare function $j(selector: any) : any;

declare var angularGlobals : any;

@Component({
    templateUrl : angularGlobals["notification-administrationView"],
    styleUrls   : ['../../node_modules/bootstrap/dist/css/bootstrap.min.css'],
    providers   : [NotificationService]
})
export class NotificationAdministrationComponent implements OnInit {

    coreUrl             : string;

    creationMode        : boolean;
    notification        : any       = {
        diffusionType_label  : null
    };
    loading              : boolean   = false;
    lang                 : any       = LANG;


    constructor(public http: HttpClient, private route: ActivatedRoute, private router: Router, private notify: NotificationService) {
    }

    updateBreadcrumb(applicationName: string){
        if ($j('#ariane')[0]) {
            $j('#ariane')[0].innerHTML = "<a href='index.php?reinit=true'>" + applicationName + "</a> > <a onclick='location.hash = \"/administration\"' style='cursor: pointer'>Administration</a> > <a onclick='location.hash = \"/administration/notifications\"' style='cursor: pointer'>notifications</a>";
        }
    }

    ngOnInit(): void {
        this.updateBreadcrumb(angularGlobals.applicationName);
        this.loading = true;
        this.coreUrl = angularGlobals.coreUrl;

        this.route.params.subscribe(params => {
            if (typeof params['identifier'] == "undefined") {
                this.creationMode = true;
                this.http.get(this.coreUrl + 'rest/administration/notifications/new')
                    .subscribe((data : any) => {
                        this.notification = data.notification;
                                    
                        this.loading = false;
                    }, (err) => {
                        this.notify.error(err.error.errors);
                    });
            } else {
                this.creationMode = false;
                this.http.get(this.coreUrl + 'rest/administration/notifications/' + params['identifier'])
                    .subscribe((data : any) => {
            
                        this.notification = data.notification;
                        this.loading = false;
                    }, (err) => {
                        this.notify.error(err.error.errors);
                    });
            } 
        });
    }

    selectAll(event: any) {
        var target = event.target.getAttribute("data-target");
        $j('#' + target + ' option').prop('selected', true);
        $j('#' + target).trigger('chosen:updated');
    }

    unselectAll(event: any) {
        var target = event.target.getAttribute("data-target");
        $j('#' + target + ' option').prop('selected', false);
        $j('#' + target).trigger('chosen:updated');
    }

    onSubmit() {
        if ($j("#groupslist").val()) {
            this.notification.diffusion_properties = $j("#groupslist").val();
        } else if($j("#entitieslist").val()) {
            this.notification.diffusion_properties = $j("#entitieslist").val();
        } else if($j("#statuseslist").val()) {
            this.notification.diffusion_properties = $j("#statuseslist").val();
        } else if($j("#userslist").val()) {
            this.notification.diffusion_properties = $j("#userslist").val();
        }
        if ($j("#joinDocJd").val() == null) {
            this.notification.attachfor_properties = '';
        } else if ($j("#groupslistJd").val()) {
            this.notification.attachfor_properties = $j("#groupslistJd").val();
        } else if($j("#entitieslistJd").val()) {
            this.notification.attachfor_properties = $j("#entitieslistJd").val();
        } else if($j("#statuseslistJd").val()) {
            this.notification.attachfor_properties = $j("#statuseslistJd").val();
        } else if($j("#userslistJd").val()) {
            this.notification.attachfor_properties = $j("#userslistJd").val();
        }

        if (this.creationMode) {
            this.http.post(this.coreUrl + 'rest/notifications', this.notification)
                .subscribe((data : any) => {
                    this.router.navigate(['/administration/notifications']);
                    this.notify.success(this.lang.newNotificationAdded+' « '+this.notification.notification_id+' »');
                },(err) => {
                    this.notify.error(err.error.errors);
                });
        } else {
            this.http.put(this.coreUrl + 'rest/notifications/' + this.notification.notification_sid, this.notification)
                .subscribe((data : any) => {
                    this.router.navigate(['/administration/notifications']);
                    this.notify.success(this.lang.notificationUpdated+' « '+this.notification.notification_id+' »');
                },(err) => {
                    this.notify.error(err.error.errors);
                });
        }
    }
}
