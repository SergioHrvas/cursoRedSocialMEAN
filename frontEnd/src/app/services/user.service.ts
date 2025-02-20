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
    public stats: any;
    
    constructor(public _http: HttpClient){
        this.url = GLOBAL.url;
        this.token = "";
        this.identity = null;
        this.stats = null;
        
    }



    saveUser(user_to_register: User): Observable<any>{
        //Convertimos el objeto usuario en JSON
        let params = JSON.stringify(user_to_register);

        let headers = new HttpHeaders().set('Content-Type', 'application/json')
        return this._http.post(this.url+"register", params, {headers: headers})
        
    }

    loginUser(user: any, gettoken = null): Observable<any>{
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
        if (typeof window !== 'undefined' && localStorage) {
            item = localStorage.getItem('Identity');
        } 
        
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
        if (typeof window !== 'undefined' && localStorage) {
            item = localStorage.getItem('Token');
        } 
        var token = item != null ? JSON.parse(item) : null;

        if(token != null){
            this.token = token;
        }
        else{
            this.token = "";
        }

        return this.token;
    }

    getStats(){
        if (typeof window !== 'undefined' && localStorage) {
            let stats_local = localStorage.getItem('stats');
            let stats = stats_local != null ? JSON.parse(stats_local) : JSON.parse("{}");
        
            if(stats != "undefined"){
                this.stats = stats;
            }else{
                this.stats = null;
            }
        }
        return this.stats;


    }

    getCounters(userId = null): Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/json').set("Authorization", this.getToken());

        if(userId != null){
            return this._http.get(this.url+"follow-counters/"+ userId, {headers: headers});
        }else{
            return this._http.get(this.url+"follow-counters/", {headers: headers});
        }
    }

    updateUser(user_to_register: User): Observable<any>{
        //Convertimos el objeto usuario en JSON
        let params = JSON.stringify(user_to_register);

        let headers = new HttpHeaders().set('Content-Type', 'application/json').set("Authorization", this.getToken());

        return this._http.put(this.url+"update-user/" + user_to_register._id, params, {headers: headers})
        
    }


    getUsers(page = null): Observable<any>{
        const url = `${this.url}users/${page}/10`;
        
        let headers = new HttpHeaders().set('Content-Type', 'application/json').set("Authorization", this.getToken());
 
        return this._http.get(this.url + 'users/' + page + '/' + 10, {headers: headers})
    }

    getUser(id: string): Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/json').set("Authorization", this.getToken());


        return this._http.get(this.url + 'user/' + id, {headers: headers})

    }
}