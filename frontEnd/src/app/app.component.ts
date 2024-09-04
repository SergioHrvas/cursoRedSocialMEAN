import { Component, OnInit, DoCheck } from '@angular/core';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [UserService]
})

export class AppComponent implements OnInit, DoCheck{
  public title: string;
  public identity: any;

  constructor(private _userService: UserService){
    this.title = "WESOCIAL"
    this.identity = null;
  }

  ngOnInit(){
    this.identity = this._userService.getIdentity();
    
  }

  ngDoCheck(){
    this.identity = this._userService.getIdentity();
  }
}
