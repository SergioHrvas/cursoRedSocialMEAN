import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs'
import { User } from '../models/user'
import { GLOBAL } from './global'

@Injectable()
export class UserService{
    public url:string;
    public identity: any;
    public token: string;

    constructor(public _http: HttpClient){
        this.url = GLOBAL.url;
        this.token = "";
        this.identity = null;
    }



    saveUser(user_to_register: User): Observable<any>{
        //Convertimos el objeto usuario en JSON
        let params = JSON.stringify(user_to_register);

        let headers = new HttpHeaders().set('Content-Type', 'application/json')
        return this._http.post(this.url+"register", params, {headers: headers})
        
    }

    loginUser(user: User, gettoken = null): Observable<any>{
        if(user != null){
            user.gettoken = gettoken;
        }
        //Convertimos el objeto usuario en JSON
        let params = JSON.stringify(user);

        let headers = new HttpHeaders().set('Content-Type', 'application/json')
        return this._http.post(this.url+"login", params, {headers: headers})   
    }

    getIdentity(){
        var item = null;
        if (typeof localStorage !== 'undefined') {
            item = localStorage.getItem('Identity');
        } else if (typeof sessionStorage !== 'undefined') {
            item = sessionStorage.getItem('Identity');
          } else {
            // If neither localStorage nor sessionStorage is supported
            console.log('Web Storage is not supported in this environment.');
          }
        
        console.log("Aaa: "+  item);
        var identity = item != null ? JSON.parse(item) : JSON.parse("null");

        if(identity != "undefined"){
            this.identity = identity;
        }
        else{
            this.identity = null;
        }
        return this.identity;
    }

    getToken(){
        var item;
        if (typeof localStorage !== 'undefined') {
            item = localStorage.getItem('Token');
        } else if (typeof sessionStorage !== 'undefined') {
            item = sessionStorage.getItem('Token');
          } else {
            // If neither localStorage nor sessionStorage is supported
            console.log('Web Storage is not supported in this environment.');
          }
        
        var token = item != null ? JSON.parse(item) : JSON.parse("null");

        if(token != "undefined"){
            this.token = token;
        }
        else{
            this.token = "";
        }
        return this.token;
    }

}
