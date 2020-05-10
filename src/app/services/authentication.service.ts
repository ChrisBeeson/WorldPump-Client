import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { first, take } from 'rxjs/operators';
import { Observable, of, BehaviorSubject} from 'rxjs';
import 'firebase/firestore';
import { auth } from 'firebase';
import { FirebaseAnalytics } from '@ionic-native/firebase-analytics/ngx';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
import { Platform } from "@ionic/angular";


@Injectable({
  providedIn: 'root'
})

export class AuthenticationService {

  public userId: string;
  public user$: Observable<firebase.User>;
  public loggedIn: BehaviorSubject<string|null> = new BehaviorSubject<string|null>(null);

  private _processing = false;

  constructor(
    private afAuth: AngularFireAuth,
    private firebaseAnalytics: FirebaseAnalytics,
    private facebook: Facebook,
    private platform: Platform, private zone: NgZone,
  ) {

    this.user$ = this.afAuth.user.pipe(take(1));

    this.afAuth.onAuthStateChanged(firebaseUser => {
      this.zone.run(() => {
        firebaseUser ? this.loggedIn.next(firebaseUser.uid) : this.loggedIn.next(null);
      });
    });


    /*
    this.user$.subscribe(x => {
      console.log("User pipe"+ JSON.stringify(x))
    });
    */
  }

  getUser(): Promise<firebase.User> {
    return this.afAuth.authState.pipe(first()).toPromise();
  }

  public async login(email: string, password: string): Promise<firebase.auth.UserCredential> {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  public async signup(email: string, password: string): Promise<firebase.auth.UserCredential> {
    try {
      const newUserCredential = await this.afAuth.createUserWithEmailAndPassword(email,password);

      if (newUserCredential) {
        this.firebaseAnalytics.logEvent('email_signup', {})
          .then((res: any) => console.log(res))
          .catch((error: any) => console.error(error));
      }

      /*  Create profile - this is done as a cloud function
      await this.firestore
        .doc(`profiles/${newUserCredential.user.uid}`)
        .set({ email,
         //todo: signupTimestamp: this.firestore().FieldValue.serverTimestamp();
         });
      */

      return newUserCredential;
    } catch (error) {
      throw error;
    }
  }

  resetPassword(email: string): Promise<void> {
    return this.afAuth.sendPasswordResetEmail(email);
  }



  async logout(): Promise<void> {
    if (this.platform.is("capacitor")) {
      try {
        await this.facebook.logout(); // Unauth with Facebook
        await this.afAuth.signOut();; // Unauth with Firebase
      } catch (err) {
        console.log(err);
      }
    } else {
      try {
        await this.afAuth.signOut();
      } catch (err) {
        console.log(err);
      }
    }
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
  if (this._processing) return;  this._processing = true;
      // https://www.joshmorony.com/native-web-facebook-authentication-with-firebase-in-ionic/
  
    if (this.platform.is("capacitor")) {
      this.nativeFacebookAuth();
    } else {
      this.browserFacebookAuth();
    }
  }


    async nativeFacebookAuth(): Promise<void> {
      try {
        const response = await this.facebook.login(["public_profile", "email"]);
        console.log("Logging into facebook: "+response);
  
        if (response.authResponse) {
          // User is signed-in Facebook.
         this.afAuth.onAuthStateChanged(firebaseUser => {
          //  this.unsubscribe();

            // Check if we are already signed-in Firebase with the correct user.
            if (!this.isUserEqual(response.authResponse, firebaseUser)) {
              // We are not
              // Build Firebase credential with the Facebook auth token.
              const credential = auth.FacebookAuthProvider.credential(
                response.authResponse.accessToken
              );
              // Sign in with the credential from the Facebook user.
              this.afAuth.signInWithCredential(credential)
              .then (cred => {
                console.log("Signed in to firebase with facebook cred:"+ cred);
             this._processing = false;
              })
              .catch(error => {
                console.log(error);
                this._processing = false;
              });
            } else {
              // User is already signed-in Firebase with the correct user.
              console.log("already signed in to firebase");
              this._processing = false;
            }
          });
        } else {
          // User is signed-out of Facebook.
          console.log("user signed out of facebook, signing out of firebase");
          this.afAuth.signOut();
          this._processing = false;
        }
      } catch (err) {
        console.log(err);
      }
    }
  
    async browserFacebookAuth(): Promise<void> {
      const provider = new auth.FacebookAuthProvider();
      try {
        const result = await this.afAuth.signInWithPopup(provider);
        console.log(result);
      } catch (err) {
        console.log(err);
      }
    }
  
    isUserEqual(facebookAuthResponse, firebaseUser): boolean {

      if (firebaseUser) {
        const providerData = firebaseUser.providerData;
  
        providerData.forEach(data => {
          if (
            data.providerId === auth.FacebookAuthProvider.PROVIDER_ID &&
            data.uid === facebookAuthResponse.userID
          ) {
            return true;
          }
        });
      }
      return false;
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
