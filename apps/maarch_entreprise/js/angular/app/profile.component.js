"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/common/http");
var translate_component_1 = require("./translate.component");
var ProfileComponent = (function () {
    function ProfileComponent(http, zone) {
        var _this = this;
        this.http = http;
        this.zone = zone;
        this.lang = translate_component_1.LANG;
        this.user = {
            baskets: []
        };
        this.passwordModel = {
            currentPassword: "",
            newPassword: "",
            reNewPassword: "",
        };
        this.signatureModel = {
            base64: "",
            base64ForJs: "",
            name: "",
            type: "",
            size: 0,
            label: "",
        };
        this.mailSignatureModel = {
            selected: 0,
            htmlBody: "",
            title: "",
        };
        this.userAbsenceModel = [];
        this.showPassword = false;
        this.selectedSignature = -1;
        this.selectedSignatureLabel = "";
        this.loading = false;
        window['angularProfileComponent'] = {
            componentAfterUpload: function (base64Content) { return _this.processAfterUpload(base64Content); },
        };
    }
    ProfileComponent.prototype.prepareProfile = function () {
        $j('#inner_content').remove();
        $j('#menunav').hide();
        $j('#divList').remove();
        $j('#magicContactsTable').remove();
        $j('#manageBasketsOrderTable').remove();
        $j('#controlParamTechnicTable').remove();
        $j('#container').width("99%");
        if ($j('#content h1')[0] && $j('#content h1')[0] != $j('my-app h1')[0]) {
            $j('#content h1')[0].remove();
        }
        //LOAD EDITOR TINYMCE for MAIL SIGN
        tinymce.baseURL = "../../node_modules/tinymce";
        tinymce.suffix = '.min';
        tinymce.init({
            selector: "textarea#emailSignature",
            statusbar: false,
            language: "fr_FR",
            language_url: "tools/tinymce/langs/fr_FR.js",
            height: "200",
            plugins: [
                "textcolor"
            ],
            external_plugins: {
                'bdesk_photo': "../../apps/maarch_entreprise/tools/tinymce/bdesk_photo/plugin.min.js"
            },
            menubar: false,
            toolbar: "undo | bold italic underline | alignleft aligncenter alignright | bdesk_photo | forecolor",
            theme_buttons1_add: "fontselect,fontsizeselect",
            theme_buttons2_add_before: "cut,copy,paste,pastetext,pasteword,separator,search,replace,separator",
            theme_buttons2_add: "separator,insertdate,inserttime,preview,separator,forecolor,backcolor",
            theme_buttons3_add_before: "tablecontrols,separator",
            theme_buttons3_add: "separator,print,separator,ltr,rtl,separator,fullscreen,separator,insertlayer,moveforward,movebackward,absolut",
            theme_toolbar_align: "left",
            theme_advanced_toolbar_location: "top",
            theme_styles: "Header 1=header1;Header 2=header2;Header 3=header3;Table Row=tableRow1"
        });
    };
    ProfileComponent.prototype.updateBreadcrumb = function (applicationName) {
        if ($j('#ariane')[0]) {
            $j('#ariane')[0].innerHTML = "<a href='index.php?reinit=true'>" + applicationName + "</a> > Profil";
        }
    };
    ProfileComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.prepareProfile();
        this.updateBreadcrumb(angularGlobals.applicationName);
        this.coreUrl = angularGlobals.coreUrl;
        this.loading = true;
        this.http.get(this.coreUrl + 'rest/users/profile')
            .subscribe(function (data) {
            _this.user = data;
            setTimeout(function () {
                $j("#absenceUser").typeahead({
                    order: "asc",
                    display: "formattedUser",
                    templateValue: "{{user_id}}",
                    source: {
                        ajax: {
                            type: "GET",
                            dataType: "json",
                            url: _this.coreUrl + "rest/users/autocompleter",
                        }
                    }
                });
            }, 0);
            _this.loading = false;
        });
    };
    ProfileComponent.prototype.processAfterUpload = function (b64Content) {
        var _this = this;
        this.zone.run(function () { return _this.resfreshUpload(b64Content); });
    };
    ProfileComponent.prototype.resfreshUpload = function (b64Content) {
        if (this.signatureModel.size <= 2000000) {
            this.signatureModel.base64 = b64Content.replace(/^data:.*?;base64,/, "");
            this.signatureModel.base64ForJs = b64Content;
        }
        else {
            this.signatureModel.name = "";
            this.signatureModel.size = 0;
            this.signatureModel.type = "";
            this.signatureModel.base64 = "";
            this.signatureModel.base64ForJs = "";
            errorNotification("Taille maximum de fichier dépassée (2 MB)");
        }
    };
    ProfileComponent.prototype.displayPassword = function () {
        this.showPassword = !this.showPassword;
    };
    ProfileComponent.prototype.clickOnUploader = function (id) {
        $j('#' + id).click();
    };
    ProfileComponent.prototype.uploadSignatureTrigger = function (fileInput) {
        if (fileInput.target.files && fileInput.target.files[0]) {
            var reader = new FileReader();
            this.signatureModel.name = fileInput.target.files[0].name;
            this.signatureModel.size = fileInput.target.files[0].size;
            this.signatureModel.type = fileInput.target.files[0].type;
            if (this.signatureModel.label == "") {
                this.signatureModel.label = this.signatureModel.name;
            }
            reader.readAsDataURL(fileInput.target.files[0]);
            reader.onload = function (value) {
                window['angularProfileComponent'].componentAfterUpload(value.target.result);
            };
        }
    };
    ProfileComponent.prototype.displaySignatureEditionForm = function (index) {
        this.selectedSignature = index;
        this.selectedSignatureLabel = this.user.signatures[index].signature_label;
    };
    ProfileComponent.prototype.changeEmailSignature = function () {
        var index = $j("#emailSignaturesSelect").prop("selectedIndex");
        this.mailSignatureModel.selected = index;
        if (index > 0) {
            tinymce.get('emailSignature').setContent(this.user.emailSignatures[index - 1].html_body);
            this.mailSignatureModel.title = this.user.emailSignatures[index - 1].title;
        }
        else {
            tinymce.get('emailSignature').setContent("");
            this.mailSignatureModel.title = "";
        }
    };
    ProfileComponent.prototype.addBasketRedirection = function () {
        var index = $j("#selectBasketAbsenceUser option:selected").index();
        if (index > 0) {
            this.userAbsenceModel.push({
                "basketId": this.user.baskets[index - 1].basket_id,
                "basketName": this.user.baskets[index - 1].basket_name,
                "virtual": this.user.baskets[index - 1].is_virtual,
                "basketOwner": this.user.baskets[index - 1].basket_owner,
                "newUser": $j("#absenceUser")[0].value,
                "index": index - 1
            });
            this.user.baskets[index - 1].disabled = true;
            $j('#selectBasketAbsenceUser option:eq(0)').prop('selected', true);
            $j("#absenceUser")[0].value = "";
        }
    };
    ProfileComponent.prototype.delBasketRedirection = function (index) {
        this.user.baskets[this.userAbsenceModel[index].index].disabled = false;
        this.userAbsenceModel.splice(index, 1);
    };
    ProfileComponent.prototype.activateAbsence = function () {
        var _this = this;
        this.http.post(this.coreUrl + "rest/users/" + this.user.user_id + "/baskets/absence", this.userAbsenceModel)
            .subscribe(function () {
            _this.userAbsenceModel = [];
            location.search = "?display=true&page=logout&abs_mode";
        }, function (err) {
            errorNotification(err.error.errors);
        });
    };
    ProfileComponent.prototype.updatePassword = function () {
        var _this = this;
        this.http.put(this.coreUrl + 'rest/currentUser/password', this.passwordModel)
            .subscribe(function (data) {
            _this.showPassword = false;
            _this.passwordModel = {
                currentPassword: "",
                newPassword: "",
                reNewPassword: "",
            };
            successNotification(data.success);
        }, function (err) {
            errorNotification(err.error.errors);
        });
    };
    ProfileComponent.prototype.submitEmailSignature = function () {
        var _this = this;
        this.mailSignatureModel.htmlBody = tinymce.get('emailSignature').getContent();
        this.http.post(this.coreUrl + 'rest/currentUser/emailSignature', this.mailSignatureModel)
            .subscribe(function (data) {
            if (data.errors) {
                errorNotification(data.errors);
            }
            else {
                _this.user.emailSignatures = data.emailSignatures;
                _this.mailSignatureModel = {
                    selected: 0,
                    htmlBody: "",
                    title: "",
                };
                tinymce.get('emailSignature').setContent("");
                successNotification(data.success);
            }
        });
    };
    ProfileComponent.prototype.updateEmailSignature = function () {
        var _this = this;
        this.mailSignatureModel.htmlBody = tinymce.get('emailSignature').getContent();
        var id = this.user.emailSignatures[this.mailSignatureModel.selected - 1].id;
        this.http.put(this.coreUrl + 'rest/currentUser/emailSignature/' + id, this.mailSignatureModel)
            .subscribe(function (data) {
            if (data.errors) {
                errorNotification(data.errors);
            }
            else {
                _this.user.emailSignatures[_this.mailSignatureModel.selected - 1].title = data.emailSignature.title;
                _this.user.emailSignatures[_this.mailSignatureModel.selected - 1].html_body = data.emailSignature.html_body;
                successNotification(data.success);
            }
        });
    };
    ProfileComponent.prototype.deleteEmailSignature = function () {
        var _this = this;
        var r = confirm('Voulez-vous vraiment supprimer la signature de mail ?');
        if (r) {
            var id = this.user.emailSignatures[this.mailSignatureModel.selected - 1].id;
            this.http.delete(this.coreUrl + 'rest/currentUser/emailSignature/' + id)
                .subscribe(function (data) {
                if (data.errors) {
                    errorNotification(data.errors);
                }
                else {
                    _this.user.emailSignatures = data.emailSignatures;
                    _this.mailSignatureModel = {
                        selected: 0,
                        htmlBody: "",
                        title: "",
                    };
                    tinymce.get('emailSignature').setContent("");
                    successNotification(data.success);
                }
            });
        }
    };
    ProfileComponent.prototype.submitSignature = function () {
        var _this = this;
        this.http.post(this.coreUrl + "rest/users/" + this.user.id + "/signatures", this.signatureModel)
            .subscribe(function (data) {
            _this.user.signatures = data.signatures;
            _this.signatureModel = {
                base64: "",
                base64ForJs: "",
                name: "",
                type: "",
                size: 0,
                label: "",
            };
            successNotification(data.success);
        }, function (err) {
            errorNotification(err.error.errors);
        });
    };
    ProfileComponent.prototype.updateSignature = function () {
        var _this = this;
        var id = this.user.signatures[this.selectedSignature].id;
        this.http.put(this.coreUrl + "rest/users/" + this.user.id + "/signatures/" + id, { "label": this.selectedSignatureLabel })
            .subscribe(function (data) {
            _this.user.signatures[_this.selectedSignature].signature_label = data.signature.signature_label;
            _this.selectedSignature = -1;
            _this.selectedSignatureLabel = "";
            successNotification(data.success);
        }, function (err) {
            errorNotification(err.error.errors);
        });
    };
    ProfileComponent.prototype.deleteSignature = function (id) {
        var _this = this;
        var r = confirm('Voulez-vous vraiment supprimer la signature ?');
        if (r) {
            this.http.delete(this.coreUrl + "rest/users/" + this.user.id + "/signatures/" + id)
                .subscribe(function (data) {
                _this.user.signatures = data.signatures;
                successNotification(data.success);
            }, function (err) {
                errorNotification(err.error.errors);
            });
        }
    };
    ProfileComponent.prototype.onSubmit = function () {
        this.http.put(this.coreUrl + 'rest/users/profile', this.user)
            .subscribe(function (data) {
            successNotification(data.success);
        }, function (err) {
            errorNotification(err.error.errors);
        });
    };
    return ProfileComponent;
}());
ProfileComponent = __decorate([
    core_1.Component({
        templateUrl: angularGlobals.profileView,
        styleUrls: ['../../node_modules/bootstrap/dist/css/bootstrap.min.css', 'css/profile.component.css']
    }),
    __metadata("design:paramtypes", [http_1.HttpClient, core_1.NgZone])
], ProfileComponent);
exports.ProfileComponent = ProfileComponent;
