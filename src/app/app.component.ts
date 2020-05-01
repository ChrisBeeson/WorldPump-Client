import * as firebase from 'firebase/app'
import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { Plugins} from '@capacitor/core';
const { SplashScreen } = Plugins;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(translate: TranslateService) {
    firebase.initializeApp(environment.firebase);
  }

  ngOnInit() {
    SplashScreen.hide();

  }
}

