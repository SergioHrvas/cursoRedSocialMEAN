import { Component, OnInit } from "@angular/core"
import {Router, ActivatedRoute, Params } from '@angular/router'
import { User } from "../../models/user";
import { UserService } from "../../services/user.service";
import { get } from "http";

@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    providers: [UserService]

})

export class LoginComponent implements OnInit{
    public title: string;
    public status: string;
    public user: User;
    public identity: any;
    public token: string;

    constructor(        
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService
    ){
        this.title = "Identifícate";
        this.status = "";
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
        this.identity = "";
        this.token = "";
    }
    
    ngOnInit(){
        console.log("Componente de login cargado");
    }
    

    onSubmit(form: any){
        this._userService.loginUser(this.user).subscribe(
            response => {
                this.identity = response.user;
                if(!this.identity || !this.identity._id){
                    this.status = "error";
                }else{
                    //PERSISTIR DATOS DEL USUARIO
                    if (typeof window !== 'undefined' && localStorage) {
                        localStorage.setItem('Identity', JSON.stringify(this.identity))
                    }
                    

                    //Conseguir token
                    this.getToken()
                }

            },
            error => {
                console.log(<any>error);
                if(<any>error != null){
                    this.status = 'error';
                }
            }
        );
    }
    
    getToken(){
        this._userService.loginUser(this.user, <any>'true').subscribe(
            response => {
                this.token = response.token;
                if(this.token.length <= 0){
                    this.status = "error";
                }else{
                    //PERSISTIR TOKEN DE USUARIO
                    if (typeof window !== 'undefined' && localStorage) {
                        localStorage.setItem('Token', JSON.stringify(this.token))
                    }

                    //Conseguir los contadores del usuario
                      this.getCounters();

                }

            },
            error => {
                console.log(<any>error);
                if(<any>error != null){
                    this.status = 'error';
                }
            }
        );
    }

    getCounters(){
        this._userService.getCounters().subscribe(
            response => {
                console.log(response)
                localStorage.setItem('stats', JSON.stringify(response))
                this.status = "success";

                this._router.navigate(['/']);

            },
            error =>{
                console.log(error);

            }
        );
    }
}