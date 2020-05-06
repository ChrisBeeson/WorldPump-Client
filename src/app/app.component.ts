import * as firebase from 'firebase/app'
import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { Platform } from '@ionic/angular';
import { Plugins } from '@capacitor/core';
import { Router } from '@angular/router';
const { SplashScreen, Storage } = Plugins;


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(translate: TranslateService, private platform: Platform, private router: Router) {


    // firebase.initializeApp(environment.firebase);

    this.platform.ready().then(() => {
      // Here we will check if the user is already logged in
      // because we don't want to ask users to log in each time they open the app

      Storage.get({ key: 'run_count' })
        .then(data => {
          let runCount = 1;

          if (data === null) {
            this.router.navigate(["/onboard"]);
          } else {
          
            this.router.navigate(["/onboard"]);
            console.log('run_count found but navigating to onboarding anyway');
          //  this.router.navigate(["/home"]);
            runCount = Number(JSON.parse(data.value))+1;
          }

          Storage.set({
            key: 'run_count',
            value: runCount.toString()
          }).then(() => {
            SplashScreen.hide();
          }
          );
        });
    });
  }

  ngOnInit() {
  }
}

