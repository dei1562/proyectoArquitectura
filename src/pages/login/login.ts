import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

import { RegisterPage } from '../register/register';
import { LavanderiaPage } from '../lavanderia/lavanderia';
import { ReservasPage } from '../reservas/reservas';
import { AuthService } from '../core/auth.service';
import { UserService } from '../core/user.service';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(
    public navCtrl: NavController,
    public authService: AuthService,
    public formBuilder: FormBuilder,
    public userService: UserService
  ) {}

  ionViewWillLoad(){
    this.loginForm = this.formBuilder.group({
      email: new FormControl(),
      password: new FormControl(),
    });
  }

  tryLogin(value){
    this.authService.doLogin(value)
    .then(res => {

      this.userService.getCurrentUser()
      .then(reservas => {
      });
      
      this.navCtrl.push(ReservasPage);
    }, err => {
      console.log(err);
      this.errorMessage = err.message;
    })
  }

  tryFacebookLogin(){
    this.authService.doFacebookLogin()
    .then((res) => {
      this.navCtrl.push(LavanderiaPage);
    }, (err) => {
      this.errorMessage = err.message;
    });
  }

  tryGoogleLogin(){
    this.authService.doGoogleLogin()
    .then((res) => {
      this.navCtrl.push(LavanderiaPage);
    }, (err) => {
      this.errorMessage = err.message;
    });
  }

  tryTwitterLogin(){
    this.authService.doTwitterLogin()
    .then((res) => {
      this.navCtrl.push(LavanderiaPage);
    }, (err) => {
      this.errorMessage = err.message;
    });
  }

  goRegisterPage(){
    this.navCtrl.push(RegisterPage);
  }

}
