import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-wait',
  templateUrl: './wait.page.html',
  styleUrls: ['../onboard/styles/onboard.page.scss'],
})
export class WaitPage implements OnInit {

  public notificationsEnabled = false;

  constructor() { }

  ngOnInit() {
  }

}
