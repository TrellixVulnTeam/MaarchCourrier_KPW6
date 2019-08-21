import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LANG } from '../../translate.component';
import { NotificationService } from '../../notification.service';
import { HeaderService }        from '../../../service/header.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSidenav } from '@angular/material/sidenav';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AppService } from '../../../service/app.service';

declare function $j(selector: any): any;

@Component({
    templateUrl: "shippings-administration.component.html",
    providers: [NotificationService, AppService]
})
export class ShippingsAdministrationComponent implements OnInit {

    @ViewChild('snav', { static: true }) public  sidenavLeft   : MatSidenav;
    @ViewChild('snav2', { static: true }) public sidenavRight  : MatSidenav;
    
    lang: any = LANG;

    shippings: any[] = [];

    loading: boolean = false;

    displayedColumns = ['label', 'description', 'accountid', 'actions'];
    dataSource: any;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;


    constructor(
        public http: HttpClient, 
        private notify: NotificationService, 
        private headerService: HeaderService,
        public appService: AppService
    ) {
        $j("link[href='merged_css.php']").remove();
    }

    applyFilter(filterValue: string) {
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
        this.dataSource.filter = filterValue;
    }

    ngOnInit(): void {
        this.headerService.setHeader(this.lang.administration + ' ' + this.lang.shippings);
        window['MainHeaderComponent'].setSnav(this.sidenavLeft);
        window['MainHeaderComponent'].setSnavRight(null);

        this.loading = true;

        this.http.get('../../rest/administration/shippings')
            .subscribe((data: any) => {
                this.shippings = data.shippings;

                setTimeout(() => {
                    this.dataSource = new MatTableDataSource(this.shippings);
                    this.dataSource.paginator = this.paginator;
                    this.dataSource.sort = this.sort;
                }, 0);
                this.loading = false;
            });
    }

    deleteShipping(id: number) {
        let r = confirm(this.lang.deleteMsg);

        if (r) {
            this.http.delete('../../rest/administration/shippings/' + id)
                .subscribe((data: any) => {
                    this.shippings = data.shippings;
                    this.dataSource = new MatTableDataSource(this.shippings);
                    this.dataSource.paginator = this.paginator;
                    this.dataSource.sort = this.sort;
                    this.notify.success(this.lang.shippingDeleted);
                }, (err) => {
                    this.notify.error(err.error.errors);
                });
        }
    }
}
