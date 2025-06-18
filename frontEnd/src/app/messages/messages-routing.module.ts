import { NgModule } from "@angular/core";
import {Routes, RouterModule} from "@angular/router";

//Importamos componentes
import { MainComponent } from "./components/main/main.component";
import { AddComponent } from "./components/add/add.component";
import { ReceivedComponent } from "./components/received/received.component";
import { SentComponent } from "./components/sent/sent.component";
import { Router } from "express";


const messagesRouters: Routes = [
    { path: 'mensajes', component: MainComponent,
        children: [
            { path : '', redirectTo: "recibidos", pathMatch: 'full' },
            { path : 'enviados', component: SentComponent },
            { path : 'enviados/:page', component: SentComponent },
            { path : 'recibidos', component: ReceivedComponent },
            { path : 'recibidos/:page', component: ReceivedComponent },
            { path : 'nuevo', component: AddComponent },  
        ]
    }
]

@NgModule({
    imports: [
        RouterModule.forChild(messagesRouters)
    ],
    exports: [
        RouterModule
    ]
})
export class MessagesRoutingModule {}