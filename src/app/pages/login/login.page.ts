import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { AuthenticationService } from '../../services/authentication.service'
import { ProfileService } from '../../services/profile.service'
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
      { type: 'minlength', message: 'Password must be at least 5 characters long.' }
    ]
  };

  constructor(
    private authService: AuthenticationService,
    public router: Router,
    public menu: MenuController,
    public toastController: ToastController,
    public profileService: ProfileService
  ) {

    this.loginForm = new FormGroup({
      'email': new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      'password': new FormControl('', Validators.compose([
        Validators.minLength(5),
        Validators.required
      ]))
    });
  }

  ngOnInit(): void {
    this.menu.enable(false);
  }

  doEmailLogin(): void {
    this.attemptingLogin = true;
    this.router.navigate(["/wait"]);
    //console.log("Log in form:"+JSON.stringify(this.loginForm));
    console.log("login form: "+this.loginForm['email']);
    this.authService.login(this.loginForm['email'], this.loginForm['password'])
    .then(res => {
      if (res) {
        this.attemptingLogin = false;
      
        // do we have a notification Token?
        
        this.router.navigate(["/notification-authorisation"]);

      }
    }).catch( error => {
      this.attemptingLogin = false;
      this.toastController.create({
        message: String(error),
        duration: 2000
      });
    })
  }

  
  goToForgotPassword(): void {
    //todo: forgotpassword
    console.log('redirect to forgot-password page');
  }

  doFacebookLogin(): void {
    console.log('facebook login');
    this.attemptingLogin = true;
    this.authService.facebookLogin()
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


  doTwitterLogin(): void {
    this.attemptingLogin = true;
    console.log('twitter login');
    this.authService.twitterLogin()
    .then(res=> {
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
