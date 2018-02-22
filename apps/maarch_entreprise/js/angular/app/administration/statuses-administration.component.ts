import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { LANG } from '../translate.component';
import { NotificationService } from '../notification.service';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';

declare function $j(selector: any): any;

declare var angularGlobals: any;

@Component({
    templateUrl: angularGlobals['statuses-administrationView'],
    styleUrls: [],
    providers: [NotificationService]
})
export class StatusesAdministrationComponent implements OnInit {
    mobileQuery: MediaQueryList;
    private _mobileQueryListener: () => void;
    coreUrl: string;
    lang: any = LANG;

    nbStatus: number;
    statuses: Status[] = [];

    loading: boolean = false;

    displayedColumns = ['img_filename', 'id', 'label_status', 'identifier'];
    dataSource = new MatTableDataSource(this.statuses);
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
        this.coreUrl = angularGlobals.coreUrl;

        this.prepareStatus();

        this.loading = true;

        this.http.get(this.coreUrl + 'rest/statuses')
            .subscribe((data: any) => {
                this.statuses = data.statuses;
                this.updateBreadcrumb(angularGlobals.applicationName);
                this.loading = false;
                setTimeout(() => {
                    this.dataSource = new MatTableDataSource(this.statuses);
                    this.dataSource.paginator = this.paginator;
                    this.dataSource.sort = this.sort;
                }, 0);

            }, (err) => {
                this.notify.error(err.error.errors);
            });
    }

    prepareStatus() {
        $j('#inner_content').remove();
    }

    updateBreadcrumb(applicationName: string) {
        $j('#ariane')[0].innerHTML = "<a href='index.php?reinit=true'>" + applicationName + "</a> > " +
            "<a onclick='location.hash = \"/administration\"' style='cursor: pointer'>" + this.lang.administration + "</a> > " + this.lang.statuses;
    }

    deleteStatus(status: any) {
        var resp = confirm(this.lang.confirmAction + ' ' + this.lang.delete + ' « ' + status.id + ' »');
        if (resp) {
            this.http.delete(this.coreUrl + 'rest/statuses/' + status.identifier)
                .subscribe((data: any) => {
                    this.statuses = data.statuses;
                    this.notify.success(this.lang.statusDeleted);

                }, (err) => {
                    this.notify.error(err.error.errors);
                });
        }
    }

}

export interface Status {
    id: string;
    can_be_modified: string;
    can_be_searchead: string;
    identifier: number;
    img_filename: string;
    is_folder_status: string;
    is_system: string;
    label_status: string;
    maarch_module: string;
}