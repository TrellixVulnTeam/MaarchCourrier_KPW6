import { Injectable } from '@angular/core';
import { LANG } from '../app/translate.component';
import { HeaderService } from './header.service';

interface menu {
    'id': string, // identifier
    'label': string, // title
    'comment': string, // description
    'route': string, // navigate to interface
    'style': string, // icon used interface
    'unit': string, //category of administration
    'angular': boolean, // to navigate in V1 <=>V2
    'shortcut': boolean // show in panel
}

interface administration {
    'id': string, // identifier
    'label': string, // title
    'comment': string, // description
    'route': string, // navigate to interface
    'style': string, //icone used interface
    'unit': 'organisation' | 'classement' | 'production' | 'supervision' //category of administration
    'angular': boolean //to navigate in V1 <=>V2
}

interface privilege {
    'id': string, // identifier
    'label': string, // title
    'unit': string //category of administration
    'comment': string, // description
}

@Injectable()
export class PrivilegeService {

    lang: any = LANG;

    private administrations: administration[] = [
        {
            "id": "admin_users",
            "label": this.lang.users,
            "comment": this.lang.adminUsersDesc,
            "route": "/administration/users",
            "unit": "organisation",
            "style": "fa fa-user",
            "angular" : true
        },
        {
            "id": "admin_groups",
            "label": this.lang.groups,
            "comment": this.lang.adminGroupsDesc,
            "route": "/administration/groups",
            "unit": "organisation",
            "style": "fa fa-users",
            "angular" : true
        },
        {
            "id": "manage_entities",
            "label": this.lang.entities,
            "comment": this.lang.adminEntitiesDesc,
            "route": "/administration/entities",
            "unit": "organisation",
            "style": "fa fa-sitemap",
            "angular" : true
        },
        {
            "id": "admin_listmodels",
            "label": this.lang.workflowModels,
            "comment": this.lang.adminWorkflowModelsDesc,
            "route": "/administration/diffusionModels",
            "unit": "organisation",
            "style": "fa fa-th-list",
            "angular" : true
        },
        {
            "id": "admin_architecture",
            "label": this.lang.documentTypes,
            "comment": this.lang.adminDocumentTypesDesc,
            "route": "/administration/doctypes",
            "unit": "classement",
            "style": "fa fa-suitcase",
            "angular" : true
        },
        {
            "id": "admin_tag",
            "label": this.lang.tags,
            "comment": this.lang.adminTagsDesc,
            "route": "index.php?page=manage_tag_list_controller&module=tags",
            "unit": "classement",
            "style": "fa fa-tags",
            "angular" : false
        },
        {
            "id": "admin_baskets",
            "label": this.lang.baskets,
            "comment": this.lang.adminBasketsDesc,
            "route": "/administration/baskets",
            "unit": "production",
            "style": "fa fa-inbox",
            "angular" : true
        },
        {
            "id": "admin_status",
            "label": this.lang.statuses,
            "comment": this.lang.statusesAdmin,
            "route": "/administration/statuses",
            "unit": "production",
            "style": "fa fa-check-circle",
            "angular" : true
        },
        {
            "id": "admin_actions",
            "label": this.lang.actions,
            "comment": this.lang.actionsAdmin,
            "route": "/administration/actions",
            "unit": "production",
            "style": "fa fa-exchange-alt",
            "angular" : true
        },
        {
            "id": "admin_contacts",
            "label": this.lang.contacts,
            "comment": this.lang.contactsAdmin,
            "route": "index.php?page=admin_contacts&admin=contacts",
            "unit": "production",
            "style": "fa fa-book",
            "angular" : false
        },
        {
            "id": "admin_priorities",
            "label": this.lang.prioritiesAlt,
            "comment": this.lang.prioritiesAlt,
            "route": "/administration/priorities",
            "unit": "production",
            "style": "fa fa-clock",
            "angular" : true
        },
        {
            "id": "admin_templates",
            "label": this.lang.templates,
            "comment": this.lang.templatesAdmin,
            "route": "/administration/templates",
            "unit": "production",
            "style": "fa fa-file-alt",
            "angular" : true
        },
        {
            "id": "admin_indexing_models",
            "label": this.lang.indexingModels,
            "comment": this.lang.indexingModels,
            "route": "/administration/indexingModels",
            "unit": "production",
            "style": "fab fa-wpforms",
            "angular" : true
        },
        {
            "id": "admin_custom_fields",
            "label": this.lang.customFieldsAdmin,
            "comment": this.lang.customFieldsAdmin,
            "route": "/administration/customFields",
            "unit": "production",
            "style": "fa fa-code",
            "angular" : true
        },
        {
            "id": "admin_notif",
            "label": this.lang.notifications,
            "comment": this.lang.notificationsAdmin,
            "route": "/administration/notifications",
            "unit": "production",
            "style": "fa fa-bell",
            "angular" : true
        },
        {
            "id": "update_status_mail",
            "label": this.lang.updateStatus,
            "comment": this.lang.updateStatus,
            "route": "/administration/update-status",
            "unit": "supervision",
            "style": "fa fa-envelope-square",
            "angular" : true
        },
        {
            "id": "admin_docservers",
            "label": this.lang.docservers,
            "comment": this.lang.docserversAdmin,
            "route": "/administration/docservers",
            "unit": "supervision",
            "style": "fa fa-hdd",
            "angular" : true
        },
        {
            "id": "admin_parameters",
            "label": this.lang.parameters,
            "comment": this.lang.parameters,
            "route": "/administration/parameters",
            "unit": "supervision",
            "style": "fa fa-wrench",
            "angular" : true
        },
        {
            "id": "admin_password_rules",
            "label": this.lang.securities,
            "comment": this.lang.securities,
            "route": "/administration/securities",
            "unit": "supervision",
            "style": "fa fa-lock",
            "angular" : true
        },
        {
            "id": "admin_email_server",
            "label": this.lang.emailServerParam,
            "comment": this.lang.emailServerParamDesc,
            "route": "/administration/sendmail",
            "unit": "supervision",
            "style": "fa fa-mail-bulk",
            "angular" : true
        },
        {
            "id": "admin_shippings",
            "label": this.lang.mailevaAdmin,
            "comment": this.lang.mailevaAdminDesc,
            "route": "/administration/shippings",
            "unit": "supervision",
            "style": "fa fa-shipping-fast",
            "angular" : true
        },
        {
            "id": "admin_reports",
            "label": this.lang.reports,
            "comment": this.lang.reportsAdmin,
            "route": "/administration/reports",
            "unit": "supervision",
            "style": "fa fa-chart-area",
            "angular" : true
        },
        {
            "id": "view_history",
            "label": this.lang.history,
            "comment": this.lang.viewHistoryDesc,
            "route": "/administration/history",
            "unit": "supervision",
            "style": "fa fa-history",
            "angular" : true
        },
        {
            "id": "view_history_batch",
            "label": this.lang.historyBatch,
            "comment": this.lang.historyBatchAdmin,
            "route": "/administration/history",
            "unit": "supervision",
            "style": "fa fa-history",
            "angular" : true
        },
        {
            "id": "admin_update_control",
            "label": this.lang.updateControl,
            "comment": this.lang.updateControlDesc,
            "route": "/administration/versions-update",
            "unit": "supervision",
            "style": "fa fa-sync",
            "angular" : true
        }
    ];

    private privileges: privilege[] = [
        {
            "id": "view_doc_history",
            "label": this.lang.viewDocHistory,
            "comment": this.lang.viewHistoryDesc,
            "unit": 'application'
        },
        {
            "id": "view_full_history",
            "label": this.lang.viewFullHistory,
            "comment": this.lang.viewFullHistoryDesc,
            "unit": 'application'
        },
        {
            "id": "edit_document_in_detail",
            "label": this.lang.editDocumentInDetail,
            "comment": this.lang.editDocumentInDetailDesc,
            "unit": 'application'
        },
        {
            "id": "delete_document_in_detail",
            "label": this.lang.deleteDocumentInDetail,
            "comment": this.lang.deleteDocumentInDetail,
            "unit": 'application'
        },
        {
            "id": "manage_tags_application",
            "label": this.lang.manageTagsInApplication,
            "comment": this.lang.manageTagsInApplicationDesc,
            "unit": 'application'
        },
        {
            "id": "update_diffusion_indexing",
            "label": this.lang.updateDiffusionWhileIndexing,
            "comment": this.lang.updateDiffusionWhileIndexing,
            "unit": 'application'
        },
        {
            "id": "update_diffusion_except_recipient_indexing",
            "label": this.lang.updateDiffusionExceptRecipientWhileIndexing,
            "comment": this.lang.updateDiffusionExceptRecipientWhileIndexing,
            "unit": 'application'
        },
        {
            "id": "update_diffusion_details",
            "label": this.lang.updateDiffusionWhileDetails,
            "comment": this.lang.updateDiffusionWhileDetails,
            "unit": 'application'
        },
        {
            "id": "update_diffusion_except_recipient_details",
            "label": this.lang.updateDiffusionExceptRecipientWhileDetails,
            "comment": this.lang.updateDiffusionExceptRecipientWhileDetails,
            "unit": 'application'
        },
        {
            "id": "sendmail",
            "label": this.lang.sendmail,
            "comment": this.lang.sendmail,
            "unit": 'application'
        },
        {
            "id": "use_mail_services",
            "label": this.lang.useMailServices,
            "comment": this.lang.useMailServices,
            "unit": 'application'
        },
        {
            "id": "view_documents_with_notes",
            "label": this.lang.viewDocumentsWithNotes,
            "comment": this.lang.viewDocumentsWithNotesDesc,
            "unit": 'application'
        },
        {
            "id": "view_technical_infos",
            "label": this.lang.viewTechnicalInformation,
            "comment": this.lang.viewTechnicalInformation,
            "unit": 'application'
        },
        {
            "id": "config_avis_workflow",
            "label": this.lang.configAvisWorkflow,
            "comment": this.lang.configAvisWorkflowDesc,
            "unit": 'application'
        },
        {
            "id": "config_avis_workflow_in_detail",
            "label": this.lang.configAvisWorkflowInDetail,
            "comment": this.lang.configAvisWorkflowInDetailDesc,
            "unit": 'application'
        },
        {
            "id": "avis_documents",
            "label": this.lang.avisAnswer,
            "comment": this.lang.avisAnswerDesc,
            "unit": 'application'
        },
        {
            "id": "config_visa_workflow",
            "label": this.lang.configVisaWorkflow,
            "comment": this.lang.configVisaWorkflowDesc,
            "unit": 'application'
        },
        {
            "id": "config_visa_workflow_in_detail",
            "label": this.lang.configVisaWorkflowInDetail,
            "comment": this.lang.configVisaWorkflowInDetailDesc,
            "unit": 'application'
        },
        {
            "id": "visa_documents",
            "label": this.lang.visaAnswers,
            "comment": this.lang.visaAnswersDesc,
            "unit": 'application'
        },
        {
            "id": "sign_document",
            "label": this.lang.signDocs,
            "comment": this.lang.signDocs,
            "unit": 'application'
        },
        {
            "id": "modify_visa_in_signatureBook",
            "label": this.lang.modifyVisaInSignatureBook,
            "comment": this.lang.modifyVisaInSignatureBookDesc,
            "unit": 'application'
        },
        {
            "id": "use_date_in_signBlock",
            "label": this.lang.useDateInSignBlock,
            "comment": this.lang.useDateInSignBlockDesc,
            "unit": 'application'
        },
        {
            "id": "print_folder_doc",
            "label": this.lang.printFolderDoc,
            "comment": this.lang.printFolderDoc,
            "unit": 'application'
        }
    ];

    private menus: menu[] = [
        {
            "id": "admin",
            "label": this.lang.administration,
            "comment": this.lang.administration,
            "route": "/administration",
            "style": "fa fa-cogs",
            "unit": "application",
            "angular": true,
            'shortcut' : true
        },
        {
            "id": "adv_search_mlb",
            "label": this.lang.search,
            "comment": this.lang.search,
            "route": "index.php?page=search_adv&dir=indexing_searching",
            "style": "fa fa-search",
            "unit": "application",
            "angular": false,
            'shortcut' : true
        },
        {
            "id": "entities_print_sep_mlb",
            "label": this.lang.entitiesSeparator,
            "comment": this.lang.entitiesSeparator,
            "route": "/separators/print",
            "style": "fa fa-print",
            "unit": "entities",
            "angular": true,
            'shortcut' : false
        },
        {
            "id": "reports",
            "label": this.lang.reports,
            "comment": this.lang.reports,
            "route": "index.php?page=reports&module=reports",
            "style": "fa fa-chart-area",
            "unit": "reports",
            "angular": false,
            'shortcut' : false
        },
        {
            "id": "save_numeric_package",
            "label": this.lang.saveNumericPackage,
            "comment": this.lang.saveNumericPackage,
            "route": "/saveNumericPackage",
            "style": "fa fa-file-archive",
            "unit": "sendmail",
            "angular": true,
            'shortcut' : false
        }
    ];

    constructor(public headerService: HeaderService) { }

    getPrivileges() {
        return this.privileges;
    }

    getUnitsPrivileges(): Array<string> {
        return this.privileges.map(elem => elem.unit).filter((elem, pos, arr) => arr.indexOf(elem) === pos);
    }

    getPrivilegesByUnit(unit: string): Array<privilege> {
        return this.privileges.filter(elem => elem.unit === unit);
    }

    getMenus(): Array<menu> {
        return this.menus;
    }

    getCurrentUserMenus() {
        return this.menus.filter(elem => this.headerService.user.privileges.indexOf(elem.id) > -1);
    }

    getMenusByUnit(unit: string): Array<menu> {
        return this.menus.filter(elem => elem.unit === unit);
    }

    getUnitsMenus(): Array<string> {
        return this.menus.map(elem => elem.unit).filter((elem, pos, arr) => arr.indexOf(elem) === pos);
    }

    getShortcuts(): Array<menu> {
        let shortcuts: any[] = [
            {
                "id": "home",
                "label": this.lang.home,
                "comment": this.lang.home,
                "route": "/home",
                "style": "fa fa-home",
                "unit": "application",
                "angular": true,
                "shortcut" : true
            }
        ];
        
        shortcuts = shortcuts.concat(this.menus.filter(elem => elem.shortcut === true));

        if (this.headerService.user.groups.filter((group: any) => group.can_index === true).length > 0) {
            const indexingGroups: any[] = [];

            this.headerService.user.groups.filter((group: any) => group.can_index === true).forEach((group: any) => {
                indexingGroups.push({
                    id: group.id,
                    label: group.group_desc
                });
            });

            const indexingShortcut: any = {
                "id": "indexing",
                "label": this.lang.indexing,
                "comment": this.lang.indexing,
                "route": "/indexing",
                "style": "fa fa-file-medical",
                "unit": "application",
                "angular": true,
                'shortcut' : true,
                "groups": indexingGroups
            };
            shortcuts.push(indexingShortcut);
        }

        return shortcuts;
    }

    getAdministrations(): Array<administration> {
        return this.administrations;
    }

    getCurrentUserAdministrationsByUnit(unit: string): Array<administration> {
        return this.administrations.filter(elem => elem.unit === unit).filter(elem => this.headerService.user.privileges.indexOf(elem.id) > -1);
    }
}
