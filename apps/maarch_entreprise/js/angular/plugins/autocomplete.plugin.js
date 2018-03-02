"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var forms_1 = require("@angular/forms");
var startWith_1 = require("rxjs/operators/startWith");
var map_1 = require("rxjs/operators/map");
var AutoCompletePlugin = /** @class */ (function () {
    function AutoCompletePlugin(http, target) {
        var _this = this;
        this.http = http;
        this.userList = [];
        this.elemList = [];
        this.statusesList = [];
        this.coreUrl = angularGlobals.coreUrl;
        if (target.indexOf('users') != -1) {
            this.userCtrl = new forms_1.FormControl();
            this.http.get(this.coreUrl + 'rest/autocomplete/users')
                .subscribe(function (data) {
                _this.userList = data;
                _this.filteredUsers = _this.userCtrl.valueChanges
                    .pipe(startWith_1.startWith(''), map_1.map(function (user) { return user ? _this.autocompleteFilterUser(user) : _this.userList.slice(); }));
            }, function () {
                location.href = "index.php";
            });
        }
        if (target.indexOf('statuses') != -1) {
            this.statusCtrl = new forms_1.FormControl();
            this.http.get(this.coreUrl + 'rest/autocomplete/statuses')
                .subscribe(function (data) {
                _this.statusesList = data;
                _this.filteredStatuses = _this.statusCtrl.valueChanges
                    .pipe(startWith_1.startWith(''), map_1.map(function (status) { return status ? _this.autocompleteFilterStatuses(status) : _this.statusesList.slice(); }));
            }, function () {
                location.href = "index.php";
            });
        }
        if (target.indexOf('usersAndEntities') != -1) {
            this.elementCtrl = new forms_1.FormControl();
            this.elemList = [];
            this.http.get(this.coreUrl + 'rest/autocomplete/users')
                .subscribe(function (data) {
                _this.elemList = data;
                _this.http.get(_this.coreUrl + 'rest/autocomplete/entities')
                    .subscribe(function (data) {
                    _this.elemList = _this.elemList.concat(data);
                    _this.filteredElements = _this.elementCtrl.valueChanges
                        .pipe(startWith_1.startWith(''), map_1.map(function (elem) { return elem ? _this.autocompleteFilterElements(elem) : _this.elemList.slice(); }));
                }, function () {
                    location.href = "index.php";
                });
            }, function () {
                location.href = "index.php";
            });
        }
        if (target.indexOf('entities') != -1) {
            this.elementCtrl = new forms_1.FormControl();
            this.elemList = [];
            this.http.get(this.coreUrl + 'rest/autocomplete/entities')
                .subscribe(function (data) {
                _this.elemList = data;
                _this.filteredElements = _this.elementCtrl.valueChanges
                    .pipe(startWith_1.startWith(''), map_1.map(function (elem) { return elem ? _this.autocompleteFilterElements(elem) : _this.elemList.slice(); }));
            }, function () {
                location.href = "index.php";
            });
        }
        else if (target.indexOf('visaUsers') != -1) {
            this.userCtrl = new forms_1.FormControl();
            this.http.get(this.coreUrl + 'rest/autocomplete/users/visa')
                .subscribe(function (data) {
                _this.userList = data;
                _this.filteredUsers = _this.userCtrl.valueChanges
                    .pipe(startWith_1.startWith(''), map_1.map(function (user) { return user ? _this.autocompleteFilterUser(user) : _this.userList.slice(); }));
            }, function () {
                location.href = "index.php";
            });
        }
        else {
        }
    }
    AutoCompletePlugin.prototype.autocompleteFilterUser = function (name) {
        return this.userList.filter(function (user) {
            return user.idToDisplay.toLowerCase().indexOf(name.toLowerCase()) >= 0;
        });
    };
    AutoCompletePlugin.prototype.autocompleteFilterStatuses = function (name) {
        return this.statusesList.filter(function (status) {
            return status.idToDisplay.toLowerCase().indexOf(name.toLowerCase()) >= 0;
        });
    };
    AutoCompletePlugin.prototype.autocompleteFilterElements = function (name) {
        return this.elemList.filter(function (elem) {
            return elem.idToDisplay.toLowerCase().indexOf(name.toLowerCase()) >= 0;
        });
    };
    return AutoCompletePlugin;
}());
exports.AutoCompletePlugin = AutoCompletePlugin;
