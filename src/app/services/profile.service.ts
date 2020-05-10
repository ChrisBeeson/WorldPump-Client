import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreDocument
} from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthenticationService } from './authentication.service';
import { Observable, BehaviorSubject, merge } from 'rxjs';
import { switchMap, map, take } from 'rxjs/operators';
import { Globalization } from '@ionic-native/globalization';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import { Profile } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private userProfile: any;
  private currentUser: firebase.User;
  public authenticatedProfile$: BehaviorSubject<any | null> = new BehaviorSubject<any | null>(null);
  private _profileDoc;
  //public authenticatedProfile$: Observable<any | null> = new Observable<any | null>(null);

  constructor(
    private firestore: AngularFirestore,
    private authService: AuthenticationService,
    private afAuth: AngularFireAuth,
    private globalization: Globalization
  ) {

    this.authService.loggedIn.subscribe(loggedIn => {
      console.log("[profileService] LoggedIn changed");
      this.getUserProfile();
    });

  }

  async getUserProfile() {
    const user: firebase.User = await this.authService.getUser();
    if (user) {
      this.currentUser = user;
      this.userProfile = await this.firestore.collection("profiles").doc(user.uid).get();
      this.authenticatedProfile$.next(this.userProfile); //this.firestore.collection("profiles").doc(user.uid).valueChanges();
      this._profileDoc = this.firestore.collection("profiles").doc(user.uid);
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
    return this._profileDoc.update({ fullName });
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
        await this._profileDoc.set({
          push_notification_token: token,
          push_notification_updated_at: firebase.firestore.FieldValue.serverTimestamp()
        });
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
  }
}
