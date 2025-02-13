import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { User } from "../../models/user";
import { Publication } from "../../models/publication";

import { UserService } from "../../services/user.service";
import { GLOBAL } from "../../services/global";
import { FollowService } from "../../services/follow.service";
import { Follow } from "../../models/follow";

@Component({
    selector: 'timeline',
    templateUrl: './timeline.component.html',
    providers: [UserService, FollowService]
})
export class TimelineComponent implements OnInit{
    public title: String;
    
    public identity;
    public token;

    public page;

    public total;
    
    public next_page;
    public prev_page;
    
    public pages;

    public status: String = "success"

    public url: string = GLOBAL.url;

    public publications: any[] = []
    
    public followUserOver: any;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _followService: FollowService

    ){
        this.title = "TIMELINE"
        this.identity = _userService.getIdentity()
        this.token = _userService.getToken()
        this.page = 1;
        this.next_page = 2;
        this.prev_page = 1;
        this.total = 0;
        this.pages = 1;
    }

    ngOnInit() {
        console.log("El componente de timeline ha sido inicializado")
        
        this.actualPage()
    }

    actualPage(): void{
        this._route.params.subscribe(params => {
            
            let page =  +params['page'];

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
    
    
                // Return user list
                this.getUsers(page)
    
        })

    }
    
    getUsers(page: any = 1){
        this._userService.getUsers(page).subscribe(
            response => {
                if (response && response.users) {
                    this.publications = response.publications;
                    this.total = response.total;

                    this.pages = response.pages;


                    if(page > this.pages){
                        this._router.navigate(['/usuarios/', 1])
                    }
                } else {
                    // Asigna un array vacío para evitar errores en la vista
                    this.publications = [];
                    this.total = 0;

                }
            },
            error => {
                if (typeof window !== 'undefined'){
                    console.log(<any>error);
                }
                if(<any>error != null){
                    this.status = 'error';
                }
            }
        )
    }


}