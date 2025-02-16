import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { User } from "../../models/user";
import { Publication } from "../../models/publication";

import { UserService } from "../../services/user.service";
import { GLOBAL } from "../../services/global";
import { FollowService } from "../../services/follow.service";
import { Follow } from "../../models/follow";
import { PublicationService } from "../../services/publication.service";
import moment from "moment";

@Component({
    selector: 'timeline',
    templateUrl: './timeline.component.html',
    providers: [UserService, PublicationService]
})
export class TimelineComponent implements OnInit{
    public title: String;
    
    public identity;
    public token;



    public status: String = "success"

    public url: string = GLOBAL.url;

    
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

    }

    ngOnInit() {
        console.log("El componente de timeline ha sido inicializado")

    }

    messageFromSidebar: any = null;  // Variable para almacenar el mensaje

    handleSidebarEvent(event: any) {
      this.messageFromSidebar = event;  // Guardamos el objeto recibido
    }

    refreshPublications(event: any){
        this.messageFromSidebar = event;
    }

}