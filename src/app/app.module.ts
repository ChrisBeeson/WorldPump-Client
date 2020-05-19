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
import { AngularFireFunctionsModule } from '@angular/fire/functions';
import { environment } from 'src/environments/environment';
import { ComponentsModule } from './components/components.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientModule, HttpClient} from '@angular/common/http';

import { FirebaseAnalytics } from '@ionic-native/firebase-analytics/ngx';
import { FirebaseCrashlytics } from '@ionic-native/firebase-crashlytics/ngx';
import { FirebaseConfig } from '@ionic-native/firebase-config/ngx';
import { FirebaseDynamicLinks } from '@ionic-native/firebase-dynamic-links/ngx';
import { Facebook } from '@ionic-native/facebook/ngx';
import { Globalization } from '@ionic-native/globalization/ngx';

import { OnboardPageModule } from './pages/onboard/onboard.module';
import { LoginPageModule } from './pages/login/login.module';

import { AuthenticationService } from './services/authentication.service';
import { AppManagerService } from './services/app-manager.service';
import { ProfileService } from './services/profile.service';
import { MessagingService } from './services/messaging.service';


@NgModule({
  declarations: [AppComponent,],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
  //  Firebase.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireMessagingModule,
    AngularFireFunctionsModule,
    ComponentsModule,
    HttpClientModule,
    TranslateModule.forRoot({
        loader: {
            provide: TranslateLoader,
            useFactory: HttpLoaderFactory,
            deps: [HttpClient]
        },
        defaultLanguage: 'en'
    }),
    OnboardPageModule,
    LoginPageModule,
  
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    AngularFireAuthGuard,
    FirebaseAnalytics,
    FirebaseCrashlytics,
    FirebaseConfig,
    FirebaseDynamicLinks,
    AppManagerService,
    Facebook,
    AuthenticationService,
    ProfileService,
    MessagingService,
    Globalization

  ],
  bootstrap: [AppComponent]
})
export class AppModule {}


export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}


