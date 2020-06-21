import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { AuthenticationService } from '../../services/authentication.service'
import { ProfileService } from '../profile/profile.service'
import { ToastController } from '@ionic/angular';
import { Profile } from 'src/app/models/user';

@Component({
  selector: 'app-login-page',
  templateUrl: './login.page.html',
  styleUrls: [
    './styles/login.page.scss'
  ]
})

export class LoginPage implements OnInit {
  loginForm: FormGroup;
  attemptingLogin = false;


  validation_messages = {
    'email': [
      { type: 'pattern', message: 'Enter a valid email.' }
    ],
    'password': [
      { type: 'minlength', message: 'Password must be at least 6 characters long.' }
    ]
  };

  constructor(
    private authService: AuthenticationService,
    public router: Router,
    public menu: MenuController,
    public toastController: ToastController,
    public profileService: ProfileService,
  ) {

    this.profileService.authenticatedProfile$.subscribe(profile => {
      console.log("[Login Page] has new authenticatedProfile$");
      this.attemptingLogin = false;
      if (profile) {
        this.router.navigate(["/notification-authorisation"]);
      }
    });


    this.loginForm = new FormGroup({
      'email': new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      'password': new FormControl('', Validators.compose([
        Validators.minLength(6),
        Validators.required
      ]))
    });
  }

  ngOnInit(): void {
    this.menu.enable(false);
  }

  async doEmailLogin() {
    this.attemptingLogin = true;

    // first attempt a log in, if that fails attempt a signup.
    console.log('Logging into Account');

    this.authService.login(this.loginForm.value['email'], this.loginForm.value['password'])
      .then(res => this.loginAuthenticated())
      .catch(error => this.authService.signup(this.loginForm.value['email'], this.loginForm.value['password']))
      .then(res => this.loginAuthenticated())
      .catch(error => {
        this.attemptingLogin = false;
        this.toastController.create({
          message: String(error.message),
          duration: 4000
        }).then(toast => {
          toast.present();
        });
      })
  }

  async loginAuthenticated() {
    // now navigate to wait / notification request
    // get profile
    /*
    const token = await this.profileService.isNotificationsEnabled();
    this.attemptingLogin = false;
    if (token) {
      this.router.navigate(["/wait"]);
    } else {
      this.router.navigate(["/notification-authorisation"]);
    }
*/
  }

  goToForgotPassword(): void {
    //todo: forgotpassword
    console.log('redirect to forgot-password page');
  }

  doFacebookLogin(): void {
    console.log('facebook login');
    this.attemptingLogin = true;
    this.authService.facebookLogin();
    /*
      .then(res => {
        this.attemptingLogin = false;
        this.router.navigate(["/home"]);
      })
      .catch(error => {
        this.attemptingLogin = false;
        this.toastController.create({
          message: String(error),
          duration: 2000
        });
      });
      */
  }


  doTwitterLogin(): void {
    this.attemptingLogin = true;
    console.log('twitter login');
    this.authService.twitterLogin()
      .then(res => {
        this.attemptingLogin = false;
        this.router.navigate(["/home"]);
      })
      .catch(error => {
        this.attemptingLogin = false;
        this.toastController.create({
          message: String(error),
          duration: 2000
        });
      });

  }
}
