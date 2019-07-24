import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LANG } from '../translate.component';
import { MatSidenav } from '@angular/material';
import { AppService } from '../../service/app.service';

declare function $j(selector: any) : any;

@Component({
    selector: 'basket-home',
    templateUrl: "basket-home.component.html",
    styleUrls: ['basket-home.component.scss'],
})
export class BasketHomeComponent implements OnInit {

    lang: any = LANG;
    
    @Input() homeData: any;
    @Input('currentBasketInfo') currentBasketInfo: any = {
        ownerId: 0,
        groupId: 0,
        basketId: ''
    };
    @Input() snavL: MatSidenav;
    @Output('refreshEvent') refreshEvent = new EventEmitter<string>();

    constructor(
        public http: HttpClient,
        public appService: AppService
    ) {
    }

    ngOnInit(): void { }

    goTo(basketId:any, groupId:any) {
        window.location.href="index.php?page=view_baskets&fromV2=true&module=basket&baskets="+basketId+"&groupId="+groupId;
    }

    goToRedirect(basketId:any, owner:any, groupId:any) {
        window.location.href="index.php?page=view_baskets&fromV2=true&module=basket&baskets="+basketId+"_"+owner+"&groupId=" + groupId;
    }

    closePanelLeft() {
        if(this.appService.getViewMode()) {
            this.snavL.close();
        }
    }

    refreshDatas(basket: any) {
        this.refreshBasketHome();

        // AVOID DOUBLE REQUEST IF ANOTHER BASKET IS SELECTED
        if (this.currentBasketInfo.basketId == basket.id) {
            this.refreshEvent.emit();
        }
    }

    refreshBasketHome(){
        this.http.get("../../rest/home")
            .subscribe((data: any) => {
                this.homeData = data;
            });
    }
}
