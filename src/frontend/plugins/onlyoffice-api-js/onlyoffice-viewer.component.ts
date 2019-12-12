import {
    Component,
    OnInit,
    AfterViewInit,
    Input,
    NgZone,
    EventEmitter,
    Output,
    HostListener
} from '@angular/core';
import './onlyoffice-api.js';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject, Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

declare var DocsAPI: any;

@Component({
    selector: 'onlyoffice-viewer',
    template: `<button (click)="quit()">close</button><div id="placeholder"></div>`,
})
export class EcplOnlyofficeViewerComponent implements OnInit, AfterViewInit {
    @Input() id: string;
    @Input() onlyofficeName: string;
    @Input() onlyofficeType: string;
    @Input() onlyofficeKey: string;
    @Input() resId: number;
    @Input() editMode: boolean = false;

    @Output() triggerEvent = new EventEmitter<string>();

    editorConfig: any;
    docEditor: any;
    showModalWindow: boolean = false;

    @HostListener('window:message', ['$event'])
    onMessage(e: any) {
        console.log(e);
        const response = JSON.parse(e.data);

        if (response.event === 'onDownloadAs') {
            this.saveDocument();
        }
    }
    constructor(private zone: NgZone, public http: HttpClient) { }

    quit() {
        this.docEditor.downloadAs();
    }

    saveDocument() {
        const content = {
            "c": "forcesave",
            "key": "azerty4",
            "userdata": "Bernard BLIER"
        }

        const optionRequete = {
            headers: new HttpHeaders({ 
              'Access-Control-Allow-Origin':'*',
            }),
            params: content
          };

        this.http.post('http://10.2.95.76:8765/coauthoring/CommandService.ashx', {}, optionRequete).pipe().subscribe();
    }


    ngOnInit() { }

    generateUniqueId(length: number = 5) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    ngAfterViewInit() {
        this.editorConfig = {
            documentType: 'text',
            document: {
                fileType: 'odt',
                key: 'azerty4',
                title: this.onlyofficeName,
                url: `http://cchaplin:maarch@10.2.95.76/maarch_courrier_develop/rest/resources/1660/originalContent`,
                permissions: {
                    comment: false,
                    download: true,
                    edit: this.editMode,
                    print: true,
                    review: false
                }
            },
            editorConfig: {
                callbackUrl: 'http://cchaplin:maarch@10.2.95.76/maarch_courrier_develop/rest/test',
                lang: 'fr-FR',
                mode: 'edit',
                customization: {
                    chat: false,
                    comments: false,
                    compactToolbar: false,
                    feedback: false,
                    forcesave: true,
                    goback: false,
                    hideRightMenu: true,
                    showReviewChanges: false,
                    zoom: 100
                },
                user: {
                    id: "1",
                    name: "Bernard BLIER"
                },
            },
        };
        this.docEditor = new DocsAPI.DocEditor('placeholder', this.editorConfig);
    }
}