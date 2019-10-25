import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LANG } from '../../translate.component';

import { NotificationService } from '../../notification.service';
import { MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { FoldersService } from '../folders.service';

@Component({
    selector: 'folder-pinned',
    templateUrl: "folder-pinned.component.html",
    styleUrls: ['folder-pinned.component.scss'],
    providers: [NotificationService],
})
export class FolderPinnedComponent implements OnInit {

    lang: any = LANG;
    
    subscription: Subscription;
    
    constructor(
        public http: HttpClient,
        private notify: NotificationService,
        private dialog: MatDialog,
        private router: Router,
        public foldersService: FoldersService
    ) {
        // Event after process action 
        this.subscription = this.foldersService.catchEvent().subscribe((result: any) => {
            //console.log(result);
        }); 
    }

    ngOnInit(): void {
        this.foldersService.initFolder();
        this.foldersService.getPinnedFolders();
    }

    gotToFolder(folder: any) {
        this.foldersService.goToFolder(folder);
    }

    dragEnter(folder: any) {
        folder.drag = true;
    }

    drop(ev: any, node: any) {
        this.foldersService.classifyDocument(ev, node);
        /*if (ev.previousContainer.id === 'folder-list') {
            this.moveFolder(ev, node);
        } else {
            this.classifyDocument(ev, node);
        }*/
    }

    ngOnDestroy() {
        // unsubscribe to ensure no memory leaks
        this.subscription.unsubscribe();
    }

}
