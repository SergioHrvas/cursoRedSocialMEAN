import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { User } from '../../models/user';
import { Follow } from '../../models/follow';

import { UserService } from '../../services/user.service';
import { FollowService } from '../../services/follow.service';

import { GLOBAL } from '../../services/global';

@Component({
  selector: 'profile',
  templateUrl: './profile.component.html',
  providers: [UserService, FollowService]
})
export class ProfileComponent implements OnInit {

    public title: string;
    public user: User;
    public status: string = "";
    public identity;
    public token;
    public stats;
    public url = GLOBAL.url;
    public following: boolean = false;
    public followed: boolean = false;
    public messageFromSidebar: any = "mensaje";  // Variable para almacenar el mensaje

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _followService: FollowService
    ) {
        this.title = 'Perfil';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.stats = this._userService.getStats();
        this.user = new User("", "", "", "", "", "", "", "", "");
    }

    ngOnInit() {
        console.log('profile.component cargado correctamente');

        this.getUser();
    }

    getUser(){
        var user_id = this._route.snapshot.params['id'];
        this._userService.getUser(user_id).subscribe(
            response => {
                if(response.user){
                    this.user = response.user;
                    this.getCounters(user_id);

                    if(response.following && response.following._id){
                        this.following = true;
                    }
                    if(response.followed && response.followed._id){
                        this.followed = true;
                    }

                }else{
                    this.status = 'error';
                    this._router.navigate(['/perfil', this.identity._id]);
                }
            }
        );

    }

    getCounters(userId: any){
        this._userService.getCounters(userId).subscribe(
            response => {
                this.stats = response;
            },
            error => {
                console.log(<any>error);
            }
        );
    }


    followUser(user_to: any){
        this._followService.addFollow(this.token, user_to).subscribe(
            response => {
                if(!response){
                    this.status = 'error'
                }else{
                    this.status = 'success'
                    this.following = true;
                }
            }
        )
    }

    unfollowUser(user_to: any){
        this._followService.deleteFollow(this.token, user_to).subscribe(
            response => {
                if(!response){
                    this.status = 'error'
                }else{
                    this.status = 'success'
                    this.following = false;
                }
            }
        )
    }
    
}