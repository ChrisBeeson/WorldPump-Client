import * as firebase from 'firebase/app'
import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { Platform } from '@ionic/angular';
import { Plugins } from '@capacitor/core';
import { Router } from '@angular/router';
const { SplashScreen, Storage } = Plugins;
import { FirebaseCrashlytics } from '@ionic-native/firebase-crashlytics/ngx';
import { FirebaseAnalytics } from '@ionic-native/firebase-analytics/ngx';
import { AppManagerService } from './services/app-manager.service';
import { FirebaseConfig } from '@ionic-native/firebase-config/ngx';
import { AuthenticationService } from './services/authentication.service';
import { ProfileService } from './services/profile.service';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  constructor(translate: TranslateService,
    private platform: Platform,
    private router: Router,
    private firebaseCrashlytics: FirebaseCrashlytics,
    private firebaseAnalytics: FirebaseAnalytics,
    private appManagerService: AppManagerService,
    private firebaseConfig: FirebaseConfig,
    private authenticationService: AuthenticationService,
    private profileService: ProfileService
    ) {
   // firebase.initializeApp(environment.firebase);
    this.platform.ready().then(() => {

      firebaseCrashlytics.initialise();
      firebaseCrashlytics.logException('my caught exception');
      firebaseAnalytics.setEnabled(true);
      firebaseAnalytics.logEvent('app_start', {});
      firebaseConfig.fetchAndActivate();
      // Here we will check if the user is already logged in
      // because we don't want to ask users to log in each time they open the app

      this.platform.resume.subscribe(async () => {
        console.log('Resume event detected');
        profileService.updateProfile();
      });

      // navigate new users to onboarding
      appManagerService.runCount().then(count => {
        switch (count) {
          case 0: {
            this.router.navigate(["/onboard"]);
            break;
          }
          default: {
            this.router.navigate(["/onboard"]);
            console.log('run_count found but navigating to onboarding anyway');
          }
        }
        appManagerService.incRunCount();
        SplashScreen.hide();
      });
    });
  }

  ngOnInit() {
  }
}

