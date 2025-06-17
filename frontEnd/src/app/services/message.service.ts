import { Injectable } from '@angular/core';
import {GLOBAL} from './global';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs';
import { Message } from '../models/message';

@Injectable()
export class MessageService {
    public url: string;

    constructor(private http: HttpClient) {
        this.url = GLOBAL.url;
    }

    sendMessage(token: string, message: Message): Observable<any> {
        let params = JSON.stringify(message);
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                      .set('Authorization', token);

        return this.http.post(this.url + 'message', params, { headers: headers });
    }

    getMyMessages(token: string, page: number = 1): Observable<any> {
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                      .set('Authorization', token);

        return this.http.get(this.url + 'my-messages/' + page, { headers: headers });
    }


    getEmmitedMessages(token: string, page: number = 1): Observable<any> {
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                      .set('Authorization', token);

        return this.http.get(this.url + 'messages/' + page, { headers: headers });
    }

}