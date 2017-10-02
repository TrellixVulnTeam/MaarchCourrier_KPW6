import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LANG } from '../translate.component';
import { NotificationService } from '../notification.service';

declare function $j(selector: any) : any;
declare function successNotification(message: string) : void;
declare function errorNotification(message: string) : void;

declare var angularGlobals : any;

@Component({
    templateUrl : angularGlobals["notifications-administrationView"],
    styleUrls   : ['../../node_modules/bootstrap/dist/css/bootstrap.min.css'],
    providers   : [NotificationService]
})
export class NotificationsAdministrationComponent implements OnInit {

    coreUrl                     : string;
    notifications               : any[] = [];
    loading                     : boolean   = false;
    lang                        : any       = LANG;


    constructor(public http: HttpClient, private notify: NotificationService) {
    }

    ngOnInit(): void {
        this.coreUrl = angularGlobals.coreUrl;

        this.prepareNotifications();

        this.loading = true;

        this.http.get(this.coreUrl + 'rest/notifications')
            .subscribe((data : any) => {
                this.notifications = data.notifications;
                this.updateBreadcrumb(angularGlobals.applicationName);              
                this.loading = false;
            }, (err) => {
                errorNotification(JSON.parse(err._body).errors);
            });
    }

    prepareNotifications() {
        $j('#inner_content').remove();
    }

    updateBreadcrumb(applicationName: string){
        $j('#ariane')[0].innerHTML = "<a href='index.php?reinit=true'>" + applicationName + "</a> > "+
                                            "<a onclick='location.hash = \"/administration\"' style='cursor: pointer'>" + this.lang.administration + "</a> > " + this.lang.admin_notifications;
    }

    deleteNotification(notification : any){
        var resp = confirm(this.lang.deleteMsg + " ?");
        if(resp){
            this.http.delete(this.coreUrl + 'rest/notifications/'+notification.notification_sid)
                .subscribe((data : any) => {
                    this.notifications = data.notifications
                    this.notify.success(data.success);
                }, (err) => {
                    this.notify.error(err.error.errors);
                });
        }
    }

}
