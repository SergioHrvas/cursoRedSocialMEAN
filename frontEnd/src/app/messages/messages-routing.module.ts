import { NgModule } from "@angular/core";
import {Routes, RouterModule} from "@angular/router";

//Importamos componentes
import { MainComponent } from "./components/main/main.component";
import { AddComponent } from "./components/add/add.component";
import { ReceivedComponent } from "./components/received/received.component";
import { SentComponent } from "./components/sent/sent.component";
import { Router } from "express";

import { UserGuard } from "../services/user.guard";

const messagesRouters: Routes = [
    { path: 'mensajes', component: MainComponent,
        children: [
            { path : '', redirectTo: "recibidos", pathMatch: 'full' },
            { path : 'enviados', component: SentComponent, canActivate:[UserGuard] },
            { path : 'enviados/:page', component: SentComponent, canActivate:[UserGuard] },
            { path : 'recibidos', component: ReceivedComponent, canActivate:[UserGuard] },
            { path : 'recibidos/:page', component: ReceivedComponent, canActivate:[UserGuard] },
            { path : 'nuevo', component: AddComponent, canActivate:[UserGuard] },  
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