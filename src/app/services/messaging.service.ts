import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs'
import { ProfileService } from '../pages/profile/profile.service';
import { FCM } from "capacitor-fcm";
const fcm = new FCM();

import {
  Plugins,
  PushNotification,
  PushNotificationToken,
  PushNotificationActionPerformed
} from '@capacitor/core';

const { PushNotifications } = Plugins;

@Injectable()
export class MessagingService {

  currentMessage = new BehaviorSubject(null);

  constructor(private profileService:ProfileService) {

    PushNotifications.addListener('registration',
      (token: PushNotificationToken) => {
        console.log("PushNotification")
        profileService.updatePushNotificationToken(token.value);
      })

    PushNotifications.addListener('registrationError',
      (error: any) => {
        alert('Error on registration: ' + JSON.stringify(error));
        console.log('Error on registration: ' + JSON.stringify(error));
      }
    );

    // Show us the notification payload if the app is open on our device
    PushNotifications.addListener('pushNotificationReceived',
      (notification: PushNotification) => {
        alert('Push received: ' + JSON.stringify(notification));
        console.log('Push received: ' + JSON.stringify(notification));
      }
    );

    // Method called when tapping on a notification
    PushNotifications.addListener('pushNotificationActionPerformed',
      (notification: PushNotificationActionPerformed) => {
       // alert('Push action performed: ' + JSON.stringify(notification));

       
      }
    );

  }

  public requestPermission(): Promise<boolean> {
    return PushNotifications.requestPermission().then(result => {
      if (result.granted) {
        console.log('Push permission granted');

        // Register with Apple / Google to receive push via APNS/FCM
        PushNotifications.register();
        fcm.subscribeTo({topic:"10"}).then(message => console.log("subscribed to 10 : "+message));
        return Promise.resolve(true);

      } else {
        // Show some error
        console.log('Push permission rejected');
        return Promise.resolve(false);
      }
    });
  }

  public updateSubscribedTopics() {
    
  //  fcm.subscribeTo({ topic: timezone});

  }
}