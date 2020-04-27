import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.page.html',
  styleUrls: ['./lobby.page.scss'],
})
export class LobbyPage implements OnInit {

  public expirationDate:Date;

  constructor() { 



  }

  ngOnInit() {
    this.expirationDate = new Date( Date.now() +120*60*1000);
  }

}
