import { Component, OnInit } from '@angular/core';
import { FirebaseConfig } from '@ionic-native/firebase-config/ngx';

@Component({
  selector: 'app-wait',
  templateUrl: './wait.page.html',
  styleUrls: ['../onboard/styles/onboard.page.scss'],
})
export class WaitPage implements OnInit {

  public notificationsEnabled = false;
  public showInviteFriendsOnWaitPage = false;
  public showInviteFriends = false;
  public inviteFriendsWaitPageString = "Invite your friends";

  constructor(private firebaseConfig: FirebaseConfig) { 

    this.firebaseConfig.getBoolean('invite_friends_show_on_wait_page')
    .then((res:boolean) => {this.showInviteFriends = res})
    .catch((error: any) => console.error(error));
/*
    this.firebaseConfig.getNumber("invite_friends_after_runcount")
    .then((res:Number) => {this.inviteFriendsWaitPageString = res})
    .catch((error: any) => console.error(error));
*/
    this.firebaseConfig.getString("invite_friends_wait_page_string")
    .then((res:string) => {this.inviteFriendsWaitPageString = res})
    .catch((error: any) => console.error(error));

  }

  ngOnInit() {
  }

}
