import { ModuleWithProviders } from "@angular/core";
import {Routes, RouterModule} from "@angular/router";

//Importamos componentes
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { UserEditComponent } from "./components/user-edit/user-edit.component";
import { UsersComponent } from "./components/users/users.component";
import { TimelineComponent } from "./components/timeline/timeline.component";
import { ProfileComponent } from "./components/profile/profile.component";
import { FollowingComponent } from "./components/following/following.component";
import { FollowedComponent } from "./components/followed/followed.component";

// Importamos guard
import { UserGuard } from "./services/user.guard";

const appRoutes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'home', component: HomeComponent},
    {path: 'login', component: LoginComponent},
    {path: 'registro', component: RegisterComponent},
    {path: 'mis-datos', component: UserEditComponent, canActivate:[UserGuard]},
    {path: 'usuarios', redirectTo: 'usuarios/1', pathMatch: 'full'},
    {path: 'usuarios/:page', component: UsersComponent, canActivate:[UserGuard]},
    {path: 'timeline', component: TimelineComponent, canActivate:[UserGuard]},
    {path: 'perfil/:id', component: ProfileComponent, canActivate:[UserGuard]},
    {path: "seguidos/:id/:page", component: FollowingComponent, canActivate:[UserGuard]},
    {path: "seguidores/:id/:page", component: FollowedComponent, canActivate:[UserGuard]},

    {path: '**', component: HomeComponent}
    
]

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders<any> = RouterModule.forRoot(appRoutes);