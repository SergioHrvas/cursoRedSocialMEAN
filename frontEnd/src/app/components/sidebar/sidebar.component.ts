import {Component, OnInit} from '@angular/core';
import { UserService } from '../../services/user.service';
import { PublicationService } from '../../services/publication.service';
import { GLOBAL } from '../../services/global';
import { Publication } from '../../models/publication';

@Component({
    selector: 'sidebar',
    templateUrl: './sidebar.component.html',
    providers: [UserService, PublicationService]
})
export class SidebarComponent implements OnInit{
    public url = GLOBAL.url;
    public identity: any;
    public token: any
    public status: string;
    public stats: any;
    public publication: Publication;
    constructor(
        private _userService: UserService,
        private _publicationService: PublicationService
    ){
        this.identity = this._userService.getIdentity();
        this.status = '';
        this.token = this._userService.getToken();
        this.stats = this._userService.getStats();
        this.publication = new Publication("", "", "", "", "");
        if(this.identity){
            this.publication.user = this.identity._id;
        }

    }

    ngOnInit(): void {
        console.log('sidebar.component cargado correctamente');
    }

    onSubmit(form: any){
        this._publicationService.addPublication(this.token, this.publication).subscribe(
            response => {
                if(response.publication){
                    this.status = 'success';   
                    form.reset();                 
                }else{
                    this.status = 'error';
                }
            },
            error => {
                var errorMessage = <any>error;
                console.log(errorMessage);
                if(errorMessage != null){
                    this.status = 'error';
                }
            }
        );
    }
    
    public filesToUpload: Array<File> = [];
    fileChangeEvent(fileInput: any){
        this.filesToUpload = <Array<File>>fileInput.target.files;
    }

    
}