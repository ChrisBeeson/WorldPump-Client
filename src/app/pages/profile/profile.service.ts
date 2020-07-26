import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreDocument
} from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthenticationService } from '../../services/authentication.service';
import { BehaviorSubject } from 'rxjs';
import { switchMap, map, take, distinct } from 'rxjs/operators';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import { Profile } from '../../models/user';
import { RundownService } from '../rundown/services/rundown.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private _userProfile: any;
  public currentUser: firebase.User;
  public authenticatedProfile$: BehaviorSubject<any | null> = new BehaviorSubject<any | null>(null);
  public profileDoc: AngularFirestoreDocument<any>;
  //public authenticatedProfile$: Observable<any | null> = new Observable<any | null>(null);

  constructor(
    private firestore: AngularFirestore,
    private authService: AuthenticationService,
    private httpClient: HttpClient
  ) {

    this.authService.loggedIn.pipe(distinct()).subscribe(loggedIn => {
      if (loggedIn) {
        this.getUserProfile();
      }
    });
  }

  async getUserProfile() {
    const user: firebase.User = await this.authService.getUser();
    if (user) {
      this.currentUser = user;
      this._userProfile = await this.firestore.collection("profiles").doc(user.uid).get();
      this.authenticatedProfile$.next(this._userProfile); //this.firestore.collection("profiles").doc(user.uid).valueChanges();
      this.profileDoc = this.firestore.collection("profiles").doc(user.uid);
      this.updateProfile();
    }
  }





  public async updateProfile() {
    if (this.profileDoc) {
      try {
        const batch = this.firestore.firestore.batch();
        batch.update(this.profileDoc.ref, { last_login: firebase.firestore.FieldValue.serverTimestamp() })
        await this.updateLocationInfo(batch);
        await batch.commit();
      } catch (error) {
        console.error(error);
      }
    }
  }

  isNotificationsEnabled(): boolean {
    //(this.authenticatedProfile$['token'] !== null) return true else return false;
    return (this._userProfile.notificationToken !== null);
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
      return this._userProfile.update({ email: newEmail });
    } catch (error) {
      console.error(error);
    }
  }

  async updatePassword(newPassword: string, oldPassword: string): Promise<void> {
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
    try {
      await this.profileDoc.set({
        notifications: {
          push_notification_token: token,
          push_notification_updated_at: firebase.firestore.FieldValue.serverTimestamp()
        }
      },
        { merge: true });
    } catch {
      console.log('error updating profile');
    }
  }

  async updateLocationInfo(batch) {

    //todo: At the moment this is updating on every load.

    const ipInfo = await this.getIpData();
    if (!ipInfo) {console.log('IP-API response is null'); return;}
   // if (this.userProfile?.location.query == ipInfo['query']) {return;}

    batch.set(this.profileDoc.ref, {
      location: {
        utc_offset: utcOffsetString(ipInfo['offset']),
        timezone: ipInfo['timezone'],
        continent: ipInfo['continent'],
        country: ipInfo['country'],
        regionName:ipInfo['regionName'],
        city:ipInfo['city'],
        district:ipInfo['district'],
        zip:ipInfo['zip'],
        currency:ipInfo['currency']
      }
    },
    { merge: true });
  }

async getIpData() {
  //https://ip-api.com/docs/api:json
  const endpoint = 'http://ip-api.com/json/?fields=status,message,continent,country,regionName,city,district,zip,timezone,offset,currency,query';
 return await this.httpClient.get(endpoint).toPromise()
 .then(data => {return data})
 .catch (err =>{ console.warn(err)});
}

}

const utcOffsetString = function(seconds){
  const d = new Date();
  const hours = (seconds / (60 * 60));
  let prefix = '';
  if (hours < 0) { prefix = '-'; }
  if (hours > 0) { prefix = '+'; }
  const UTC_offset = prefix + hours;
  return UTC_offset;
}

