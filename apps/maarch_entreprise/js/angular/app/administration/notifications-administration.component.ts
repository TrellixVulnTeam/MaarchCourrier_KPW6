import { ChangeDetectorRef, Component, ViewChild, OnInit } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { HttpClient } from '@angular/common/http';
import { LANG } from '../translate.component';
import { NotificationService } from '../notification.service';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';


declare function $j(selector: any): any;

declare var angularGlobals: any;


@Component({
    templateUrl: "../../../../Views/notifications-administration.component.html",
    providers: [NotificationService]
})
export class NotificationsAdministrationComponent implements OnInit {
    mobileQuery: MediaQueryList;
    private _mobileQueryListener: () => void;
    coreUrl: string;

    notifications: any[] = [];
    loading: boolean = false;
    lang: any = LANG;

    displayedColumns = ['notification_id', 'description', 'is_enabled', 'notifications'];
    dataSource = new MatTableDataSource(this.notifications);
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    applyFilter(filterValue: string) {
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
        this.dataSource.filter = filterValue;
    }

    constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, public http: HttpClient, private notify: NotificationService) {
        $j("link[href='merged_css.php']").remove();
        this.mobileQuery = media.matchMedia('(max-width: 768px)');
        this._mobileQueryListener = () => changeDetectorRef.detectChanges();
        this.mobileQuery.addListener(this._mobileQueryListener);
    }

    ngOnDestroy(): void {
        this.mobileQuery.removeListener(this._mobileQueryListener);
    }

    ngOnInit(): void {
        this.updateBreadcrumb(angularGlobals.applicationName);

        this.coreUrl = angularGlobals.coreUrl;
        this.loading = true;

        this.http.get(this.coreUrl + 'rest/notifications')
            .subscribe((data: any) => {
                this.notifications = data.notifications;
                this.loading = false;
                setTimeout(() => {
                    this.dataSource = new MatTableDataSource(this.notifications);
                    this.dataSource.paginator = this.paginator;
                    this.dataSource.sort = this.sort;
                }, 0);
            }, (err) => {
                this.notify.error(err.error.errors);
            });
    }

    updateBreadcrumb(applicationName: string) {
        if ($j('#ariane')[0]) {
            $j('#ariane')[0].innerHTML = "<a href='index.php?reinit=true'>" + applicationName + "</a> > <a onclick='location.hash = \"/administration\"' style='cursor: pointer'>" + this.lang.administration + "</a> > " + this.lang.notifications;
        }
    }

    deleteNotification(notification: any) {
        let r = confirm(this.lang.deleteMsg);

        if (r) {
            this.http.delete(this.coreUrl + 'rest/notifications/' + notification.notification_sid)
                .subscribe((data: any) => {
                    this.notifications = data.notifications;
                    setTimeout(() => {
                        this.dataSource = new MatTableDataSource(this.notifications);
                        this.dataSource.paginator = this.paginator;
                        this.dataSource.sort = this.sort;
                    }, 0);
                    this.notify.success(this.lang.notificationDeleted);
                }, (err) => {
                    this.notify.error(err.error.errors);
                });
        }
    }
}
