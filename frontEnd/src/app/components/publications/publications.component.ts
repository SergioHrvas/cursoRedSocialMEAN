import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { PublicationService } from '../../services/publication.service';
import { UserService } from '../../services/user.service';
import { GLOBAL } from '../../services/global';
import { Publication } from '../../models/publication';
import moment from 'moment';

@Component({
    selector: 'publications',
    templateUrl: './publications.component.html',
    providers: [PublicationService, UserService]
})
export class PublicationsComponent implements OnInit {
    public status: String = ""

    public url: string = GLOBAL.url;

    public publications: any[] = []
    public page;

    public total;
    
    public next_page;
    public prev_page;
    
    public pages;
    public identity;
    public token;


    constructor(
        private _publicationService: PublicationService,
        private _userService: UserService
    ) {
        this.page = 1;
        this.next_page = 2;
        this.prev_page = 1;
        this.total = 0;
        this.pages = 1;
        this.identity = _userService.getIdentity()
        this.token = _userService.getToken()
    }


    ngOnInit(): void {
        
        this.getPublications()
        this.identity = this._userService.getIdentity()
        console.log(this.identity)
    }

    
    getPublications(page: any = 1, adding: boolean = false, user: any = null){
        if(user){
            this._publicationService.getPublicationsUser(user, this.token, page).subscribe(
                response => {
                    if (response && response.publications) {
                        this.total = response.total;
                        this.pages = response.pages;
    
                        if(adding){
                            this.page = page;
                            this.publications = this.publications.concat(response.publications);
    
                            // Scroll hacia abajo
                            $('html, body').animate({scrollTop: $('body').prop('scrollHeight')}, 500);
                        }
                        else{
                            this.publications = response.publications;
                            this.page = 1;
                        }
    
    
    
                    } else {
                        // Asigna un array vacío para evitar errores en la vista
                        this.status='error';
    
                    }
                }
            )
        }
        else{
            this._publicationService.getPublications(this.token, page).subscribe(
                response => {
                    if (response && response.publications) {
                        this.total = response.total;
                        this.pages = response.pages;

                        if(adding){
                            this.page = page;
                            this.publications = this.publications.concat(response.publications);

                            // Scroll hacia abajo
                            $('html, body').animate({scrollTop: $('body').prop('scrollHeight')}, 500);
                        }
                        else{
                            this.publications = response.publications;
                            this.page = 1;
                        }



                    } else {
                        // Asigna un array vacío para evitar errores en la vista
                        this.status='error';

                    }
                },
                error => {
                    var errorMessage = <any>error;
                    
                    if (typeof window !== 'undefined'){
                        console.log(<any>error);
                    }
                    
                    if(errorMessage != null){
                        this.status = 'error';
                    }
                }
            )
        }
    }
    
    public noMore = false;
    viewMore(){
        if(this.publications.length == this.total){
            this.noMore = true;
        }
        else{
            this.page += 1;
            this.getPublications(this.page, true);

        }
    }


    isRecent(date: string | number): boolean{
        let mDate: moment.Moment;

        if (typeof date === 'number' || typeof date === 'string') {
          const dateStr = String(date);
          mDate = dateStr.length === 10 ? moment.unix(Number(date)) : moment(Number(date));
        } else {
          mDate = moment(date);
        }
    
        return moment().diff(mDate, 'days') < 7; // Si es menos de 7 días, retorna true
    }

    formatDate(date: string | number): string {
        let mDate: moment.Moment;
    
        if (typeof date === 'number' || typeof date === 'string') {
          const dateStr = String(date);
          mDate = dateStr.length === 10 ? moment.unix(Number(date)) : moment(Number(date));
        } else {
          mDate = moment(date);
        }
    
        return mDate.locale('es').format('LL'); // Ejemplo: "14 de marzo de 2025"
      }

      @Input() receivedData: any;  // Recibe datos desde TimelineComponent
      @Input() idUser: any;  // Recibe datos desde TimelineComponent

    ngOnChanges(changes: SimpleChanges) {
        if (changes['idUser'] && this.idUser) {
            this.getPublications(1, false, this.idUser); // Se ejecuta cuando cambia idUser
        } else if (changes['receivedData'] && this.receivedData) {
            this.getPublications(); // Se ejecuta cuando cambia receivedData
        }
    }

    deletePublication(id: any){
        this._publicationService.deletePublication(this.token, id).subscribe(
            response => {
                this.publications.forEach((item, index) => {
                    if (item._id == id) {
                        this.publications.splice(index, 1);
                    }
                }
            );
            },
            error => {
                console.log(<any>error);
            }
        );
    }

}