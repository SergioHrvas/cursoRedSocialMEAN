import {Component, OnInit, EventEmitter, Input, Output} from '@angular/core';
import { UserService } from '../../services/user.service';
import { PublicationService } from '../../services/publication.service';
import { GLOBAL } from '../../services/global';
import { Publication } from '../../models/publication';
import moment from 'moment';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UploadFilesService } from '../../services/uploadfiles';



@Component({
    selector: 'sidebar',
    templateUrl: './sidebar.component.html',
    providers: [UserService, PublicationService, UploadFilesService]
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
        private _publicationService: PublicationService,
        private _uploadFilesService: UploadFilesService,
        private _route: ActivatedRoute,
        private _router: Router
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
        this._userService.getCounters().subscribe(
            response => {
                localStorage.setItem('stats', JSON.stringify(response))
                this.stats = this._userService.getStats()
            },
            error =>{
                if(typeof window !== 'undefined' && error != null){+
                    console.log(error);
                }
            }
        );
    }

    onSubmit(form: any){
        this._publicationService.addPublication(this.token, this.publication).subscribe(
            response => {
                if(response.publication){
                    this.status = 'success';   
                    form.reset(); 
                    this.stats.counters.publications += 1;
                    this._router.navigate(['/timeline'])   
                    
                    
                    //Subir imagen de usuario
                    this._uploadFilesService.makeFileRequest('upload-image-pub/' + response.publication._id, [], this.filesToUpload, this.token, 'image').
                        then((result: any) => {
                            console.log(result)
                            this.publication.file = result.publication.image;
                            if (typeof localStorage !== 'undefined') {
                                localStorage.setItem('Identity', JSON.stringify(this.publication))
                            }else {
                                // If neither localStorage nor sessionStorage is supported
                                console.log('Web Storage is not supported in this environment.');
                            }
                        }); 

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

    //Output
    @Output() sended = new EventEmitter();

    sendPublication(event: any){
        this.sended.emit({send: 'true'})
    }
    
}