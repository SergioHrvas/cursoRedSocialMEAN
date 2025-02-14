import {Injectable} from '@angular/core';
import {GLOBAL} from './global';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs';

@Injectable()
export class PublicationService{
    public url:string;
    
    constructor(public _http: HttpClient){
        this.url = GLOBAL.url;
    }

    addPublication(token: any, publication: any): Observable<any>{
        let params = JSON.stringify(publication);
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                       .set('Authorization', token);

        return this._http.post(this.url + 'publication', params, {headers: headers})
    }

    getPublications(token: any, page = 1): Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                       .set('Authorization', token);

        return this._http.get(this.url + 'get-publications/' + page, {headers: headers})
    }

    deletePublication(token: any, id: any): Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                        .set('Authorization', token);
        return this._http.delete(this.url + 'publication/' + id, {headers: headers})
    }
}