import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LANG } from '../../translate.component';
import { NotificationService } from '../../notification.service';
import { MatPaginator, MatTableDataSource, MatSort, MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSidenav } from '@angular/material';
import { HeaderService } from '../../../service/header.service';
import { AppService } from '../../../service/app.service';

declare function $j(selector: any): any;

@Component({
    templateUrl: "groups-administration.component.html",
    providers: [NotificationService, AppService]
})
export class GroupsAdministrationComponent implements OnInit {
    /*HEADER*/
    @ViewChild('snav') public  sidenavLeft   : MatSidenav;
    @ViewChild('snav2') public sidenavRight  : MatSidenav;
    
    dialogRef                       : MatDialogRef<any>;

    lang                            : any       = LANG;
    loading                         : boolean   = false;

    config                          : any       = {};
    groups                          : any[]     = [];
    groupsForAssign                 : any[]     = [];


    displayedColumns    = ['group_id', 'group_desc', 'actions'];
    dataSource          = new MatTableDataSource(this.groups);


    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    applyFilter(filterValue: string) {
        filterValue = filterValue.trim();
        filterValue = filterValue.toLowerCase();
        this.dataSource.filter = filterValue;
    }

    constructor(
        public http: HttpClient, 
        private notify: NotificationService, 
        public dialog: MatDialog, 
        private headerService: HeaderService,
        public appService: AppService
    ) {
        $j("link[href='merged_css.php']").remove();
    }

    ngOnInit(): void {
        this.headerService.setHeader(this.lang.administration + ' ' + this.lang.groups);

        window['MainHeaderComponent'].setSnav(this.sidenavLeft);
        window['MainHeaderComponent'].setSnavRight(null);

        this.loading = true;

        this.http.get("../../rest/groups")
            .subscribe((data: any) => {
                this.groups = data['groups'];
                this.loading = false;
                setTimeout(() => {
                    this.dataSource = new MatTableDataSource(this.groups);
                    this.dataSource.paginator = this.paginator;
                    this.dataSource.sort = this.sort;
                }, 0);
            }, () => {
                location.href = "index.php";
            });
    }

    preDelete(group: any) {
        if (group.users.length == 0) {
            let r = confirm("Etes vous sûr de vouloir supprimer ce groupe ?");

            if (r) {
                this.deleteGroup(group);
            }
        } else {
            this.groupsForAssign = [];
            this.groups.forEach((tmpGroup) => {
                if (group.group_id != tmpGroup.group_id) {
                    this.groupsForAssign.push(tmpGroup);
                }
            });
            this.config = { data: { id: group.id, group_desc: group.group_desc, groupsForAssign: this.groupsForAssign, users: group.users } };
            this.dialogRef = this.dialog.open(GroupsAdministrationRedirectModalComponent, this.config);
            this.dialogRef.afterClosed().subscribe((result: string) => {
                if (result) {
                    if (result == "_NO_REPLACEMENT") {
                        this.deleteGroup(group);
                    } else {
                        this.http.put("../../rest/groups/" + group.id + "/reassign/" + result, {})
                            .subscribe((data: any) => {
                                this.deleteGroup(group);
                            }, (err) => {
                                this.notify.error(err.error.errors);
                            });
                    }
                }
                this.dialogRef = null;
            });
        }

    }

    deleteGroup(group: any) {
        this.http.delete("../../rest/groups/" + group['id'])
            .subscribe((data: any) => {
                setTimeout(() => {
                    this.groups = data['groups'];
                    this.dataSource = new MatTableDataSource(this.groups);
                    this.dataSource.paginator = this.paginator;
                    this.dataSource.sort = this.sort;
                }, 0);
                this.notify.success(this.lang.groupDeleted);

            }, (err) => {
                this.notify.error(err.error.errors);
            });
    }
}

@Component({
    templateUrl: "groups-administration-redirect-modal.component.html"
})
export class GroupsAdministrationRedirectModalComponent {
    lang: any = LANG;

    constructor(public http: HttpClient, @Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<GroupsAdministrationRedirectModalComponent>) {
    }
}