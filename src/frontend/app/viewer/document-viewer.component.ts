import { Component, OnInit, Input } from '@angular/core';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { LANG } from '../translate.component';
import { NotificationService } from '../notification.service';
import { HeaderService } from '../../service/header.service';
import { AppService } from '../../service/app.service';
import { tap, catchError, finalize, filter, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { ConfirmComponent } from '../../plugins/modal/confirm.component';
import { MatDialogRef, MatDialog } from '@angular/material';
import { AlertComponent } from '../../plugins/modal/alert.component';
import { SortPipe } from '../../plugins/sorting.pipe';


@Component({
    selector: 'app-document-viewer',
    templateUrl: "document-viewer.component.html",
    styleUrls: [
        'document-viewer.component.scss',
        '../indexation/indexing-form/indexing-form.component.scss',
    ],
    providers: [NotificationService, AppService, SortPipe]
})

export class DocumentViewerComponent implements OnInit {

    @Input('tmpFilename') tmpFilename: string;

    lang: any = LANG;

    loading: boolean = false;
    noConvertedFound: boolean = false;

    noFile: boolean = false;

    file: any = {
        name: '',
        type: '',
        content: null,
        src: null
    };

    allowedExtensions: any[] = [];
    maxFileSize: number = 0;
    maxFileSizeLabel: string = '';

    percentInProgress: number = 0;

    intervalLockFile: any;
    editInProgress: boolean = false;

    listTemplates: any[] = [];

    @Input('editMode') editMode: boolean = false;

    loadingInfo: any = {
        mode: 'determinate',
        percent: 0,
        message: '',
    };

    dialogRef: MatDialogRef<any>;

    constructor(
        public http: HttpClient,
        private notify: NotificationService,
        private headerService: HeaderService,
        public appService: AppService,
        private dialog: MatDialog,
        private sortPipe: SortPipe
    ) {
        (<any>window).pdfWorkerSrc = '../../node_modules/pdfjs-dist/build/pdf.worker.min.js';
    }

    ngOnInit() {
        this.http.get('../../rest/indexing/fileInformations').pipe(
            tap((data: any) => {
                this.allowedExtensions = data.informations.allowedFiles.map((ext: any) => {
                    return {
                        extension: '.' + ext.extension.toLowerCase(),
                        mimeType: ext.mimeType,
                        canConvert: ext.canConvert
                    }
                });
                this.allowedExtensions = this.sortPipe.transform(this.allowedExtensions, 'extension');

                this.maxFileSize = data.informations.maximumSize;
                this.maxFileSizeLabel = data.informations.maximumSizeLabel;
            }),
            catchError((err: any) => {
                this.notify.handleErrors(err);
                return of(false);
            })
        ).subscribe();

        if (this.tmpFilename != '' && this.tmpFilename !== undefined) {
            this.http.get('../../rest/convertedFile/' + this.tmpFilename).pipe(
                tap((data: any) => {
                    this.file = {
                        name: this.tmpFilename,
                        format: 'pdf',
                        type: 'application/pdf',
                        content: this.getBase64Document(this.base64ToArrayBuffer(data.encodedResource)),
                        src: this.base64ToArrayBuffer(data.encodedResource)
                    };
                    this.noConvertedFound = false;
                    this.loading = false;
                }),
                catchError((err: any) => {
                    this.notify.handleErrors(err);
                    return of(false);
                })
            ).subscribe();
        }
    }

    loadTmpFile(filenameOnTmp: string) {
        this.loading = true;
        this.loadingInfo.mode = 'determinate';

        this.requestWithLoader(`../../rest/convertedFile/${filenameOnTmp}?convert=true`).subscribe(
            (data: any) => {
                if (data.encodedResource) {
                    this.file = {
                        name: filenameOnTmp,
                        format: data.extension,
                        type: data.type,
                        content: data.encodedResource,
                        src: this.base64ToArrayBuffer(data.encodedConvertedResource)
                    };
                    this.editMode = true;
                    this.noConvertedFound = false;
                    this.loading = false;
                }
            },
            (err: any) => {
                this.noConvertedFound = true;
                this.notify.handleErrors(err);
                this.loading = false;
                return of(false);
            }
        );
    }

    uploadTrigger(fileInput: any) {
        if (fileInput.target.files && fileInput.target.files[0] && this.isExtensionAllowed(fileInput.target.files[0])) {
            this.initUpload();

            var reader = new FileReader();
            this.file.name = fileInput.target.files[0].name;
            this.file.type = fileInput.target.files[0].type;
            this.file.format = this.file.name.split('.').pop();

            reader.readAsArrayBuffer(fileInput.target.files[0]);

            reader.onload = (value: any) => {
                this.file.content = this.getBase64Document(value.target.result);

                if (this.file.type !== 'application/pdf') {
                    this.convertDocument(this.file);
                } else {
                    this.file.src = value.target.result;
                    this.loading = false;
                }
            };
        } else {
            this.loading = false;
        }
    }

    initUpload() {
        this.loading = true;
        this.file = {
            name: '',
            type: '',
            content: null,
            src: null
        };
        this.noConvertedFound = false;
        this.loadingInfo.message = this.lang.loadingFile + '...';
        this.loadingInfo.mode = 'indeterminate';
    }

    getBase64Document(buffer: ArrayBuffer) {
        let TYPED_ARRAY = new Uint8Array(buffer);
        const STRING_CHAR = TYPED_ARRAY.reduce((data, byte) => {
            return data + String.fromCharCode(byte);
        }, '');

        return btoa(STRING_CHAR);
    }

    base64ToArrayBuffer(base64: string) {
        var binary_string = window.atob(base64);
        var len = binary_string.length;
        var bytes = new Uint8Array(len);
        for (var i = 0; i < len; i++) {
            bytes[i] = binary_string.charCodeAt(i);
        }
        return bytes.buffer;
    }

    b64toBlob(b64Data: any, contentType = '', sliceSize = 512) {
        const byteCharacters = atob(b64Data);
        const byteArrays = [];

        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            const slice = byteCharacters.slice(offset, offset + sliceSize);

            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            const byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }

        const blob = new Blob(byteArrays, { type: contentType });
        return blob;
    }

    convertDocument(file: any) {
        if (this.canBeConverted(file)) {
            const data = { name: file.name, base64: file.content };
            this.upload(data).subscribe(
                (res: any) => {
                    if (res.encodedResource) {
                        this.file.base64src = res.encodedResource;
                        this.file.src = this.base64ToArrayBuffer(res.encodedResource);
                        this.loading = false;
                    }
                },
                (err: any) => {
                    this.noConvertedFound = true;
                    this.notify.handleErrors(err);
                    this.loading = false;
                    return of(false);
                }
            );
        } else {
            this.noConvertedFound = true;
            this.loading = false
        }

    }

    upload(data: any) {
        let uploadURL = `../../rest/convertedFile`;

        return this.http.post<any>(uploadURL, data, {
            reportProgress: true,
            observe: 'events'
        }).pipe(map((event) => {

            switch (event.type) {
                case HttpEventType.DownloadProgress:

                    const downloadProgress = Math.round(100 * event.loaded / event.total);
                    this.loadingInfo.percent = downloadProgress;
                    this.loadingInfo.mode = 'determinate';
                    this.loadingInfo.message = `3/3 ${this.lang.downloadConvertedFile}...`;

                    return { status: 'progress', message: downloadProgress };

                case HttpEventType.UploadProgress:
                    const progress = Math.round(100 * event.loaded / event.total);
                    this.loadingInfo.percent = progress;

                    if (progress === 100) {
                        this.loadingInfo.mode = 'indeterminate';
                        this.loadingInfo.message = `2/3 ${this.lang.convertingFile}...`;
                    } else {
                        this.loadingInfo.mode = 'determinate';
                        this.loadingInfo.message = `1/3 ${this.lang.loadingFile}...`;
                    }
                    return { status: 'progress', message: progress };

                case HttpEventType.Response:
                    return event.body;
                default:
                    return `Unhandled event: ${event.type}`;
            }
        })
        );
    }

    requestWithLoader(url: string) {
        this.loadingInfo.percent = 0;

        return this.http.get<any>(url, {
            reportProgress: true,
            observe: 'events'
        }).pipe(map((event) => {
            switch (event.type) {
                case HttpEventType.DownloadProgress:

                    const downloadProgress = Math.round(100 * event.loaded / event.total);
                    this.loadingInfo.percent = downloadProgress;
                    this.loadingInfo.mode = 'determinate';
                    this.loadingInfo.message = ``;

                    return { status: 'progressDownload', message: downloadProgress };

                case HttpEventType.Response:
                    return event.body;
                default:
                    return `Unhandled event: ${event.type}`;
            }
        })
        );
    }


    onError(error: any) {
        console.log(error);
    }

    cleanFile() {
        this.dialogRef = this.dialog.open(ConfirmComponent, { autoFocus: false, disableClose: true, data: { title: this.lang.delete, msg: this.lang.confirmAction } });

        this.dialogRef.afterClosed().pipe(
            filter((data: string) => data === 'ok'),
            tap(() => {
                this.file = {
                    name: '',
                    type: '',
                    content: null,
                    src: null
                };
            }),
            catchError((err: any) => {
                this.notify.handleErrors(err);
                return of(false);
            })
        ).subscribe();

    }

    getFile() {
        return this.file;
    }

    dndUploadFile(event: any) {
        const fileInput = {
            target: {
                files: [
                    event[0]
                ]
            }
        }
        this.uploadTrigger(fileInput);
    }

    canBeConverted(file: any): boolean {
        const fileExtension = '.' + file.name.split('.').pop();
        if (this.allowedExtensions.filter(ext => ext.canConvert === true && ext.mimeType === file.type && ext.extension === fileExtension).length > 0) {
            return true;
        } else {
            return false;
        }
    }

    isExtensionAllowed(file: any) {
        const fileExtension = '.' + file.name.split('.').pop();
        if (this.allowedExtensions.filter(ext => ext.mimeType === file.type && ext.extension === fileExtension).length === 0) {
            this.dialog.open(AlertComponent, { autoFocus: false, disableClose: true, data: { title: this.lang.notAllowedExtension + ' !', msg: this.lang.file + ' : <b>' + file.name + '</b>, ' + this.lang.type + ' : <b>' + file.type + '</b><br/><br/><u>' + this.lang.allowedExtensions + '</u> : <br/>' + this.allowedExtensions.map(ext => ext.extension).filter((elem: any, index: any, self: any) => index === self.indexOf(elem)).join(', ') } });
            return false;
        } else if (file.size > this.maxFileSize) {
            this.dialog.open(AlertComponent, { autoFocus: false, disableClose: true, data: { title: this.lang.maxFileSizeReached + ' ! ', msg: this.lang.maxFileSize + ' : ' + this.maxFileSizeLabel } });
            return false;
        } else {
            return true;
        }
    }

    downloadOriginalFile() {
        let downloadLink = document.createElement('a');
        downloadLink.href = `data:${this.file.type};base64,${this.file.content}`;
        downloadLink.setAttribute('download', this.file.name);
        document.body.appendChild(downloadLink);
        downloadLink.click();
    }

    printPdf() {
        const blob = this.b64toBlob(this.file.base64src, this.file.type);
        const blobUrl = URL.createObjectURL(blob);
        window.focus();
        window.open(blobUrl);
    }

    loadRessource(resId: any, target: string = 'mainDocument') {
        this.http.get(`../../rest/resources/${resId}/content`, { params: { mode: 'base64'}}).pipe(
            tap((data: any) => {
                this.file.content = data.encodedDocument;
                this.file.src = this.base64ToArrayBuffer(this.file.content);

            }),
            catchError((err: any) => {
                if (err.error.errors === 'Document has no file') {
                    this.noFile = true;
                } else {
                    this.notify.handleErrors(err);
                }
                return of(false);
            })
        ).subscribe();
    }

    editTemplate(template: any) {
        this.editInProgress = true;
        const jnlp = {
            objectType: 'resourceCreation',
            objectId: template.id,
            cookie: document.cookie
        }
        this.http.post('../../rest/jnlp', jnlp).pipe(
            tap((data: any) => {
                window.location.href = '../../rest/jnlp/' + data.generatedJnlp;
                this.checkLockFile(data.jnlpUniqueId, template);
            })
        ).subscribe();
    }

    checkLockFile(id: string, template: any) {
        this.intervalLockFile = setInterval(() => {
            this.http.get('../../rest/jnlp/lock/' + id)
                .subscribe((data: any) => {
                    if (!data.lockFileFound) {
                        this.editInProgress = false;
                        clearInterval(this.intervalLockFile);
                        this.loadTmpFile(`${data.fileTrunk}.${template.extension}`);
                    }
                });
        }, 1000);
    }

    cancelTemplateEdition() {
        clearInterval(this.intervalLockFile);
        this.editInProgress = false;
    }

    isEditingTemplate() {
        return this.editInProgress;
    }

    loadTemplates() {
        if (this.listTemplates.length === 0) {
            this.http.get('../../rest/currentUser/templates').pipe(
                tap((data: any) => {
                    this.listTemplates = data.templates;
                })
            ).subscribe();
        }
    }
}