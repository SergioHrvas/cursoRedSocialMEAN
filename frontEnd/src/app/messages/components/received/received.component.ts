import {Component, OnInit, DoCheck} from '@angular/core';
import { Router, ActivatedRoute, Params } from "@angular/router";
import { GLOBAL } from "../../../services/global";
import { FollowService } from "../../../services/follow.service";
import { MessageService } from "../../../services/message.service";
import { Message }  from "../../../models/message";
import { Follow } from "../../../models/follow";
import { UserService } from "../../../services/user.service";
import moment from 'moment';

@Component({
    selector: "received",
    templateUrl: "./received.component.html",
    providers: [MessageService, FollowService, UserService]
})
export class ReceivedComponent implements OnInit {
    public title: string;

    public messages: Message[] = [];
    public identity;
    public token;
    public url: string = GLOBAL.url;

    public follows: Follow[] = [];
    public status: string = "";


    public page;

    public total;
    
    public next_page;
    public prev_page;
    
    public pages;

    constructor(        
        private _route: ActivatedRoute,
        private _router: Router,
        private _messageService: MessageService,
        private _followService: FollowService,
        private _userService: UserService
    ){
        this.messages = []
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        
        this.url = GLOBAL.url;
        
        this.title = "Mensajes recibidos";

        this.page = 1;
        this.next_page = 2;
        this.prev_page = 1;
        this.total = 0;
        this.pages = 1;
    }

    ngOnInit(): void {
        console.log("ReceivedComponent inicializado");
        this.actualPage();
    }


    actualPage(): void{
        this._route.params.subscribe(params => {
        
            let page = +params['page'];

            this.page = page;

            
            if(!page){
                this.page = 1;
                page = 1;
            }
            else{
                this.next_page = this.page + 1;
                this.prev_page = this.page - 1;
    
                if (this.prev_page <= 0){
                    this.prev_page = 1;
                }
            }
    
            this.getMessages(this.page);

        })

    }

    isRecent(date: string | number): boolean{
        let mDate: moment.Moment;

        if (typeof date === 'number' || typeof date === 'string') {
          const dateStr = String(date);
          mDate = dateStr.length === 10 ? moment.unix(Number(date)) : moment(Number(date));
        } else {
          mDate = moment(date);
        }
    
        return moment().diff(mDate, 'days') < 7; // Si es menos de 7 días, retorna true
    }

    formatDate(date: string | number): string {
        let mDate: moment.Moment;
    
        if (typeof date === 'number' || typeof date === 'string') {
          const dateStr = String(date);
          mDate = dateStr.length === 10 ? moment.unix(Number(date)) : moment(Number(date));
        } else {
          mDate = moment(date);
        }
    
        return mDate.locale('es').format('LL'); // Ejemplo: "14 de marzo de 2025"
    }
    
    
    getMessages(page: number): void {
        this._messageService.getMyMessages(this.token, page).subscribe(
            response => {   
                if (response.messages) {
                    this.messages = response.messages;
                    this.status = "success";
                    this.total = response.total;
                    this.pages = response.pages;

                }
                else {
                    this.status = "error";
                }
            },
            error => {
                this.status = "error";
                console.error(<any>error);
            }
        )
    }

}