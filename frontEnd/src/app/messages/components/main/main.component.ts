import {Component, OnInit, DoCheck} from '@angular/core';

@Component({
    selector: "messages-main",
    templateUrl: "./main.component.html",
})
export class MainComponent implements OnInit {
    public title: string;

    constructor(){
        this.title = "Mensajes Privados";
    }

    ngOnInit(): void {
        console.log("MainComponent inicializado");
    }


}