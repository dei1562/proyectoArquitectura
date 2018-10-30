import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, Loading } from 'ionic-angular';

import { LavadoraFormPage } from '../lavadora-form/lavadora-form';

import { FirebaseLavadoraModel } from '../../models/lavadora.model';
import { LavadoraProvider } from '../../providers/lavadora/lavadora';

import { AuthService } from '../core/auth.service';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-lavanderia',
  templateUrl: 'lavanderia.html',
})
export class LavanderiaPage {

  listLavadoras: Array<FirebaseLavadoraModel>;

  pushPage = LavadoraFormPage;

  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController,
              private lavadoraProvider: LavadoraProvider, public authService: AuthService) {    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LavanderiaPage');
  }

  ionViewWillEnter(){
      this.getData();
  }

  getData() {

    let loading = this.loadingCtrl.create({
      content: 'Por favor espere...'
    });

    loading.present();

    this.lavadoraProvider.getLavadoras()
    .then(lavadoras => {

      this.listLavadoras = lavadoras;
      loading.dismiss();
      
    });
  }

  cerrarSession() {
    this.authService.doLogout()
    .then(res => {
      this.navCtrl.push(LoginPage);
    }, err => {
    });
  }
}
