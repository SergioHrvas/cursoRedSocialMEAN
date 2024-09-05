import { Component, OnInit, DoCheck } from '@angular/core';
import { UserService } from './services/user.service';

//Importamos el router para la redirección del logout
import {Router, ActivatedRoute, Params} from '@angular/router'
 
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [UserService]
})

export class AppComponent implements OnInit, DoCheck{
  public title: string;
  public identity: any;

  constructor(
    private _userService: UserService,
    private _route: ActivatedRoute,
    private _router: Router
  ){
    this.title = "WESOCIAL"
    this.identity = null;
  }

  ngOnInit(){
    this.identity = this._userService.getIdentity();
    
  }

  ngDoCheck(){
    this.identity = this._userService.getIdentity();
  }

  logout(){
    if (typeof localStorage !== 'undefined') {
      localStorage.clear();
  } else if (typeof sessionStorage !== 'undefined') {
      sessionStorage.clear();
    } else {
      // If neither localStorage nor sessionStorage is supported
      console.log('Web Storage is not supported in this environment.');
    }
    this.identity = null;
    

    //Vamos a la página home
    this._router.navigate(['/']);

  }
}
