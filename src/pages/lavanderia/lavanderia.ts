import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, Loading } from 'ionic-angular';

import { LavadoraFormPage } from '../lavadora-form/lavadora-form';

import { FirebaseLavadoraModel } from '../../models/lavadora.model';
import { LavadoraProvider } from '../../providers/lavadora/lavadora';

@Component({
  selector: 'page-lavanderia',
  templateUrl: 'lavanderia.html',
})
export class LavanderiaPage {

  listLavadoras: Array<FirebaseLavadoraModel>;

  pushPage = LavadoraFormPage;

  // Variable global para manipular el mensaje de carga
  loading: Loading;

  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController,
              private lavadoraProvider: LavadoraProvider) {
    this.loading = this.loadingCtrl.create({
      content: 'Por favor espere...'
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LavanderiaPage');
  }

  ionViewWillEnter(){
      this.getData();
  }

  getData() {

    this.loading.present();

    this.lavadoraProvider.getLavadoras()
    .then(lavadoras => {

      this.listLavadoras = lavadoras;
      this.loading.dismiss();
      
    });
  }
}
