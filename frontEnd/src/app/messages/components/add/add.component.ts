import {Component, OnInit, DoCheck} from '@angular/core';
import { Router, ActivatedRoute, Params } from "@angular/router";
import { GLOBAL } from "../../../services/global";
import { FollowService } from "../../../services/follow.service";
import { MessageService } from "../../../services/message.service";
import { Message }  from "../../../models/message";
import { Follow } from "../../../models/follow";
import { UserService } from "../../../services/user.service";
import { User } from "../../../models/user";


@Component({
    selector: "add",
    templateUrl: "./add.component.html",
    providers: [MessageService, FollowService, UserService]
})
export class AddComponent implements OnInit {
    public title: string;

    public message: Message;
    public identity;
    public token;
    public url: string = GLOBAL.url;

    public follows: Follow[] = [];
    public status: string = "";


    constructor(        
        private _route: ActivatedRoute,
        private _router: Router,
        private _messageService: MessageService,
        private _followService: FollowService,
        private _userService: UserService
    ){
        this.message = new Message("", "", false, "", "", "");
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.message.emmiter = this.identity != null ? this.identity._id : "";
        
        this.url = GLOBAL.url;
        
        this.title = "Enviar mensaje";
    }

    ngOnInit(): void {
        console.log("AddComponent inicializado");
        this.getMyFollows()
    }

    onSubmit(form: any) {
        this._messageService.sendMessage(this.token, this.message).subscribe(
            response => {
                if (response.message) {
                    this.status = "success";
                    form.reset();
                } else {
                    this.status = "error";
                }
            }
            , error => {
                console.log(<any>error);
                console.log(error.message)
                if (error.message) {
                    this.status = "error";
                }   
            }
        )
    }

    getMyFollows() {
        this._followService.getMyFollows(this.token).subscribe(
            response => {
                this.follows = response.follows;
            },
            error => {
                console.log(<any>error);
            }
        )
    }
}