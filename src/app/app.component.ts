import * as firebase from 'firebase/app'
import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor() {
    firebase.initializeApp(environment.firebase);
  }
}
