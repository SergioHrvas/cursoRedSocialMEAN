import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import {routing, appRoutingProviders} from './app.routing';
import {FormsModule} from '@angular/forms'
import {HttpClientModule, provideHttpClient, withFetch} from '@angular/common/http'
import { MomentModule } from 'ngx-moment';

import { AppRoutingModule } from './app-routing.module';


//Componentes
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component'
import { RegisterComponent } from './components/register/register.component'
import { HomeComponent } from './components/home/home.component'
import { UserEditComponent } from './components/user-edit/user-edit.component';
import { UsersComponent } from './components/users/users.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { TimelineComponent } from './components/timeline/timeline.component';
import { PublicationsComponent } from './components/publications/publications.component';
import { ProfileComponent } from './components/profile/profile.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    UserEditComponent,
    UsersComponent,
    SidebarComponent,
    TimelineComponent,
    PublicationsComponent,
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    routing,
    MomentModule
  ],
  providers: [
    provideClientHydration(),
    appRoutingProviders,
    provideHttpClient(withFetch()) // Activa `fetch`
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
