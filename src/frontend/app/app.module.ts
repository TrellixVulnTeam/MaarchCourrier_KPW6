import { NgModule }                             from '@angular/core';

import { SharedModule }                         from './app-common.module';

import { CustomSnackbarComponent, NotificationService }              from './notification.service';
import { ConfirmModalComponent }                from './confirmModal.component';
import { HeaderService }                        from '../service/header.service';
import { FiltersListService }                   from '../service/filtersList.service';

import { AppComponent }                         from './app.component';
import { AppRoutingModule }                     from './app-routing.module';
import { AdministrationModule }                 from './administration/administration.module';

import { ProfileComponent }                     from './profile.component';
import { AboutUsComponent }                     from './about-us.component';
import { HomeComponent }                        from './home/home.component';
import { MaarchParapheurListComponent }         from './home/maarch-parapheur/maarch-parapheur-list.component';
import { BasketListComponent }                  from './list/basket-list.component';
import { ProcessComponent }                  from './process/process.component';

import { PasswordModificationComponent, InfoChangePasswordModalComponent, }        from './password-modification.component';
import { SignatureBookComponent, SafeUrlPipe }  from './signature-book.component';
import { SaveNumericPackageComponent }          from './save-numeric-package.component';
import { ActivateUserComponent }                from './activate-user.component';

import { ActionsListComponent }                 from './actions/actions-list.component';

import { FolderPinnedComponent }                 from './folder/folder-pinned/folder-pinned.component';
import { FolderTreeComponent }                 from './folder/folder-tree.component';
import { FolderDocumentListComponent }                 from './folder/document-list/folder-document-list.component';
import { PanelFolderComponent }                 from './folder/panel/panel-folder.component';
import { FolderMenuComponent }                 from './folder/folder-menu/folder-menu.component';
import { FolderUpdateComponent }                 from './folder/folder-update/folder-update.component';
import { FolderActionListComponent }                 from './folder/folder-action-list/folder-action-list.component';

/*ACTIONS PAGES */
import { ConfirmActionComponent }               from './actions/confirm-action/confirm-action.component';
import { DisabledBasketPersistenceActionComponent } from './actions/disabled-basket-persistence-action/disabled-basket-persistence-action.component';
import { EnabledBasketPersistenceActionComponent } from './actions/enabled-basket-persistence-action/enabled-basket-persistence-action.component';
import { ResMarkAsReadActionComponent } from './actions/res-mark-as-read-action/res-mark-as-read-action.component';
import { CloseMailActionComponent }             from './actions/close-mail-action/close-mail-action.component';
import { UpdateAcknowledgementSendDateActionComponent }             from './actions/update-acknowledgement-send-date-action/update-acknowledgement-send-date-action.component';
import { CreateAcknowledgementReceiptActionComponent }             from './actions/create-acknowledgement-receipt-action/create-acknowledgement-receipt-action.component';
import { CloseAndIndexActionComponent }             from './actions/close-and-index-action/close-and-index-action.component';
import { UpdateDepartureDateActionComponent }   from './actions/update-departure-date-action/update-departure-date-action.component';
import { SendExternalSignatoryBookActionComponent }   from './actions/send-external-signatory-book-action/send-external-signatory-book-action.component';
import { SendExternalNoteBookActionComponent }   from './actions/send-external-note-book-action/send-external-note-book-action.component';
import { XParaphComponent }                         from './actions/send-external-signatory-book-action/x-paraph/x-paraph.component';
import { MaarchParaphComponent }                         from './actions/send-external-signatory-book-action/maarch-paraph/maarch-paraph.component';
import { ProcessActionComponent }               from './actions/process-action/process-action.component';
import { ViewDocActionComponent }               from './actions/view-doc-action/view-doc-action.component';
import { RedirectActionComponent }               from './actions/redirect-action/redirect-action.component';
import { SendShippingActionComponent }               from './actions/send-shipping-action/send-shipping-action.component';

import { FiltersListComponent }                 from './list/filters/filters-list.component';
import { FiltersToolComponent }                 from './list/filters/filters-tool.component';
import { ToolsListComponent }                 from './list/tools/tools-list.component';
import { PanelListComponent }                 from './list/panel/panel-list.component';
import { SummarySheetComponent }                from './list/summarySheet/summary-sheet.component';
import { ExportComponent }                      from './list/export/export.component';

import { NoteEditorComponent }                  from './notes/note-editor.component';
import { NotesListComponent }                   from './notes/notes.component';
import { AttachmentsListComponent }             from './attachments/attachments-list.component';
import { VisaWorkflowComponent }             from './visa/visa-workflow.component';
import { AvisWorkflowComponent }             from './avis/avis-workflow.component';

import { PrintSeparatorComponent }                        from './separator/print-separator/print-separator.component';

import { IndexationComponent }                        from './indexation/indexation.component';
import { HistoryWorkflowResumeComponent }                        from './history/history-workflow-resume/history-workflow-resume.component';
import { NoteResumeComponent }                        from './notes/note-resume/note-resume.component';
import { AttachmentShowModalComponent }                        from './attachments/attachment-show-modal/attachment-show-modal.component';
import { AttachmentsResumeComponent }                        from './attachments/attachments-resume/attachments-resume.component';
import { MailResumeComponent }                        from './mail/mail-resume/mail-resume.component';
import { AddPrivateIndexingModelModalComponent }                        from './indexation/private-indexing-model/add-private-indexing-model-modal.component';
import { FoldersService } from './folder/folders.service';
import { PrivilegeService } from '../service/privileges.service';


@NgModule({
    imports: [
        SharedModule,
        AdministrationModule,
        AppRoutingModule,
    ],
    declarations: [
        AppComponent,
        ProfileComponent,
        AboutUsComponent,
        HomeComponent,
        MaarchParapheurListComponent,
        BasketListComponent,
        ProcessComponent,
        PasswordModificationComponent,
        SignatureBookComponent,
        SafeUrlPipe,
        SaveNumericPackageComponent,
        CustomSnackbarComponent,
        ConfirmModalComponent,
        InfoChangePasswordModalComponent,
        ActivateUserComponent,
        NotesListComponent,
        NoteEditorComponent,
        AttachmentsListComponent,
        VisaWorkflowComponent,
        AvisWorkflowComponent,
        FiltersListComponent,
        FiltersToolComponent,
        ToolsListComponent,
        PanelListComponent,
        SummarySheetComponent,
        ExportComponent,
        ConfirmActionComponent,
        ResMarkAsReadActionComponent,
        EnabledBasketPersistenceActionComponent,
        DisabledBasketPersistenceActionComponent,
        CloseAndIndexActionComponent,
        UpdateAcknowledgementSendDateActionComponent,
        CreateAcknowledgementReceiptActionComponent,
        CloseMailActionComponent,
        UpdateDepartureDateActionComponent,
        SendExternalSignatoryBookActionComponent,
        SendExternalNoteBookActionComponent,
        XParaphComponent,
        MaarchParaphComponent,
        ProcessActionComponent,
        ViewDocActionComponent,
        RedirectActionComponent,
        SendShippingActionComponent,
        ActionsListComponent,
        PrintSeparatorComponent,
        FolderPinnedComponent,
        FolderTreeComponent,
        PanelFolderComponent,
        FolderDocumentListComponent,
        FolderMenuComponent,
        FolderUpdateComponent,
        FolderActionListComponent,
        IndexationComponent,
        HistoryWorkflowResumeComponent,
        NoteResumeComponent,
        AttachmentsResumeComponent,
        AddPrivateIndexingModelModalComponent,
        AttachmentShowModalComponent,
        MailResumeComponent
    ],
    entryComponents: [
        CustomSnackbarComponent,
        ConfirmModalComponent,
        InfoChangePasswordModalComponent,
        AttachmentsListComponent,
        SummarySheetComponent,
        ExportComponent,
        ConfirmActionComponent,
        ResMarkAsReadActionComponent,
        EnabledBasketPersistenceActionComponent,
        DisabledBasketPersistenceActionComponent,
        CloseAndIndexActionComponent,
        UpdateAcknowledgementSendDateActionComponent,
        CreateAcknowledgementReceiptActionComponent,
        CloseMailActionComponent,
        UpdateDepartureDateActionComponent,
        SendExternalSignatoryBookActionComponent,
        SendExternalNoteBookActionComponent,
        ProcessActionComponent,
        RedirectActionComponent,
        SendShippingActionComponent,
        ViewDocActionComponent,
        FolderUpdateComponent,
        AddPrivateIndexingModelModalComponent,
        AttachmentShowModalComponent
    ],
    providers: [ HeaderService, FiltersListService, FoldersService, NotificationService, PrivilegeService ],
    bootstrap: [ AppComponent ]
})
export class AppModule { }
