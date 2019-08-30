import { Component, OnInit, Input, Output, EventEmitter, Inject } from '@angular/core';
import { LANG } from '../../translate.component';
import { HttpClient } from '@angular/common/http';
import { map, tap, catchError, exhaustMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { NotificationService } from '../../notification.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

declare function $j(selector: any): any;

@Component({
    templateUrl: "folder-update.component.html",
    styleUrls: ['folder-update.component.scss'],
    providers: [NotificationService],
})
export class FolderUpdateComponent implements OnInit {

    lang: any = LANG;

    folder: any = {
        id: 0,
        label: '',
        public: true,
        user_id: 0,
        parent_id: null,
        level: 0,
        sharing: {
            entities: []
        }
    }

    entities: any[] = [];

    constructor(
        public http: HttpClient,
        private notify: NotificationService,
        public dialogRef: MatDialogRef<FolderUpdateComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) { }

    ngOnInit(): void {
        this.getFolder();
    }

    getFolder() {
        this.http.get('../../rest/folders/' + this.data.folderId).pipe(
            tap((data: any) => this.folder = data.folder),
            exhaustMap(() => this.http.get('../../rest/entities')),
            map((data: any) => {
                this.entities = data.entities;
                data.entities.forEach((element: any) => {
                    if (this.folder.sharing.entities.map((data: any) => data.entity_id).indexOf(element.serialId) > -1) {
                        element.state.selected = true;
                    }
                    element.state.allowed = true;
                    element.state.disabled = false;
                });
                return data;
            }),
            tap((data: any) => {
                this.initEntitiesTree(data.entities);
            }),
            exhaustMap(() => this.http.get('../../rest/folders')),
            map((data: any) => {
                data.folders.forEach((element: any) => {
                    element['state'] = {
                        opened: true
                    }
                    if (element.parent_id === null) {
                        element.parent_id = '#';
                    }

                    if (element.id === this.folder.parent_id) {
                        element['state'].selected = true;
                    }

                    if (element.id === this.folder.id) {
                        element['state'].disabled = true; 
                    }
                    element.parent = element.parent_id;
                    element.text = element.label;
                });
                return data;
            }),
            tap((data: any) => {
                this.initFoldersTree(data.folders);
            }),
            catchError((err: any) => {
                this.notify.handleErrors(err);
                return of(false);
            })
        ).subscribe();
    }

    initFoldersTree(folders: any) {
        $j('#jstreeFolders').jstree({
            "checkbox": {
                'deselect_all': true,
                "three_state": false //no cascade selection
            },
            'core': {
                'themes': {
                    'name': 'proton',
                    'responsive': true
                },
                'multiple': false,
                'data': folders
            },
            "plugins": ["checkbox", "search"]
        });
        $j('#jstreeFolders')
            // listen for event
            .on('select_node.jstree', (e: any, data: any) => {
                this.folder.parent_id = data.node.original.id;

            }).on('deselect_node.jstree', (e: any, data: any) => {
                this.folder.parent_id = '';
            })
            // create the instance
            .jstree();
        var to: any = false;
        $j('#jstree_searchFolders').keyup(function () {
            if (to) { clearTimeout(to); }
            to = setTimeout(function () {
                var v = $j('#jstree_searchFolders').val();
                $j('#jstreeFolders').jstree(true).search(v);
            }, 250);
        });
    }

    initEntitiesTree(entities: any) {
        $j('#jstree').jstree({
            "checkbox": {
                "three_state": false //no cascade selection
            },
            'core': {
                'themes': {
                    'name': 'proton',
                    'responsive': true
                },
                'data': entities
            },
            "plugins": ["checkbox", "search"]
        });
        $j('#jstree')
            // listen for event
            .on('select_node.jstree', (e: any, data: any) => {
                this.selectEntity(data.node.original);

            }).on('deselect_node.jstree', (e: any, data: any) => {
                this.deselectEntity(data.node.original);
            })
            // create the instance
            .jstree();
        var to: any = false;
        $j('#jstree_search').keyup(function () {
            if (to) { clearTimeout(to); }
            to = setTimeout(function () {
                var v = $j('#jstree_search').val();
                $j('#jstree').jstree(true).search(v);
            }, 250);
        });
    }

    selectEntity(newEntity: any) {
        this.folder.sharing.entities.push(
            {
                entity_id: newEntity.serialId,
                edition: false
            }
        );
    }

    deselectEntity(entity: any) {

        let index = this.folder.sharing.entities.map((data: any) => data.entity_id).indexOf(entity.serialId);
        this.folder.sharing.entities.splice(index, 1);
    }

    onSubmit(): void {
        this.http.put('../../rest/folders/' + this.folder.id, this.folder).pipe(
            exhaustMap(() => this.http.put('../../rest/folders/' + this.folder.id + '/sharing', { public: this.folder.sharing.entities.length > 0, sharing: this.folder.sharing })),
            tap((data: any) => {
                this.notify.success(this.lang.folderUpdated);
                this.dialogRef.close('success');
            }),
            catchError((err: any) => {
                this.notify.handleErrors(err);
                return of(false);
            })
        ).subscribe();
    }

    checkSelectedFolder(entity: any) {
        if (this.folder.sharing.entities.map((data: any) => data.entity_id).indexOf(entity.serialId) > -1) {
            return true;
        } else {
            return false;
        }
    }

    initService(ev: any) {
        if (ev.index == 1) {
            this.initEntitiesTree(this.entities);
        }
    }

    toggleAdmin(entity: any, ev: any) {
        const index = this.folder.sharing.entities.map((data: any) => data.entity_id).indexOf(entity.serialId);
        this.folder.sharing.entities[index].edition = ev.checked;
    }

    isAdminEnabled(entity: any) {
        const index = this.folder.sharing.entities.map((data: any) => data.entity_id).indexOf(entity.serialId);
        return this.folder.sharing.entities[index].edition;
    }
}
