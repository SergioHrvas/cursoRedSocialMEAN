import { ModuleWithProviders } from "@angular/core";
import {Routes, RouterModule} from "@angular/router";

//Importamos componentes
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { UserEditComponent } from "./components/user-edit/user-edit.component";
import { UsersComponent } from "./components/users/users.component";
import { TimelineComponent } from "./components/timeline/timeline.component";

const appRoutes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'home', component: HomeComponent},
    {path: 'login', component: LoginComponent},
    {path: 'registro', component: RegisterComponent},
    {path: 'mis-datos', component: UserEditComponent},
    { path: 'usuarios', redirectTo: 'usuarios/1', pathMatch: 'full' },
    { path: 'usuarios/:page', component: UsersComponent },
    { path: 'timeline', component: TimelineComponent },

    {path: '**', component: HomeComponent}
    
]

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders<any> = RouterModule.forRoot(appRoutes);