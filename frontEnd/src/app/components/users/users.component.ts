import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { User } from "../../models/user";
import { UserService } from "../../services/user.service";
import { GLOBAL } from "../../services/global";
import { FollowService } from "../../services/follow.service";
import { Follow } from "../../models/follow";

@Component({
    selector: 'users',
    templateUrl: './users.component.html',
    providers: [UserService, FollowService]
})
export class UsersComponent implements OnInit{
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

    public users: any[] = []
    
    public follows: string[] = []
    public followers: string[] = []

    public followUserOver: any;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _followService: FollowService

    ){
        this.title = "USUARIOS"
        this.identity = _userService.getIdentity()
        this.token = _userService.getToken()
        this.page = 1;
        this.next_page = 2;
        this.prev_page = 1;
        this.total = 0;
        this.pages = 1;
    }

    ngOnInit() {
        console.log("El componente de usuarios ha sido inicializado")
        
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
                    this.users = response.users;
                    this.total = response.total;

                    this.pages = response.pages;

                    this.follows = response.following

                    this.followers = response.followed

                    if(page > this.pages){
                        this._router.navigate(['/usuarios/', 1])
                    }
                } else {
                    // Asigna un array vacío para evitar errores en la vista
                    this.users = [];
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

    mouseEnter(user_id: any){
        this.followUserOver = user_id;
    }   

    mouseLeave(user_id: any){

        this.followUserOver = 0;
    }
    
    addFollow(user_to: any){
        this._followService.addFollow(this.token, user_to).subscribe(
            response => {
                if(!response){
                    this.status = 'error'
                }else{
                    this.status = 'success'
                    this.follows.push(user_to)
                }
            }
        )
    }

    deleteFollow(user_to: any){
        this._followService.deleteFollow(this.token, user_to).subscribe(
            response => {
                if(!response){
                    this.status = 'error'
                }
                else{
                    this.status = 'success'
                    let search = this.follows.indexOf(user_to)
                    if(search != -1){
                        this.follows.splice(search, 1)
                    }

                }
            }
        )   
    }

}