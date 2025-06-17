import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { UserService } from "../../services/user.service";
import { GLOBAL } from "../../services/global";
import { FollowService } from "../../services/follow.service";
import { User } from "../../models/user";

@Component({
    selector: 'seguidores',
    templateUrl: './followed.component.html',
    providers: [UserService, FollowService]
})
export class FollowedComponent implements OnInit{
    public title: String;
    
    public user: User = new User(
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
    )

    public identity;
    public token;

    public page;

    public total;
    
    public next_page;
    public prev_page;
    
    public pages;

    public status: String = "success"

    public url: string = GLOBAL.url;

    public followed: any[] = []
    
    public follows: string[] = []

    public followUserOver: any;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _followService: FollowService

    ){
        this.title = "Usuarios seguidores de "
        this.identity = _userService.getIdentity()
        this.token = _userService.getToken()
        this.page = 1;
        this.next_page = 2;
        this.prev_page = 1;
        this.total = 0;
        this.pages = 1;
    }

    ngOnInit() {
        console.log("El componente de seguidores ha sido inicializado")
        
        this.actualPage()
    }

    actualPage(): void{
        this._route.params.subscribe(params => {
            
            let user_id = params['id'];

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
    
            this.getUser(user_id, page);
            

        })

    }

    getUser(user_id: any, page: any){
        this._userService.getUser(user_id).subscribe(
            response => {
                if (response && response.user) {
                    this.user.username = response.user.username;
                    // Return user list
                    this.getFollows(user_id, page)
                } else {
                    this.status = 'error';
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
    
    getFollows(user_id: any = 0, page: any = 1){
        this._followService.getFollowed(this.token, user_id, page).subscribe(
            response => {
                if (response && response.follows) {
                    this.followed = response.follows;
                    console.log(this.followed);
                    this.total = response.total;
                    this.pages = response.pages;
                    this.follows = response.users_following;

                    if(page > this.pages){
                        this._router.navigate(['/seguidores/', user_id, 1])
                    }
                } else {
                    // Asigna un array vacío para evitar errores en la vista
                    this.followed = [];
                    this.total = 0;
                    this.status = 'error';

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

    mouseLeave(){
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