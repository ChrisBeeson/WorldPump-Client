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
import { environment } from 'src/environments/environment';
import { AuthenticationService } from './services/authentication.service';
import { WorkoutPipe } from './pages/workout.pipe';


@NgModule({
  declarations: [AppComponent, WorkoutPipe],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,

    AngularFirestoreModule,


  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    AngularFireAuthGuard,
    AuthenticationService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
