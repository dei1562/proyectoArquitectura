import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

import { AuthService } from '../core/auth.service';

import { LavanderiaPage } from '../lavanderia/lavanderia';



@Component({
  selector: 'page-register',
  templateUrl: 'register.html'
})
export class RegisterPage {

  registerForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    public navCtrl: NavController,
    public authService: AuthService,
    public formBuilder: FormBuilder
  ) {}

  ionViewWillLoad(){
    this.registerForm = this.formBuilder.group({
      email: new FormControl(),
      password: new FormControl()
    });
  }

  tryRegister(value){
    this.authService.doRegister(value)
     .then(res => {
       this.errorMessage = "";
       this.successMessage = "Tu cuenta ha sido creada correctamente. Por favor ingresa al sistema.";
     }, err => {
       this.errorMessage = err.message;
       this.successMessage = "";
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

  goLoginPage(){
    this.navCtrl.pop();
  }

}
