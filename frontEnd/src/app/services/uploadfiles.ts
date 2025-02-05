import {Injectable} from '@angular/core';
import {GLOBAL} from './global';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class UploadFilesService{
    public url:string;
    
    constructor(public _http: HttpClient){
        this.url = GLOBAL.url;
    }

    makeFileRequest(url: string, params: Array<string>, files: Array<File>, token:string, name: string){
        var base_url = this.url;
        return new Promise(function (resolve, reject){
            var formData: any = new FormData();

            var xhr = new XMLHttpRequest();

            for(var i = 0; i < files.length; i++){
                formData.append(name, files[i], files[i].name)
            }

            xhr.onreadystatechange = function(){
                if(xhr.readyState == 4){
                    if(xhr.status == 200){
                        resolve(JSON.parse(xhr.response));
                    }else{
                        reject(xhr.response)
                    }

                }
            }

            xhr.open("POST", base_url + url, true)
            xhr.setRequestHeader("Authorization", token)
            xhr.send(formData)            
        })

    }




}