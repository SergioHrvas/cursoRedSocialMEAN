import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs'
import { Follow } from '../models/follow'
import { GLOBAL } from './global'

@Injectable()
export class FollowService{
    public url:string;

    constructor(public _http: HttpClient){
        this.url = GLOBAL.url;
    }

    addFollow(token: any, id: any): Observable<any>{
        let params = JSON.stringify({followed: id});
        let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);
        return this._http.post(this.url+"follow", params, {headers: headers})
    }

    deleteFollow(token: any, id: any): Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);
        return this._http.delete(this.url+"unfollow/"+id, {headers: headers})    
    }

    getFollowing(token: any, user_id: any, page: number = 1): Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);

        var url = this.url+"get-following-users/";
        if(user_id != null){
            url = this.url+"get-following-users/"+user_id+"/"+page;
        }

        console.log(url)
        return this._http.get(url, {headers: headers})
    }
}