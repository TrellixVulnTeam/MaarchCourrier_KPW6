import { Component, ViewChild, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LANG } from '../translate.component';
import { NotificationService } from '../notification.service';
import { MatPaginator, MatTableDataSource, MatSort, MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';


declare function $j(selector: any) : any;

declare var angularGlobals : any;


@Component({
    templateUrl : angularGlobals["actions-administrationView"],
    providers   : [NotificationService]
})

export class ActionsAdministrationComponent implements OnInit {
    coreUrl                 : string;
    lang                    : any           = LANG;
    search                  : string        = null;

    actions                 : any[]         = [];
    titles                  : any[]         = [];

    loading                 : boolean       = false;

    displayedColumns = ['id', 'label_action', 'history', 'is_folder_action', 'actions'];
    dataSource = new MatTableDataSource(this.actions);
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    applyFilter(filterValue: string) {
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
        this.dataSource.filter = filterValue;
    }

    constructor(public http: HttpClient, private notify: NotificationService) {
    }

    updateBreadcrumb(applicationName: string) {
        if ($j('#ariane')[0]) {
            $j('#ariane')[0].innerHTML = "<a href='index.php?reinit=true'>" + applicationName + "</a> > <a onclick='location.hash = \"/administration\"' style='cursor: pointer'>"+this.lang.administration+"</a> > "+this.lang.actions;
        }
    }

    ngOnInit(): void {
        this.coreUrl = angularGlobals.coreUrl;
        
        this.loading = true;

        this.updateBreadcrumb(angularGlobals.applicationName);
        $j('#inner_content').remove();

        this.http.get(this.coreUrl + 'rest/actions')
            .subscribe((data) => {
                this.actions = data['actions'];
                this.loading = false;
                setTimeout(() => {
                    this.dataSource           = new MatTableDataSource(this.actions);
                    this.dataSource.paginator = this.paginator;
                    this.dataSource.sort      = this.sort;
                }, 0);
            }, (err) => {
                console.log(err);
                location.href = "index.php";
            });
    }

    deleteAction(action: any) {
        let r = confirm(this.lang.confirmAction+' '+this.lang.delete+' « '+action.label_action+' »');

        if (r) {
            this.http.delete(this.coreUrl + 'rest/actions/' + action.id)
                .subscribe((data : any) => {
                    this.actions              = data.action;
                    this.dataSource           = new MatTableDataSource(this.actions);
                    this.dataSource.paginator = this.paginator;
                    this.dataSource.sort      = this.sort;
                    this.notify.success(this.lang.actionDeleted);
                    
                }, (err) => {
                    this.notify.error(JSON.parse(err._body).errors);
                });
        }
    }
}
