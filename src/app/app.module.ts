import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthGuard } from '@angular/fire/auth-guard';
import { AngularFireMessagingModule } from '@angular/fire/messaging';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from './services/authentication.service';
import { ComponentsModule } from './components/components.module';


@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireMessagingModule,
    ComponentsModule
    

  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    AngularFireAuthGuard,
    AuthenticationService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
