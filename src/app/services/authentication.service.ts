import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { first,take } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import 'firebase/firestore';
import { auth } from 'firebase';

@Injectable({
  providedIn: 'root'
})

export class AuthenticationService {
  public userId: string;
  public user$: Observable<firebase.User>; 

  constructor(
    public afAuth: AngularFireAuth,
    private firestore: AngularFirestore
  ) {

    this.user$ = this.afAuth.user.pipe(take(1));
    this.user$.subscribe(x => {
      console.log("User pipe"+ JSON.stringify(x))
    });
  }

  getUser(): Promise<firebase.User> {
    return this.afAuth.authState.pipe(first()).toPromise();
  }

  public async login(
    email: string,
    password: string
  ): Promise<firebase.auth.UserCredential> {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  public async signup(
    email: string,
    password: string
  ): Promise<firebase.auth.UserCredential> {
    try {
      const newUserCredential: firebase.auth.UserCredential = await this.afAuth.createUserWithEmailAndPassword(
        email,
        password
      );
      await this.firestore
        .doc(`profiles/${newUserCredential.user.uid}`)
        .set({ email,
         //todo: signupTimestamp: this.firestore().FieldValue.serverTimestamp();
         });
      return newUserCredential;
    } catch (error) {
      throw error;
    }
  }

  resetPassword(email: string): Promise<void> {
    return this.afAuth.sendPasswordResetEmail(email);
  }

  logout(): Promise<void> {
    return this.afAuth.signOut();
  }

/*
  anonymousLogin() {
    return this.afAuth.auth
      .signInAnonymously()
      .then(credential => {
        this.notify.update('Welcome to Firestarter!!!', 'success');
        return this.updateUserData(credential.user); // if using firestore
      })
      .catch(error => {
        this.handleError(error);
      });
  }
*/

  facebookLogin() {
    const provider = new auth.FacebookAuthProvider();
    return this.oAuthLogin(provider);
  }

  twitterLogin() {
    const provider = new auth.TwitterAuthProvider();
    return this.oAuthLogin(provider);
  }

  private async oAuthLogin(provider: any) {
    try {
      const credential = await this.afAuth.signInWithPopup(provider);
      // this.notify.update('Welcome to Firestarter!!!', 'success');
      return credential.user;
    }
    catch (error) {
      console.error(error);
      return error;
    }
  }


  
}
