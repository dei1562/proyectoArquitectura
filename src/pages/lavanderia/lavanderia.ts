import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { LavadoraFormPage } from '../lavadora-form/lavadora-form';

import { FirebaseLavadoraModel } from '../../models/lavadora.model';
import { LavadoraProvider } from '../../providers/lavadora/lavadora';

@Component({
  selector: 'page-lavanderia',
  templateUrl: 'lavanderia.html',
})
export class LavanderiaPage {

  listLavadoras: Array<any>;

  pushPage = LavadoraFormPage;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private lavadoraProvider: LavadoraProvider) {
  }

  ionViewWillEnter(){
      this.getData();
  }

  getData() {
    this.lavadoraProvider.getLavadoras()
    .then(lavadoras => {
      this.listLavadoras = lavadoras;
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LavanderiaPage');
  }

}
