import { Component, OnInit, ViewChild, EventEmitter, ViewContainerRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LANG } from '../../translate.component';
import { merge, Observable, of as observableOf, Subject, of } from 'rxjs';
import { NotificationService } from '../../notification.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSidenav } from '@angular/material/sidenav';
import { MatSort } from '@angular/material/sort';

import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { startWith, switchMap, map, catchError, takeUntil, tap, exhaustMap, filter } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderService } from '../../../service/header.service';

import { Overlay } from '@angular/cdk/overlay';
import { PanelListComponent } from '../../list/panel/panel-list.component';
import { AppService } from '../../../service/app.service';
import { PanelFolderComponent } from '../panel/panel-folder.component';
import { BasketHomeComponent } from '../../basket/basket-home.component';
import { ConfirmComponent } from '../../../plugins/modal/confirm.component';
import { FolderActionListComponent } from '../folder-action-list/folder-action-list.component';
import { FiltersListService } from '../../../service/filtersList.service';
import { trigger, transition, style, animate } from '@angular/animations';


declare function $j(selector: any): any;

@Component({
    templateUrl: "folder-document-list.component.html",
    styleUrls: ['folder-document-list.component.scss'],
    providers: [NotificationService, AppService]
})
export class FolderDocumentListComponent implements OnInit {

    lang: any = LANG;

    loading: boolean = false;
    docUrl: string = '';
    public innerHtml: SafeHtml;
    basketUrl: string;
    homeData: any;

    injectDatasParam = {
        resId: 0,
        editable: false
    };
    currentResource: any = {};

    filtersChange = new EventEmitter();

    dragInit: boolean = true;

    dialogRef: MatDialogRef<any>;

    @ViewChild('snav', { static: true }) sidenavLeft: MatSidenav;
    @ViewChild('snav2', { static: true }) sidenavRight: MatSidenav;

    displayedColumnsBasket: string[] = ['res_id'];

    displayedMainData: any = [
        {
            'value': 'alt_identifier',
            'cssClasses': ['softColorData', 'align_centerData', 'chronoData'],
            'icon': ''
        },
        {
            'value': 'subject',
            'cssClasses': ['longData'],
            'icon': ''
        }
    ];

    resultListDatabase: ResultListHttpDao | null;
    data: any;
    resultsLength = 0;
    isLoadingResults = true;
    listProperties: any = {};
    currentChrono: string = '';
    currentMode: string = '';

    thumbnailUrl: string = '';

    selectedRes: Array<number> = [];
    allResInBasket: number[] = [];
    selectedDiffusionTab: number = 0;
    folderInfo: any = {
        id: 0,
        'label': '',
        'ownerDisplayName': '',
        'entitiesSharing': []
    };
    folderInfoOpened: boolean = false;

    private destroy$ = new Subject<boolean>();

    @ViewChild('actionsListContext', { static: true }) actionsList: FolderActionListComponent;
    @ViewChild('appPanelList', { static: true }) appPanelList: PanelListComponent;

    currentSelectedChrono: string = '';

    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild('tableBasketListSort', { static: true }) sort: MatSort;
    @ViewChild('panelFolder', { static: false }) panelFolder: PanelFolderComponent;
    @ViewChild('basketHome', { static: true }) basketHome: BasketHomeComponent;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        public http: HttpClient,
        public dialog: MatDialog,
        private sanitizer: DomSanitizer,
        private headerService: HeaderService,
        public filtersListService: FiltersListService, 
        private notify: NotificationService,
        public overlay: Overlay,
        public viewContainerRef: ViewContainerRef,
        public appService: AppService) {
        $j("link[href='merged_css.php']").remove();
    }

    ngOnInit(): void {
        this.appService.openBasketMenu(false);
        this.loading = false;

        this.http.get("../../rest/home")
            .subscribe((data: any) => {
                this.homeData = data;
            });

        this.isLoadingResults = false;

        this.route.params.subscribe(params => {
            this.folderInfoOpened = false;
            this.dragInit = true;
            this.destroy$.next(true);

            this.http.get('../../rest/folders/' + params['folderId'])
                .subscribe((data: any) => {
                    this.folderInfo =
                        {
                            'id': params['folderId'],
                            'label': data.folder.label,
                            'ownerDisplayName': data.folder.ownerDisplayName,
                            'entitiesSharing': data.folder.sharing.entities.map((entity: any) => entity.label),
                        };

                    this.headerService.setHeader(this.folderInfo.label, '', 'fa fa-folder-open');
                });
            this.basketUrl = '../../rest/folders/' + params['folderId'] + '/resources';
            this.filtersListService.filterMode = false;
            this.selectedRes = [];
            this.sidenavRight.close();
            window['MainHeaderComponent'].setSnav(this.sidenavLeft);
            window['MainHeaderComponent'].setSnavRight(null);

            this.listProperties = this.filtersListService.initListsProperties(this.headerService.user.id, 0, params['folderId'], 'folder');

            setTimeout(() => {
                this.dragInit = false;
            }, 1000);
            this.initResultList();

        },
            (err: any) => {
                this.notify.handleErrors(err);
            });
    }

    ngOnDestroy() {
        this.destroy$.next(true);
    }

    initResultList() {
        this.resultListDatabase = new ResultListHttpDao(this.http, this.filtersListService);
        // If the user changes the sort order, reset back to the first page.
        this.paginator.pageIndex = this.listProperties.page;
        this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

        // When list is refresh (sort, page, filters)
        merge(this.sort.sortChange, this.paginator.page, this.filtersChange)
            .pipe(
                takeUntil(this.destroy$),
                startWith({}),
                switchMap(() => {
                    this.isLoadingResults = true;
                    return this.resultListDatabase!.getRepoIssues(
                        this.sort.active, this.sort.direction, this.paginator.pageIndex, this.basketUrl, this.filtersListService.getUrlFilters());
                }),
                map(data => {
                    // Flip flag to show that loading has finished.
                    this.isLoadingResults = false;
                    data = this.processPostData(data);
                    this.resultsLength = data.countResources;
                    this.allResInBasket = data.allResources;
                    //this.headerService.setHeader('Dossier : ' + this.folderInfo.label);
                    return data.resources;
                }),
                catchError((err: any) => {
                    this.notify.handleErrors(err);
                    this.router.navigate(['/home']);
                    this.isLoadingResults = false;
                    return observableOf([]);
                })
            ).subscribe(data => this.data = data);
    }

    goTo(row: any) {
        this.filtersListService.filterMode = false;
        if (this.docUrl == '../../rest/resources/' + row.res_id + '/content' && this.sidenavRight.opened) {
            this.sidenavRight.close();
        } else {
            this.docUrl = '../../rest/resources/' + row.res_id + '/content';
            this.currentChrono = row.alt_identifier;
            this.innerHtml = this.sanitizer.bypassSecurityTrustHtml(
                "<iframe style='height:100%;width:100%;' src='" + this.docUrl + "' class='embed-responsive-item'>" +
                "</iframe>");
            this.sidenavRight.open();
        }
    }

    goToDetail(row: any) {
        location.href = "index.php?page=details&dir=indexing_searching&id=" + row.res_id;
    }

    togglePanel(mode: string, row: any) {
        let thisSelect = { checked: true };
        let thisDeselect = { checked: false };
        row.checked = true;
        this.toggleAllRes(thisDeselect);
        this.toggleRes(thisSelect, row);

        if (this.currentResource.res_id == row.res_id && this.sidenavRight.opened && this.currentMode == mode) {
            this.sidenavRight.close();
        } else {
            this.currentMode = mode;
            this.currentResource = row;
            this.appPanelList.loadComponent(mode, row);
            this.sidenavRight.open();
        }
    }

    refreshBadgeNotes(nb: number) {
        this.currentResource.countNotes = nb;
    }

    refreshBadgeAttachments(nb: number) {
        this.currentResource.countAttachments = nb;
    }

    refreshDao() {
        this.paginator.pageIndex = this.listProperties.page;
        this.filtersChange.emit();
    }

    refreshDaoAfterAction() {
        this.sidenavRight.close();
        this.refreshDao();
        const e: any = { checked: false };
        this.toggleAllRes(e);
    }

    viewThumbnail(row: any) {
        this.thumbnailUrl = '../../rest/resources/' + row.res_id + '/thumbnail';
        $j('#viewThumbnail').show();
        $j('#listContent').css({ "overflow": "hidden" });
    }

    closeThumbnail() {
        $j('#viewThumbnail').hide();
        $j('#listContent').css({ "overflow": "auto" });
    }

    processPostData(data: any) {
        data.resources.forEach((element: any) => {
            // Process main datas
            Object.keys(element).forEach((key) => {
                if (key == 'statusImage' && element[key] == null) {
                    element[key] = 'fa-question undefined';
                } else if ((element[key] == null || element[key] == '') && ['closingDate', 'countAttachments', 'countNotes', 'display'].indexOf(key) === -1) {
                    element[key] = this.lang.undefined;
                }
            });

            element['checked'] = this.selectedRes.indexOf(element['res_id']) !== -1;
        });

        return data;
    }

    toggleRes(e: any, row: any) {
        if (e.checked) {
            if (this.selectedRes.indexOf(row.res_id) === -1) {
                this.selectedRes.push(row.res_id);
                row.checked = true;
            }
        } else {
            let index = this.selectedRes.indexOf(row.res_id);
            this.selectedRes.splice(index, 1);
            row.checked = false;
        }
    }

    toggleAllRes(e: any) {
        this.selectedRes = [];
        if (e.checked) {
            this.data.forEach((element: any) => {
                element['checked'] = true;
            });
            this.selectedRes = JSON.parse(JSON.stringify(this.allResInBasket));
        } else {
            this.data.forEach((element: any) => {
                element['checked'] = false;
            });
        }
    }

    selectSpecificRes(row: any) {
        let thisSelect = { checked : true };
        let thisDeselect = { checked : false };
        
        this.toggleAllRes(thisDeselect);
        this.toggleRes(thisSelect, row);
    }

    open({ x, y }: MouseEvent, row: any) {
        
        let thisSelect = { checked : true };
        let thisDeselect = { checked : false };
        if ( row.checked === false) {
            row.checked = true;
            this.toggleAllRes(thisDeselect);
            this.toggleRes(thisSelect, row);
        }
        this.actionsList.open(x, y, row)

        // prevents default
        return false;
    }

    listTodrag() {
        if (this.panelFolder !== undefined) {
            return this.panelFolder.getDragIds();
        } else {
            return [];
        }
    }
}
export interface BasketList {
    folder: any;
    resources: any[];
    countResources: number;
    allResources: number[];
}

export class ResultListHttpDao {

    constructor(private http: HttpClient, private filtersListService: FiltersListService) { }

    getRepoIssues(sort: string, order: string, page: number, href: string, filters: string): Observable<BasketList> {
        this.filtersListService.updateListsPropertiesPage(page);
        let offset = page * 25;
        const requestUrl = `${href}?limit=25&offset=${offset}${filters}`;

        return this.http.get<BasketList>(requestUrl);
    }
}
