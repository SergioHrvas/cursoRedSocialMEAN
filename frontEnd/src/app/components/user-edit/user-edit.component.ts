import {Component, OnInit} from "@angular/core";
import {Router, ActivatedRoute, Params} from "@angular/router";
import { User } from "../../models/user";
import { UserService } from "../../services/user.service";
import { UploadFilesService } from '../../services/uploadfiles'
import { GLOBAL } from "../../services/global";

 
@Component({
    selector: "user-edit",
    templateUrl: "./user-edit.component.html",
    providers: [UserService, UploadFilesService]
})

export class UserEditComponent implements OnInit{
    public title: string;
    public user: User;
    public identity: any;
    public token: string;
    public status: string;
    public url: string;

    public changed: boolean = false;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _uploadFilesService: UploadFilesService
    ){
     this.title = "Actualizar mis datos";
     this.user = new User(
        "",
        "",
        "",
        "", 
        "",
        "",
        "ROLE_USER",
        "",
        "",
    )

     this.identity = this._userService.getIdentity();

     if(this.identity){
        this.user = this.identity
     }

     this.token = this._userService.getToken();
     this.status=""
     this.url = GLOBAL.url
    }

    ngOnInit(): void {
        console.log("Componente user-edit cargado")    
    }

    onSubmit(form: any){

        this._userService.updateUser(this.user).subscribe(
            response => {
                if(!response.user){
                    this.status = "error"
                }
                else{
                    this.status = "success"
                    this.identity = this.user;
                    //PERSISTIR DATOS DEL USUARIO
                    if (typeof localStorage !== 'undefined') {
                        localStorage.setItem('Identity', JSON.stringify(this.user))
                   } else {
                        // If neither localStorage nor sessionStorage is supported
                        console.log('Web Storage is not supported in this environment.');
                    }

                    if(this.changed){
                    //Subir imagen de usuario
                    this._uploadFilesService.makeFileRequest('upload-image-user/' + this.user._id, [], this.filesToUpload, this.token, 'image').
                        then((result: any) => {
                            this.user.image = result.user.image;
                            if (typeof localStorage !== 'undefined') {
                                localStorage.setItem('Identity', JSON.stringify(this.user))
                            }else {
                                // If neither localStorage nor sessionStorage is supported
                                console.log('Web Storage is not supported in this environment.');
                            }
                        }); 
                    }   
                }
            },
            error => {
                var errorMessage = <any>error;
                console.log(errorMessage);
                if(errorMessage != null){
                    this.status = "error";
                }
            }
        )
    }
    
    public filesToUpload: Array<File> = [];
    fileChangeEvent(fileInput: any){
        this.filesToUpload = <Array<File>>fileInput.target.files;
        this.changed = true;
    }
}