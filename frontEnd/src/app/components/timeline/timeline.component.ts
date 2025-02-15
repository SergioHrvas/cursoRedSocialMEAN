import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { User } from "../../models/user";
import { Publication } from "../../models/publication";

import { UserService } from "../../services/user.service";
import { GLOBAL } from "../../services/global";
import { FollowService } from "../../services/follow.service";
import { Follow } from "../../models/follow";
import { PublicationService } from "../../services/publication.service";

@Component({
    selector: 'timeline',
    templateUrl: './timeline.component.html',
    providers: [UserService, PublicationService]
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
        private _publicationService: PublicationService

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
        
        this.getPublications()
    }


    getPublications(page: any = 1, adding: boolean = false){
        this._publicationService.getPublications(this.token, page).subscribe(
            response => {
                if (response && response.publications) {
                    this.total = response.total;
                    this.pages = response.pages;

                    if(adding){
                        this.page = page;
                        this.publications = this.publications.concat(response.publications);

                        // Scroll hacia abajo
                        $('html, body').animate({scrollTop: $('body').prop('scrollHeight')}, 500);
                    }
                    else{
                        this.publications = response.publications;
                    }



                } else {
                    // Asigna un array vacío para evitar errores en la vista
                    this.status='error';

                }
            },
            error => {
                var errorMessage = <any>error;
                
                if (typeof window !== 'undefined'){
                    console.log("error:" + <any>error);
                }
                
                if(errorMessage != null){
                    this.status = 'error';
                }
            }
        )
    }

    public noMore = false;
    viewMore(){
        if(this.publications.length == this.total){
            this.noMore = true;
        }
        else{
            this.page += 1;
            this.getPublications(this.page, true);

        }
    }
}