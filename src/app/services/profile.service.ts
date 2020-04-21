import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreDocument
} from '@angular/fire/firestore';
import { AuthenticationService } from './authentication.service';
import { Observable } from 'rxjs';
import { switchMap, map, take } from 'rxjs/operators';

import * as firebase from 'firebase/app';
import 'firebase/auth';
import { Profile } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private userProfile: AngularFirestoreDocument<Profile>;
  private currentUser: firebase.User;
  public authenticatedProfile$: Observable<Profile>; 



  constructor(
    private firestore: AngularFirestore,
    private authService: AuthenticationService
  ) {

    this.authenticatedProfile$ = this.authService.user$.pipe(
      switchMap(user => {
        return <Observable<Profile>>this.firestore.doc('profiles/'+user).valueChanges();
      })

    )

  }

  async getUserProfile(): Promise<Observable<Profile>> {
    const user: firebase.User = await this.authService.getUser();
    this.currentUser = user;
    this.userProfile = this.firestore.doc(`profiles/${user.uid}`);
    return this.userProfile.valueChanges();
  }

  updateName(fullName: string): Promise<void> {
    return this.userProfile.update({ fullName });
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

  async updatePassword(
    newPassword: string,
    oldPassword: string
  ): Promise<void> {
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
}
