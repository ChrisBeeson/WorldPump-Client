import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreDocument
} from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthenticationService } from '../../services/authentication.service';
import {  BehaviorSubject} from 'rxjs';
import { switchMap, map, take, distinct } from 'rxjs/operators';
import { Globalization } from '@ionic-native/globalization/ngx';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import { Profile } from '../../models/user';
import { RundownService } from '../rundown/services/rundown.service';


@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private userProfile: any;
  private currentUser: firebase.User;
  public authenticatedProfile$: BehaviorSubject<any | null> = new BehaviorSubject<any | null>(null);
  public profileDoc: AngularFirestoreDocument<any>;
  //public authenticatedProfile$: Observable<any | null> = new Observable<any | null>(null);

  constructor(
    private firestore: AngularFirestore,
    private authService: AuthenticationService,
    private globalization: Globalization,
  ) {

    this.authService.loggedIn.pipe(distinct()).subscribe(loggedIn => {
      if (loggedIn){
      this.getUserProfile();
      }
    });
  }

  async getUserProfile() {
    const user: firebase.User = await this.authService.getUser();
    if (user) {
      this.currentUser = user;
      this.userProfile = await this.firestore.collection("profiles").doc(user.uid).get();
      this.authenticatedProfile$.next(this.userProfile); //this.firestore.collection("profiles").doc(user.uid).valueChanges();
      this.profileDoc = this.firestore.collection("profiles").doc(user.uid);
      this.updateProfile();
    }
  }

  public updateProfile() {
    this.updateGlobalization();
  }

  isNotificationsEnabled(): boolean {
    //(this.authenticatedProfile$['token'] !== null) return true else return false;
    return (this.userProfile.notificationToken !== null);
  }

  updateName(fullName: string): Promise<void> {
    return this.profileDoc.update({ fullName });
  }

  async updateEmail(newEmail: string, password: string): Promise<void> {
    const credential: firebase.auth.AuthCredential = firebase.auth.EmailAuthProvider.credential(
      this.currentUser.email,
      password
    );
    try {
      await this.currentUser.reauthenticateWithCredential(credential);
      await this.currentUser.updateEmail(newEmail);
      return this.userProfile.update({ email: newEmail });
    } catch (error) {
      console.error(error);
    }
  }

  async updatePassword( newPassword: string, oldPassword: string): Promise<void> {
    const credential: firebase.auth.AuthCredential = firebase.auth.EmailAuthProvider.credential(
      this.currentUser.email,
      oldPassword
    );
    try {
      await this.currentUser.reauthenticateWithCredential(credential);
      return this.currentUser.updatePassword(newPassword);
    } catch (error) {
      console.error(error);
    }
  }

  public async updatePushNotificationToken(token: String) {
   // const user: firebase.User = await this.authService.getUser();
   // if (user) {
      try {
        await this.profileDoc.set({
          pushNotifications:{
          push_notification_token: token,
          push_notification_updated_at: firebase.firestore.FieldValue.serverTimestamp()
          }
        }, 
        {merge: true});
      } catch {
        console.log('error updating profile');
      }
//    } else {
//      console.exception('[ProfileService] updatePushNotificationToken - User is null');
//    }
  }

  async updateGlobalization() {  
    const currentDatePattern = await this.globalization.getDatePattern( { formatLength: 'short', selector: 'date and time' });
    console.log(currentDatePattern);
    // {"pattern":"d/M/yy, h:mm a","timezone":"AEST","iana_timezone":"Australia/Brisbane","utc_offset":36000,"dst_offset":0}

    const UTC_offset_hours = currentDatePattern.utc_offset/(60*60);
    let prefix = '';
    if (UTC_offset_hours <0) {prefix ='-';}
    if (UTC_offset_hours >0) {prefix ='+';}
    const UTC_offset = prefix+UTC_offset_hours;

    await this.profileDoc.set({
      timezone: {
      utc_offset:UTC_offset,
      timezone:currentDatePattern.timezone,
      iana_timezone:currentDatePattern.iana_timezone,
      dst_offset:currentDatePattern.dst_offset
      },
      last_loggedIn:firebase.firestore.FieldValue.serverTimestamp()
    }, 
    {merge: true});

  }
}
