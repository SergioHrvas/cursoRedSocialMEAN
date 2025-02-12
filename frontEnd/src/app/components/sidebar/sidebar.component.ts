import {Component, OnInit} from '@angular/core';
import { UserService } from '../../services/user.service';
import { GLOBAL } from '../../services/global';

@Component({
    selector: 'sidebar',
    templateUrl: './sidebar.component.html',
    providers: [UserService]
})
export class SidebarComponent implements OnInit{
    public url = GLOBAL.url;
    public identity: any;
    public token: any
    public status: string;
    public stats: any;

    constructor(
        private _userService: UserService
    ){
        this.identity = this._userService.getIdentity();
        this.status = 'success';
        this.token = this._userService.getToken();
        this.stats = this._userService.getStats();
    }

    ngOnInit(): void {
        console.log('sidebar.component cargado correctamente');
        console.log(this.stats)
    }
}